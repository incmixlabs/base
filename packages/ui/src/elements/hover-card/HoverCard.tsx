'use client'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
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
import {
  popoverContentBase,
  popoverContentBySize,
  popoverContentMaxWidth,
  popoverPanelTransition,
  popoverPanelVariants,
} from '../popover/Popover.css'
import { type PopoverContentVariant, popoverContentPropDefs } from '../popover/popover.props'
import { surfaceColorVariants, surfaceHighContrastByVariant } from '../surface/surface.css'
import { getRadiusStyles, useThemeRadius } from '../utils'

// ============================================================================
// Root
// ============================================================================

export interface HoverCardRootProps {
  /** Whether the hover card is open */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Default open state */
  defaultOpen?: boolean
  /** Children elements */
  children: React.ReactNode
}
const HOVER_CARD_OPEN_DELAY_MS = 80
const HOVER_CARD_CLOSE_DELAY_MS = 140
const THEME_CONTAINER_SELECTOR = '.af-themes'

const HoverCardPortalContainerContext = React.createContext<{
  portalContainer?: HTMLElement
  setPortalContainer: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>
} | null>(null)

const HoverCardOpenContext = React.createContext<boolean>(false)

const HoverCardRoot: React.FC<HoverCardRootProps> = ({ open: openProp, onOpenChange, defaultOpen, children }) => {
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | undefined>(undefined)
  const contextValue = React.useMemo(() => ({ portalContainer, setPortalContainer }), [portalContainer])

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
    <HoverCardOpenContext.Provider value={isOpen}>
      <HoverCardPortalContainerContext.Provider value={contextValue}>
        <PopoverPrimitive.Root open={openProp} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
          {children}
        </PopoverPrimitive.Root>
      </HoverCardPortalContainerContext.Provider>
    </HoverCardOpenContext.Provider>
  )
}

HoverCardRoot.displayName = 'HoverCard.Root'

// ============================================================================
// Trigger
// ============================================================================

type HoverCardPrimitiveTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>

export interface HoverCardTriggerProps
  extends Omit<HoverCardPrimitiveTriggerProps, 'children' | 'className' | 'render'> {
  /** Trigger content */
  children?: React.ReactNode
  /** Additional class names */
  className?: string
  /** Compose onto an existing trigger element */
  render?: HoverCardPrimitiveTriggerProps['render']
}

const HoverCardTrigger = React.forwardRef<HTMLElement, HoverCardTriggerProps>(
  ({ children, className, render, ...props }, ref) => {
    const portalContext = React.useContext(HoverCardPortalContainerContext)
    const setPortalContainerRef = React.useRef(portalContext?.setPortalContainer)

    React.useEffect(() => {
      setPortalContainerRef.current = portalContext?.setPortalContainer
    }, [portalContext])

    const composedRef = React.useCallback(
      (node: HTMLElement | null) => {
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }

        const container = node?.closest(THEME_CONTAINER_SELECTOR)
        setPortalContainerRef.current?.(container instanceof HTMLElement ? container : undefined)
      },
      [ref],
    )

    if (render) {
      return (
        <PopoverPrimitive.Trigger
          ref={composedRef}
          render={render}
          nativeButton={false}
          openOnHover
          delay={HOVER_CARD_OPEN_DELAY_MS}
          closeDelay={HOVER_CARD_CLOSE_DELAY_MS}
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
        ref={composedRef}
        openOnHover
        delay={HOVER_CARD_OPEN_DELAY_MS}
        closeDelay={HOVER_CARD_CLOSE_DELAY_MS}
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

HoverCardTrigger.displayName = 'HoverCard.Trigger'

// ============================================================================
// Content
// ============================================================================

type HoverCardContentSize = 'sm' | 'md' | 'lg'
type HoverCardMaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'
type HoverCardPrimitivePopupProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup>

export interface HoverCardContentProps
  extends Omit<HoverCardPrimitivePopupProps, 'children' | 'className'>,
    HeightProps,
    Omit<WidthProps, 'maxWidth'> {
  /** Surface visual variant */
  variant?: PopoverContentVariant
  /** Surface color lane */
  color?: Color
  /** High contrast treatment */
  highContrast?: boolean
  /** Border radius token */
  radius?: Radius
  /** Content padding size */
  size?: HoverCardContentSize
  /** Maximum width */
  maxWidth?: HoverCardMaxWidth | WidthProps['maxWidth']
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

const HoverCardContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Popup>, HoverCardContentProps>(
  (
    {
      variant = popoverContentPropDefs.variant.default,
      color = SemanticColor.light,
      highContrast = popoverContentPropDefs.highContrast.default,
      radius: radiusProp,
      style: styleProp,
      size = 'md',
      maxWidth = 'sm',
      width,
      minWidth,
      height,
      minHeight,
      maxHeight,
      side = 'bottom',
      align = 'center',
      sideOffset = 4,
      alignOffset = 0,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const portalContext = React.useContext(HoverCardPortalContainerContext)
    const themePortalContainer = useThemePortalContainer()
    const safeVariant = (normalizeEnumPropValue(popoverContentPropDefs.variant, variant) ??
      popoverContentPropDefs.variant.default) as PopoverContentVariant
    const safeColor = (normalizeEnumPropValue(popoverContentPropDefs.color, color) ?? SemanticColor.light) as Color
    const safeRadius = normalizeEnumPropValue(popoverContentPropDefs.radius, radiusProp) as Radius | undefined
    const safeHighContrast = normalizeBooleanPropValue(popoverContentPropDefs.highContrast, highContrast) ?? false
    const radius = useThemeRadius(safeRadius)
    const tokenMaxWidth =
      typeof maxWidth === 'string' ? normalizeEnumPropValue(popoverContentPropDefs.maxWidthToken, maxWidth) : undefined
    const resolvedTokenMaxWidth =
      maxWidth === undefined || tokenMaxWidth ? ((tokenMaxWidth ?? 'sm') as HoverCardMaxWidth) : undefined
    const widthProps = getWidthProps({
      width,
      minWidth,
      maxWidth: tokenMaxWidth ? undefined : maxWidth,
    })
    const heightProps = getHeightProps({ height, minHeight, maxHeight })
    const container = portalContext?.portalContainer ?? themePortalContainer
    const isOpen = React.useContext(HoverCardOpenContext)

    return (
      <AnimatePresence>
        {isOpen && (
          <PopoverPrimitive.Portal keepMounted container={container}>
            <PopoverPrimitive.Positioner side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
              <PopoverPrimitive.Popup
                ref={ref}
                render={
                  <m.div
                    key="hover-card-popup"
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
                  popoverContentBySize[size],
                  resolvedTokenMaxWidth && popoverContentMaxWidth[resolvedTokenMaxWidth],
                  surfaceColorVariants[safeColor][safeVariant],
                  safeHighContrast && 'af-high-contrast',
                  safeHighContrast && surfaceHighContrastByVariant[safeVariant],
                  widthProps.className,
                  heightProps.className,
                  className,
                )}
                style={{
                  ...getRadiusStyles(radius),
                  ...widthProps.style,
                  ...heightProps.style,
                  ...(styleProp as React.CSSProperties | undefined),
                }}
                {...props}
              >
                {children}
              </PopoverPrimitive.Popup>
            </PopoverPrimitive.Positioner>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    )
  },
)

HoverCardContent.displayName = 'HoverCard.Content'

// ============================================================================
// Export compound component
// ============================================================================

/** HoverCard export. */
export const HoverCard = {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
}

export namespace HoverCardProps {
  export type Root = HoverCardRootProps
  export type Trigger = HoverCardTriggerProps
  export type Content = HoverCardContentProps
}
