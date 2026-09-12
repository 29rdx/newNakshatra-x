'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const AICopilotModal = dynamic(
  () => import('@/components/mission-control/AICopilotModal'),
  { ssr: false }
)

export default function GlobalCopilotWrapper() {
  return <AICopilotModal />
}
