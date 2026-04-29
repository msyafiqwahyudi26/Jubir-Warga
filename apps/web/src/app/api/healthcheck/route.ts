import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Health check endpoint untuk verify Supabase connection alive.
 * Akan dipakai UptimeRobot di production. Cek di:
 *   - http://localhost:3000/api/healthcheck (dev)
 *   - https://app.jubir.spdindonesia.org/api/healthcheck (prod)
 */
export async function GET() {
  const startedAt = Date.now();

  try {
    const supabase = await createClient();
    // Lightest possible read — count chapters (should always return 7)
    const { count, error } = await supabase
      .from('chapters')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json(
        {
          status: 'degraded',
          error: error.message,
          durationMs: Date.now() - startedAt,
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      status: 'ok',
      service: 'jubir-warga-web',
      version: '0.2.0',
      supabase: {
        connected: true,
        chaptersCount: count,
      },
      durationMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: 'down',
        error: e instanceof Error ? e.message : 'unknown',
        durationMs: Date.now() - startedAt,
      },
      { status: 500 },
    );
  }
}
