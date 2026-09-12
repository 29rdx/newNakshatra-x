export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

export const rand = (min: number, max: number) =>
  Math.random() * (max - min) + min

export const round1 = (n: number) => Math.round(n * 10) / 10

export const formatIST = (date = new Date()) =>
  new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date) + ' IST'

export const formatNumber = (n: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    Math.round(n)
  )

export const formatDecimal = (n: number, digits = 1) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n)

export const formatPercent = (n: number) => `${Math.round(n)}%`

export const formatTonnes = (n: number) => `${formatNumber(n)} T`
