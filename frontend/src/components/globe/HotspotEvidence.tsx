'use client'

import { useState, useEffect } from 'react'

type Evidence = {
  id: string
  mineName: string
  category: string
  confidence: number
  ndvi: number
  ndviTrend: number[]
  soilMoisture: number
  soilTrend: number[]
  landTemp: number
  rainfall14d: number
  cloudCover: number
  source: string
  sceneId: string
  lastObservation: string
  dataQuality: 'high' | 'medium' | 'low'
  spectralAnomaly: number
  landDisturbance: number
  geologicalSupport: number
  drillSupport: number
}

const EVIDENCE_DB: Record<string, Evidence> = {
  balaghat: {
    id: 'balaghat', mineName: 'Balaghat', category: 'Priority Validation', confidence: 87,
    ndvi: 0.72, ndviTrend: [0.68, 0.70, 0.71, 0.72, 0.69, 0.73, 0.72],
    soilMoisture: 42, soilTrend: [38, 40, 41, 42, 39, 43, 42],
    landTemp: 34.2, rainfall14d: 118, cloudCover: 8,
    source: 'Sentinel-2 L2A', sceneId: 'S2A_MSIL2A_20260828T050611_N0511_R004_T43QDH_20260828T071533',
    lastObservation: '2026-08-28T14:30:00+05:30', dataQuality: 'high',
    spectralAnomaly: 0.82, landDisturbance: 0.71, geologicalSupport: 0.89, drillSupport: 0.91,
  },
  bharweli: {
    id: 'bharweli', mineName: 'Bharweli', category: 'Investigate', confidence: 74,
    ndvi: 0.68, ndviTrend: [0.65, 0.66, 0.67, 0.68, 0.66, 0.69, 0.68],
    soilMoisture: 38, soilTrend: [35, 36, 37, 38, 36, 39, 38],
    landTemp: 33.8, rainfall14d: 95, cloudCover: 12,
    source: 'Landsat-8 OLI', sceneId: 'LC08_L2SP_144046_20260827_20260828_02_T1',
    lastObservation: '2026-08-28T14:30:00+05:30', dataQuality: 'high',
    spectralAnomaly: 0.64, landDisturbance: 0.58, geologicalSupport: 0.76, drillSupport: 0.72,
  },
}

function getQualityColor(q: string) {
  if (q === 'high') return '#3FAE7A'
  if (q === 'medium') return '#D99A3A'
  return '#D9584A'
}

function MiniSpark({ values, color = '#E5C76B' }: { values: number[]; color?: string }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const w = 120
  const h = 24
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-6 w-full">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function EvidenceRow({ label, value, unit, color }: { label: string; value: string; unit?: string; color?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[rgba(186,214,221,0.06)] py-2 last:border-b-0">
      <span className="text-[11px] text-[#8FA4B5]">{label}</span>
      <span className="text-[12px] font-medium" style={{ color: color || '#E8F0F2' }}>
        {value}{unit && <span className="ml-1 text-[10px] text-[#8FA4B5]">{unit}</span>}
      </span>
    </div>
  )
}

export default function HotspotEvidence({ mineId }: { mineId: string }) {
  const [evidence, setEvidence] = useState<Evidence | null>(null)

  useEffect(() => {
    const e = EVIDENCE_DB[mineId] || EVIDENCE_DB.balaghat
    setEvidence({ ...e, id: mineId, mineName: mineId.charAt(0).toUpperCase() + mineId.slice(1).replace('-', ' ') })
  }, [mineId])

  if (!evidence) return null

  return (
    <div className="liquid-panel-strong p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8FA4B5]">
            HOTSPOT EVIDENCE
          </div>
          <div className="mt-1 text-[16px] font-semibold text-[#E8F0F2]">{evidence.mineName}</div>
        </div>
        <span className="rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.1em]" style={{
          backgroundColor: evidence.category === 'Priority Validation' ? 'rgba(229,199,107,0.12)' : 'rgba(217,154,58,0.12)',
          color: evidence.category === 'Priority Validation' ? '#E5C76B' : '#D99A3A',
          border: `1px solid ${evidence.category === 'Priority Validation' ? 'rgba(229,199,107,0.25)' : 'rgba(217,154,58,0.25)'}`,
        }}>
          {evidence.category}
        </span>
      </div>

      {/* Confidence Breakdown */}
      <div className="mb-4 rounded-[14px] border border-[rgba(186,214,221,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
        <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8FA4B5]">
          Confidence Score: {evidence.confidence}%
        </div>
        <div className="space-y-1.5">
          {[
            { label: 'Geological Support', value: evidence.geologicalSupport, weight: '30%' },
            { label: 'Drill Support', value: evidence.drillSupport, weight: '35%' },
            { label: 'Spectral Anomaly', value: evidence.spectralAnomaly, weight: '20%' },
            { label: 'Land Disturbance', value: evidence.landDisturbance, weight: '5%' },
          ].map(item => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#8FA4B5]">{item.label} <span className="text-[#6F7B86]">({item.weight})</span></span>
                <span className="text-[#E8F0F2]">{(item.value * 100).toFixed(0)}%</span>
              </div>
              <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.04)]">
                <div className="h-full rounded-full" style={{ width: `${item.value * 100}%`, backgroundColor: '#E5C76B' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spectral Indicators */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-[12px] border border-[rgba(186,214,221,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
          <div className="text-[9px] uppercase tracking-[0.12em] text-[#8FA4B5]">NDVI</div>
          <div className="mt-1 text-[16px] font-semibold text-[#3FAE7A]">{evidence.ndvi}</div>
          <MiniSpark values={evidence.ndviTrend} color="#3FAE7A" />
        </div>
        <div className="rounded-[12px] border border-[rgba(186,214,221,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
          <div className="text-[9px] uppercase tracking-[0.12em] text-[#8FA4B5]">Soil Moisture</div>
          <div className="mt-1 text-[16px] font-semibold text-[#3FAE7A]">{evidence.soilMoisture}%</div>
          <MiniSpark values={evidence.soilTrend} color="#3FAE7A" />
        </div>
      </div>

      {/* Evidence Details */}
      <div className="rounded-[14px] border border-[rgba(186,214,221,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
        <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8FA4B5]">
          Observation Details
        </div>
        <EvidenceRow label="Source" value={evidence.source} />
        <EvidenceRow label="Scene ID" value={evidence.sceneId} />
        <EvidenceRow label="Cloud Cover" value={`${evidence.cloudCover}%`} color={evidence.cloudCover > 20 ? '#D99A3A' : '#3FAE7A'} />
        <EvidenceRow label="Data Quality" value={evidence.dataQuality.toUpperCase()} color={getQualityColor(evidence.dataQuality)} />
        <EvidenceRow label="Last Valid Observation" value={new Date(evidence.lastObservation).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} />
        <EvidenceRow label="Rainfall 14d" value={`${evidence.rainfall14d}`} unit="mm" />
        <EvidenceRow label="Land Temp" value={`${evidence.landTemp}`} unit="°C" />
      </div>

      <div className="mt-3 rounded-[10px] border border-[rgba(186,214,221,0.06)] bg-[rgba(255,255,255,0.01)] p-2">
        <div className="text-[9px] text-[#6F7B86]">
          Satellite indicators identify surface conditions. Reserve estimates require drilling validation by MOIL geologists.
        </div>
      </div>
    </div>
  )
}
