import { SPACING_TO_PIXELS } from '@incmix/theme'
import type * as React from 'react'
import { cn } from '@/lib/utils'
import type { PaddingProps } from '@/theme/props/padding.props'
import { space } from '@/theme/token-maps'
import { paddingResponsiveClasses, paddingResponsiveVars } from './padding-responsive.css'
import { resolveSpacingValue } from './resolve-spacing-value'
import { type ResponsiveBreakpoint, responsiveBreakpointsArray } from './responsive/breakpoints'

const responsiveBreakpoints: readonly ResponsiveBreakpoint[] = responsiveBreakpointsArray

const paddingSpacingValues: Record<string, string> = { '0': '0px' }
for (const [key, cssVar] of Object.entries(space)) {
  const fallback = (SPACING_TO_PIXELS as Record<string, string>)[key]
  paddingSpacingValues[key] = fallback ? cssVar.replace(')', `, ${fallback})`) : cssVar
}

type PaddingProperty = keyof PaddingProps
type PaddingValue = PaddingProps[PaddingProperty]
type PaddingResponsiveValue = Partial<Record<ResponsiveBreakpoint, string>>
const responsivePaddingVars = paddingResponsiveVars as Record<PaddingProperty, Record<ResponsiveBreakpoint, string>>

function isResponsiveObject(value: PaddingValue): value is PaddingResponsiveValue {
  return typeof value === 'object' && value !== null
}

function resolvePaddingValue(value: string | undefined): string | undefined {
  return resolveSpacingValue(value, paddingSpacingValues)
}

function resolveStaticPaddingValue(value: PaddingValue): string | undefined {
  if (value === undefined) return undefined
  return resolvePaddingValue((isResponsiveObject(value) ? value.initial : value) as string | undefined)
}

function assignStyleValue(style: React.CSSProperties, property: string, value: string) {
  const customPropertyName = property.startsWith('var(') ? property.slice(4, -1) : property
  ;(style as Record<string, string>)[customPropertyName] = value
}

export function getPaddingStyles(props: PaddingProps): React.CSSProperties {
  const padding = resolveStaticPaddingValue(props.p)
  const paddingX = resolveStaticPaddingValue(props.px)
  const paddingY = resolveStaticPaddingValue(props.py)
  const paddingTop = resolveStaticPaddingValue(props.pt)
  const paddingRight = resolveStaticPaddingValue(props.pr)
  const paddingBottom = resolveStaticPaddingValue(props.pb)
  const paddingLeft = resolveStaticPaddingValue(props.pl)

  return {
    ...(padding && { padding }),
    ...(paddingX && { paddingLeft: paddingX, paddingRight: paddingX }),
    ...(paddingY && { paddingTop: paddingY, paddingBottom: paddingY }),
    ...(paddingTop && { paddingTop }),
    ...(paddingRight && { paddingRight }),
    ...(paddingBottom && { paddingBottom }),
    ...(paddingLeft && { paddingLeft }),
  }
}

const staticPaddingCssProperties: Record<PaddingProperty, readonly (keyof React.CSSProperties)[]> = {
  p: ['padding'],
  px: ['paddingLeft', 'paddingRight'],
  py: ['paddingTop', 'paddingBottom'],
  pt: ['paddingTop'],
  pr: ['paddingRight'],
  pb: ['paddingBottom'],
  pl: ['paddingLeft'],
}

export function getPaddingProps(props: PaddingProps): { className?: string; style?: React.CSSProperties } {
  const classNames: string[] = []
  const style: React.CSSProperties = {}

  for (const property of Object.keys(paddingResponsiveClasses) as PaddingProperty[]) {
    const value = props[property]
    if (value === undefined) continue

    if (isResponsiveObject(value)) {
      classNames.push(paddingResponsiveClasses[property])
      let inheritedValue: string | undefined

      for (const breakpoint of responsiveBreakpoints) {
        const breakpointValue = value[breakpoint]
        inheritedValue = resolvePaddingValue(breakpointValue) ?? inheritedValue

        const variableName = responsivePaddingVars[property]?.[breakpoint]
        if (inheritedValue !== undefined && variableName !== undefined) {
          assignStyleValue(style, variableName, inheritedValue)
        }
      }
      continue
    }

    const resolvedValue = resolvePaddingValue(value as string | undefined)
    if (resolvedValue !== undefined) {
      for (const cssProp of staticPaddingCssProperties[property]) {
        ;(style as Record<string, string>)[cssProp] = resolvedValue
      }
    }
  }

  return {
    className: classNames.length > 0 ? cn(classNames) : undefined,
    style: Object.keys(style).length > 0 ? style : undefined,
  }
}
