import { supabase } from './supabase';
import { getDefaultAvatarUrl } from './storageService';

export interface Team {
  id: string;
  teamName: string;
  captainName: string;
  captainPhone: string;
  avatarUrl?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TeamInsert {
  team_name: string;
  captain_name: string;
  captain_phone: string;
  avatar_url?: string;
  user_id?: string;
}

interface TeamUpdate {
  team_name?: string;
  captain_name?: string;
  captain_phone?: string;
  avatar_url?: string;
}

/**
 * Convert database team to app team format
 */
function mapTeamFromDb(dbTeam: any): Team {
  return {
    id: dbTeam.id,
    teamName: dbTeam.team_name,
    captainName: dbTeam.captain_name,
    captainPhone: dbTeam.captain_phone,
    avatarUrl: dbTeam.avatar_url || getDefaultAvatarUrl(),
    userId: dbTeam.user_id,
    createdAt: dbTeam.created_at,
    updatedAt: dbTeam.updated_at,
  };
}

/**
 * Get all teams
 */
export async function getAllTeams(): Promise<Team[]> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teams:', error);
      return [];
    }

    return (data || []).map(mapTeamFromDb);
  } catch (error) {
    console.error('Exception in getAllTeams:', error);
    return [];
  }
}

/**
 * Get team by ID
 */
export async function getTeamById(id: string): Promise<Team | null> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching team:', error);
      return null;
    }

    return data ? mapTeamFromDb(data) : null;
  } catch (error) {
    console.error('Exception in getTeamById:', error);
    return null;
  }
}

/**
 * Create a new team
 */
export async function createTeam(team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team | null> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    // Only save avatar_url if it's a real URL (not data URL default)
    let avatarUrl = null;
    if (team.avatarUrl && !team.avatarUrl.startsWith('data:')) {
      avatarUrl = team.avatarUrl;
    }

    const teamInsert: TeamInsert = {
      team_name: team.teamName,
      captain_name: team.captainName,
      captain_phone: team.captainPhone,
      avatar_url: avatarUrl,
      user_id: team.userId || null,
    };

    const { data, error } = await supabase
      .from('teams')
      .insert([teamInsert])
      .select()
      .single();

    if (error) {
      console.error('Error creating team:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Team data being inserted:', JSON.stringify(teamInsert, null, 2));
      return null;
    }

    return data ? mapTeamFromDb(data) : null;
  } catch (error) {
    console.error('Exception in createTeam:', error);
    return null;
  }
}

/**
 * Update an existing team
 */
export async function updateTeam(id: string, team: Partial<Omit<Team, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Team | null> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    const teamUpdate: TeamUpdate = {};

    if (team.teamName !== undefined) teamUpdate.team_name = team.teamName;
    if (team.captainName !== undefined) teamUpdate.captain_name = team.captainName;
    if (team.captainPhone !== undefined) teamUpdate.captain_phone = team.captainPhone;
    if (team.avatarUrl !== undefined) teamUpdate.avatar_url = team.avatarUrl || null;

    const { data, error } = await supabase
      .from('teams')
      .update(teamUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating team:', error);
      return null;
    }

    return data ? mapTeamFromDb(data) : null;
  } catch (error) {
    console.error('Exception in updateTeam:', error);
    return null;
  }
}

/**
 * Delete a team
 */
export async function deleteTeam(id: string): Promise<boolean> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return false;
  }

  try {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting team:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in deleteTeam:', error);
    return false;
  }
}
