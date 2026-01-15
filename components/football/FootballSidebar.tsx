'use client';

import { Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const SPORTS = ['Football', 'Hockey', 'Basketball', 'Tennis', 'Cricket'];

const TEAMS = [
  { name: 'Manchester United', country: 'England', logo: '🔴' },
  { name: 'Liverpool', country: 'England', logo: '🔴' },
  { name: 'Arsenal', country: 'England', logo: '🔴' },
  { name: 'Manchester City', country: 'England', logo: '🔵' },
  { name: 'Real Madrid', country: 'Spain', logo: '⚪' },
];

const COMPETITIONS = [
  { name: 'Premier League', country: 'England', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'LaLiga', country: 'Spain', logo: '🇪🇸' },
  { name: 'Serie A', country: 'Italy', logo: '🇮🇹' },
  { name: 'Bundesliga', country: 'Germany', logo: '🇩🇪' },
  { name: 'Ligue 1', country: 'France', logo: '🇫🇷' },
];

const REGIONS = [
  { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Champions League', flag: '🏆' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Germany', flag: '🇩🇪' },
];

interface FootballSidebarProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
  selectedTeam: string | null;
  onTeamChange: (team: string | null) => void;
  selectedCompetition: string | null;
  onCompetitionChange: (competition: string | null) => void;
  selectedRegion: string | null;
  onRegionChange: (region: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function FootballSidebar({
  selectedSport,
  onSportChange,
  selectedTeam,
  onTeamChange,
  selectedCompetition,
  onCompetitionChange,
  selectedRegion,
  onRegionChange,
  searchQuery,
  onSearchChange,
}: FootballSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    teams: true,
    competitions: true,
    region: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="w-64 bg-zinc-800 border-r border-zinc-700 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Sport Tabs */}
        <div className="flex flex-wrap gap-2">
          {SPORTS.map((sport) => (
            <button
              key={sport}
              onClick={() => onSportChange(sport)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedSport === sport
                  ? 'bg-green-500 text-white'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Teams Section */}
        <div>
          <button
            onClick={() => toggleSection('teams')}
            className="w-full flex items-center justify-between text-zinc-400 hover:text-white transition-colors mb-2"
          >
            <span className="text-xs font-semibold uppercase tracking-wider">
              Teams
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                expandedSections.teams ? 'rotate-90' : ''
              }`}
            />
          </button>
          {expandedSections.teams && (
            <div className="space-y-2">
              {TEAMS.map((team) => (
                <button
                  key={team.name}
                  onClick={() => onTeamChange(team.name === selectedTeam ? null : team.name)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-700 transition-colors ${
                    selectedTeam === team.name ? 'bg-zinc-700' : ''
                  }`}
                >
                  <span className="text-lg">{team.logo}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm text-white">{team.name}</div>
                    <div className="text-xs text-zinc-400">{team.country}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Competitions Section */}
        <div>
          <button
            onClick={() => toggleSection('competitions')}
            className="w-full flex items-center justify-between text-zinc-400 hover:text-white transition-colors mb-2"
          >
            <span className="text-xs font-semibold uppercase tracking-wider">
              Competitions
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                expandedSections.competitions ? 'rotate-90' : ''
              }`}
            />
          </button>
          {expandedSections.competitions && (
            <div className="space-y-2">
              {COMPETITIONS.map((comp) => (
                <button
                  key={comp.name}
                  onClick={() => onCompetitionChange(comp.name === selectedCompetition ? null : comp.name)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-700 transition-colors ${
                    selectedCompetition === comp.name ? 'bg-zinc-700' : ''
                  }`}
                >
                  <span className="text-lg">{comp.logo}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm text-white">{comp.name}</div>
                    <div className="text-xs text-zinc-400">{comp.country}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Region Section */}
        <div>
          <button
            onClick={() => toggleSection('region')}
            className="w-full flex items-center justify-between text-zinc-400 hover:text-white transition-colors mb-2"
          >
            <span className="text-xs font-semibold uppercase tracking-wider">
              Region
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                expandedSections.region ? 'rotate-90' : ''
              }`}
            />
          </button>
          {expandedSections.region && (
            <div className="space-y-2">
              {REGIONS.map((region) => (
                <button
                  key={region.name}
                  onClick={() => onRegionChange(region.name === selectedRegion ? null : region.name)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-700 transition-colors ${
                    selectedRegion === region.name ? 'bg-zinc-700' : ''
                  }`}
                >
                  <span className="text-lg">{region.flag}</span>
                  <span className="text-sm text-white">{region.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
