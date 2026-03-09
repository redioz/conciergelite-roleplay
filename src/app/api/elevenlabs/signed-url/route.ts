import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;

export async function GET(req: NextRequest) {
  try {
    const agentId = req.nextUrl.searchParams.get('agentId');
    if (!agentId) {
      return NextResponse.json({ error: 'Missing agentId' }, { status: 400 });
    }

    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('ElevenLabs signed URL error:', err);
      return NextResponse.json(
        { error: 'Failed to get signed URL', details: err },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (err: any) {
    console.error('Signed URL API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
