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
  BD: 'D', EG: 'D', GH: 'D', ID: 'D', KE: 'D',
  KZ: 'D', MA: 'D', NG: 'D', NP: 'D', PH: 'D',
  PK: 'D', LK: 'D', UA: 'D', VN: 'D',
  // India (IN) is handled separately with INR pricing
}

// USD price points per band (Foundation / Professional / Executive from PDF)
// Mapping: audit = Foundation, careerBooster = Professional, premiumPlus = Executive
export const INTL_USD: Record<Band, { audit: number; careerBooster: number; premiumPlus: number }> = {
  A: { audit: 129, careerBooster: 349, premiumPlus: 899 },
  B: { audit: 99,  careerBooster: 279, premiumPlus: 699 },
  C: { audit: 69,  careerBooster: 189, premiumPlus: 499 },
  D: { audit: 42,  careerBooster: 108, premiumPlus: 264 },
}

export function getBand(country: string): Band {
  return COUNTRY_BAND[country] ?? 'A'
}

export function getIntlUSD(country: string) {
  return INTL_USD[getBand(country)]
}
