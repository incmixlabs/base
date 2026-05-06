'use client'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { X } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { getHeightProps } from '@/theme/helpers/get-height-styles'
import { getWidthProps } from '@/theme/helpers/get-width-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { HeightProps } from '@/theme/props/height.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { WidthProps } from '@/theme/props/width.props'
import { useThemePortalContainer } from '@/theme/theme-provider.context'
import type { Color, Radius } from '@/theme/tokens'
import { IconButton } from '../button/IconButton'
import { FloatingArrowSvg } from '../surface/FloatingArrowSvg'
import { floatingArrowBase, surfaceColorVariants, surfaceHighContrastByVariant } from '../surface/surface.css'
import { getRadiusStyles, useThemeRadius } from '../utils'
import {
  popoverArrowColorByVariant,
  popoverContentBase,
  popoverContentBySize,
  popoverContentMaxWidth,
  popoverPanelTransition,
  popoverPanelVariants,
} from './Popover.css'
import {
  type PopoverContentMaxWidth,
  type PopoverContentSize,
  type PopoverContentVariant,
  popoverContentPropDefs,
} from './popover.props'

type PopoverVisualContextValue = {
  variant: PopoverContentVariant
  color: Color
}

const PopoverVisualContext = React.createContext<PopoverVisualContextValue>({
  variant: popoverContentPropDefs.variant.default,
  color: SemanticColor.neutral,
})

const PopoverOpenContext = React.createContext<boolean>(false)

// ============================================================================
// Root
// ============================================================================

export interface PopoverRootProps {
  /** Whether the popover is open */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Default open state */
  defaultOpen?: boolean
  /** Children elements */
  children: React.ReactNode
}

const PopoverRoot: React.FC<PopoverRootProps> = ({ open: openProp, onOpenChange, defaultOpen, children }) => {
  const isControlled = openProp !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false)
  const isOpen = isControlled ? openProp : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  return (
    <PopoverOpenContext.Provider value={isOpen}>
      <PopoverPrimitive.Root open={openProp} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
        {children}
      </PopoverPrimitive.Root>
    </PopoverOpenContext.Provider>
  )
}

PopoverRoot.displayName = 'Popover.Root'

// ============================================================================
// Trigger
// ============================================================================

