'use client';

import { useState } from 'react';
import React from 'react';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Loan } from '@/lib/loanService';

interface LoanListProps {
  loans: Loan[];
  onEdit: (loan: Loan) => void;
  onDelete: (loanId: string) => void;
}

export default function LoanList({ loans, onEdit, onDelete }: LoanListProps) {
  const [expandedLoans, setExpandedLoans] = useState<Set<string>>(new Set());

  const toggleExpand = (loanId: string) => {
    setExpandedLoans((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(loanId)) {
        newSet.delete(loanId);
      } else {
        newSet.add(loanId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'completed':
        return 'bg-zinc-100 text-zinc-700 border-zinc-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isMatchFinished = (matchDate: string, matchTime?: string, matchStatus?: string): boolean => {
    // If match status is 'FT' (Full Time), match is finished
    if (matchStatus === 'FT') {
      return true;
    }
    
    // Otherwise, check if match has started based on date and time
    const now = new Date();
    const matchDateObj = new Date(matchDate);
    
    // If match time is provided, use it to determine exact start time
    if (matchTime) {
      const [hours, minutes] = matchTime.split(':').map(Number);
      matchDateObj.setHours(hours || 0, minutes || 0, 0, 0);
      return matchDateObj < now;
    }
    
    // If no match time, consider match started if date has passed (at start of day)
    matchDateObj.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return matchDateObj < today;
  };

  if (loans.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-zinc-600">No loans found. Create your first loan!</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto -mx-2 md:mx-0">
        <table className="w-full border-collapse min-w-[700px]">
          <thead className="bg-zinc-100/50 border-b border-zinc-200/50">
            <tr>
              <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-zinc-700">
                Team Name
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-zinc-700 hidden sm:table-cell">
                Match
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-zinc-700">
                Match Date
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-zinc-700 hidden md:table-cell">
                Players
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-zinc-700">
                Status
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-zinc-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const matchFinished = isMatchFinished(
                loan.match.matchDate,
                loan.match.matchTime,
                loan.match.status
              );
              const matchInfo = `${loan.match.homeTeam.teamName} vs ${loan.match.awayTeam.teamName}`;
              const isExpanded = expandedLoans.has(loan.id);
              return (
                <React.Fragment key={loan.id}>
                  <tr
                    className={`transition-all duration-300 ${
                      matchFinished
                        ? 'opacity-60'
                        : 'hover:bg-zinc-50/50'
                    }`}
                  >
                    <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                      <div className="text-zinc-900 font-medium text-sm md:text-base">
                        {loan.team.teamName}
                      </div>
                      <div className="text-zinc-600 text-xs sm:hidden mt-1">
                        {matchInfo}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-center hidden sm:table-cell">
                      <div className="text-zinc-700 text-sm md:text-base">{matchInfo}</div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                      <div className="text-zinc-700 text-sm md:text-base">
                        {formatDate(loan.match.matchDate)}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-center hidden md:table-cell">
                      <div className="text-zinc-700 text-sm md:text-base">
                        {loan.numberOfPlayers} {loan.numberOfPlayers === 1 ? 'player' : 'players'}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                      <span
                        className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          matchFinished ? 'completed' : loan.status
                        )}`}
                      >
                        {matchFinished ? 'COMPLETED' : loan.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                      <div className="flex items-center justify-center gap-1 md:gap-2">
                        <button
                          onClick={() => toggleExpand(loan.id)}
                          className="text-zinc-600 hover:text-zinc-900 transition-colors"
                          title={isExpanded ? 'Collapse details' : 'Expand details'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 md:w-5 md:h-5" />
                          ) : (
                            <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => onEdit(loan)}
                          disabled={matchFinished}
                          className={`transition-colors ${
                            matchFinished
                              ? 'text-zinc-400 cursor-not-allowed opacity-50'
                              : 'text-zinc-700 hover:text-blue-600'
                          }`}
                          title={matchFinished ? 'Match has finished, cannot edit' : 'Edit loan'}
                        >
                          <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(loan.id)}
                          disabled={matchFinished}
                          className={`transition-colors ${
                            matchFinished
                              ? 'text-zinc-400 cursor-not-allowed opacity-50'
                              : 'text-zinc-700 hover:text-red-600'
                          }`}
                          title={matchFinished ? 'Match has finished, cannot delete' : 'Delete loan'}
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="px-3 md:px-6 py-3 md:py-4 bg-zinc-50/30 border-t border-zinc-200/30">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm">
                          {/* Location */}
                          <div>
                            <div className="text-zinc-500 text-xs font-medium mb-1">Location</div>
                            <div className="text-zinc-700 break-words">
                              {loan.match.location || '-'}
                            </div>
                          </div>
                          {/* Captain Name */}
                          <div>
                            <div className="text-zinc-500 text-xs font-medium mb-1">Captain Name</div>
                            <div className="text-zinc-700">
                              {loan.team.captainName || '-'}
                            </div>
                          </div>
                          {/* Captain Phone */}
                          <div>
                            <div className="text-zinc-500 text-xs font-medium mb-1">Captain Phone</div>
                            <div className="text-zinc-700">
                              {loan.team.captainPhone || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
