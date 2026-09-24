# CATALYST™ BY RIPPLE NEXUS
## Executive Talent Positioning Architecture (TPA) & High-Frequency Career Ingestion Engine

> **RESTRICTED ACCESS · STRICTLY CONFIDENTIAL · PROPRIETARY INTELLECTUAL PROPERTY**  
> **CLASSIFICATION: TIER-1 SENSITIVE · RIPPLE NEXUS INTERNAL PRODUCTION CODEBASE**  
> *Unauthorized duplication, distribution, reverse engineering, scraping, or dissemination of this software, its algorithms, or associated architecture without prior written authorization from Ripple Nexus is strictly prohibited and protected under international copyright, trademark, and trade secret laws.*

---

## 🔒 Confidentiality & Intellectual Property Notice

This repository contains proprietary source code, algorithmic valuation frameworks, and architectural assets belonging exclusively to **Ripple Nexus**.

1. **Trade Secrets & IP**: All scoring models (Talent Positioning Index™ - TPI), multi-currency cost & tax engines, narrative discretization models, and automated ClientForge CRM flywheel pipelines are protected trade secrets.
2. **Access Limitation**: Access is granted strictly on a need-to-know basis to authorized personnel bound by executed Non-Disclosure Agreements (NDAs) and proprietary IP assignment covenants.
3. **No Open Distribution**: This repository is **NOT** open-source software. No license, express or implied, is granted to third parties.

---

## 🏛️ System Overview & Enterprise Mission

**Catalyst** is an institutional-grade talent positioning and professional identity engineering platform deployed across Tier-1 financial and technology corridors (India, UAE/GCC, Singapore/ASEAN, United Kingdom, and the United States). 

The platform bridges executive compensation benchmarking, algorithmic ATS parsing heuristics (Workday, Taleo, Greenhouse, Lever), and sovereign narrative discretion for senior directors, VPs, and C-Suite leaders.

### Core Institutional Objectives
- **Economic Value Realization**: Systematically correcting the 10%–35% compensation deficit experienced by senior leadership.
- **Algorithmic ATS Compliance**: Engineering candidate digital estates to guarantee a 98%+ enterprise ATS pass rate.
- **Narrative Discretion**: Preserving executive confidentiality through discrete portfolio architecture, identity masking, and controlled multi-channel signaling.
- **High-Velocity Pipeline Integration**: Real-time asynchronous telemetry and lead synchronization directly into the **ClientForge CRM & Leads Flywheel**.

---

## 🏗️ Production Architecture Specification

