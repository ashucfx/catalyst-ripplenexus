export type Band = 'A' | 'B' | 'C' | 'D'

// Country ISO 3166-1 alpha-2 → pricing band (from PDF)
export const COUNTRY_BAND: Record<string, Band> = {
  // Band A — Western Europe, Anglosphere, Nordic, Singapore
  US: 'A', GB: 'A', AU: 'A', CA: 'A', NZ: 'A',
  DE: 'A', FR: 'A', NL: 'A', AT: 'A', BE: 'A',
  CH: 'A', DK: 'A', FI: 'A', NO: 'A', SE: 'A',
  IE: 'A', LU: 'A', IS: 'A', SG: 'A',

  // Band B — Gulf, East Asia, Southern / Central Europe
  AE: 'B', BH: 'B', KW: 'B', QA: 'B', SA: 'B',
  JP: 'B', HK: 'B', KR: 'B', TW: 'B', IL: 'B',
  CY: 'B', CZ: 'B', EE: 'B', GR: 'B', IT: 'B',
  MT: 'B', PT: 'B', ES: 'B', SI: 'B',

  // Band C — Latin America, South-East Asia, South Africa, C&E Europe
  AR: 'C', BR: 'C', CL: 'C', CN: 'C', CO: 'C',
  CR: 'C', HR: 'C', HU: 'C', MX: 'C', MY: 'C',
  OM: 'C', PA: 'C', PE: 'C', PL: 'C', RO: 'C',
  SK: 'C', ZA: 'C', TH: 'C', TR: 'C', UY: 'C',
  BG: 'C', LV: 'C', LT: 'C',

  // Band D — South Asia (ex-India), Africa, SE Asia developing
  // India (IN) uses separate INR pricing — not in this map
  BD: 'D', EG: 'D', GH: 'D', ID: 'D', KE: 'D',
  KZ: 'D', MA: 'D', NG: 'D', NP: 'D', PH: 'D',
  PK: 'D', LK: 'D', UA: 'D', VN: 'D',
}

// Per-service USD prices by band and experience tier
// Derived so that Career Booster bundle prices ≈ Foundation/Professional/Executive from PDF:
//   Band A: ~$117 / ~$347 / ~$899   (PDF: $129 / $349 / $899)
//   Band B: ~$100 / ~$270 / ~$695   (PDF: $99  / $279 / $699)
//   Band C: ~$66  / ~$185 / ~$483   (PDF: $69  / $189 / $499)
//   Band D: ~$41  / ~$109 / ~$262   (PDF: $42  / $108 / $264)
export type IntlTier = { label: string; resume: number; linkedin: number; portfolio: number }

export const INTL_TIER_PRICES: Record<Band, IntlTier[]> = {
  A: [
    { label: '0–2 yrs',  resume:  89, linkedin:  49, portfolio:  179 },
    { label: '3–8 yrs',  resume: 259, linkedin: 149, portfolio:  349 },
    { label: '9–15 yrs', resume: 649, linkedin: 409, portfolio:  999 },
    { label: '15+ yrs',  resume: 899, linkedin: 549, portfolio: 1499 },
  ],
  B: [
    { label: '0–2 yrs',  resume:  69, linkedin:  49, portfolio:  139 },
    { label: '3–8 yrs',  resume: 199, linkedin: 119, portfolio:  269 },
    { label: '9–15 yrs', resume: 499, linkedin: 319, portfolio:  769 },
    { label: '15+ yrs',  resume: 689, linkedin: 419, portfolio: 1149 },
  ],
  C: [
    { label: '0–2 yrs',  resume:  49, linkedin:  29, portfolio:   99 },
    { label: '3–8 yrs',  resume: 139, linkedin:  79, portfolio:  189 },
    { label: '9–15 yrs', resume: 349, linkedin: 219, portfolio:  539 },
    { label: '15+ yrs',  resume: 479, linkedin: 299, portfolio:  799 },
  ],
  D: [
    { label: '0–2 yrs',  resume:  29, linkedin:  19, portfolio:   59 },
    { label: '3–8 yrs',  resume:  79, linkedin:  49, portfolio:   99 },
    { label: '9–15 yrs', resume: 179, linkedin: 129, portfolio:  329 },
    { label: '15+ yrs',  resume: 249, linkedin: 169, portfolio:  489 },
  ],
}

// Flat audit price (Foundation tier from PDF) — fixed across experience tiers
export const INTL_AUDIT_USD: Record<Band, number> = {
  A: 129,
  B: 99,
  C: 69,
  D: 42,
}

export function getBand(country: string): Band {
  return COUNTRY_BAND[country] ?? 'A'
}

export function getIntlTiers(band: Band): IntlTier[] {
  return INTL_TIER_PRICES[band]
}
