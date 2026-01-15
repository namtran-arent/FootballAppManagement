import { supabase } from './supabase';

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: {
    id: string;
    teamName: string;
    avatarUrl?: string;
  };
  awayTeam: {
    id: string;
    teamName: string;
    avatarUrl?: string;
  };
  homeScore: number;
  awayScore: number;
  status: string;
  league: string;
  country: string;
  matchDate: string; // YYYY-MM-DD
  location?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MatchInsert {
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
  status: string;
  league: string;
  country: string;
  match_date: string;
  location?: string;
  user_id?: string;
}

interface MatchUpdate {
  home_team_id?: string;
  away_team_id?: string;
  home_score?: number;
  away_score?: number;
  status?: string;
  league?: string;
  country?: string;
  match_date?: string;
  location?: string;
}

/**
 * Convert database match to app match format
 */
function mapMatchFromDb(dbMatch: any): Match {
  return {
    id: dbMatch.id,
    homeTeamId: dbMatch.home_team_id,
    awayTeamId: dbMatch.away_team_id,
    homeTeam: {
      id: dbMatch.home_team?.id || dbMatch.home_team_id,
      teamName: dbMatch.home_team?.team_name || '',
      avatarUrl: dbMatch.home_team?.avatar_url || undefined,
    },
    awayTeam: {
      id: dbMatch.away_team?.id || dbMatch.away_team_id,
      teamName: dbMatch.away_team?.team_name || '',
      avatarUrl: dbMatch.away_team?.avatar_url || undefined,
    },
    homeScore: dbMatch.home_score,
    awayScore: dbMatch.away_score,
    status: dbMatch.status,
    league: dbMatch.league,
    country: dbMatch.country,
    matchDate: dbMatch.match_date,
    location: dbMatch.location || undefined,
    userId: dbMatch.user_id,
    createdAt: dbMatch.created_at,
    updatedAt: dbMatch.updated_at,
  };
}

/**
 * Get all matches
 */
export async function getAllMatches(): Promise<Match[]> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, team_name, avatar_url),
        away_team:teams!matches_away_team_id_fkey(id, team_name, avatar_url)
      `)
      .order('match_date', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }

    return (data || []).map(mapMatchFromDb);
  } catch (error) {
    console.error('Exception in getAllMatches:', error);
    return [];
  }
}

/**
 * Get match by ID
 */
export async function getMatchById(id: string): Promise<Match | null> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, team_name, avatar_url),
        away_team:teams!matches_away_team_id_fkey(id, team_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching match:', error);
      return null;
    }

    return data ? mapMatchFromDb(data) : null;
  } catch (error) {
    console.error('Exception in getMatchById:', error);
    return null;
  }
}

/**
 * Get matches by date
 */
export async function getMatchesByDate(date: string): Promise<Match[]> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, team_name, avatar_url),
        away_team:teams!matches_away_team_id_fkey(id, team_name, avatar_url)
      `)
      .eq('match_date', date)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching matches by date:', error);
      return [];
    }

    return (data || []).map(mapMatchFromDb);
  } catch (error) {
    console.error('Exception in getMatchesByDate:', error);
    return [];
  }
}

/**
 * Create a new match
 */
export async function createMatch(match: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>): Promise<Match | null> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    const matchInsert: MatchInsert = {
      home_team_id: match.homeTeamId,
      away_team_id: match.awayTeamId,
      home_score: match.homeScore,
      away_score: match.awayScore,
      status: match.status,
      league: match.league,
      country: match.country,
      match_date: match.matchDate,
      location: match.location || null,
      user_id: match.userId || null,
    };

    const { data, error } = await supabase
      .from('matches')
      .insert([matchInsert])
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, team_name, avatar_url),
        away_team:teams!matches_away_team_id_fkey(id, team_name, avatar_url)
      `)
      .single();

    if (error) {
      console.error('Error creating match:', error);
      return null;
    }

    return data ? mapMatchFromDb(data) : null;
  } catch (error) {
    console.error('Exception in createMatch:', error);
    return null;
  }
}

/**
 * Update an existing match
 */
export async function updateMatch(id: string, match: Partial<Omit<Match, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Match | null> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    const matchUpdate: MatchUpdate = {};

    if (match.homeTeamId !== undefined) matchUpdate.home_team_id = match.homeTeamId;
    if (match.awayTeamId !== undefined) matchUpdate.away_team_id = match.awayTeamId;
    if (match.homeScore !== undefined) matchUpdate.home_score = match.homeScore;
    if (match.awayScore !== undefined) matchUpdate.away_score = match.awayScore;
    if (match.status !== undefined) matchUpdate.status = match.status;
    if (match.league !== undefined) matchUpdate.league = match.league;
    if (match.country !== undefined) matchUpdate.country = match.country;
    if (match.matchDate !== undefined) matchUpdate.match_date = match.matchDate;
    if (match.location !== undefined) matchUpdate.location = match.location || null;

    const { data, error } = await supabase
      .from('matches')
      .update(matchUpdate)
      .eq('id', id)
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, team_name, avatar_url),
        away_team:teams!matches_away_team_id_fkey(id, team_name, avatar_url)
      `)
      .single();

    if (error) {
      console.error('Error updating match:', error);
      return null;
    }

    return data ? mapMatchFromDb(data) : null;
  } catch (error) {
    console.error('Exception in updateMatch:', error);
    return null;
  }
}

/**
 * Delete a match
 */
export async function deleteMatch(id: string): Promise<boolean> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return false;
  }

  try {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting match:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in deleteMatch:', error);
    return false;
  }
}
