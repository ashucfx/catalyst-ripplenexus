import Decimal from 'decimal.js';

// Configure Decimal for high-precision financial operations
Decimal.set({
  precision: 28,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -12,
  toExpPos: 28,
});

export { Decimal };

export function toDecimal(value: string | number | Decimal): Decimal {
  if (value instanceof Decimal) return value;
  return new Decimal(value);
}

/**
 * Rounds an amount to the specified currency minor units (e.g. 2 for USD, 0 for JPY).
 * Uses ROUND_UP (ceiling) for client gross-up to guarantee no under-collection,
 * or ROUND_HALF_UP for standard accounting.
 */
export function roundToCurrency(
  amount: Decimal | number | string,
  minorUnits: number = 2,
  mode: Decimal.Rounding = Decimal.ROUND_UP
): Decimal {
  const d = toDecimal(amount);
  return d.toDecimalPlaces(minorUnits, mode);
}

/**
 * Formats a Decimal value to standard string representation with exact decimal places.
 */
export function formatCurrencyAmount(
  amount: Decimal | number | string,
  minorUnits: number = 2
): string {
  return toDecimal(amount).toFixed(minorUnits);
}
