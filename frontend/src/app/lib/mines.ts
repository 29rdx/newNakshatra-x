import { rand, round1 } from './format'

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

export type TelemetryReading = {
  ndvi: number
  soilMoisture: number
  landTemp: number
  rainfall: number
  production: number
  target: number
  risk: 'LOW' | 'WATCH' | 'ELEVATED'
  updatedAt: string
  history: {
    ndvi: number[]
    soilMoisture: number[]
    landTemp: number[]
    rainfall: number[]
  }
}

function generateHistory(base: number, variance: number, len = 24): number[] {
  return Array.from({ length: len }, (_, i) =>
    round1(base + Math.sin(i * 0.5) * variance + rand(-variance * 0.3, variance * 0.3))
  )
}

function riskFromScore(score: number): 'LOW' | 'WATCH' | 'ELEVATED' {
  if (score >= 80) return 'ELEVATED'
  if (score >= 60) return 'WATCH'
  return 'LOW'
}

export function generateTelemetry(mine: Mine): TelemetryReading {
  const isMP = mine.state === 'MP'
  const baseNDVI = isMP ? 0.72 : 0.65
  const baseSoil = isMP ? 42 : 38
  const baseTemp = isMP ? 34.2 : 36.1
  const baseRain = isMP ? 4.8 : 3.2
  const riskScore = rand(40, 95)
  const target = mine.baselineMonthlyTargetTonnes
  const production = Math.round(target * rand(0.62, 1.08))

  return {
    ndvi: round1(baseNDVI + rand(-0.12, 0.12)),
    soilMoisture: round1(baseSoil + rand(-8, 8)),
    landTemp: round1(baseTemp + rand(-3, 3)),
    rainfall: round1(Math.max(0, baseRain + rand(-4, 6))),
    production,
    target,
    risk: riskFromScore(riskScore),
    updatedAt: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
    history: {
      ndvi: generateHistory(baseNDVI, 0.08),
      soilMoisture: generateHistory(baseSoil, 6),
      landTemp: generateHistory(baseTemp, 2.5),
      rainfall: generateHistory(baseRain, 3),
    },
  }
}

export function generateAllTelemetry(): Record<string, TelemetryReading> {
  const map: Record<string, TelemetryReading> = {}
  for (const mine of MINES) {
    map[mine.id] = generateTelemetry(mine)
  }
  return map
}
