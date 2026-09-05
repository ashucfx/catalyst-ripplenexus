import { CostProfile, CostBreakdown, FxConversionPath } from './types';
import { Decimal, toDecimal } from './decimal';

export function calculateCostBreakdown(params: {
  costProfile: CostProfile;
  fxPath: FxConversionPath | null;
  grossClientPrice: Decimal | number;
}): CostBreakdown {
  const { costProfile, fxPath } = params;
  const gross = toDecimal(params.grossClientPrice);

  const providerVarRate = toDecimal(costProfile.percentage_fee);
  const providerFixed = toDecimal(costProfile.fixed_fee);
  const intermediaryFixed = toDecimal(costProfile.intermediary_fixed_fee);
  const disputeRate = toDecimal(costProfile.dispute_reserve_rate);

  // FX spread: either from fxPath if conversion occurred, or from profile
  const fxSpreadRate = fxPath
    ? toDecimal(fxPath.totalSpreadPercentage)
    : toDecimal(costProfile.fx_spread_percentage);

  // Risk / safety buffer: either from fxPath if conversion, or from profile
  const riskBufferRate = fxPath
    ? toDecimal(fxPath.totalSafetyBufferPercentage).plus(toDecimal(costProfile.risk_buffer_percentage))
    : toDecimal(costProfile.risk_buffer_percentage);

  const totalVarRate = providerVarRate.plus(fxSpreadRate).plus(disputeRate).plus(riskBufferRate);
  const totalFixed = providerFixed.plus(intermediaryFixed);

  // Variable cost amounts based on client gross price
  const providerVarAmount = gross.times(providerVarRate);
  const fxSpreadAmount = gross.times(fxSpreadRate);
  const disputeAmount = gross.times(disputeRate);
  const riskBufferAmount = gross.times(riskBufferRate);

  const totalEstimatedCosts = providerVarAmount
    .plus(providerFixed)
    .plus(fxSpreadAmount)
    .plus(intermediaryFixed)
    .plus(disputeAmount)
    .plus(riskBufferAmount);

  return {
    providerFeeVariableRate: providerVarRate.toNumber(),
    providerFeeVariableAmount: providerVarAmount.toNumber(),
    providerFeeFixedAmount: providerFixed.toNumber(),
    fxSpreadRate: fxSpreadRate.toNumber(),
    fxSpreadAmount: fxSpreadAmount.toNumber(),
    intermediaryFixedAmount: intermediaryFixed.toNumber(),
    disputeReserveRate: disputeRate.toNumber(),
    disputeReserveAmount: disputeAmount.toNumber(),
    riskBufferRate: riskBufferRate.toNumber(),
    riskBufferAmount: riskBufferAmount.toNumber(),
    totalVariableRate: totalVarRate.toNumber(),
    totalFixedCosts: totalFixed.toNumber(),
    totalEstimatedCosts: totalEstimatedCosts.toNumber(),
  };
}
