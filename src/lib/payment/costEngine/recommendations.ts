import { PricingRecommendation } from './types';
import { getDb } from '@/lib/db/supabase';
import { DEFAULT_COST_PROFILES } from './costProfiles';

/**
 * Calculates historical cost metrics (mean, P95, P99) from settlement records
 * and provides recommendations for fee/buffer adjustments.
 */
export async function generateCostRecommendations(
  profileId?: string
): Promise<PricingRecommendation[]> {
  const recommendations: PricingRecommendation[] = [];
  const db = getDb();

  const targetProfiles = profileId
    ? [profileId]
    : Object.keys(DEFAULT_COST_PROFILES);

  for (const pid of targetProfiles) {
    const profile = DEFAULT_COST_PROFILES[pid];
    if (!profile) continue;

    let observedRates: number[] = [];

    if (db) {
      try {
        const { data, error } = await db
          .from('settlement_records')
          .select('paid_client_amount, actual_provider_fee, profit_surplus, leakage_shortfall')
          .eq('payment_method', profile.provider)
          .limit(200);

        if (data && !error && data.length > 0) {
          observedRates = (data as Array<{ paid_client_amount: number; actual_provider_fee: number }>)
            .filter((d) => Number(d.paid_client_amount) > 0)
            .map((d) => Number(d.actual_provider_fee) / Number(d.paid_client_amount))
            .sort((a: number, b: number) => a - b);
        }
      } catch (err) {
        console.warn(`[Recommendations] Error fetching settlements for ${pid}:`, err);
      }
    }

    const currentConfiguredRate =
      profile.percentage_fee +
      profile.fx_spread_percentage +
      profile.risk_buffer_percentage +
      profile.dispute_reserve_rate;

    if (observedRates.length === 0) {
      // Default recommendation when insufficient historical data
      recommendations.push({
        profileId: pid,
        sampleSize: 0,
        observedMeanCostRate: currentConfiguredRate,
        observedP95CostRate: currentConfiguredRate,
        observedP99CostRate: currentConfiguredRate,
        currentConfiguredRate,
        recommendedRate: currentConfiguredRate,
        suggestedAction: 'MAINTAIN',
        status: 'PENDING',
      });
      continue;
    }

    const n = observedRates.length;
    const sum = observedRates.reduce((acc, v) => acc + v, 0);
    const mean = sum / n;
    const p95 = observedRates[Math.min(n - 1, Math.floor(n * 0.95))];
    const p99 = observedRates[Math.min(n - 1, Math.floor(n * 0.99))];

    let action: 'MAINTAIN' | 'INCREASE_BUFFER' | 'REDUCE_BUFFER' = 'MAINTAIN';
    let recommendedRate = currentConfiguredRate;

    // If P95 exceeds current configured rate, we have risk of leakage -> recommend increasing buffer
    if (p95 > currentConfiguredRate + 0.002) {
      action = 'INCREASE_BUFFER';
      recommendedRate = Math.round((p99 + 0.005) * 10000) / 10000;
    } else if (currentConfiguredRate > p99 + 0.015) {
      // Over-buffered by more than 1.5% compared to P99
      action = 'REDUCE_BUFFER';
      recommendedRate = Math.round((p95 + 0.005) * 10000) / 10000;
    }

    recommendations.push({
      profileId: pid,
      sampleSize: n,
      observedMeanCostRate: Math.round(mean * 10000) / 10000,
      observedP95CostRate: Math.round(p95 * 10000) / 10000,
      observedP99CostRate: Math.round(p99 * 10000) / 10000,
      currentConfiguredRate: Math.round(currentConfiguredRate * 10000) / 10000,
      recommendedRate,
      suggestedAction: action,
      status: 'PENDING',
    });
  }

  return recommendations;
}
