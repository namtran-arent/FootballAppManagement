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
      <div className="bg-zinc-800 rounded-lg p-8 text-center">
        <p className="text-zinc-400">No teams found. Create your first team!</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-900 border-b border-zinc-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Avatar
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Team Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Captain Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Captain Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team.id}
                className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <img
                    src={team.avatarUrl || getDefaultAvatarUrl()}
                    alt={team.teamName}
                    className="w-12 h-12 object-cover rounded-lg border border-zinc-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getDefaultAvatarUrl();
                    }}
                  />
                </td>
                <td className="px-6 py-4 text-white font-medium">
                  {team.teamName}
                </td>
                <td className="px-6 py-4 text-zinc-300">{team.captainName}</td>
                <td className="px-6 py-4 text-zinc-300">{team.captainPhone}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(team)}
                      className="text-zinc-400 hover:text-blue-400 transition-colors"
                      title="Edit team"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(team.id)}
                      className="text-zinc-400 hover:text-red-400 transition-colors"
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
