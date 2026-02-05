'use client'

import React from 'react'

interface AdminAuthGateProps {
  children: React.ReactNode
  requiredRole?: string
}

export function AdminAuthGate({ children, requiredRole = 'admin' }: AdminAuthGateProps) {
  // For now, just render children - in a real app this would check authentication
  return <>{children}</>
}
