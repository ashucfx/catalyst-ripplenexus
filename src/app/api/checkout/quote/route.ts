import { NextRequest, NextResponse } from 'next/server';
import { getDynamicPriceQuote, PackageSlug, ExperienceTier } from '@/lib/payment/dynamicPricing';
import { getGeo } from '@/lib/geo';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const { ok: allowed } = await rateLimit(
      ip,
      { limit: 30, windowMs: 60 * 1000 },
      'checkout-quote'
    );
    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      packageSlug,
      experienceTier = '3_8',
      countryCode,
      currencyCode,
      paymentMethod,
      taxRate,
    } = body;

    if (!packageSlug) {
      return NextResponse.json(
        { error: 'Missing required parameter: packageSlug' },
        { status: 400 }
      );
    }

    // Auto-detect visitor geo if not explicitly specified
    let country = countryCode;
    let currency = currencyCode;

    if (!country || !currency) {
      const geo = await getGeo();
      if (!country) country = geo.country;
      if (!currency) currency = geo.currency;
    }

    const quote = await getDynamicPriceQuote({
      packageSlug: packageSlug as PackageSlug,
      experienceTier: experienceTier as ExperienceTier,
      countryCode: country,
      currencyCode: currency,
      paymentMethod,
      taxRate: taxRate ? Number(taxRate) : 0,
    });

    return NextResponse.json({ success: true, data: quote });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[/api/checkout/quote] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate dynamic pricing quote' },
      { status: 500 }
    );
  }
}
