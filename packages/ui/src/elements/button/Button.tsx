'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { Loader2 } from 'lucide-react'
import * as React from 'react'
import { composeRefs } from '@/lib/compose-refs'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color, Radius, Responsive, Variant } from '@/theme/tokens'
import { getInteractiveElementBaseClasses } from '@/theme/tokens'
import { getRadiusStyles, resolveResponsiveEnumProp, useThemeRadius } from '../utils'
import {
  buttonBaseCls,
  buttonColorVariants,
  buttonHighContrastColorVariants,
  buttonHighContrastHoverColorVariants,
  buttonHoverColorVariants,
  buttonLoading,
  buttonLoadingContentCls,
  buttonLoadingOverlayCls,
  buttonMotion,
  buttonSizeVariants,
} from './button.class'
import { buttonPropDefs } from './button.props'
import { Icon } from './Icon'

type ButtonSize = (typeof buttonPropDefs.size.values)[number]

export interface ButtonProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'color'>, MarginProps {
  size?: Responsive<ButtonSize>
  variant?: Variant
  color?: Color
  radius?: Radius
  asChild?: boolean
  loading?: boolean
  highContrast?: boolean
  inverse?: boolean
  /** Lucide icon name to render at the start (inline-start) of the button */
  iconStart?: string
  /** Lucide icon name to render at the end (inline-end) of the button */
  iconEnd?: string
  /** Fill button icons using the current icon color */
  fill?: boolean
}

export function Button({
  className,
  size = 'md',
  variant = 'solid',
  color = SemanticColor.primary,
  radius: radiusProp,
  asChild = false,
  loading = false,
  highContrast = false,
  inverse: _inverse = false,
  iconStart,
  iconEnd,
  fill = false,
  disabled,
  children,
  style,
  ref,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const resolvedSize = resolveResponsiveEnumProp(size, buttonPropDefs.size)
  const safeVariant = (normalizeEnumPropValue(buttonPropDefs.variant, variant) ??
    buttonPropDefs.variant.default) as Variant
  const safeColor = (normalizeEnumPropValue(buttonPropDefs.color, color) ??
    buttonPropDefs.color.default ??
    SemanticColor.slate) as Color
  const safeRadius = normalizeEnumPropValue(buttonPropDefs.radius, radiusProp) as Radius | undefined
  const safeLoading = normalizeBooleanPropValue(buttonPropDefs.loading, loading)
  const safeHighContrast = normalizeBooleanPropValue(buttonPropDefs.highContrast, highContrast) ?? false
  const radius = useThemeRadius(safeRadius)
  const radiusStyles = getRadiusStyles(radius)
  const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })
  const colorVariantClassName = safeHighContrast
    ? buttonHighContrastColorVariants[safeColor][safeVariant]
    : buttonColorVariants[safeColor][safeVariant]

  const combinedStyles = {
    ...marginProps.style,
    ...radiusStyles,
    ...style,
  }

  const buttonClasses = cn(
    buttonBaseCls,
    getInteractiveElementBaseClasses({ transition: 'colors' }),
    buttonMotion,
    buttonSizeVariants[resolvedSize],
    'enabled:cursor-pointer',
    !disabled &&
      !safeLoading &&
      (safeHighContrast
        ? buttonHighContrastHoverColorVariants[safeColor][safeVariant]
        : buttonHoverColorVariants[safeColor][safeVariant]),
    safeHighContrast && 'af-high-contrast',
    'rounded-[var(--element-border-radius)]',
    colorVariantClassName,
    safeLoading && buttonLoading,
    marginProps.className,
    className,
  )

  const loadingOverlay = safeLoading ? (
    <span className={buttonLoadingOverlayCls}>
      <Loader2 className="h-[1em] w-[1em] animate-spin text-current" />
    </span>
  ) : null

  const buttonIconProps = {
    color: 'currentColor',
    strokeWidth: 2.25,
  } as const

  const startIcon = iconStart ? (
    <Icon icon={iconStart} size={resolvedSize} fill={fill} iconProps={buttonIconProps} style={{ color: 'inherit' }} />
  ) : null
  const endIcon = iconEnd ? (
    <Icon icon={iconEnd} size={resolvedSize} fill={fill} iconProps={buttonIconProps} style={{ color: 'inherit' }} />
  ) : null

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<Record<string, unknown>> & {
      ref?: React.Ref<HTMLButtonElement>
    }
    const childProps = childElement.props as {
      className?: string
      style?: React.CSSProperties
      children?: React.ReactNode
    }
    const childRef = childElement.ref
    const childContent = (
      <>
        {startIcon}
        {childProps.children}
        {endIcon}
      </>
    )

    return React.cloneElement(childElement, {
      ...props,
      ref: childRef ? composeRefs(ref, childRef) : ref,
      className: cn(buttonClasses, childProps.className),
      style: { ...combinedStyles, ...childProps.style },
      'aria-busy': safeLoading || undefined,
      'aria-disabled': disabled || safeLoading || undefined,
      children: (
        <>
          {loadingOverlay}
          {safeLoading ? <span className={buttonLoadingContentCls}>{childContent}</span> : childContent}
        </>
      ),
    } as Record<string, unknown>)
  }

  const buttonContent = (
    <>
      {startIcon}
      {children}
      {endIcon}
    </>
  )

  return (
    <ButtonPrimitive
      ref={ref}
      type="button"
      className={buttonClasses}
      style={combinedStyles}
      disabled={disabled || safeLoading}
      {...props}
    >
      {loadingOverlay}
      {safeLoading ? <span className={buttonLoadingContentCls}>{buttonContent}</span> : buttonContent}
    </ButtonPrimitive>
  )
}
