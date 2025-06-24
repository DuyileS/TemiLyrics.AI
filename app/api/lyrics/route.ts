import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const artist = searchParams.get('artist');

  if (!title || !artist) {
    return NextResponse.json({ error: 'Both title and artist are required' }, { status: 400 });
  }

  try {
    // Step 1: Fetch lyrics from lyrics.ovh
    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);

    if (!response.ok) {
      return NextResponse.json({ error: 'Lyrics not found or failed to fetch' }, { status: 404 });
    }

    const data = await response.json();
    const lyrics = data?.lyrics?.trim();
    //console.log("Lyrics", lyrics);
    

    if (!lyrics) {
      return NextResponse.json({ error: 'No lyrics returned from lyrics.ovh' }, { status: 404 });
    }

    return NextResponse.json({
      lyrics,
      title,
      artist,
      source: 'lyrics.ovh',
    });
  } catch (error) {
    console.error('Lyrics.ovh API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lyrics from lyrics.ovh' },
      { status: 500 }
    );
  }
}
