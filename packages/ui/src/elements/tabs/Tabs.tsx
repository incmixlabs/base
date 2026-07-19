'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import * as React from 'react'
import { useComposedRefs } from '@/lib/compose-refs'
import { cn } from '@/lib/utils'
import { radiusClassByToken } from '@/theme/helpers'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color, Radius } from '@/theme/tokens'
import { SimpleTooltip } from '../tooltip/Tooltip'
import { createTabsSizeConfigs, selectSegmentedControlVariantSizeMap } from './segmented-control.shared'
import {
  segmentedIndicatorBaseCls,
  segmentedItemBaseCls,
  segmentedItemBySize,
  segmentedLineContentBySize,
  segmentedRootBaseCls,
  segmentedSurfaceContentBySize,
  segmentedSurfaceIndicatorByColor,
  segmentedSurfaceRootByColor,
  segmentedSurfaceRootBySize,
  segmentedSurfaceSelectedHighContrastTextByColor,
  segmentedSurfaceSelectedTextByColor,
  segmentedTabInteractiveCls,
  segmentedUnderlineIndicatorByColor,
  segmentedUnderlineIndicatorCls,
  segmentedUnderlineIndicatorVerticalCls,
  segmentedUnderlineItemBySize,
  segmentedUnderlineRootByColor,
  segmentedUnderlineRootBySize,
  segmentedUnderlineRootVerticalByColor,
  segmentedUnderlineSelectedByColor,
  segmentedUnderlineUnselectedCls,
} from './segmented-control.shared.class'
import { renderTabLabelWithIcon, type TabIconsConfig } from './tab-icons'
import {
  tabsPanelActive,
  tabsPanelAnimated,
  tabsPanelBase,
  tabsPanelCurrent,
  tabsPanelExiting,
  tabsPanelInactive,
  tabsPanelStack,
  tabsPanelStackItem,
} from './tabs.class'
import { tabsPropDefs } from './tabs.props'
import { partitionStackedPanels } from './tabs-children'
import { useExitTransitionFallback } from './tabs-transition'
import { useAnimatedIndicator } from './useAnimatedIndicator'

export const TabsVariants = {
  surface: 'surface',
  line: 'line',
} as const

type TabsVariant = (typeof TabsVariants)[keyof typeof TabsVariants]
type TabsSize = (typeof tabsPropDefs.Root.size.values)[number]
type TabsSizeConfig = { list: string; trigger: string; content: string }
const DEFAULT_TABS_SIZE = tabsPropDefs.Root.size.default as TabsSize
const DEFAULT_TABS_VARIANT = tabsPropDefs.Root.variant.default as TabsVariant

const { surfaceSizes, lineSizes } = createTabsSizeConfigs(
  tabsPropDefs.Root.size.values,
  segmentedSurfaceRootBySize,
  segmentedItemBySize,
  segmentedUnderlineItemBySize,
  segmentedSurfaceContentBySize,
  segmentedLineContentBySize,
) as {
  surfaceSizes: Record<TabsSize, TabsSizeConfig>
  lineSizes: Record<TabsSize, TabsSizeConfig>
}

interface TabsContextValue {
  size: TabsSize
  radius: Radius
  variant: TabsVariant
  color: Color
  highContrast: boolean
  hover: boolean
  activeValue: string | null
  orientation: 'horizontal' | 'vertical'
  icons?: TabIconsConfig
  animated: boolean
}

const TabsContext = React.createContext<TabsContextValue>({
  size: DEFAULT_TABS_SIZE,
  radius: tabsPropDefs.Root.radius.default as Radius,
  variant: DEFAULT_TABS_VARIANT,
  color: SemanticColor.slate,
  highContrast: false,
  hover: tabsPropDefs.Root.hover.default,
  activeValue: null,
  orientation: 'horizontal',
  animated: false,
})

export interface TabsRootProps extends MarginProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  size?: TabsSize
  radius?: Radius
  variant?: TabsVariant
  color?: Color
  highContrast?: boolean
  hover?: boolean
  orientation?: 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
  icons?: TabIconsConfig
  animated?: boolean
  children: React.ReactNode
}

