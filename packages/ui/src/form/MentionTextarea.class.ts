import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

export const mentionSuggestionBase =
  'fixed z-[9999] min-w-[var(--af-mention-textarea-suggestion-min-width,200px)] max-w-[var(--af-mention-textarea-suggestion-max-width,300px)] rounded-md border border-neutral bg-neutral-surface text-[length:var(--af-mention-textarea-suggestion-font-size,0.875rem)] text-neutral shadow-lg animate-in fade-in-0 zoom-in-95'

export const mentionSuggestionPosition = {
  above: 'animate-in slide-in-from-bottom-2',
  below: 'animate-in slide-in-from-top-2',
} as const

export const mentionSuggestionList = 'py-1'

export const mentionSuggestionEmpty =
  'px-[var(--af-mention-textarea-suggestion-empty-padding-inline,0.75rem)] py-[var(--af-mention-textarea-suggestion-empty-padding-block,0.5rem)] text-[length:var(--af-mention-textarea-suggestion-font-size,0.875rem)] text-muted'

export const mentionItemBase = 'flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors duration-150'

export const mentionItemHighlightColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, joinClass('bg-', color, '-soft text-', color)]),
) as Record<Color, string>

export const mentionDragOverlayBase = 'absolute inset-0 z-10 rounded-md border-2 border-dashed pointer-events-none'

export const mentionDragOverlayText = 'text-[length:var(--af-mention-textarea-drag-overlay-font-size,0.875rem)]'

export const mentionDragOverlayColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    joinClass('[border-color:', colorVar(color, 'solid'), '] bg-[', colorVar(color, 'solid-alpha'), ']'),
  ]),
) as Record<Color, string>

export const mentionPreviewBase =
  'min-h-[var(--af-mention-textarea-preview-min-height,80px)] rounded-md border border-neutral px-[var(--af-mention-textarea-preview-padding-inline,0.75rem)] py-[var(--af-mention-textarea-preview-padding-block,0.5rem)] text-[length:var(--af-mention-textarea-preview-font-size,0.875rem)]'

export const mentionPreviewEmpty = 'text-muted'

export const mentionTextareaClassNames = [
  mentionSuggestionBase,
  ...Object.values(mentionSuggestionPosition),
  mentionSuggestionList,
  mentionSuggestionEmpty,
  mentionItemBase,
  ...Object.values(mentionItemHighlightColorVariants),
  mentionDragOverlayBase,
  mentionDragOverlayText,
  ...Object.values(mentionDragOverlayColorVariants),
  mentionPreviewBase,
  mentionPreviewEmpty,
]
