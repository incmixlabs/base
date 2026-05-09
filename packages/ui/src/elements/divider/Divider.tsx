'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import {
  type DividerAlign,
  type DividerOrientation,
  type DividerSize,
  dividerAlignEnd,
  dividerAlignStart,
  dividerBase,
  dividerColorVariants,
  dividerHorizontal,
  dividerSizeVariants,
  dividerVertical,
  dividerWithContent,
} from './divider.css'
import { dividerPropDefs } from './divider.props'

export type { DividerAlign, DividerOrientation, DividerSize }

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Horizontal divides stacked content with a horizontal rule.
   * Vertical divides side-by-side content with a vertical rule.
   */
  orientation?: DividerOrientation
  /** Rule thickness. The default matches daisyUI's 0.125rem divider line. */
  size?: DividerSize
  /** Rule color. Text content keeps the surrounding text color, like daisyUI. */
  color?: Color
  /** Hide one side of the rule around divider content. */
  align?: DividerAlign
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = dividerPropDefs.orientation.default,
      size = dividerPropDefs.size.default,
      align = dividerPropDefs.align.default,
      color,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const safeOrientation =
      (normalizeEnumPropValue(dividerPropDefs.orientation, orientation) as DividerOrientation | undefined) ??
      dividerPropDefs.orientation.default
    const safeSize =
      (normalizeEnumPropValue(dividerPropDefs.size, size) as DividerSize | undefined) ?? dividerPropDefs.size.default
    const safeAlign =
      (normalizeEnumPropValue(dividerPropDefs.align, align) as DividerAlign | undefined) ??
      dividerPropDefs.align.default
    const safeColor = normalizeEnumPropValue(dividerPropDefs.color, color) as Color | undefined
    const hasContent = React.Children.count(children) > 0

    return (
      <div
        ref={ref}
        data-orientation={safeOrientation}
        className={cn(
          dividerBase,
          safeOrientation === 'vertical' ? dividerVertical : dividerHorizontal,
          dividerSizeVariants[safeSize],
          safeColor && dividerColorVariants[safeColor],
          hasContent && dividerWithContent,
          safeAlign === 'start' && dividerAlignStart,
          safeAlign === 'end' && dividerAlignEnd,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Divider.displayName = 'Divider'

export { Divider }
