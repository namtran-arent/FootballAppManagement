'use client';

import { useState } from 'react';
import FootballHeader from '@/components/football/FootballHeader';
import FootballSidebar from '@/components/football/FootballSidebar';
import MatchSchedule from '@/components/football/MatchSchedule';

export default function FootballPage() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen">
      <FootballHeader onMenuToggle={toggleSidebar} isMenuOpen={isSidebarOpen} />
      <div className="flex">
        <FootballSidebar
          selectedTeam={selectedTeam}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
        <div className="flex-1 w-full lg:w-auto">
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
