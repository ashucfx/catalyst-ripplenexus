import { FxRoute, FxConversionPath } from './types';
import { getDb } from '@/lib/db/supabase';
import { Decimal, toDecimal } from './decimal';

export const DEFAULT_FX_ROUTES: Record<string, FxRoute> = {
  USD_TO_INR: {
    id: 'USD_TO_INR',
    from_currency: 'USD',
    to_currency: 'INR',
    base_exchange_rate: 87.0,
    spread_percentage: 0.015, // 1.5%
    safety_buffer_percentage: 0.0075, // 0.75%
    source: 'manual',
  },
  INR_TO_USD: {
    id: 'INR_TO_USD',
    from_currency: 'INR',
    to_currency: 'USD',
    base_exchange_rate: 0.01149425, // 1 / 87
    spread_percentage: 0.015,
    safety_buffer_percentage: 0.0075,
    source: 'manual',
  },
  GBP_TO_INR: {
    id: 'GBP_TO_INR',
    from_currency: 'GBP',
    to_currency: 'INR',
    base_exchange_rate: 113.5,
    spread_percentage: 0.015,
    safety_buffer_percentage: 0.0075,
    source: 'manual',
  },
  EUR_TO_INR: {
    id: 'EUR_TO_INR',
    from_currency: 'EUR',
    to_currency: 'INR',
    base_exchange_rate: 94.0,
    spread_percentage: 0.015,
    safety_buffer_percentage: 0.0075,
    source: 'manual',
  },
  CHF_TO_USD: {
    id: 'CHF_TO_USD',
    from_currency: 'CHF',
    to_currency: 'USD',
    base_exchange_rate: 1.125,
    spread_percentage: 0.012,
    safety_buffer_percentage: 0.005,
    source: 'manual',
  },
  USD_TO_CHF: {
    id: 'USD_TO_CHF',
    from_currency: 'USD',
    to_currency: 'CHF',
    base_exchange_rate: 0.88888889,
    spread_percentage: 0.012,
    safety_buffer_percentage: 0.005,
    source: 'manual',
  },
  GBP_TO_USD: {
    id: 'GBP_TO_USD',
    from_currency: 'GBP',
    to_currency: 'USD',
    base_exchange_rate: 1.305,
    spread_percentage: 0.01,
    safety_buffer_percentage: 0.005,
    source: 'manual',
  },
  EUR_TO_USD: {
    id: 'EUR_TO_USD',
    from_currency: 'EUR',
    to_currency: 'USD',
    base_exchange_rate: 1.08,
    spread_percentage: 0.01,
    safety_buffer_percentage: 0.005,
    source: 'manual',
  },
  CAD_TO_USD: {
    id: 'CAD_TO_USD',
    from_currency: 'CAD',
    to_currency: 'USD',
    base_exchange_rate: 0.735,
    spread_percentage: 0.012,
    safety_buffer_percentage: 0.005,
    source: 'manual',
  },
  AUD_TO_USD: {
    id: 'AUD_TO_USD',
    from_currency: 'AUD',
    to_currency: 'USD',
    base_exchange_rate: 0.655,
    spread_percentage: 0.012,
    safety_buffer_percentage: 0.005,
    source: 'manual',
  },
  SGD_TO_USD: {
    id: 'SGD_TO_USD',
    from_currency: 'SGD',
    to_currency: 'USD',
    base_exchange_rate: 0.75,
    spread_percentage: 0.012,
    safety_buffer_percentage: 0.005,
    source: 'manual',
  },
  AED_TO_USD: {
    id: 'AED_TO_USD',
    from_currency: 'AED',
    to_currency: 'USD',
    base_exchange_rate: 0.272294,
    spread_percentage: 0.005,
    safety_buffer_percentage: 0.003,
    source: 'manual',
  },
};

/**
 * Gets a single FX route from DB or defaults.
 * If A->B is not found but B->A is, inverts the rate.
 */
export async function getDirectFxRoute(from: string, to: string): Promise<FxRoute | null> {
  const fromCode = from.toUpperCase();
  const toCode = to.toUpperCase();
  if (fromCode === toCode) return null;

  const directId = `${fromCode}_TO_${toCode}`;
  const reverseId = `${toCode}_TO_${fromCode}`;
  const db = getDb();

  try {
    if (db) {
      const { data, error } = await db
        .from('fx_routes')
        .select('*')
        .in('id', [directId, reverseId]);

      if (data && !error && data.length > 0) {
        const routes = data as FxRoute[];
        const direct = routes.find((r: FxRoute) => r.id === directId);
        if (direct) return direct;

        const reverse = routes.find((r: FxRoute) => r.id === reverseId);
        if (reverse) {
          const invRate = new Decimal(1).dividedBy(toDecimal(reverse.base_exchange_rate));
          return {
            id: directId,
            from_currency: fromCode,
            to_currency: toCode,
            base_exchange_rate: invRate.toNumber(),
            spread_percentage: Number(reverse.spread_percentage),
            safety_buffer_percentage: Number(reverse.safety_buffer_percentage),
            source: 'manual',
          };
        }
      }
    }
  } catch (err) {
    console.warn(`[FxRoutes] Fallback to default for ${fromCode}->${toCode}:`, err);
  }

  if (DEFAULT_FX_ROUTES[directId]) {
    return DEFAULT_FX_ROUTES[directId];
  }

  if (DEFAULT_FX_ROUTES[reverseId]) {
    const rev = DEFAULT_FX_ROUTES[reverseId];
    const invRate = new Decimal(1).dividedBy(toDecimal(rev.base_exchange_rate));
    return {
      id: directId,
      from_currency: fromCode,
      to_currency: toCode,
      base_exchange_rate: invRate.toNumber(),
      spread_percentage: rev.spread_percentage,
      safety_buffer_percentage: rev.safety_buffer_percentage,
      source: 'manual',
    };
  }

  return null;
}

