'use client'

import { useEffect, useState } from 'react'
import { FALLBACK_MINES, fetchLiveMineTelemetry, fetchMines } from './data'
import {
  MineInfo,
  WeatherSignal,
  ProductionForecast,
  RiskAnalysis,
  ShapExplanation,
  ActionOrder,
  AuditRecord,
  STACScene,
} from './types'
import IndiaSatelliteMap, { LayerType } from './IndiaSatelliteMap'
import JudgesArchitectureDeck from './JudgesArchitectureDeck'
import RealtimeMLTrainingStudio from './RealtimeMLTrainingStudio'
import ProductionSentinel from './ProductionSentinel'
import RiskCockpit from './RiskCockpit'
import ActionCenter from './ActionCenter'
import SmartOreBlendingModal from './SmartOreBlendingModal'
import MineTwinPanel from '@/components/mine-twin/MineTwinPanel'
import SpaceDustParticles from './SpaceDustParticles'
import AICopilotModal from './AICopilotModal'
import { HyperText } from '@/components/ui/hyper-text'
import {
  Satellite,
  ShieldCheck,
  MapPin,
  RefreshCw,
  Sparkles,
  Orbit,
  Radio,
  Zap,
  Clock,
  Cpu,
  Layers,
  Activity,
  FileCheck,
  Scale,
  Compass,
  Lock,
  History,
} from 'lucide-react'
import Link from 'next/link'


