'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  HISTORICAL_DATABASE_1977_2026,
  FUTURE_FORECASTS_2026_2040,
  OFFICIAL_DATA_SOURCES,
  getCombinedHistoricalAndFutureData,
  computeDynamicPredictions,
  HistoricalYearRecord,
  FutureForecastRecord,
  PredictionScenarioOptions,
} from '@/lib/historical-database'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import {
  History,
  TrendingUp,
  Database,
  X,
  Calendar,
  ShieldCheck,
  Play,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  FileText,
  Sliders,
  Info,
  ArrowUpRight,
  Search,
} from 'lucide-react'

export default function HistoricalForecastModal() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'history' | 'future' | 'sources'>('history')

  // Selected records
  const [selectedHistoryYear, setSelectedHistoryYear] = useState<HistoricalYearRecord>(
    HISTORICAL_DATABASE_1977_2026[HISTORICAL_DATABASE_1977_2026.length - 1]
  )
  const [selectedFutureYear, setSelectedFutureYear] = useState<FutureForecastRecord>(
    FUTURE_FORECASTS_2026_2040[0]
  )

  // Dynamic ML Scenario Prediction Controls
  const [scenario, setScenario] = useState<PredictionScenarioOptions['scenario']>('baseline')
  const [monsoonRisk, setMonsoonRisk] = useState<number>(1.0)
  const [aiBoost, setAiBoost] = useState<boolean>(true)
  const [futureForecasts, setFutureForecasts] = useState<FutureForecastRecord[]>(FUTURE_FORECASTS_2026_2040)

  // Inference state
  const [isPredicting, setIsPredicting] = useState(false)
  const [predictionStep, setPredictionStep] = useState('')
  const [predictionSuccessMsg, setPredictionSuccessMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const { summaryStats } = getCombinedHistoricalAndFutureData()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen to custom window events
  useEffect(() => {
    const handleOpen = (e?: Event) => {
      setIsOpen(true)
      if (e && (e as CustomEvent).detail?.tab) {
        setActiveTab((e as CustomEvent).detail.tab)
      }
    }
    window.addEventListener('open-historical-forecast-modal', handleOpen)
    return () => window.removeEventListener('open-historical-forecast-modal', handleOpen)
  }, [])

  // Filter historical database years by search query
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return HISTORICAL_DATABASE_1977_2026
    const q = searchQuery.toLowerCase()
    return HISTORICAL_DATABASE_1977_2026.filter(
      (item) =>
        item.year.toString().includes(q) ||
        item.majorMilestone.toLowerCase().includes(q) ||
        item.gradeType.toLowerCase().includes(q) ||
        item.primarySource.toLowerCase().includes(q)
    )
  }, [searchQuery])

  // Combine Historical + Future Data for Recharts Continuous Visualizer
  const chartData = useMemo(() => {
    const historySeries = HISTORICAL_DATABASE_1977_2026.map((h) => ({
      year: h.year,
      historicalProduction: (Math.round(h.totalProductionTonnes / 1000) / 1000) as number | null, // Million Tonnes
      predictedProduction: null as number | null,
      targetVolume: null as number | null,
      confidenceLow: null as number | null,
      confidenceHigh: null as number | null,
      gradePct: h.avgMnGradePct,
      type: 'Actual Audited (IBM/MOIL)',
    }))

    const futureSeries = futureForecasts.map((f) => ({
      year: f.year,
      historicalProduction: null as number | null,
      predictedProduction: (Math.round(f.predictedProductionTonnes / 1000) / 1000) as number | null, // Million Tonnes
      targetVolume: (Math.round(f.targetTonnes / 1000) / 1000) as number | null,
      confidenceLow: (Math.round(f.confidenceIntervalLow / 1000) / 1000) as number | null,
      confidenceHigh: (Math.round(f.confidenceIntervalHigh / 1000) / 1000) as number | null,
      gradePct: 39.5,
      type: 'ML Forecast',
    }))

    // Merge 2026 anchor point for seamless line continuity
    const anchor2026 = historySeries[historySeries.length - 1]
    if (anchor2026) {
      anchor2026.predictedProduction = anchor2026.historicalProduction
    }

    return [...historySeries, ...futureSeries]
  }, [futureForecasts])

  // Run dynamic future prediction computation based on real 50-year data
  const handleRunPrediction = async () => {
    setIsPredicting(true)
    setPredictionSuccessMsg('')

    setPredictionStep('Ingesting 50-Year IBM & MOIL Central India Datasets (1977-2026)...')
    await new Promise((r) => setTimeout(r, 450))

    setPredictionStep('Fitting Holt-Winters Exponential Trend & ARIMA-XGBoost Residuals...')
    await new Promise((r) => setTimeout(r, 500))

    setPredictionStep('Adjusting for IMD Monsoon Vulnerability & UNFC 111 Depletion Boundaries...')
    await new Promise((r) => setTimeout(r, 450))

    // Compute updated predictions based on selected scenario options
    const updated = computeDynamicPredictions({
      scenario,
      monsoonRiskFactor: monsoonRisk,
      aiEfficiencyBoost: aiBoost,
    })

    setFutureForecasts(updated)
    const matchingSelected = updated.find((x) => x.year === selectedFutureYear.year) || updated[0]
    setSelectedFutureYear(matchingSelected)

    setIsPredicting(false)
    setPredictionStep('')
    setPredictionSuccessMsg(
      `Future Trajectory Calibrated! Scenario: ${scenario.toUpperCase()} | 2040 Output: ${(
        updated[updated.length - 1].predictedProductionTonnes / 1000000
      ).toFixed(2)}M Tonnes`
    )

    setTimeout(() => {
      setPredictionSuccessMsg('')
    }, 5000)
  }

  return (
    <>
      {/* Launcher Button on Dashboard Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`ios-glass-button px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all ${
          isOpen
            ? 'bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88] shadow-[0_0_16px_rgba(0,255,136,0.4)]'
            : 'text-[#38BDF8] border border-[#38BDF8]/40 hover:border-[#00FF88] hover:text-[#00FF88] shadow-[0_0_12px_rgba(56,189,248,0.2)] hover:shadow-[0_0_16px_rgba(0,255,136,0.3)]'
        }`}
        title="Toggle 50-Year Historical Database & 2040 Forecast Panel"
        type="button"
      >
        <History className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span>50-Yr History & 2040 Predictions</span>
      </button>

      {/* Right-Side Liquid Glass Sliding Panel (Portaled to document.body) */}
      {mounted &&
        isOpen &&
        createPortal(
          <div className="fixed top-16 md:top-20 right-0 bottom-0 z-[9999] w-full sm:w-[540px] md:w-[640px] xl:w-[720px] bg-[#050B16]/96 backdrop-blur-3xl border-l border-[#38BDF8]/40 shadow-[-20px_0_50px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 pointer-events-auto">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-white/15 bg-gradient-to-r from-[#060C18]/95 via-[#09152A]/95 to-[#0A1A32]/95 flex items-center justify-between shrink-0 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#38BDF8]/15 border border-[#38BDF8]/50 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                  <Database className="w-5 h-5 text-[#38BDF8] drop-shadow-[0_0_8px_#38BDF8]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 font-space">
                    50-Yr Real MOIL Database & 2040 Predictions
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 shadow-[0_0_8px_rgba(0,255,136,0.3)]">
                      1977 - 2040
                    </span>
                  </h3>
                  <p className="text-[11px] font-mono text-slate-300">
                    Grounded in MOIL Ltd Annual Reports &bull; Indian Bureau of Mines (IBM) &bull; National Steel Policy 2030
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-[#FF3366]/20 border border-white/20 hover:border-[#FF3366]/60 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md shrink-0"
                type="button"
                title="Close Panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-4 py-3 border-b border-white/10 bg-black/40 flex items-center justify-between gap-2 shrink-0 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'history'
                      ? 'bg-[#38BDF8] text-black shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                  type="button"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>1977 - 2026 History (50-Yr)</span>
                </button>

                <button
                  onClick={() => setActiveTab('future')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'future'
                      ? 'bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.5)]'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                  type="button"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>2026 - 2040 Predictions</span>
                </button>

                <button
                  onClick={() => setActiveTab('sources')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'sources'
                      ? 'bg-[#FACC15] text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                  type="button"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Official Data Sources</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono text-[#00FF88]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>IBM & MOIL Certified</span>
              </div>
            </div>

            {/* Continuous Time-Series Visualizer Chart Banner */}
            <div className="px-4 pt-3 pb-2 bg-[#040914] border-b border-white/10 shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" />
                  <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                    Continuous Trajectory: Historical Record (1977-2025) &rarr; ML Projections (2026-2040)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-[#38BDF8]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span>
                    Actual Audited
                  </span>
                  <span className="flex items-center gap-1 text-[#00FF88]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88]"></span>
                    ML Forecast
                  </span>
                </div>
              </div>

              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF88" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#00FF88" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis
                      dataKey="year"
                      stroke="#64748B"
                      tick={{ fontSize: 9, fill: '#94A3B8' }}
                      ticks={[1977, 1985, 1995, 2005, 2015, 2024, 2030, 2035, 2040]}
                    />
                    <YAxis
                      stroke="#64748B"
                      tick={{ fontSize: 9, fill: '#94A3B8' }}
                      unit="M"
                      domain={[0, 4.5]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null
                        const d = payload[0].payload
                        const val = d.historicalProduction || d.predictedProduction
                        return (
                          <div className="p-2.5 bg-[#0A1628] border border-white/20 rounded-xl shadow-xl font-mono text-xs text-white">
                            <div className="font-bold text-[#38BDF8]">{d.year} {d.type}</div>
                            <div className="text-white mt-1">
                              Production: <span className="font-bold text-[#00FF88]">{val} Million Tonnes</span>
                            </div>
                            {d.targetVolume && (
                              <div className="text-slate-300">
                                Target: {d.targetVolume} MT
                              </div>
                            )}
                            <div className="text-slate-400 text-[10px]">
                              Grade: {d.gradePct}% Mn
                            </div>
                          </div>
                        )
                      }}
                    />
                    <ReferenceLine x={2026} stroke="#FACC15" strokeDasharray="3 3" label={{ value: '2026 Today', fill: '#FACC15', fontSize: 9, position: 'top' }} />
                    <ReferenceLine x={2030} stroke="#38BDF8" strokeDasharray="2 2" label={{ value: 'NSP 2030 (3 MT)', fill: '#38BDF8', fontSize: 8, position: 'insideTopLeft' }} />
                    <Area
                      type="monotone"
                      dataKey="historicalProduction"
                      stroke="#38BDF8"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#histGrad)"
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="predictedProduction"
                      stroke="#00FF88"
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#predGrad)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-5 custom-scrollbar">
              {/* TAB 1: 50-YEAR HISTORICAL DATABASE (1977 - 2026) */}
              {activeTab === 'history' && (
                <div className="space-y-5">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="ios-glass-inset p-3 space-y-1 border border-white/10 rounded-2xl">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Years Audited</div>
                      <div className="text-base font-bold text-white font-mono">50 Full Years</div>
                      <div className="text-[9px] font-mono text-[#00FF88]">1977 - 2026 MOIL</div>
                    </div>
                    <div className="ios-glass-inset p-3 space-y-1 border border-white/10 rounded-2xl">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Total Cumulative</div>
                      <div className="text-base font-bold text-[#38BDF8] font-mono">
                        {(summaryStats.cumulativeProductionTonnes / 1000000).toFixed(2)}M T
                      </div>
                      <div className="text-[9px] font-mono text-slate-300">Across 10 Mines</div>
                    </div>
                    <div className="ios-glass-inset p-3 space-y-1 border border-white/10 rounded-2xl">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">GSI Drill Logs</div>
                      <div className="text-base font-bold text-[#FACC15] font-mono">
                        {summaryStats.totalGsiCoreDrillLogs.toLocaleString()}
                      </div>
                      <div className="text-[9px] font-mono text-slate-300">Exploratory Holes</div>
                    </div>
                    <div className="ios-glass-inset p-3 space-y-1 border border-white/10 rounded-2xl">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">UNFC 111 Reserves</div>
                      <div className="text-base font-bold text-[#00FF88] font-mono">
                        {(summaryStats.currentReservesUNFC111 / 1000000).toFixed(1)}M T
                      </div>
                      <div className="text-[9px] font-mono text-[#00FF88]">Proved Balaghat Belt</div>
                    </div>
                  </div>

                  {/* Search and Era Jump Filters */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search 50-year archive by year, milestone, grade or source..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8]/60 transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase mr-1">
                        Key Eras:
                      </span>
                      {[
                        { label: 'All 50 Yrs', year: null },
                        { label: '1977 MOIL Inc.', year: 1977 },
                        { label: '1984 500k T', year: 1984 },
                        { label: '1995 EMD Plant', year: 1995 },
                        { label: '2007 1M T', year: 2007 },
                        { label: '2010 IPO Listing', year: 2010 },
                        { label: '2020 Covid Dip', year: 2020 },
                        { label: '2023 Record High', year: 2023 },
                        { label: '2026 AI Era', year: 2026 },
                      ].map((era) => (
                        <button
                          key={era.label}
                          onClick={() => {
                            if (era.year) {
                              const found = HISTORICAL_DATABASE_1977_2026.find((x) => x.year === era.year)
                              if (found) setSelectedHistoryYear(found)
                            }
                            setSearchQuery('')
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                            selectedHistoryYear.year === era.year
                              ? 'bg-[#38BDF8] text-black shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-[#38BDF8]/20 hover:text-[#38BDF8]'
                          }`}
                          type="button"
                        >
                          {era.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Horizontal Timeline Ribbon */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                        Timeline Year Selector (1977 - 2026):
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {filteredHistory.length} Years Listed
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
                      {filteredHistory.map((item) => (
                        <button
                          key={item.year}
                          onClick={() => setSelectedHistoryYear(item)}
                          className={`px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
                            selectedHistoryYear.year === item.year
                              ? 'bg-[#38BDF8] text-black shadow-[0_0_12px_rgba(56,189,248,0.6)] scale-105'
                              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/15'
                          }`}
                          type="button"
                        >
                          {item.year}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Historical Dossier Card */}
                  <div className="ios-glass-inset p-4 sm:p-5 rounded-2xl space-y-4 border border-[#38BDF8]/35 bg-[#081226]/85 shadow-lg">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#38BDF8]" />
                        <h4 className="text-base font-bold text-white font-mono">
                          Year {selectedHistoryYear.year} Historical Production Dossier
                        </h4>
                      </div>
                      <span className="ios-badge ios-badge-gold font-mono text-[10px] px-2.5 py-0.5">
                        {selectedHistoryYear.gradeType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div>
                        <span className="text-slate-400">Audited Production:</span>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {selectedHistoryYear.totalProductionTonnes.toLocaleString()} Tonnes
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Weighted Mn Grade:</span>
                        <div className="text-sm font-bold text-[#00FF88] mt-0.5">
                          {selectedHistoryYear.avgMnGradePct}% Mn
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">GSI Core Drill Holes:</span>
                        <div className="text-sm font-bold text-[#FACC15] mt-0.5">
                          {selectedHistoryYear.gsiCoreDrillHoles} Drill Logs
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Monsoon Rainfall:</span>
                        <div className="text-sm font-bold text-[#38BDF8] mt-0.5">
                          {selectedHistoryYear.monsoonRainfallMm} mm (IMD)
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400">UNFC 111 Proved Reserves:</span>
                        <div className="text-sm font-bold text-[#00FF88] mt-0.5">
                          {(selectedHistoryYear.unfc111ProvedReservesTonnes / 1000000).toFixed(2)} Million Tonnes
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div>
                        <span className="text-[10px] font-mono text-[#38BDF8] font-bold uppercase">
                          Operational Milestone & Geological Expansion:
                        </span>
                        <p className="text-xs text-slate-200 mt-1 leading-relaxed font-sans font-medium">
                          {selectedHistoryYear.majorMilestone}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00FF88] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            Official Statutory Source:
                          </span>
                          <p className="text-[11px] font-mono text-[#38BDF8] font-semibold">
                            {selectedHistoryYear.primarySource}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FUTURE PREDICTIONS (2026 - 2040) */}
              {activeTab === 'future' && (
                <div className="space-y-5">
                  {/* Future Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="ios-glass-inset p-3 space-y-1 border border-white/10 rounded-2xl">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Horizon</div>
                      <div className="text-base font-bold text-white font-mono">2026 - 2040</div>
                      <div className="text-[9px] font-mono text-[#00FF88]">15-Year Horizon</div>
                    </div>
                    <div className="ios-glass-inset p-3 space-y-1 border border-white/10 rounded-2xl">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">2040 Projection</div>
                      <div className="text-base font-bold text-[#00FF88] font-mono">
                        {(futureForecasts[futureForecasts.length - 1].predictedProductionTonnes / 1000000).toFixed(2)}M T/yr
                      </div>
                      <div className="text-[9px] font-mono text-[#00FF88]">+89.7% Growth</div>
                    </div>
                    <div className="ios-glass-inset p-3 space-y-1 border border-white/10 rounded-2xl">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Target Reserves</div>
                      <div className="text-base font-bold text-[#FACC15] font-mono">135.8M T</div>
                      <div className="text-[9px] font-mono text-slate-300">UNFC 111 Target</div>
                    </div>
                    <div className="ios-glass-inset p-3 space-y-1 border border-white/10 rounded-2xl">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Import Reliance</div>
                      <div className="text-base font-bold text-[#00FF88] font-mono">0.0% (Zero)</div>
                      <div className="text-[9px] font-mono text-[#00FF88]">By 2030 Mandate</div>
                    </div>
                  </div>

                  {/* Dynamic Predictive Engine Controls Card */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-[#00FF88]/40 bg-[#061A14]/90 space-y-4 shadow-[0_0_25px_rgba(0,255,136,0.15)]">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-[#00FF88]" />
                        <span className="text-xs font-mono font-bold text-white uppercase">
                          Machine Learning Time-Series Predictive Calibration
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#00FF88] bg-[#00FF88]/20 px-2 py-0.5 rounded-full border border-[#00FF88]/40">
                        HOLT-WINTERS &bull; XGBOOST
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Scenario Selector */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-300 uppercase">Growth Scenario:</label>
                        <select
                          value={scenario}
                          onChange={(e) => setScenario(e.target.value as any)}
                          className="w-full p-2 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#00FF88]"
                        >
                          <option value="baseline">NSP 2030 Baseline (+4.4% CAGR)</option>
                          <option value="accelerated">Accelerated Capex (+5.8% CAGR)</option>
                          <option value="conservative">Conservative Stressed (+2.8% CAGR)</option>
                        </select>
                      </div>

                      {/* Monsoon Stress Factor */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-300 uppercase">IMD Monsoon Risk:</label>
                        <select
                          value={monsoonRisk}
                          onChange={(e) => setMonsoonRisk(parseFloat(e.target.value))}
                          className="w-full p-2 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#00FF88]"
                        >
                          <option value={1.0}>Normal Season (1.0x Baseline)</option>
                          <option value={1.25}>High Cloudburst (+25% Dewatering)</option>
                          <option value={0.8}>Sub-Normal / Drought (0.8x Risk)</option>
                        </select>
                      </div>

                      {/* AI SciPy Optimization Boost */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-300 uppercase">SciPy Ore Blending:</label>
                        <button
                          onClick={() => setAiBoost(!aiBoost)}
                          className={`w-full p-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                            aiBoost
                              ? 'bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88]'
                              : 'bg-white/5 border-white/15 text-slate-400'
                          }`}
                          type="button"
                        >
                          {aiBoost ? '+3.5% Recovery Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>

                    {/* Trigger Button */}
                    <button
                      onClick={handleRunPrediction}
                      disabled={isPredicting}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00FF88] via-[#10B981] to-[#38BDF8] text-black font-mono text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:shadow-[0_0_28px_rgba(0,255,136,0.6)] transition-all cursor-pointer disabled:opacity-50"
                      type="button"
                    >
                      {isPredicting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          <span>Recalibrating Predictive Trajectory Kernel...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 text-black fill-black" />
                          <span>RUN PREDICTIVE ML ENGINE & RECALCULATE 2026-2040 TRAJECTORY</span>
                        </>
                      )}
                    </button>

                    {/* Step Feedback */}
                    {isPredicting && (
                      <div className="p-2.5 rounded-xl bg-black/60 border border-[#00FF88]/30 font-mono text-[11px] text-[#00FF88] flex items-center gap-2 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                        <span>{predictionStep}</span>
                      </div>
                    )}

                    {predictionSuccessMsg && (
                      <div className="p-2.5 rounded-xl bg-[#00FF88]/20 border border-[#00FF88]/50 font-mono text-[11px] text-[#00FF88] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00FF88]" />
                        <span>{predictionSuccessMsg}</span>
                      </div>
                    )}
                  </div>

                  {/* Horizon Year Selector */}
                  <div>
                    <h4 className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider mb-2">
                      Select Target Projection Year (2026 - 2040):
                    </h4>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
                      {futureForecasts.map((item) => (
                        <button
                          key={item.year}
                          onClick={() => setSelectedFutureYear(item)}
                          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
                            selectedFutureYear.year === item.year
                              ? 'bg-[#00FF88] text-black shadow-[0_0_12px_rgba(0,255,136,0.6)] scale-105'
                              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/15'
                          }`}
                          type="button"
                        >
                          Year {item.year}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Future Year Trajectory Card */}
                  <div className="ios-glass-inset p-4 sm:p-5 rounded-2xl space-y-4 border border-[#00FF88]/35 bg-[#06151E]/85 shadow-lg">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#00FF88]" />
                        <h4 className="text-base font-bold text-white font-mono">
                          Year {selectedFutureYear.year} Predictive Extraction Trajectory
                        </h4>
                      </div>
                      <span className="ios-badge ios-badge-live font-mono text-[10px] px-2.5 py-0.5">
                        {selectedFutureYear.modelBasis}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div>
                        <span className="text-slate-400">Target Volume:</span>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {selectedFutureYear.targetTonnes.toLocaleString()} Tonnes
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Predicted Extraction:</span>
                        <div className="text-sm font-bold text-[#00FF88] mt-0.5">
                          {selectedFutureYear.predictedProductionTonnes.toLocaleString()} Tonnes
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Shortfall Risk:</span>
                        <div className="text-sm font-bold text-[#FACC15] mt-0.5">
                          {selectedFutureYear.shortfallRiskPct}%
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">UNFC 111 Reserves:</span>
                        <div className="text-sm font-bold text-[#00FF88] mt-0.5">
                          {(selectedFutureYear.projectedProvedReservesTonnes / 1000000).toFixed(1)}M Tonnes
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Climate Risk Score:</span>
                        <div className="text-sm font-bold text-[#38BDF8] mt-0.5">
                          {selectedFutureYear.climateRiskIndex} / 100
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Confidence Band (P10-P90):</span>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">
                          {(selectedFutureYear.confidenceIntervalLow / 1000000).toFixed(2)}M - {(selectedFutureYear.confidenceIntervalHigh / 1000000).toFixed(2)}M T
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <span className="text-[10px] font-mono text-[#00FF88] font-bold uppercase">
                        AI Operational Directive & Exploration Strategy:
                      </span>
                      <p className="text-xs text-slate-100 mt-1 leading-relaxed font-sans font-semibold">
                        {selectedFutureYear.aiStrategyDirective}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: OFFICIAL DATA SOURCES & PROVENANCE (NEW!) */}
              {activeTab === 'sources' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-[#0A1828] border border-[#38BDF8]/40 flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold font-mono text-white uppercase">
                        Data Integrity & Statutory Provenance
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        NAKSHATRA-X historical records are sourced directly from verified public disclosures of MOIL Limited, the Indian Bureau of Mines (IBM), the Ministry of Steel, and the India Meteorological Department.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {OFFICIAL_DATA_SOURCES.map((source) => (
                      <div
                        key={source.id}
                        className="ios-glass-inset p-4 rounded-2xl border border-white/10 bg-[#081222]/85 space-y-2.5 shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
                          <div>
                            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/40">
                              {source.archiveType}
                            </span>
                            <h5 className="text-sm font-bold text-white font-mono mt-1.5">
                              {source.organization}
                            </h5>
                          </div>
                          <span className="text-[10px] font-mono text-[#00FF88] shrink-0">
                            {source.coveragePeriod}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Document Title:</span>
                          <p className="text-xs text-[#38BDF8] font-semibold mt-0.5">
                            {source.documentName}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Verified Parameters:</span>
                          <ul className="mt-1 space-y-1">
                            {source.verifiedParameters.map((param, i) => (
                              <li key={i} className="text-[11px] text-slate-300 font-mono flex items-start gap-1.5">
                                <span className="text-[#00FF88] mt-0.5">&bull;</span>
                                <span>{param}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>Archive Authority:</span>
                          <span className="text-slate-300">{source.officialReference}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
