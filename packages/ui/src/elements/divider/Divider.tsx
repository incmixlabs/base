'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import {
  dividerAlignEnd,
  dividerAlignStart,
  dividerBase,
  dividerHorizontal,
  dividerSizeVariants,
  dividerVertical,
  dividerWithContent,
} from './divider.class'
import { type DividerAlign, type DividerOrientation, type DividerSize, dividerPropDefs } from './divider.props'

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
      style,
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

    const colorStyle = React.useMemo(() => {
      if (!safeColor) return undefined
      return {
        '--af-divider-color': `var(--color-${safeColor}-primary)`,
      } as React.CSSProperties
    }, [safeColor])

    return (
      // biome-ignore lint/a11y/useFocusableInteractive: Static separators are not keyboard-interactive widgets.
      <div
        ref={ref}
        // biome-ignore lint/a11y/useAriaPropsForRole: Static separators do not expose range values.
        role="separator"
        aria-orientation={safeOrientation}
        data-orientation={safeOrientation}
        className={cn(
          dividerBase,
          safeOrientation === 'vertical' ? dividerVertical : dividerHorizontal,
          dividerSizeVariants[safeSize],
          hasContent && dividerWithContent,
          safeAlign === 'start' && dividerAlignStart,
          safeAlign === 'end' && dividerAlignEnd,
          className,
        )}
        style={{ ...colorStyle, ...style }}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Divider.displayName = 'Divider'

export { Divider }
