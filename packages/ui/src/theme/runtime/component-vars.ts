import { toKebabCase } from '@incmix/theme'

function withFallback(cssVar: string, fallback: string): string {
  return `var(${cssVar}, ${fallback})`
}

export type AppShellLayoutTokenSlot =
  | 'bodyGridTemplateColumns'
  | 'bodyWithSecondaryGridTemplateColumns'
  | 'bodyWithSecondaryRightGridTemplateColumns'
export type AppShellContentTokenSlot = 'paddingInline' | 'paddingBlock' | 'paddingInlineDesktop' | 'paddingBlockDesktop'
export type ContentBodyTokenSlot = 'background' | 'foreground' | 'borderColor'

export function appShellLayoutVar(slot: AppShellLayoutTokenSlot, fallback: string): string {
  return withFallback(`--af-app-shell-layout-${toKebabCase(slot)}`, fallback)
}

export function appShellContentVar(slot: AppShellContentTokenSlot, fallback: string): string {
  return withFallback(`--af-app-shell-content-${toKebabCase(slot)}`, fallback)
}

export function contentBodyVar(slot: ContentBodyTokenSlot, fallback: string): string {
  return withFallback(`--af-content-body-${toKebabCase(slot)}`, fallback)
}
