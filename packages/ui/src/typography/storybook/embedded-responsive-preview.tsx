import type { ReactNode } from 'react'
import * as React from 'react'
import { Tabs } from '@/elements/tabs/Tabs'
import { Box } from '@/layouts'
import { typographyBreakpoints } from '@/theme/tokens'
import {
  embeddedResponsiveShell,
  storyTypographyActiveBreakpointVar,
  storyTypographyFormFactorVar,
} from './embedded-responsive-preview.css'

export const embeddedPreviewWidths = {
  wide: 1040,
  medium: 720,
  narrow: 360,
} as const

export type EmbeddedPreviewWidthKey = keyof typeof embeddedPreviewWidths

export const embeddedResponsiveScaleCopy = `Expected scale below container \`sm\` (${typographyBreakpoints.sm}), at \`sm\`, and at \`md\` (${typographyBreakpoints.md}) based on local width.`

export function EmbeddedResponsiveTabs({
  renderContent,
}: {
  renderContent: (args: { widthKey: EmbeddedPreviewWidthKey; width: number }) => ReactNode
}) {
  return (
    <Tabs.Root defaultValue="wide">
      <Tabs.List>
        <Tabs.Trigger value="wide">Wide</Tabs.Trigger>
        <Tabs.Trigger value="medium">Medium</Tabs.Trigger>
        <Tabs.Trigger value="narrow">Narrow</Tabs.Trigger>
      </Tabs.List>

      {Object.entries(embeddedPreviewWidths).map(([widthKey, width]) => (
        <Tabs.Content key={widthKey} value={widthKey}>
          {renderContent({ widthKey: widthKey as EmbeddedPreviewWidthKey, width })}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

export const EmbeddedResponsiveShell = React.forwardRef<HTMLDivElement, { width: number; children: React.ReactNode }>(
  ({ width, children }, ref) => {
    return (
      <Box
        ref={ref}
        className={embeddedResponsiveShell}
        style={{
          width,
          border: '1px solid var(--color-border)',
          borderRadius: '0.75rem',
          padding: '1rem',
        }}
      >
        {children}
      </Box>
    )
  },
)

EmbeddedResponsiveShell.displayName = 'EmbeddedResponsiveShell'

export function useEmbeddedTypographyPreviewVars(width: number) {
  const shellRef = React.useRef<HTMLDivElement | null>(null)
  const [state, setState] = React.useState({ formFactor: '', activeBreakpoint: '' })

  React.useLayoutEffect(() => {
    let cancelled = false

    const measure = () => {
      const node = shellRef.current
      if (!node || cancelled || width <= 0) return
      const computed = window.getComputedStyle(node)
      setState({
        formFactor: computed.getPropertyValue(storyTypographyFormFactorVar).trim(),
        activeBreakpoint: computed.getPropertyValue(storyTypographyActiveBreakpointVar).trim(),
      })
    }

    measure()
    document.fonts.ready.then(measure)

    return () => {
      cancelled = true
    }
  }, [width])

  return { shellRef, ...state }
}

export function EmbeddedTypographyState({
  formFactor,
  activeBreakpoint,
}: {
  formFactor: string
  activeBreakpoint: string
}) {
  return (
    <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
      form factor: {formFactor || '...'} | active breakpoint: {activeBreakpoint || '...'}
    </div>
  )
}