export default function MissionControlDashboard() {
  const [mines, setMines] = useState<MineInfo[]>(FALLBACK_MINES)
  const [selectedMine, setSelectedMine] = useState<MineInfo>(FALLBACK_MINES[0])
  const [activeLayer, setActiveLayer] = useState<LayerType>('satellite')

  const [weather, setWeather] = useState<WeatherSignal | null>(null)
  const [forecast, setForecast] = useState<ProductionForecast | null>(null)
  const [risk, setRisk] = useState<RiskAnalysis | null>(null)
  const [shap, setShap] = useState<ShapExplanation | null>(null)
  const [actions, setActions] = useState<ActionOrder[]>([])
  const [audit, setAudit] = useState<AuditRecord | null>(null)
  const [stacScenes, setStacScenes] = useState<STACScene[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string>('')
  const [countdownSeconds, setCountdownSeconds] = useState(258)
  const [isLiveAutoSync, setIsLiveAutoSync] = useState(true)

  const loadMineData = async (mine: MineInfo, isBackground = false) => {
    if (!isBackground) setIsLoading(true)
    try {
      const data = await fetchLiveMineTelemetry(mine)
      setWeather(data.weather)
      setForecast(data.forecast)
      setRisk(data.risk)
      setShap(data.shap)
      setActions(data.actions)
      setAudit(data.audit)
      setStacScenes(data.stacScenes)
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }))
    } finally {
      if (!isBackground) setIsLoading(false)
    }
  }

  useEffect(() => {
    async function initMines() {
      const dynamicMines = await fetchMines()
      setMines(dynamicMines)
      if (dynamicMines.length > 0) {
        setSelectedMine(dynamicMines[0])
      }
    }
    initMines()
  }, [])

  useEffect(() => {
    if (!selectedMine) return
    loadMineData(selectedMine)
  }, [selectedMine])

  useEffect(() => {
    if (!isLiveAutoSync) return
    const interval = setInterval(() => {
      loadMineData(selectedMine, true)
    }, 4000)
    return () => clearInterval(interval)
  }, [selectedMine, isLiveAutoSync])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev <= 1 ? 300 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
  }

  const mpMines = mines.filter((m) => m.state === 'MP')
  const mhMines = mines.filter((m) => m.state === 'MH')

  return (
    <section id="mission-control" className="relative z-10 bg-transparent text-[#FFFFFF] border-t border-white/10 overflow-hidden">
      {/* Background Cosmic Particle Bokeh Field */}
      <SpaceDustParticles />

      {/* Subtle Background Radial Light Sheen */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col gap-12">
        {/* ============================================================
            HERO COMMAND SECTION (Open Floating Layout with Reddish Cyber Accent)
            ============================================================ */}
        <div className="flex flex-col items-center justify-center text-center py-6 sm:py-10 relative">
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Top Badges with Cyber Accents */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
              <span className="ios-badge ios-badge-live !font-bold">
                <span className="h-2 w-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-ping" />
                LIVE SATELLITE TELEMETRY ACTIVE
              </span>
              <span className="ios-badge !bg-[#38BDF8]/15 !text-[#38BDF8] !border-[#38BDF8]/40 !font-bold">
                SIH 2026 &bull; PROBLEM ID 26009
              </span>
              <span className="ios-badge !bg-[#FF2E63]/15 !text-[#FF2E63] !border-[#FF2E63]/40 !shadow-[0_0_12px_rgba(255,46,99,0.35)] !font-bold">
                <span className="h-2 w-2 rounded-full bg-[#FF2E63] shadow-[0_0_8px_#FF2E63]" />
                ISRO MOSDAC / BHUVAN ACTIVE
              </span>
              <span className="ios-badge !bg-[#00FF88]/15 !text-[#00FF88] !border-[#00FF88]/40 !font-bold">
                <Orbit className="w-3.5 h-3.5 text-[#00FF88] drop-shadow-[0_0_6px_#00FF88]" />
                NEXT SENTINEL-2 PASS: {formatCountdown(countdownSeconds)}
              </span>
            </div>

            {/* Pure Text with Glowing Space Font, Dual Red-Green Liquid Glass -X & Gentle Breathing */}
            <div className="flex items-center justify-center gap-x-1 select-none my-3 bg-transparent">
              <HyperText
                text="NAKSHATRA"
                duration={700}
                className="font-3d-cyber animate-text-breath text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.28em] uppercase font-space"
              />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.28em] text-cyber-liquid-red animate-text-breath ml-1 font-space">
                -X
              </span>
            </div>

            {/* Description - ISRO Powered for India */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed font-normal text-center">
              Autonomous Space-Geological Decision Support Platform for Ministry of Steel & MOIL Ltd. Powered by <span className="text-[#38BDF8] font-bold">ISRO</span> Earth Observation, <span className="text-[#00FF88] font-bold">MOSDAC / Bhuvan</span> geospatial meteorology, and mathematical shortfall mitigation across India.
            </p>

            {/* Floating Telemetry Status Capsule */}
            <div className="mt-6 flex items-center gap-4 px-5 py-2.5 rounded-full bg-[rgba(6,12,24,0.6)] backdrop-blur-2xl border border-white/15 shadow-2xl">
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#38BDF8] uppercase font-bold tracking-wider">
                <Radio className="w-3.5 h-3.5 text-[#FF2E63] animate-pulse drop-shadow-[0_0_8px_#FF2E63]" />
                <span>LIVE STREAM TICK: 4s</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_6px_#00FF88]" />
                10 Active MOIL Sites
              </div>
              <div className="h-4 w-px bg-white/20" />
              <button
                onClick={() => loadMineData(selectedMine)}
                className="p-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-[#FF2E63]/20 border border-white/20 hover:border-[#FF2E63]/50 text-[#38BDF8] hover:text-[#FF2E63] hover:scale-105 transition-all shadow-md cursor-pointer flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase"
                title="Force Immediate Orbital Sync"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>SYNC</span>
              </button>
              <div className="h-4 w-px bg-white/20" />
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-historical-forecast-modal'))}
                className="ios-glass-button px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 cursor-pointer text-[#38BDF8] border border-[#38BDF8]/40 hover:border-[#00FF88] hover:text-[#00FF88] shadow-[0_0_12px_rgba(56,189,248,0.2)] hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] transition-all"
                title="Open 50-Year Historical Database & 2040 Forecast Panel"
                type="button"
              >
                <History className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>50-Yr History & 2040 Predictions</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================
            MINE SITE QUICK SWITCHER DOCK
            ============================================================ */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5 font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#FB923C]" />
            Select Manganese Mining Complex (Madhya Pradesh & Maharashtra):
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {/* MP Group */}
            <div className="ios-segment-bar flex items-center gap-1.5">
              <span className="px-3 text-[10px] font-mono text-[#94A3B8] border-r border-white/15 font-bold">
                MP
              </span>
              {mpMines.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMine(m)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    selectedMine.id === m.id
                      ? 'bg-gradient-to-r from-[#FB923C] to-[#FACC15] text-black font-extrabold shadow-[0_0_18px_rgba(251,146,60,0.6)]'
                      : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-white/10'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* MH Group */}
            <div className="ios-segment-bar flex items-center gap-1.5">
              <span className="px-3 text-[10px] font-mono text-[#94A3B8] border-r border-white/15 font-bold">
                MH
              </span>
              {mhMines.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMine(m)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    selectedMine.id === m.id
                      ? 'bg-gradient-to-r from-[#FB923C] to-[#FACC15] text-black font-extrabold shadow-[0_0_18px_rgba(251,146,60,0.6)]'
                      : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-white/10'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            STAGE 1: 3D REAL SATELLITE INDIAN MAP & CAPITAL CITIES
            ============================================================ */}
        <IndiaSatelliteMap
          selectedMine={selectedMine}
          onSelectMine={(m) => setSelectedMine(m)}
          activeLayer={activeLayer}
          onChangeLayer={(l) => setActiveLayer(l)}
        />

        {/* ============================================================
            EVALUATOR CORNER: MACHINE LEARNING PIPELINE FLOW & REAL-TIME TRAINING STUDIO
            ============================================================ */}
        <div id="judges-corner" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FB923C]" />
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-[#FB923C]">
              EXECUTIVE EVALUATOR &bull; MACHINE LEARNING PIPELINE & REAL-TIME TRAINING STUDIO
            </h3>
          </div>
          <JudgesArchitectureDeck />
          <RealtimeMLTrainingStudio mine={selectedMine} />
        </div>

        {/* ============================================================
            HERO FEATURE: MINE TWIN & WHAT-IF SIMULATOR
            ============================================================ */}
        <div id="mine-twin" className="space-y-4 scroll-mt-24">
          <MineTwinPanel selectedMine={selectedMine} />
        </div>

        {/* ============================================================
            STAGE 1: PRODUCTION SENTINEL & EXTRACTION FORECAST
            ============================================================ */}
        <div id="production-sentinel" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00FF88]" />
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-[#00FF88]">
              STAGE 01 &bull; PRODUCTION SENTINEL &amp; EXTRACTION FORECAST
            </h3>
          </div>

          <div>
            <ProductionSentinel mine={selectedMine} forecast={forecast} risk={risk} weather={weather} />
          </div>
        </div>

        {/* ============================================================
            STAGE 2: SIMPLEX ORE BLENDING & OPERATIONAL RISK COCKPIT (SIDE BY SIDE)
            ============================================================ */}
        <div id="smart-blending" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FACC15]" />
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-[#FACC15]">
              STAGE 02 &bull; ORE BLENDING OPTIMIZER &amp; OPERATIONAL RISK COCKPIT
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="h-full">
              <SmartOreBlendingModal mine={selectedMine} />
            </div>
            <div id="risk-cockpit" className="h-full scroll-mt-24">
              <RiskCockpit mine={selectedMine} weather={weather} risk={risk} />
            </div>
          </div>
        </div>

        {/* ============================================================
            STAGE 4: PRESCRIPTIVE DIRECTIVES
            ============================================================ */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-[#38BDF8]">
              STAGE 04 &bull; PRESCRIPTIVE MITIGATION DIRECTIVES
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <ActionCenter mine={selectedMine} actions={actions} />
          </div>
        </div>

        {/* ============================================================
            EXECUTIVE FOOTER (Light Liquid Glass)
            ============================================================ */}
        <div className="ios-glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00FF88]" />
            <span>
              Decision-Support Prototype &bull; MOIL Limited &bull; Ministry of Steel &bull; Smart India Hackathon 2026
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#00FF88] animate-pulse" />
              Live Stream Sync: <span className="text-[#00FF88] font-bold">{lastSyncTime || 'LIVE'} IST</span>
            </div>
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-[#38BDF8]/15 border border-white/10 hover:border-[#38BDF8]/40 text-[#94A3B8] hover:text-[#38BDF8] text-[11px] transition-all"
            >
              <Lock size={12} className="text-[#38BDF8]" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive AI Sentinel Copilot Launcher */}
      <AICopilotModal mine={selectedMine} />
    </section>
  )
}
