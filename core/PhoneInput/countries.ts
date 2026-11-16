export type PhoneCountry = {
  // ISO 3166-1 alpha-2 code, such as "BR"
  code: string
  name: string
  // calling code without the plus, such as "55"
  dial: string
}

export const DEFAULT_COUNTRIES: PhoneCountry[] = [
  { code: 'AR', name: 'Argentina', dial: '54' },
  { code: 'AU', name: 'Australia', dial: '61' },
  { code: 'BR', name: 'Brazil', dial: '55' },
  { code: 'CA', name: 'Canada', dial: '1' },
  { code: 'CL', name: 'Chile', dial: '56' },
  { code: 'CN', name: 'China', dial: '86' },
  { code: 'CO', name: 'Colombia', dial: '57' },
  { code: 'FR', name: 'France', dial: '33' },
  { code: 'DE', name: 'Germany', dial: '49' },
  { code: 'IN', name: 'India', dial: '91' },
  { code: 'IE', name: 'Ireland', dial: '353' },
  { code: 'IT', name: 'Italy', dial: '39' },
  { code: 'JP', name: 'Japan', dial: '81' },
  { code: 'MX', name: 'Mexico', dial: '52' },
  { code: 'NL', name: 'Netherlands', dial: '31' },
  { code: 'PE', name: 'Peru', dial: '51' },
  { code: 'PT', name: 'Portugal', dial: '351' },
  { code: 'ZA', name: 'South Africa', dial: '27' },
  { code: 'KR', name: 'South Korea', dial: '82' },
  { code: 'ES', name: 'Spain', dial: '34' },
  { code: 'CH', name: 'Switzerland', dial: '41' },
  { code: 'GB', name: 'United Kingdom', dial: '44' },
  { code: 'US', name: 'United States', dial: '1' },
  { code: 'UY', name: 'Uruguay', dial: '598' }
]

// The flag emoji of an ISO code, built from its regional indicator letters.
export const flagOf = (code: string) =>
  String.fromCodePoint(
    ...Array.from(code.toUpperCase()).map(
      (letter) => 127397 + letter.charCodeAt(0)
    )
  )
