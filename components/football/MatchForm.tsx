'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Match } from '@/lib/matchService';
import { getAllTeams } from '@/lib/teamService';
import { Team } from '@/lib/teamService';

export type { Match };

interface MatchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (match: Omit<Match, 'id' | 'homeTeam' | 'awayTeam' | 'createdAt' | 'updatedAt'>) => void;
  match?: Match | null;
  mode: 'create' | 'edit';
}

export default function MatchForm({
  isOpen,
  onClose,
  onSubmit,
  match,
  mode,
}: MatchFormProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [formData, setFormData] = useState({
    homeTeamId: '',
    awayTeamId: '',
    homeScore: 0,
    awayScore: 0,
    status: 'FT',
    league: '',
    country: '',
    matchDate: new Date().toISOString().split('T')[0],
    location: '',
  });

  useEffect(() => {
    const loadTeams = async () => {
      setLoadingTeams(true);
      try {
        const data = await getAllTeams();
        setTeams(data);
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setLoadingTeams(false);
      }
    };

    if (isOpen) {
      loadTeams();
    }
  }, [isOpen]);

  useEffect(() => {
    if (match && mode === 'edit') {
      setFormData({
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        status: match.status,
        league: match.league,
        country: match.country,
        matchDate: match.matchDate || new Date().toISOString().split('T')[0],
        location: match.location || '',
      });
    } else {
      setFormData({
        homeTeamId: '',
        awayTeamId: '',
        homeScore: 0,
        awayScore: 0,
        status: 'FT',
        league: '',
        country: '',
        matchDate: new Date().toISOString().split('T')[0],
        location: '',
      });
    }
  }, [match, mode, isOpen]);

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
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {mode === 'create' ? 'Create New Match' : 'Edit Match'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Home Team */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Home Team
              </label>
              <select
                value={formData.homeTeamId}
                onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                required
                disabled={loadingTeams}
              >
                <option value="">Select home team</option>
                {teams
                  .filter((team) => team.id !== formData.awayTeamId)
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.teamName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Away Team */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Away Team
              </label>
              <select
                value={formData.awayTeamId}
                onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                required
                disabled={loadingTeams}
              >
                <option value="">Select away team</option>
                {teams
                  .filter((team) => team.id !== formData.homeTeamId)
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.teamName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Home Score */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Home Score
              </label>
              <input
                type="number"
                min="0"
                value={formData.homeScore}
                onChange={(e) => setFormData({ ...formData, homeScore: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors"
                required
              />
            </div>

            {/* Away Score */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Away Score
              </label>
              <input
                type="number"
                min="0"
                value={formData.awayScore}
                onChange={(e) => setFormData({ ...formData, awayScore: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* League */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                League
              </label>
              <input
                type="text"
                value={formData.league}
                onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="e.g., Premier League"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="e.g., England"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Match Date */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Match Date
              </label>
              <input
                type="date"
                value={formData.matchDate}
                onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors"
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
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                required
              >
                <option value="FT">Full Time (FT)</option>
                <option value="LIVE">Live</option>
                <option value="HT">Half Time (HT)</option>
                <option value="NS">Not Started (NS)</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Địa điểm (Location)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="e.g., Old Trafford, Manchester"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
            >
              {mode === 'create' ? 'Create Match' : 'Update Match'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-700 text-white font-bold rounded-lg hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
