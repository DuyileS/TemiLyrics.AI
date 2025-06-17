'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Music, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  id: number;
  title: string;
  artist: string;
  full_title: string;
  thumbnail_url?: string;
  header_image_thumbnail_url?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (query) {
      searchSongs(query);
    }
  }, [query]);

  const searchSongs = async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search songs');
      }
      
      setResults(data.songs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSongClick = (song: SearchResult) => {
    router.push(`/song/${song.id}?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <Music className="w-6 h-6" />
                <span className="text-xl font-bold">TemiLyrics</span>
              </Link>
            </div>
            
            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="glass-card p-2">
                <div className="flex items-center space-x-3">
                  <Search className="w-5 h-5 text-gray-400 ml-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a song or artist..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none py-2"
                  />
                  <button
                    type="submit"
                    className="accent-gradient text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Search results for "{query}"
          </h1>
          <p className="text-gray-400">
            {isLoading ? 'Searching...' : `${results.length} results found`}
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-gray-400">Taking a closer look at those lyrics...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="glass-card p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Search Error</h3>
              <p className="text-gray-300 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => searchSongs(query)}
                className="accent-gradient text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* No results */}
        {!isLoading && !error && results.length === 0 && (
          <div className="glass-card p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">No Results Found</h3>
              <p className="text-gray-300 max-w-md mx-auto">
                Hmm, we couldn't find any songs matching "{query}". Try a different search term or check the spelling.
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && results.length > 0 && (
          <div className="space-y-4">
            {results.map((song) => (
              <div
                key={song.id}
                onClick={() => handleSongClick(song)}
                className="glass-card p-6 hover:bg-white/10 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 accent-gradient rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-200">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-gray-400 truncate">
                      by {song.artist}
                    </p>
                  </div>
                  
                  <div className="text-gray-500 group-hover:text-cyan-400 transition-colors">
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}