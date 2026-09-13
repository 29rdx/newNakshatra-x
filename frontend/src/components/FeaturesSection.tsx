'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { FEATURES_DATA } from '@/data/featuresData'
import { Satellite, Brain, Map, Box, Layers, Activity, History, ShieldCheck, ArrowRight } from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  Satellite,
  Brain,
  Map,
  Box,
  Layers,
  Activity,
  History,
  ShieldCheck,
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
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
    <section ref={sectionRef} className="features-section py-16">
      <motion.div
        className="features-header text-center max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="section-label text-xs font-mono text-[#00FF88] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30">
          ONE-BY-ONE CAPABILITIES EXPLORER
        </span>
        <h2 className="section-title text-3xl sm:text-4xl font-bold font-space text-white mt-4">
          Built for <span className="highlight text-[#00FF88]">Intelligence</span> at Scale
        </h2>
        <p className="section-description text-sm text-slate-300 mt-2 leading-relaxed">
          Select any feature below to open its dedicated one-by-one interactive page and cycle through all 8 system capabilities.
        </p>

        {/* Quick link button to Features Hub */}
        <div className="mt-4">
          <Link
            href="/features"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-[#00FF88] text-white hover:text-black font-mono text-xs font-bold border border-white/15 transition-all shadow-md"
          >
            <span>View All Features Hub</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {FEATURES_DATA.map((feature) => {
          const Icon = ICON_MAP[feature.iconName] || Satellite
          return (
            <motion.div
              key={feature.id}
              className="ios-glass-card group relative p-6 rounded-3xl backdrop-blur-2xl bg-[#081022]/60 border flex flex-col justify-between transition-all duration-300 shadow-xl overflow-hidden"
              style={{ borderColor: `${feature.color}40` }}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: feature.color }}
              />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[10px] font-mono font-black px-2.5 py-1 rounded-full border shadow-sm"
                    style={{
                      backgroundColor: `${feature.color}15`,
                      borderColor: `${feature.color}50`,
                      color: feature.color,
                    }}
                  >
                    FEATURE #{String(feature.number).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                    {feature.badge}
                  </span>
                </div>

                <div
                  className="feature-icon w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border shadow-md"
                  style={{
                    backgroundColor: `${feature.color}15`,
                    borderColor: `${feature.color}40`,
                    color: feature.color,
                  }}
                >
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="feature-title text-lg font-bold font-space text-white group-hover:text-white transition-colors mb-2">
                  {feature.title}
                </h3>
                <p className="feature-description text-xs text-slate-300 line-clamp-3 leading-relaxed mb-6 font-normal">
                  {feature.subtitle}
                </p>
              </div>

              <Link
                href={`/features/${feature.slug}`}
                className="w-full py-3.5 px-4 rounded-2xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all duration-300 cursor-pointer border shadow-lg hover:scale-[1.03] active:scale-[0.98] group/btn overflow-hidden relative"
                style={{
                  background: `linear-gradient(135deg, ${feature.color}35 0%, rgba(6,12,27,0.85) 100%)`,
                  borderColor: `${feature.color}80`,
                  color: '#FFFFFF',
                  boxShadow: `0 0 20px ${feature.color}25`,
                }}
              >
                <span className="font-extrabold tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  OPEN FEATURE #{String(feature.number).padStart(2, '0')} &rarr;
                </span>
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center border shadow-inner group-hover/btn:scale-110 transition-transform"
                  style={{
                    backgroundColor: `${feature.color}30`,
                    borderColor: feature.color,
                    color: feature.color,
                  }}
                >
                  <ArrowRight size={14} className="stroke-[2.5]" />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}

