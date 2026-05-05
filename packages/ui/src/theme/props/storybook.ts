import { getPropDefValues } from './prop-def'

type ControlType =
  | 'object'
  | 'boolean'
  | 'check'
  | 'inline-check'
  | 'radio'
  | 'inline-radio'
  | 'select'
  | 'multi-select'
  | 'number'
  | 'range'
  | 'file'
  | 'color'
  | 'date'
  | 'text'

type ArgType = {
  control?: { type: ControlType }
  options?: readonly unknown[]
  description?: string
  if?: ({ arg: string } | { global: string }) &
    ({ exists: boolean } | { truthy: boolean } | { eq: unknown } | { neq: unknown })
  table?: Record<string, unknown>
}

const selectArgType = <Def extends { values: readonly unknown[] }>(
  def: Def,
  overrides: Partial<ArgType> = {},
): ArgType => ({
  control: { type: 'select' },
  options: getPropDefValues(def),
  ...overrides,
})

const radioArgType = <Def extends { values: readonly unknown[] }>(
  def: Def,
  overrides: Partial<ArgType> = {},
): ArgType => ({
  control: { type: 'radio' },
  options: getPropDefValues(def),
  ...overrides,
})

export { radioArgType, selectArgType }
