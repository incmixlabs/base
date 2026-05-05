'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { liveCodeBlockFallbackRoot } from './LiveCodeBlock.css'

export type LiveCodeBlockExtraTab = {
  value: string
  label: React.ReactNode
  content: React.ReactNode
}

export type LiveCodeBlockProps = {
  initialCode: string
  scope?: Record<string, unknown>
  scopeLoader?: (code: string) => Promise<Record<string, unknown>>
  previewProps?: Record<string, unknown>
  previewAppearance?: 'light' | 'dark'
  previewToolbarActions?: React.ReactNode
  showPreview?: boolean
  extraTabs?: LiveCodeBlockExtraTab[]
  className?: string
  onCodeChange?: (code: string) => void
}

const LiveCodeBlockImpl = React.lazy(() => import('./LiveCodeBlockImpl'))

export function LiveCodeBlock({
  initialCode,
  scope = {},
  scopeLoader,
  previewProps,
  previewAppearance,
  previewToolbarActions,
  showPreview = true,
  extraTabs,
  className,
  onCodeChange,
}: LiveCodeBlockProps) {
  return (
    <React.Suspense
      fallback={
        <div className={cn(liveCodeBlockFallbackRoot, className)}>
          <pre className="overflow-x-auto p-4 text-sm">
            <code>{initialCode}</code>
          </pre>
        </div>
      }
    >
      <LiveCodeBlockImpl
        initialCode={initialCode}
        scope={scope}
        scopeLoader={scopeLoader}
        previewProps={previewProps}
        previewAppearance={previewAppearance}
        previewToolbarActions={previewToolbarActions}
        showPreview={showPreview}
        extraTabs={extraTabs}
        className={className}
        onCodeChange={onCodeChange}
      />
    </React.Suspense>
  )
}
