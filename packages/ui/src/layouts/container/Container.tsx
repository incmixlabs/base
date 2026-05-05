'use client'

import * as React from 'react'
import { useThemeRadius } from '@/elements/utils'
import { cn } from '@/lib/utils'
import { getHeightProps } from '@/theme/helpers/get-height-styles'
import { getWidthProps } from '@/theme/helpers/get-width-styles'
import {
  type ContainerAlign,
  extractSharedLayoutProps,
  getLayoutCompositionClasses,
  getLayoutCompositionStyles,
  getMergedSlotClassName,
  getSharedLayoutClasses,
  getSharedLayoutStyles,
  hasBorderWidthUtility,
  type LayoutCompositionProps,
  Slot,
} from '../layout-utils'
import {
  containerAlignResponsive,
  containerBase,
  containerBySize,
  containerDisplayResponsive,
  containerInnerMaxWidth,
  containerSizeResponsive,
} from './container.css'
import type { ContainerDisplay, ContainerProps } from './container.props'

export type { ContainerDisplay, ContainerOwnProps, ContainerProps } from './container.props'

// ============================================================================
// Container Class Maps
// ============================================================================

const containerBaseClassName = 'box-border'
const containerInnerClassName = 'box-border flex-col w-full mx-auto shrink-0 grow'

const containerDisplayClassNames: Record<ContainerDisplay, string> = {
  none: 'hidden',
  initial: 'flex',
}

const containerAlignClassNames: Record<ContainerAlign, string> = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
}

// ============================================================================
// Container Component
// ============================================================================

/** Container export. */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      asChild = false,
      className,
      style,
      // Container-specific props
      display,
      size = '4',
      align,
      layout,
      layoutProps,
      // Shared layout props
      width,
      minWidth,
      maxWidth,
      height,
      minHeight,
      maxHeight,
      radius,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedRadius = useThemeRadius(radius)
    const { layoutProps: sharedLayoutProps, rest: restProps } = extractSharedLayoutProps({
      ...props,
      radius: resolvedRadius,
    })
    const widthProps = getWidthProps({ width, minWidth, maxWidth })
    const heightProps = getHeightProps({ height, minHeight, maxHeight })
    const Comp = asChild ? Slot : 'div'
    const effectiveClassName = asChild ? getMergedSlotClassName(children, className) : className
    const innerLayoutProps: LayoutCompositionProps = { layout, ...layoutProps }

    const resolvedSize = size || '4'
    const resolvedAlign = align ?? 'center'
    const shouldApplyContainerAlign = !innerLayoutProps.layout || align !== undefined

    const sizeClasses =
      typeof resolvedSize === 'string'
        ? [containerBySize[resolvedSize]]
        : [
            resolvedSize.initial ? containerBySize[resolvedSize.initial] : containerBySize['4'],
            ...(resolvedSize.xs ? [containerSizeResponsive.xs[resolvedSize.xs]] : []),
            ...(resolvedSize.sm ? [containerSizeResponsive.sm[resolvedSize.sm]] : []),
            ...(resolvedSize.md ? [containerSizeResponsive.md[resolvedSize.md]] : []),
            ...(resolvedSize.lg ? [containerSizeResponsive.lg[resolvedSize.lg]] : []),
            ...(resolvedSize.xl ? [containerSizeResponsive.xl[resolvedSize.xl]] : []),
          ]

    const displayClasses =
      typeof display === 'string'
        ? [containerDisplayClassNames[display]]
        : [
            containerDisplayClassNames[display?.initial ?? 'initial'],
            ...(display?.xs ? [containerDisplayResponsive.xs[display.xs]] : []),
            ...(display?.sm ? [containerDisplayResponsive.sm[display.sm]] : []),
            ...(display?.md ? [containerDisplayResponsive.md[display.md]] : []),
            ...(display?.lg ? [containerDisplayResponsive.lg[display.lg]] : []),
            ...(display?.xl ? [containerDisplayResponsive.xl[display.xl]] : []),
          ]

    const alignClasses =
      typeof resolvedAlign === 'string'
        ? [containerAlignClassNames[resolvedAlign]]
        : [
            containerAlignClassNames[resolvedAlign.initial ?? 'center'],
            ...(resolvedAlign.xs ? [containerAlignResponsive.xs[resolvedAlign.xs]] : []),
            ...(resolvedAlign.sm ? [containerAlignResponsive.sm[resolvedAlign.sm]] : []),
            ...(resolvedAlign.md ? [containerAlignResponsive.md[resolvedAlign.md]] : []),
            ...(resolvedAlign.lg ? [containerAlignResponsive.lg[resolvedAlign.lg]] : []),
            ...(resolvedAlign.xl ? [containerAlignResponsive.xl[resolvedAlign.xl]] : []),
          ]

    const classes = cn(
      containerBaseClassName,
      containerBase,
      sharedLayoutProps.borderColor && !hasBorderWidthUtility(effectiveClassName) && 'border',
      getSharedLayoutClasses(sharedLayoutProps),
      className,
    )

    const innerClasses = cn(
      containerInnerClassName,
      containerInnerMaxWidth,
      !innerLayoutProps.layout && displayClasses,
      shouldApplyContainerAlign && alignClasses,
      getLayoutCompositionClasses(innerLayoutProps),
      ...sizeClasses,
      widthProps.className,
      heightProps.className,
    )

    const styles: React.CSSProperties = {
      ...getSharedLayoutStyles(sharedLayoutProps),
      ...style,
    }

    const innerStyles: React.CSSProperties = {
      ...getLayoutCompositionStyles(innerLayoutProps),
      ...widthProps.style,
      ...heightProps.style,
    }

    return (
      <Comp ref={ref} className={classes} style={styles} {...restProps}>
        <div className={innerClasses} style={innerStyles}>
          {children}
        </div>
      </Comp>
    )
  },
)

Container.displayName = 'Container'
