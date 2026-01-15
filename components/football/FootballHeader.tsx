'use client';

import Link from 'next/link';
import { Bell, Settings, User } from 'lucide-react';

export default function FootballHeader() {
  return (
    <header className="bg-zinc-800 border-b border-zinc-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/football" className="text-2xl font-bold text-white">
              LiveScore<span className="text-green-500">™</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Navigation moved to sidebar */}
          </nav>

          {/* Utility Icons */}
          <div className="flex items-center gap-4">
            <button className="text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-zinc-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="text-zinc-400 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
