'use client';

import { useState } from 'react';
import FootballHeader from '@/components/football/FootballHeader';
import FootballSidebar from '@/components/football/FootballSidebar';
import MatchSchedule from '@/components/football/MatchSchedule';

export default function FootballPage() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <FootballHeader />
      <div className="flex">
        <FootballSidebar />
        <div className="flex-1">
          <MatchSchedule
            selectedTeam={selectedTeam}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>
    </div>
  );
}
