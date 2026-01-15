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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-zinc-100/50 border-b border-zinc-200/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                Avatar
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-zinc-700">
                Team Name
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-zinc-700">
                Captain Name
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-zinc-700">
                Captain Phone
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-zinc-700">
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
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={team.avatarUrl || getDefaultAvatarUrl()}
                      alt={team.teamName}
                      className="w-12 h-12 object-cover rounded-lg border border-zinc-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getDefaultAvatarUrl();
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-zinc-900 font-medium">
                    {team.teamName}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-zinc-700">{team.captainName}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-zinc-700">{team.captainPhone}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(team)}
                      className="text-zinc-600 hover:text-blue-600 transition-colors"
                      title="Edit team"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(team.id)}
                      className="text-zinc-600 hover:text-red-600 transition-colors"
                      title="Delete team"
                    >
                      <Trash2 className="w-5 h-5" />
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
