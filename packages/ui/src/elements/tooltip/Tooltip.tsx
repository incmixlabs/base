'use client'

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { getWidthProps } from '@/theme/helpers/get-width-styles'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { WidthProps } from '@/theme/props/width.props'
import { useThemePortalContainer } from '@/theme/theme-provider.context'
import type { Color, Radius } from '@/theme/tokens'
import type {
  PopoverContentMaxWidth as TooltipMaxWidth,
  PopoverContentSize as TooltipSize,
  PopoverContentVariant as TooltipVariant,
} from '../popover/popover.props'
import { FloatingArrowSvg } from '../surface/FloatingArrowSvg'
import { floatingArrowBase, surfaceColorVariants, surfaceHighContrastByVariant } from '../surface/surface.css'
import { getRadiusStyles, useThemeRadius } from '../utils'
import {
  tooltipArrowColorByVariant,
  tooltipContentBase,
  tooltipContentBySize,
  tooltipContentMaxWidth,
  tooltipPanelTransition,
  tooltipPanelVariants,
} from './Tooltip.css'
import { tooltipContentPropDefs, tooltipProviderPropDefs } from './tooltip.props'

// ── Visual context (so Arrow inherits from Content) ──

type TooltipVisualContextValue = {
  variant: TooltipVariant
  color: Color
}

const THEME_CONTAINER_SELECTOR = '.af-themes' // used by TooltipTrigger's closest() for nested theme support

const TooltipPortalContainerContext = React.createContext<{
  portalContainer?: HTMLElement
  setPortalContainer: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>
} | null>(null)

const TooltipVisualContext = React.createContext<TooltipVisualContextValue>({
  variant: tooltipContentPropDefs.variant.default as TooltipVariant,
  color: tooltipContentPropDefs.color.default as Color,
})

function resolveTooltipVisual({
  variant,
  color,
}: {
  variant?: TooltipVariant
  color?: Color
}): TooltipVisualContextValue {
  const safeVariant = (normalizeEnumPropValue(tooltipContentPropDefs.variant, variant) ??
    tooltipContentPropDefs.variant.default) as TooltipVariant
  const safeColor = (normalizeEnumPropValue(tooltipContentPropDefs.color, color) ??
    tooltipContentPropDefs.color.default) as Color
  return { variant: safeVariant, color: safeColor }
}

// ============================================================================
// Provider
// ============================================================================

export interface TooltipProviderProps {
  /** Delay before showing tooltips (ms) */
  delayDuration?: number
  /** Delay before hiding tooltips (ms) */
  closeDelay?: number
  /** Children */
  children: React.ReactNode
}

const TooltipProvider: React.FC<TooltipProviderProps> = ({
  delayDuration = tooltipProviderPropDefs.delayDuration.default,
  closeDelay = tooltipProviderPropDefs.closeDelay.default,
  children,
}) => {
  return (
    <TooltipPrimitive.Provider delay={delayDuration} closeDelay={closeDelay}>
      {children}
    </TooltipPrimitive.Provider>
  )
}

TooltipProvider.displayName = 'Tooltip.Provider'

// ============================================================================
// Root
// ============================================================================

export interface TooltipRootProps {
  /** Whether the tooltip is open */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Default open state */
  defaultOpen?: boolean
  /** Children elements */
  children: React.ReactNode
}

const TooltipOpenContext = React.createContext<boolean>(false)

const TooltipRoot: React.FC<TooltipRootProps> = ({ open: openProp, onOpenChange, defaultOpen, children }) => {
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | undefined>(undefined)

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
    <TooltipOpenContext.Provider value={isOpen}>
      <TooltipPortalContainerContext.Provider value={{ portalContainer, setPortalContainer }}>
        <TooltipPrimitive.Root open={openProp} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
          {children}
        </TooltipPrimitive.Root>
      </TooltipPortalContainerContext.Provider>
    </TooltipOpenContext.Provider>
  )
}

TooltipRoot.displayName = 'Tooltip.Root'

// ============================================================================
// Trigger
// ============================================================================

export interface TooltipTriggerProps {
  /** Trigger content */
  children?: React.ReactNode
  /** Additional class names */
  className?: string
  /** Render prop to compose onto an existing element (avoids nested buttons) */
  render?: React.ReactElement
}

