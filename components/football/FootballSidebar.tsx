'use client';

import { LogOut, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface FootballSidebarProps {
  selectedTeam?: string | null;
  onTeamChange?: (team: string | null) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function FootballSidebar({
  selectedTeam,
  onTeamChange,
  searchQuery,
  onSearchChange,
}: FootballSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleMatchScheduleClick = () => {
    router.push('/football');
  };

  const handleTeamsClick = () => {
    router.push('/teams');
  };

  const handleLoanClick = () => {
    router.push('/loans');
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside className="w-64 bg-zinc-800 border-r border-zinc-700 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Match Schedule Button */}
        <div>
          <button
            onClick={handleMatchScheduleClick}
            className={`w-full px-3 py-2 rounded-lg text-white font-medium transition-colors text-left ${
              isActive('/football')
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            <span className="text-sm uppercase tracking-wider">Match Schedule</span>
          </button>
        </div>

        {/* Teams Button */}
        <div>
          <button
            onClick={handleTeamsClick}
            className={`w-full px-3 py-2 rounded-lg text-white font-medium transition-colors text-left ${
              isActive('/teams')
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            <span className="text-sm uppercase tracking-wider">Teams</span>
          </button>
        </div>

        {/* Loan Button */}
        <div>
          <button
            onClick={handleLoanClick}
            className={`w-full px-3 py-2 rounded-lg text-white font-medium transition-colors text-left ${
              isActive('/loans')
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            <span className="text-sm uppercase tracking-wider">Loan</span>
          </button>
        </div>
      </div>

      {/* User Details and Logout - Fixed at bottom */}
      <div className="p-4 border-t border-zinc-700 space-y-3 flex-shrink-0">
        {/* User Details */}
        {session?.user && (
          <div className="flex items-center gap-3">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 outline-none border-none"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0 outline-none border-none">
                <User className="w-5 h-5 text-zinc-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user.name || 'User'}
              </p>
              {session.user.email && (
                <p className="text-xs text-zinc-400 truncate">
                  {session.user.email}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
