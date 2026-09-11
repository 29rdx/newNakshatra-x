'use client'

import { useEffect, useRef } from 'react'

export default function SpaceDustParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight)

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }

    window.addEventListener('resize', handleResize)

    // Realistic Astronomical Star Colors: Pure White, Warm Diamond White, Soft Light Yellow
    const REALISTIC_STAR_COLORS = [
      '#FFFFFF', // Pure White
      '#F8FAFC', // Diamond White
      '#FFFDF0', // Warm White
      '#FEF08A', // Light Warm Yellow
      '#FEF9C3', // Soft Light Yellow
      '#FFFBEB', // Subtle Starlight Gold
    ]

    // Create 380 realistic star field points (crisp point stars, no glitter crosses)
    const starCount = 380
    const stars = Array.from({ length: starCount }, (_, i) => {
      const colorIndex = i % 3 === 0 
        ? Math.floor(Math.random() * 3) + 3 // Soft light yellow & warm white
        : Math.floor(Math.random() * 3)     // Pure white & diamond white

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() < 0.88 ? Math.random() * 0.9 + 0.4 : Math.random() * 0.7 + 1.2,
        baseAlpha: Math.random() * 0.5 + 0.35,
        twinkleSpeed: Math.random() * 0.025 + 0.008, // Natural atmospheric scintillation
        twinklePhase: Math.random() * Math.PI * 2,
        color: REALISTIC_STAR_COLORS[colorIndex],
        driftX: (Math.random() - 0.5) * 0.02, // Subtle night-sky drift
        driftY: (Math.random() - 0.5) * 0.02,
      }
    })

    // Rare realistic white/light-yellow meteor streak
    let shootingStar: {
      x: number
      y: number
      length: number
      speed: number
      angle: number
      opacity: number
      active: boolean
    } | null = null

    const triggerShootingStar = () => {
      shootingStar = {
        x: Math.random() * width * 0.85,
        y: Math.random() * height * 0.4,
        length: Math.random() * 75 + 45,
        speed: Math.random() * 6 + 7,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.15,
        opacity: 0.9,
        active: true,
      }
    }

    const meteorInterval = setInterval(() => {
      if (!shootingStar || !shootingStar.active) {
        triggerShootingStar()
      }
    }, 7000)

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      const now = Date.now()

      // Render Realistic Stars (Pure White / Light Yellow crisp dots)
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        s.x += s.driftX
        s.y += s.driftY

        if (s.x < 0) s.x = width
        if (s.x > width) s.x = 0
        if (s.y < 0) s.y = height
        if (s.y > height) s.y = 0

        // Natural smooth atmospheric twinkling
        const shimmer = Math.sin(now * s.twinkleSpeed + s.twinklePhase)
        const alpha = Math.max(0.2, Math.min(0.95, s.baseAlpha + shimmer * 0.35))

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.globalAlpha = alpha
        ctx.fill()
      }

      // Render Clean Shooting Star Streak (White / Light Yellow gradient)
      if (shootingStar && shootingStar.active) {
        const st = shootingStar
        st.x += Math.cos(st.angle) * st.speed
        st.y += Math.sin(st.angle) * st.speed
        st.opacity -= 0.018

        if (st.opacity <= 0 || st.x > width + 100 || st.y > height + 100) {
          st.active = false
        } else {
          ctx.save()
          const grad = ctx.createLinearGradient(
            st.x,
            st.y,
            st.x - Math.cos(st.angle) * st.length,
            st.y - Math.sin(st.angle) * st.length
          )
          grad.addColorStop(0, '#FFFFFF')
          grad.addColorStop(0.35, '#FEF08A')
          grad.addColorStop(1, 'transparent')

          ctx.beginPath()
          ctx.moveTo(st.x, st.y)
          ctx.lineTo(
            st.x - Math.cos(st.angle) * st.length,
            st.y - Math.sin(st.angle) * st.length
          )
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.6
          ctx.globalAlpha = Math.max(0, st.opacity)
          ctx.stroke()
          ctx.restore()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      clearInterval(meteorInterval)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full opacity-100"
    />
  )
}
