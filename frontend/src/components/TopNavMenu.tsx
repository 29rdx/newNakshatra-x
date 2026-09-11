'use client'

import React, { useState, useEffect } from 'react'
import {
  Satellite,
  Cpu,
  Brain,
  Activity,
  Layers,
  ShieldAlert,
  FileCheck,
  Menu,
  X,
  Box,
  History,
} from 'lucide-react'
import { HyperText } from '@/components/ui/hyper-text'

export interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  targetId: string
  badge?: string
  isModalTrigger?: boolean
}

// Strict Step-by-Step Top-to-Bottom Sequential Navigation Flow
const NAV_ITEMS: NavItem[] = [
  {
    id: 'surveillance',
    label: 'Orbital Feed',
    icon: Satellite,
    targetId: 'mission-control',
    badge: 'LIVE',
  },
  {
    id: 'evaluator',
    label: 'ML Architecture',
    icon: Cpu,
    targetId: 'judges-corner',
  },
  {
    id: 'minetwin',
    label: 'Mine Twin',
    icon: Box,
    targetId: 'mine-twin',
    badge: 'TWIN',
  },
  {
    id: 'reserve',
    label: 'Reserve AI',
    icon: Brain,
    targetId: 'reserve-intelligence',
  },
  {
    id: 'production',
    label: 'Production',
    icon: Activity,
    targetId: 'production-sentinel',
  },
  {
    id: 'blending',
    label: 'Ore Blending',
    icon: Layers,
    targetId: 'smart-blending',
  },
  {
    id: 'risk',
    label: 'Risk Cockpit',
    icon: ShieldAlert,
    targetId: 'risk-cockpit',
  },
  {
    id: 'compliance',
    label: 'Audit & ESG',
    icon: FileCheck,
    targetId: 'compliance-reports',
  },
]

export default function TopNavMenu() {
  const [activeTab, setActiveTab] = useState('surveillance')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Real-time Scroll Spy: Step-by-Step active button glow as user scrolls through feature sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const fullHeight = document.documentElement.scrollHeight

      // Edge case: Top video / landing hero area
      if (scrollPosition < 300) {
        setActiveTab('surveillance')
        return
      }

      // Edge case: Reached bottom of page
      if (windowHeight + scrollPosition >= fullHeight - 100) {
        setActiveTab('compliance')
        return
      }

      // Reading checkpoint is 35% down the viewport
      const triggerPoint = scrollPosition + windowHeight * 0.35

      let currentActiveId = 'surveillance'

      for (const item of NAV_ITEMS) {
        if (item.isModalTrigger) continue
        const el = document.getElementById(item.targetId)
        if (el) {
          const elementTop = el.getBoundingClientRect().top + scrollPosition
          if (elementTop <= triggerPoint) {
            currentActiveId = item.id
          }
        }
      }

      setActiveTab(currentActiveId)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (item: NavItem) => {
    setActiveTab(item.id)
    setMobileMenuOpen(false)
    if (item.isModalTrigger) {
      const element = document.getElementById('mission-control') || document.querySelector('.content-after-video')
      if (element && window.scrollY < 600) {
        const yOffset = -100
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
      window.dispatchEvent(new CustomEvent('open-historical-forecast-modal'))
      return
    }
    const element = document.getElementById(item.targetId)
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }


  return (
    <>
      {/* Desktop / Tablet Clean Liquid Glass Navigation Capsule */}
      <nav className="hidden lg:flex items-center gap-1 cyber-nav-pill px-2.5 py-1 shadow-xl max-w-full overflow-x-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`cyber-nav-item ${isActive ? 'active' : ''} group shrink-0`}
              type="button"
            >
              <Icon
                size={13.5}
                className={`transition-colors duration-200 shrink-0 ${
                  isActive
                    ? 'text-[#00FF88] drop-shadow-[0_0_8px_#00FF88]'
                    : 'text-[#38BDF8] group-hover:text-white'
                }`}
              />
              <HyperText
                text={item.label}
                duration={500}
                animateOnLoad={false}
                className={`font-space text-[11px] xl:text-[11.5px] font-bold tracking-[0.06em] uppercase transition-colors duration-200 whitespace-nowrap ${
                  isActive ? 'text-[#00FF88]' : 'text-slate-200 group-hover:text-white'
                }`}
              />
              {item.badge && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-mono font-bold bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 shadow-[0_0_8px_rgba(0,255,136,0.3)] leading-none">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Mobile Hamburger Trigger */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden p-2.5 rounded-xl bg-[#081022]/90 border border-[#38BDF8]/40 text-[#38BDF8] hover:text-[#00FF88] shadow-lg transition-colors"
        aria-label="Toggle Menu"
        type="button"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[64px] md:top-[80px] left-0 right-0 p-4 bg-[#050914]/98 backdrop-blur-3xl border-b border-[#38BDF8]/30 shadow-2xl z-50 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#38BDF8]/20 border-[#38BDF8]/60 text-white shadow-[0_0_16px_rgba(56,189,248,0.3)]'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={16}
                    className={isActive ? 'text-[#00FF88]' : 'text-[#38BDF8]'}
                  />
                  <HyperText
                    text={item.label}
                    duration={500}
                    animateOnLoad={false}
                    className="font-space text-xs font-bold tracking-wider uppercase text-white"
                  />
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#00FF88]/25 text-[#00FF88] border border-[#00FF88]/50 shadow-[0_0_8px_#00FF88]">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
