import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

const toolbarButtonFocusClassName = (color: string) =>
  joinClass(
    'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-',
    color,
    '-highlight',
  )

export const floatingToolbarRoot =
  'fixed z-[9999] flex items-center gap-0.5 rounded-lg border border-neutral bg-neutral-surface px-1 py-1 text-neutral shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2'

export const floatingToolbarButtonBase =
  'flex items-center justify-center rounded-md bg-transparent p-1.5 transition-colors duration-150'

export const toolbarButtonColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    [
      joinClass('text-', color),
      joinClass('enabled:hover:bg-', color, '-soft'),
      joinClass('enabled:active:bg-[', colorVar(color, 'soft-hover'), ']'),
      toolbarButtonFocusClassName(color),
    ].join(' '),
  ]),
) as Record<Color, string>

export const toolbarButtonActiveVariants = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    [
      joinClass('bg-', color, '-soft'),
      joinClass('text-', color),
      joinClass('enabled:hover:bg-[', colorVar(color, 'soft-hover'), ']'),
      toolbarButtonFocusClassName(color),
    ].join(' '),
  ]),
) as Record<Color, string>

export const toolbarSeparatorCls = 'bg-neutral-border'

export const floatingToolbarClassNames = [
  floatingToolbarRoot,
  floatingToolbarButtonBase,
  ...Object.values(toolbarButtonColorVariants),
  ...Object.values(toolbarButtonActiveVariants),
  toolbarSeparatorCls,
]