/**
 * Resolves full FX conversion path between source and target currencies,
 * including multi-hop through intermediary currency (e.g. USD) when required.
 */
export async function resolveFxPath(
  sourceCurrency: string,
  targetCurrency: string,
  intermediaryHint?: string | null
): Promise<FxConversionPath | null> {
  const src = sourceCurrency.toUpperCase();
  const tgt = targetCurrency.toUpperCase();

  if (src === tgt) {
    return null; // Same currency, no conversion
  }

  // 1. Check direct route
  const directRoute = await getDirectFxRoute(src, tgt);
  if (directRoute && !intermediaryHint) {
    const baseRate = toDecimal(directRoute.base_exchange_rate);
    const spread = toDecimal(directRoute.spread_percentage);
    const buffer = toDecimal(directRoute.safety_buffer_percentage);
    // Effective conservative conversion rate accounting for spread and buffer
    // For converting from Source to Target:
    // Net Target = Source * baseRate * (1 - spread - buffer)
    const effectiveRate = baseRate.times(new Decimal(1).minus(spread).minus(buffer));

    return {
      isMultiHop: false,
      sourceCurrency: src,
      targetCurrency: tgt,
      routes: [
        {
          routeId: directRoute.id,
          from: src,
          to: tgt,
          baseRate: baseRate.toNumber(),
          spreadRate: spread.toNumber(),
          safetyBufferRate: buffer.toNumber(),
          effectiveRate: effectiveRate.toNumber(),
        },
      ],
      totalEffectiveExchangeRate: effectiveRate.toNumber(),
      totalSpreadPercentage: spread.toNumber(),
      totalSafetyBufferPercentage: buffer.toNumber(),
    };
  }

  // 2. Multi-hop route through intermediary (default 'USD')
  const intermediary = (intermediaryHint || 'USD').toUpperCase();
  if (src !== intermediary && tgt !== intermediary) {
    const leg1 = await getDirectFxRoute(src, intermediary);
    const leg2 = await getDirectFxRoute(intermediary, tgt);

    if (leg1 && leg2) {
      const b1 = toDecimal(leg1.base_exchange_rate);
      const s1 = toDecimal(leg1.spread_percentage);
      const buf1 = toDecimal(leg1.safety_buffer_percentage);
      const eff1 = b1.times(new Decimal(1).minus(s1).minus(buf1));

      const b2 = toDecimal(leg2.base_exchange_rate);
      const s2 = toDecimal(leg2.spread_percentage);
      const buf2 = toDecimal(leg2.safety_buffer_percentage);
      const eff2 = b2.times(new Decimal(1).minus(s2).minus(buf2));

      const combinedEffRate = eff1.times(eff2);
      const combinedSpread = s1.plus(s2);
      const combinedBuffer = buf1.plus(buf2);

      return {
        isMultiHop: true,
        sourceCurrency: src,
        targetCurrency: tgt,
        intermediaryCurrency: intermediary,
        routes: [
          {
            routeId: leg1.id,
            from: src,
            to: intermediary,
            baseRate: b1.toNumber(),
            spreadRate: s1.toNumber(),
            safetyBufferRate: buf1.toNumber(),
            effectiveRate: eff1.toNumber(),
          },
          {
            routeId: leg2.id,
            from: intermediary,
            to: tgt,
            baseRate: b2.toNumber(),
            spreadRate: s2.toNumber(),
            safetyBufferRate: buf2.toNumber(),
            effectiveRate: eff2.toNumber(),
          },
        ],
        totalEffectiveExchangeRate: combinedEffRate.toNumber(),
        totalSpreadPercentage: combinedSpread.toNumber(),
        totalSafetyBufferPercentage: combinedBuffer.toNumber(),
      };
    }
  }

  // If direct route was found earlier, use it even if intermediary was checked
  if (directRoute) {
    const baseRate = toDecimal(directRoute.base_exchange_rate);
    const spread = toDecimal(directRoute.spread_percentage);
    const buffer = toDecimal(directRoute.safety_buffer_percentage);
    const effectiveRate = baseRate.times(new Decimal(1).minus(spread).minus(buffer));

    return {
      isMultiHop: false,
      sourceCurrency: src,
      targetCurrency: tgt,
      routes: [
        {
          routeId: directRoute.id,
          from: src,
          to: tgt,
          baseRate: baseRate.toNumber(),
          spreadRate: spread.toNumber(),
          safetyBufferRate: buffer.toNumber(),
          effectiveRate: effectiveRate.toNumber(),
        },
      ],
      totalEffectiveExchangeRate: effectiveRate.toNumber(),
      totalSpreadPercentage: spread.toNumber(),
      totalSafetyBufferPercentage: buffer.toNumber(),
    };
  }

  return null;
}
