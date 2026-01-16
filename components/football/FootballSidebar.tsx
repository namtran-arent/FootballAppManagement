'use client';

import { LogOut, User, Home, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface FootballSidebarProps {
  selectedTeam?: string | null;
  onTeamChange?: (team: string | null) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function FootballSidebar({
  selectedTeam,
  onTeamChange,
  searchQuery,
  onSearchChange,
  isOpen = true,
  onClose,
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

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleNavigation = (callback: () => void) => {
    callback();
    // Close mobile menu after navigation
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0
          w-64 h-full lg:h-[calc(100vh-100px)]
          glass-card border-r border-zinc-200/50
          flex flex-col overflow-hidden
          z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:mx-4 lg:mt-4 lg:mb-6
        `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-200/50">
          <h2 className="text-lg font-semibold text-zinc-900">Menu</h2>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-900 transition-colors p-1"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      <div className="flex-1 p-4 space-y-6 overflow-y-auto min-h-0">
        {/* Home Button */}
        <div>
          <button
            onClick={() => handleNavigation(handleHomeClick)}
            className={`w-full px-3 py-2 rounded-lg font-medium transition-colors text-left ${
              pathname === '/'
                ? 'btn-gradient text-white'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider">Home</span>
            </div>
          </button>
        </div>

        {/* Match Schedule Button */}
        <div>
          <button
            onClick={() => handleNavigation(handleMatchScheduleClick)}
            className={`w-full px-3 py-2 rounded-lg font-medium transition-colors text-left ${
              isActive('/football')
                ? 'btn-gradient text-white'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
            }`}
          >
            <span className="text-sm uppercase tracking-wider">Match Schedule</span>
          </button>
        </div>

        {/* Teams Button */}
        <div>
          <button
            onClick={() => handleNavigation(handleTeamsClick)}
            className={`w-full px-3 py-2 rounded-lg font-medium transition-colors text-left ${
              isActive('/teams')
                ? 'btn-gradient text-white'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
            }`}
          >
            <span className="text-sm uppercase tracking-wider">Teams</span>
          </button>
        </div>

        {/* Loan Button */}
        <div>
          <button
            onClick={() => handleNavigation(handleLoanClick)}
            className={`w-full px-3 py-2 rounded-lg font-medium transition-colors text-left ${
              isActive('/loans')
                ? 'btn-gradient text-white'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
            }`}
          >
            <span className="text-sm uppercase tracking-wider">Loan</span>
          </button>
        </div>
      </div>

      {/* User Details and Logout - Fixed at bottom */}
      <div className="p-4 pt-3 border-t border-zinc-200/50 space-y-2 flex-shrink-0">
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
              <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center flex-shrink-0 outline-none border-none">
                <User className="w-5 h-5 text-zinc-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">
                {session.user.name || 'User'}
              </p>
              {session.user.email && (
                <p className="text-xs text-zinc-600 truncate">
                  {session.user.email}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 btn-gradient rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}
