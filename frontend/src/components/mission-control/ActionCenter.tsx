'use client'

import { useState } from 'react'
import { MineInfo, ActionOrder } from './types'
import { CheckCircle, Clock, Zap, ArrowRight, ShieldCheck, RefreshCw, Send, Check } from 'lucide-react'

interface Props {
  mine: MineInfo
  actions?: ActionOrder[]
}

export default function ActionCenter({ mine, actions: initialActions }: Props) {
  const defaultActions: ActionOrder[] = [
    {
      id: `act-1`,
      title: 'Prioritize Pit-Bottom Dewatering & Haul Road Resurfacing',
      type: 'DRAINAGE',
      priority: 'CRITICAL',
      reason: '14-day rainfall of 118mm exceeds drainage saturation threshold.',
      impact: 'Recovers ~450 T/day haulage capacity by reducing cycle slippage.',
      status: 'PENDING_APPROVAL',
      estimated_recovery_tonnes: 450,
    },
    {
      id: `act-2`,
      title: 'Redeploy Auxiliary Front-End Loader to High-Grade Face #3',
      type: 'EQUIPMENT',
      priority: 'HIGH',
      reason: 'Primary excavator #2 undergoing scheduled hydraulic valve service.',
      impact: 'Restores +350 T/day extraction throughput to prevent blending deficit.',
      status: 'PENDING_APPROVAL',
      estimated_recovery_tonnes: 350,
    },
    {
      id: `act-3`,
      title: 'Advance Electronic Detonator Sequence for Bench Block C',
      type: 'BLASTING',
      priority: 'MEDIUM',
      reason: 'Pre-split drill pattern completed. Awaiting safety shotfirer clearance.',
      impact: 'Unlocks 1,400 T high-grade manganese ore body for immediate mucking.',
      status: 'PENDING_APPROVAL',
      estimated_recovery_tonnes: 1400,
    },
  ]

  const [actions, setActions] = useState<ActionOrder[]>(initialActions && initialActions.length > 0 ? initialActions : defaultActions)
  const [dispatchedIds, setDispatchedIds] = useState<Record<string, boolean>>({})

  const toggleDispatch = (id: string) => {
    setDispatchedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const totalRecovery = actions.reduce((sum, a) => sum + (a.estimated_recovery_tonnes || 0), 0)

  return (
    <div className="ios-glass-card p-6 flex flex-col justify-between gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="ios-badge ios-badge-gold">
              AI/ML MODULE 04
            </span>
            <span className="text-xs font-mono text-[#8FA4B5]">Optimization & Prescriptive Solver</span>
          </div>
          <span className="ios-badge ios-badge-live">
            <Zap className="w-3 h-3" />
            Auto-Generated
          </span>
        </div>

        <h3 className="text-2xl font-bold text-[#E8F0F2] tracking-tight">
          Prescriptive Action Center
        </h3>
        <p className="text-xs text-[#8FA4B5] mt-1 leading-relaxed">
          Targeted operational interventions prioritized by recoverable tonnage and shortfall impact at {mine.name}.
        </p>
      </div>

      {/* Recoverable Tonnage Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00FF88]/15 via-[#E5C76B]/10 to-transparent border border-[#00FF88]/30 backdrop-blur-xl flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase text-[#8FA4B5] tracking-wider">
            Total Recoverable Capacity
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#00FF88]">
            +{totalRecovery.toLocaleString('en-IN')} <span className="text-sm font-normal text-[#E8F0F2]">T / 14-Day Cycle</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono font-bold text-[#E5C76B]">
            {Object.keys(dispatchedIds).filter((k) => dispatchedIds[k]).length} of {actions.length} Executed
          </div>
          <div className="text-[10px] font-mono text-[#8FA4B5]">
            Reduces shortfall by {Math.min(92, Object.keys(dispatchedIds).filter((k) => dispatchedIds[k]).length * 32)}%
          </div>
        </div>
      </div>

      {/* Action Orders List */}
      <div className="space-y-3">
        {actions.map((act) => {
          const isDispatched = dispatchedIds[act.id]
          const priorityBadgeClass =
            act.priority === 'CRITICAL'
              ? 'ios-badge-risk'
              : act.priority === 'HIGH'
              ? 'ios-badge-copper'
              : 'ios-badge-gold'

          return (
            <div
              key={act.id}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                isDispatched
                  ? 'bg-[#00FF88]/10 border-[#00FF88]/40 shadow-[0_0_20px_rgba(0,255,136,0.15)]'
                  : 'bg-[rgba(6,10,14,0.7)] border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`ios-badge ${priorityBadgeClass}`}>
                    {act.priority}
                  </span>
                  <span className="text-[10px] font-mono text-[#8FA4B5] uppercase">
                    [{act.type}]
                  </span>
                </div>

                <div className="text-xs font-mono font-bold text-[#00FF88]">
                  +{act.estimated_recovery_tonnes} Tonnes Protected
                </div>
              </div>

              <h4 className="text-sm font-semibold text-[#E8F0F2] mb-1">{act.title}</h4>
              <p className="text-xs text-[#8FA4B5] leading-relaxed mb-2">{act.reason}</p>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-[#C66A3D] font-mono mb-3">
                &bull; Impact: {act.impact}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono text-[#8FA4B5]">
                  Status: {isDispatched ? 'DISPATCHED TO PIT SUPERVISOR' : 'AWAITING APPROVAL'}
                </span>

                <button
                  onClick={() => toggleDispatch(act.id)}
                  className={`ios-glass-button px-4 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
                    isDispatched
                      ? 'bg-[#00FF88]/25 text-[#00FF88] border-[#00FF88]/60 shadow-[0_0_15px_rgba(0,255,136,0.4)]'
                      : 'text-[#E8F0F2]'
                  }`}
                >
                  {isDispatched ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00FF88]" />
                      <span>Dispatched</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#C66A3D]" />
                      <span>Approve & Dispatch</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
