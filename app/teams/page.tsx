'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import FootballHeader from '@/components/football/FootballHeader';
import FootballSidebar from '@/components/football/FootballSidebar';
import TeamList from '@/components/teams/TeamList';
import TeamForm from '@/components/teams/TeamForm';
import { Team, getAllTeams, createTeam, updateTeam, deleteTeam } from '@/lib/teamService';
import { getSupabaseUserId } from '@/lib/userService';
import Toast from '@/components/ui/Toast';

export type { Team };

export default function TeamsPage() {
  const { data: session } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
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

  // Load teams from Supabase
  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTeams();
      setTeams(data);
    } catch (err) {
      console.error('Error loading teams:', err);
      setError('Failed to load teams. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => {
    setError(null);
    try {
      // Get Supabase user ID from provider ID
      const supabaseUserId = await getSupabaseUserId(session?.user?.id);
      
      const newTeam = await createTeam({
        ...teamData,
        userId: supabaseUserId || undefined,
      });
      if (newTeam) {
        setTeams([newTeam, ...teams]);
        showToast('Team created successfully!', 'success');
        return true;
      } else {
        const errorMsg = 'Failed to create team. Please check console for details.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
        return false;
      }
    } catch (err) {
      console.error('Error creating team:', err);
      const errorMsg = `Failed to create team: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMsg);
      showToast(errorMsg, 'error');
      return false;
    }
  };

  const handleUpdateTeam = async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTeam) return false;
    
    setError(null);
    try {
      const updatedTeam = await updateTeam(editingTeam.id, teamData);
      if (updatedTeam) {
        setTeams(teams.map((team) => (team.id === editingTeam.id ? updatedTeam : team)));
        showToast('Team updated successfully!', 'success');
        return true;
      } else {
        const errorMsg = 'Failed to update team. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
        return false;
      }
    } catch (err) {
      console.error('Error updating team:', err);
      const errorMsg = 'Failed to update team. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      return false;
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team?')) {
      return;
    }

    setError(null);
    try {
      const success = await deleteTeam(teamId);
      if (success) {
        setTeams(teams.filter((team) => team.id !== teamId));
        showToast('Team deleted successfully!', 'success');
      } else {
        const errorMsg = 'Failed to delete team. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      console.error('Error deleting team:', err);
      const errorMsg = 'Failed to delete team. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingTeam(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTeam(null);
    setError(null);
  };

  const handleFormSubmit = async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => {
    let success = false;
    if (formMode === 'create') {
      success = await handleCreateTeam(teamData);
    } else {
      success = await handleUpdateTeam(teamData);
    }
    
    if (success) {
      handleFormClose();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <FootballHeader />
      <div className="flex">
        <FootballSidebar />
        <div className="flex-1 container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Team Management</h1>
          <button
            onClick={handleCreateClick}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            + Create Team
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-zinc-800 rounded-lg p-8 text-center">
            <p className="text-zinc-400">Loading teams...</p>
          </div>
        ) : (
          <TeamList
            teams={teams}
            onEdit={handleEditTeam}
            onDelete={handleDeleteTeam}
          />
        )}

        <TeamForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          team={editingTeam}
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
