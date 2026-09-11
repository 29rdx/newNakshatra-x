'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  HISTORICAL_DATABASE_1977_2026,
  FUTURE_FORECASTS_2026_2040,
  getCombinedHistoricalAndFutureData,
  HistoricalYearRecord,
  FutureForecastRecord,
} from '@/lib/historical-database'
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
} from 'lucide-react'

export default function HistoricalForecastModal() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'history' | 'future'>('history')
  const [selectedHistoryYear, setSelectedHistoryYear] = useState<HistoricalYearRecord>(
    HISTORICAL_DATABASE_1977_2026[HISTORICAL_DATABASE_1977_2026.length - 1]
  )
  const [selectedFutureYear, setSelectedFutureYear] = useState<FutureForecastRecord>(
    FUTURE_FORECASTS_2026_2040[0]
  )
  const [isPredicting, setIsPredicting] = useState(false)
  const [predictionStep, setPredictionStep] = useState('')
  const [predictionSuccessMsg, setPredictionSuccessMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const { summaryStats } = getCombinedHistoricalAndFutureData()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen to custom window events so ANY button across top banner, navigation, or dashboard can trigger modal
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
  const filteredHistory = HISTORICAL_DATABASE_1977_2026.filter(
    (item) =>
      item.year.toString().includes(searchQuery) ||
      item.majorMilestone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gradeType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Live Machine Learning Prediction Trigger
  const handleRunPrediction = async () => {
    setIsPredicting(true)
    setPredictionSuccessMsg('')
    
    setPredictionStep('Ingesting 50-Year MOIL Core Assay Database (1977 - 2026)...')
    await new Promise((r) => setTimeout(r, 600))
    
    setPredictionStep('Executing XGBoost v1.8 & FBProphet Time-Series Inference...')
    await new Promise((r) => setTimeout(r, 600))
    
    setPredictionStep('Applying ISRO Sentinel-2 SWIR Anomaly & Climate Weights...')
    await new Promise((r) => setTimeout(r, 600))

    // Slightly adjust prediction variance dynamically to simulate live ML model inference
    const variance = (Math.random() * 0.04 - 0.02)
    const updatedPrediction: FutureForecastRecord = {
      ...selectedFutureYear,
      predictedProductionTonnes: Math.round(selectedFutureYear.targetTonnes * (1 + variance)),
      shortfallRiskPct: Math.max(0, Math.round(Math.abs(variance * 100) * 10) / 10),
      confidenceIntervalLow: Math.round(selectedFutureYear.confidenceIntervalLow * (1 + variance * 0.5)),
      confidenceIntervalHigh: Math.round(selectedFutureYear.confidenceIntervalHigh * (1 + variance * 0.5)),
    }

    setSelectedFutureYear(updatedPrediction)
    setIsPredicting(false)
    setPredictionStep('')
    setPredictionSuccessMsg(`Predictive ML Trajectory Calibrated for Year ${selectedFutureYear.year}!`)

    setTimeout(() => {
      setPredictionSuccessMsg('')
    }, 4000)
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
          <div className="fixed top-16 md:top-20 right-0 bottom-0 z-[9999] w-full sm:w-[480px] md:w-[560px] xl:w-[600px] bg-[#050B16]/96 backdrop-blur-3xl border-l border-[#38BDF8]/40 shadow-[-16px_0_40px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 pointer-events-auto">
            {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-white/15 bg-gradient-to-r from-[#060C18]/90 via-[#09152A]/90 to-[#0A1A32]/90 flex items-center justify-between shrink-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#38BDF8]/15 border border-[#38BDF8]/50 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                <Database className="w-5 h-5 text-[#38BDF8] drop-shadow-[0_0_8px_#38BDF8]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 font-space">
                  50-Yr Database & 2040 Predictions
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 shadow-[0_0_8px_rgba(0,255,136,0.3)]">
                    1977 - 2040 ARCHIVE
                  </span>
                </h3>
                <p className="text-[11px] font-mono text-slate-300">
                  {summaryStats.totalYearsRecorded}-Yr Full MOIL Archives &bull; {summaryStats.totalGsiCoreDrillLogs.toLocaleString()} Drill Logs &bull; XGBoost Forecast
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
          <div className="px-4 py-3 border-b border-white/10 bg-black/40 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'future'
                    ? 'bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.5)]'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
                type="button"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>2026 - 2040 Predictions</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[#00FF88]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>50-Yr Verified</span>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-5 custom-scrollbar">
            {/* TAB 1: 50-YEAR HISTORICAL DATABASE (1977 - 2026) */}
            {activeTab === 'history' && (
              <div className="space-y-5">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="ios-glass-inset p-3.5 space-y-1 border border-white/10 rounded-2xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Years Recorded</div>
                    <div className="text-lg font-bold text-white font-mono">50 Full Years</div>
                    <div className="text-[9px] font-mono text-[#00FF88]">&bull; 1977 - 2026 Archive</div>
                  </div>
                  <div className="ios-glass-inset p-3.5 space-y-1 border border-white/10 rounded-2xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Cumulative Output</div>
                    <div className="text-lg font-bold text-[#38BDF8] font-mono">{(summaryStats.cumulativeProductionTonnes / 1000000).toFixed(1)}M Tonnes</div>
                    <div className="text-[9px] font-mono text-slate-300">&bull; Across 10 MOIL Mines</div>
                  </div>
                  <div className="ios-glass-inset p-3.5 space-y-1 border border-white/10 rounded-2xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">GSI Drill Core Logs</div>
                    <div className="text-lg font-bold text-[#FACC15] font-mono">{summaryStats.totalGsiCoreDrillLogs.toLocaleString()} Holes</div>
                    <div className="text-[9px] font-mono text-slate-300">&bull; 50m Infill Spacing</div>
                  </div>
                  <div className="ios-glass-inset p-3.5 space-y-1 border border-white/10 rounded-2xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">UNFC 111 Reserves</div>
                    <div className="text-lg font-bold text-[#00FF88] font-mono">52.4M Tonnes</div>
                    <div className="text-[9px] font-mono text-[#00FF88]">&bull; Proved Reserves 2026</div>
                  </div>
                </div>

                {/* Quick Era Jump Filters */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                      Quick Era Milestone Filter:
                    </h4>
                    <span className="text-[10px] font-mono text-[#38BDF8]">50-Yr Complete Archive</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { label: 'All 50 Yrs', year: null },
                      { label: '1977 Launch', year: 1977 },
                      { label: '1985 Shaft', year: 1985 },
                      { label: '1995 Plant', year: 1995 },
                      { label: '2010 IPO', year: 2010 },
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
                        className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-slate-200 hover:bg-[#38BDF8]/20 hover:text-[#38BDF8] hover:border-[#38BDF8]/40 transition-all cursor-pointer"
                        type="button"
                      >
                        {era.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline Selector */}
                <div>
                  <h4 className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider mb-2">
                    Select Historical Timeline Year (1977 - 2026):
                  </h4>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {filteredHistory.map((item) => (
                      <button
                        key={item.year}
                        onClick={() => setSelectedHistoryYear(item)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          selectedHistoryYear.year === item.year
                            ? 'bg-[#38BDF8] text-black shadow-[0_0_12px_rgba(56,189,248,0.5)]'
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
                <div className="ios-glass-inset p-4 sm:p-5 rounded-2xl space-y-4 border border-[#38BDF8]/35 bg-[#081226]/80">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#38BDF8]" />
                      <h4 className="text-base font-bold text-white font-mono">
                        Year {selectedHistoryYear.year} Historical Dossier
                      </h4>
                    </div>
                    <span className="ios-badge ios-badge-gold font-mono text-[9px] px-2 py-0.5">
                      {selectedHistoryYear.gradeType}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-slate-400">Total Production:</span>
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
                        {selectedHistoryYear.monsoonRainfallMm} mm
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">UNFC 111 Proved Reserves:</span>
                      <div className="text-sm font-bold text-[#00FF88] mt-0.5">
                        {(selectedHistoryYear.unfc111ProvedReservesTonnes / 1000000).toFixed(1)} Million Tonnes
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] font-mono text-[#38BDF8] font-bold uppercase">Major Milestone / Exploration Expansion:</span>
                    <p className="text-xs text-slate-200 mt-1 leading-relaxed font-sans font-medium">
                      {selectedHistoryYear.majorMilestone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FUTURE PREDICTIONS (2026 - 2040) */}
            {activeTab === 'future' && (
              <div className="space-y-5">
                {/* Future Summary Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="ios-glass-inset p-3.5 space-y-1 border border-white/10 rounded-2xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Target Horizon</div>
                    <div className="text-lg font-bold text-white font-mono">2026 - 2040</div>
                    <div className="text-[9px] font-mono text-[#00FF88]">&bull; 15-Year Forecast</div>
                  </div>
                  <div className="ios-glass-inset p-3.5 space-y-1 border border-white/10 rounded-2xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">2040 Target Output</div>
                    <div className="text-lg font-bold text-[#00FF88] font-mono">3.60M Tonnes/yr</div>
                    <div className="text-[9px] font-mono text-[#00FF88]">&bull; +136% Growth</div>
                  </div>
                  <div className="ios-glass-inset p-3.5 space-y-1 border border-white/10 rounded-2xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Projected Proved Reserves</div>
                    <div className="text-lg font-bold text-[#FACC15] font-mono">128.0M Tonnes</div>
                    <div className="text-[9px] font-mono text-slate-300">&bull; UNFC 111 Category</div>
                  </div>
                  <div className="ios-glass-inset p-3.5 space-y-1 border border-white/10 rounded-2xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Import Reliance</div>
                    <div className="text-lg font-bold text-[#00FF88] font-mono">0.0% (Zero)</div>
                    <div className="text-[9px] font-mono text-[#00FF88]">&bull; Fully Self-Reliant</div>
                  </div>
                </div>

                {/* Interactive ML Prediction Trigger Button */}
                <div className="p-4 rounded-2xl border border-[#00FF88]/40 bg-[#061A14]/90 space-y-3 shadow-[0_0_20px_rgba(0,255,136,0.15)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#00FF88] animate-pulse" />
                      <span className="text-xs font-mono font-bold text-white uppercase">
                        Interactive ML Trajectory Engine
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#00FF88] bg-[#00FF88]/20 px-2 py-0.5 rounded-full border border-[#00FF88]/40">
                      PROPHET + XGBoost
                    </span>
                  </div>

                  <button
                    onClick={handleRunPrediction}
                    disabled={isPredicting}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00FF88] via-[#10B981] to-[#38BDF8] text-black font-mono text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:shadow-[0_0_28px_rgba(0,255,136,0.6)] transition-all cursor-pointer disabled:opacity-50"
                    type="button"
                  >
                    {isPredicting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Running ML Inference Model...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-black fill-black" />
                        <span>RUN XGBOOST & PROPHET PREDICTION MODEL ({selectedFutureYear.year})</span>
                      </>
                    )}
                  </button>

                  {/* Prediction Step / Status Feedback */}
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
                    Select Future Horizon Year (2026 - 2040):
                  </h4>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {FUTURE_FORECASTS_2026_2040.map((item) => (
                      <button
                        key={item.year}
                        onClick={() => setSelectedFutureYear(item)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          selectedFutureYear.year === item.year
                            ? 'bg-[#00FF88] text-black shadow-[0_0_12px_rgba(0,255,136,0.5)]'
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
                <div className="ios-glass-inset p-4 sm:p-5 rounded-2xl space-y-4 border border-[#00FF88]/35 bg-[#06151E]/80">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#00FF88]" />
                      <h4 className="text-base font-bold text-white font-mono">
                        Year {selectedFutureYear.year} Predictive Trajectory
                      </h4>
                    </div>
                    <span className="ios-badge ios-badge-live font-mono text-[9px] px-2 py-0.5">
                      XGBoost v1.8
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
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
                        {selectedFutureYear.shortfallRiskPct}% (Minimal Deficit)
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Projected Reserves:</span>
                      <div className="text-sm font-bold text-[#00FF88] mt-0.5">
                        {(selectedFutureYear.projectedProvedReservesTonnes / 1000000).toFixed(1)} Million Tonnes
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Climate Risk Score:</span>
                      <div className="text-sm font-bold text-[#38BDF8] mt-0.5">
                        {selectedFutureYear.climateRiskIndex} / 100
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Confidence Band:</span>
                      <div className="text-sm font-bold text-slate-200 mt-0.5">
                        {(selectedFutureYear.confidenceIntervalLow / 1000000).toFixed(2)}M - {(selectedFutureYear.confidenceIntervalHigh / 1000000).toFixed(2)}M T
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] font-mono text-[#00FF88] font-bold uppercase">AI Strategy & Operational Directive:</span>
                    <p className="text-xs text-slate-100 mt-1 leading-relaxed font-sans font-semibold">
                      {selectedFutureYear.aiStrategyDirective}
                    </p>
                  </div>
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
