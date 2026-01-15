'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import FootballHeader from '@/components/football/FootballHeader';
import FootballSidebar from '@/components/football/FootballSidebar';
import LoanList from '@/components/loans/LoanList';
import LoanForm from '@/components/loans/LoanForm';
import { Loan, getAllLoans, createLoan, updateLoan, deleteLoan } from '@/lib/loanService';
import Toast from '@/components/ui/Toast';
import { getSupabaseUserId } from '@/lib/userService';

export type { Loan };

// Helper function to get date string in YYYY-MM-DD format
const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export default function LoansPage() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Load loans from Supabase
  useEffect(() => {
    loadLoans();
  }, []);

  // Auto-update loan status to 'completed' when match finishes
  useEffect(() => {
    const updateCompletedLoans = async () => {
      const loansToUpdate = loans.filter((loan) => {
        // Check if match is finished (status = 'FT') but loan status is not 'completed'
        return (
          loan.match.status === 'FT' &&
          loan.status !== 'completed'
        );
      });

      if (loansToUpdate.length > 0) {
        try {
          // Update all loans with finished matches to 'completed'
          const updatePromises = loansToUpdate.map((loan) =>
            updateLoan(loan.id, { status: 'completed' })
          );
          await Promise.all(updatePromises);
          
          // Reload loans to reflect changes
          await loadLoans();
        } catch (err) {
          console.error('Error auto-updating loan statuses:', err);
        }
      }
    };

    if (loans.length > 0 && !loading) {
      updateCompletedLoans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans.length, selectedDate]);

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
        showToast('Loan created successfully!', 'success');
        return true;
      } else {
        const errorMsg = 'Failed to create loan. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
        return false;
      }
    } catch (err) {
      console.error('Error creating loan:', err);
      const errorMsg = 'Failed to create loan. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
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
        showToast('Loan updated successfully!', 'success');
        return true;
      } else {
        const errorMsg = 'Failed to update loan. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
        return false;
      }
    } catch (err) {
      console.error('Error updating loan:', err);
      const errorMsg = 'Failed to update loan. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
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
        showToast('Loan deleted successfully!', 'success');
      } else {
        const errorMsg = 'Failed to delete loan. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      console.error('Error deleting loan:', err);
      const errorMsg = 'Failed to delete loan. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
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
      // Reload loans after create/update
      await loadLoans();
    }
  };

  // Get selected date string in YYYY-MM-DD format
  const selectedDateString = getDateString(selectedDate);

  // Filter loans based on selected date (match date)
  const filteredLoans = loans.filter((loan) => {
    return loan.match.matchDate === selectedDateString;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen">
      <FootballHeader />
      <div className="flex">
        <FootballSidebar />
        <div className="flex-1 container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-zinc-900">Loan Management</h1>
          <button
            onClick={handleCreateClick}
            className="px-6 py-3 btn-gradient rounded-lg font-medium"
          >
            + Create Loan
          </button>
        </div>

        {/* Date Navigation */}
        <div className="mb-6 glass-card p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-zinc-200 rounded-lg transition-colors"
              title="Previous day"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-700" />
            </button>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <div className="text-center">
                <div className="text-lg font-semibold text-zinc-900">{formatDate(selectedDate)}</div>
                <div className="text-xs text-zinc-600">
                  {selectedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <input
                type="date"
                value={selectedDateString}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(new Date(e.target.value));
                  }
                }}
                className="ml-2 px-3 py-1 bg-white border border-zinc-300 rounded text-zinc-900 text-sm focus:outline-none focus:border-green-500"
              />
            </div>

            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-zinc-200 rounded-lg transition-colors"
              title="Next day"
            >
              <ChevronRight className="w-5 h-5 text-zinc-700" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="glass-card p-8 text-center">
            <p className="text-zinc-600">Loading loans...</p>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-zinc-600">No loans found for {formatDate(selectedDate)}</p>
          </div>
        ) : (
          <LoanList
            loans={filteredLoans}
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

        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
        </div>
      </div>
    </div>
  );
}
