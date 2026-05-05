'use client'

import * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import { type Color, resolveThemeColorToken, type ThemeColorToken } from '@/theme/tokens'
import { SimpleTooltip } from '../tooltip/Tooltip'
import { getColorVars } from '../utils'
import { DynamicLucideIcon, type DynamicLucideIconProps } from './dynamic-icon'
import { iconButtonSizeIconScope, iconSizeVariants } from './IconButton.css'
import { iconButtonPropDefs } from './icon-button.props'

type IconSize = (typeof iconButtonPropDefs.size.values)[number]

function mapIconSizeToTooltipSize(size: IconSize): 'xs' | 'sm' | 'md' | 'lg' {
  if (size === 'xl') return 'lg'
  return size
}

export interface IconTooltipData {
  icon?: string
  size: IconSize
}

export interface IconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'title' | 'color'>, MarginProps {
  size?: IconSize
  color?: Color | ThemeColorToken
  title?: string | ((data: IconTooltipData) => React.ReactNode)
  icon?: string
  fill?: boolean
  iconProps?: Omit<DynamicLucideIconProps, 'name' | 'className'>
}

const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      size = 'md',
      color = 'primary',
      title,
      icon,
      fill = false,
      iconProps,
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
    const safeSize = (normalizeEnumPropValue(iconButtonPropDefs.size, size) ??
      iconButtonPropDefs.size.default) as IconSize
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })
    const isSemanticColor =
      typeof color === 'string' && (iconButtonPropDefs.color.values as readonly string[]).includes(color)
    const resolvedColor = isSemanticColor
      ? getColorVars(color as Color).text
      : resolveThemeColorToken(color as ThemeColorToken)
    const tooltipText = typeof title === 'string' ? title.trim() : ''
    const tooltipContent = typeof title === 'function' ? title({ icon, size: safeSize }) : tooltipText || null
    const combinedStyles = {
      color: resolvedColor,
      ...(!tooltipContent ? marginProps.style : null),
      ...style,
    } as React.CSSProperties
    const tooltipSize = mapIconSizeToTooltipSize(safeSize)
    const iconContent = icon ? (
      <DynamicLucideIcon {...iconProps} name={icon} fill={fill ? 'currentColor' : 'none'} />
    ) : (
      children
    )
    const nativeTitle = tooltipContent ? undefined : tooltipText || undefined

    const iconNode = (
      <Flex
        as="span"
        ref={ref}
        display="inline-flex"
        align="center"
        justify="center"
        flexShrink="0"
        title={nativeTitle}
        className={cn(
          'leading-none',
          iconSizeVariants[safeSize],
          iconButtonSizeIconScope,
          !tooltipContent && marginProps.className,
          className,
        )}
        style={combinedStyles}
        {...props}
      >
        {iconContent}
      </Flex>
    )

    if (!tooltipContent) return iconNode

    return (
      <SimpleTooltip content={tooltipContent} size={tooltipSize}>
        <Flex as="span" display="inline-flex" className={marginProps.className} style={marginProps.style}>
          {iconNode}
        </Flex>
      </SimpleTooltip>
    )
  },
)

Icon.displayName = 'Icon'

export { Icon }
