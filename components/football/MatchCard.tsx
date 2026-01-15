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
    <div className="px-4 py-3 border-b border-zinc-700 hover:bg-zinc-800 transition-colors">
      <div className="flex items-center justify-between">
        {/* Status, Date and Time Info */}
        <div className="w-28 text-xs text-zinc-400 font-medium flex flex-col gap-1">
          <div className="font-semibold text-white">{status}</div>
          {dateDisplay && (
            <div className="text-zinc-400 text-[11px]">
              {dateDisplay}
            </div>
          )}
          {startTimeDisplay && (
            <div className="text-zinc-300 text-[11px] font-medium">
              🕐 {startTimeDisplay}
            </div>
          )}
          {elapsedTime && (
            <div className="text-green-400 text-[11px] font-semibold">
              ⏱️ {elapsedTime}
            </div>
          )}
        </div>

        {/* Teams and Scores */}
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <img
              src={homeTeam.avatarUrl || getDefaultAvatarUrl()}
              alt={homeTeam.teamName}
              className="w-8 h-8 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultAvatarUrl();
              }}
            />
            <span className="text-white font-medium">{homeTeam.teamName}</span>
          </div>
          <div className="flex items-center gap-2 mx-4">
            <span className="text-white font-semibold text-lg">{homeScore}</span>
            <span className="text-zinc-500">-</span>
            <span className="text-white font-semibold text-lg">{awayScore}</span>
          </div>
          <div className="flex items-center gap-3 flex-1 justify-end">
            <span className="text-white font-medium">{awayTeam.teamName}</span>
            <img
              src={awayTeam.avatarUrl || getDefaultAvatarUrl()}
              alt={awayTeam.teamName}
              className="w-8 h-8 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultAvatarUrl();
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="ml-4 flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              disabled={matchHasStarted}
              className={`transition-colors ${
                matchHasStarted
                  ? 'text-zinc-600 cursor-not-allowed opacity-50'
                  : 'text-zinc-400 hover:text-blue-400'
              }`}
              title={matchHasStarted ? 'Match has started. Only score can be updated.' : 'Edit match'}
            >
              <Edit2 className="w-5 h-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={matchHasStarted}
              className={`transition-colors ${
                matchHasStarted
                  ? 'text-zinc-600 cursor-not-allowed opacity-50'
                  : 'text-zinc-400 hover:text-red-400'
              }`}
              title={matchHasStarted ? 'Cannot delete match that has started' : 'Delete match'}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      {/* Location */}
      {location && (
        <div className="mt-2 ml-16 text-xs text-zinc-400 flex items-center gap-1">
          <span>📍</span>
          <span>{location}</span>
        </div>
      )}
    </div>
  );
}
