import { SPACING_TO_PIXELS } from '@incmix/theme'
import type * as React from 'react'
import { cn } from '@/lib/utils'
import type { MarginProps } from '@/theme/props/margin.props'
import { space } from '@/theme/token-maps'
import { marginResponsiveClasses, marginResponsiveVars } from './margin-responsive.css'
import { resolveSpacingValue } from './resolve-spacing-value'
import { type ResponsiveBreakpoint, responsiveBreakpointsArray } from './responsive/breakpoints'

const responsiveBreakpoints: readonly ResponsiveBreakpoint[] = responsiveBreakpointsArray

const marginSpacingValues: Record<string, string> = { '0': '0px' }
for (const [key, cssVar] of Object.entries(space)) {
  const fallback = (SPACING_TO_PIXELS as Record<string, string>)[key]
  marginSpacingValues[key] = fallback ? cssVar.replace(')', `, ${fallback})`) : cssVar
}

type MarginProperty = keyof MarginProps
type MarginValue = MarginProps[MarginProperty]
type MarginResponsiveValue = Partial<Record<ResponsiveBreakpoint, string>>
const responsiveMarginVars = marginResponsiveVars as Record<MarginProperty, Record<ResponsiveBreakpoint, string>>

function isResponsiveObject(value: MarginValue): value is MarginResponsiveValue {
  return typeof value === 'object' && value !== null
}

function resolveMarginValue(value: string | undefined): string | undefined {
  // TODO: If margin props ever need to support unresolved negative CSS vars
  // like `-var(--space-custom)`, handle that here without broadening the
  // shared spacing resolver contract used by layout utilities.
  return resolveSpacingValue(value, marginSpacingValues, resolvedValue =>
    resolvedValue === '0px' ? resolvedValue : `calc(${resolvedValue} * -1)`,
  )
}

function resolveStaticMarginValue(value: MarginValue): string | undefined {
  if (value === undefined) return undefined
  return resolveMarginValue((isResponsiveObject(value) ? value.initial : value) as string | undefined)
}

function assignStyleValue(style: React.CSSProperties, property: string, value: string) {
  const customPropertyName = property.startsWith('var(') ? property.slice(4, -1) : property
  ;(style as Record<string, string>)[customPropertyName] = value
}

export function getMarginStyles(props: MarginProps): React.CSSProperties {
  const margin = resolveStaticMarginValue(props.m)
  const marginX = resolveStaticMarginValue(props.mx)
  const marginY = resolveStaticMarginValue(props.my)
  const marginTop = resolveStaticMarginValue(props.mt)
  const marginRight = resolveStaticMarginValue(props.mr)
  const marginBottom = resolveStaticMarginValue(props.mb)
  const marginLeft = resolveStaticMarginValue(props.ml)

  return {
    ...(margin && { margin }),
    ...(marginX && { marginLeft: marginX, marginRight: marginX }),
    ...(marginY && { marginTop: marginY, marginBottom: marginY }),
    ...(marginTop && { marginTop }),
    ...(marginRight && { marginRight }),
    ...(marginBottom && { marginBottom }),
    ...(marginLeft && { marginLeft }),
  }
}

const staticMarginCssProperties: Record<MarginProperty, readonly (keyof React.CSSProperties)[]> = {
  m: ['margin'],
  mx: ['marginLeft', 'marginRight'],
  my: ['marginTop', 'marginBottom'],
  mt: ['marginTop'],
  mr: ['marginRight'],
  mb: ['marginBottom'],
  ml: ['marginLeft'],
}

export function getMarginProps(props: MarginProps): { className?: string; style?: React.CSSProperties } {
  const classNames: string[] = []
  const style: React.CSSProperties = {}

  for (const property of Object.keys(marginResponsiveClasses) as MarginProperty[]) {
    const value = props[property]
    if (value === undefined) continue

    if (isResponsiveObject(value)) {
      classNames.push(marginResponsiveClasses[property])
      let inheritedValue: string | undefined

      for (const breakpoint of responsiveBreakpoints) {
        const breakpointValue = value[breakpoint]
        inheritedValue = resolveMarginValue(breakpointValue) ?? inheritedValue

        const variableName = responsiveMarginVars[property]?.[breakpoint]
        if (inheritedValue !== undefined && variableName !== undefined) {
          assignStyleValue(style, variableName, inheritedValue)
        }
      }
      continue
    }

    const resolvedValue = resolveMarginValue(value as string | undefined)
    if (resolvedValue !== undefined) {
      for (const cssProp of staticMarginCssProperties[property]) {
        ;(style as Record<string, string>)[cssProp] = resolvedValue
      }
    }
  }

  return {
    className: classNames.length > 0 ? cn(classNames) : undefined,
    style: Object.keys(style).length > 0 ? style : undefined,
  }
}
