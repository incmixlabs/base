'use client'

import type * as React from 'react'
import { SegmentedControl } from '@/elements/tabs/SegmentedControl'
import { viewportIcons } from '../viewport-icons'

export type ViewportPreset = 'desktop' | 'tablet' | 'phone'

export function ViewportPreviewControls({
  preset,
  onPresetChange,
}: {
  preset: ViewportPreset
  onPresetChange: (preset: ViewportPreset) => void
}) {
  return (
    <SegmentedControl.Root
      size="sm"
      value={preset}
      icons={viewportIcons}
      onValueChange={value => {
        if (value === 'desktop' || value === 'tablet' || value === 'phone') onPresetChange(value)
      }}
    >
      <SegmentedControl.Item value="desktop">Desktop</SegmentedControl.Item>
      <SegmentedControl.Item value="tablet">Tablet</SegmentedControl.Item>
      <SegmentedControl.Item value="phone">Phone</SegmentedControl.Item>
    </SegmentedControl.Root>
  )
}

export function ViewportPreview({ preset, children }: { preset: ViewportPreset; children: React.ReactNode }) {
  return (
    <div className="p-6">
      <div
        className={[
          'rounded-xl border border-dashed border-border/70 bg-muted/20 p-6 transition-[max-width] duration-200 ease-out',
          preset === 'desktop' ? 'mx-0 max-w-none' : '',
          preset === 'tablet' ? 'mx-auto max-w-[900px]' : '',
          preset === 'phone' ? 'mx-auto max-w-[375px]' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
