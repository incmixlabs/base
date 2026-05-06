'use client'

import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color, Radius } from '@/theme/tokens'
import { getInteractiveElementBaseClasses, SurfaceVariants, surfaceRadiusClasses } from '@/theme/tokens'
import { SimpleTooltip } from '../tooltip/Tooltip'
import { useThemeRadius } from '../utils'
import { segmentedControlRootPropDefs } from './segmented-control.props'
import { selectSegmentedControlVariantSizeMap } from './segmented-control.shared'
import {
  segmentedIndicatorBaseCls,
  segmentedItemBaseCls,
  segmentedItemBySize,
  segmentedRootBaseCls,
  segmentedSurfaceIndicatorByColor,
  segmentedSurfaceRootByColor,
  segmentedSurfaceRootBySize,
  segmentedSurfaceSelectedHighContrastTextByColor,
  segmentedSurfaceSelectedTextByColor,
  segmentedUnderlineIndicatorByColor,
  segmentedUnderlineIndicatorCls,
  segmentedUnderlineItemBySize,
  segmentedUnderlineRootByColor,
  segmentedUnderlineRootBySize,
  segmentedUnderlineSelectedByColor,
  segmentedUnderlineUnselectedCls,
} from './segmented-control.shared.css'
import { renderTabLabelWithIcon, type TabIconsConfig } from './tab-icons'
import { tabsPanelTransition, tabsPanelVariants } from './tabs.css'
import { useAnimatedIndicator } from './useAnimatedIndicator'

export const SegmentedControlVariants = {
  surface: SurfaceVariants.surface,
  underline: SurfaceVariants.underline,
} as const

type SegmentedVariant = (typeof SegmentedControlVariants)[keyof typeof SegmentedControlVariants]
type SegmentedSize = (typeof segmentedControlRootPropDefs.size.values)[number]

interface SegmentedControlContextValue {
  size: SegmentedSize
  radius: Radius
  color: Color
  highContrast: boolean
  hover: boolean
  disabled?: boolean
  variant: SegmentedVariant
  value: string
  icons?: TabIconsConfig
  animated: boolean
  onValueChange: (value: string) => void
}

const SegmentedControlContext = React.createContext<SegmentedControlContextValue | null>(null)

export interface SegmentedControlContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

const SegmentedControlContent = React.forwardRef<HTMLDivElement, SegmentedControlContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const context = React.useContext(SegmentedControlContext)

    if (!context) {
      throw new Error('SegmentedControl.Content must be used within SegmentedControl.Root')
    }

    const { value: activeValue, animated } = context
    const isActive = activeValue === value

    if (!animated) {
      if (!isActive) return null
      return (
        <div ref={ref} role="tabpanel" className={className} {...props}>
          {children}
        </div>
      )
    }

    return (
      <AnimatePresence mode="wait">
        {isActive && (
          <m.div
            ref={ref}
            key={value}
            role="tabpanel"
            variants={tabsPanelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={tabsPanelTransition}
            className={className}
            {...props}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    )
  },
)

SegmentedControlContent.displayName = 'SegmentedControl.Content'

export interface SegmentedControlRootProps extends MarginProps {
  size?: SegmentedSize
  radius?: Radius
  color?: Color
  highContrast?: boolean
  hover?: boolean
  disabled?: boolean
  variant?: SegmentedVariant
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  style?: React.CSSProperties
  icons?: TabIconsConfig
  animated?: boolean
  children: React.ReactNode
}

const SegmentedControlRoot = React.forwardRef<HTMLDivElement, SegmentedControlRootProps>(
  (
    {
      size = 'md',
      radius: radiusProp,
      color = SemanticColor.slate,
      highContrast = false,
      hover = segmentedControlRootPropDefs.hover.default,
      disabled = false,
      variant = SegmentedControlVariants.surface,
      value: controlledValue,
      defaultValue,
      onValueChange,
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
    const segmentedSize = (normalizeEnumPropValue(segmentedControlRootPropDefs.size, size) ??
      segmentedControlRootPropDefs.size.default) as SegmentedSize
    const safeVariant = (normalizeEnumPropValue(segmentedControlRootPropDefs.variant, variant) ??
      segmentedControlRootPropDefs.variant.default) as SegmentedVariant
    const safeColor = (normalizeEnumPropValue(segmentedControlRootPropDefs.color, color) ??
      SemanticColor.slate) as Color
    const safeRadius = normalizeEnumPropValue(segmentedControlRootPropDefs.radius, radiusProp) as Radius | undefined
    const safeHighContrast = normalizeBooleanPropValue(segmentedControlRootPropDefs.highContrast, highContrast) ?? false
    const safeHover = normalizeBooleanPropValue(segmentedControlRootPropDefs.hover, hover)
    const safeDisabled = normalizeBooleanPropValue(segmentedControlRootPropDefs.disabled, disabled)
    const safeAnimated = typeof animated === 'boolean' ? animated : false
    const radius = useThemeRadius(safeRadius)
    const marginProps = getMarginProps({ m: mProp, mx, my, mt, mr, mb, ml })
    const [internalValue, setInternalValue] = React.useState(defaultValue || '')
    const value = controlledValue ?? internalValue

    const rootRef = React.useRef<HTMLDivElement>(null)
    const getSegmentValue = React.useCallback((element: HTMLElement) => element.getAttribute('data-value'), [])

    const indicatorStyle = useAnimatedIndicator({
      containerRef: rootRef,
      activeValue: value,
      getValue: getSegmentValue,
    })
    const resolvedIndicatorStyle =
      safeVariant === SegmentedControlVariants.underline
        ? { ...indicatorStyle, top: 'auto', bottom: '1px', height: '2px' }
        : indicatorStyle
    const rootSizeClass = selectSegmentedControlVariantSizeMap(
      safeVariant,
      SegmentedControlVariants.surface,
      segmentedSurfaceRootBySize,
      segmentedUnderlineRootBySize,
    )[segmentedSize]

    const handleRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as { current: HTMLDivElement | null }).current = node
        }
      },
      [ref],
    )

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (controlledValue === undefined) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [controlledValue, onValueChange],
    )

    const items: React.ReactNode[] = []
    const contentPanels: React.ReactNode[] = []

    React.Children.forEach(children, child => {
      if (React.isValidElement(child) && child.type === SegmentedControlContent) {
        contentPanels.push(child)
      } else {
        items.push(child)
      }
    })

    return (
      <SegmentedControlContext.Provider
        value={{
          size: segmentedSize,
          radius,
          color: safeColor,
          highContrast: safeHighContrast,
          hover: safeHover,
          disabled: safeDisabled,
          variant: safeVariant,
          value,
          icons,
          animated: safeAnimated,
          onValueChange: handleValueChange,
        }}
      >
        <div
          ref={handleRootRef}
          role="radiogroup"
          className={cn(
            segmentedRootBaseCls,
            rootSizeClass,
            safeVariant === SegmentedControlVariants.surface && surfaceRadiusClasses[radius],
            safeVariant === SegmentedControlVariants.surface && segmentedSurfaceRootByColor[safeColor],
            safeVariant === SegmentedControlVariants.underline && segmentedUnderlineRootByColor[safeColor],
            safeHighContrast && 'af-high-contrast',
            marginProps.className,
            className,
          )}
          style={{ ...marginProps.style, ...style }}
          {...props}
        >
          <span
            aria-hidden="true"
            className={cn(
              segmentedIndicatorBaseCls,
              safeVariant === SegmentedControlVariants.surface && surfaceRadiusClasses[radius],
              safeVariant === SegmentedControlVariants.underline && segmentedUnderlineIndicatorCls,
              safeVariant === SegmentedControlVariants.surface
                ? segmentedSurfaceIndicatorByColor[safeColor]
                : segmentedUnderlineIndicatorByColor[safeColor],
            )}
            style={resolvedIndicatorStyle}
          />
          {items}
        </div>
        {contentPanels}
      </SegmentedControlContext.Provider>
    )
  },
)

