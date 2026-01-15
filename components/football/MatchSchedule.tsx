'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Radio, Plus } from 'lucide-react';
import MatchCard from './MatchCard';
import MatchForm, { Match } from './MatchForm';

interface MatchScheduleProps {
  selectedTeam: string | null;
  searchQuery: string;
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

// Sample match data
const SAMPLE_MATCHES: Match[] = [
  {
    id: '1',
    homeTeam: 'Wolfsburg',
    awayTeam: 'St. Pauli',
    homeScore: 2,
    awayScore: 1,
    status: 'FT',
    league: 'Bundesliga',
    country: 'Germany',
    matchDate: getDateStringFromToday(-1), // Yesterday
    homeLogo: '🐺',
    awayLogo: '⚫',
  },
  {
    id: '2',
    homeTeam: 'FC Cologne',
    awayTeam: 'Bayern Munich',
    homeScore: 1,
    awayScore: 3,
    status: 'FT',
    league: 'Bundesliga',
    country: 'Germany',
    matchDate: getDateStringFromToday(0), // Today
    homeLogo: '🔴',
    awayLogo: '🔴',
  },
  {
    id: '3',
    homeTeam: 'Hoffenheim',
    awayTeam: 'Borussia M\'gladbach',
    homeScore: 5,
    awayScore: 1,
    status: 'FT',
    league: 'Bundesliga',
    country: 'Germany',
    matchDate: getDateStringFromToday(0), // Today
    homeLogo: '🔵',
    awayLogo: '⚫',
  },
  {
    id: '4',
    homeTeam: 'RB Leipzig',
    awayTeam: 'Freiburg',
    homeScore: 2,
    awayScore: 0,
    status: 'FT',
    league: 'Bundesliga',
    country: 'Germany',
    matchDate: getDateStringFromToday(1), // Tomorrow
    homeLogo: '🔴',
    awayLogo: '🔴',
  },
  {
    id: '5',
    homeTeam: 'Napoli',
    awayTeam: 'Parma',
    homeScore: 0,
    awayScore: 0,
    status: 'FT',
    league: 'Serie A',
    country: 'Italy',
    matchDate: getDateStringFromToday(1), // Tomorrow
    homeLogo: '🔵',
    awayLogo: '⚪',
  },
  {
    id: '6',
    homeTeam: 'Inter',
    awayTeam: 'Lecce',
    homeScore: 1,
    awayScore: 0,
    status: 'FT',
    league: 'Serie A',
    country: 'Italy',
    matchDate: getDateStringFromToday(2), // Day after tomorrow
    homeLogo: '🔵',
    awayLogo: '🟡',
  },
];

export default function MatchSchedule({
  selectedTeam,
  searchQuery,
}: MatchScheduleProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [matches, setMatches] = useState<Match[]>(SAMPLE_MATCHES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // CRUD Operations
  const handleCreateMatch = (matchData: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...matchData,
      id: Date.now().toString(),
    };
    setMatches([...matches, newMatch]);
  };

  const handleUpdateMatch = (matchData: Omit<Match, 'id'>) => {
    if (editingMatch) {
      setMatches(
        matches.map((match) =>
          match.id === editingMatch.id ? { ...matchData, id: editingMatch.id } : match
        )
      );
    }
  };

  const handleDeleteMatch = (matchId: string) => {
    if (confirm('Are you sure you want to delete this match?')) {
      setMatches(matches.filter((match) => match.id !== matchId));
    }
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingMatch(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingMatch(null);
  };

  const handleFormSubmit = (matchData: Omit<Match, 'id'>) => {
    if (formMode === 'create') {
      handleCreateMatch(matchData);
    } else {
      handleUpdateMatch(matchData);
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
      if (match.homeTeam !== selectedTeam && match.awayTeam !== selectedTeam) {
        return false;
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !match.homeTeam.toLowerCase().includes(query) &&
        !match.awayTeam.toLowerCase().includes(query) &&
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
  };

  return (
    <div className="flex-1 bg-zinc-900">
      {/* Date Navigation */}
      <div className="bg-zinc-800 border-b border-zinc-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-red-700 transition-colors">
              <Radio className="w-4 h-4" />
              LIVE
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-zinc-700 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-white font-medium">
                {formatDate(selectedDate)}
              </span>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-zinc-700 rounded transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button className="p-2 hover:bg-zinc-700 rounded transition-colors">
              <Calendar className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Match
          </button>
        </div>
      </div>

      {/* Match Listings */}
      <div className="overflow-y-auto h-[calc(100vh-64px-80px)]">
        {Object.entries(matchesByLeague).map(([league, matches]) => (
          <div key={league} className="mb-6">
            {/* League Header */}
            <div className="px-6 py-3 bg-zinc-800 border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{league}</span>
                <span className="text-zinc-400 text-sm">
                  {matches[0]?.country}
                </span>
              </div>
            </div>

            {/* Matches */}
            <div className="bg-zinc-900">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  matchId={match.id}
                  homeTeam={match.homeTeam}
                  awayTeam={match.awayTeam}
                  homeScore={match.homeScore}
                  awayScore={match.awayScore}
                  status={match.status}
                  homeLogo={match.homeLogo}
                  awayLogo={match.awayLogo}
                  onEdit={() => handleEditMatch(match)}
                  onDelete={() => handleDeleteMatch(match.id)}
                />
              ))}
            </div>
          </div>
        ))}

        {Object.keys(matchesByLeague).length === 0 && (
          <div className="flex items-center justify-center h-64 text-zinc-400">
            No matches found
          </div>
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
    </div>
  );
}
