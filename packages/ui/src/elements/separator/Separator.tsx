'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { SemanticColorKey } from '@/theme/props/color.prop'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import {
  separatorAlignEnd,
  separatorAlignStart,
  separatorBase,
  separatorColorVariants,
  separatorDefaultColor,
  separatorHorizontal,
  separatorHorizontalStructural,
  separatorHorizontalWithContent,
  separatorSizeVariants,
  separatorVertical,
  separatorVerticalStructural,
  separatorVerticalWithContent,
  separatorWithContent,
} from './separator.class'
import {
  type SeparatorAlign,
  type SeparatorOrientation,
  type SeparatorSize,
  separatorPropDefs,
} from './separator.props'

export type { SeparatorAlign, SeparatorOrientation, SeparatorSize }

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Horizontal divides stacked content with a horizontal rule.
   * Vertical divides side-by-side content with a vertical rule.
   */
  orientation?: SeparatorOrientation
  /** Rule thickness. The default matches daisyUI's 0.125rem separator line. */
  size?: SeparatorSize
  /** Rule color. Text content keeps the surrounding text color, like daisyUI. */
  color?: SemanticColorKey
  /** Hide one side of the rule around separator content. */
  align?: SeparatorAlign
  /** Hide the separator from assistive technology when it is only decorative. */
  decorative?: boolean
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      orientation = separatorPropDefs.orientation.default,
      size = separatorPropDefs.size.default,
      align = separatorPropDefs.align.default,
      color,
      decorative = false,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const safeOrientation =
      (normalizeEnumPropValue(separatorPropDefs.orientation, orientation) as SeparatorOrientation | undefined) ??
      separatorPropDefs.orientation.default
    const safeSize =
      (normalizeEnumPropValue(separatorPropDefs.size, size) as SeparatorSize | undefined) ??
      separatorPropDefs.size.default
    const safeAlign =
      (normalizeEnumPropValue(separatorPropDefs.align, align) as SeparatorAlign | undefined) ??
      separatorPropDefs.align.default
    const safeColor = normalizeEnumPropValue(separatorPropDefs.color, color) as SemanticColorKey | undefined
    const hasContent = React.Children.count(children) > 0
    const accessibilityProps = decorative
      ? ({ role: 'presentation', 'aria-hidden': true } satisfies React.HTMLAttributes<HTMLDivElement>)
      : ({
          role: 'separator',
          'aria-orientation': safeOrientation,
        } satisfies React.HTMLAttributes<HTMLDivElement>)

    return (
      <div
        ref={ref}
        data-orientation={safeOrientation}
        {...accessibilityProps}
        className={cn(
          separatorBase,
          safeOrientation === 'vertical' ? separatorVertical : separatorHorizontal,
          hasContent
            ? safeOrientation === 'vertical'
              ? separatorVerticalWithContent
              : separatorHorizontalWithContent
            : safeOrientation === 'vertical'
              ? separatorVerticalStructural
              : separatorHorizontalStructural,
          separatorSizeVariants[safeOrientation][safeSize],
          safeColor ? separatorColorVariants[safeColor] : separatorDefaultColor,
          hasContent && separatorWithContent,
          hasContent && safeAlign === 'start' && separatorAlignStart,
          hasContent && safeAlign === 'end' && separatorAlignEnd,
          className,
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Separator.displayName = 'Separator'

export { Separator }
