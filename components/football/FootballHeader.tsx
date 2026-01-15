'use client';

import Link from 'next/link';
import { Bell, Settings, User } from 'lucide-react';

export default function FootballHeader() {
  return (
    <header className="glass-card border-b border-zinc-200/50 sticky top-0 z-50 mx-4 mt-4 mb-2">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/football" className="text-2xl font-bold text-zinc-900">
              LiveScore<span className="text-green-600">™</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Navigation moved to sidebar */}
          </nav>

          {/* Utility Icons */}
          <div className="flex items-center gap-4">
            <button className="text-zinc-600 hover:text-zinc-900 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-zinc-600 hover:text-zinc-900 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="text-zinc-600 hover:text-zinc-900 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
