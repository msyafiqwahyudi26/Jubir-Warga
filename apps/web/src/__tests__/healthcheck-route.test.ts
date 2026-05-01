import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: () => ({
      select: () => Promise.resolve({ count: 7, error: null }),
    }),
  })),
}));

const { GET } = await import('@/app/api/healthcheck/route');

describe('GET /api/healthcheck', () => {
  it('returns 200 with status ok when supabase responds', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.supabase.connected).toBe(true);
    expect(data.supabase.chaptersCount).toBe(7);
    expect(typeof data.durationMs).toBe('number');
  });
});
