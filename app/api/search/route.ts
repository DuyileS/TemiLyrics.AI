import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.genius.com/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search Genius API');
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
      { error: 'Failed to search songs' },
      { status: 500 }
    );
  }
}