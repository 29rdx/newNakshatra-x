'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { CyberRobotAvatar } from '@/components/auth/CyberRobotAvatar'

interface UserData {
  id: string
  email: string
  full_name: string
  avatar_url?: string
}

export function UserNav() {
  const router = useRouter()
  const pathname = usePathname()
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

  const handleRobotClick = async (e: React.MouseEvent) => {
    e.preventDefault()

    // Check client-side session cookies & user state
    const hasOperatorCookie =
      typeof document !== 'undefined' && document.cookie.includes('nx-operator-session=')
    const hasAdminCookie =
      typeof document !== 'undefined' && document.cookie.includes('admin_session=true')

    if (user || hasOperatorCookie) {
      router.push('/dashboard')
    } else if (hasAdminCookie) {
      router.push('/admin')
    } else {
      // Re-verify with backend session endpoint before fallback
      try {
        const res = await fetch('/api/auth/session')
        if (res.ok) {
          const data = await res.json()
          if (data.user) {
            setUser(data.user)
            router.push('/dashboard')
            return
          }
        }
      } catch {
        // Ignore
      }
      // Route to sign-in / login page if not authenticated
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-slate-800/50 animate-pulse border border-slate-700/50 shrink-0" />
    )
  }

  return (
    <button
      onClick={handleRobotClick}
      className="relative h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shrink-0 cursor-pointer group"
      type="button"
      title={
        user
          ? `Operator: ${user.full_name || user.email} • Click to open Dashboard`
          : '3D Cyber Robot • Click to Sign In / Access Dashboard'
      }
    >
      <CyberRobotAvatar
        size="sm"
        className="h-9 w-9 md:h-10 md:w-10 border-2 border-[#00FF88] shadow-[0_0_16px_rgba(0,255,136,0.5)] group-hover:shadow-[0_0_25px_rgba(0,255,136,0.95)] transition-all"
      />
      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#00FF88] border border-black animate-ping" />
      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#00FF88] border border-black" />
    </button>
  )
}
