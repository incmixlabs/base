'use client'

import { domMax, LazyMotion, MotionConfig } from 'motion/react'
import type * as React from 'react'

export interface MotionProviderProps {
  children: React.ReactNode
  reducedMotion?: 'user' | 'always' | 'never'
}

export const MotionProvider: React.FC<MotionProviderProps> = ({ children, reducedMotion = 'user' }) => {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
    </LazyMotion>
  )
}

MotionProvider.displayName = 'MotionProvider'
