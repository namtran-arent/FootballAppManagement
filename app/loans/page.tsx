'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import FootballHeader from '@/components/football/FootballHeader';
import LoanList from '@/components/loans/LoanList';
import LoanForm from '@/components/loans/LoanForm';
import { Loan, getAllLoans, createLoan, updateLoan, deleteLoan } from '@/lib/loanService';
import { getSupabaseUserId } from '@/lib/userService';

export type { Loan };

export default function LoansPage() {
  const { data: session } = useSession();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load loans from Supabase
  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllLoans();
      setLoans(data);
    } catch (err) {
      console.error('Error loading loans:', err);
      setError('Failed to load loans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLoan = async (loanData: Omit<Loan, 'id' | 'team' | 'match' | 'createdAt' | 'updatedAt'>) => {
    setError(null);
    try {
      // Get Supabase user ID from provider ID
      const supabaseUserId = await getSupabaseUserId(session?.user?.id);
      
      const newLoan = await createLoan({
        ...loanData,
        userId: supabaseUserId || undefined,
      });
      if (newLoan) {
        setLoans([newLoan, ...loans]);
        return true;
      } else {
        setError('Failed to create loan. Please try again.');
        return false;
      }
    } catch (err) {
      console.error('Error creating loan:', err);
      setError('Failed to create loan. Please try again.');
      return false;
    }
  };

  const handleUpdateLoan = async (loanData: Omit<Loan, 'id' | 'team' | 'match' | 'createdAt' | 'updatedAt'>) => {
    if (!editingLoan) return false;
    
    setError(null);
    try {
      const updatedLoan = await updateLoan(editingLoan.id, loanData);
      if (updatedLoan) {
        setLoans(loans.map((loan) => (loan.id === editingLoan.id ? updatedLoan : loan)));
        return true;
      } else {
        setError('Failed to update loan. Please try again.');
        return false;
      }
    } catch (err) {
      console.error('Error updating loan:', err);
      setError('Failed to update loan. Please try again.');
      return false;
    }
  };

  const handleDeleteLoan = async (loanId: string) => {
    if (!confirm('Are you sure you want to delete this loan?')) {
      return;
    }

    setError(null);
    try {
      const success = await deleteLoan(loanId);
      if (success) {
        setLoans(loans.filter((loan) => loan.id !== loanId));
      } else {
        setError('Failed to delete loan. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting loan:', err);
      setError('Failed to delete loan. Please try again.');
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
    setError(null);
  };

  const handleFormSubmit = async (loanData: Omit<Loan, 'id' | 'team' | 'match' | 'createdAt' | 'updatedAt'>) => {
    let success = false;
    if (formMode === 'create') {
      success = await handleCreateLoan(loanData);
    } else {
      success = await handleUpdateLoan(loanData);
    }
    
    if (success) {
      handleFormClose();
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

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-zinc-800 rounded-lg p-8 text-center">
            <p className="text-zinc-400">Loading loans...</p>
          </div>
        ) : (
          <LoanList
            loans={loans}
            onEdit={handleEditLoan}
            onDelete={handleDeleteLoan}
          />
        )}

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
