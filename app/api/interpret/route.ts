// File: app/api/interpret/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { lyrics, title, artist } = await request.json();

    if (!lyrics || !title || !artist) {
      return NextResponse.json(
        { error: 'Lyrics, title, and artist are required' },
        { status: 400 }
      );
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured in .env' },
        { status: 500 }
      );
    }
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured in .env' },
        { status: 500 }
      );
    }

    const systemPrompt = `
You are a deeply insightful music analyst and cultural observer. 
You will receive a song's lyrics along with the title and artist. 
You are given the full lyrics of a song. Your task is to interpret the song with empathy, creativity, and deep understanding.  
Provide the line-by-line analysis by aggregation. Do not include long or direct excerpts from the song, just highlight lyrics that stand out.
Do not make the summary for each song short, let it have good amount of content that really inspires the user. If it also relates to a similar song by the artist or other notable artistes in that genre, include it in the summary
If the song broke records or won major awards, include it as part of the summary
Also use the overall message you get from the lyrics to fact-check some aspects of the summary you generate 

 Your output should include:
 1. Theme  
 2. Tone  
 3. Overall Summary  
 4. Line Analysis:
      -For choruses: Treat the entire chorus as one "line" and analyze it as a cohesive unit, explaining its central message and how it resonates with the song's overall theme
      -For verses/solos: Group lyrics into meaningful segments of 5+ lines and be careful not to include slashes, and analyze them together as one "line" entry, focusing on how these grouped lines work cohesively rather than individual line meanings 
 5. Cultural or Spiritual References  
 6. Related Life Events from the artist’s real experiences:
    - childbirth, relationships, loss, salvation, awards, disses, violence, reconciliation  
 7. External Context:
    - If the artist, their team, or collaborators have spoken about the song in interviews, press releases, tweets, podcasts, etc., include that quote and explain how it adds depth to the interpretation. Give credible source for it as well, do not generate false information
    - If no external context is known, say so.
For each event detected, explain:
- What event it likely relates to
- Why you think the lyrics point to that
- How it deepens the interpretation

Analyze the lyrics and respond in **strict JSON only**. Do not add markdown, commentary, explanations, or text before or after the JSON.


Structure your output like this:
{
  "theme": "...",
  "tone": "...",
  "summary": "...",
  "line_analysis": [{ "line": "...", "meaning": "..." }],
  "cultural_references": ["..."],
  "related_events": [
    {
      "event_type": "...",
      "possible_event_context": "...",
      "lyric_evidence": "...",
      "interpretation": "..."
    }
  ],
  "external_context": {
    "source": "...",
    "quote": "...",
    "relevance_to_lyrics": "..."
  }
}
`;

    const llamaResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Title: ${title}\nArtist: ${artist}\nLyrics:\n"""${lyrics.replace(/"/g, '\\"')}"""\n\nRespond only in JSON format.`
          }
        ],
        temperature: 0.7
      })
    });

    const result = await llamaResponse.json();
    const interpretationText =
      result?.choices?.[0]?.message?.content?.trim() ?? null;

    if (!interpretationText) {
      return NextResponse.json(
        { error: 'Model did not return any response' },
        { status: 502 }
      );
    }

    // Try strict JSON parse
    let parsedInterpretation;
    try {
      parsedInterpretation = JSON.parse(interpretationText);
    } catch (e) {
      // Try extracting JSON from mixed response
      const jsonMatch = interpretationText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedInterpretation = JSON.parse(jsonMatch[0]);
        } catch (e) {
          return NextResponse.json(
            {
              error: 'Failed to parse extracted JSON.',
              raw: jsonMatch[0]
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          {
            error: 'Interpretation was not returned in valid JSON format.',
            raw: interpretationText
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ interpretation: parsedInterpretation });

  } catch (error) {
    console.error('Interpret API error:', error);
    return NextResponse.json(
      { error: 'Failed to interpret lyrics' },
      { status: 500 }
    );
  }
}
