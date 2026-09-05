import { PricingCalculationInput, GrossUpPricingResult, CostProfile } from './types';
import { calculateClientPrice } from './protectionEngine';
import { Decimal, toDecimal } from './decimal';

export interface SimulationParams extends PricingCalculationInput {
  hypotheticalOverrides?: Partial<CostProfile>;
}

export interface SensitivityAnalysisItem {
  scenarioName: string;
  variableRateDelta: number;
  resultingClientPrice: number;
  resultingTargetNet: number;
  resultingSurplus: number;
  isProtected: boolean;
}

export interface SimulationResult extends GrossUpPricingResult {
  sensitivityScenarios: SensitivityAnalysisItem[];
}

/**
 * Pure non-mutating simulation engine for testing and admin scenarios.
 * Guarantees ZERO database writes.
 */
export async function simulatePricing(params: SimulationParams): Promise<SimulationResult> {
  const baseResult = await calculateClientPrice(params, { saveSnapshot: false });

  // Compute sensitivity scenarios:
  // 1. Gateway variable fee increases by +0.5%
  // 2. Gateway variable fee decreases by -0.5%
  // 3. FX volatility shock: FX spread increases by +1.0%
  // 4. Zero buffer stress test: Buffer reduced to 0.0%
  const scenarios: SensitivityAnalysisItem[] = [];

  const baseClientPrice = toDecimal(baseResult.finalClientPrice);
  const targetNet = toDecimal(baseResult.targetNetRevenueInClientCurrency);
  const fixedCosts = toDecimal(baseResult.costBreakdown.totalFixedCosts);
  const baseVarRate = toDecimal(baseResult.costBreakdown.totalVariableRate);

  const testDeltas = [
    { name: 'Gateway Fee +0.5%', delta: 0.005 },
    { name: 'Gateway Fee -0.5%', delta: -0.005 },
    { name: 'FX Volatility Shock (+1.0%)', delta: 0.01 },
    { name: 'Buffer Removed (0% safety buffer)', delta: -baseResult.costBreakdown.riskBufferRate },
  ];

  for (const t of testDeltas) {
    const testVarRate = baseVarRate.plus(toDecimal(t.delta));
    // If client price remains fixed at quoted price:
    const netRetained = baseClientPrice.times(new Decimal(1).minus(testVarRate)).minus(fixedCosts);
    const surplus = netRetained.minus(targetNet);

    scenarios.push({
      scenarioName: t.name,
      variableRateDelta: t.delta,
      resultingClientPrice: baseClientPrice.toNumber(),
      resultingTargetNet: netRetained.toNumber(),
      resultingSurplus: surplus.toNumber(),
      isProtected: netRetained.greaterThanOrEqualTo(targetNet),
    });
  }

  return {
    ...baseResult,
    sensitivityScenarios: scenarios,
  };
}
