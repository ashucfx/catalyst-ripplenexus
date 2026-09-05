import { NextResponse } from 'next/server';
import { verifyAdminCookie } from '@/lib/auth/admin';
import { getDb } from '@/lib/db/supabase';
import { generateCostRecommendations } from '@/lib/payment/costEngine';

export async function GET() {
  if (!(await verifyAdminCookie())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();

    let totalQuotedRevenue = 0;
    let totalSettledNet = 0;
    let totalProfitSurplus = 0;
    let totalLeakageShortfall = 0;
    let averageCoverageRatio = 1.0;
    let recentSettlements: Record<string, unknown>[] = [];
    let recentSnapshots: Record<string, unknown>[] = [];

    if (db) {
      // 1. Fetch settlements
      const { data: settlements, error: setErr } = await db
        .from('settlement_records')
        .select('*')
        .order('settled_at', { ascending: false })
        .limit(50);

      if (settlements && !setErr) {
        recentSettlements = settlements;
        let sumRatio = 0;
        settlements.forEach((s) => {
          totalSettledNet += Number(s.settled_amount_net || 0);
          totalProfitSurplus += Number(s.profit_surplus || 0);
          totalLeakageShortfall += Number(s.leakage_shortfall || 0);
          sumRatio += Number(s.protection_coverage_ratio || 1);
        });
        if (settlements.length > 0) {
          averageCoverageRatio = sumRatio / settlements.length;
        }
      }

      // 2. Fetch snapshots
      const { data: snapshots, error: snapErr } = await db
        .from('revenue_protection_snapshots')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (snapshots && !snapErr) {
        recentSnapshots = snapshots;
        snapshots.forEach((snap) => {
          totalQuotedRevenue += Number(snap.final_client_price || 0);
        });
      }
    }

    // Dynamic historical recommendations
    const recommendations = await generateCostRecommendations();

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          totalQuotedRevenue: Math.round(totalQuotedRevenue * 100) / 100,
          totalSettledNet: Math.round(totalSettledNet * 100) / 100,
          totalProfitSurplus: Math.round(totalProfitSurplus * 100) / 100,
          totalLeakageShortfall: Math.round(totalLeakageShortfall * 100) / 100,
          averageCoverageRatio: Math.round(averageCoverageRatio * 10000) / 100, // as percentage e.g. 100.25%
        },
        recommendations,
        recentSettlements,
        recentSnapshots,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[/api/cost-engine/analytics] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
