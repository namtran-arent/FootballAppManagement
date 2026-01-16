'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Match, isMatchStarted } from '@/lib/matchService';
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
    status: 'NS',
    league: '',
    country: '',
    matchDate: new Date().toISOString().split('T')[0],
    matchTime: '00:00',
    location: '',
  });
  
  const [isMatchStartedState, setIsMatchStartedState] = useState(false);

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
      const matchStarted = isMatchStarted(match.matchDate, match.matchTime);
      setIsMatchStartedState(matchStarted);
      
      setFormData({
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        status: match.status,
        league: match.league,
        country: match.country,
        matchDate: match.matchDate || new Date().toISOString().split('T')[0],
        matchTime: match.matchTime || '00:00',
        location: match.location || '',
      });
    } else {
      setIsMatchStartedState(false);
      setFormData({
        homeTeamId: '',
        awayTeamId: '',
        homeScore: 0,
        awayScore: 0,
        status: 'NS',
        league: '',
        country: '',
        matchDate: new Date().toISOString().split('T')[0],
        matchTime: '00:00',
        location: '',
      });
    }
  }, [match, mode, isOpen]);
  
  // Update isMatchStartedState when formData changes
  useEffect(() => {
    if (mode === 'edit' && formData.matchDate) {
      const matchStarted = isMatchStarted(formData.matchDate, formData.matchTime);
      setIsMatchStartedState(matchStarted);
    }
  }, [formData.matchDate, formData.matchTime, mode]);

  if (!isOpen) return null;

  // Get current date and time for validation
  const getCurrentDateTime = () => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return { currentDate, currentTime };
  };

  // Validate date and time for create mode
  const validateDateTime = (): boolean => {
    if (mode === 'create') {
      const { currentDate, currentTime } = getCurrentDateTime();
      
      // Check if date is in the past
      if (formData.matchDate < currentDate) {
        alert('Match date cannot be in the past. Please select today or a future date.');
        return false;
      }
      
      // If date is today, check if time is in the past
      if (formData.matchDate === currentDate && formData.matchTime < currentTime) {
        alert('Match time cannot be in the past. Please select a future time.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate date and time for create mode
    if (!validateDateTime()) {
      return;
    }
    
    // If match has started, only allow updating score and status
    if (isMatchStartedState && mode === 'edit') {
      onSubmit({
        homeTeamId: match?.homeTeamId || '',
        awayTeamId: match?.awayTeamId || '',
        homeScore: formData.homeScore,
        awayScore: formData.awayScore,
        status: formData.status,
        league: match?.league || '',
        country: match?.country || '',
        matchDate: match?.matchDate || '',
        matchTime: match?.matchTime,
        location: match?.location,
      });
    } else {
      // Ensure status is NS for create mode
      const submitData = {
        ...formData,
        status: mode === 'create' ? 'NS' : formData.status,
      };
      onSubmit(submitData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative glass-card w-full max-w-2xl p-4 md:p-6 lg:p-8 z-10 max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-zinc-600 hover:text-zinc-900 transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Header */}
        <div className="mb-4 md:mb-6 pr-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-zinc-900 mb-1 md:mb-2">
            {mode === 'create' ? 'Create New Match' : 'Update Match Information'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          {!isMatchStartedState && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {/* Home Team */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
                  Home Team
                </label>
                <select
                  value={formData.homeTeamId}
                  onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
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
                <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
                  Away Team
                </label>
                <select
                  value={formData.awayTeamId}
                  onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
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
          )}

          {isMatchStartedState && mode === 'edit' && (
            <div className="p-3 md:p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-700 text-xs md:text-sm mb-3 md:mb-4">
              Match has started. You can only update the score and status.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {/* Home Score */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
                Home Score
              </label>
              <input
                type="number"
                min="0"
                value={formData.homeScore}
                onChange={(e) => setFormData({ ...formData, homeScore: parseInt(e.target.value) || 0 })}
                className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
                required
              />
            </div>

            {/* Away Score */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
                Away Score
              </label>
              <input
                type="number"
                min="0"
                value={formData.awayScore}
                onChange={(e) => setFormData({ ...formData, awayScore: parseInt(e.target.value) || 0 })}
                className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
                required
              />
            </div>
          </div>

          {!isMatchStartedState && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {/* League */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
                  League
                </label>
                <input
                  type="text"
                  value={formData.league}
                  onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
                  placeholder="e.g., Premier League"
                  required
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
                  placeholder="e.g., England"
                  required
                />
              </div>
            </div>
          )}

          {!isMatchStartedState && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {/* Match Date */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
                  Match Date
                </label>
                <input
                  type="date"
                  value={formData.matchDate}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const { currentDate } = getCurrentDateTime();
                    
                    // If creating and selected date is today, ensure time is not in past
                    if (mode === 'create' && selectedDate === currentDate) {
                      const { currentTime } = getCurrentDateTime();
                      if (formData.matchTime < currentTime) {
                        // Reset time to current time if date is today
                        setFormData({ 
                          ...formData, 
                          matchDate: selectedDate,
                          matchTime: currentTime 
                        });
                        return;
                      }
                    }
                    
                    setFormData({ ...formData, matchDate: selectedDate });
                  }}
                  min={mode === 'create' ? getCurrentDateTime().currentDate : undefined}
                  className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
                  required
                />
              </div>

              {/* Match Time */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
                  Match Start Time
                </label>
                <input
                  type="time"
                  value={formData.matchTime}
                  onChange={(e) => {
                    const selectedTime = e.target.value;
                    const { currentDate, currentTime } = getCurrentDateTime();
                    
                    // If creating and date is today, ensure time is not in past
                    if (mode === 'create' && formData.matchDate === currentDate && selectedTime < currentTime) {
                      alert('Match time cannot be in the past. Please select a future time.');
                      return;
                    }
                    
                    setFormData({ ...formData, matchTime: selectedTime });
                  }}
                  min={mode === 'create' && formData.matchDate === getCurrentDateTime().currentDate ? getCurrentDateTime().currentTime : undefined}
                  className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
                  required
                />
              </div>
            </div>
          )}

          {/* Status - Always visible, can be updated even if match started */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              disabled={mode === 'create'}
              className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              required
            >
              <option value="NS">Not Started (NS)</option>
              <option value="LIVE">Live</option>
              <option value="HT">Half Time (HT)</option>
              <option value="FT">Full Time (FT)</option>
            </select>
            {mode === 'create' && (
              <p className="mt-1 text-xs text-zinc-600">
                Status is automatically set to "Not Started" for new matches
              </p>
            )}
          </div>

          {!isMatchStartedState && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
                placeholder="e.g., Old Trafford, Manchester"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-3 md:pt-4">
            <button
              type="submit"
              className="flex-1 py-2 md:py-3 btn-gradient font-bold rounded-lg text-sm md:text-base"
            >
              {mode === 'create' ? 'Create Match' : 'Update Match'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 md:py-3 bg-zinc-200 text-zinc-900 font-bold rounded-lg hover:bg-zinc-300 transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
