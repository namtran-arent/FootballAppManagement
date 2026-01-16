'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ChevronLeft, ChevronRight, LogIn, User, LogOut } from 'lucide-react';
import { Facebook, Instagram } from 'lucide-react';
import LoginModal from './LoginModal';

export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Header */}
      <header className="relative z-10 container mx-auto px-3 md:px-6 py-4 md:py-6">
        <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <Link href="#about" className="text-zinc-900 uppercase text-xs md:text-sm font-medium hover:text-lime-600 transition-colors">
              About
            </Link>
            <Link href="#events" className="text-zinc-900 uppercase text-xs md:text-sm font-medium hover:text-lime-600 transition-colors">
              Events
            </Link>
            <Link href="#prices" className="text-zinc-900 uppercase text-xs md:text-sm font-medium hover:text-lime-600 transition-colors">
              Prices
            </Link>
            <Link href="#gallery" className="text-zinc-900 uppercase text-xs md:text-sm font-medium hover:text-lime-600 transition-colors">
              Gallery
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {session?.user ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 text-zinc-900">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                  <span className="text-xs md:text-sm font-medium hidden sm:inline">{session.user.name || session.user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 btn-gradient font-medium rounded-lg text-xs md:text-sm"
                >
                  <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 btn-gradient font-medium rounded-lg text-xs md:text-sm"
              >
                <LogIn className="w-3 h-3 md:w-4 md:h-4" />
                <span>Login</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <a href="#" className="text-zinc-900 hover:text-lime-600 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="#" className="text-zinc-900 hover:text-lime-600 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-3 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center min-h-[calc(100vh-180px)] md:min-h-[calc(100vh-200px)]">
          {/* Left Content Block */}
          <div className="space-y-4 md:space-y-6 z-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase text-zinc-900 leading-tight">
              SOCCER LIFE
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold uppercase text-lime-600">
              20 GOALS YOU WILL NEVER SEE AGAIN
            </h2>
            <p className="text-zinc-700 text-base md:text-lg leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.
            </p>

            {/* CTA Button to Football Management */}
            <div className="pt-2 md:pt-4 flex flex-col sm:flex-row gap-3 md:gap-4">
              {session?.user ? (
                <Link
                  href="/football"
                  className="inline-block px-8 py-3 btn-gradient uppercase font-bold"
                >
                  View Match Schedule
                </Link>
              ) : (
                <>
                  <button
                    disabled
                    className="px-8 py-3 bg-zinc-700 text-zinc-500 uppercase font-bold cursor-not-allowed opacity-50"
                  >
                    View Match Schedule
                  </button>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-8 py-3 bg-zinc-900 border border-zinc-800 text-white uppercase font-bold hover:bg-zinc-800 hover:border-lime-500 transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative z-20">
            {/* Circular Text Element */}
            <div className="absolute top-4 right-4 w-32 h-32 border-2 border-zinc-300 rounded-full flex items-center justify-center z-30 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full">
                  <defs>
                    <path
                      id="circle"
                      d="M 64,64 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                    />
                  </defs>
                  <text className="text-[8px] uppercase text-zinc-700 font-medium fill-zinc-700">
                    <textPath href="#circle" startOffset="0%">
                      LOREM IPSUM DOLOR SIT AMET, CONSECTETUER
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>

            {/* Soccer Player Image Placeholder */}
            <div className="relative w-full h-[600px] bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 rounded-lg overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-8xl animate-bounce">⚽</div>
                  <div className="text-zinc-900 text-xl font-semibold">Soccer Player</div>
                  <div className="text-zinc-600 text-sm">Action Shot</div>
                  <p className="text-zinc-600 text-xs mt-4">Add your soccer player image here</p>
                </div>
              </div>
              {/* You can replace this with an actual image using Next.js Image component:
              <Image 
                src="/soccer-player.jpg" 
                alt="Soccer Player" 
                fill 
                className="object-cover" 
                priority
              /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 mt-8">
        {/* Stylized Ground/Landscape */}
        <div className="relative h-32 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path
              d="M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z"
              fill="rgba(39, 39, 42, 0.8)"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Footer */}
        <div className="relative bg-zinc-950 border-t border-zinc-800">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Soccer Club Logo */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚽</span>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">SOCCER CLUB</div>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xs">★</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-zinc-800 rounded transition-colors">
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 hover:bg-zinc-800 rounded transition-colors">
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Footer Text */}
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <p className="text-zinc-500 text-xs uppercase">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed lorem ipsum dolor sit amet, consectetuer adipiscing elit, selorem ipsum dolor sit. Lorem ipsum dolor sit amet, consectetuer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
