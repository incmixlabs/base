'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { getPaddingProps } from '@/theme/helpers/get-padding-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { PaddingProps } from '@/theme/props/padding.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color, Radius } from '@/theme/tokens'
import { Icon } from '../button/Icon'
import { getRadiusStyles, useThemeRadius } from '../utils'
import {
  calloutColorVariants,
  calloutHighContrastByVariant,
  calloutHoverByVariant,
  calloutIconBaseCls,
  calloutIconVars,
  calloutInverseByVariant,
  calloutRootBase,
  calloutRootBaseCls,
  calloutSizeVars,
  calloutTextBase,
  calloutTextBySize,
} from './Callout.css'
import { calloutRootPropDefs } from './callout.props'

// Callout-specific variant type (different from Button variants)
type CalloutVariant = 'soft' | 'surface' | 'solid' | 'outline' | 'split'
type CalloutSize = (typeof calloutRootPropDefs.size.values)[number]
const DEFAULT_CALLOUT_COLOR = SemanticColor.slate

// Context for sharing size across subcomponents
interface CalloutContextValue {
  size: CalloutSize
}

const CalloutContext = React.createContext<CalloutContextValue>({ size: 'xl' })

// ============================================================================
// CalloutRoot
// ============================================================================

export interface CalloutRootProps extends React.HTMLAttributes<HTMLDivElement>, PaddingProps {
  /** The size of the callout */
  size?: CalloutSize
  /** The visual variant */
  variant?: CalloutVariant
  /** The accent color */
  color?: Color
  /** Border radius */
  radius?: Radius
  /** High contrast mode for better accessibility */
  highContrast?: boolean
  /** Inverse text treatment for soft/solid variants */
  inverse?: boolean
  /** Enable hover styles/cursor for interactive callouts */
  hover?: boolean
  /** Lucide icon name to render in the callout icon slot */
  icon?: string
  /** Text content to render in the callout text slot */
  text?: React.ReactNode
}

const CalloutRoot = React.forwardRef<HTMLDivElement, CalloutRootProps>(
  (
    {
      className,
      size = 'xl',
      variant = 'surface',
      color = DEFAULT_CALLOUT_COLOR,
      radius: radiusProp = 'lg',
      highContrast = false,
      inverse = calloutRootPropDefs.inverse.default,
      hover = calloutRootPropDefs.hover.default,
      icon,
      text,
      style,
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      children,
      ...props
    },
    ref,
  ) => {
    const safeSize = (normalizeEnumPropValue(calloutRootPropDefs.size, size) ??
      calloutRootPropDefs.size.default) as CalloutSize
    const safeVariant = (normalizeEnumPropValue(calloutRootPropDefs.variant, variant) ??
      calloutRootPropDefs.variant.default) as CalloutVariant
    const contextValue = React.useMemo(() => ({ size: safeSize }), [safeSize])
    const safeColor = (normalizeEnumPropValue(calloutRootPropDefs.color, color) ?? DEFAULT_CALLOUT_COLOR) as Color
    const supportsInverse = safeVariant === 'soft' || safeVariant === 'solid'
    const safeRadius = normalizeEnumPropValue(calloutRootPropDefs.radius, radiusProp) as Radius | undefined
    const safeHighContrast = normalizeBooleanPropValue(calloutRootPropDefs.highContrast, highContrast) ?? false
    const safeInverse = normalizeBooleanPropValue(calloutRootPropDefs.inverse, inverse)
    const safeHover = normalizeBooleanPropValue(calloutRootPropDefs.hover, hover)
    const radius = useThemeRadius(safeRadius ?? 'lg')
    const paddingProps = getPaddingProps({ p, px, py, pt, pr, pb, pl })
    const combinedStyle = { ...paddingProps.style, ...getRadiusStyles(radius), ...style }
    const normalizedIconName = typeof icon === 'string' ? icon.trim() : ''

    return (
      <CalloutContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            calloutRootBaseCls,
            calloutRootBase,
            calloutSizeVars[safeSize],
            // Color and variant styles
            calloutColorVariants[safeColor][safeVariant],
            safeInverse && supportsInverse && calloutInverseByVariant[safeColor][safeVariant],
            safeHover && calloutHoverByVariant[safeVariant],
            safeHover && 'callout-hover-enabled',
            safeHover && 'cursor-pointer',
            // High contrast mode
            safeHighContrast && calloutHighContrastByVariant[safeVariant],
            paddingProps.className,
            className,
          )}
          style={combinedStyle}
          {...props}
        >
          {normalizedIconName ? <CalloutIcon name={normalizedIconName} /> : null}
          {text != null ? <CalloutText>{text}</CalloutText> : null}
          {children}
        </div>
      </CalloutContext.Provider>
    )
  },
)

CalloutRoot.displayName = 'Callout.Root'

// ============================================================================
// CalloutIcon
// ============================================================================

export interface CalloutIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lucide icon name to load dynamically */
  name?: string
}

const CalloutIcon = React.forwardRef<HTMLDivElement, CalloutIconProps>(
  ({ className, children, style, name, ...props }, ref) => {
    const { size } = React.useContext(CalloutContext)
    const iconSize = size === '2x' ? 'xl' : size
    const iconContent = name ? <Icon icon={name} size={iconSize} aria-hidden="true" /> : children

    return (
      <div
        ref={ref}
        data-slot="callout-icon"
        className={cn(calloutIconBaseCls, calloutIconVars, calloutSizeVars[size], className)}
        style={style}
        {...props}
      >
        {iconContent}
      </div>
    )
  },
)

CalloutIcon.displayName = 'Callout.Icon'

// ============================================================================
// CalloutText
// ============================================================================

export interface CalloutTextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CalloutText = React.forwardRef<HTMLParagraphElement, CalloutTextProps>(({ className, ...props }, ref) => {
  const { size } = React.useContext(CalloutContext)

  return (
    <p
      ref={ref}
      data-slot="callout-text"
      className={cn(calloutTextBase, calloutTextBySize[size], className)}
      {...props}
    />
  )
})

CalloutText.displayName = 'Callout.Text'

// ============================================================================
// Compound Component Export
// ============================================================================

/** Callout export. */
export const Callout = {
  Root: CalloutRoot,
  Icon: CalloutIcon,
  Text: CalloutText,
}

export namespace CalloutProps {
  export type Root = CalloutRootProps
  export type Icon = CalloutIconProps
  export type Text = CalloutTextProps
  export type Variant = CalloutVariant
}

// Re-export the variant type
export type { CalloutVariant }
// Also export individual components for convenience
export { CalloutIcon, CalloutRoot, CalloutText }
