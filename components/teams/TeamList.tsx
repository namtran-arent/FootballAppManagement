'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { Team } from '@/lib/teamService';
import { getDefaultAvatarUrl } from '@/lib/storageService';

interface TeamListProps {
  teams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (teamId: string) => void;
}

export default function TeamList({ teams, onEdit, onDelete }: TeamListProps) {
  if (teams.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-zinc-600">No teams found. Create your first team!</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto -mx-2 md:mx-0">
        <table className="w-full border-collapse min-w-[600px]">
          <thead className="bg-zinc-100/50 border-b border-zinc-200/50">
            <tr>
              <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-zinc-700">
                Avatar
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-zinc-700">
                Team Name
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-zinc-700 hidden sm:table-cell">
                Captain Name
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-zinc-700 hidden md:table-cell">
                Captain Phone
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-zinc-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team.id}
                className="transition-all duration-300 hover:bg-zinc-50/50"
              >
                <td className="px-3 md:px-6 py-3 md:py-4">
                  <div className="flex items-center">
                    <img
                      src={team.avatarUrl || getDefaultAvatarUrl()}
                      alt={team.teamName}
                      className="w-8 h-8 md:w-12 md:h-12 object-cover rounded-lg border border-zinc-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getDefaultAvatarUrl();
                      }}
                    />
                  </div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                  <div className="text-zinc-900 font-medium text-sm md:text-base">
                    {team.teamName}
                  </div>
                  <div className="text-zinc-600 text-xs sm:hidden mt-1">
                    {team.captainName} • {team.captainPhone}
                  </div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 text-center hidden sm:table-cell">
                  <div className="text-zinc-700 text-sm md:text-base">{team.captainName}</div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 text-center hidden md:table-cell">
                  <div className="text-zinc-700 text-sm md:text-base">{team.captainPhone}</div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(team)}
                      className="text-zinc-600 hover:text-blue-600 transition-colors"
                      title="Edit team"
                    >
                      <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(team.id)}
                      className="text-zinc-600 hover:text-red-600 transition-colors"
                      title="Delete team"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
