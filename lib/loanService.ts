import { supabase } from './supabase';

export interface Loan {
  id: string;
  teamId: string;
  matchId: string;
  team: {
    id: string;
    teamName: string;
    avatarUrl?: string;
  };
  match: {
    id: string;
    homeTeam: { teamName: string; avatarUrl?: string };
    awayTeam: { teamName: string; avatarUrl?: string };
    matchDate: string;
    location?: string;
  };
  numberOfPlayers: number;
  status: 'active' | 'completed' | 'pending';
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LoanInsert {
  team_id: string;
  match_id: string;
  number_of_players: number;
  status: 'active' | 'completed' | 'pending';
  user_id?: string;
}

interface LoanUpdate {
  team_id?: string;
  match_id?: string;
  number_of_players?: number;
  status?: 'active' | 'completed' | 'pending';
}

/**
 * Convert database loan to app loan format
 */
function mapLoanFromDb(dbLoan: any): Loan {
  const homeTeam = dbLoan.match?.home_team || {};
  const awayTeam = dbLoan.match?.away_team || {};
  
  return {
    id: dbLoan.id,
    teamId: dbLoan.team_id,
    matchId: dbLoan.match_id,
    team: {
      id: dbLoan.team?.id || dbLoan.team_id,
      teamName: dbLoan.team?.team_name || '',
      avatarUrl: dbLoan.team?.avatar_url || undefined,
    },
    match: {
      id: dbLoan.match?.id || dbLoan.match_id,
      homeTeam: {
        teamName: homeTeam.team_name || '',
        avatarUrl: homeTeam.avatar_url || undefined,
      },
      awayTeam: {
        teamName: awayTeam.team_name || '',
        avatarUrl: awayTeam.avatar_url || undefined,
      },
      matchDate: dbLoan.match?.match_date || '',
      location: dbLoan.match?.location || undefined,
    },
    numberOfPlayers: dbLoan.number_of_players,
    status: dbLoan.status,
    userId: dbLoan.user_id,
    createdAt: dbLoan.created_at,
    updatedAt: dbLoan.updated_at,
  };
}

/**
 * Get all loans
 */
export async function getAllLoans(): Promise<Loan[]> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('loans')
      .select(`
        *,
        team:teams!loans_team_id_fkey(id, team_name, avatar_url),
        match:matches!loans_match_id_fkey(
          id,
          match_date,
          location,
          home_team:teams!matches_home_team_id_fkey(id, team_name, avatar_url),
          away_team:teams!matches_away_team_id_fkey(id, team_name, avatar_url)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching loans:', error);
      return [];
    }

    return (data || []).map(mapLoanFromDb);
  } catch (error) {
    console.error('Exception in getAllLoans:', error);
    return [];
  }
}

/**
 * Get loan by ID
 */
export async function getLoanById(id: string): Promise<Loan | null> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('loans')
      .select(`
        *,
        team:teams!loans_team_id_fkey(id, team_name, avatar_url),
        match:matches!loans_match_id_fkey(
          id,
          match_date,
          location,
          home_team:teams!matches_home_team_id_fkey(id, team_name, avatar_url),
          away_team:teams!matches_away_team_id_fkey(id, team_name, avatar_url)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching loan:', error);
      return null;
    }

    return data ? mapLoanFromDb(data) : null;
  } catch (error) {
    console.error('Exception in getLoanById:', error);
    return null;
  }
}

/**
 * Create a new loan
 */
export async function createLoan(loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Loan | null> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    const loanInsert: LoanInsert = {
      team_id: loan.teamId,
      match_id: loan.matchId,
      number_of_players: loan.numberOfPlayers,
      status: loan.status,
      user_id: loan.userId || null,
    };

    const { data, error } = await supabase
      .from('loans')
      .insert([loanInsert])
      .select(`
        *,
        team:teams!loans_team_id_fkey(id, team_name, avatar_url),
        match:matches!loans_match_id_fkey(
          id,
          match_date,
          location,
          home_team:teams!matches_home_team_id_fkey(id, team_name, avatar_url),
          away_team:teams!matches_away_team_id_fkey(id, team_name, avatar_url)
        )
      `)
      .single();

    if (error) {
      console.error('Error creating loan:', error);
      return null;
    }

    return data ? mapLoanFromDb(data) : null;
  } catch (error) {
    console.error('Exception in createLoan:', error);
    return null;
  }
}

/**
 * Update an existing loan
 */
export async function updateLoan(id: string, loan: Partial<Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Loan | null> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    const loanUpdate: LoanUpdate = {};

    if (loan.teamId !== undefined) loanUpdate.team_id = loan.teamId;
    if (loan.matchId !== undefined) loanUpdate.match_id = loan.matchId;
    if (loan.numberOfPlayers !== undefined) loanUpdate.number_of_players = loan.numberOfPlayers;
    if (loan.status !== undefined) loanUpdate.status = loan.status;

    const { data, error } = await supabase
      .from('loans')
      .update(loanUpdate)
      .eq('id', id)
      .select(`
        *,
        team:teams!loans_team_id_fkey(id, team_name, avatar_url),
        match:matches!loans_match_id_fkey(
          id,
          match_date,
          location,
          home_team:teams!matches_home_team_id_fkey(id, team_name, avatar_url),
          away_team:teams!matches_away_team_id_fkey(id, team_name, avatar_url)
        )
      `)
      .single();

    if (error) {
      console.error('Error updating loan:', error);
      return null;
    }

    return data ? mapLoanFromDb(data) : null;
  } catch (error) {
    console.error('Exception in updateLoan:', error);
    return null;
  }
}

/**
 * Delete a loan
 */
export async function deleteLoan(id: string): Promise<boolean> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return false;
  }

  try {
    const { error } = await supabase
      .from('loans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting loan:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in deleteLoan:', error);
    return false;
  }
}
