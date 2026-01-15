'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Loan } from '@/app/loans/page';

interface LoanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (loan: Omit<Loan, 'id'>) => void;
  loan?: Loan | null;
  mode: 'create' | 'edit';
}

const TEAMS = [
  'Manchester United',
  'Liverpool',
  'Arsenal',
  'Manchester City',
  'Chelsea',
  'Tottenham',
  'Real Madrid',
  'Barcelona',
  'Bayern Munich',
  'PSG',
  'Bayern Munich',
  'Borussia Dortmund',
  'Inter Milan',
  'AC Milan',
  'Juventus',
  'Napoli',
];

export default function LoanForm({
  isOpen,
  onClose,
  onSubmit,
  loan,
  mode,
}: LoanFormProps) {
  const [formData, setFormData] = useState({
    teamName: '',
    matchId: '',
    matchInfo: '',
    matchDate: new Date().toISOString().split('T')[0],
    matchTime: '15:00',
    numberOfPlayers: 1,
    status: 'pending' as Loan['status'],
  });

  useEffect(() => {
    if (loan && mode === 'edit') {
      setFormData({
        teamName: loan.teamName,
        matchId: loan.matchId,
        matchInfo: loan.matchInfo,
        matchDate: loan.matchDate,
        matchTime: loan.matchTime,
        numberOfPlayers: loan.numberOfPlayers,
        status: loan.status,
      });
    } else {
      setFormData({
        teamName: '',
        matchId: '',
        matchInfo: '',
        matchDate: new Date().toISOString().split('T')[0],
        matchTime: '15:00',
        numberOfPlayers: 1,
        status: 'pending',
      });
    }
  }, [loan, mode, isOpen]);

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
            {mode === 'create' ? 'Create New Loan' : 'Edit Loan'}
          </h2>
          <p className="text-zinc-400">
            {mode === 'create'
              ? 'Add a new player loan agreement'
              : 'Update loan information'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Team Name
            </label>
            <select
              value={formData.teamName}
              onChange={(e) =>
                setFormData({ ...formData, teamName: e.target.value })
              }
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
              required
            >
              <option value="">Select team</option>
              {TEAMS.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          {/* Match Info */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Match (e.g., "Team A vs Team B")
            </label>
            <input
              type="text"
              value={formData.matchInfo}
              onChange={(e) =>
                setFormData({ ...formData, matchInfo: e.target.value })
              }
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="e.g., Manchester United vs Liverpool"
              required
            />
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
                onChange={(e) =>
                  setFormData({ ...formData, matchDate: e.target.value })
                }
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors"
                required
              />
            </div>

            {/* Match Time */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Match Time
              </label>
              <input
                type="time"
                value={formData.matchTime}
                onChange={(e) =>
                  setFormData({ ...formData, matchTime: e.target.value })
                }
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Number of Players */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Number of Players Needed
              </label>
              <input
                type="number"
                min="1"
                value={formData.numberOfPlayers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfPlayers: parseInt(e.target.value) || 1,
                  })
                }
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Loan['status'],
                  })
                }
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                required
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
            >
              {mode === 'create' ? 'Create Loan' : 'Update Loan'}
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
