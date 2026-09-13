'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Radio, Orbit, ChevronDown, Sparkles } from 'lucide-react'
import { TextEffect } from '@/components/ui/text-effect'

const TOTAL_FRAMES = 788

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starCanvasRef = useRef<HTMLCanvasElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>(new Array(TOTAL_FRAMES))
  const loadedFlagsRef = useRef<Uint8Array>(new Uint8Array(TOTAL_FRAMES))
  const targetProgressRef = useRef(0)
  const currentProgressRef = useRef(0)
  const lastDrawnFrameRef = useRef(-1)

  function getFramePath(index: number) {
    const frameNumber = String(index + 1).padStart(4, '0')
    return `/frames/frame_${frameNumber}.jpg`
  }

  // Preload priority frame
  const loadFrame = useCallback((index: number) => {
    if (index < 0 || index >= TOTAL_FRAMES) return
    if (imagesRef.current[index]) return

    const img = new Image()
    img.src = getFramePath(index)
    imagesRef.current[index] = img
    img.onload = () => {
      loadedFlagsRef.current[index] = 1
    }
  }, [])

  // Smart frame window preloader around playback head
  const preloadAround = useCallback((centerIndex: number, windowSize = 30) => {
    const start = Math.max(0, centerIndex - 5)
    const end = Math.min(TOTAL_FRAMES - 1, centerIndex + windowSize)
    for (let i = start; i <= end; i++) {
      loadFrame(i)
    }
  }, [loadFrame])

  useEffect(() => {
    const canvas = canvasRef.current
    const starCanvas = starCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    const starCtx = starCanvas?.getContext('2d')
    if (!ctx) return

    const cvs: HTMLCanvasElement = canvas
    const context: CanvasRenderingContext2D = ctx

    // 48 Realistic 3D Parallax Stars over Video
    const starPalette = ['#FFFFFF', '#F8FAFC', '#FFFDF0', '#FEF08A', '#FEF9C3']
    const videoStars = Array.from({ length: 48 }, (_, i) => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      z: Math.random() * 3 + 1,
      radius: Math.random() * 1.6 + 0.8,
      isSparkle: i % 4 === 0,
      baseAlpha: Math.random() * 0.35 + 0.2,
      speedX: (Math.random() - 0.5) * 0.18,
      speedY: (Math.random() - 0.5) * 0.12,
      twinkleSpeed: Math.random() * 0.04 + 0.015,
      sparkleSize: Math.random() * 5 + 4,
      glitterPhase: Math.random() * Math.PI * 2,
      color: starPalette[Math.floor(Math.random() * starPalette.length)],
    }))

    function drawFrame(index: number) {
      const images = imagesRef.current
      const loadedFlags = loadedFlagsRef.current
      let img = images[index]

      // Fallback to nearest loaded frame if current not ready
      if (!img || !loadedFlags[index]) {
        for (let offset = 1; offset < 40; offset++) {
          if (index - offset >= 0 && loadedFlags[index - offset]) {
            img = images[index - offset]
            break
          }
          if (index + offset < TOTAL_FRAMES && loadedFlags[index + offset]) {
            img = images[index + offset]
            break
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return

      const imgAspect = img.naturalWidth / img.naturalHeight
      const canvasAspect = cvs.width / cvs.height

      let renderWidth = cvs.width
      let renderHeight = cvs.height
      let offsetX = 0
      let offsetY = 0

      if (imgAspect > canvasAspect) {
        renderWidth = cvs.height * imgAspect
        offsetX = (cvs.width - renderWidth) / 2
      } else {
        renderHeight = cvs.width / imgAspect
        offsetY = (cvs.height - renderHeight) / 2
      }

      context.drawImage(img, offsetX, offsetY, renderWidth, renderHeight)
      lastDrawnFrameRef.current = index
    }

    function drawSparkle(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      alpha: number,
      color: string
    ) {
      ctx.save()
      ctx.translate(x, y)
      ctx.fillStyle = color
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 1.5))
      ctx.shadowColor = color
      ctx.shadowBlur = 12

      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.quadraticCurveTo(0, 0, size, 0)
      ctx.quadraticCurveTo(0, 0, 0, size)
      ctx.quadraticCurveTo(0, 0, -size, 0)
      ctx.quadraticCurveTo(0, 0, 0, -size)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()
      ctx.restore()
    }

    // Instant paint frame 0
    loadFrame(0)
    const initialImg = imagesRef.current[0]
    if (initialImg && initialImg.complete) {
      drawFrame(0)
    } else if (initialImg) {
      initialImg.onload = () => drawFrame(0)
    }

    // Preload first 30 frames
    const preloadTimer = setTimeout(() => {
      for (let i = 1; i < 30; i++) {
        loadFrame(i)
      }
    }, 40)

    function onScroll() {
      const track = trackRef.current
      if (!track) return

      const scrollY = window.scrollY
      const trackHeight = track.offsetHeight
      const windowHeight = window.innerHeight
      const maxScroll = trackHeight - windowHeight

      if (maxScroll <= 0) return

      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1)
      targetProgressRef.current = progress

      if (viewportRef.current) {
        if (progress >= 0.999) {
          viewportRef.current.style.opacity = '0'
          viewportRef.current.style.pointerEvents = 'none'
        } else {
          viewportRef.current.style.opacity = '1'
          viewportRef.current.style.pointerEvents = 'auto'
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()

    let rafId: number

    function render() {
      // Smooth progress lerp
      const delta = targetProgressRef.current - currentProgressRef.current
      if (Math.abs(delta) > 0.00005) {
        currentProgressRef.current += delta * 0.14
      } else {
        currentProgressRef.current = targetProgressRef.current
      }

      const frameIndex = Math.min(
        Math.max(Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)), 0),
        TOTAL_FRAMES - 1
      )

      if (frameIndex !== lastDrawnFrameRef.current) {
        drawFrame(frameIndex)
        preloadAround(frameIndex, 30) // Smartly fetch upcoming frames
      }

      // 3D Glittery Star Animation
      if (starCtx && starCanvas) {
        starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height)
        const now = Date.now()

        videoStars.forEach((s) => {
          s.x += s.speedX / s.z
          s.y += s.speedY / s.z
          if (s.x < 0) s.x = 1920
          if (s.x > 1920) s.x = 0
          if (s.y < 0) s.y = 1080
          if (s.y > 1080) s.y = 0

          const shimmer = Math.sin(now * s.twinkleSpeed + s.glitterPhase)
          const alpha = s.baseAlpha + shimmer * 0.22

          if (s.isSparkle && shimmer > 0.2) {
            const currentSize = (s.sparkleSize / s.z) * (0.8 + shimmer * 0.4)
            drawSparkle(starCtx, s.x, s.y, currentSize, alpha, s.color)
          } else {
            starCtx.save()
            starCtx.beginPath()
            starCtx.arc(s.x, s.y, (s.radius / s.z) * (0.85 + shimmer * 0.25), 0, Math.PI * 2)
            starCtx.fillStyle = s.color
            starCtx.globalAlpha = Math.max(0.08, Math.min(0.65, alpha))
            starCtx.shadowColor = s.color
            starCtx.shadowBlur = 8
            starCtx.fill()
            starCtx.restore()
          }
        })
      }

      rafId = requestAnimationFrame(render)
    }

    rafId = requestAnimationFrame(render)

    return () => {
      clearTimeout(preloadTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [loadFrame, preloadAround])

  return (
    <>
      <div ref={viewportRef} className="cinema-viewport transition-opacity duration-300">
        <div className="canvas-container relative">
          {/* Instant zero-delay background poster image */}
          <img
            src="/frames/frame_0001.jpg"
            alt="Orbital Reconnaissance"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            fetchPriority="high"
          />
          <canvas ref={canvasRef} width={1920} height={1080} className="relative z-10 block w-full h-full object-cover" />
          {/* 3D Glittery Star Overlay Layer */}
          <canvas
            ref={starCanvasRef}
            width={1920}
            height={1080}
            className="absolute inset-0 pointer-events-none w-full h-full object-cover opacity-85 z-15"
          />

          {/* ============================================================
              100% TRANSPARENT HIGH-CONTRAST DUAL-COLOR OVERLAY OVER TRAIN VIDEO
              ============================================================ */}
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-none select-none">
            <div className="relative w-full max-w-5xl text-center bg-transparent pointer-events-none transition-all py-4 px-4">
              {/* Top Telemetry Pills & Badges with Dark Glass Backdrop for Maximum Contrast */}
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5 mb-6 pointer-events-none">
                <span className="ios-badge ios-badge-live !font-bold !bg-[#060C1B]/80 !backdrop-blur-md !border-[#00FF88]/50 !shadow-[0_0_12px_rgba(0,255,136,0.3)]">
                  <span className="h-2 w-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-ping" />
                  <span className="text-[#00FF88]">LIVE SATELLITE TELEMETRY ACTIVE</span>
                </span>
                <span className="ios-badge !bg-[#060C1B]/80 !backdrop-blur-md !text-[#FFB800] !border-[#FFB800]/50 !font-bold !shadow-[0_0_12px_rgba(255,184,0,0.25)]">
                  SIH 2026 &bull; PROBLEM ID 26009
                </span>
                <span className="ios-badge !bg-[#060C1B]/80 !backdrop-blur-md !text-[#FF2E63] !border-[#FF2E63]/50 !font-bold !shadow-[0_0_14px_rgba(255,46,99,0.35)]">
                  <span className="h-2 w-2 rounded-full bg-[#FF2E63] shadow-[0_0_8px_#FF2E63]" />
                  ISRO MOSDAC / BHUVAN ACTIVE
                </span>
              </div>

              {/* Centerpiece Title - Single Line NAKSHATRA-X (Yellowish Amber Gold NAKSHATRA & Dual Bloody & Light Transparent Red -X) */}
              <div className="relative z-10 flex items-center justify-center whitespace-nowrap flex-nowrap select-none my-3 pointer-events-none">
                <span className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.18em] sm:tracking-[0.24em] uppercase bg-gradient-to-r from-[#FFFFFF] via-[#FFE082] to-[#FFB800] bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.98)] drop-shadow-[0_0_24px_rgba(255,184,0,0.65)]">
                  NAKSHATRA
                </span>
                <span className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.18em] sm:tracking-[0.24em] bg-gradient-to-r from-[#8B0000] via-[#E60026] to-[rgba(255,102,128,0.85)] bg-clip-text text-transparent ml-0.5 sm:ml-1 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_0_22px_rgba(230,0,38,0.9)] drop-shadow-[0_0_38px_rgba(139,0,0,0.8)]">
                  -X
                </span>
              </div>

              {/* Subtitle Narrative - High Contrast Crisp Text */}
              <p className="relative z-10 text-xs sm:text-sm md:text-base text-white max-w-2xl mx-auto mt-4 leading-relaxed font-semibold text-center pointer-events-none drop-shadow-[0_2px_14px_rgba(0,0,0,0.98)]">
                Autonomous Space-Geological Decision Support Platform for Ministry of Steel &amp; MOIL Ltd. Powered by <span className="text-[#FFB800] font-extrabold drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]">ISRO</span> Earth Observation, <span className="text-[#00FF88] font-extrabold drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]">MOSDAC / Bhuvan</span> geospatial telemetry, and AI reserve mapping.
              </p>

              {/* Live Telemetry Capsule Bar - Dark Translucent Pill for Contrast */}
              <div className="relative z-10 mt-6 inline-flex flex-wrap items-center justify-center gap-4 px-6 py-2.5 rounded-full bg-[#060C1B]/85 backdrop-blur-md border border-[#FFB800]/40 shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-none">
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#38BDF8] uppercase font-bold tracking-wider">
                  <Radio className="w-3.5 h-3.5 text-[#FF2E63] animate-pulse drop-shadow-[0_0_8px_#FF2E63]" />
                  <span>LIVE TELEMETRY STREAM</span>
                </div>
                <div className="h-4 w-px bg-white/20 hidden sm:block" />
                <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_6px_#00FF88]" />
                  10 Active MOIL Mining Sites
                </div>
                <div className="h-4 w-px bg-white/20 hidden sm:block" />
                <div className="font-mono text-xs font-bold text-[#FFB800] flex items-center gap-1.5">
                  <Orbit className="w-3.5 h-3.5 text-[#FFB800]" />
                  Sentinel-2 Multispectral
                </div>
              </div>

              {/* Scroll Down Prompt Indicator */}
              <div className="relative z-10 mt-8 flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.22em] text-[#FFB800] flex items-center gap-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.98)]">
                  <span>SCROLL DOWN TO RECONNAISSANCE MAP</span>
                </span>
                <ChevronDown className="w-4 h-4 text-[#FFB800] animate-bounce drop-shadow-[0_0_10px_#FFB800]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={trackRef} className="scroll-track" />
    </>
  )
}