SegmentedControlRoot.displayName = 'SegmentedControl.Root'

export interface SegmentedControlItemProps {
  value: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

const SegmentedControlItem = React.forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
  ({ value, disabled, className, children, ...props }, ref) => {
    const context = React.useContext(SegmentedControlContext)

    if (!context) {
      throw new Error('SegmentedControl.Item must be used within SegmentedControl.Root')
    }

    const {
      size,
      radius,
      color,
      highContrast,
      hover,
      disabled: rootDisabled,
      variant,
      value: selectedValue,
      icons,
      onValueChange,
    } = context
    const isSelected = value === selectedValue
    const isDisabled = disabled || rootDisabled
    const renderedLabel = renderTabLabelWithIcon({ children, value, icons })
    const sizeClass = selectSegmentedControlVariantSizeMap(
      variant,
      SegmentedControlVariants.underline,
      segmentedUnderlineItemBySize,
      segmentedItemBySize,
    )[size]

    const button = (
      <button
        ref={ref}
        data-segmented-item
        data-value={value}
        type="button"
        role="radio"
        aria-checked={isSelected}
        aria-label={renderedLabel.ariaLabel}
        disabled={isDisabled}
        onClick={() => onValueChange(value)}
        className={cn(
          segmentedItemBaseCls,
          getInteractiveElementBaseClasses({ ringOffset: '1' }),
          sizeClass,
          variant === SegmentedControlVariants.surface && surfaceRadiusClasses[radius],
          variant === SegmentedControlVariants.surface && '!items-end',
          variant === SegmentedControlVariants.surface && 'border-0',
          variant === SegmentedControlVariants.underline && '!items-end',
          variant === SegmentedControlVariants.underline && segmentedUnderlineUnselectedCls,
          hover &&
            variant === SegmentedControlVariants.surface &&
            !isSelected &&
            'enabled:hover:text-foreground enabled:hover:bg-muted enabled:cursor-pointer',
          hover &&
            variant === SegmentedControlVariants.underline &&
            !isSelected &&
            'enabled:hover:text-foreground enabled:cursor-pointer',
          !hover && 'cursor-default',
          !isSelected && 'text-muted-foreground',
          isSelected &&
            variant === SegmentedControlVariants.surface &&
            (highContrast
              ? segmentedSurfaceSelectedHighContrastTextByColor[color]
              : segmentedSurfaceSelectedTextByColor[color]),
          isSelected && variant === SegmentedControlVariants.underline && segmentedUnderlineSelectedByColor[color],
          className,
        )}
        {...props}
      >
        {renderedLabel.content}
      </button>
    )

    if (renderedLabel.iconOnly && renderedLabel.tooltipContent) {
      return <SimpleTooltip content={renderedLabel.tooltipContent}>{button}</SimpleTooltip>
    }

    return button
  },
)

SegmentedControlItem.displayName = 'SegmentedControl.Item'

export const SegmentedControl = {
  Root: SegmentedControlRoot,
  Item: SegmentedControlItem,
  Content: SegmentedControlContent,
}

export namespace SegmentedControlProps {
  export type Root = SegmentedControlRootProps
  export type Item = SegmentedControlItemProps
  export type Content = SegmentedControlContentProps
}