The codebase is engineered on a resilient, high-throughput micro-service topology built on **Next.js 15 (App Router)** and **React 19 Server Components**, backed by high-availability edge infrastructure:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               NEXT.JS 15 (APP ROUTER) EDGE CLUSTER                              │
│                                                                                                 │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐  ┌───────────────────────┐  │
│  │     Client-Facing Edge       │  │     Institutional Engine     │  │   AEO & Search Ingest │  │
│  │                              │  │                              │  │                       │  │
│  │  • Homepage (Global Router)  │  │  • TPI Diagnostic Engine     │  │  • Schema.org Graph   │  │
│  │  • Sovereign Executive Suite │  │  • Multi-Currency Tax Engine │  │  • llms.txt Standard  │  │
│  │  • Market Value Audit Intake │  │  • Payment Reconciler (RZP/PP│  │  • Edge OG Generator  │  │
│  │  • Verified Testimonials Hub │  │  • Calendar Scheduling Core  │  │  • Dynamic Sitemap    │  │
│  └──────────────┬───────────────┘  └──────────────┬───────────────┘  └───────────┬───────────┘  │
│                 │                                 │                              │              │
└─────────────────┼─────────────────────────────────┼──────────────────────────────┼──────────────┘
                  │                                 │                              │
                  ▼                                 ▼                              ▼
┌───────────────────────────────────┐ ┌───────────────────────────┐ ┌─────────────────────────────┐
│       SECURITY & RATE LIMIT       │ │    PERSISTENCE & STATE    │ │     THIRD-PARTY MESH        │
│                                   │ │                           │ │                             │
│ • Upstash Redis Sliding Window    │ │ • Supabase Postgres (RLS) │ │ • ClientForge CRM Public API│
│ • Content Security Policy (CSP)   │ │ • Decimal.js Financial Ctr│ │ • Razorpay Enterprise SDK   │
│ • Strict HSTS & Security Headers  │ │ • Immutable Booking Logs  │ │ • PayPal Server v2 SDK      │
│ • JWT Session Verification        │ │ • Secure Vault Credentials│ │ • Resend Transactional Mail│
└───────────────────────────────────┘ └───────────────────────────┘ └─────────────────────────────┘
```

---

## ⚙️ Core Technology Matrix

| System Component | Technology | Enterprise Role |
|---|---|---|
| **Core Framework** | Next.js 15.3.x (App Router) | Hybrid Server Components (RSC), Edge Handlers, SSR |
| **Runtime & Language** | Node.js 20+ LTS / TypeScript 5.x | Strict-mode type safety with zero `any` tolerance |
| **Styling & Design System** | Tailwind CSS 3.4.x / Vanilla CSS | Obsidian Void (`#0A0B0D`), Signal Gold (`#B8935B`), Cormorant serif typography |
| **Database & Auth** | Supabase Postgres (Row Level Security) | Strict tenant isolation, audit logging, encrypted intake |
| **Rate Limiting** | Upstash Redis | Distributed sliding-window DDoS and abuse protection |
| **Transactional Mail** | Resend API | DKIM/SPF-signed client dossiers and admin alerts |
| **Payment Ingestion** | Razorpay Enterprise & PayPal SDK | Tamper-proof webhook reconciliation and multi-currency settlement |
| **AEO / Search Standards** | LLMs.txt & Schema.org JSON-LD | Machine-readable ingestion for Perplexity, ChatGPT, Claude, and Gemini |

---

## 📂 Repository Topology

```
.
├── public/                             # Static deployment assets
│   ├── llms.txt                        # AI Answer Engine root index
│   ├── llms-full.txt                   # Complete institutional knowledge dossier
│   ├── og-image.svg                    # Official vector OpenGraph asset
│   ├── logo-email.svg                  # Catalyst Inflection Mark vector
│   └── noise.svg                       # Texture layer
├── src/
│   ├── app/                            # Next.js App Router route segments
│   │   ├── audit/                      # Market Value Audit intake & checkout
│   │   ├── blueprint/                  # Career Booster package matrix & specifications
│   │   ├── book/                       # Confidential executive calendar scheduler
│   │   │   └── [type]/                 # Dynamic session booking flow
│   │   ├── checkout/                   # Transactional payment processing
│   │   ├── executive/                  # Sovereign Executive Suite (Private Retainer)
│   │   ├── intelligence/               # Proprietary research whitepapers & labor mechanics
│   │   │   └── [slug]/                 # Dynamic whitepaper route with Article JSON-LD
│   │   ├── platform/                   # TPA methodology & architecture details
│   │   ├── request/                    # Confidential advisory intake pipeline
│   │   ├── system/                     # Institutional signaling framework documentation
│   │   ├── testimonials/               # Verified executive placement hub
│   │   ├── tpi/                        # Talent Positioning Index diagnostic engine
│   │   ├── layout.tsx                  # Root institutional layout with Schema.org graph
│   │   ├── opengraph-image.tsx         # Edge-rendered dynamic OpenGraph card generator
│   │   ├── robots.ts                   # Search bot & AI agent crawling governance
│   │   └── sitemap.ts                  # Dynamic freshness-weighted XML sitemap
│   ├── components/                     # Reusable React components
│   │   ├── booking/                    # Booking flow & appointment management
│   │   ├── layout/                     # Header, Footer, and navigation scaffolding
│   │   └── ui/                         # Design system primitives, InflectionMark, pricing matrices
│   ├── data/                           # Verified datasets (testimonials, package models)
│   └── lib/                            # Enterprise shared libraries
│       ├── clientforge/                # ClientForge CRM & Leads Flywheel synchronization
│       ├── db/                         # Supabase database abstraction & bookings queries
│       ├── email/                      # Resend campaign & transactional templates
│       └── payment/                    # Cost engine, tax engine & multi-currency profiles
└── next.config.ts                      # Security headers, rewrites, and build configurations
```

---

## 🔐 Environment Security & Credentials

Configuration variables must be provisioned via secure secret managers (e.g., Doppler, AWS Secrets Manager, or Vercel Protected Environment Variables). **Never commit plain-text credentials.**

```bash
# ==============================================================================
# CATALYST PRODUCTION ENVIRONMENT CONFIGURATION (STRICTLY CONFIDENTIAL)
# ==============================================================================

# Primary Host Canonical Base
NEXT_PUBLIC_BASE_URL=https://www.catalyst.theripplenexus.com

# ClientForge CRM Integration
CLIENTFORGE_URL=https://crm.theripplenexus.com
CLIENTFORGE_API_KEY=sec_live_XXXXXXXXXXXXXXXXXXXXXXXX

# Database Persistence (Supabase with RLS)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1Ni...

# Payment Gateways (Multi-Currency)
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
RAZORPAY_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXX
PAYPAL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXX
PAYPAL_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
PAYPAL_WEBHOOK_ID=XXXXXXXXXXXXXXXXXXXXXXXX

# Telemetry & Email Infrastructure
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX
RESEND_FROM_EMAIL=catalyst@theripplenexus.com
RESEND_ADMIN_EMAIL=internal-alerts@theripplenexus.com

# Distributed Edge Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=https://xxxxxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXX

# Administrative Credentials
ADMIN_SECRET_TOKEN=sec_auth_XXXXXXXXXXXXXXXXXXXX
```

---

## 🧪 Quality Assurance & CI/CD Pipeline Standards

All pull requests and production deployment branches (`main`, `staging`) must strictly satisfy automated CI/CD pipeline gating before artifact generation:

```bash
# 1. Static Type Enforcement (Zero tolerance for type deviations)
npx tsc --noEmit

# 2. Strict Linting & AST Integrity
npm run lint

# 3. Production Compilation & SSG Pre-rendering (80+ Routes)
npm run build
```

---

## 🛡️ Enterprise Security & Compliance

- **HTTP Security Strict Transport**: Enforced `max-age=63072000; includeSubDomains; preload`.
- **Content Security Policy**: Granular white-listing restricted to trusted payment gateways (`Razorpay`, `PayPal`), privacy analytics, and CDN domains.
- **Zero-Trust Telemetry**: Executive consultation requests sanitize sensitive personal identifiable information (PII) before transmission to downstream persistence.
- **Rate Limiting**: IP-based token-bucket rate limiting guarding all ingest routes (`/api/request`, `/api/audit/intake`, `/api/tpi`).

---

## 📜 Intellectual Property & Copyright Notice

```
CONFIDENTIAL AND PROPRIETARY SOURCE CODE
© 2024–2026 Ripple Nexus. All Rights Reserved.

Talent Positioning Architecture™, TPA™, Talent Positioning Index™, and Catalyst™ 
are registered or common law trademarks of Ripple Nexus.

All other trademarks, brand identities, and institution names referenced within 
this application are the property of their respective owners and used strictly 
for executive identification and comparative benchmarking purposes.
```
