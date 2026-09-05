import { Decimal, toDecimal, roundToCurrency } from './decimal';

export interface GrossUpInput {
  targetNetRevenue: Decimal | number;
  variableRateTotal: Decimal | number; // e.g. 0.055 for 5.5%
  fixedCostsTotal: Decimal | number; // e.g. 0.30
  minorUnits?: number; // default 2
}

export interface GrossUpResult {
  unroundedPrice: Decimal;
  finalClientPrice: Decimal;
  verifiedNetRevenue: Decimal;
  surplusAmount: Decimal;
}

/**
 * Calculates the exact gross-up client price ensuring 0% expected revenue leakage.
 *
 * Formula:
 *   P_unrounded = (TargetNet + TotalFixedCosts) / (1 - TotalVariableRate)
 *
 * Followed by ROUND_UP to minor unit and iterative verification:
 *   Net_verified = P_rounded * (1 - TotalVariableRate) - TotalFixedCosts >= TargetNet
 */
export function calculateGrossUp(input: GrossUpInput): GrossUpResult {
  const targetNet = toDecimal(input.targetNetRevenue);
  const varRate = toDecimal(input.variableRateTotal);
  const fixedCost = toDecimal(input.fixedCostsTotal);
  const minorUnits = input.minorUnits ?? 2;

  // Validation: variable rate cannot be >= 1.0 (100%)
  if (varRate.greaterThanOrEqualTo(1)) {
    throw new Error(`Total variable rate (${varRate.toString()}) cannot be 100% or greater.`);
  }

  // P_unrounded = (targetNet + fixedCost) / (1 - varRate)
  const denominator = new Decimal(1).minus(varRate);
  const numerator = targetNet.plus(fixedCost);
  const unroundedPrice = numerator.dividedBy(denominator);

  // Ceiling to minor units
  let clientPrice = roundToCurrency(unroundedPrice, minorUnits, Decimal.ROUND_UP);

  // Step minor increment (e.g. 0.01 for 2 decimals, 1 for 0 decimals)
  const minorStep = new Decimal(10).pow(-minorUnits);

  // Verification loop: guarantee net >= targetNet
  let verifiedNet = clientPrice.times(denominator).minus(fixedCost);
  let iterations = 0;
  while (verifiedNet.lessThan(targetNet) && iterations < 10) {
    clientPrice = clientPrice.plus(minorStep);
    verifiedNet = clientPrice.times(denominator).minus(fixedCost);
    iterations++;
  }

  const surplus = verifiedNet.minus(targetNet);

  return {
    unroundedPrice,
    finalClientPrice: clientPrice,
    verifiedNetRevenue: verifiedNet,
    surplusAmount: surplus,
  };
}