const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      size = DEFAULT_TABS_SIZE,
      radius: radiusProp,
      variant = DEFAULT_TABS_VARIANT,
      color = SemanticColor.slate,
      highContrast = false,
      hover = tabsPropDefs.Root.hover.default,
      orientation = 'horizontal',
      className,
      children,
      style,
      icons,
      animated = false,
      m: mProp,
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
    const tabsSize = (normalizeEnumPropValue(tabsPropDefs.Root.size, size) ??
      tabsPropDefs.Root.size.default) as TabsSize
    const radius = normalizeEnumPropValue(tabsPropDefs.Root.radius, radiusProp) as Radius
    const safeVariant = (normalizeEnumPropValue(tabsPropDefs.Root.variant, variant) ??
      tabsPropDefs.Root.variant.default) as TabsVariant
    const safeColor = (normalizeEnumPropValue(tabsPropDefs.Root.color, color) ?? SemanticColor.slate) as Color
    const safeHighContrast = normalizeBooleanPropValue(tabsPropDefs.Root.highContrast, highContrast) ?? false
    const safeHover = normalizeBooleanPropValue(tabsPropDefs.Root.hover, hover) ?? tabsPropDefs.Root.hover.default
    const safeAnimated = normalizeBooleanPropValue(tabsPropDefs.Root.animated, animated) ?? false
    const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue)
    const activeValue = value ?? internalValue ?? null
    const marginProps = getMarginProps({ m: mProp, mx, my, mt, mr, mb, ml })
    const { panels: tabPanels, nonPanels: nonPanelChildren } = partitionStackedPanels(children, TabsContent)

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [value, onValueChange],
    )

    return (
      <TabsContext.Provider
        value={{
          size: tabsSize,
          radius,
          variant: safeVariant,
          color: safeColor,
          highContrast: safeHighContrast,
          hover: safeHover,
          activeValue,
          orientation,
          icons,
          animated: safeAnimated,
        }}
      >
        <TabsPrimitive.Root
          ref={ref}
          value={value ?? internalValue}
          onValueChange={handleValueChange}
          orientation={orientation}
          className={cn(
            orientation === 'vertical' && 'flex gap-4',
            safeHighContrast && 'af-high-contrast',
            marginProps.className,
            className,
          )}
          style={{ ...marginProps.style, ...style }}
          {...props}
        >
          {safeAnimated && tabPanels.length > 0 ? (
            <>
              {nonPanelChildren}
              <div className={tabsPanelStack}>{tabPanels}</div>
            </>
          ) : (
            children
          )}
        </TabsPrimitive.Root>
      </TabsContext.Provider>
    )
  },
)

TabsRoot.displayName = 'Tabs.Root'

export interface TabsListProps {
  className?: string
  children: React.ReactNode
  justify?: 'start' | 'center' | 'end'
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, justify = 'start', ...props }, ref) => {
    const { size, radius, variant, color, activeValue, orientation } = React.useContext(TabsContext)

    const listRef = React.useRef<HTMLDivElement>(null)
    const indicatorStyle = useAnimatedIndicator({
      containerRef: listRef,
      activeValue,
      itemSelector: '[role="tab"]',
    })
    const isVertical = orientation === 'vertical'
    const resolvedIndicatorStyle =
      variant === TabsVariants.line
        ? isVertical
          ? { ...indicatorStyle, left: 'auto', right: '1px', width: '2px' }
          : { ...indicatorStyle, top: 'auto', bottom: '1px', height: '2px' }
        : indicatorStyle
    const rootSizeClass = selectSegmentedControlVariantSizeMap(
      variant,
      TabsVariants.surface,
      segmentedSurfaceRootBySize,
      segmentedUnderlineRootBySize,
    )[size]

    const handleListRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as { current: HTMLDivElement | null }).current = node
        }
      },
      [ref],
    )

    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    }

    return (
      <TabsPrimitive.List
        ref={handleListRef}
        className={cn(
          segmentedRootBaseCls,
          rootSizeClass,
          variant === TabsVariants.surface && radiusClassByToken[radius],
          variant === TabsVariants.surface && segmentedSurfaceRootByColor[color],
          variant === TabsVariants.line &&
            (isVertical ? segmentedUnderlineRootVerticalByColor[color] : segmentedUnderlineRootByColor[color]),
          variant === TabsVariants.line && [
            'gap-1',
            isVertical
              ? 'flex-col items-stretch overflow-y-auto overflow-x-hidden'
              : 'items-end overflow-x-auto scrollbar-none',
            !isVertical && justifyClasses[justify],
          ],
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            segmentedIndicatorBaseCls,
            variant === TabsVariants.surface && radiusClassByToken[radius],
            variant === TabsVariants.line &&
              (isVertical ? segmentedUnderlineIndicatorVerticalCls : segmentedUnderlineIndicatorCls),
            variant === TabsVariants.surface
              ? segmentedSurfaceIndicatorByColor[color]
              : segmentedUnderlineIndicatorByColor[color],
          )}
          style={resolvedIndicatorStyle}
        />
        {children}
      </TabsPrimitive.List>
    )
  },
)

TabsList.displayName = 'Tabs.List'

