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
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <Link 
              href="/"
              className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors"
            >
              <Music className="w-6 h-6" />
              <span className="text-xl font-bold">TemiLyrics</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Song header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Meaning of <span className="gradient-text">{title}</span>
          </h1>
          <div className="flex items-center space-x-4 text-gray-400">
            <span>by <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer">{artist}</span></span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-gray-400">Connecting the dots in the music...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="glass-card p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <Music className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Analysis Error</h3>
              <p className="text-gray-300 max-w-md mx-auto">
                Hmm, we couldn't find enough information about this song. Try again later?
              </p>
              <button
                onClick={loadSongInterpretation}
                className="accent-gradient text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Interpretation content */}
        {!isLoading && !error && interpretation && (
          <div className="space-y-8">
            {/* Overview */}
            <div className="glass-card p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Theme</h3>
                  <p className="text-gray-300">{interpretation.theme}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Tone</h3>
                  <p className="text-gray-300">{interpretation.tone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Summary</h3>
                <p className="text-gray-300 leading-relaxed">{interpretation.summary}</p>
              </div>
            </div>

            {/* Line Analysis */}
            {interpretation.line_analysis && interpretation.line_analysis.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Line-by-Line Analysis</h3>
                <div className="space-y-4">
                  {interpretation.line_analysis.map((analysis, index) => (
                    <div key={index} className="border-l-2 border-cyan-400/50 pl-4 py-2">
                      <p className="text-cyan-400 font-medium mb-1">"{analysis.line}"</p>
                      <p className="text-gray-300">{analysis.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cultural References */}
            {interpretation.cultural_references && interpretation.cultural_references.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Cultural & Spiritual References</h3>
                <div className="grid gap-3">
                  {interpretation.cultural_references.map((reference, index) => (
                    <div key={index} className="bg-cyan-400/10 rounded-lg p-3">
                      <p className="text-gray-300">{reference}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Events */}
            {interpretation.related_events && interpretation.related_events.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Related Life Events</h3>
                <div className="space-y-4">
                  {interpretation.related_events.map((event, index) => (
                    <div key={index} className="border border-white/10 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-cyan-400 mb-2">{event.event_type}</h4>
                      <p className="text-gray-300 mb-2">{event.possible_event_context}</p>
                      <div className="bg-white/5 rounded p-3 mb-2">
                        <p className="text-sm text-gray-400 mb-1">Lyric Evidence:</p>
                        <p className="text-cyan-300">"{event.lyric_evidence}"</p>
                      </div>
                      <p className="text-gray-300">{event.interpretation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Context */}
            {interpretation.external_context && interpretation.external_context.source && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">External Context</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Source: {interpretation.external_context.source}</p>
                    <blockquote className="border-l-2 border-cyan-400/50 pl-4 py-2 bg-white/5 rounded-r">
                      <p className="text-cyan-300 italic">"{interpretation.external_context.quote}"</p>
                    </blockquote>
                  </div>
                  <p className="text-gray-300">{interpretation.external_context.relevance_to_lyrics}</p>
                </div>
              </div>
            )}

            {/* AI Disclaimer & Feedback */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">
                  <span className="text-cyan-400">✨ Crafted by AI with care</span> - Interpretations are generated by advanced AI and may not reflect the artist's intended meaning.
                </p>
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Helpful?</span>
                  <button
                    onClick={() => handleFeedback('up')}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback === 'up' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'hover:bg-white/10 text-gray-400'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleFeedback('down')}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback === 'down' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'hover:bg-white/10 text-gray-400'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
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