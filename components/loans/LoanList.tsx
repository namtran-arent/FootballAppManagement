'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { Loan } from '@/lib/loanService';

interface LoanListProps {
  loans: Loan[];
  onEdit: (loan: Loan) => void;
  onDelete: (loanId: string) => void;
}

export default function LoanList({ loans, onEdit, onDelete }: LoanListProps) {
  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'completed':
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isMatchStarted = (matchDate: string): boolean => {
    const now = new Date();
    const matchDateObj = new Date(matchDate);
    // Consider match started if date has passed (at start of day)
    matchDateObj.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return matchDateObj < today;
  };

  if (loans.length === 0) {
    return (
      <div className="bg-zinc-800 rounded-lg p-8 text-center">
        <p className="text-zinc-400">No loans found. Create your first loan!</p>
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
                Team Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Match
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Match Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Location
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Number of Players
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const matchStarted = isMatchStarted(loan.match.matchDate);
              const matchInfo = `${loan.match.homeTeam.teamName} vs ${loan.match.awayTeam.teamName}`;
              return (
                <tr
                  key={loan.id}
                  className={`border-b border-zinc-700 transition-colors ${
                    matchStarted
                      ? 'bg-zinc-800/50 opacity-75'
                      : 'hover:bg-zinc-700/50'
                  }`}
                >
                  <td className="px-6 py-4 text-white font-medium">
                    {loan.team.teamName}
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{matchInfo}</td>
                  <td className="px-6 py-4 text-zinc-300">
                    {formatDate(loan.match.matchDate)}
                  </td>
                  <td className="px-6 py-4 text-zinc-300">
                    {loan.match.location || '-'}
                  </td>
                  <td className="px-6 py-4 text-zinc-300">
                    {loan.numberOfPlayers} {loan.numberOfPlayers === 1 ? 'player' : 'players'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        loan.status
                      )}`}
                    >
                      {loan.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(loan)}
                        disabled={matchStarted}
                        className={`transition-colors ${
                          matchStarted
                            ? 'text-zinc-600 cursor-not-allowed opacity-50'
                            : 'text-zinc-400 hover:text-blue-400'
                        }`}
                        title={matchStarted ? 'Match has started, cannot edit' : 'Edit loan'}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(loan.id)}
                        disabled={matchStarted}
                        className={`transition-colors ${
                          matchStarted
                            ? 'text-zinc-600 cursor-not-allowed opacity-50'
                            : 'text-zinc-400 hover:text-red-400'
                        }`}
                        title={matchStarted ? 'Match has started, cannot delete' : 'Delete loan'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
