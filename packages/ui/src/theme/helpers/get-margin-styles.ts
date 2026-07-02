import { SPACING_TO_PIXELS } from '@incmix/theme'
import type * as React from 'react'
import { cn } from '@/lib/utils'
import type { MarginProps } from '@/theme/props/margin.props'
import { space } from '@/theme/token-maps'
import {
  getResponsiveSpacingUtilityClasses,
  getSpacingUtilityClass,
  type SpacingUtilityPrefix,
  spacingClassValueByToken,
} from './token-class-maps'

type MarginProperty = keyof MarginProps
type MarginValue = MarginProps[MarginProperty]
type MarginResponsiveValue = Extract<MarginValue, object>
const marginProperties = ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'] as const satisfies readonly MarginProperty[]
const marginSpacingValues: Record<string, string> = { '0': '0px' }
for (const [key, cssVar] of Object.entries(space)) {
  const fallback = (SPACING_TO_PIXELS as Record<string, string>)[key]
  marginSpacingValues[key] = fallback ? cssVar.replace(')', `, ${fallback})`) : cssVar
}

function isResponsiveObject(value: MarginValue): value is MarginResponsiveValue {
  return typeof value === 'object' && value !== null
}

function resolveStaticMarginTokenValue(value: MarginValue): string | undefined {
  if (value === undefined) return undefined
  const staticValue = isResponsiveObject(value) ? value.initial : value
  if (typeof staticValue !== 'string') return undefined

  const token = staticValue.trim()
  const unsignedToken = token.startsWith('-') ? token.slice(1) : token
  const resolvedValue = unsignedToken in spacingClassValueByToken ? marginSpacingValues[unsignedToken] : undefined
  if (!resolvedValue || !token.startsWith('-') || resolvedValue === '0px') return resolvedValue

  return `calc(${resolvedValue} * -1)`
}

export function getMarginStyles(props: MarginProps): React.CSSProperties {
  const margin = resolveStaticMarginTokenValue(props.m)
  const marginX = resolveStaticMarginTokenValue(props.mx)
  const marginY = resolveStaticMarginTokenValue(props.my)
  const marginTop = resolveStaticMarginTokenValue(props.mt)
  const marginRight = resolveStaticMarginTokenValue(props.mr)
  const marginBottom = resolveStaticMarginTokenValue(props.mb)
  const marginLeft = resolveStaticMarginTokenValue(props.ml)

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

export function getMarginProps(props: MarginProps): { className?: string; style?: React.CSSProperties } {
  const classNames: string[] = []

  for (const property of marginProperties) {
    const value = props[property]
    if (value === undefined) continue

    if (isResponsiveObject(value)) {
      const utilityClasses = getResponsiveSpacingUtilityClasses(property as SpacingUtilityPrefix, value)
      if (utilityClasses) {
        classNames.push(utilityClasses)
      }
      continue
    }

    const utilityClass = getSpacingUtilityClass(property as SpacingUtilityPrefix, value as string | undefined)
    if (utilityClass) {
      classNames.push(utilityClass)
    }
  }

  return {
    className: classNames.length > 0 ? cn(classNames) : undefined,
    style: undefined,
  }
}
