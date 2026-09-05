import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCookie } from '@/lib/auth/admin';
import { simulatePricing } from '@/lib/payment/costEngine';

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
      hypotheticalOverrides,
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

    const simulation = await simulatePricing({
      baseRevenueAmount: Number(baseRevenueAmount),
      baseRevenueCurrency: String(baseRevenueCurrency),
      clientCurrency: String(clientCurrency),
      paymentMethod,
      railType,
      brand,
      customProfileId,
      taxRate: taxRate ? Number(taxRate) : 0,
      hypotheticalOverrides,
    });

    return NextResponse.json({ success: true, data: simulation });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[/api/cost-engine/simulate] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to run pricing simulation' },
      { status: 500 }
    );
  }
}
