import { SPACING_TO_PIXELS } from '@incmix/theme'
import type * as React from 'react'
import { cn } from '@/lib/utils'
import type { PaddingProps } from '@/theme/props/padding.props'
import { space } from '@/theme/token-maps'
import {
  getResponsiveSpacingUtilityClasses,
  getSpacingUtilityClass,
  type SpacingUtilityPrefix,
  spacingClassValueByToken,
} from './token-class-maps'

type PaddingProperty = keyof PaddingProps
type PaddingValue = PaddingProps[PaddingProperty]
type PaddingResponsiveValue = Extract<PaddingValue, object>
const paddingProperties = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'] as const satisfies readonly PaddingProperty[]
const paddingSpacingValues: Record<string, string> = { '0': '0px' }
for (const [key, cssVar] of Object.entries(space)) {
  const fallback = (SPACING_TO_PIXELS as Record<string, string>)[key]
  paddingSpacingValues[key] = fallback ? cssVar.replace(')', `, ${fallback})`) : cssVar
}

function isResponsiveObject(value: PaddingValue): value is PaddingResponsiveValue {
  return typeof value === 'object' && value !== null
}

function resolveStaticPaddingTokenValue(value: PaddingValue): string | undefined {
  if (value === undefined) return undefined
  const staticValue = isResponsiveObject(value) ? value.initial : value
  if (typeof staticValue !== 'string') return undefined

  const token = staticValue.trim()
  return token in spacingClassValueByToken ? paddingSpacingValues[token] : undefined
}

export function getPaddingStyles(props: PaddingProps): React.CSSProperties {
  const padding = resolveStaticPaddingTokenValue(props.p)
  const paddingX = resolveStaticPaddingTokenValue(props.px)
  const paddingY = resolveStaticPaddingTokenValue(props.py)
  const paddingTop = resolveStaticPaddingTokenValue(props.pt)
  const paddingRight = resolveStaticPaddingTokenValue(props.pr)
  const paddingBottom = resolveStaticPaddingTokenValue(props.pb)
  const paddingLeft = resolveStaticPaddingTokenValue(props.pl)

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

export function getPaddingProps(props: PaddingProps): { className?: string; style?: React.CSSProperties } {
  const classNames: string[] = []

  for (const property of paddingProperties) {
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
