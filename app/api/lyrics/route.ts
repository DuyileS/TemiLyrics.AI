import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const artist = searchParams.get('artist');

  if (!title || !artist) {
    return NextResponse.json({ error: 'Both title and artist are required' }, { status: 400 });
  }

  try {
    // const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    const response = await fetch(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(title)}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch error:', response.status, response.statusText, errorText);
      return NextResponse.json({ error: 'Lyrics not found or failed to fetch', details: errorText }, { status: 404 });
    }

    const data = await response.json();
    // const lyrics = data?.lyrics?.trim();
    const lyrics = data?.plainLyrics?.trim();
    console.log("Lyrics from LRCLIB", lyrics);

    if (!lyrics) {
      return NextResponse.json({ error: 'No lyrics returned' }, { status: 404 });
    }

    return NextResponse.json({
      lyrics,
      title,
      artist,
      // source: 'lyrics.ovh',
      source: 'lrclib.net',
    });
  } catch (error) {
    // console.error('Lyrics.ovh API error:', error);
    console.error('LRCLIB API error:', error);
    return NextResponse.json(
      // { error: 'Failed to fetch lyrics from lyrics.ovh' },
      { error: 'Failed to fetch lyrics from LRCLIB' },
      { status: 500 }
    );
  }
}