const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ children, className, render, ...props }, ref) => {
    const portalContext = React.useContext(TooltipPortalContainerContext)
    const setPortalContainerRef = React.useRef(portalContext?.setPortalContainer)

    React.useEffect(() => {
      setPortalContainerRef.current = portalContext?.setPortalContainer
    }, [portalContext])

    const composedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }

        if (!node) return
        const container = node.closest(THEME_CONTAINER_SELECTOR)
        if (container instanceof HTMLElement) {
          setPortalContainerRef.current?.(container)
        }
      },
      [ref],
    )

    if (render) {
      return (
        <TooltipPrimitive.Trigger
          ref={composedRef}
          render={render}
          className={cn('outline-none', className)}
          {...props}
        >
          {children}
        </TooltipPrimitive.Trigger>
      )
    }
    return (
      <TooltipPrimitive.Trigger ref={composedRef} className={cn('outline-none', className)} {...props}>
        {children}
      </TooltipPrimitive.Trigger>
    )
  },
)

TooltipTrigger.displayName = 'Tooltip.Trigger'

// ============================================================================
// Content — reuses Popover's VE styles with tooltip defaults
// ============================================================================

export interface TooltipContentProps extends Omit<WidthProps, 'maxWidth'> {
  /** Surface visual variant */
  variant?: TooltipVariant
  /** Surface color lane */
  color?: Color
  /** High contrast treatment */
  highContrast?: boolean
  /** Border radius token */
  radius?: Radius
  /** Content padding size */
  size?: TooltipSize
  /** Maximum width */
  maxWidth?: TooltipMaxWidth | WidthProps['maxWidth']
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
  /** Portal container element (default: document.body) */
  container?: HTMLElement | null
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      variant = tooltipContentPropDefs.variant.default as TooltipVariant,
      color = tooltipContentPropDefs.color.default as Color,
      highContrast = tooltipContentPropDefs.highContrast.default,
      radius: radiusProp,
      size = tooltipContentPropDefs.size.default as TooltipSize,
      maxWidth = tooltipContentPropDefs.maxWidthToken.default as TooltipMaxWidth,
      width,
      minWidth,
      side = 'top',
      align = 'center',
      sideOffset = 4,
      alignOffset = 0,
      className,
      children,
      container,
      ...props
    },
    ref,
  ) => {
    const portalContext = React.useContext(TooltipPortalContainerContext)
    const themePortalContainer = useThemePortalContainer()
    const { variant: safeVariant, color: safeColor } = resolveTooltipVisual({ variant, color })
    const safeSize = (normalizeEnumPropValue(tooltipContentPropDefs.size, size) ??
      tooltipContentPropDefs.size.default) as TooltipSize
    const tokenMaxWidth =
      typeof maxWidth === 'string' ? normalizeEnumPropValue(tooltipContentPropDefs.maxWidthToken, maxWidth) : undefined
    const resolvedTokenMaxWidth =
      maxWidth === undefined || tokenMaxWidth
        ? ((tokenMaxWidth ?? tooltipContentPropDefs.maxWidthToken.default) as TooltipMaxWidth)
        : undefined
    const safeRadius = normalizeEnumPropValue(tooltipContentPropDefs.radius, radiusProp) as Radius | undefined
    const safeHighContrast = normalizeBooleanPropValue(tooltipContentPropDefs.highContrast, highContrast) ?? false
    const radius = useThemeRadius(safeRadius)
    const widthProps = getWidthProps({
      width,
      minWidth,
      maxWidth: tokenMaxWidth ? undefined : maxWidth,
    })

    const contextValue = React.useMemo<TooltipVisualContextValue>(
      () => ({ variant: safeVariant, color: safeColor }),
      [safeVariant, safeColor],
    )

    const isOpen = React.useContext(TooltipOpenContext)

    return (
      <AnimatePresence>
        {isOpen && (
          <TooltipPrimitive.Portal
            keepMounted
            container={container ?? portalContext?.portalContainer ?? themePortalContainer}
          >
            <TooltipPrimitive.Positioner side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
              <TooltipVisualContext.Provider value={contextValue}>
                <TooltipPrimitive.Popup
                  ref={ref}
                  render={
                    <m.div
                      key="tooltip-popup"
                      variants={tooltipPanelVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={tooltipPanelTransition}
                    />
                  }
                  className={cn(
                    'z-50 w-full border',
                    'focus:outline-none',
                    tooltipContentBase,
                    tooltipContentBySize[safeSize],
                    resolvedTokenMaxWidth && tooltipContentMaxWidth[resolvedTokenMaxWidth],
                    surfaceColorVariants[safeColor][safeVariant],
                    safeHighContrast && 'af-high-contrast',
                    safeHighContrast && surfaceHighContrastByVariant[safeVariant],
                    widthProps.className,
                    className,
                  )}
                  style={{ ...getRadiusStyles(radius), ...widthProps.style }}
                  {...props}
                >
                  {children}
                </TooltipPrimitive.Popup>
              </TooltipVisualContext.Provider>
            </TooltipPrimitive.Positioner>
          </TooltipPrimitive.Portal>
        )}
      </AnimatePresence>
    )
  },
)