export interface PopoverTriggerProps {
  /** Trigger content */
  children: React.ReactNode
  /** Additional class names */
  className?: string
  /** Render prop to compose onto an existing element (avoids nested buttons) */
  render?: React.ReactElement
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ children, className, render, ...props }, ref) => {
    if (render) {
      return (
        <PopoverPrimitive.Trigger
          ref={ref}
          render={render}
          className={cn(
            'outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2',
            className,
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Trigger>
      )
    }
    return (
      <PopoverPrimitive.Trigger
        ref={ref}
        className={cn(
          'outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      >
        {children}
      </PopoverPrimitive.Trigger>
    )
  },
)

PopoverTrigger.displayName = 'Popover.Trigger'

// ============================================================================
// Content
// ============================================================================

export interface PopoverContentProps extends HeightProps, Omit<WidthProps, 'maxWidth'> {
  /** Surface visual variant */
  variant?: PopoverContentVariant
  /** Surface color lane */
  color?: Color
  /** High contrast treatment */
  highContrast?: boolean
  /** Border radius token */
  radius?: Radius
  /** Content padding size */
  size?: PopoverContentSize
  /** Maximum width */
  maxWidth?: PopoverContentMaxWidth | WidthProps['maxWidth']
  /** Side of trigger */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Alignment */
  align?: 'start' | 'center' | 'end'
  /** Side offset */
  sideOffset?: number
  /** Alignment offset */
  alignOffset?: number
  /** Additional class names */
  className?: string
  /** Content */
  children: React.ReactNode
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      variant = popoverContentPropDefs.variant.default,
      color = SemanticColor.neutral,
      highContrast = popoverContentPropDefs.highContrast.default,
      radius: radiusProp,
      size = popoverContentPropDefs.size.default,
      maxWidth = popoverContentPropDefs.maxWidthToken.default,
      width,
      minWidth,
      height,
      minHeight,
      maxHeight,
      side = 'bottom',
      align = 'center',
      sideOffset = 8,
      alignOffset = 0,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const safeVariant = (normalizeEnumPropValue(popoverContentPropDefs.variant, variant) ??
      popoverContentPropDefs.variant.default) as PopoverContentVariant
    const safeColor = (normalizeEnumPropValue(popoverContentPropDefs.color, color) ?? SemanticColor.neutral) as Color
    const safeSize = (normalizeEnumPropValue(popoverContentPropDefs.size, size) ??
      popoverContentPropDefs.size.default) as PopoverContentSize
    const tokenMaxWidth =
      typeof maxWidth === 'string' ? normalizeEnumPropValue(popoverContentPropDefs.maxWidthToken, maxWidth) : undefined
    const resolvedTokenMaxWidth =
      maxWidth === undefined || tokenMaxWidth
        ? ((tokenMaxWidth ?? popoverContentPropDefs.maxWidthToken.default) as PopoverContentMaxWidth)
        : undefined
    const safeRadius = normalizeEnumPropValue(popoverContentPropDefs.radius, radiusProp) as Radius | undefined
    const safeHighContrast = normalizeBooleanPropValue(popoverContentPropDefs.highContrast, highContrast) ?? false
    const radius = useThemeRadius(safeRadius)
    const widthProps = getWidthProps({
      width,
      minWidth,
      maxWidth: tokenMaxWidth ? undefined : maxWidth,
    })
    const heightProps = getHeightProps({ height, minHeight, maxHeight })
    const contextValue = React.useMemo<PopoverVisualContextValue>(
      () => ({ variant: safeVariant, color: safeColor }),
      [safeVariant, safeColor],
    )

    const portalContainer = useThemePortalContainer()
    const isOpen = React.useContext(PopoverOpenContext)

    return (
      <AnimatePresence>
        {isOpen && (
          <PopoverPrimitive.Portal keepMounted container={portalContainer}>
            <PopoverPrimitive.Positioner side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
              <PopoverVisualContext.Provider value={contextValue}>
                <PopoverPrimitive.Popup
                  ref={ref}
                  render={
                    <m.div
                      key="popover-popup"
                      variants={popoverPanelVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={popoverPanelTransition}
                    />
                  }
                  className={cn(
                    'z-50 w-full border origin-[var(--transform-origin)]',
                    'focus:outline-none',
                    popoverContentBase,
                    popoverContentBySize[safeSize],
                    resolvedTokenMaxWidth && popoverContentMaxWidth[resolvedTokenMaxWidth],
                    surfaceColorVariants[safeColor][safeVariant],
                    safeHighContrast && 'af-high-contrast',
                    safeHighContrast && surfaceHighContrastByVariant[safeVariant],
                    widthProps.className,
                    heightProps.className,
                    className,
                  )}
                  style={{ ...getRadiusStyles(radius), ...widthProps.style, ...heightProps.style }}
                  {...props}
                >
                  {children}
                </PopoverPrimitive.Popup>
              </PopoverVisualContext.Provider>
            </PopoverPrimitive.Positioner>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    )
  },
)

PopoverContent.displayName = 'Popover.Content'

// ============================================================================
// Close
// ============================================================================

export interface PopoverCloseProps {
  /** Additional class names */
  className?: string
  /** Close button content */
  children?: React.ReactNode
}

const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <PopoverPrimitive.Close
        ref={ref}
        render={
          <IconButton
            variant="ghost"
            size="xs"
            className={cn('absolute right-0', className)}
            aria-label={children ? undefined : 'Close'}
          />
        }
        {...props}
      >
        {children || <X className="h-4 w-4" />}
      </PopoverPrimitive.Close>
    )
  },
)

PopoverClose.displayName = 'Popover.Close'

// ============================================================================
// Arrow
// ============================================================================

export interface PopoverArrowProps {
  /** Additional class names */
  className?: string
  /** Surface visual variant */
  variant?: PopoverContentVariant
  /** Surface color lane */
  color?: Color
}

const PopoverArrow = React.forwardRef<HTMLDivElement, PopoverArrowProps>(
  ({ className, variant, color, ...props }, ref) => {
    const visualContext = React.useContext(PopoverVisualContext)
    const safeVariant = (normalizeEnumPropValue(popoverContentPropDefs.variant, variant ?? visualContext.variant) ??
      popoverContentPropDefs.variant.default) as PopoverContentVariant
    const safeColor = (normalizeEnumPropValue(popoverContentPropDefs.color, color ?? visualContext.color) ??
      SemanticColor.neutral) as Color
    return (
      <PopoverPrimitive.Arrow
        ref={ref}
        className={cn(floatingArrowBase, popoverArrowColorByVariant[safeColor][safeVariant], className)}
        {...props}
      >
        <FloatingArrowSvg />
      </PopoverPrimitive.Arrow>
    )
  },
)

PopoverArrow.displayName = 'Popover.Arrow'

// ============================================================================
// Export compound component
// ============================================================================

/** Popover export. */
export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
  Arrow: PopoverArrow,
}

export namespace PopoverProps {
  export type Root = PopoverRootProps
  export type Trigger = PopoverTriggerProps
  export type Content = PopoverContentProps
  export type Close = PopoverCloseProps
  export type Arrow = PopoverArrowProps
}
