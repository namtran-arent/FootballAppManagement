'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Loan } from '@/lib/loanService';
import { getAllTeams } from '@/lib/teamService';
import { getAllMatches } from '@/lib/matchService';
import { Team } from '@/lib/teamService';
import { Match } from '@/lib/matchService';

interface LoanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (loan: Omit<Loan, 'id' | 'team' | 'match' | 'createdAt' | 'updatedAt'>) => void;
  loan?: Loan | null;
  mode: 'create' | 'edit';
}

export default function LoanForm({
  isOpen,
  onClose,
  onSubmit,
  loan,
  mode,
}: LoanFormProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [formData, setFormData] = useState({
    teamId: '',
    matchId: '',
    numberOfPlayers: 1,
    status: 'pending' as Loan['status'],
  });

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [teamsData, matchesData] = await Promise.all([
          getAllTeams(),
          getAllMatches(),
        ]);
        setTeams(teamsData);
        setMatches(matchesData);
        
        // Initially filter to show only upcoming matches
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const upcomingMatches = matchesData.filter((match) => {
          const matchDate = new Date(match.matchDate);
          const matchDateOnly = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate());
          return matchDateOnly >= today && match.status === 'NS';
        });
        setFilteredMatches(upcomingMatches);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Filter matches when team is selected
  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Filter matches that haven't started yet (matchDate >= today and status is 'NS')
    const upcomingMatches = matches.filter((match) => {
      const matchDate = new Date(match.matchDate);
      const matchDateOnly = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate());
      
      // Match hasn't started if:
      // 1. Match date is in the future, OR
      // 2. Match date is today and status is 'NS' (Not Started)
      return matchDateOnly >= today && match.status === 'NS';
    });

    if (formData.teamId) {
      // Filter matches where the selected team is either home or away team AND match hasn't started
      const filtered = upcomingMatches.filter(
        (match) =>
          match.homeTeam.id === formData.teamId ||
          match.awayTeam.id === formData.teamId
      );
      setFilteredMatches(filtered);

      // Reset matchId if current selection is not in filtered list
      if (formData.matchId) {
        const isCurrentMatchValid = filtered.some(
          (match) => match.id === formData.matchId
        );
        if (!isCurrentMatchValid) {
          setFormData((prev) => ({ ...prev, matchId: '' }));
        }
      }
    } else {
      // If no team selected, show all upcoming matches
      setFilteredMatches(upcomingMatches);
      if (formData.matchId) {
        setFormData((prev) => ({ ...prev, matchId: '' }));
      }
    }
  }, [formData.teamId, matches]);

  useEffect(() => {
    if (loan && mode === 'edit') {
      setFormData({
        teamId: loan.teamId,
        matchId: loan.matchId,
        numberOfPlayers: loan.numberOfPlayers,
        status: loan.status,
      });
    } else {
      setFormData({
        teamId: '',
        matchId: '',
        numberOfPlayers: 1,
        status: 'pending',
      });
    }
  }, [loan, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl w-full max-w-2xl p-8 z-10 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">
            {mode === 'create' ? 'Create New Loan' : 'Edit Loan'}
          </h2>
          <p className="text-zinc-600">
            {mode === 'create'
              ? 'Add a new player loan agreement'
              : 'Update loan information'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {loadingData ? (
            <div className="text-center py-8 text-zinc-600">Loading teams and matches...</div>
          ) : (
            <>
              {/* Team Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Team
                </label>
                <select
                  value={formData.teamId}
                  onChange={(e) =>
                    setFormData({ ...formData, teamId: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-green-500 transition-colors"
                  required
                >
                  <option value="">Select team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.teamName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Match Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Match
                </label>
                <select
                  value={formData.matchId}
                  onChange={(e) =>
                    setFormData({ ...formData, matchId: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-green-500 transition-colors"
                  required
                  disabled={!formData.teamId}
                >
                  <option value="">
                    {formData.teamId ? 'Select match' : 'Select team first'}
                  </option>
                  {filteredMatches.map((match) => (
                    <option key={match.id} value={match.id}>
                      {match.homeTeam.teamName} vs {match.awayTeam.teamName} - {new Date(match.matchDate).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                {formData.matchId && (
                  <p className="mt-2 text-xs text-zinc-600">
                    {(() => {
                      const selectedMatch = filteredMatches.find(m => m.id === formData.matchId);
                      return selectedMatch
                        ? `${selectedMatch.homeTeam.teamName} vs ${selectedMatch.awayTeam.teamName} on ${new Date(selectedMatch.matchDate).toLocaleDateString()}${selectedMatch.location ? ` at ${selectedMatch.location}` : ''}`
                        : '';
                    })()}
                  </p>
                )}
                {formData.teamId && filteredMatches.length === 0 && (
                  <p className="mt-2 text-xs text-yellow-700">
                    No upcoming matches found for this team.
                  </p>
                )}
                {!formData.teamId && filteredMatches.length === 0 && (
                  <p className="mt-2 text-xs text-yellow-700">
                    No upcoming matches available.
                  </p>
                )}
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Number of Players */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Number of Players Needed
              </label>
              <input
                type="number"
                min="1"
                value={formData.numberOfPlayers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfPlayers: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Status
              </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Loan['status'],
                    })
                  }
                  className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-green-500 transition-colors"
                  required
                >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 btn-gradient font-bold rounded-lg"
            >
              {mode === 'create' ? 'Create Loan' : 'Update Loan'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-200 text-zinc-900 font-bold rounded-lg hover:bg-zinc-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
