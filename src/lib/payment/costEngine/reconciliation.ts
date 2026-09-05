import {
  SettlementRecordInput,
  SettlementReconciliationResult,
} from './types';
import { getDb } from '@/lib/db/supabase';
import { Decimal, toDecimal } from './decimal';

/**
 * Reconciles Actual Settlement against Quoted Revenue Protection Snapshot.
 * Directly implements the flowchart terminal phase:
 *   ACTUAL SETTLEMENT -> RECONCILIATION -> PROFIT or LEAKAGE
 */
export async function reconcileSettlement(
  input: SettlementRecordInput
): Promise<SettlementReconciliationResult> {
  const {
    snapshotId,
    gatewayTransactionId,
    paymentMethod,
    paidClientCurrency,
    paidClientAmount,
    settledCurrency,
    settledAmountNet,
    actualProviderFee = 0,
    actualFxRate,
    notes,
    metadata = {},
  } = input;

  let estimatedTargetNet = toDecimal(settledAmountNet);
  let estimatedProviderFee = new Decimal(0);

  const db = getDb();

  // 1. Fetch original snapshot if snapshotId is provided
  if (snapshotId && db) {
    try {
      const { data: snapshot, error } = await db
        .from('revenue_protection_snapshots')
        .select('*')
        .eq('id', snapshotId)
        .maybeSingle();

      if (snapshot && !error) {
        // Target net in the settled currency
        if (snapshot.base_revenue_currency === settledCurrency) {
          estimatedTargetNet = toDecimal(snapshot.base_revenue_amount);
        } else {
          estimatedTargetNet = toDecimal(snapshot.target_net_revenue);
        }
        estimatedProviderFee = toDecimal(snapshot.estimated_provider_fee_variable).plus(
          toDecimal(snapshot.estimated_provider_fee_fixed)
        );
      }
    } catch (err) {
      console.warn('[Reconciliation] Error fetching snapshot:', err);
    }
  }

  const actualSettledDecimal = toDecimal(settledAmountNet);
  const actualFeeDecimal = toDecimal(actualProviderFee);

  // Profit surplus vs Leakage shortfall
  let profitSurplus = new Decimal(0);
  let leakageShortfall = new Decimal(0);
  let isFullyProtected = true;

  if (actualSettledDecimal.greaterThanOrEqualTo(estimatedTargetNet)) {
    profitSurplus = actualSettledDecimal.minus(estimatedTargetNet);
    leakageShortfall = new Decimal(0);
    isFullyProtected = true;
  } else {
    profitSurplus = new Decimal(0);
    leakageShortfall = estimatedTargetNet.minus(actualSettledDecimal);
    isFullyProtected = false;
  }

  // Fee Variance: actual - estimated
  const feeVariance = actualFeeDecimal.minus(estimatedProviderFee);

  // Protection Coverage Ratio
  const coverageRatio = estimatedTargetNet.isZero()
    ? new Decimal(1)
    : actualSettledDecimal.dividedBy(estimatedTargetNet);

  const nowIso = new Date().toISOString();
  let settlementRecordId: string | undefined;

  // 2. Persist to settlement_records
  if (db) {
    try {
      const { data, error } = await db
        .from('settlement_records')
        .insert({
          snapshot_id: snapshotId || null,
          gateway_transaction_id: gatewayTransactionId,
          payment_method: paymentMethod,
          paid_client_currency: paidClientCurrency,
          paid_client_amount: paidClientAmount,
          settled_currency: settledCurrency,
          settled_amount_net: actualSettledDecimal.toNumber(),
          actual_provider_fee: actualFeeDecimal.toNumber(),
          actual_fx_rate: actualFxRate ?? null,
          estimated_target_net: estimatedTargetNet.toNumber(),
          profit_surplus: profitSurplus.toNumber(),
          leakage_shortfall: leakageShortfall.toNumber(),
          fee_variance: feeVariance.toNumber(),
          fx_variance: 0,
          protection_coverage_ratio: coverageRatio.toNumber(),
          settled_at: nowIso,
          notes: notes || null,
          metadata,
        })
        .select('id')
        .single();

      if (data && !error) {
        settlementRecordId = data.id;
      }

      // Mark snapshot as SETTLED
      if (snapshotId) {
        await db
          .from('revenue_protection_snapshots')
          .update({ status: 'SETTLED' })
          .eq('id', snapshotId);
      }
    } catch (err) {
      console.warn('[Reconciliation] Error persisting settlement record:', err);
    }
  }

  return {
    settlementRecordId,
    snapshotId,
    estimatedTargetNet: estimatedTargetNet.toNumber(),
    settledAmountNet: actualSettledDecimal.toNumber(),
    settledCurrency,
    profitSurplus: profitSurplus.toNumber(),
    leakageShortfall: leakageShortfall.toNumber(),
    feeVariance: feeVariance.toNumber(),
    fxVariance: 0,
    protectionCoverageRatio: coverageRatio.toNumber(),
    isFullyProtected,
    reconciliationTimestamp: nowIso,
  };
}