export interface TabsTriggerProps {
  value: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, disabled, className, children, ...props }, ref) => {
    const { size, radius, variant, color, highContrast, hover, activeValue, orientation, icons } =
      React.useContext(TabsContext)
    const sizeConfig = selectSegmentedControlVariantSizeMap(variant, TabsVariants.surface, surfaceSizes, lineSizes)[
      size
    ]
    const isActive = activeValue === value
    const isVertical = orientation === 'vertical'
    const renderedLabel = renderTabLabelWithIcon({ children, value, icons })

    const tab = (
      <TabsPrimitive.Tab
        ref={ref}
        value={value}
        disabled={disabled}
        aria-label={renderedLabel.ariaLabel}
        className={cn(
          segmentedItemBaseCls,
          segmentedTabInteractiveCls,
          'transition-all',
          sizeConfig.trigger,
          variant === TabsVariants.surface && radiusClassByToken[radius],
          variant === TabsVariants.surface && '!items-end',
          variant === TabsVariants.surface && 'border-0',
          variant === TabsVariants.line && !isVertical && '!items-end',
          variant === TabsVariants.line && isVertical && '!justify-start',
          variant === TabsVariants.line && segmentedUnderlineUnselectedCls,
          hover && 'enabled:cursor-pointer',
          hover &&
            variant === TabsVariants.surface &&
            !isActive &&
            'enabled:hover:text-neutral enabled:hover:bg-neutral-soft',
          hover && variant === TabsVariants.line && !isActive && 'enabled:hover:text-neutral',
          !hover && 'cursor-default',
          !isActive && 'text-muted',
          isActive &&
            variant === TabsVariants.surface &&
            (highContrast
              ? segmentedSurfaceSelectedHighContrastTextByColor[color]
              : segmentedSurfaceSelectedTextByColor[color]),
          isActive && variant === TabsVariants.line && segmentedUnderlineSelectedByColor[color],
          className,
        )}
        style={{
          boxShadow: 'none',
          WebkitAppearance: 'none',
        }}
        {...props}
      >
        {renderedLabel.content}
      </TabsPrimitive.Tab>
    )

    if (renderedLabel.iconOnly && renderedLabel.tooltipContent) {
      return <SimpleTooltip content={renderedLabel.tooltipContent}>{tab}</SimpleTooltip>
    }

    return tab
  },
)

TabsTrigger.displayName = 'Tabs.Trigger'

export interface TabsContentProps {
  value: string
  forceMount?: boolean
  className?: string
  children: React.ReactNode
  onTransitionEnd?: React.TransitionEventHandler<HTMLDivElement>
}

type TabsContentInternalProps = TabsContentProps & {
  __stacked?: boolean
}

const TabsContentImpl = React.forwardRef<HTMLDivElement, TabsContentInternalProps>(
  ({ value, forceMount, className, children, onTransitionEnd, __stacked = false, ...props }, ref) => {
    const { size, variant, animated, activeValue } = React.useContext(TabsContext)
    const sizeConfig = selectSegmentedControlVariantSizeMap(variant, TabsVariants.surface, surfaceSizes, lineSizes)[
      size
    ]
    const isActive = activeValue === value
    const isStackedAnimated = animated && __stacked
    const wasActiveRef = React.useRef(isActive)
    const [isExiting, setIsExiting] = React.useState(false)
    const shouldExit = isStackedAnimated && wasActiveRef.current && !isActive
    const shouldRender = isActive || forceMount || shouldExit || isExiting
    const shouldKeepPanelMounted = forceMount || (isStackedAnimated && shouldRender)
    const isLeaving = isStackedAnimated && !isActive && (shouldExit || isExiting)
    const panelRef = React.useRef<HTMLDivElement>(null)
    const composedRef = useComposedRefs(ref, panelRef)
    const completeExit = React.useCallback(() => {
      setIsExiting(false)
    }, [])

    React.useEffect(() => {
      if (!isStackedAnimated) {
        setIsExiting(false)
        wasActiveRef.current = isActive
        return
      }

      if (isActive) {
        setIsExiting(false)
      } else if (wasActiveRef.current) {
        setIsExiting(true)
      }

      wasActiveRef.current = isActive
    }, [isStackedAnimated, isActive])

    const handleTransitionEnd = React.useCallback<React.TransitionEventHandler<HTMLDivElement>>(
      event => {
        onTransitionEnd?.(event)
        if (event.target !== event.currentTarget) return
        if (isStackedAnimated && !isActive) {
          completeExit()
        }
      },
      [completeExit, isActive, isStackedAnimated, onTransitionEnd],
    )

    useExitTransitionFallback(panelRef, isStackedAnimated && !isActive && (shouldExit || isExiting), completeExit)

    const panelClassName = cn(
      tabsPanelBase,
      isStackedAnimated && tabsPanelStackItem,
      isStackedAnimated && tabsPanelAnimated,
      isStackedAnimated && (isActive ? tabsPanelActive : tabsPanelInactive),
      isStackedAnimated && (isLeaving ? tabsPanelExiting : tabsPanelCurrent),
      sizeConfig.content,
      className,
    )

    if (!shouldRender) return null

    return (
      <TabsPrimitive.Panel
        {...props}
        ref={composedRef}
        value={value}
        keepMounted={shouldKeepPanelMounted}
        hidden={isStackedAnimated ? false : undefined}
        aria-hidden={isStackedAnimated && !isActive ? true : undefined}
        inert={isStackedAnimated && !isActive ? true : undefined}
        tabIndex={isStackedAnimated && !isActive ? -1 : undefined}
        onTransitionEnd={handleTransitionEnd}
        className={panelClassName}
      >
        {children}
      </TabsPrimitive.Panel>
    )
  },
)

TabsContentImpl.displayName = 'Tabs.Content'

const TabsContent = TabsContentImpl as React.ForwardRefExoticComponent<
  TabsContentProps & React.RefAttributes<HTMLDivElement>
>

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
}

export namespace TabsProps {
  export type Root = TabsRootProps
  export type List = TabsListProps
  export type Trigger = TabsTriggerProps
  export type Content = TabsContentProps
}
