import type * as React from 'react'
import { cn } from '@/lib/utils'
import type { WidthProps } from '@/theme/props/width.props'
import { type ResponsiveBreakpoint, responsiveBreakpointsArray } from './responsive/breakpoints'
import { widthResponsiveClasses, widthResponsiveVars, widthUtilityClassByProperty } from './width-responsive'

const responsiveBreakpoints: readonly ResponsiveBreakpoint[] = responsiveBreakpointsArray
const responsiveClassPrefix: Record<ResponsiveBreakpoint, string> = {
  initial: '',
  xs: 'xs:',
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
}

type WidthProperty = keyof WidthProps
type WidthValue = WidthProps[WidthProperty]
type WidthResponsiveValue = Partial<Record<ResponsiveBreakpoint, string>>
const widthCssPropertyByProp = {
  width: 'width',
  minWidth: 'minWidth',
  maxWidth: 'maxWidth',
} as const satisfies Record<WidthProperty, keyof React.CSSProperties>
const responsiveWidthClasses = widthResponsiveClasses as Record<WidthProperty, Record<ResponsiveBreakpoint, string>>
const responsiveWidthVars = widthResponsiveVars as Record<WidthProperty, Record<ResponsiveBreakpoint, string>>
const widthUtilities = widthUtilityClassByProperty as Record<WidthProperty, Record<string, string>>

const widthValueAliases: Record<string, string> = {
  full: '100%',
}

function isResponsiveObject(value: WidthValue): value is WidthResponsiveValue {
  return typeof value === 'object' && value !== null
}

function normalizeWidthValue(value: string) {
  const trimmedValue = value.trim()
  return widthValueAliases[trimmedValue] ?? trimmedValue
}

function assignStyleValue(style: React.CSSProperties, property: string, value: string) {
  ;(style as Record<string, string>)[property] = normalizeWidthValue(value)
}

function assignCssProperty(style: React.CSSProperties, property: WidthProperty, value: string) {
  ;(style as Record<string, string>)[widthCssPropertyByProp[property]] = normalizeWidthValue(value)
}

function getUtilityClass(property: WidthProperty, value: string, breakpoint: ResponsiveBreakpoint) {
  const utilityClass = widthUtilities[property][value.trim()]
  return utilityClass ? `${responsiveClassPrefix[breakpoint]}${utilityClass}` : undefined
}

export function getWidthProps(props: WidthProps): { className?: string; style?: React.CSSProperties } {
  const classNames: string[] = []
  const style: React.CSSProperties = {}

  for (const property of Object.keys(widthCssPropertyByProp) as WidthProperty[]) {
    const value = props[property]
    if (value === undefined) continue

    if (isResponsiveObject(value)) {
      for (const breakpoint of responsiveBreakpoints) {
        const breakpointValue = value[breakpoint]
        if (breakpointValue === undefined) continue

        const utilityClass = getUtilityClass(property, breakpointValue, breakpoint)
        if (utilityClass) {
          classNames.push(utilityClass)
          continue
        }

        classNames.push(responsiveWidthClasses[property]![breakpoint]!)
        assignStyleValue(style, responsiveWidthVars[property]![breakpoint]!, breakpointValue)
      }
      continue
    }

    const utilityClass = getUtilityClass(property, value, 'initial')
    if (utilityClass) {
      classNames.push(utilityClass)
      continue
    }

    assignCssProperty(style, property, value)
  }

  return {
    className: classNames.length > 0 ? cn(classNames) : undefined,
    style: Object.keys(style).length > 0 ? style : undefined,
  }
}
