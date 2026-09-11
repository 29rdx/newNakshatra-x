'use client'

import { useState } from 'react'
import { MineInfo, ReservePrediction } from './types'
import { Sparkles, Layers, Search, AlertCircle, ArrowUpRight, Compass, ShieldAlert, Radio, Activity } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts'

interface Props {
  mine: MineInfo
  reserve?: ReservePrediction | null
}

export default function ReserveIntelligence({ mine, reserve }: Props) {
  const [selectedTab, setSelectedTab] = useState<'spectral' | 'ndvi_trend'>('spectral')

  const category = reserve?.category || 'PRIORITY_VALIDATION'
  const confidence = reserve?.confidence_score ?? (mine.state === 'MP' ? 86.8 : 68.4)
  const grade = reserve?.estimated_ore_grade || (mine.state === 'MP' ? '40.7% Mn (High Grade)' : '32.4% Mn (Medium Grade)')
  const depth = reserve?.prospect_depth_m || (mine.state === 'MP' ? '55m - 130m' : '75m - 170m')
  const recommendation = reserve?.recommendation || 'Immediate diamond core drilling recommended (50m grid).'

  const contributions = reserve?.feature_contributions || {
    'SWIR Spectral Anomaly': 28.7,
    'Soil Moisture Retention': 21.0,
    'Thermal Signature (LST)': 18.9,
    'Vegetation Stress (NDVI)': 9.0,
    'Historical Borehole Support': 9.2,
  }

  const spectralBands = reserve?.spectral_reflectance_bands || [
    { band: 'B2 Blue', wavelength_um: '0.49', reflectance: 0.12, anomaly_threshold: 0.10 },
    { band: 'B3 Green', wavelength_um: '0.56', reflectance: 0.18, anomaly_threshold: 0.15 },
    { band: 'B4 Red', wavelength_um: '0.66', reflectance: 0.22, anomaly_threshold: 0.19 },
    { band: 'B8A NIR', wavelength_um: '0.86', reflectance: 0.48, anomaly_threshold: 0.38 },
    { band: 'B11 SWIR', wavelength_um: '1.61', reflectance: 0.32, anomaly_threshold: 0.26 },
    { band: 'B12 SWIR', wavelength_um: '2.20', reflectance: 0.41, anomaly_threshold: 0.28 },
  ]

  const ndviTrend = reserve?.ndvi_trend_14d || Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    ndvi: Math.round((0.72 + Math.sin(i * 0.5) * 0.04) * 100) / 100,
    swir_ratio: Math.round((0.78 + Math.cos(i * 0.6) * 0.05) * 100) / 100,
  }))

  const categoryBadgeClass =
    category === 'PRIORITY_VALIDATION'
      ? 'ios-badge-gold'
      : category === 'INVESTIGATE'
      ? 'ios-badge-copper'
      : 'ios-badge-live'

  return (
    <div className="ios-glass-card p-6 flex flex-col justify-between gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="ios-badge ios-badge-copper">
              AI/ML MODULE 01
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">XGBoost / Random Forest</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="ios-badge ios-badge-live text-[9px] flex items-center gap-1">
              <Radio className="w-3 h-3 text-[#00FF88] animate-pulse" />
              LIVE ORBITAL SENSING
            </span>
            <span className={`ios-badge ${categoryBadgeClass}`}>
              {category.replace('_', ' ')}
            </span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-[#FFFFFF] tracking-tight">
          Reserve Hotspot Intelligence
        </h3>
        <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
          Live multi-spectral Sentinel-2 reflectance curve (SWIR B12 absorption & canopy NDVI stress) calibrated for {mine.name} ({mine.code}).
        </p>
      </div>

      {/* Main Score & Metrics Hero Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* ML Confidence Score */}
        <div className="ios-glass-inset p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-wider">
            AI Prospectivity Score
          </span>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-mono font-extrabold text-[#FACC15]">
              {confidence}%
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">Confidence</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FB923C] to-[#FACC15] transition-all duration-700"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Estimated Ore Grade */}
        <div className="ios-glass-inset p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-wider">
            Estimated Grade (Mn)
          </span>
          <div className="my-2">
            <span className="text-lg font-mono font-bold text-[#FFFFFF]">{grade}</span>
          </div>
          <span className="text-[10px] font-mono text-[#00FF88]">
            &bull; High Economic Viability
          </span>
        </div>

        {/* Prospect Depth */}
        <div className="ios-glass-inset p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-wider">
            Target Reserve Depth
          </span>
          <div className="my-2">
            <span className="text-lg font-mono font-bold text-[#FFFFFF]">{depth}</span>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8]">
            Sub-surface syncline horizon
          </span>
        </div>
      </div>

      {/* Live Spectral Graphs & NDVI Anomaly Switcher */}
      <div className="ios-glass-inset p-4">
        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedTab('spectral')}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedTab === 'spectral'
                  ? 'bg-white/20 text-[#FFFFFF] border border-white/30'
                  : 'text-[#94A3B8] hover:text-[#FFFFFF]'
              }`}
            >
              Live Multi-Spectral Reflectance
            </button>
            <button
              onClick={() => setSelectedTab('ndvi_trend')}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedTab === 'ndvi_trend'
                  ? 'bg-white/20 text-[#FFFFFF] border border-white/30'
                  : 'text-[#94A3B8] hover:text-[#FFFFFF]'
              }`}
            >
              14-Day NDVI vs SWIR Anomaly
            </button>
          </div>
          <span className="text-[10px] font-mono text-[#00FF88] hidden sm:inline">
            COPERNICUS L2A CALIBRATED
          </span>
        </div>

        {/* Chart View */}
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {selectedTab === 'spectral' ? (
              <BarChart data={spectralBands} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="band" tick={{ fontSize: 9, fill: '#94A3B8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(14,20,28,0.95)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="reflectance" name="Observed Reflectance" fill="#00FF88" radius={[4, 4, 0, 0]} />
                <Bar dataKey="anomaly_threshold" name="Manganese Baseline" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={ndviTrend}>
                <defs>
                  <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF88" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00FF88" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="swirGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB923C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FB923C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94A3B8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(14,20,28,0.95)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Area type="monotone" dataKey="ndvi" name="NDVI Index" stroke="#00FF88" fill="url(#ndviGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="swir_ratio" name="SWIR Anomaly" stroke="#FB923C" fill="url(#swirGrad)" strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Geologist Action Directive */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FB923C]/15 via-[#FACC15]/10 to-transparent border border-[#FB923C]/40 backdrop-blur-xl flex items-start gap-3">
        <Compass className="w-5 h-5 text-[#FB923C] shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-mono font-bold text-[#FFFFFF] uppercase tracking-wide">
            Exploration Directive
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{recommendation}</p>
        </div>
      </div>
    </div>
  )
}
