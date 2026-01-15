'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FootballSidebarProps {
  selectedTeam: string | null;
  onTeamChange: (team: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function FootballSidebar({
  selectedTeam,
  onTeamChange,
  searchQuery,
  onSearchChange,
}: FootballSidebarProps) {
  const router = useRouter();

  const handleTeamsClick = () => {
    // TODO: Navigate to teams page
    // router.push('/teams');
    console.log('Navigate to teams page');
  };

  const handleNewsClick = () => {
    // TODO: Navigate to news page
    // router.push('/news');
    console.log('Navigate to news page');
  };

  const handleLoanClick = () => {
    router.push('/loans');
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

        {/* News Button */}
        <div>
          <button
            onClick={handleNewsClick}
            className="w-full px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white font-medium transition-colors text-left"
          >
            <span className="text-sm uppercase tracking-wider">News</span>
          </button>
        </div>

        {/* Teams Button */}
        <div>
          <button
            onClick={handleTeamsClick}
            className="w-full px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white font-medium transition-colors text-left"
          >
            <span className="text-sm uppercase tracking-wider">Teams</span>
          </button>
        </div>

        {/* Loan Button */}
        <div>
          <button
            onClick={handleLoanClick}
            className="w-full px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white font-medium transition-colors text-left"
          >
            <span className="text-sm uppercase tracking-wider">Loan</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
