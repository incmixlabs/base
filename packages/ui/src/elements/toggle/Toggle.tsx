'use client'

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color, Radius } from '@/theme/tokens'
import { getRadiusStyles, useThemeRadius } from '../utils'
import {
  toggleBase,
  toggleColorVariants,
  toggleGroupItemFlush,
  toggleGroupRoot,
  toggleGroupRootLoose,
  toggleHighContrastByVariant,
  toggleIconScope,
  toggleSizeVariants,
} from './Toggle.css'
import { togglePropDefs, type toggleVariants } from './toggle.props'

type ToggleVariant = (typeof toggleVariants)[number]
type ToggleSize = (typeof togglePropDefs.size.values)[number]

type BaseTogglePrimitiveProps<Value extends string = string> = import('@base-ui/react/toggle').ToggleProps<Value>
type BaseToggleState = import('@base-ui/react/toggle').ToggleState
type BaseToggleGroupPrimitiveProps<Value extends string = string> =
  import('@base-ui/react/toggle-group').ToggleGroupProps<Value>
type BaseToggleGroupState = import('@base-ui/react/toggle-group').ToggleGroupState

interface ToggleContextValue {
  size: ToggleSize
  variant: ToggleVariant
  color: Color
  radius: Radius
  highContrast: boolean
  flush: boolean
}

const ToggleGroupContext = React.createContext<ToggleContextValue | null>(null)

export interface ToggleProps<Value extends string = string> extends Omit<BaseTogglePrimitiveProps<Value>, 'className'> {
  size?: ToggleSize
  variant?: ToggleVariant
  color?: Color
  radius?: Radius
  highContrast?: boolean
  className?: BaseTogglePrimitiveProps<Value>['className']
}

type ToggleComponent = <Value extends string = string>(
  props: ToggleProps<Value> & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element

const ToggleInner = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      size = 'md',
      variant = 'soft',
      color = SemanticColor.slate,
      radius: radiusProp,
      highContrast = false,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const context = React.useContext(ToggleGroupContext)
    const safeSize = (normalizeEnumPropValue(togglePropDefs.size, context?.size ?? size) ??
      togglePropDefs.size.default) as ToggleSize
    const safeVariant = (normalizeEnumPropValue(togglePropDefs.variant, context?.variant ?? variant) ??
      togglePropDefs.variant.default) as ToggleVariant
    const safeColor = (normalizeEnumPropValue(togglePropDefs.color, context?.color ?? color) ??
      SemanticColor.slate) as Color
    const safeRadius = normalizeEnumPropValue(togglePropDefs.radius, context?.radius ?? radiusProp) as
      | Radius
      | undefined
    const radius = useThemeRadius(safeRadius)
    const safeHighContrast = normalizeBooleanPropValue(togglePropDefs.highContrast, highContrast) ?? false
    const effectiveHighContrast = context?.highContrast ?? safeHighContrast
    const flush = context?.flush ?? false
    const radiusStyles = getRadiusStyles(radius)
    const staticClassName = cn(
      'rounded-[var(--element-border-radius)]',
      toggleBase,
      toggleSizeVariants[safeSize],
      toggleIconScope,
      toggleColorVariants[safeColor][safeVariant],
      effectiveHighContrast && 'af-high-contrast',
      effectiveHighContrast && toggleHighContrastByVariant[safeVariant],
      flush && toggleGroupItemFlush,
    )
    const combinedStyles: BaseTogglePrimitiveProps['style'] =
      typeof style === 'function'
        ? (state: BaseToggleState) => ({
            ...radiusStyles,
            ...style(state),
          })
        : {
            ...radiusStyles,
            ...style,
          }
    const combinedClassName: BaseTogglePrimitiveProps['className'] =
      typeof className === 'function'
        ? (state: BaseToggleState) => cn(staticClassName, className(state))
        : cn(staticClassName, className)

    return (
      <TogglePrimitive ref={ref} className={combinedClassName} style={combinedStyles} {...props}>
        {children}
      </TogglePrimitive>
    )
  },
)

ToggleInner.displayName = 'Toggle'
const Toggle = ToggleInner as ToggleComponent

export interface ToggleGroupRootProps<Value extends string = string>
  extends Omit<BaseToggleGroupPrimitiveProps<Value>, 'className'> {
  size?: ToggleSize
  variant?: ToggleVariant
  color?: Color
  radius?: Radius
  highContrast?: boolean
  flush?: boolean
  className?: BaseToggleGroupPrimitiveProps<Value>['className']
}

type ToggleGroupRootComponent = <Value extends string = string>(
  props: ToggleGroupRootProps<Value> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element

const ToggleGroupRootInner = React.forwardRef<HTMLDivElement, ToggleGroupRootProps>(
  (
    {
      size = 'xs',
      variant = 'solid',
      color = SemanticColor.slate,
      radius: radiusProp = 'sm',
      highContrast = false,
      flush = true,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const safeSize = (normalizeEnumPropValue(togglePropDefs.size, size) ?? togglePropDefs.size.default) as ToggleSize
    const safeVariant = (normalizeEnumPropValue(togglePropDefs.variant, variant) ??
      togglePropDefs.variant.default) as ToggleVariant
    const safeColor = (normalizeEnumPropValue(togglePropDefs.color, color) ?? SemanticColor.slate) as Color
    const safeRadius = normalizeEnumPropValue(togglePropDefs.radius, radiusProp) as Radius | undefined
    const safeHighContrast = normalizeBooleanPropValue(togglePropDefs.highContrast, highContrast) ?? false
    const safeFlush = normalizeBooleanPropValue(togglePropDefs.flush, flush) ?? true
    const radius = useThemeRadius(safeRadius)
    const staticClassName = cn(toggleGroupRoot, !safeFlush && toggleGroupRootLoose)
    const combinedClassName: BaseToggleGroupPrimitiveProps['className'] =
      typeof className === 'function'
        ? (state: BaseToggleGroupState) => cn(staticClassName, className(state))
        : cn(staticClassName, className)

    return (
      <ToggleGroupContext.Provider
        value={{
          size: safeSize,
          variant: safeVariant,
          color: safeColor,
          radius,
          highContrast: safeHighContrast,
          flush: safeFlush,
        }}
      >
        <ToggleGroupPrimitive ref={ref} className={combinedClassName} style={style} {...props}>
          {children}
        </ToggleGroupPrimitive>
      </ToggleGroupContext.Provider>
    )
  },
)

ToggleGroupRootInner.displayName = 'ToggleGroup.Root'
const ToggleGroupRoot = ToggleGroupRootInner as ToggleGroupRootComponent

export interface ToggleGroupItemProps<Value extends string = string>
  extends Omit<ToggleProps<Value>, 'size' | 'variant' | 'color' | 'radius' | 'highContrast'> {
  value: Value
}

type ToggleGroupItemComponent = <Value extends string = string>(
  props: ToggleGroupItemProps<Value> & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element

const ToggleGroupItemInner = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>((props, ref) => {
  return <Toggle ref={ref} {...props} />
})

ToggleGroupItemInner.displayName = 'ToggleGroup.Item'
const ToggleGroupItem = ToggleGroupItemInner as ToggleGroupItemComponent

export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
}

export { Toggle }
