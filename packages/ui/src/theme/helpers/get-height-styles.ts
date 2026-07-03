import type * as React from 'react'
import { cn } from '@/lib/utils'
import type { HeightProps } from '@/theme/props/height.props'
import { heightResponsiveClasses, heightResponsiveVars, heightUtilityClassByProperty } from './height-responsive'
import { type ResponsiveBreakpoint, responsiveBreakpointsArray } from './responsive/breakpoints'

const responsiveBreakpoints: readonly ResponsiveBreakpoint[] = responsiveBreakpointsArray
const responsiveClassPrefix: Record<ResponsiveBreakpoint, string> = {
  initial: '',
  xs: 'xs:',
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
}

type HeightProperty = keyof HeightProps
type HeightValue = HeightProps[HeightProperty]
type HeightResponsiveValue = Partial<Record<ResponsiveBreakpoint, string>>
const heightCssPropertyByProp = {
  height: 'height',
  minHeight: 'minHeight',
  maxHeight: 'maxHeight',
} as const satisfies Record<HeightProperty, keyof React.CSSProperties>
const responsiveHeightClasses = heightResponsiveClasses as Record<HeightProperty, Record<ResponsiveBreakpoint, string>>
const responsiveHeightVars = heightResponsiveVars as Record<HeightProperty, Record<ResponsiveBreakpoint, string>>
const heightUtilities = heightUtilityClassByProperty as Record<HeightProperty, Record<string, string>>

function isResponsiveObject(value: HeightValue): value is HeightResponsiveValue {
  return typeof value === 'object' && value !== null
}

function normalizeHeightValue(value: string) {
  return value.trim()
}

function assignStyleValue(style: React.CSSProperties, property: string, value: string) {
  ;(style as Record<string, string>)[property] = normalizeHeightValue(value)
}

function assignCssProperty(style: React.CSSProperties, property: HeightProperty, value: string) {
  ;(style as Record<string, string>)[heightCssPropertyByProp[property]] = normalizeHeightValue(value)
}

function getUtilityClass(property: HeightProperty, value: string, breakpoint: ResponsiveBreakpoint) {
  const utilityClass = heightUtilities[property][value.trim()]
  return utilityClass ? `${responsiveClassPrefix[breakpoint]}${utilityClass}` : undefined
}

export function getHeightProps(props: HeightProps): { className?: string; style?: React.CSSProperties } {
  const classNames: string[] = []
  const style: React.CSSProperties = {}

  for (const property of Object.keys(heightCssPropertyByProp) as HeightProperty[]) {
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

        classNames.push(responsiveHeightClasses[property][breakpoint])
        assignStyleValue(style, responsiveHeightVars[property][breakpoint], breakpointValue)
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
