import { Decimal, toDecimal, roundToCurrency } from './decimal';

export interface TaxCalculationResult {
  taxRate: number;
  commercialSubtotal: number;
  taxAmount: number;
  invoiceTotalAmount: number;
}

/**
 * Calculates tax isolated from profit/loss, cost engine, or revenue calculations.
 * Taxes must NEVER be treated as business revenue or payment costs.
 */
export function calculateTax(
  commercialSubtotal: Decimal | number,
  taxRate: number = 0,
  minorUnits: number = 2
): TaxCalculationResult {
  const subtotal = toDecimal(commercialSubtotal);
  const rate = toDecimal(taxRate);

  if (rate.isZero() || rate.isNegative()) {
    return {
      taxRate: 0,
      commercialSubtotal: subtotal.toNumber(),
      taxAmount: 0,
      invoiceTotalAmount: subtotal.toNumber(),
    };
  }

  const taxAmountDecimal = roundToCurrency(subtotal.times(rate), minorUnits, Decimal.ROUND_HALF_UP);
  const invoiceTotalDecimal = subtotal.plus(taxAmountDecimal);

  return {
    taxRate: rate.toNumber(),
    commercialSubtotal: subtotal.toNumber(),
    taxAmount: taxAmountDecimal.toNumber(),
    invoiceTotalAmount: invoiceTotalDecimal.toNumber(),
  };
}
