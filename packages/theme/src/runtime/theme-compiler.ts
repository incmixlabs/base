import type { ThemeContract } from '../contract/theme-contract.js'
import { toKebabCase } from '../string.js'

type Primitive = string | number | boolean | null | undefined

export type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : { [K in keyof T]?: DeepPartial<T[K]> }

export interface CompiledThemeTokens {
  cssVars: Record<string, string>
  tokenMap: Record<string, string>
}

function isObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function cloneRecursive<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => cloneRecursive(item)) as T
  }

  if (!isObject(value)) {
    return value
  }

  const clone = Object.create(Object.getPrototypeOf(value)) as Record<PropertyKey, unknown>
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (!descriptor) continue

    if ('value' in descriptor) {
      Object.defineProperty(clone, key, {
        ...descriptor,
        value: cloneRecursive(descriptor.value),
      })
      continue
    }

    Object.defineProperty(clone, key, descriptor)
  }

  return clone as T
}

function cloneObject<T>(value: T): T {
  return cloneRecursive(value)
}

const BLOCKED_MERGE_KEYS = new Set(['__proto__', 'prototype', 'constructor'])

function deepMergeObject<T extends Record<string, unknown>>(target: T, patch: Record<string, unknown>): T {
  const next: Record<string, unknown> = { ...target }

  for (const [key, value] of Object.entries(patch)) {
    if (BLOCKED_MERGE_KEYS.has(key)) {
      continue
    }

    if (value === undefined) {
      continue
    }

    const prev = next[key]
    if (isObject(prev) && isObject(value)) {
      next[key] = deepMergeObject(prev, value)
      continue
    }

    next[key] = cloneObject(value)
  }

  return next as T
}

export function mergeThemeContracts(
  base: ThemeContract,
  ...overrides: Array<DeepPartial<ThemeContract> | undefined>
): ThemeContract {
  const { metadata: baseMetadata, ...baseTokenBranches } = base
  let mergedTokenBranches = cloneObject(baseTokenBranches)

  for (const patch of overrides) {
    if (!patch || !isObject(patch)) {
      continue
    }

    const { metadata: _ignored, ...tokenPatch } = patch as Record<string, unknown>
    mergedTokenBranches = deepMergeObject(mergedTokenBranches, tokenPatch)
  }

  return { ...mergedTokenBranches, metadata: cloneObject(baseMetadata) } as ThemeContract
}

/**
 * Canonical token-path -> CSS variable naming.
 *
 * Mappings used by runtime + editor preview:
 * - `global.fontWeight.*` -> `--font-weight-*` (e.g. `global.fontWeight.bold` -> `--font-weight-bold`)
 * - `global.borderRadius.*` -> `--radius-*` (e.g. `global.borderRadius.md` -> `--radius-md`)
 * - `global.spacing.*` -> `--space-*` (e.g. `global.spacing.4` -> `--space-4`)
 * - `global.breakpoint.*` -> `--breakpoint-*` (e.g. `global.breakpoint.lg` -> `--breakpoint-lg`)
 * - `global.typography.*` -> `--*` (e.g. `global.typography.fontSans` -> `--font-sans`)
 * - `global.color.hue.*` -> `--color-*` (e.g. `global.color.hue.teal.9` -> `--color-teal-9`)
 * - `semantic.color.*` -> `--color-*` (e.g. `semantic.color.primary.text` -> `--color-primary-text`)
 * - `component.*` -> `--component-*` (e.g. `component.button.solid.borderRadius` -> `--component-button-solid-border-radius`)
 *
 * Reference: docs/issues/theme-token-taxonomy-v1.md (Issue #234) and W3C DTCG format.
 */
function buildCssVarName(path: string): string {
  const segments = path.split('.')
  if (segments.length === 0) {
    return '--token'
  }

  if (segments[0] === 'global') {
    const [, domain, ...rest] = segments
    const suffix = rest.map(toKebabCase).join('-')

    if (domain === 'fontWeight') return suffix ? `--font-weight-${suffix}` : '--font-weight'
    if (domain === 'borderRadius') return suffix ? `--radius-${suffix}` : '--radius'
    if (domain === 'spacing') return suffix ? `--space-${suffix}` : '--space'
    if (domain === 'breakpoint') return suffix ? `--breakpoint-${suffix}` : '--breakpoint'
    if (domain === 'typography') {
      return suffix ? `--${suffix}` : '--typography'
    }
    if (domain === 'color' && rest[0] === 'hue') {
      const colorSuffix = rest.slice(1).map(toKebabCase).join('-')
      return colorSuffix ? `--color-${colorSuffix}` : '--color'
    }

    return suffix ? `--${domain}-${suffix}` : `--${domain}`
  }

  if (segments[0] === 'semantic' && segments[1] === 'color') {
    return `--color-${segments.slice(2).map(toKebabCase).join('-')}`
  }

  if (segments[0] === 'component') {
    return `--component-${segments.slice(1).map(toKebabCase).join('-')}`
  }

  return `--${segments.map(toKebabCase).join('-')}`
}

function collectStringLeaves(value: unknown, prefix: string, out: Record<string, string>) {
  if (typeof value === 'string') {
    out[prefix] = value
    return
  }

  if (!isObject(value)) {
    return
  }

  for (const [key, child] of Object.entries(value)) {
    const next = prefix ? `${prefix}.${key}` : key
    collectStringLeaves(child, next, out)
  }
}

export function compileThemeTokens(theme: ThemeContract): CompiledThemeTokens {
  const tokenMap: Record<string, string> = {}
  const cssVars: Record<string, string> = {}
  const cssVarSourcePath: Record<string, string> = {}

  collectStringLeaves(theme.global, 'global', tokenMap)
  collectStringLeaves(theme.semantic, 'semantic', tokenMap)
  collectStringLeaves(theme.component, 'component', tokenMap)

  for (const [path, value] of Object.entries(tokenMap)) {
    const varName = buildCssVarName(path)
    const existingPath = cssVarSourcePath[varName]
    if (existingPath && existingPath !== path) {
      throw new Error(`Token collision: "${path}" and "${existingPath}" both compile to "${varName}"`)
    }

    cssVarSourcePath[varName] = path
    cssVars[varName] = value
  }

  return { cssVars, tokenMap }
}
