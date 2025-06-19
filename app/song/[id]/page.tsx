'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Music, ThumbsUp, ThumbsDown, Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';

interface LyricsInterpretation {
  theme: string;
  tone: string;
  summary: string;
  line_analysis: Array<{
    line: string;
    meaning: string;
  }>;
  cultural_references: string[];
  related_events: Array<{
    event_type: string;
    possible_event_context: string;
    lyric_evidence: string;
    interpretation: string;
  }>;
  external_context: {
    source: string;
    quote: string;
    relevance_to_lyrics: string;
  };
}

export default function SongPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const songId = params.id as string;
  const title = searchParams.get('title') || '';
  const artist = searchParams.get('artist') || '';
  
  const [interpretation, setInterpretation] = useState<LyricsInterpretation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (songId) {
      loadSongInterpretation();
    }
  }, [songId]);

  const loadSongInterpretation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First get lyrics
      const lyricsResponse = await fetch(`/api/lyrics?id=${songId}`);
      const lyricsData = await lyricsResponse.json();
      
      if (!lyricsResponse.ok) {
        throw new Error(lyricsData.error || 'Failed to fetch lyrics');
      }
      
      // Then get interpretation
      const interpretResponse = await fetch('/api/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lyrics: lyricsData.lyrics,
          title,
          artist,
        }),
      });
      
      const interpretData = await interpretResponse.json();
      
      if (!interpretResponse.ok) {
        throw new Error(interpretData.error || 'Failed to interpret lyrics');
      }
      
      setInterpretation(interpretData.interpretation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    // In a real app, you'd send this feedback to your analytics service
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base hidden sm:inline">Back</span>
            </button>
            
            <Link 
              href="/"
              className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors"
            >
              <Music className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-base sm:text-xl font-bold">TemiLyrics</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Song header */}
        <div className="mb-6 sm:mb-8 px-1 sm:px-0">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Meaning of <span className="gradient-text break-words">{title}</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-400 text-sm sm:text-base">
            <span>by <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer break-words">{artist}</span></span>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 sm:py-16">
            <div className="text-center space-y-4">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-gray-400 text-sm sm:text-base px-4">Connecting the dots in the music...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="glass-card p-6 sm:p-8 text-center mx-2 sm:mx-0">
            <div className="space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <Music className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
              </div>
              <h3 className="text-base sm:text-xl font-semibold text-white">Analysis Error</h3>
              <p className="text-gray-300 max-w-md mx-auto text-sm sm:text-base leading-relaxed px-2">
                Hmm, we couldn't find enough information about this song. Try again later?
              </p>
              <button
                onClick={loadSongInterpretation}
                className="accent-gradient text-white px-4 sm:px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 text-sm sm:text-base min-h-[44px]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Interpretation content */}
        {!isLoading && !error && interpretation && (
          <div className="space-y-6 sm:space-y-8 px-1 sm:px-0">
            {/* Overview */}
            <div className="glass-card p-5 sm:p-6 space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-cyan-400 mb-3">Theme</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{interpretation.theme}</p>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-cyan-400 mb-3">Tone</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{interpretation.tone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-cyan-400 mb-3">Summary</h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{interpretation.summary}</p>
              </div>
            </div>

            {/* Line Analysis */}
            {interpretation.line_analysis && interpretation.line_analysis.length > 0 && (
              <div className="glass-card p-5 sm:p-6">
                <h3 className="text-base sm:text-xl font-semibold text-white mb-4 sm:mb-4">Line-by-Line Analysis</h3>
                <div className="space-y-4 sm:space-y-4">
                  {interpretation.line_analysis.map((analysis, index) => (
                    <div key={index} className="border-l-2 border-cyan-400/50 pl-4 sm:pl-4 py-3">
                      <p className="text-cyan-400 font-medium mb-2 text-sm sm:text-base leading-relaxed">"{analysis.line}"</p>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{analysis.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cultural References */}
            {interpretation.cultural_references && interpretation.cultural_references.length > 0 && (
              <div className="glass-card p-5 sm:p-6">
                <h3 className="text-base sm:text-xl font-semibold text-white mb-4 sm:mb-4">Cultural & Spiritual References</h3>
                <div className="grid gap-3 sm:gap-3">
                  {interpretation.cultural_references.map((reference, index) => (
                    <div key={index} className="bg-cyan-400/10 rounded-lg p-4">
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{reference}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Events */}
            {interpretation.related_events && interpretation.related_events.length > 0 && (
              <div className="glass-card p-5 sm:p-6">
                <h3 className="text-base sm:text-xl font-semibold text-white mb-4 sm:mb-4">Related Life Events</h3>
                <div className="space-y-4 sm:space-y-4">
                  {interpretation.related_events.map((event, index) => (
                    <div key={index} className="border border-white/10 rounded-lg p-4 sm:p-4">
                      <h4 className="text-base sm:text-lg font-medium text-cyan-400 mb-3">{event.event_type}</h4>
                      <p className="text-gray-300 mb-3 text-sm sm:text-base leading-relaxed">{event.possible_event_context}</p>
                      <div className="bg-white/5 rounded p-3 sm:p-3 mb-3">
                        <p className="text-xs sm:text-sm text-gray-400 mb-2">Lyric Evidence:</p>
                        <p className="text-cyan-300 text-sm sm:text-base leading-relaxed">"{event.lyric_evidence}"</p>
                      </div>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{event.interpretation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Context */}
            {interpretation.external_context && interpretation.external_context.source && (
              <div className="glass-card p-5 sm:p-6">
                <h3 className="text-base sm:text-xl font-semibold text-white mb-4 sm:mb-4">External Context</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2">Source: {interpretation.external_context.source}</p>
                    <blockquote className="border-l-2 border-cyan-400/50 pl-4 sm:pl-4 py-3 bg-white/5 rounded-r">
                      <p className="text-cyan-300 italic text-sm sm:text-base leading-relaxed">"{interpretation.external_context.quote}"</p>
                    </blockquote>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{interpretation.external_context.relevance_to_lyrics}</p>
                </div>
              </div>
            )}

            {/* AI Disclaimer & Feedback */}
            <div className="glass-card p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  <span className="text-cyan-400">✨ Crafted by AI with care</span> - Interpretations are generated by advanced AI and may not reflect the artist's intended meaning.
                </p>
                
                <div className="flex items-center space-x-3 justify-center sm:justify-start">
                  <span className="text-gray-400 text-xs sm:text-sm">Helpful?</span>
                  <button
                    onClick={() => handleFeedback('up')}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback === 'up' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'hover:bg-white/10 text-gray-400'
                    } min-h-[40px] min-w-[40px] flex items-center justify-center`}
                  >
                    <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleFeedback('down')}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback === 'down' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'hover:bg-white/10 text-gray-400'
                    } min-h-[40px] min-w-[40px] flex items-center justify-center`}
                  >
                    <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}