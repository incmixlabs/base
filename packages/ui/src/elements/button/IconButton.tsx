'use client'

import * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color, Radius } from '@/theme/tokens'
import { capitalize } from '@/utils/strings'
import { SimpleTooltip } from '../tooltip/Tooltip'
import { getRadiusStyles, useThemeRadius } from '../utils'
import { Icon } from './Icon'
import {
  iconButtonBase,
  iconButtonColorVariants,
  iconButtonHighContrastByVariant,
  iconButtonSizeIconScope,
  iconButtonSizeVariants,
} from './IconButton.css'
import { iconButtonPropDefs } from './icon-button.props'

// Variant styles
type IconButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost'
type IconButtonSize = (typeof iconButtonPropDefs.size.values)[number]

function mapIconButtonSizeToTooltipSize(size: IconButtonSize): 'xs' | 'sm' | 'md' | 'lg' {
  if (size === 'xl') return 'lg'
  return size
}

export interface IconButtonTooltipData {
  icon?: string
  disabled: boolean
  size: IconButtonSize
}

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'>, MarginProps {
  /** Size of the button */
  size?: IconButtonSize
  /** Visual variant */
  variant?: IconButtonVariant
  /** Color scheme */
  color?: Color
  /** Border radius */
  radius?: Radius
  /** Whether the button is in a loading state */
  loading?: boolean
  /** High contrast mode */
  highContrast?: boolean
  /** Tooltip title/content for the icon button */
  title?: string | ((data: IconButtonTooltipData) => React.ReactNode)
  /** Icon name from the curated icon safelist */
  icon?: string
  /** Fill the icon path using the current icon color */
  fill?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      size = 'md',
      variant = 'soft',
      color = SemanticColor.slate,
      radius: radiusProp,
      loading = false,
      highContrast = false,
      title,
      icon,
      fill = false,
      disabled,
      className,
      children,
      style,
      'aria-label': ariaLabelProp,
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
    const radius = useThemeRadius(radiusProp)
    const safeSize = (normalizeEnumPropValue(iconButtonPropDefs.size, size) ??
      iconButtonPropDefs.size.default) as IconButtonSize
    const safeVariant = (normalizeEnumPropValue(iconButtonPropDefs.variant, variant) ??
      iconButtonPropDefs.variant.default) as IconButtonVariant
    const safeColor = (normalizeEnumPropValue(iconButtonPropDefs.color, color) ??
      iconButtonPropDefs.color.default ??
      SemanticColor.slate) as Color
    const safeLoading = normalizeBooleanPropValue(iconButtonPropDefs.loading, loading)
    const safeHighContrast = normalizeBooleanPropValue(iconButtonPropDefs.highContrast, highContrast) ?? false
    const safeFill = normalizeBooleanPropValue(iconButtonPropDefs.fill, fill)
    const isDisabled = Boolean(disabled || safeLoading)
    const radiusStyles = getRadiusStyles(radius)
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })
    const combinedStyles = {
      ...marginProps.style,
      ...radiusStyles,
      ...style,
    }
    const tooltipText = typeof title === 'string' ? title.trim() : ''
    const tooltipData: IconButtonTooltipData = {
      icon,
      disabled: isDisabled,
      size: safeSize,
    }
    const fallbackAriaLabel = icon ? capitalize(icon) : undefined
    const tooltipContent = typeof title === 'function' ? title(tooltipData) : tooltipText || null
    const buttonStyles = tooltipContent ? ({ ...radiusStyles, ...style } as React.CSSProperties) : combinedStyles
    const tooltipSize = mapIconButtonSizeToTooltipSize(safeSize)
    const ariaLabel = ariaLabelProp ?? (tooltipText.length > 0 ? tooltipText : fallbackAriaLabel)
    const iconButtonIconProps = {
      color: 'currentColor',
      strokeWidth: 2.25,
    } as const
    const iconContent = icon ? (
      <Icon
        icon={icon}
        size={safeSize}
        color={safeColor}
        fill={safeFill}
        iconProps={iconButtonIconProps}
        style={{ color: 'inherit' }}
      />
    ) : (
      children
    )
    const nativeTitle = tooltipContent ? undefined : tooltipText || undefined

    const button = (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-label={ariaLabel}
        title={nativeTitle}
        className={cn(
          // Base reset + layout
          'inline-flex items-center justify-center shrink-0 select-none appearance-none cursor-pointer',
          'p-0 m-0 leading-none',
          iconButtonSizeVariants[safeSize],
          iconButtonSizeIconScope,
          'rounded-[var(--element-border-radius)]',
          iconButtonBase,
          safeHighContrast && 'af-high-contrast',
          iconButtonColorVariants[safeColor][safeVariant],
          'transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // High contrast
          safeHighContrast && iconButtonHighContrastByVariant[safeVariant],
          !tooltipContent && marginProps.className,

          className,
        )}
        style={buttonStyles}
        {...props}
      >
        {safeLoading ? (
          <svg
            className="animate-spin h-[1em] w-[1em]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          iconContent
        )}
      </button>
    )

    if (!tooltipContent) {
      return button
    }

    return (
      <SimpleTooltip content={tooltipContent} size={tooltipSize}>
        <Flex as="span" display="inline-flex" className={marginProps.className} style={marginProps.style}>
          {button}
        </Flex>
      </SimpleTooltip>
    )
  },
)

IconButton.displayName = 'IconButton'

export { IconButton }
