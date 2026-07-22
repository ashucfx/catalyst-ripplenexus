# Catalyst by Ripple Nexus — Career Booster & Talent Positioning Engine

> **High-Converting Talent Positioning & Career Booster Suite** for senior professionals, directors, and executives across ASEAN, APAC, GCC, and Global markets. Integrated with **ClientForge CRM & Leads Flywheel**.

---

## 🎯 Platform Overview

**Catalyst** is an executive-level talent positioning application designed to transform passive resumes and outdated LinkedIn profiles into high-converting recruiter magnets.

Rather than relying on automated direct paywalls that cause conversion friction, Catalyst utilizes a **1-on-1 Strategic Consultation Intake System** that automatically registers candidate profiles directly into **ClientForge CRM & Leads Flywheel**.

---

## 🚀 Core Capabilities

| Service Component | Description | Formats / Features |
|---|---|---|
| **Executive Resume Rewrite** | Rebuilt from scratch with quantified revenue & scale metrics. Guaranteed ATS 98%+ pass rate. | MS Word (`.docx`) + PDF |
| **LinkedIn Profile & Banner Studio** | Headline overhaul, story-driven bio, work history alignment, custom banner graphic asset & DP guidelines. | High-Res Graphics + Profile Copy |
| **Complimentary Cover Letter** | Custom narrative cover letter included complimentary with every Career Booster package. | Adaptable Template + Email Pitch |
| **Country & Market Optimization** | Targeted formatting and compliance for Singapore, Dubai/UAE, India, Australia, US, UK, Indonesia, and Vietnam. | Region-Specific Norms |
| **Multi-Lingual CV Adaptation** | Dual-language CV translation and adaptation for multinational corporate boards. | ENG, CHN, JPN, BHS, GER, FRA |
| **Verified Testimonials Hub** | Interactive success stories filterable by region (ASEAN, APAC, GCC, Global) and role with salary hike metrics. | Real Candidate Case Studies |
| **ClientForge CRM Sync** | Direct API integration submitting leads to ClientForge Portal under **New Requests** and **Leads Flywheel**. | Asynchronous API Dispatch |

---

## 🛠️ Technology Stack

| Layer | Choice | Role / Usage |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | High-performance React 19 server/client layout |
| **Language** | TypeScript 5.x | Strict type safety across components and APIs |
| **Styling** | Tailwind CSS 3.x | Custom dark-mode glassmorphism design system |
| **CRM Integration** | ClientForge Public API | Pushes leads to `/api/public/inquire/submit` |
| **Database** | Supabase (Postgres) | Persistent lead records and subscriber tracking |
| **Email Service** | Resend API | Automated client & admin confirmation dispatches |
| **Rate Limiting** | Upstash Redis | Sliding-window IP rate limiting for API endpoints |
| **Analytics & Geo** | Vercel Header Geo | Automatic currency & regional market detection |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            NEXT.JS 15 APP ROUTER                            │
│                                                                             │
│   ┌────────────────────┐   ┌──────────────────────────┐   ┌──────────────┐  │
│   │  Landing & Routes  │   │     API Route Handlers    │   │ Static Meta  │  │
│   │                    │   │                          │   │              │  │
│   │  / (Home)          │   │  /api/request            │   │ sitemap.ts   │  │
│   │  /testimonials     │   │  /api/geo                │   │ robots.ts    │  │
│   │  /blueprint        │   │  /api/tpi                │   │ layout.tsx   │  │
│   │  /audit            │   │  /api/schedule/*         │   └──────────────┘  │
│   │  /request          │   │  /api/newsletter         │                     │
│   │  /book             │   │  /api/platform-waitlist  │                     │
│   └────────────────────┘   └────────────┬─────────────┘                     │
│                                         │                                   │
└─────────────────────────────────────────┼───────────────────────────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            │                             │                             │
     ┌──────▼──────┐               ┌──────▼──────┐               ┌──────▼──────┐
     │ ClientForge │               │  Supabase   │               │ Resend      │
     │ CRM & Leads │               │  Database   │               │ Email       │
     │ Flywheel    │               │  Lead Store │               │ Dispatch    │
     └─────────────┘               └─────────────┘               └─────────────┘
```

---

## 📁 Repository Structure

```
src/
├── app/
│   ├── page.tsx                        # Homepage — Career Booster showcase & regional switcher
│   ├── testimonials/page.tsx           # Testimonials Hub — Filterable success stories (ASEAN, APAC, GCC)
│   ├── blueprint/page.tsx              # Career Booster Package breakdown & pricing matrix
│   ├── audit/page.tsx                  # Analyst Market Value Audit consultation intake
│   ├── request/page.tsx                # Executive 3-step consultation intake form
│   ├── book/page.tsx                   # Live consultation calendar booking interface
│   └── api/
│       ├── request/route.ts            # Lead submission handler (Syncs ClientForge CRM)
│       └── geo/route.ts                # Geolocation and currency detection
├── components/
│   ├── layout/                         # Navigation Header & Footer
│   └── ui/                             # TestimonialCard, BlueprintPricingMatrix, AuditCheckout
├── data/
│   └── testimonialsData.ts             # Authentic candidate review dataset with country flags
└── lib/
    ├── clientforge/clientforge.ts      # ClientForge CRM & Leads Flywheel API integration
    ├── db/supabase.ts                  # Supabase database client
    └── email/resend.ts                 # Email delivery client
```

---

## 🔧 Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Site URL
NEXT_PUBLIC_BASE_URL=https://www.catalyst.theripplenexus.com

# ClientForge CRM API Endpoint
CLIENTFORGE_URL=http://localhost:3000

# Resend Email Delivery
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXX
RESEND_FROM_EMAIL=catalyst@theripplenexus.com
RESEND_ADMIN_EMAIL=admin@theripplenexus.com

# Supabase Storage & Database
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1Ni...

# Upstash Redis Rate Limiting (Optional)
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=XXXXXXXXXXXX
```

---

## ⚡ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

3. **Production Build & Type Check**:
   ```bash
   npm run build
   ```

---

## 📜 License

Copyright © 2026 **Ripple Nexus**. All rights reserved. Confidential and proprietary software.
