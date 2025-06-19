'use client';

import { useState } from 'react';
import { Search, Music, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-600/20 via-transparent to-transparent" />
      
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <Music className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white">TemiLyrics</h1>
        </div>
        
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-white hover:bg-white/20 transition-all duration-200"
        >
          <span className="hidden sm:inline">Built with Bolt.new</span>
          <span className="sm:hidden">Bolt.new</span>
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
        </a>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 pt-8 sm:pt-20 pb-16 sm:pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Hero section */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-tight">
              <span className="gradient-text">
                Explore the heart and soul
              </span>
              <br />
              <span className="text-white">
                behind your favorite music
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
              Go beyond just listening – understand what your favorite songs are truly about with AI that breaks down the stories behind the music.
            </p>
          </div>

          {/* Search section */}
          <div className="max-w-2xl mx-auto space-y-4 px-2">
            <form onSubmit={handleSearch} className="relative">
              <div className="glass-card p-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 ml-3 sm:ml-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a song or artist..."
                      className="flex-1 bg-transparent text-white placeholder-gray-400 text-base sm:text-lg focus:outline-none py-3 sm:py-4 pr-3"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !searchQuery.trim()}
                    className="accent-gradient text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
            </form>
            
            <p className="text-gray-400 text-sm px-2">
              Try: "23 Burna Boy" or "Yes to Heaven Lana Del Rey"
            </p>
          </div>

          {/* Features preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 max-w-4xl mx-auto px-2">
            <div className="glass-card p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 accent-gradient rounded-full flex items-center justify-center mx-auto">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">Smart Search</h3>
              <p className="text-sm sm:text-base text-gray-300">Find any song with intelligent search that understands context and variations.</p>
            </div>
            
            <div className="glass-card p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 accent-gradient rounded-full flex items-center justify-center mx-auto">
                <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">Deep Analysis</h3>
              <p className="text-sm sm:text-base text-gray-300">AI-powered interpretation revealing themes, cultural references, and hidden meanings.</p>
            </div>
            
            <div className="glass-card p-4 sm:p-6 text-center space-y-3 sm:space-y-4 sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 accent-gradient rounded-full flex items-center justify-center mx-auto">
                <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">Context & Story</h3>
              <p className="text-sm sm:text-base text-gray-300">Discover the real-life events and stories that inspired your favorite songs.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}