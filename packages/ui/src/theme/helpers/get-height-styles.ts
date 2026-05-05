import type * as React from 'react'
import { cn } from '@/lib/utils'
import type { HeightProps } from '@/theme/props/height.props'
import { heightResponsiveClasses, heightResponsiveVars } from './height-responsive.css'
import { type ResponsiveBreakpoint, responsiveBreakpointsArray } from './responsive/breakpoints'

const responsiveBreakpoints: readonly ResponsiveBreakpoint[] = responsiveBreakpointsArray

type HeightProperty = keyof HeightProps
type HeightValue = HeightProps[HeightProperty]
type HeightResponsiveValue = Partial<Record<ResponsiveBreakpoint, string>>
const responsiveHeightVars = heightResponsiveVars as Record<HeightProperty, Record<ResponsiveBreakpoint, string>>

function isResponsiveObject(value: HeightValue): value is HeightResponsiveValue {
  return typeof value === 'object' && value !== null
}

function assignStyleValue(style: React.CSSProperties, property: string, value: string) {
  const customPropertyName = property.startsWith('var(') ? property.slice(4, -1) : property
  ;(style as Record<string, string>)[customPropertyName] = value
}

export function getHeightProps(props: HeightProps): { className?: string; style?: React.CSSProperties } {
  const classNames: string[] = []
  const style: React.CSSProperties = {}

  for (const property of Object.keys(heightResponsiveClasses) as HeightProperty[]) {
    const value = props[property]
    if (value === undefined) continue

    classNames.push(heightResponsiveClasses[property])

    if (isResponsiveObject(value)) {
      let inheritedValue: string | undefined

      for (const breakpoint of responsiveBreakpoints) {
        const breakpointValue = value[breakpoint]
        inheritedValue = breakpointValue ?? inheritedValue

        const variableName = responsiveHeightVars[property]?.[breakpoint]
        if (inheritedValue !== undefined && variableName !== undefined) {
          assignStyleValue(style, variableName, inheritedValue)
        }
      }
      continue
    }

    for (const breakpoint of responsiveBreakpoints) {
      const variableName = responsiveHeightVars[property]?.[breakpoint]
      if (variableName !== undefined) {
        assignStyleValue(style, variableName, value)
      }
    }
  }

  return {
    className: classNames.length > 0 ? cn(classNames) : undefined,
    style: Object.keys(style).length > 0 ? style : undefined,
  }
}
