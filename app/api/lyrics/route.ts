import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const songId = searchParams.get('id');
  
  if (!songId) {
    return NextResponse.json({ error: 'Song ID is required' }, { status: 400 });
  }

  try {
    const geniusToken = process.env.GENIUS_ACCESS_TOKEN;
    
    if (!geniusToken) {
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Get song details from Genius API
    const songResponse = await fetch(
      `https://api.genius.com/songs/${songId}`,
      {
        headers: {
          'Authorization': `Bearer ${geniusToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'TemiLyrics/1.0',
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
Looking at the stars tonight
Wondering if you're thinking of me
All the words we never said
Echo in my memory

[Chorus]
Yes to heaven, yes to you
Every moment feels so true
In your arms I find my way
Yes to heaven every day

[Verse 2]
Dancing in the moonlight glow
Time stands still when you're near
All my fears just fade away
When I feel you here

[Bridge]
Take my hand and hold it tight
We can make it through the night
Love like ours will never die
Underneath this starlit sky

[Outro]
Yes to heaven, yes to love
You're the one I'm dreaming of
Forever starts with you and me
Yes to heaven, we are free`;

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