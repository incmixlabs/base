import * as React from 'react'
import { type Responsive, Slot } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import { getResponsiveVariantClasses, typographyBreakpointKeys } from '../responsive'
import { typographyTokens, type Weight } from '../tokens'
import {
  linkBase,
  linkBaseCls,
  linkByColor,
  linkBySize,
  linkByUnderline,
  linkHighContrast,
  linkSizeResponsive,
} from './Link.css'
import { linkPropDefs } from './link.props'

type LinkSize = (typeof linkPropDefs.size.values)[number]
type LinkUnderline = (typeof linkPropDefs.underline.values)[number]

type Wrap = 'wrap' | 'nowrap' | 'pretty' | 'balance'
type Trim = 'normal' | 'start' | 'end' | 'both'

export interface LinkProps extends Omit<React.ComponentPropsWithoutRef<'a'>, 'color'>, MarginProps {
  asChild?: boolean
  size?: Responsive<LinkSize>
  underline?: LinkUnderline
  color?: Color
  highContrast?: boolean
  weight?: Weight
  wrap?: Wrap
  truncate?: boolean
  trim?: Trim
}

function resolveResponsiveEnum<T extends string>(
  value: Responsive<T> | undefined,
  values: readonly T[],
  fallback: T,
): T {
  if (!value) return fallback
  if (typeof value === 'string')
    return (normalizeEnumPropValue({ type: 'enum', values } as const, value) ?? fallback) as T
  const initial = value.initial
  return (normalizeEnumPropValue({ type: 'enum', values } as const, initial) ?? fallback) as T
}

function getLinkSizeClasses(sizeProp: Responsive<LinkSize> | undefined): string {
  return getResponsiveVariantClasses(sizeProp, linkBySize, linkSizeResponsive, 'md', typographyBreakpointKeys)
}

export const Link = React.forwardRef<HTMLElement, LinkProps>(
  (
    {
      asChild,
      size = 'md',
      underline = 'auto',
      color = SemanticColor.slate,
      highContrast = false,
      weight = 'regular',
      wrap = 'wrap',
      truncate = false,
      trim,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const safeSize = resolveResponsiveEnum(size, linkPropDefs.size.values, 'md')
    const sizeClasses = getLinkSizeClasses(size)
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })
    const safeUnderline = (normalizeEnumPropValue(linkPropDefs.underline, underline) ??
      linkPropDefs.underline.default ??
      'auto') as LinkUnderline
    const safeColor = (normalizeEnumPropValue(linkPropDefs.color, color) ??
      linkPropDefs.color.default ??
      SemanticColor.slate) as Color
    const safeHighContrast = normalizeBooleanPropValue(linkPropDefs.highContrast, highContrast) ?? false

    const classes = cn(
      linkBaseCls,
      linkBase,
      typeof size === 'string' ? linkBySize[safeSize] : sizeClasses,
      linkByUnderline[safeUnderline],
      linkByColor[safeColor],
      safeHighContrast && linkHighContrast,
      wrap === 'nowrap' && 'whitespace-nowrap',
      wrap === 'pretty' && 'text-pretty',
      wrap === 'balance' && 'text-balance',
      truncate && 'truncate',
      trim === 'start' && '[text-box-trim:trim-start]',
      trim === 'end' && '[text-box-trim:trim-end]',
      trim === 'both' && '[text-box-trim:trim-both]',
      marginProps.className,
      className,
    )

    const mergedStyle: React.CSSProperties = {
      ...marginProps.style,
      fontWeight: typographyTokens.weight[weight],
      ...style,
    }

    if (asChild) {
      return (
        <Slot ref={ref} className={classes} style={mergedStyle} {...props}>
          {children}
        </Slot>
      )
    }

    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} style={mergedStyle} {...props}>
        {children}
      </a>
    )
  },
)

Link.displayName = 'Link'
