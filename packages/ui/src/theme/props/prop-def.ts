import type React from 'react'
import {
  type ResponsiveBreakpoint as Breakpoint,
  responsiveBreakpointSet as breakpoints,
  responsiveBreakpointsArray as breakpointsArray,
} from '@/theme/helpers/responsive/breakpoints'

// Creates a union type of string literals with strings, but retains intellisense for the literals.
// Union<string, 'foo' | 'bar'> => string | Omit<string, 'foo' | 'bar'>
type Union<S = string, T extends string | number = string> = T | Omit<S, T>

type Responsive<T> = T | Partial<Record<Breakpoint, T>>

type BooleanPropDef = {
  type: 'boolean'
  default?: boolean
  required?: boolean
  className?: string
}
type NumberPropDef = {
  type: 'number'
  default?: number
  required?: boolean
}
type StringPropDef = {
  type: 'string'
  default?: string
  required?: boolean
}
type ReactNodePropDef = {
  type: 'ReactNode'
  default?: React.ReactNode
  required?: boolean
}
type ObjectPropDef<T> = {
  type: 'object'
  typeFullName?: string
  default?: T
  required?: boolean
}
type CallbackPropDef<T> = {
  type: 'callback'
  typeFullName?: string
  default?: never
  required?: boolean
  readonly __type?: T
}
type EnumPropDef<T> = {
  type: 'enum'
  values: readonly T[]
  default?: T
  required?: boolean
}
type EnumOrStringPropDef<T> = {
  type: 'enum | string'
  values: readonly T[]
  default?: T | string
  required?: boolean
}

type NonStylingPropDef = {
  className?: never
  customProperties?: never
  parseValue?: never
}

type StylingPropDef = {
  className: string
  parseValue?: (value: string) => string | undefined
}

type ArbitraryStylingPropDef = {
  className: string
  customProperties: `--${string}`[]
  parseValue?: (value: string) => string | undefined
}

type RegularPropDef<T> =
  | ReactNodePropDef
  | ObjectPropDef<T>
  | BooleanPropDef
  | NumberPropDef
  | (CallbackPropDef<T> & NonStylingPropDef)
  | (StringPropDef & ArbitraryStylingPropDef)
  | (StringPropDef & NonStylingPropDef)
  | (EnumPropDef<T> & StylingPropDef)
  | (EnumPropDef<T> & NonStylingPropDef)
  | (EnumOrStringPropDef<T> & ArbitraryStylingPropDef)
  | (EnumOrStringPropDef<T> & NonStylingPropDef)
type ResponsivePropDef<T = any> = RegularPropDef<T> & { responsive: true }
type PropDef<T = any> = RegularPropDef<T> | ResponsivePropDef<T>

// prettier-ignore
type GetPropDefType<Def> = Def extends BooleanPropDef
  ? Def extends ResponsivePropDef
    ? Responsive<boolean>
    : boolean
  : Def extends NumberPropDef
    ? Def extends ResponsivePropDef
      ? Responsive<number>
      : number
    : Def extends StringPropDef
      ? Def extends ResponsivePropDef
        ? Responsive<string>
        : string
      : Def extends ReactNodePropDef
        ? Def extends ResponsivePropDef
          ? Responsive<React.ReactNode>
          : React.ReactNode
        : Def extends CallbackPropDef<infer Type>
          ? Type
          : Def extends ObjectPropDef<infer Type>
            ? Type
            : Def extends EnumOrStringPropDef<infer Type extends string>
              ? Def extends ResponsivePropDef
                ? Responsive<Union<string, Type>>
                : Union<string, Type>
              : Def extends EnumPropDef<infer Type>
                ? Def extends ResponsivePropDef<infer Type>
                  ? Responsive<Type>
                  : Type
                : never

type GetPropDefTypes<P> = {
  [K in keyof P]?: GetPropDefType<P[K]>
}

type PropDefValues<Def> = Def extends { values: readonly (infer V)[] } ? readonly V[] : never

const getPropDefValues = <Def extends { values: readonly unknown[] }>(def: Def): Def['values'] => def.values

// Minimal prop-def shapes used by runtime normalization helpers.
type EnumPropDefLike = { values: readonly string[]; default?: string }
type BooleanPropDefLike = { type: 'boolean'; default?: boolean }
type NormalizeEnumPropValueOptions = {
  /**
   * Defaults to false so generated/runtime inputs like " Soft " normalize to the
   * canonical prop-def value "soft". Set true only for deliberately case-sensitive
   * value lists.
   */
  caseSensitive?: boolean
}

function normalizeEnumPropValue<Def extends { values: readonly string[]; default: string }>(
  def: Def,
  value: unknown,
  options?: NormalizeEnumPropValueOptions,
): Def['values'][number]
function normalizeEnumPropValue<Def extends EnumPropDefLike>(
  def: Def,
  value: unknown,
  options?: NormalizeEnumPropValueOptions,
): Def['values'][number] | undefined
function normalizeEnumPropValue<Def extends EnumPropDefLike>(
  def: Def,
  value: unknown,
  options: NormalizeEnumPropValueOptions = {},
): Def['values'][number] | undefined {
  if (typeof value !== 'string') return def.default as Def['values'][number] | undefined
  const normalized = value.trim()
  if (def.values.includes(normalized)) return normalized as Def['values'][number]
  if (options.caseSensitive) return def.default as Def['values'][number] | undefined

  const normalizedCase = normalized.toLowerCase()
  const match = def.values.find(item => item.toLowerCase() === normalizedCase)
  if (match) return match as Def['values'][number]

  return def.default as Def['values'][number] | undefined
}

/**
 * Normalizes runtime boolean prop values from authored or generated sources.
 * Booleans pass through, strings "true" and "false" are accepted after trimming
 * and case normalization, and every other value falls back to the prop-def default.
 */
function normalizeBooleanPropValue<Def extends { type: 'boolean'; default: boolean }>(def: Def, value: unknown): boolean
function normalizeBooleanPropValue<Def extends BooleanPropDefLike>(def: Def, value: unknown): boolean | undefined
function normalizeBooleanPropValue<Def extends BooleanPropDefLike>(def: Def, value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true') return true
    if (normalized === 'false') return false
  }

  return def.default
}

export type {
  //
  Breakpoint,
  GetPropDefTypes,
  PropDef,
  PropDefValues,
  Responsive,
  ResponsivePropDef,
  Union,
}
export { breakpoints, breakpointsArray, getPropDefValues, normalizeBooleanPropValue, normalizeEnumPropValue }
