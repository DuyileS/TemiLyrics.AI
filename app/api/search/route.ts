import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const geniusToken = process.env.GENIUS_ACCESS_TOKEN;
    
    if (!geniusToken) {
      console.error('GENIUS_ACCESS_TOKEN not found in environment variables');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }


    const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${geniusToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TemiLyrics/1.0',
      },
    });



    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Genius API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Transform the results to match our interface
    const songs = data.response.hits.map((hit: any) => ({
      id: hit.result.id,
      title: hit.result.title,
      artist: hit.result.primary_artist.name,
      full_title: hit.result.full_title,
      thumbnail_url: hit.result.song_art_image_thumbnail_url,
      header_image_thumbnail_url: hit.result.header_image_thumbnail_url,
    }));



    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search songs' },
      { status: 500 }
    );
  }
}