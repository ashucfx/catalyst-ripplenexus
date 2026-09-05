import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCookie } from '@/lib/auth/admin';
import { getDb } from '@/lib/db/supabase';
import { DEFAULT_COST_PROFILES } from '@/lib/payment/costEngine';

export async function GET() {
  if (!(await verifyAdminCookie())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    if (db) {
      const { data, error } = await db
        .from('cost_profiles')
        .select('*')
        .order('id', { ascending: true });

      if (data && !error && data.length > 0) {
        return NextResponse.json({ success: true, data });
      }
    }

    // Fallback to default in-memory profiles
    return NextResponse.json({
      success: true,
      data: Object.values(DEFAULT_COST_PROFILES),
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[/api/cost-engine/profiles] GET error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch cost profiles' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!(await verifyAdminCookie())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 });
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    const { data, error } = await db
      .from('cost_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[/api/cost-engine/profiles] PUT error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update cost profile' },
      { status: 500 }
    );
  }
}
