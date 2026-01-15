'use client';

import { useState } from 'react';
import FootballHeader from '@/components/football/FootballHeader';
import LoanList from '@/components/loans/LoanList';
import LoanForm from '@/components/loans/LoanForm';

export interface Loan {
  id: string;
  teamName: string;
  matchId: string;
  matchInfo: string; // e.g., "Manchester United vs Liverpool"
  matchDate: string; // YYYY-MM-DD
  matchTime: string; // HH:MM format
  numberOfPlayers: number;
  status: 'active' | 'completed' | 'pending';
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      teamName: 'Manchester United',
      matchId: '1',
      matchInfo: 'Manchester United vs Liverpool',
      matchDate: '2024-12-20',
      matchTime: '15:00',
      numberOfPlayers: 2,
      status: 'pending',
    },
    {
      id: '2',
      teamName: 'Arsenal',
      matchId: '2',
      matchInfo: 'Arsenal vs Chelsea',
      matchDate: '2024-12-18',
      matchTime: '14:30',
      numberOfPlayers: 1,
      status: 'active',
    },
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const handleCreateLoan = (loanData: Omit<Loan, 'id'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: Date.now().toString(),
    };
    setLoans([...loans, newLoan]);
  };

  const handleUpdateLoan = (loanData: Omit<Loan, 'id'>) => {
    if (editingLoan) {
      setLoans(
        loans.map((loan) =>
          loan.id === editingLoan.id ? { ...loanData, id: editingLoan.id } : loan
        )
      );
    }
  };

  const handleDeleteLoan = (loanId: string) => {
    if (confirm('Are you sure you want to delete this loan?')) {
      setLoans(loans.filter((loan) => loan.id !== loanId));
    }
  };

  const handleEditLoan = (loan: Loan) => {
    setEditingLoan(loan);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingLoan(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingLoan(null);
  };

  const handleFormSubmit = (loanData: Omit<Loan, 'id'>) => {
    if (formMode === 'create') {
      handleCreateLoan(loanData);
    } else {
      handleUpdateLoan(loanData);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <FootballHeader />
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Loan Management</h1>
          <button
            onClick={handleCreateClick}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            + Create Loan
          </button>
        </div>

        <LoanList
          loans={loans}
          onEdit={handleEditLoan}
          onDelete={handleDeleteLoan}
        />

        <LoanForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          loan={editingLoan}
          mode={formMode}
        />
      </div>
    </div>
  );
}
