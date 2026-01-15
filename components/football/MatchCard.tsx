'use client';

import { Star, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getDefaultAvatarUrl } from '@/lib/storageService';

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
  location?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
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
  location,
  isFavorite = false,
  onToggleFavorite,
  onEdit,
  onDelete,
}: MatchCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleToggleFavorite = () => {
    setFavorite(!favorite);
    onToggleFavorite?.();
  };

  return (
    <div className="px-4 py-3 border-b border-zinc-700 hover:bg-zinc-800 transition-colors">
      <div className="flex items-center justify-between">
        {/* Status */}
        <div className="w-12 text-xs text-zinc-400 font-medium">
          {status}
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
          <button
            onClick={handleToggleFavorite}
            className="text-zinc-400 hover:text-yellow-400 transition-colors"
          >
            <Star
              className={`w-5 h-5 ${favorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
            />
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-zinc-400 hover:text-blue-400 transition-colors"
              title="Edit match"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-zinc-400 hover:text-red-400 transition-colors"
              title="Delete match"
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
