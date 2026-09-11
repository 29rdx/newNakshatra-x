export type ForecastSeries = {
  months: string[]
  actual: number[]
  predicted: number[]
  target: number[]
  band: number[]
}

export const correctiveActions = [
  {
    title: 'Adjust Mine Schedule',
    detail: 'Shift Balaghat haulage to the 04:00–10:00 dry window.',
    recovery: 2400,
    priority: 'HIGH',
  },
  {
    title: 'Optimize Blasting',
    detail: 'Re-sequence Bharweli blast pattern; improve fragmentation.',
    recovery: 1800,
    priority: 'MEDIUM',
  },
  {
    title: 'Redeploy Equipment',
    detail: 'Move idle DMM-3 from Tirodi to Mansar ahead of advisory.',
    recovery: 1200,
    priority: 'HIGH',
  },
]

export function buildForecastSeries(stress: number): ForecastSeries {
  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      new Date(2026, i, 1)
    )
  )

  const target = months.map(() => 100)

  const actual = months.map(
    (_, i) => 98 - stress * 10 + Math.sin(i / 2.4) * 3.2 + i * 0.35
  )

  const predicted = months.map((_, i) => {
    const base = actual[i]
    const dip = i > 5 ? stress * 11 + (i - 5) * 1.2 : stress * 4
    return base - dip
  })

  const band = months.map(
    (_, i) => 2.6 + stress * 3.2 + (i > 5 ? 0.8 : 0)
  )

  return {
    months,
    actual: actual.map((v) => Math.max(70, Math.min(108, v))),
    predicted: predicted.map((v) => Math.max(65, Math.min(108, v))),
    target,
    band,
  }
}
