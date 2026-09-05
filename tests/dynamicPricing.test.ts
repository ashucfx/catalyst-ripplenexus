import assert from 'node:assert';
import {
  getDynamicPriceQuote,
  roundToCharmPrice,
  PACKAGES,
} from '../src/lib/payment/dynamicPricing';

async function runDynamicPricingTests() {
  console.log('🧪 Starting Dynamic International Revenue Maximization Test Suite...\n');
  let passed = 0;

  // Test 1: Psychological Charm Pricing Function
  {
    console.log('1. Testing psychological charm price formatting...');
    assert.strictEqual(roundToCharmPrice(142.15, 'USD'), 149);
    assert.strictEqual(roundToCharmPrice(331.46, 'USD'), 349);
    assert.strictEqual(roundToCharmPrice(678.90, 'USD'), 699);
    assert.strictEqual(roundToCharmPrice(1175.20, 'USD'), 1199);
    assert.strictEqual(roundToCharmPrice(2500, 'INR'), 2499);
    assert.strictEqual(roundToCharmPrice(1280, 'AED'), 1299);
    console.log('   ✅ Psychological charm rounding passed: clean consumer price points produced.');
    passed++;
  }

  // Test 2: US / Anglosphere Visitor (Band A - Maximum Yield)
  {
    console.log('2. Testing US client dynamic pricing (Band A - Maximum Yield)...');
    const quote = await getDynamicPriceQuote({
      packageSlug: 'CAREER_BOOSTER',
      experienceTier: '3_8',
      countryCode: 'US',
      currencyCode: 'USD',
    });

    assert.strictEqual(quote.pricingBand, 'A');
    assert.strictEqual(quote.isMaximizedYield, true);
    assert.strictEqual(quote.clientCurrency, 'USD');
    assert.ok(quote.finalClientPrice >= 349, 'Band A Career Booster must be >= $349');
    assert.ok(
      quote.costEngineSnapshot.verifiedNetAfterRounding >= quote.targetNetRevenue,
      '0% revenue loss: verified net must be >= target net'
    );
    console.log(`   ✅ US Band A passed: Target Net $${quote.targetNetRevenue} -> Final Client Price $${quote.finalClientPrice}`);
    passed++;
  }

  // Test 3: UK Client in GBP (Band A - Local Currency Charm)
  {
    console.log('3. Testing UK client in GBP...');
    const quote = await getDynamicPriceQuote({
      packageSlug: 'CAREER_BOOSTER',
      experienceTier: '3_8',
      countryCode: 'GB',
      currencyCode: 'GBP',
    });

    assert.strictEqual(quote.pricingBand, 'A');
    assert.strictEqual(quote.clientCurrency, 'GBP');
    assert.ok(quote.finalClientPrice > 0, 'Final price in GBP must be > 0');
    console.log(`   ✅ UK Band A in GBP passed: Client pays £${quote.finalClientPrice}`);
    passed++;
  }

  // Test 4: UAE / Gulf Client in AED (Band B - High-Income Gulf Tier)
  {
    console.log('4. Testing UAE client in AED (Band B)...');
    const quote = await getDynamicPriceQuote({
      packageSlug: 'CAREER_BOOSTER',
      experienceTier: '3_8',
      countryCode: 'AE',
      currencyCode: 'AED',
    });

    assert.strictEqual(quote.pricingBand, 'B');
    assert.strictEqual(quote.clientCurrency, 'AED');
    assert.ok(quote.finalClientPrice > 500, 'AED price should be appropriately scaled');
    console.log(`   ✅ UAE Band B passed: Client pays AED ${quote.finalClientPrice}`);
    passed++;
  }

  // Test 5: India Client in INR (Band IN - Domestic Rates)
  {
    console.log('5. Testing India domestic client in INR...');
    const quote = await getDynamicPriceQuote({
      packageSlug: 'CAREER_BOOSTER',
      experienceTier: '3_8',
      countryCode: 'IN',
      currencyCode: 'INR',
    });

    assert.strictEqual(quote.pricingBand, 'IN');
    assert.strictEqual(quote.clientCurrency, 'INR');
    assert.ok(quote.finalClientPrice >= 5499, 'India 3-8 yrs Career Booster must be >= ₹5,499');
    console.log(`   ✅ India Band IN passed: Client pays ₹${quote.finalClientPrice}`);
    passed++;
  }

  // Test 6: Premium Plus Suite & Executive Tiers
  {
    console.log('6. Testing Premium Plus Suite and Executive Tier scaling...');
    const premQuote = await getDynamicPriceQuote({
      packageSlug: 'PREMIUM_PLUS',
      experienceTier: '15_plus',
      countryCode: 'US',
      currencyCode: 'USD',
    });

    assert.ok(premQuote.finalClientPrice >= 1499, '15+ yrs Premium Plus must be >= $1,499');
    console.log(`   ✅ Premium Plus 15+ yrs passed: $${premQuote.finalClientPrice}`);
    passed++;
  }

  console.log(`\n🎉 ALL ${passed}/6 DYNAMIC PRICING TESTS PASSED!`);
}

runDynamicPricingTests().catch((err) => {
  console.error('❌ Dynamic pricing test failed:', err);
  process.exit(1);
});
