'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { CyberRobotAvatar } from '@/components/auth/CyberRobotAvatar'

interface UserData {
  id: string
  email: string
  full_name: string
  avatar_url?: string
}

export function UserNav() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch('/api/auth/session')
        if (res.ok) {
          const data = await res.json()
          if (data.user) {
            setUser(data.user)
          }
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  if (loading) {
    return (
      <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-slate-800/50 animate-pulse border border-slate-700/50 shrink-0" />
    )
  }

  if (user) {
    const avatarUrl = user.avatar_url
    const name = user.full_name || user.email || 'Operator'

    return (
      <div className="flex items-center shrink-0">
        <Link
          href="/dashboard"
          className="relative h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center transition-all hover:scale-105 shrink-0"
          title={`Mission Control Operator: ${name}`}
        >
          <CyberRobotAvatar size="sm" className="h-9 w-9 md:h-10 md:w-10 border border-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.4)]" />
        </Link>
      </div>
    )


  }

  return (
    <Link
      href="/login"
      className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-[#081022]/90 border border-[#38BDF8]/50 hover:border-[#00FF88] hover:bg-[#00FF88]/15 text-slate-200 hover:text-[#00FF88] flex items-center justify-center transition-all shadow-[0_0_12px_rgba(56,189,248,0.2)] shrink-0"
      title="Sign In to Mission Control"
    >
      <CyberRobotAvatar size="sm" />
    </Link>
  )
}
