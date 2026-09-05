import {
  PricingCalculationInput,
  RevenueProtectionSnapshot,
} from './types';
import { resolveCostProfile } from './costProfiles';
import { getCurrencyProfile } from './currencyProfiles';
import { resolveFxPath } from './fxRoutes';
import { calculateCostBreakdown } from './costCalculator';
import { calculateGrossUp } from './grossUpEngine';
import { calculateTax } from './taxEngine';
import { toDecimal } from './decimal';
import { getDb } from '@/lib/db/supabase';

/**
 * Core Pricing Orchestrator:
 * Executes the exact pipeline:
 *   BASE REVENUE -> COST ENGINE (Provider Fee, FX Cost, Fixed Cost) -> RISK / BUFFER
 *   -> GROSS-UP ENGINE -> CLIENT PRICE -> (+ TAX) -> REVENUE PROTECTION SNAPSHOT
 */
export async function calculateClientPrice(
  input: PricingCalculationInput,
  options?: { saveSnapshot?: boolean }
): Promise<RevenueProtectionSnapshot> {
  const {
    baseRevenueAmount,
    baseRevenueCurrency,
    clientCurrency,
    paymentMethod,
    railType,
    brand = 'catalyst',
    customProfileId,
    taxRate = 0,
    referenceId,
    referenceType = 'booking',
  } = input;

  const baseCurr = baseRevenueCurrency.toUpperCase();
  const clientCurr = clientCurrency.toUpperCase();

  // 1. Resolve currency profiles (for decimal precision and routing configs)
  const clientCurrencyProfile = await getCurrencyProfile(clientCurr);

  // 2. Resolve cost profile
  const costProfile = await resolveCostProfile({
    provider: paymentMethod,
    currency: clientCurr,
    railType,
    brand,
    customProfileId,
  });

  // 3. FX Routing & Target Net in Client Currency
  let fxPath = null;
  let targetNetInClientCurrency = toDecimal(baseRevenueAmount);

  if (baseCurr !== clientCurr) {
    // We need to convert base revenue to client currency
    // e.g. Client pays in clientCurr, which converts to baseCurr.
    // So 1 unit of clientCurr yields `effectiveRate` units of baseCurr.
    fxPath = await resolveFxPath(clientCurr, baseCurr, clientCurrencyProfile.multi_hop_intermediary);

    if (fxPath && fxPath.totalEffectiveExchangeRate > 0) {
      // Target client net = Base Revenue in BaseCurr / EffectiveRate(clientCurr -> baseCurr)
      const effectiveRate = toDecimal(fxPath.totalEffectiveExchangeRate);
      targetNetInClientCurrency = toDecimal(baseRevenueAmount).dividedBy(effectiveRate);
    } else {
      // If direct route from clientCurr to baseCurr isn't found, check reverse baseCurr to clientCurr
      const reversePath = await resolveFxPath(baseCurr, clientCurr);
      if (reversePath && reversePath.totalEffectiveExchangeRate > 0) {
        targetNetInClientCurrency = toDecimal(baseRevenueAmount).times(toDecimal(reversePath.totalEffectiveExchangeRate));
      }
    }
  }

  // 4. Compute combined variable rates and fixed fees for the gross-up engine
  const providerVarRate = toDecimal(costProfile.percentage_fee);
  const providerFixedFee = toDecimal(costProfile.fixed_fee);
  const intermediaryFixedFee = toDecimal(costProfile.intermediary_fixed_fee);
  const disputeRate = toDecimal(costProfile.dispute_reserve_rate);

  const fxSpreadRate = fxPath
    ? toDecimal(fxPath.totalSpreadPercentage)
    : toDecimal(costProfile.fx_spread_percentage);

  const riskBufferRate = fxPath
    ? toDecimal(fxPath.totalSafetyBufferPercentage).plus(toDecimal(costProfile.risk_buffer_percentage))
    : toDecimal(costProfile.risk_buffer_percentage);

  const totalVarRate = providerVarRate.plus(fxSpreadRate).plus(disputeRate).plus(riskBufferRate);
  const totalFixedCosts = providerFixedFee.plus(intermediaryFixedFee);

  // 5. Run Gross-Up Engine with post-rounding upward verification
  const grossUpResult = calculateGrossUp({
    targetNetRevenue: targetNetInClientCurrency,
    variableRateTotal: totalVarRate,
    fixedCostsTotal: totalFixedCosts,
    minorUnits: clientCurrencyProfile.minor_unit,
  });

  // 6. Detailed Itemized Cost Breakdown
  const costBreakdown = calculateCostBreakdown({
    costProfile,
    fxPath,
    grossClientPrice: grossUpResult.finalClientPrice,
  });

  // 7. Calculate Tax (strictly separated from commercial subtotal and cost engine)
  const taxResult = calculateTax(
    grossUpResult.finalClientPrice,
    taxRate,
    clientCurrencyProfile.minor_unit
  );

  const nowIso = new Date().toISOString();

  const pricingResult: RevenueProtectionSnapshot = {
    brand,
    paymentMethod,
    referenceId,
    referenceType,
    baseRevenueAmount: toDecimal(baseRevenueAmount).toNumber(),
    baseRevenueCurrency: baseCurr,
    clientCurrency: clientCurr,
    targetNetRevenueInClientCurrency: targetNetInClientCurrency.toNumber(),
    costProfileUsed: costProfile,
    fxRouteApplied: fxPath,
    costBreakdown,
    grossClientPriceUnrounded: grossUpResult.unroundedPrice.toNumber(),
    finalClientPrice: grossUpResult.finalClientPrice.toNumber(),
    verifiedNetAfterRounding: grossUpResult.verifiedNetRevenue.toNumber(),
    expectedSurplusAfterRounding: grossUpResult.surplusAmount.toNumber(),
    taxRate: taxResult.taxRate,
    taxAmount: taxResult.taxAmount,
    commercialSubtotal: taxResult.commercialSubtotal,
    invoiceTotalAmount: taxResult.invoiceTotalAmount,
    status: 'QUOTED',
    quoteGeneratedAt: nowIso,
  };

  // 8. Optionally persist snapshot to DB
  const db = getDb();
  if (options?.saveSnapshot && db) {
    try {
      const { data, error } = await db
        .from('revenue_protection_snapshots')
        .insert({
          reference_id: referenceId || null,
          reference_type: referenceType,
          brand,
          payment_method: paymentMethod,
          cost_profile_id: costProfile.id,
          base_revenue_currency: baseCurr,
          base_revenue_amount: pricingResult.baseRevenueAmount,
          client_currency: clientCurr,
          target_net_revenue: pricingResult.targetNetRevenueInClientCurrency,
          fx_route_applied: fxPath || {},
          estimated_provider_fee_variable: costBreakdown.providerFeeVariableAmount,
          estimated_provider_fee_fixed: costBreakdown.providerFeeFixedAmount,
          estimated_fx_spread_cost: costBreakdown.fxSpreadAmount,
          estimated_risk_buffer: costBreakdown.riskBufferAmount,
          estimated_intermediary_cost: costBreakdown.intermediaryFixedAmount,
          estimated_total_costs: costBreakdown.totalEstimatedCosts,
          gross_client_price_unrounded: pricingResult.grossClientPriceUnrounded,
          final_client_price: pricingResult.finalClientPrice,
          verified_net_after_rounding: pricingResult.verifiedNetAfterRounding,
          tax_rate_applied: pricingResult.taxRate,
          tax_amount: pricingResult.taxAmount,
          invoice_total_amount: pricingResult.invoiceTotalAmount,
          status: 'QUOTED',
        })
        .select('id, created_at')
        .single();

      if (data && !error) {
        pricingResult.id = data.id;
        pricingResult.createdAt = data.created_at;
      }
    } catch (err) {
      console.warn('[ProtectionEngine] Could not persist snapshot to DB:', err);
    }
  }

  return pricingResult;
}
