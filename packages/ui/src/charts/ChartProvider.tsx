'use client'

import { getChartPaletteSignature } from '@incmix/theme'
import * as React from 'react'
import { type ChartPaletteColor, type ChartPaletteMode, getChartProviderStyle } from './chart-colors'
import { ChartPaletteSignatureContext } from './chart-palette-context'

export interface ChartProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: ChartPaletteMode
  color?: ChartPaletteColor
  colors?: ChartPaletteColor[]
}

export const ChartProvider = React.forwardRef<HTMLDivElement, ChartProviderProps>(
  ({ mode = 'spectrum', color = 'primary', colors, className, style, children, ...props }, ref) => {
    const chartStyle = React.useMemo(() => getChartProviderStyle({ mode, color, colors }), [color, colors, mode])
    const paletteSignature = React.useMemo(
      () => getChartPaletteSignature({ mode, color, colors }),
      [color, colors, mode],
    )

    return (
      <ChartPaletteSignatureContext.Provider value={paletteSignature}>
        <div ref={ref} className={className} style={{ ...chartStyle, ...style }} {...props}>
          {children}
        </div>
      </ChartPaletteSignatureContext.Provider>
    )
  },
)

ChartProvider.displayName = 'ChartProvider'
