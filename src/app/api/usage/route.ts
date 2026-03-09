import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const DAILY_LIMIT_SECONDS = 3600; // 60 minutes

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_usage')
      .select('seconds_used')
      .eq('user_id', user.id)
      .eq('usage_date', today)
      .maybeSingle();

    if (error) {
      console.error('Usage query error:', error);
      return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 });
    }

    const secondsUsed = data?.seconds_used || 0;
    const secondsRemaining = Math.max(0, DAILY_LIMIT_SECONDS - secondsUsed);

    return NextResponse.json({
      seconds_used: secondsUsed,
      seconds_remaining: secondsRemaining,
      limit_seconds: DAILY_LIMIT_SECONDS,
    });
  } catch (err: any) {
    console.error('Usage API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
