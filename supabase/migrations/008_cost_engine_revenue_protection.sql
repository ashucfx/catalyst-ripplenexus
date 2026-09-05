-- ============================================================================
-- 008_cost_engine_revenue_protection.sql
-- Ripple Nexus / Catalyst / ClientForge
-- Cost Engine + Revenue Protection Engine Schema & Baseline Configurations
-- ============================================================================

-- 1. Cost Profiles
CREATE TABLE IF NOT EXISTS cost_profiles (
  id TEXT PRIMARY KEY,                          -- e.g. 'RAZORPAY_DOMESTIC_INR', 'PAYPAL_STANDARD_USD'
  brand TEXT NOT NULL DEFAULT 'catalyst',       -- 'catalyst' | 'ripple_nexus' | 'clientforge'
  provider TEXT NOT NULL,                       -- 'razorpay' | 'paypal' | 'bank_transfer' | 'stripe'
  rail_type TEXT NOT NULL,                      -- 'domestic_card' | 'intl_card' | 'bank_wire' | 'ach' | 'sepa' | 'wallet'
  currency TEXT NOT NULL DEFAULT 'ALL',         -- 'INR' | 'USD' | 'EUR' | 'GBP' | 'ALL'
  percentage_fee NUMERIC(8, 5) NOT NULL DEFAULT 0.02000,     -- e.g. 0.02000 for 2.0%
  fixed_fee NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,          -- minor/major standard units
  fx_spread_percentage NUMERIC(8, 5) NOT NULL DEFAULT 0.0000,-- e.g. 0.02000 for 2.0%
  intermediary_fixed_fee NUMERIC(14, 4) NOT NULL DEFAULT 0.0000, -- e.g. wire intermediary fee
  dispute_reserve_rate NUMERIC(8, 5) NOT NULL DEFAULT 0.0000,    -- dispute buffer rate
  risk_buffer_percentage NUMERIC(8, 5) NOT NULL DEFAULT 0.00750, -- e.g. 0.75% safety buffer
  min_charge_amount NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_until TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Currency Profiles
CREATE TABLE IF NOT EXISTS currency_profiles (
  code TEXT PRIMARY KEY,                        -- 'USD', 'EUR', 'GBP', 'INR', 'CHF', etc.
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  minor_unit INT NOT NULL DEFAULT 2,            -- 2 for USD/EUR, 0 for JPY, 3 for BHD
  is_receiving_currency BOOLEAN NOT NULL DEFAULT FALSE,
  is_settlement_currency BOOLEAN NOT NULL DEFAULT FALSE,
  default_settlement_currency TEXT NOT NULL DEFAULT 'INR',
  fx_route_mode TEXT NOT NULL DEFAULT 'DIRECT', -- 'DIRECT' | 'MULTI_HOP'
  multi_hop_intermediary TEXT,                  -- e.g. 'USD' for CHF -> USD -> INR
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. FX Routes
CREATE TABLE IF NOT EXISTS fx_routes (
  id TEXT PRIMARY KEY,                          -- e.g. 'USD_TO_INR', 'EUR_TO_INR', 'CHF_TO_USD'
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  base_exchange_rate NUMERIC(18, 8) NOT NULL,   -- reference mid-market rate
  spread_percentage NUMERIC(8, 5) NOT NULL DEFAULT 0.01500,     -- e.g. 1.5%
  safety_buffer_percentage NUMERIC(8, 5) NOT NULL DEFAULT 0.00500, -- e.g. 0.5%
  source TEXT NOT NULL DEFAULT 'manual',        -- 'manual' | 'ecb' | 'open_exchange_rates'
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Revenue Protection Snapshots (Immutable financial quotation & cost breakdown)
CREATE TABLE IF NOT EXISTS revenue_protection_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT,                            -- booking_id, invoice_id, etc.
  reference_type TEXT NOT NULL DEFAULT 'booking',
  brand TEXT NOT NULL DEFAULT 'catalyst',
  payment_method TEXT NOT NULL,                 -- 'razorpay' | 'paypal' | 'bank_transfer'
  cost_profile_id TEXT REFERENCES cost_profiles(id) ON DELETE SET NULL,
  
  -- Revenue & Pricing breakdown
  base_revenue_currency TEXT NOT NULL,          -- e.g. 'INR' or 'USD'
  base_revenue_amount NUMERIC(16, 4) NOT NULL,
  client_currency TEXT NOT NULL,
  target_net_revenue NUMERIC(16, 4) NOT NULL,
  
  -- Route & Cost components
  fx_route_applied JSONB NOT NULL DEFAULT '{}'::jsonb,
  estimated_provider_fee_variable NUMERIC(16, 4) NOT NULL DEFAULT 0,
  estimated_provider_fee_fixed NUMERIC(16, 4) NOT NULL DEFAULT 0,
  estimated_fx_spread_cost NUMERIC(16, 4) NOT NULL DEFAULT 0,
  estimated_risk_buffer NUMERIC(16, 4) NOT NULL DEFAULT 0,
  estimated_intermediary_cost NUMERIC(16, 4) NOT NULL DEFAULT 0,
  estimated_total_costs NUMERIC(16, 4) NOT NULL DEFAULT 0,
  
  -- Gross-up & Client Price
  gross_client_price_unrounded NUMERIC(16, 4) NOT NULL,
  final_client_price NUMERIC(16, 4) NOT NULL,
  verified_net_after_rounding NUMERIC(16, 4) NOT NULL,
  
  -- Tax isolation (separate from profit/loss)
  tax_rate_applied NUMERIC(8, 5) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(16, 4) NOT NULL DEFAULT 0,
  invoice_total_amount NUMERIC(16, 4) NOT NULL,
  
  -- Lifecycle & Audit
  status TEXT NOT NULL DEFAULT 'QUOTED',        -- 'QUOTED' | 'ACCEPTED' | 'SETTLED' | 'CANCELLED'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Settlement Records (Actual post-settlement reconciliation)
CREATE TABLE IF NOT EXISTS settlement_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id UUID REFERENCES revenue_protection_snapshots(id) ON DELETE SET NULL,
  gateway_transaction_id TEXT,
  payment_method TEXT NOT NULL,
  paid_client_currency TEXT NOT NULL,
  paid_client_amount NUMERIC(16, 4) NOT NULL,
  settled_currency TEXT NOT NULL,
  settled_amount_net NUMERIC(16, 4) NOT NULL,
  actual_provider_fee NUMERIC(16, 4) NOT NULL DEFAULT 0,
  actual_fx_rate NUMERIC(18, 8),
  estimated_target_net NUMERIC(16, 4) NOT NULL,
  profit_surplus NUMERIC(16, 4) NOT NULL DEFAULT 0,     -- settled_amount_net - target_net if > 0
  leakage_shortfall NUMERIC(16, 4) NOT NULL DEFAULT 0,  -- target_net - settled_amount_net if > 0
  fee_variance NUMERIC(16, 4) NOT NULL DEFAULT 0,       -- actual_fee - estimated_fee
  fx_variance NUMERIC(16, 4) NOT NULL DEFAULT 0,        -- actual_fx_cost - estimated_fx_cost
  protection_coverage_ratio NUMERIC(10, 6) NOT NULL DEFAULT 1.000000, -- settled_net / target_net
  settled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Dynamic Pricing Recommendations (P95/P99 historical cost learning)
CREATE TABLE IF NOT EXISTS pricing_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT NOT NULL REFERENCES cost_profiles(id) ON DELETE CASCADE,
  sample_size INT NOT NULL DEFAULT 0,
  observed_mean_cost_rate NUMERIC(8, 5) NOT NULL,
  observed_p95_cost_rate NUMERIC(8, 5) NOT NULL,
  observed_p99_cost_rate NUMERIC(8, 5) NOT NULL,
  current_configured_rate NUMERIC(8, 5) NOT NULL,
  recommended_rate NUMERIC(8, 5) NOT NULL,
  suggested_action TEXT NOT NULL,               -- 'MAINTAIN' | 'INCREASE_BUFFER' | 'REDUCE_BUFFER'
  status TEXT NOT NULL DEFAULT 'PENDING',       -- 'PENDING' | 'APPLIED' | 'DISMISSED'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_rev_snapshots_ref ON revenue_protection_snapshots(reference_id);
CREATE INDEX IF NOT EXISTS idx_rev_snapshots_method ON revenue_protection_snapshots(payment_method);
CREATE INDEX IF NOT EXISTS idx_rev_snapshots_status ON revenue_protection_snapshots(status);
CREATE INDEX IF NOT EXISTS idx_settlement_snapshot ON settlement_records(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_settlement_gateway_tx ON settlement_records(gateway_transaction_id);

-- Baseline Seed Data
INSERT INTO currency_profiles (code, name, symbol, minor_unit, is_receiving_currency, is_settlement_currency, default_settlement_currency, fx_route_mode, multi_hop_intermediary)
VALUES
  ('INR', 'Indian Rupee', '₹', 2, TRUE, TRUE, 'INR', 'DIRECT', NULL),
  ('USD', 'US Dollar', '$', 2, TRUE, TRUE, 'USD', 'DIRECT', NULL),
  ('GBP', 'British Pound', '£', 2, TRUE, FALSE, 'USD', 'DIRECT', NULL),
  ('EUR', 'Euro', '€', 2, TRUE, FALSE, 'USD', 'DIRECT', NULL),
  ('CHF', 'Swiss Franc', 'CHF', 2, FALSE, FALSE, 'USD', 'MULTI_HOP', 'USD'),
  ('CAD', 'Canadian Dollar', 'CA$', 2, TRUE, FALSE, 'USD', 'DIRECT', NULL),
  ('AUD', 'Australian Dollar', 'AU$', 2, TRUE, FALSE, 'USD', 'DIRECT', NULL),
  ('SGD', 'Singapore Dollar', 'S$', 2, TRUE, FALSE, 'USD', 'DIRECT', NULL),
  ('AED', 'UAE Dirham', 'AED', 2, TRUE, FALSE, 'USD', 'DIRECT', NULL)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  symbol = EXCLUDED.symbol,
  minor_unit = EXCLUDED.minor_unit,
  is_receiving_currency = EXCLUDED.is_receiving_currency,
  is_settlement_currency = EXCLUDED.is_settlement_currency,
  default_settlement_currency = EXCLUDED.default_settlement_currency,
  fx_route_mode = EXCLUDED.fx_route_mode,
  multi_hop_intermediary = EXCLUDED.multi_hop_intermediary;

INSERT INTO fx_routes (id, from_currency, to_currency, base_exchange_rate, spread_percentage, safety_buffer_percentage, source)
VALUES
  ('USD_TO_INR', 'USD', 'INR', 87.00000000, 0.01500, 0.00750, 'manual'),
  ('GBP_TO_INR', 'GBP', 'INR', 113.50000000, 0.01500, 0.00750, 'manual'),
  ('EUR_TO_INR', 'EUR', 'INR', 94.00000000, 0.01500, 0.00750, 'manual'),
  ('CHF_TO_USD', 'CHF', 'USD', 1.12500000, 0.01200, 0.00500, 'manual'),
  ('GBP_TO_USD', 'GBP', 'USD', 1.30500000, 0.01000, 0.00500, 'manual'),
  ('EUR_TO_USD', 'EUR', 'USD', 1.08000000, 0.01000, 0.00500, 'manual'),
  ('CAD_TO_USD', 'CAD', 'USD', 0.73500000, 0.01200, 0.00500, 'manual'),
  ('AUD_TO_USD', 'AUD', 'USD', 0.65500000, 0.01200, 0.00500, 'manual'),
  ('SGD_TO_USD', 'SGD', 'USD', 0.75000000, 0.01200, 0.00500, 'manual'),
  ('AED_TO_USD', 'AED', 'USD', 0.27229400, 0.00500, 0.00300, 'manual')
ON CONFLICT (id) DO UPDATE SET
  base_exchange_rate = EXCLUDED.base_exchange_rate,
  spread_percentage = EXCLUDED.spread_percentage,
  safety_buffer_percentage = EXCLUDED.safety_buffer_percentage;

INSERT INTO cost_profiles (id, brand, provider, rail_type, currency, percentage_fee, fixed_fee, fx_spread_percentage, intermediary_fixed_fee, dispute_reserve_rate, risk_buffer_percentage, min_charge_amount)
VALUES
  ('RAZORPAY_DOMESTIC_INR', 'catalyst', 'razorpay', 'domestic_card', 'INR', 0.02000, 0.0000, 0.00000, 0.0000, 0.0000, 0.00500, 100.0000),
  ('RAZORPAY_INTL_CARD', 'catalyst', 'razorpay', 'intl_card', 'ALL', 0.03000, 0.0000, 0.02000, 0.0000, 0.0050, 0.01000, 10.0000),
  ('PAYPAL_STANDARD', 'catalyst', 'paypal', 'wallet', 'USD', 0.04400, 0.3000, 0.03500, 0.0000, 0.0050, 0.01000, 5.0000),
  ('BANK_TRANSFER_FPS', 'catalyst', 'bank_transfer', 'bank_wire', 'GBP', 0.00000, 0.0000, 0.00500, 0.0000, 0.0000, 0.00250, 50.0000),
  ('BANK_TRANSFER_ACH', 'catalyst', 'bank_transfer', 'ach', 'USD', 0.00000, 0.0000, 0.00500, 0.0000, 0.0000, 0.00250, 50.0000),
  ('BANK_TRANSFER_SEPA', 'catalyst', 'bank_transfer', 'sepa', 'EUR', 0.00000, 0.0000, 0.00500, 0.0000, 0.0000, 0.00250, 50.0000),
  ('BANK_TRANSFER_SWIFT_WIRE', 'catalyst', 'bank_transfer', 'bank_wire', 'ALL', 0.00000, 0.0000, 0.01500, 15.0000, 0.0000, 0.00750, 100.0000)
ON CONFLICT (id) DO UPDATE SET
  percentage_fee = EXCLUDED.percentage_fee,
  fixed_fee = EXCLUDED.fixed_fee,
  fx_spread_percentage = EXCLUDED.fx_spread_percentage,
  intermediary_fixed_fee = EXCLUDED.intermediary_fixed_fee,
  dispute_reserve_rate = EXCLUDED.dispute_reserve_rate,
  risk_buffer_percentage = EXCLUDED.risk_buffer_percentage;
