'use client'

import dynamic from 'next/dynamic'

// Instant Loading Placeholder — Paints Frame 1 immediately on first millisecond
const VideoLoadingFallback = () => (
  <div className="cinema-viewport">
    <div className="canvas-container relative">
      <img
        src="/frames/frame_0001.jpg"
        alt="NAKSHATRA-X Orbital Reconnaissance"
        className="block w-full h-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs font-mono text-slate-300">
        <span className="h-2 w-2 rounded-full bg-[#00FF88] animate-ping" />
        <span>INITIALIZING ORBITAL SENSORS...</span>
      </div>
    </div>
    <div className="scroll-track" />
  </div>
)

const ScrollVideo = dynamic(() => import('@/components/ScrollVideo'), {
  ssr: false,
  loading: VideoLoadingFallback,
})

const MissionControlDashboard = dynamic(
  () => import('@/components/mission-control/MissionControlDashboard'),
  {
    ssr: false,
    loading: () => (
      <div className="py-24 text-center text-xs font-mono text-slate-500">
        Syncing space intelligence telemetry...
      </div>
    ),
  }
)

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#020408] text-[#E8F0F2]">
      {/* 788-Frame Landing Scroll Video (Unaltered with Instant Load) */}
      <ScrollVideo />

      {/* Under-Video Space Intelligence Command Center */}
      <div className="content-after-video relative z-20 bg-transparent">
        <MissionControlDashboard />
      </div>
    </main>
  )
}
