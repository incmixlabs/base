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

const normalizeEnumPropValue = <Def extends { values: readonly string[]; default?: string }>(
  def: Def,
  value: unknown,
): Def['values'][number] | undefined => {
  if (typeof value !== 'string') return def.default as Def['values'][number] | undefined
  const normalized = value.trim()
  if (def.values.includes(normalized)) return normalized as Def['values'][number]
  return def.default as Def['values'][number] | undefined
}

export { breakpointsArray, breakpoints }
export type {
  PropDef,
  GetPropDefTypes,
  ResponsivePropDef,
  PropDefValues,
  //
  Breakpoint,
  Responsive,
  Union,
}
export { getPropDefValues, normalizeEnumPropValue }
