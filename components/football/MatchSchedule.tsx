'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ChevronLeft, ChevronRight, Calendar, Radio, Plus } from 'lucide-react';
import MatchCard from './MatchCard';
import MatchForm from './MatchForm';
import { Match, getAllMatches, getMatchesByDate, createMatch, updateMatch, deleteMatch, isMatchStarted, shouldAutoSetFullTime, formatElapsedTime, formatMatchStartTime } from '@/lib/matchService';
import { getSupabaseUserId } from '@/lib/userService';
import Toast from '@/components/ui/Toast';

interface MatchScheduleProps {
  selectedTeam: string | null;
  searchQuery: string;
  onSearchChange?: (query: string) => void;
}

// Helper function to get date string in YYYY-MM-DD format
const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to get date string for n days from today
const getDateStringFromToday = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return getDateString(date);
};

export default function MatchSchedule({
  selectedTeam,
  searchQuery,
  onSearchChange,
}: MatchScheduleProps) {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [matches, setMatches] = useState<Match[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  // Load matches when component mounts or date changes
  useEffect(() => {
    loadMatches();
  }, [selectedDate]);

  const loadMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const selectedDateString = getDateString(selectedDate);
      const data = await getMatchesByDate(selectedDateString);
      setMatches(data);
      
      // Auto-update match status to FT if 105 minutes have elapsed
      const matchesToUpdate: { id: string }[] = [];
      data.forEach((match) => {
        if (shouldAutoSetFullTime(match.matchDate, match.matchTime, match.status)) {
          matchesToUpdate.push({ id: match.id });
        }
      });
      
      if (matchesToUpdate.length > 0) {
        try {
          // Update all matches that need status change
          await Promise.all(
            matchesToUpdate.map(({ id }) =>
              updateMatch(id, { status: 'FT' })
            )
          );
          // Reload matches after update
          const updatedData = await getMatchesByDate(selectedDateString);
          setMatches(updatedData);
        } catch (err) {
          console.error('Error auto-updating match statuses:', err);
        }
      }
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Failed to load matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Auto-check and update status every minute for live matches
  useEffect(() => {
    if (matches.length === 0) return;
    
    const checkAndUpdateStatuses = async () => {
      const matchesToUpdate: { id: string }[] = [];
      
      // Get current matches from state at the time of check
      const currentMatches = matches;
      
      currentMatches.forEach((match) => {
        if (shouldAutoSetFullTime(match.matchDate, match.matchTime, match.status)) {
          matchesToUpdate.push({ id: match.id });
        }
      });
      
      if (matchesToUpdate.length > 0) {
        try {
          // Update all matches that need status change
          await Promise.all(
            matchesToUpdate.map(({ id }) =>
              updateMatch(id, { status: 'FT' })
            )
          );
          // Reload matches after update
          const selectedDateString = getDateString(selectedDate);
          const updatedData = await getMatchesByDate(selectedDateString);
          setMatches(updatedData);
        } catch (err) {
          console.error('Error auto-updating match statuses:', err);
        }
      }
    };
    
    // Check every minute
    const interval = setInterval(checkAndUpdateStatuses, 60000);
    
    return () => clearInterval(interval);
  }, [matches.length, selectedDate]); // Only depend on length to avoid infinite loop

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // CRUD Operations
  const handleCreateMatch = async (matchData: Omit<Match, 'id' | 'homeTeam' | 'awayTeam' | 'createdAt' | 'updatedAt'>) => {
    setError(null);
    try {
      // Get Supabase user ID from provider ID
      const supabaseUserId = await getSupabaseUserId(session?.user?.id);
      
      const newMatch = await createMatch({
        ...matchData,
        userId: supabaseUserId || undefined,
      });
      if (newMatch) {
        // Reload matches to get updated list
        await loadMatches();
        showToast('Match created successfully!', 'success');
        return true;
      } else {
        const errorMsg = 'Failed to create match. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
        return false;
      }
    } catch (err) {
      console.error('Error creating match:', err);
      const errorMsg = 'Failed to create match. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      return false;
    }
  };

  const handleUpdateMatch = async (matchData: Omit<Match, 'id' | 'homeTeam' | 'awayTeam' | 'createdAt' | 'updatedAt'>) => {
    if (!editingMatch) return false;
    
    setError(null);
    try {
      const updatedMatch = await updateMatch(editingMatch.id, matchData);
      if (updatedMatch) {
        // Reload matches to get updated list
        await loadMatches();
        showToast('Match updated successfully!', 'success');
        return true;
      } else {
        const errorMsg = 'Failed to update match. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
        return false;
      }
    } catch (err) {
      console.error('Error updating match:', err);
      const errorMsg = 'Failed to update match. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      return false;
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match?')) {
      return;
    }

    setError(null);
    try {
      const success = await deleteMatch(matchId);
      if (success) {
        // Reload matches to get updated list
        await loadMatches();
      } else {
        setError('Failed to delete match. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting match:', err);
      setError('Failed to delete match. Please try again.');
    }
  };

  const handleEditMatch = (match: Match) => {
    const matchStarted = isMatchStarted(match.matchDate, match.matchTime);
    if (matchStarted) {
      // If match has started, still allow editing but only for score
      setEditingMatch(match);
      setFormMode('edit');
      setIsFormOpen(true);
    } else {
      setEditingMatch(match);
      setFormMode('edit');
      setIsFormOpen(true);
    }
  };

  const handleCreateClick = () => {
    setEditingMatch(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingMatch(null);
    setError(null);
  };

  const handleFormSubmit = async (matchData: Omit<Match, 'id' | 'homeTeam' | 'awayTeam' | 'createdAt' | 'updatedAt'>) => {
    let success = false;
    if (formMode === 'create') {
      success = await handleCreateMatch(matchData);
    } else {
      success = await handleUpdateMatch(matchData);
    }
    
    if (success) {
      handleFormClose();
    }
  };

  // Get selected date string in YYYY-MM-DD format
  const selectedDateString = getDateString(selectedDate);

  // Filter matches based on selections
  const filteredMatches = matches.filter((match) => {
    // Filter by date
    if (match.matchDate !== selectedDateString) {
      return false;
    }

    // Filter by team
    if (selectedTeam) {
      if (match.homeTeam.teamName !== selectedTeam && match.awayTeam.teamName !== selectedTeam) {
        return false;
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !match.homeTeam.teamName.toLowerCase().includes(query) &&
        !match.awayTeam.teamName.toLowerCase().includes(query) &&
        !match.league.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  });

  // Group matches by league
  const matchesByLeague = filteredMatches.reduce((acc, match) => {
    if (!acc[match.league]) {
      acc[match.league] = [];
    }
    acc[match.league].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
    // Matches will be reloaded automatically via useEffect
  };

  return (
    <div className="flex-1">
      {/* Date Navigation */}
      <div className="glass-card mx-4 my-4 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 btn-gradient rounded-lg font-medium flex items-center gap-2">
              <Radio className="w-4 h-4" />
              LIVE
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-zinc-200 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-zinc-700" />
              </button>
              <span className="px-4 py-2 text-zinc-900 font-medium">
                {formatDate(selectedDate)}
              </span>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-zinc-200 rounded transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-zinc-700" />
              </button>
            </div>
            <button className="p-2 hover:bg-zinc-200 rounded transition-colors">
              <Calendar className="w-5 h-5 text-zinc-600" />
            </button>
          </div>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 btn-gradient rounded-lg font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Match
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Match Listings */}
      <div className="overflow-y-auto h-[calc(100vh-64px-80px)]">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-zinc-600">
            Loading matches...
          </div>
        ) : (
          <>
            {Object.entries(matchesByLeague).map(([league, matches]) => (
              <div key={league} className="mb-4">
                {/* League Header */}
                <div className="px-6 py-3 glass-card mx-4 my-2">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-900 font-semibold">{league}</span>
                    <span className="text-zinc-600 text-sm">
                      {matches[0]?.country}
                    </span>
                  </div>
                </div>

                {/* Matches */}
                <div className="space-y-2 px-4 py-2">
                  {matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      matchId={match.id}
                      homeTeam={match.homeTeam}
                      awayTeam={match.awayTeam}
                      homeScore={match.homeScore}
                      awayScore={match.awayScore}
                      status={match.status}
                      matchDate={match.matchDate}
                      matchTime={match.matchTime}
                      location={match.location}
                      onEdit={() => handleEditMatch(match)}
                      onDelete={() => handleDeleteMatch(match.id)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(matchesByLeague).length === 0 && !loading && (
              <div className="flex items-center justify-center h-64 text-zinc-600">
                No matches found
              </div>
            )}
          </>
        )}
      </div>

      {/* Match Form Modal */}
      <MatchForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        match={editingMatch}
        mode={formMode}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
