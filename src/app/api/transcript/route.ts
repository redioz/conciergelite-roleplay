import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      profile_id,
      profile_name,
      transcript,
      full_transcript,
      scoring,
      duration_seconds,
      model,
      started_at,
    } = body;

    if (!full_transcript || !profile_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert into Supabase
    const res = await fetch(`${SUPABASE_URL}/rest/v1/roleplay_sessions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        profile_id,
        profile_name,
        transcript_entries: transcript,
        full_transcript,
        score_total: scoring?.total ?? null,
        score_details: scoring ?? null,
        duration_seconds: duration_seconds ?? null,
        model: model ?? null,
        started_at: started_at ?? new Date().toISOString(),
        tenant_id: 'maroc',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Supabase insert error:', err);
      return NextResponse.json({ error: 'Failed to save transcript', details: err }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, id: data[0]?.id });
  } catch (err: any) {
    console.error('Transcript API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