TooltipContent.displayName = 'Tooltip.Content'

// ============================================================================
// Arrow — reuses shared VE surface arrow styles
// ============================================================================

export interface TooltipArrowProps {
  /** Additional class names */
  className?: string
  /** Surface visual variant */
  variant?: TooltipVariant
  /** Surface color lane */
  color?: Color
}

const TooltipArrow: React.FC<TooltipArrowProps> = ({ className, variant, color, ...props }) => {
  const visualContext = React.useContext(TooltipVisualContext)
  const { variant: safeVariant, color: safeColor } = resolveTooltipVisual({
    variant: variant ?? visualContext.variant,
    color: color ?? visualContext.color,
  })
  return (
    <TooltipPrimitive.Arrow
      className={cn(floatingArrowBase, tooltipArrowColorByVariant[safeColor][safeVariant], className)}
      {...props}
    >
      <FloatingArrowSvg />
    </TooltipPrimitive.Arrow>
  )
}

TooltipArrow.displayName = 'Tooltip.Arrow'

// ============================================================================
// Simple Tooltip (convenience component)
// ============================================================================

export interface SimpleTooltipProps {
  /** Tooltip content */
  content: React.ReactNode
  /** Surface visual variant */
  variant?: TooltipVariant
  /** Surface color lane */
  color?: Color
  /** High contrast treatment */
  highContrast?: boolean
  /** Border radius token */
  radius?: Radius
  /** Side of trigger */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Alignment */
  align?: 'start' | 'center' | 'end'
  /** Side offset */
  sideOffset?: number
  /** Alignment offset */
  alignOffset?: number
  /** Content padding size */
  size?: TooltipSize
  /** Maximum width */
  maxWidth?: TooltipMaxWidth
  /** Whether to render the tooltip arrow */
  showArrow?: boolean
  /** Trigger element */
  children: React.ReactElement
}

const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  variant = tooltipContentPropDefs.variant.default as TooltipVariant,
  color = tooltipContentPropDefs.color.default as Color,
  highContrast = tooltipContentPropDefs.highContrast.default,
  radius,
  side = 'top',
  align = 'center',
  sideOffset = 4,
  alignOffset = 0,
  size = tooltipContentPropDefs.size.default as TooltipSize,
  maxWidth = tooltipContentPropDefs.maxWidthToken.default as TooltipMaxWidth,
  showArrow = true,
  children,
}) => {
  return (
    <TooltipRoot>
      <TooltipTrigger render={children} />
      <TooltipContent
        variant={variant}
        color={color}
        highContrast={highContrast}
        radius={radius}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        size={size}
        maxWidth={maxWidth}
      >
        {showArrow ? <TooltipArrow /> : null}
        {content}
      </TooltipContent>
    </TooltipRoot>
  )
}

SimpleTooltip.displayName = 'SimpleTooltip'

// ============================================================================
// Export compound component
// ============================================================================

/** Tooltip export. */
export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Arrow: TooltipArrow,
}

export namespace TooltipProps {
  export type Provider = TooltipProviderProps
  export type Root = TooltipRootProps
  export type Trigger = TooltipTriggerProps
  export type Content = TooltipContentProps
  export type Arrow = TooltipArrowProps
}

export type { TooltipMaxWidth, TooltipSize, TooltipVariant }
export { SimpleTooltip }
