'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import { getInteractiveElementBaseClasses } from '@/theme/tokens'
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
  segmentedUnderlineIndicatorByColor,
  segmentedUnderlineIndicatorCls,
  segmentedUnderlineIndicatorVerticalCls,
  segmentedUnderlineItemBySize,
  segmentedUnderlineRootByColor,
  segmentedUnderlineRootBySize,
  segmentedUnderlineRootVerticalByColor,
  segmentedUnderlineSelectedByColor,
  segmentedUnderlineUnselectedCls,
} from './segmented-control.shared.css'
import { renderTabLabelWithIcon, type TabIconsConfig } from './tab-icons'
import { tabsPanelTransition, tabsPanelVariants } from './tabs.css'
import { tabsPropDefs } from './tabs.props'
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
    const safeVariant = (normalizeEnumPropValue(tabsPropDefs.Root.variant, variant) ??
      tabsPropDefs.Root.variant.default) as TabsVariant
    const safeColor = (normalizeEnumPropValue(tabsPropDefs.Root.color, color) ?? SemanticColor.slate) as Color
    const safeHighContrast = normalizeBooleanPropValue(tabsPropDefs.Root.highContrast, highContrast) ?? false
    const safeHover = normalizeBooleanPropValue(tabsPropDefs.Root.hover, hover) ?? tabsPropDefs.Root.hover.default
    const safeAnimated = normalizeBooleanPropValue(tabsPropDefs.Root.animated, animated) ?? false
    const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue)
    const activeValue = value ?? internalValue ?? null
    const marginProps = getMarginProps({ m: mProp, mx, my, mt, mr, mb, ml })

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
          {children}
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
    const { size, variant, color, activeValue, orientation } = React.useContext(TabsContext)

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
    const { size, variant, color, highContrast, hover, activeValue, orientation, icons } = React.useContext(TabsContext)
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
          getInteractiveElementBaseClasses({ transition: 'all' }),
          sizeConfig.trigger,
          variant === TabsVariants.surface && '!items-end',
          variant === TabsVariants.surface && 'border-0',
          variant === TabsVariants.line && !isVertical && '!items-end',
          variant === TabsVariants.line && isVertical && '!justify-start',
          variant === TabsVariants.line && segmentedUnderlineUnselectedCls,
          hover && 'enabled:cursor-pointer',
          hover &&
            variant === TabsVariants.surface &&
            !isActive &&
            'enabled:hover:text-foreground enabled:hover:bg-muted',
          hover && variant === TabsVariants.line && !isActive && 'enabled:hover:text-foreground',
          !hover && 'cursor-default',
          !isActive && 'text-muted-foreground',
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
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, forceMount, className, children, ...props }, ref) => {
    const { size, variant, animated, activeValue } = React.useContext(TabsContext)
    const sizeConfig = selectSegmentedControlVariantSizeMap(variant, TabsVariants.surface, surfaceSizes, lineSizes)[
      size
    ]
    const isActive = activeValue === value

    const panelClassName = cn(
      'ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      sizeConfig.content,
      className,
    )

    if (!animated) {
      return (
        <TabsPrimitive.Panel ref={ref} value={value} keepMounted={forceMount} className={panelClassName} {...props}>
          {children}
        </TabsPrimitive.Panel>
      )
    }

    if (forceMount) {
      return (
        <TabsPrimitive.Panel
          ref={ref}
          value={value}
          keepMounted
          hidden={false}
          render={
            <m.div
              variants={tabsPanelVariants}
              initial={false}
              animate={isActive ? 'animate' : 'exit'}
              transition={tabsPanelTransition}
            />
          }
          className={panelClassName}
          {...props}
        >
          {children}
        </TabsPrimitive.Panel>
      )
    }

    return (
      <AnimatePresence mode="wait">
        {isActive && (
          <TabsPrimitive.Panel
            ref={ref}
            value={value}
            keepMounted
            hidden={false}
            render={
              <m.div
                key={value}
                variants={tabsPanelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={tabsPanelTransition}
              />
            }
            className={panelClassName}
            {...props}
          >
            {children}
          </TabsPrimitive.Panel>
        )}
      </AnimatePresence>
    )
  },
)

TabsContent.displayName = 'Tabs.Content'

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
