import type * as React from 'react'
import { cn } from '@/lib/utils'
import type { WidthProps } from '@/theme/props/width.props'
import { type ResponsiveBreakpoint, responsiveBreakpointsArray } from './responsive/breakpoints'
import { widthResponsiveClasses, widthResponsiveVars } from './width-responsive.css'

const responsiveBreakpoints: readonly ResponsiveBreakpoint[] = responsiveBreakpointsArray

type WidthProperty = keyof WidthProps
type WidthValue = WidthProps[WidthProperty]
type WidthResponsiveValue = Partial<Record<ResponsiveBreakpoint, string>>
const responsiveWidthVars = widthResponsiveVars as Record<WidthProperty, Record<ResponsiveBreakpoint, string>>

const widthValueAliases: Record<string, string> = {
  full: '100%',
}

function isResponsiveObject(value: WidthValue): value is WidthResponsiveValue {
  return typeof value === 'object' && value !== null
}

function normalizeWidthValue(value: string) {
  return widthValueAliases[value] ?? value
}

function assignStyleValue(style: React.CSSProperties, property: string, value: string) {
  const customPropertyName = property.startsWith('var(') ? property.slice(4, -1) : property
  ;(style as Record<string, string>)[customPropertyName] = normalizeWidthValue(value)
}

export function getWidthProps(props: WidthProps): { className?: string; style?: React.CSSProperties } {
  const classNames: string[] = []
  const style: React.CSSProperties = {}

  for (const property of Object.keys(widthResponsiveClasses) as WidthProperty[]) {
    const value = props[property]
    if (value === undefined) continue

    classNames.push(widthResponsiveClasses[property])

    if (isResponsiveObject(value)) {
      let inheritedValue: string | undefined

      for (const breakpoint of responsiveBreakpoints) {
        const breakpointValue = value[breakpoint]
        inheritedValue = breakpointValue ?? inheritedValue

        const variableName = responsiveWidthVars[property]?.[breakpoint]
        if (inheritedValue !== undefined && variableName !== undefined) {
          assignStyleValue(style, variableName, inheritedValue)
        }
      }
      continue
    }

    for (const breakpoint of responsiveBreakpoints) {
      const variableName = responsiveWidthVars[property]?.[breakpoint]
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
