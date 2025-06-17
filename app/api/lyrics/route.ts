import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const songId = searchParams.get('id');
  
  if (!songId) {
    return NextResponse.json({ error: 'Song ID is required' }, { status: 400 });
  }

  try {
    // Get song details from Genius API
    const songResponse = await fetch(
      `https://api.genius.com/songs/${songId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!songResponse.ok) {
      throw new Error('Failed to fetch song from Genius API');
    }

    const songData = await songResponse.json();
    const song = songData.response.song;
    
    // For this demo, we'll return a placeholder since scraping lyrics requires additional setup
    // In a production app, you'd need to implement proper lyrics scraping or use a lyrics API
    const placeholderLyrics = `[Verse 1]
This is a placeholder for song lyrics
The actual implementation would fetch real lyrics
From the Genius website or use a lyrics API service

[Chorus]
These lyrics would be analyzed by AI
To provide meaningful interpretation
Understanding themes, emotions, and context

[Verse 2]
Cultural references would be identified
Personal stories and experiences revealed
The deeper meaning behind the words

[Bridge]
Every line tells a story
Every word has weight
Music is more than sound
It's the human experience

[Outro]
This is just a demonstration
Real lyrics would provide better analysis
TemiLyrics - Understanding music deeper`;

    return NextResponse.json({
      lyrics: placeholderLyrics,
      title: song.title,
      artist: song.primary_artist.name,
      url: song.url,
    });
  } catch (error) {
    console.error('Lyrics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lyrics' },
      { status: 500 }
    );
  }
}