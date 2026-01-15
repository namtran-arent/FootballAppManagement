'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Radio } from 'lucide-react';
import MatchCard from './MatchCard';

interface MatchScheduleProps {
  selectedTeam: string | null;
  searchQuery: string;
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  league: string;
  country: string;
  homeLogo?: string;
  awayLogo?: string;
}

// Sample match data
const SAMPLE_MATCHES: Match[] = [
  {
    id: '1',
    homeTeam: 'Wolfsburg',
    awayTeam: 'St. Pauli',
    homeScore: 2,
    awayScore: 1,
    status: 'FT',
    league: 'Bundesliga',
    country: 'Germany',
    homeLogo: '🐺',
    awayLogo: '⚫',
  },
  {
    id: '2',
    homeTeam: 'FC Cologne',
    awayTeam: 'Bayern Munich',
    homeScore: 1,
    awayScore: 3,
    status: 'FT',
    league: 'Bundesliga',
    country: 'Germany',
    homeLogo: '🔴',
    awayLogo: '🔴',
  },
  {
    id: '3',
    homeTeam: 'Hoffenheim',
    awayTeam: 'Borussia M\'gladbach',
    homeScore: 5,
    awayScore: 1,
    status: 'FT',
    league: 'Bundesliga',
    country: 'Germany',
    homeLogo: '🔵',
    awayLogo: '⚫',
  },
  {
    id: '4',
    homeTeam: 'RB Leipzig',
    awayTeam: 'Freiburg',
    homeScore: 2,
    awayScore: 0,
    status: 'FT',
    league: 'Bundesliga',
    country: 'Germany',
    homeLogo: '🔴',
    awayLogo: '🔴',
  },
  {
    id: '5',
    homeTeam: 'Napoli',
    awayTeam: 'Parma',
    homeScore: 0,
    awayScore: 0,
    status: 'FT',
    league: 'Serie A',
    country: 'Italy',
    homeLogo: '🔵',
    awayLogo: '⚪',
  },
  {
    id: '6',
    homeTeam: 'Inter',
    awayTeam: 'Lecce',
    homeScore: 1,
    awayScore: 0,
    status: 'FT',
    league: 'Serie A',
    country: 'Italy',
    homeLogo: '🔵',
    awayLogo: '🟡',
  },
];

export default function MatchSchedule({
  selectedTeam,
  searchQuery,
}: MatchScheduleProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filter matches based on selections
  const filteredMatches = SAMPLE_MATCHES.filter((match) => {
    if (selectedTeam) {
      if (match.homeTeam !== selectedTeam && match.awayTeam !== selectedTeam) {
        return false;
      }
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !match.homeTeam.toLowerCase().includes(query) &&
        !match.awayTeam.toLowerCase().includes(query) &&
        !match.league.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  });

  // Group matches by league
  const matchesByLeague = filteredMatches.reduce((acc, match) => {
    if (!acc[match.league]) {
      acc[match.league] = [];
    }
    acc[match.league].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

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
    <div className="flex-1 bg-zinc-900">
      {/* Date Navigation */}
      <div className="bg-zinc-800 border-b border-zinc-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-red-700 transition-colors">
            <Radio className="w-4 h-4" />
            LIVE
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-zinc-700 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-white font-medium">
              {formatDate(selectedDate)}
            </span>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-zinc-700 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button className="p-2 hover:bg-zinc-700 rounded transition-colors">
            <Calendar className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Match Listings */}
      <div className="overflow-y-auto h-[calc(100vh-64px-80px)]">
        {Object.entries(matchesByLeague).map(([league, matches]) => (
          <div key={league} className="mb-6">
            {/* League Header */}
            <div className="px-6 py-3 bg-zinc-800 border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{league}</span>
                <span className="text-zinc-400 text-sm">
                  {matches[0]?.country}
                </span>
              </div>
            </div>

            {/* Matches */}
            <div className="bg-zinc-900">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  homeTeam={match.homeTeam}
                  awayTeam={match.awayTeam}
                  homeScore={match.homeScore}
                  awayScore={match.awayScore}
                  status={match.status}
                  homeLogo={match.homeLogo}
                  awayLogo={match.awayLogo}
                />
              ))}
            </div>
          </div>
        ))}

        {Object.keys(matchesByLeague).length === 0 && (
          <div className="flex items-center justify-center h-64 text-zinc-400">
            No matches found
          </div>
        )}
      </div>
    </div>
  );
}
