import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCookie } from '@/lib/auth/admin';
import { reconcileSettlement } from '@/lib/payment/costEngine';

export async function POST(req: NextRequest) {
  if (!(await verifyAdminCookie())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      snapshotId,
      gatewayTransactionId,
      paymentMethod,
      paidClientCurrency,
      paidClientAmount,
      settledCurrency,
      settledAmountNet,
      actualProviderFee,
      actualFxRate,
      notes,
    } = body;

    if (
      !gatewayTransactionId ||
      !paymentMethod ||
      !paidClientCurrency ||
      paidClientAmount === undefined ||
      !settledCurrency ||
      settledAmountNet === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required settlement parameters' },
        { status: 400 }
      );
    }

    const result = await reconcileSettlement({
      snapshotId,
      gatewayTransactionId,
      paymentMethod,
      paidClientCurrency,
      paidClientAmount: Number(paidClientAmount),
      settledCurrency,
      settledAmountNet: Number(settledAmountNet),
      actualProviderFee: actualProviderFee !== undefined ? Number(actualProviderFee) : 0,
      actualFxRate: actualFxRate !== undefined ? Number(actualFxRate) : undefined,
      notes,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[/api/cost-engine/reconcile] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to reconcile settlement' },
      { status: 500 }
    );
  }
}
