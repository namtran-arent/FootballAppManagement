'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { getDefaultAvatarUrl } from '@/lib/storageService';
import { isMatchStarted, formatElapsedTime, formatMatchStartTime, formatMatchDate } from '@/lib/matchService';
import { useState, useEffect } from 'react';

interface MatchCardProps {
  matchId: string;
  homeTeam: {
    teamName: string;
    avatarUrl?: string;
  };
  awayTeam: {
    teamName: string;
    avatarUrl?: string;
  };
  homeScore: number;
  awayScore: number;
  status: string;
  matchDate: string;
  matchTime?: string;
  location?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MatchCard({
  matchId,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  matchDate,
  matchTime,
  location,
  onEdit,
  onDelete,
}: MatchCardProps) {
  const matchHasStarted = isMatchStarted(matchDate, matchTime);
  const startTimeDisplay = formatMatchStartTime(matchDate, matchTime);
  const dateDisplay = formatMatchDate(matchDate);
  
  // If status is FT, always show 90 minutes, otherwise calculate elapsed time
  const getElapsedTimeDisplay = (): string | null => {
    if (status === 'FT') {
      return '90\'';
    }
    return formatElapsedTime(matchDate, matchTime);
  };
  
  const [elapsedTime, setElapsedTime] = useState<string | null>(getElapsedTimeDisplay());

  // Update elapsed time every minute (only if not FT)
  useEffect(() => {
    if (status === 'FT') {
      setElapsedTime('90\'');
      return;
    }
    
    if (!matchHasStarted) {
      setElapsedTime(null);
      return;
    }

    const updateElapsedTime = () => {
      setElapsedTime(formatElapsedTime(matchDate, matchTime));
    };

    // Update immediately
    updateElapsedTime();

    // Update every minute
    const interval = setInterval(updateElapsedTime, 60000);

    return () => clearInterval(interval);
  }, [matchDate, matchTime, matchHasStarted, status]);

  return (
    <div className="mx-2 md:mx-4 my-2 glass-card px-3 md:px-4 py-2 md:py-3 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
        {/* Status, Date and Time Info */}
        <div className="w-full sm:w-28 text-xs text-zinc-600 font-medium flex flex-row sm:flex-col gap-2 sm:gap-1">
          <div className="font-semibold text-zinc-900">{status}</div>
          {dateDisplay && (
            <div className="text-zinc-500 text-[11px]">
              {dateDisplay}
            </div>
          )}
          {startTimeDisplay && (
            <div className="text-zinc-600 text-[11px] font-medium">
              🕐 {startTimeDisplay}
            </div>
          )}
          {elapsedTime && (
            <div className="text-green-600 text-[11px] font-semibold">
              ⏱️ {elapsedTime}
            </div>
          )}
        </div>

        {/* Teams and Scores */}
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 w-full sm:w-auto">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <img
              src={homeTeam.avatarUrl || getDefaultAvatarUrl()}
              alt={homeTeam.teamName}
              className="w-6 h-6 md:w-8 md:h-8 object-cover rounded flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultAvatarUrl();
              }}
            />
            <span className="text-zinc-900 font-medium text-sm md:text-base truncate">{homeTeam.teamName}</span>
          </div>
          <div className="flex items-center gap-2 mx-2 md:mx-4">
            <span className="text-zinc-900 font-semibold text-base md:text-lg">{homeScore}</span>
            <span className="text-zinc-500">-</span>
            <span className="text-zinc-900 font-semibold text-base md:text-lg">{awayScore}</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0 justify-end">
            <span className="text-zinc-900 font-medium text-sm md:text-base truncate">{awayTeam.teamName}</span>
            <img
              src={awayTeam.avatarUrl || getDefaultAvatarUrl()}
              alt={awayTeam.teamName}
              className="w-6 h-6 md:w-8 md:h-8 object-cover rounded flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultAvatarUrl();
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onEdit && (
            <button
              onClick={onEdit}
              disabled={matchHasStarted}
              className={`transition-colors ${
                matchHasStarted
                  ? 'text-zinc-400 cursor-not-allowed opacity-50'
                  : 'text-zinc-700 hover:text-blue-600'
              }`}
              title={matchHasStarted ? 'Match has started. Only score can be updated.' : 'Edit match'}
            >
              <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={matchHasStarted}
              className={`transition-colors ${
                matchHasStarted
                  ? 'text-zinc-400 cursor-not-allowed opacity-50'
                  : 'text-zinc-700 hover:text-red-600'
              }`}
              title={matchHasStarted ? 'Cannot delete match that has started' : 'Delete match'}
            >
              <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
        </div>
      </div>
      {/* Location */}
      {location && (
        <div className="mt-2 text-xs text-zinc-600 flex items-center gap-1">
          <span>📍</span>
          <span className="break-words">{location}</span>
        </div>
      )}
    </div>
  );
}
