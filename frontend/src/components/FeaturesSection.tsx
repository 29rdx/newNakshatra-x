'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Satellite, Brain, Map, Layers, Shield, BarChart3 } from 'lucide-react'

const FEATURES = [
  {
    icon: Satellite,
    title: 'Satellite Intelligence',
    description:
      'Multi-spectral satellite imagery analyzed in real-time for precise manganese ore detection across geological formations.',
  },
  {
    icon: Brain,
    title: 'AI Reserve Estimation',
    description:
      'Deep learning models trained on geological surveys to estimate reserve depth, grade, and extraction feasibility.',
  },
  {
    icon: Map,
    title: '3D Ore Body Mapping',
    description:
      'Subsurface visualization of manganese deposits with precise volumetric calculations and spatial distribution.',
  },
  {
    icon: Layers,
    title: 'Multi-Layer Analysis',
    description:
      'Spectral, thermal, and SAR data fused for comprehensive terrain and mineral composition analysis.',
  },
  {
    icon: BarChart3,
    title: 'Production Planning',
    description:
      'AI-optimized extraction schedules, equipment allocation, and output forecasting for maximum yield.',
  },
  {
    icon: Shield,
    title: 'Compliance & Reporting',
    description:
      'Automated regulatory compliance tracking, environmental impact assessments, and audit-ready documentation.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

export default function FeaturesSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className="features-section">
      <motion.div
        className="features-header"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="section-label">CAPABILITIES</span>
        <h2 className="section-title">
          Built for <span className="highlight">Intelligence</span> at Scale
        </h2>
        <p className="section-description">
          End-to-end satellite intelligence pipeline from orbital data acquisition
          to actionable mining insights.
        </p>
      </motion.div>

      <motion.div
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={i}
              className="feature-card"
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="feature-icon">
                <Icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
