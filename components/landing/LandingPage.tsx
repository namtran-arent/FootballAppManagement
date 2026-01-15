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
    <div className="min-h-screen bg-zinc-900 text-white relative overflow-hidden">
      {/* Textured Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 opacity-90">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.02) 2px,
            rgba(255, 255, 255, 0.02) 4px
          )`
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="#about" className="text-white uppercase text-sm font-medium hover:text-lime-400 transition-colors">
              About
            </Link>
            <Link href="#events" className="text-white uppercase text-sm font-medium hover:text-lime-400 transition-colors">
              Events
            </Link>
            <Link href="#prices" className="text-white uppercase text-sm font-medium hover:text-lime-400 transition-colors">
              Prices
            </Link>
            <Link href="#gallery" className="text-white uppercase text-sm font-medium hover:text-lime-400 transition-colors">
              Gallery
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="text-sm">{session.user.name || session.user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-zinc-900 font-medium rounded-lg hover:bg-lime-300 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
            <a href="#" className="text-white hover:text-lime-400 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-white hover:text-lime-400 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-200px)]">
          {/* Left Content Block */}
          <div className="space-y-6 z-20">
            <h1 className="text-6xl md:text-7xl font-bold uppercase text-white leading-tight">
              SOCCER LIFE
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold uppercase text-lime-400">
              20 GOALS YOU WILL NEVER SEE AGAIN
            </h2>
            <p className="text-white text-lg leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.
            </p>

            {/* CTA Button to Football Management */}
            <div className="pt-4 flex gap-4">
              {session?.user ? (
                <Link
                  href="/football"
                  className="inline-block px-8 py-3 bg-lime-400 text-zinc-900 uppercase font-bold hover:bg-lime-300 transition-colors"
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
                    className="px-8 py-3 bg-zinc-800 border border-zinc-700 text-white uppercase font-bold hover:bg-zinc-700 hover:border-lime-400 transition-colors"
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
            <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full flex items-center justify-center z-30 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full">
                  <defs>
                    <path
                      id="circle"
                      d="M 64,64 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                    />
                  </defs>
                  <text className="text-[8px] uppercase text-white font-medium fill-white">
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
                  <div className="text-white text-xl font-semibold">Soccer Player</div>
                  <div className="text-zinc-400 text-sm">Action Shot</div>
                  <p className="text-zinc-500 text-xs mt-4">Add your soccer player image here</p>
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
