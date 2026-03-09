import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

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

    const supabase = await createServerClient();

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;

    // Insert into roleplay_sessions
    const { data, error } = await supabase
      .from('roleplay_sessions')
      .insert({
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
        user_id: userId,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save transcript', details: error.message }, { status: 500 });
    }

    // Track daily usage if user is authenticated
    if (userId && duration_seconds && duration_seconds > 0) {
      const today = new Date().toISOString().split('T')[0];
      const { error: usageError } = await supabase.rpc('increment_usage', {
        p_user_id: userId,
        p_date: today,
        p_seconds: Math.round(duration_seconds),
      });

      if (usageError) {
        console.error('Usage tracking error:', usageError);
        // Don't fail the request — usage tracking is non-critical
      }
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error('Transcript API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
