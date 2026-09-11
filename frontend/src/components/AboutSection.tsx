'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { MINES } from '@/app/lib/mines'

export default function AboutSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80])
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -40])
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  )

  const mpMines = MINES.filter((m) => m.state === 'MP')
  const mhMines = MINES.filter((m) => m.state === 'MH')

  return (
    <section ref={sectionRef} className="about-section">
      <div className="about-inner">
        <motion.div className="about-text" style={{ y: y1, opacity }}>
          <span className="section-label">THE VISION</span>
          <h2 className="section-title">
            AI-Driven <span className="highlight">Manganese</span> Intelligence
          </h2>
          <p className="about-body">
            NAKSHATRA-X fuses satellite imagery, geological surveys, and deep
            learning to deliver real-time manganese reserve mapping. Our platform
            transforms raw orbital data into actionable mining intelligence,
            reducing exploration costs by 60%.
          </p>
          <p className="about-body">
            Across {mpMines.length} mines in Madhya Pradesh and {mhMines.length} mines
            in Maharashtra, we monitor ore grades, extraction rates, and
            production targets — giving operators the clarity to make decisions
            with confidence.
          </p>
        </motion.div>

        <motion.div className="about-visual" style={{ y: y2 }}>
          <div className="about-card">
            <div className="about-card-glow" />
            <div className="about-card-content">
              <div className="about-card-number">{MINES.length}</div>
              <div className="about-card-label">Active Mines</div>
              <div className="about-card-sublabel">
                {mpMines.length} in MP &middot; {mhMines.length} in MH
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
