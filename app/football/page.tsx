'use client';

import { useState } from 'react';
import FootballHeader from '@/components/football/FootballHeader';
import FootballSidebar from '@/components/football/FootballSidebar';
import MatchSchedule from '@/components/football/MatchSchedule';

export default function FootballPage() {
  const [selectedSport, setSelectedSport] = useState('Football');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <FootballHeader />
      <div className="flex">
        <FootballSidebar
          selectedSport={selectedSport}
          onSportChange={setSelectedSport}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
          selectedCompetition={selectedCompetition}
          onCompetitionChange={setSelectedCompetition}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="flex-1">
          <MatchSchedule
            selectedSport={selectedSport}
            selectedTeam={selectedTeam}
            selectedCompetition={selectedCompetition}
            selectedRegion={selectedRegion}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}
