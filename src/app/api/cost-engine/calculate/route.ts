import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCookie } from '@/lib/auth/admin';
import { calculateClientPrice } from '@/lib/payment/costEngine';

export async function POST(req: NextRequest) {
  if (!(await verifyAdminCookie())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      baseRevenueAmount,
      baseRevenueCurrency,
      clientCurrency,
      paymentMethod,
      railType,
      brand,
      customProfileId,
      taxRate,
      referenceId,
      referenceType,
      saveSnapshot,
    } = body;

    if (!baseRevenueAmount || !baseRevenueCurrency || !clientCurrency || !paymentMethod) {
      return NextResponse.json(
        {
          error:
            'Missing required parameters: baseRevenueAmount, baseRevenueCurrency, clientCurrency, paymentMethod',
        },
        { status: 400 }
      );
    }

    const snapshot = await calculateClientPrice(
      {
        baseRevenueAmount: Number(baseRevenueAmount),
        baseRevenueCurrency: String(baseRevenueCurrency),
        clientCurrency: String(clientCurrency),
        paymentMethod,
        railType,
        brand,
        customProfileId,
        taxRate: taxRate ? Number(taxRate) : 0,
        referenceId,
        referenceType,
      },
      { saveSnapshot: !!saveSnapshot }
    );

    return NextResponse.json({ success: true, data: snapshot });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[/api/cost-engine/calculate] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to calculate protected pricing' },
      { status: 500 }
    );
  }
}
