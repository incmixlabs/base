'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { getPaddingProps } from '@/theme/helpers/get-padding-styles'
import type { MarginProps } from '@/theme/props/margin.props'

// Side configurations
type Side = 'all' | 'x' | 'y' | 'top' | 'right' | 'bottom' | 'left'
type Clip = 'border-box' | 'padding-box'

// Padding configurations
type Padding = 'current' | '0'

function resolveInsetPaddingValue(value: Padding | undefined): string | undefined {
  if (value == null) return undefined
  return value === 'current' ? 'var(--inset-padding, 0px)' : '0px'
}

function getBleedStyles(side: Side, insetBleed: string, insetRadius: string): React.CSSProperties {
  const negativeInsetBleed = `calc(0px - ${insetBleed})`
  const zeroRadius = '0px'

  const stylesBySide: Record<Side, React.CSSProperties> = {
    all: {
      marginTop: negativeInsetBleed,
      marginRight: negativeInsetBleed,
      marginBottom: negativeInsetBleed,
      marginLeft: negativeInsetBleed,
      borderRadius: insetRadius,
    },
    x: {
      marginRight: negativeInsetBleed,
      marginLeft: negativeInsetBleed,
      borderRadius: zeroRadius,
    },
    y: {
      marginTop: negativeInsetBleed,
      marginBottom: negativeInsetBleed,
      borderRadius: zeroRadius,
    },
    top: {
      marginTop: negativeInsetBleed,
      marginRight: negativeInsetBleed,
      marginLeft: negativeInsetBleed,
      borderTopLeftRadius: insetRadius,
      borderTopRightRadius: insetRadius,
      borderBottomLeftRadius: zeroRadius,
      borderBottomRightRadius: zeroRadius,
    },
    right: {
      marginTop: negativeInsetBleed,
      marginRight: negativeInsetBleed,
      marginBottom: negativeInsetBleed,
      borderTopLeftRadius: zeroRadius,
      borderTopRightRadius: insetRadius,
      borderBottomLeftRadius: zeroRadius,
      borderBottomRightRadius: insetRadius,
    },
    bottom: {
      marginRight: negativeInsetBleed,
      marginBottom: negativeInsetBleed,
      marginLeft: negativeInsetBleed,
      borderTopLeftRadius: zeroRadius,
      borderTopRightRadius: zeroRadius,
      borderBottomLeftRadius: insetRadius,
      borderBottomRightRadius: insetRadius,
    },
    left: {
      marginTop: negativeInsetBleed,
      marginBottom: negativeInsetBleed,
      marginLeft: negativeInsetBleed,
      borderTopLeftRadius: insetRadius,
      borderTopRightRadius: zeroRadius,
      borderBottomLeftRadius: insetRadius,
      borderBottomRightRadius: zeroRadius,
    },
  }

  return stylesBySide[side]
}

export interface InsetProps extends React.HTMLAttributes<HTMLDivElement>, MarginProps {
  /** Which sides to clip */
  side?: Side
  /** Clip content to card border-box or padding-box. */
  clip?: Clip
  /** Content padding */
  p?: Padding
  /** Horizontal padding */
  px?: Padding
  /** Vertical padding */
  py?: Padding
  /** Padding top */
  pt?: Padding
  /** Padding right */
  pr?: Padding
  /** Padding bottom */
  pb?: Padding
  /** Padding left */
  pl?: Padding
}

const Inset = React.forwardRef<HTMLDivElement, InsetProps>(
  (
    {
      side = 'all',
      clip = 'border-box',
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      className,
      children,
      style,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      ...props
    },
    ref,
  ) => {
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })
    const paddingProps = getPaddingProps({
      p: resolveInsetPaddingValue(p),
      px: resolveInsetPaddingValue(px),
      py: resolveInsetPaddingValue(py),
      pt: resolveInsetPaddingValue(pt),
      pr: resolveInsetPaddingValue(pr),
      pb: resolveInsetPaddingValue(pb),
      pl: resolveInsetPaddingValue(pl),
    })

    const insetBleed =
      clip === 'padding-box'
        ? 'calc(var(--inset-padding, 0px) + var(--inset-border-width, 0px))'
        : 'var(--inset-padding, 0px)'
    const insetRadius =
      clip === 'padding-box'
        ? 'var(--inset-border-radius, 0px)'
        : 'calc(var(--inset-border-radius, 0px) - var(--inset-border-width, 0px))'

    const bleedStyles = getBleedStyles(side, insetBleed, insetRadius)

    return (
      <div
        ref={ref}
        className={cn('box-border overflow-hidden', paddingProps.className, marginProps.className, className)}
        style={
          {
            ...marginProps.style,
            ...paddingProps.style,
            ...bleedStyles,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    )
  },
)

Inset.displayName = 'Inset'

export { Inset }
