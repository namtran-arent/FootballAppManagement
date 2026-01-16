'use client';

import Link from 'next/link';
import { Bell, Settings, User, Menu, X } from 'lucide-react';

interface FootballHeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export default function FootballHeader({ onMenuToggle, isMenuOpen }: FootballHeaderProps) {
  return (
    <header className="glass-card border-b border-zinc-200/50 sticky top-0 z-50 mx-2 md:mx-4 mt-2 md:mt-4 mb-2">
      <div className="container mx-auto px-3 md:px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-zinc-600 hover:text-zinc-900 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex items-center flex-1 lg:flex-none justify-center lg:justify-start">
            <Link href="/football" className="text-xl md:text-2xl font-bold text-zinc-900">
              LiveScore<span className="text-green-600">™</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {/* Navigation moved to sidebar */}
          </nav>

          {/* Utility Icons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-zinc-600 hover:text-zinc-900 transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-zinc-600 hover:text-zinc-900 transition-colors" aria-label="Settings">
              <Settings className="w-5 h-5" />
            </button>
            <button className="text-zinc-600 hover:text-zinc-900 transition-colors" aria-label="User">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
