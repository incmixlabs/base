'use client'

import * as React from 'react'
import { useThemeRadius } from '@/elements/utils'
import { cn } from '@/lib/utils'
import { getHeightProps } from '@/theme/helpers/get-height-styles'
import { getWidthProps } from '@/theme/helpers/get-width-styles'
import {
  extractSharedLayoutProps,
  getLayoutCompositionClasses,
  getLayoutCompositionStyles,
  getMergedSlotClassName,
  getResponsiveLayoutClasses,
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
  containerSizeResponsive,
} from './container.class'
import type { ContainerAlign, ContainerDisplay, ContainerProps } from './container.props'

export type {
  ContainerAlign,
  ContainerDisplay,
  ContainerOwnProps,
  ContainerProps,
  ContainerSize,
} from './container.props'
export {
  containerAlignValues,
  containerDisplayValues,
  containerSizes,
} from './container.props'

// ============================================================================
// Container Class Maps
// ============================================================================

const containerBaseClassName = 'box-border w-full'
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

    const sizeClasses = getResponsiveLayoutClasses(resolvedSize, containerBySize, containerSizeResponsive, '4')
    const displayClasses = getResponsiveLayoutClasses(
      display,
      containerDisplayClassNames,
      containerDisplayResponsive,
      'initial',
    )
    const alignClasses = getResponsiveLayoutClasses(
      resolvedAlign,
      containerAlignClassNames,
      containerAlignResponsive,
      'center',
    )

    const classes = cn(
      containerBaseClassName,
      containerBase,
      sharedLayoutProps.borderColor && !hasBorderWidthUtility(effectiveClassName) && 'border',
      getSharedLayoutClasses(sharedLayoutProps),
      className,
    )

    const innerClasses = cn(
      containerInnerClassName,
      !innerLayoutProps.layout && displayClasses,
      shouldApplyContainerAlign && alignClasses,
      getLayoutCompositionClasses(innerLayoutProps),
      sizeClasses,
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
