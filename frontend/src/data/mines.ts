export type Mine = {
  id: string
  name: string
  state: string
  lat: number
  lng: number
  zone: string
  baselineMonthlyTargetTonnes: number
}

export const MINES: Mine[] = [
  {
    id: 'balaghat',
    name: 'Balaghat',
    state: 'MP',
    lat: 21.83,
    lng: 80.19,
    zone: 'Central India',
    baselineMonthlyTargetTonnes: 18000,
  },
  {
    id: 'bharweli',
    name: 'Bharweli',
    state: 'MP',
    lat: 21.86,
    lng: 80.26,
    zone: 'Central India',
    baselineMonthlyTargetTonnes: 14500,
  },
  {
    id: 'ukwa',
    name: 'Ukwa',
    state: 'MP',
    lat: 21.93,
    lng: 80.52,
    zone: 'Central India',
    baselineMonthlyTargetTonnes: 9800,
  },
  {
    id: 'tirodi',
    name: 'Tirodi',
    state: 'MP',
    lat: 22.16,
    lng: 79.68,
    zone: 'Central India',
    baselineMonthlyTargetTonnes: 11200,
  },
  {
    id: 'dongri-buzurg',
    name: 'Dongri Buzurg',
    state: 'MH',
    lat: 20.99,
    lng: 79.34,
    zone: 'Western Belt',
    baselineMonthlyTargetTonnes: 12000,
  },
  {
    id: 'chikla',
    name: 'Chikla',
    state: 'MH',
    lat: 21.3,
    lng: 79.66,
    zone: 'Western Belt',
    baselineMonthlyTargetTonnes: 10800,
  },
  {
    id: 'mansar',
    name: 'Mansar',
    state: 'MH',
    lat: 21.44,
    lng: 79.25,
    zone: 'Western Belt',
    baselineMonthlyTargetTonnes: 12500,
  },
  {
    id: 'kandri',
    name: 'Kandri',
    state: 'MH',
    lat: 21.38,
    lng: 79.32,
    zone: 'Western Belt',
    baselineMonthlyTargetTonnes: 9300,
  },
  {
    id: 'gumgaon',
    name: 'Gumgaon',
    state: 'MH',
    lat: 21.33,
    lng: 79.03,
    zone: 'Western Belt',
    baselineMonthlyTargetTonnes: 10200,
  },
  {
    id: 'beldongri',
    name: 'Beldongri',
    state: 'MH',
    lat: 21.16,
    lng: 79.18,
    zone: 'Western Belt',
    baselineMonthlyTargetTonnes: 8600,
  },
]

export const TOTAL_MONTHLY_TARGET = MINES.reduce(
  (sum, m) => sum + m.baselineMonthlyTargetTonnes,
  0
)

export const ZONES = [...new Set(MINES.map((m) => m.zone))]
