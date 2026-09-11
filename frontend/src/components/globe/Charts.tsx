'use client'

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type ProductionData = {
  name: string
  planned: number
  actual: number
  state: string
  risk: string
}

const PRODUCTION_DATA: ProductionData[] = [
  { name: 'Balaghat', planned: 18000, actual: 16800, state: 'MP', risk: 'ELEVATED' },
  { name: 'Bharweli', planned: 14500, actual: 12200, state: 'MP', risk: 'WATCH' },
  { name: 'Ukwa', planned: 9800, actual: 8900, state: 'MP', risk: 'WATCH' },
  { name: 'Tirodi', planned: 11200, actual: 10100, state: 'MP', risk: 'WATCH' },
  { name: 'Dongri', planned: 12000, actual: 11200, state: 'MH', risk: 'LOW' },
  { name: 'Chikla', planned: 10800, actual: 9800, state: 'MH', risk: 'WATCH' },
  { name: 'Mansar', planned: 12500, actual: 11800, state: 'MH', risk: 'WATCH' },
  { name: 'Kandri', planned: 9300, actual: 8400, state: 'MH', risk: 'LOW' },
  { name: 'Gumgaon', planned: 10200, actual: 9600, state: 'MH', risk: 'WATCH' },
  { name: 'Beldongri', planned: 8600, actual: 7800, state: 'MH', risk: 'LOW' },
]

type RiskTrend = {
  day: string
  score: number
  rainfall: number
}

const RISK_TREND: RiskTrend[] = Array.from({ length: 14 }, (_, i) => ({
  day: `Aug ${15 + i}`,
  score: Math.round(35 + Math.sin(i * 0.7) * 20 + Math.random() * 10),
  rainfall: Math.round(40 + Math.sin(i * 0.5) * 30 + Math.random() * 15),
}))

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[12px] border border-[rgba(186,214,221,0.14)] bg-[rgba(10,16,19,0.92)] px-4 py-3 backdrop-blur-[18px]">
      <div className="mb-1 text-[12px] font-medium text-[#E8F0F2]">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-[11px]">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-[#8FA4B5]">{p.name}:</span>
          <span className="font-medium text-[#E8F0F2]">{p.value.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  )
}

export function ProductionChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={PRODUCTION_DATA} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(186,214,221,0.08)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#8FA4B5' }}
            axisLine={{ stroke: 'rgba(186,214,221,0.12)' }}
            tickLine={false}
            angle={-35}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#8FA4B5' }}
            axisLine={{ stroke: 'rgba(186,214,221,0.12)' }}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="planned" name="Planned" fill="rgba(143,164,181,0.3)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]}>
            {PRODUCTION_DATA.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.risk === 'ELEVATED' ? '#C66A3D' :
                  entry.risk === 'WATCH' ? '#D99A3A' :
                  '#3FAE7A'
                }
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RiskTrendChart() {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={RISK_TREND}>
          <defs>
            <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D9584A" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#D9584A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3FAE7A" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3FAE7A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(186,214,221,0.06)" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 9, fill: '#8FA4B5' }}
            axisLine={{ stroke: 'rgba(186,214,221,0.1)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: '#8FA4B5' }}
            axisLine={{ stroke: 'rgba(186,214,221,0.1)' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            name="Risk Score"
            stroke="#D9584A"
            fill="url(#riskGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="rainfall"
            name="Rainfall (mm)"
            stroke="#3FAE7A"
            fill="url(#rainGrad)"
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DowntimeBar() {
  const data = [
    { name: 'Balaghat', hours: 12, color: '#D99A3A' },
    { name: 'Bharweli', hours: 22, color: '#D9584A' },
    { name: 'Ukwa', hours: 6, color: '#3FAE7A' },
    { name: 'Tirodi', hours: 16, color: '#D99A3A' },
    { name: 'Dongri', hours: 8, color: '#3FAE7A' },
    { name: 'Chikla', hours: 14, color: '#D99A3A' },
    { name: 'Mansar', hours: 28, color: '#D9584A' },
    { name: 'Kandri', hours: 5, color: '#3FAE7A' },
    { name: 'Gumgaon', hours: 15, color: '#D99A3A' },
    { name: 'Beldongri', hours: 3, color: '#3FAE7A' },
  ]

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" barSize={12}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(186,214,221,0.06)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 9, fill: '#8FA4B5' }}
            axisLine={{ stroke: 'rgba(186,214,221,0.1)' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: '#8FA4B5' }}
            axisLine={{ stroke: 'rgba(186,214,221,0.1)' }}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="hours" name="Downtime (hrs)" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
