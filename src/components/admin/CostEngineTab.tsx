'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CostProfile,
  PricingRecommendation,
  DEFAULT_COST_PROFILES,
  SimulationResult,
} from '@/lib/payment/costEngine';

interface AnalyticsData {
  kpis: {
    totalQuotedRevenue: number;
    totalSettledNet: number;
    totalProfitSurplus: number;
    totalLeakageShortfall: number;
    averageCoverageRatio: number;
  };
  recommendations: PricingRecommendation[];
  recentSettlements: Array<{
    id: string;
    settled_at: string;
    payment_method: string;
    paid_client_currency: string;
    paid_client_amount: number;
    settled_currency: string;
    estimated_target_net: number;
    settled_amount_net: number;
    profit_surplus: number;
    protection_coverage_ratio: number;
  }>;
  recentSnapshots: Record<string, unknown>[];
}

export function CostEngineTab() {
  const [subTab, setSubTab] = useState<'simulator' | 'profiles' | 'settlements'>('simulator');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Simulator State
  const [baseRevenue, setBaseRevenue] = useState('300');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [clientCurrency, setClientCurrency] = useState('USD');
  const [provider, setProvider] = useState<'razorpay' | 'paypal' | 'bank_transfer'>('paypal');
  const [railType, setRailType] = useState<string>('wallet');
  const [taxRate, setTaxRate] = useState('0');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [simLoading, setSimLoading] = useState(false);

  // Profiles State
  const [profiles, setProfiles] = useState<CostProfile[]>(Object.values(DEFAULT_COST_PROFILES));
  const [editingProfile, setEditingProfile] = useState<CostProfile | null>(null);
  const [saveMsg, setSaveMsg] = useState('');

  // Fetch Analytics & Profiles
  const loadData = async () => {
    try {
      const [resA, resP] = await Promise.all([
        fetch('/api/cost-engine/analytics'),
        fetch('/api/cost-engine/profiles'),
      ]);
      if (resA.ok) {
        const d = await resA.json();
        setAnalytics(d.data);
      }
      if (resP.ok) {
        const d = await resP.json();
        if (d.data && d.data.length > 0) setProfiles(d.data);
      }
    } catch (err) {
      console.error('Failed to fetch cost engine data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Run Simulator
  const handleSimulate = useCallback(async () => {
    setSimLoading(true);
    try {
      const res = await fetch('/api/cost-engine/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseRevenueAmount: Number(baseRevenue),
          baseRevenueCurrency: baseCurrency,
          clientCurrency: clientCurrency,
          paymentMethod: provider,
          railType,
          taxRate: Number(taxRate) / 100,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        setSimResult(d.data);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimLoading(false);
    }
  }, [baseRevenue, baseCurrency, clientCurrency, provider, railType, taxRate]);

  useEffect(() => {
    handleSimulate();
  }, [handleSimulate]);

  // Handle Profile Save
  const handleSaveProfile = async (p: CostProfile) => {
    try {
      const res = await fetch('/api/cost-engine/profiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, updates: p }),
      });
      if (res.ok) {
        setSaveMsg(`Profile ${p.id} updated successfully!`);
        setTimeout(() => setSaveMsg(''), 4000);
        setEditingProfile(null);
        loadData();
      } else {
        alert('Failed to update profile.');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      alert('Error updating profile');
    }
  };

  const inputCls =
    'w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-2.5 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── HEADER & SUBNAV ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-mono tracking-tight text-bone">
              COST ENGINE &amp; REVENUE PROTECTION
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/70 border border-emerald-800 text-emerald-400">
              0% EXPECTED LEAKAGE
            </span>
          </div>
          <p className="text-xs text-muted font-sans mt-1">
            Dynamic cost gross-up, multi-hop FX routing buffers, and automated settlement reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/[0.03] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setSubTab('simulator')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              subTab === 'simulator'
                ? 'bg-signal-gold/15 text-signal-gold border border-signal-gold/30 font-bold'
                : 'text-muted hover:text-bone'
            }`}
          >
            ⚡ Pricing Simulator
          </button>
          <button
            onClick={() => setSubTab('profiles')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              subTab === 'profiles'
                ? 'bg-signal-gold/15 text-signal-gold border border-signal-gold/30 font-bold'
                : 'text-muted hover:text-bone'
            }`}
          >
            ⚙️ Cost Profiles
          </button>
          <button
            onClick={() => setSubTab('settlements')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              subTab === 'settlements'
                ? 'bg-signal-gold/15 text-signal-gold border border-signal-gold/30 font-bold'
                : 'text-muted hover:text-bone'
            }`}
          >
            📊 Reconciliation &amp; Learning
          </button>
        </div>
      </div>

      {/* ── KPI HIGHLIGHT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="text-[10px] font-mono uppercase text-muted tracking-wider">Total Quoted Volume</div>
          <div className="text-2xl font-mono font-bold text-bone mt-2">
            ${analytics?.kpis.totalQuotedRevenue.toLocaleString() ?? '0.00'}
          </div>
          <div className="text-[10px] text-muted/60 mt-1">Gross client quotes issued</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="text-[10px] font-mono uppercase text-muted tracking-wider">Actual Net Settled</div>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-2">
            ${analytics?.kpis.totalSettledNet.toLocaleString() ?? '0.00'}
          </div>
          <div className="text-[10px] text-emerald-500/70 mt-1">Cash in bank after all deductions</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="text-[10px] font-mono uppercase text-muted tracking-wider">Total Profit Surplus</div>
          <div className="text-2xl font-mono font-bold text-signal-gold mt-2">
            +${analytics?.kpis.totalProfitSurplus.toLocaleString() ?? '0.00'}
          </div>
          <div className="text-[10px] text-signal-gold/60 mt-1">Buffer retention above target net</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="text-[10px] font-mono uppercase text-muted tracking-wider">Leakage Shortfall</div>
          <div className={`text-2xl font-mono font-bold mt-2 ${
            (analytics?.kpis.totalLeakageShortfall ?? 0) > 0 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            ${analytics?.kpis.totalLeakageShortfall.toLocaleString() ?? '0.00'}
          </div>
          <div className="text-[10px] text-emerald-500/70 mt-1">
            {(analytics?.kpis.totalLeakageShortfall ?? 0) === 0 ? '✓ 0% Revenue Loss' : '⚠️ Leakage detected'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="text-[10px] font-mono uppercase text-muted tracking-wider">Coverage Ratio</div>
          <div className="text-2xl font-mono font-bold text-bone mt-2">
            {analytics?.kpis.averageCoverageRatio ?? 100}%
          </div>
          <div className="text-[10px] text-muted/60 mt-1">Settled Net / Target Net</div>
        </div>
      </div>

      {/* ── SUBTAB 1: PRICING SIMULATOR ── */}
      {subTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
            <h3 className="font-mono text-sm font-bold text-signal-gold uppercase tracking-wider">
              Simulation Inputs
            </h3>

            <div>
              <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                Target Net Revenue (Base Service)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={baseRevenue}
                  onChange={(e) => setBaseRevenue(e.target.value)}
                  className={inputCls}
                  placeholder="300"
                />
                <select
                  value={baseCurrency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                  className="bg-white/[0.04] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-bone focus:outline-none focus:border-signal-gold"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                Client Payment Currency
              </label>
              <select
                value={clientCurrency}
                onChange={(e) => setClientCurrency(e.target.value)}
                className={inputCls}
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CHF">CHF (Swiss Franc - Multi-hop)</option>
                <option value="CAD">CAD (CA$)</option>
                <option value="AUD">AUD (AU$)</option>
                <option value="SGD">SGD (S$)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                Payment Provider / Rail
              </label>
              <select
                value={provider}
                onChange={(e) => {
                  const p = e.target.value as 'razorpay' | 'paypal' | 'bank_transfer';
                  setProvider(p);
                  if (p === 'paypal') setRailType('wallet');
                  else if (p === 'razorpay') setRailType(clientCurrency === 'INR' ? 'domestic_card' : 'intl_card');
                  else if (p === 'bank_transfer') setRailType(clientCurrency === 'GBP' ? 'bank_wire' : clientCurrency === 'USD' ? 'ach' : 'sepa');
                }}
                className={inputCls}
              >
                <option value="paypal">PayPal (Standard Cross-Border)</option>
                <option value="razorpay">Razorpay (Domestic &amp; Intl Cards)</option>
                <option value="bank_transfer">Direct Bank Transfer (ACH / FPS / SEPA / SWIFT)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                Tax Rate (% GST / VAT - Isolated from Net)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className={inputCls}
                placeholder="0"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleSimulate}
                disabled={simLoading}
                className="w-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase hover:brightness-110 transition-all cursor-pointer shadow-md"
              >
                {simLoading ? 'Recalculating...' : 'Recalculate Waterfall →'}
              </button>
            </div>
          </div>

          {/* Results Waterfall Panel */}
          <div className="lg:col-span-8 space-y-6">
            {simResult && (
              <>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold">
                        PROTECTED PRICE BREAKDOWN
                      </span>
                      <p className="text-[11px] text-muted mt-0.5">
                        Profile: <span className="font-mono text-bone">{simResult.costProfileUsed.id}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted">Final Client Price</div>
                      <div className="text-2xl font-mono font-bold text-signal-gold">
                        {simResult.clientCurrency} {simResult.finalClientPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Waterfall Flow */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-[10px] font-mono text-muted uppercase">Base Target Net</div>
                      <div className="text-base font-mono font-bold text-bone mt-1">
                        {simResult.clientCurrency} {simResult.targetNetRevenueInClientCurrency.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-muted/60 mt-0.5">0% revenue leakage target</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-[10px] font-mono text-muted uppercase">Provider Fee</div>
                      <div className="text-base font-mono font-bold text-rose-300 mt-1">
                        {simResult.clientCurrency} {(simResult.costBreakdown.providerFeeVariableAmount + simResult.costBreakdown.providerFeeFixedAmount).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-muted/60 mt-0.5">
                        {(simResult.costProfileUsed.percentage_fee * 100).toFixed(1)}% + {simResult.clientCurrency} {simResult.costProfileUsed.fixed_fee}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-[10px] font-mono text-muted uppercase">FX &amp; Buffer Cost</div>
                      <div className="text-base font-mono font-bold text-amber-300 mt-1">
                        {simResult.clientCurrency} {(simResult.costBreakdown.fxSpreadAmount + simResult.costBreakdown.riskBufferAmount).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-muted/60 mt-0.5">
                        Spread: {(simResult.costBreakdown.fxSpreadRate * 100).toFixed(2)}% | Buffer: {(simResult.costBreakdown.riskBufferRate * 100).toFixed(2)}%
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-[10px] font-mono text-muted uppercase">Verified Net Retained</div>
                      <div className="text-base font-mono font-bold text-emerald-400 mt-1">
                        {simResult.clientCurrency} {simResult.verifiedNetAfterRounding.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-emerald-500/70 mt-0.5">
                        Surplus: +{simResult.clientCurrency} {simResult.expectedSurplusAfterRounding.toFixed(4)}
                      </div>
                    </div>
                  </div>

                  {/* Tax Layer */}
                  {simResult.taxRate > 0 && (
                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/30 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-amber-400 font-bold">Tax Segregation Layer ({simResult.taxRate * 100}%):</span>
                        <div className="text-muted text-[11px] mt-0.5">
                          Commercial Subtotal: {simResult.clientCurrency} {simResult.commercialSubtotal.toFixed(2)} | Tax Amount: {simResult.clientCurrency} {simResult.taxAmount.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-muted text-[10px] uppercase block">Invoice Total:</span>
                        <span className="text-bone font-bold text-sm">
                          {simResult.clientCurrency} {simResult.invoiceTotalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Multi-Hop FX Route Details */}
                  {simResult.fxRouteApplied && (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-[11px] font-mono text-signal-gold uppercase font-bold mb-2">
                        FX Routing Path Applied {simResult.fxRouteApplied.isMultiHop ? '(Multi-Hop Routing)' : '(Direct Route)'}
                      </div>
                      <div className="space-y-1 text-xs font-mono text-muted">
                        {simResult.fxRouteApplied.routes.map((r, idx: number) => (
                          <div key={idx} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                            <span>Leg {idx + 1}: {r.from} → {r.to}</span>
                            <span>Mid-market: {r.baseRate.toFixed(4)} | Spread: {(r.spreadRate * 100).toFixed(2)}% | Buffer: {(r.safetyBufferRate * 100).toFixed(2)}% | Eff: {r.effectiveRate.toFixed(4)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sensitivity Stress Test Matrix */}
                {simResult.sensitivityScenarios && (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <span className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold block mb-4">
                      SENSITIVITY &amp; STRESS-TEST SCENARIOS
                    </span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-[10px] text-muted uppercase">
                            <th className="py-2.5">Scenario</th>
                            <th className="py-2.5">Variable Rate Shift</th>
                            <th className="py-2.5">Net Received</th>
                            <th className="py-2.5">Surplus / Shortfall</th>
                            <th className="py-2.5 text-right">Protection Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {simResult.sensitivityScenarios.map((sc, idx: number) => (
                            <tr key={idx} className="hover:bg-white/[0.01]">
                              <td className="py-3 text-bone font-medium">{sc.scenarioName}</td>
                              <td className="py-3 text-muted">{sc.variableRateDelta > 0 ? `+${(sc.variableRateDelta * 100).toFixed(1)}%` : `${(sc.variableRateDelta * 100).toFixed(1)}%`}</td>
                              <td className="py-3 text-bone">{simResult.clientCurrency} {sc.resultingTargetNet.toFixed(2)}</td>
                              <td className={`py-3 ${sc.resultingSurplus >= 0 ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
                                {sc.resultingSurplus >= 0 ? `+${simResult.clientCurrency} ${sc.resultingSurplus.toFixed(2)}` : `-${simResult.clientCurrency} ${Math.abs(sc.resultingSurplus).toFixed(2)}`}
                              </td>
                              <td className="py-3 text-right">
                                <span className={`px-2 py-0.5 rounded text-[10px] ${
                                  sc.isProtected
                                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                                    : 'bg-rose-950/60 text-rose-400 border border-rose-800'
                                }`}>
                                  {sc.isProtected ? 'PROTECTED' : 'SHORTFALL'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── SUBTAB 2: COST PROFILES CONFIG ── */}
      {subTab === 'profiles' && (
        <div className="space-y-6">
          {saveMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-mono rounded-xl">
              ✓ {saveMsg}
            </div>
          )}

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold">
                  ACTIVE PAYMENT RAIL COST PROFILES
                </span>
                <p className="text-xs text-muted mt-1">
                  Adjust gateway percentage fees, fixed processing charges, FX spreads, and safety buffers.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] text-muted uppercase">
                    <th className="py-3">Profile ID</th>
                    <th className="py-3">Provider</th>
                    <th className="py-3">Rail</th>
                    <th className="py-3">Currency</th>
                    <th className="py-3">Variable Fee</th>
                    <th className="py-3">Fixed Fee</th>
                    <th className="py-3">FX Spread</th>
                    <th className="py-3">Safety Buffer</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profiles.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.01]">
                      <td className="py-3 text-bone font-bold">{p.id}</td>
                      <td className="py-3 text-muted uppercase">{p.provider}</td>
                      <td className="py-3 text-muted">{p.rail_type}</td>
                      <td className="py-3 text-signal-gold">{p.currency}</td>
                      <td className="py-3 text-bone">{(p.percentage_fee * 100).toFixed(2)}%</td>
                      <td className="py-3 text-bone">{p.fixed_fee}</td>
                      <td className="py-3 text-muted">{(p.fx_spread_percentage * 100).toFixed(2)}%</td>
                      <td className="py-3 text-emerald-400 font-bold">{(p.risk_buffer_percentage * 100).toFixed(2)}%</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setEditingProfile({ ...p })}
                          className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-bone text-xs border border-white/10 transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Profile Modal */}
          {editingProfile && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-obsidian border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-mono text-sm font-bold text-signal-gold">
                    Edit Profile: {editingProfile.id}
                  </h3>
                  <button
                    onClick={() => setEditingProfile(null)}
                    className="text-muted hover:text-bone text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                      Variable Fee (e.g. 0.03 for 3%)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={editingProfile.percentage_fee}
                      onChange={(e) =>
                        setEditingProfile({ ...editingProfile, percentage_fee: parseFloat(e.target.value) || 0 })
                      }
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                      Fixed Fee
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProfile.fixed_fee}
                      onChange={(e) =>
                        setEditingProfile({ ...editingProfile, fixed_fee: parseFloat(e.target.value) || 0 })
                      }
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                      FX Spread Rate (e.g. 0.02 for 2%)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={editingProfile.fx_spread_percentage}
                      onChange={(e) =>
                        setEditingProfile({ ...editingProfile, fx_spread_percentage: parseFloat(e.target.value) || 0 })
                      }
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                      Safety Buffer Rate (e.g. 0.01 for 1%)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={editingProfile.risk_buffer_percentage}
                      onChange={(e) =>
                        setEditingProfile({ ...editingProfile, risk_buffer_percentage: parseFloat(e.target.value) || 0 })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setEditingProfile(null)}
                    className="px-4 py-2 rounded-lg text-xs font-mono text-muted hover:text-bone"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveProfile(editingProfile)}
                    className="px-5 py-2 rounded-lg text-xs font-mono font-bold bg-signal-gold text-obsidian hover:brightness-110"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SUBTAB 3: RECONCILIATION & LEARNING ── */}
      {subTab === 'settlements' && (
        <div className="space-y-6">
          {/* Dynamic Historical Recommendations */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <span className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold">
              HISTORICAL LEARNING &amp; P95/P99 RECOMMENDATIONS
            </span>
            <p className="text-xs text-muted">
              Dynamically analyzes recent actual gateway settlements to detect cost drift and recommend risk buffer adjustments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {analytics?.recommendations.map((rec) => (
                <div key={rec.profileId} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex justify-between items-center font-mono text-xs">
                    <span className="text-bone font-bold">{rec.profileId}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.suggestedAction === 'MAINTAIN'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                    }`}>
                      {rec.suggestedAction}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-muted space-y-1">
                    <div>Samples: {rec.sampleSize}</div>
                    <div>Configured Rate: {(rec.currentConfiguredRate * 100).toFixed(2)}%</div>
                    <div>Observed P95: {(rec.observedP95CostRate * 100).toFixed(2)}%</div>
                    <div>Recommended: {(rec.recommendedRate * 100).toFixed(2)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Settlements Feed */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <span className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold">
              RECENT POST-SETTLEMENT RECONCILIATION RECORDS
            </span>

            {analytics?.recentSettlements.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-muted">
                No settlement records logged yet. New settlements via Razorpay, PayPal, or Bank Transfer reconciliation will appear here automatically.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] text-muted uppercase">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Rail</th>
                      <th className="py-2.5">Client Paid</th>
                      <th className="py-2.5">Target Net</th>
                      <th className="py-2.5">Settled Net</th>
                      <th className="py-2.5">Profit Surplus</th>
                      <th className="py-2.5 text-right">Coverage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {analytics?.recentSettlements.map((s) => (
                      <tr key={s.id} className="hover:bg-white/[0.01]">
                        <td className="py-3 text-muted">{new Date(s.settled_at).toLocaleDateString()}</td>
                        <td className="py-3 text-bone font-medium">{s.payment_method}</td>
                        <td className="py-3 text-muted">{s.paid_client_currency} {s.paid_client_amount}</td>
                        <td className="py-3 text-bone">{s.settled_currency} {s.estimated_target_net}</td>
                        <td className="py-3 text-emerald-400 font-bold">{s.settled_currency} {s.settled_amount_net}</td>
                        <td className="py-3 text-signal-gold">+{s.settled_currency} {s.profit_surplus}</td>
                        <td className="py-3 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                            {(s.protection_coverage_ratio * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
