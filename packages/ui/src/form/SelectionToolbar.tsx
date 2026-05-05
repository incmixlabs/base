'use client'

import { Bold, Code, Heading, Italic, Link, List, ListOrdered, Quote, Strikethrough } from 'lucide-react'
import * as React from 'react'
import { FloatingToolbar, type FloatingToolbarAction } from './FloatingToolbar'
import { useTextareaSelection } from './useTextareaSelection'

// ── Textarea formatting types ──

export interface FormatContext {
  /** Full textarea value */
  value: string
  /** Start of selection */
  selectionStart: number
  /** End of selection */
  selectionEnd: number
  /** The selected text */
  selectedText: string
}

export interface FormatResult {
  /** New full value */
  value: string
  /** New selection start (to re-select the formatted text) */
  selectionStart: number
  /** New selection end */
  selectionEnd: number
}

export interface ToolbarAction extends FloatingToolbarAction {
  /** Apply the formatting to the selected text and return the new value + cursor position */
  apply: (ctx: FormatContext) => FormatResult
  /** Returns true if this format is currently active around the selection */
  isActive?: (ctx: FormatContext) => boolean
}

// ── Built-in formatting helpers ──

/** Wrap selection with prefix/suffix. If already wrapped, unwrap. */
function wrapToggle(ctx: FormatContext, prefix: string, suffix: string): FormatResult {
  const { value, selectionStart, selectionEnd, selectedText } = ctx

  const before = value.slice(Math.max(0, selectionStart - prefix.length), selectionStart)
  const after = value.slice(selectionEnd, selectionEnd + suffix.length)

  if (before === prefix && after === suffix) {
    const newValue =
      value.slice(0, selectionStart - prefix.length) + selectedText + value.slice(selectionEnd + suffix.length)
    return {
      value: newValue,
      selectionStart: selectionStart - prefix.length,
      selectionEnd: selectionEnd - prefix.length,
    }
  }

  const newValue = value.slice(0, selectionStart) + prefix + selectedText + suffix + value.slice(selectionEnd)
  return {
    value: newValue,
    selectionStart: selectionStart + prefix.length,
    selectionEnd: selectionEnd + prefix.length,
  }
}

/** Prefix each line of selection. Toggle off if all lines already prefixed. */
function linePrefixToggle(ctx: FormatContext, prefix: string): FormatResult {
  const { value, selectionStart, selectionEnd } = ctx

  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
  const lineEnd = value.indexOf('\n', selectionEnd)
  const effectiveEnd = lineEnd === -1 ? value.length : lineEnd

  const lines = value.slice(lineStart, effectiveEnd).split('\n')
  const allPrefixed = lines.every(line => line.startsWith(prefix))

  const newLines = allPrefixed ? lines.map(line => line.slice(prefix.length)) : lines.map(line => prefix + line)

  const replacement = newLines.join('\n')
  const newValue = value.slice(0, lineStart) + replacement + value.slice(effectiveEnd)
  const delta = replacement.length - (effectiveEnd - lineStart)

  return {
    value: newValue,
    selectionStart: lineStart,
    selectionEnd: effectiveEnd + delta,
  }
}

// ── Asterisk-aware toggle for bold/italic composition ──

/** Count consecutive `*` immediately before or after the given position. */
function countAsterisks(value: string, position: number, direction: 'before' | 'after'): number {
  let count = 0
  if (direction === 'before') {
    for (let i = position - 1; i >= 0 && value[i] === '*'; i--) count++
  } else {
    for (let i = position; i < value.length && value[i] === '*'; i++) count++
  }
  return count
}

/**
 * Toggle `count` asterisks (1 = italic, 2 = bold) around the selection.
 * Correctly composes: applying italic to `**text**` yields `***text***`,
 * and removing italic from `***text***` yields `**text**`.
 */
function asteriskToggle(ctx: FormatContext, count: 1 | 2): FormatResult {
  const { value, selectionStart, selectionEnd, selectedText } = ctx

  const beforeCount = countAsterisks(value, selectionStart, 'before')
  const afterCount = countAsterisks(value, selectionEnd, 'after')
  const effective = Math.min(beforeCount, afterCount)

  // Italic (1) is active when there is an unpaired * (effective 1 or ≥3)
  // Bold (2) is active when effective ≥ 2
  const isActive = count === 1 ? effective === 1 || effective >= 3 : effective >= 2

  if (isActive) {
    // Remove `count` asterisks from each side
    const keepBefore = beforeCount - count
    const keepAfter = afterCount - count
    const newValue =
      value.slice(0, selectionStart - beforeCount) +
      '*'.repeat(keepBefore) +
      selectedText +
      '*'.repeat(keepAfter) +
      value.slice(selectionEnd + afterCount)
    return {
      value: newValue,
      selectionStart: selectionStart - count,
      selectionEnd: selectionEnd - count,
    }
  }

  // Add `count` asterisks to each side
  const marker = '*'.repeat(count)
  const newValue = value.slice(0, selectionStart) + marker + selectedText + marker + value.slice(selectionEnd)
  return {
    value: newValue,
    selectionStart: selectionStart + count,
    selectionEnd: selectionEnd + count,
  }
}

/** Detect whether `count` asterisks (1 = italic, 2 = bold) are active around the selection. */
function isAsteriskActive(ctx: FormatContext, count: 1 | 2): boolean {
  const beforeCount = countAsterisks(ctx.value, ctx.selectionStart, 'before')
  const afterCount = countAsterisks(ctx.value, ctx.selectionEnd, 'after')
  const effective = Math.min(beforeCount, afterCount)
  return count === 1 ? effective === 1 || effective >= 3 : effective >= 2
}

// ── Block prefix helpers (exclusive group) ──

/** All known block prefixes. When applying one, the others must be stripped first. */
const BLOCK_PREFIXES = ['## ', '> ', '- ']
const BLOCK_NUMBERED_RE = /^\d+\.\s/

/** Strip any existing block prefix from each line in the selection range. */
function stripBlockPrefixes(ctx: FormatContext): FormatContext {
  const { value, selectionStart, selectionEnd } = ctx
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
  const lineEnd = value.indexOf('\n', selectionEnd)
  const effectiveEnd = lineEnd === -1 ? value.length : lineEnd

  const lines = value.slice(lineStart, effectiveEnd).split('\n')
  const newLines = lines.map(line => {
    for (const prefix of BLOCK_PREFIXES) {
      if (line.startsWith(prefix)) return line.slice(prefix.length)
    }
    if (BLOCK_NUMBERED_RE.test(line)) return line.replace(BLOCK_NUMBERED_RE, '')
    return line
  })

  const replacement = newLines.join('\n')
  const newValue = value.slice(0, lineStart) + replacement + value.slice(effectiveEnd)
  const delta = replacement.length - (effectiveEnd - lineStart)

  return {
    value: newValue,
    selectionStart: lineStart,
    selectionEnd: effectiveEnd + delta,
    selectedText: newValue.slice(lineStart, effectiveEnd + delta),
  }
}

// ── Active-state detection helpers ──

/** Check if selection is wrapped with prefix/suffix */
function isWrapped(ctx: FormatContext, prefix: string, suffix: string): boolean {
  const { value, selectionStart, selectionEnd } = ctx
  const before = value.slice(Math.max(0, selectionStart - prefix.length), selectionStart)
  const after = value.slice(selectionEnd, selectionEnd + suffix.length)
  return before === prefix && after === suffix
}

/** Check if all selected lines start with the given prefix */
function isLinePrefixed(ctx: FormatContext, prefix: string): boolean {
  const { value, selectionStart, selectionEnd } = ctx
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
  const lineEnd = value.indexOf('\n', selectionEnd)
  const effectiveEnd = lineEnd === -1 ? value.length : lineEnd
  const lines = value.slice(lineStart, effectiveEnd).split('\n')
  return lines.length > 0 && lines.every(line => line.startsWith(prefix))
}

// ── Default markdown toolbar actions ──

const ICON_SIZE = 15

export const defaultToolbarActions: ToolbarAction[] = [
  {
    id: 'bold',
    icon: <Bold size={ICON_SIZE} />,
    label: 'Bold',
    group: 'inline',
    apply: ctx => asteriskToggle(ctx, 2),
    isActive: ctx => isAsteriskActive(ctx, 2),
  },
  {
    id: 'italic',
    icon: <Italic size={ICON_SIZE} />,
    label: 'Italic',
    group: 'inline',
    apply: ctx => asteriskToggle(ctx, 1),
    isActive: ctx => isAsteriskActive(ctx, 1),
  },
  {
    id: 'strikethrough',
    icon: <Strikethrough size={ICON_SIZE} />,
    label: 'Strikethrough',
    group: 'inline',
    apply: ctx => wrapToggle(ctx, '~~', '~~'),
    isActive: ctx => isWrapped(ctx, '~~', '~~'),
  },
  {
    id: 'code',
    icon: <Code size={ICON_SIZE} />,
    label: 'Inline code',
    group: 'inline',
    apply: ctx => wrapToggle(ctx, '`', '`'),
    isActive: ctx => isWrapped(ctx, '`', '`'),
  },
  {
    id: 'heading',
    icon: <Heading size={ICON_SIZE} />,
    label: 'Heading',
    group: 'block',
    exclusive: true,
    apply: ctx => {
      if (isLinePrefixed(ctx, '## ')) return linePrefixToggle(ctx, '## ')
      return linePrefixToggle(stripBlockPrefixes(ctx), '## ')
    },
    isActive: ctx => isLinePrefixed(ctx, '## '),
  },
  {
    id: 'quote',
    icon: <Quote size={ICON_SIZE} />,
    label: 'Quote',
    group: 'block',
    exclusive: true,
    apply: ctx => {
      if (isLinePrefixed(ctx, '> ')) return linePrefixToggle(ctx, '> ')
      return linePrefixToggle(stripBlockPrefixes(ctx), '> ')
    },
    isActive: ctx => isLinePrefixed(ctx, '> '),
  },
  {
    id: 'unordered-list',
    icon: <List size={ICON_SIZE} />,
    label: 'Bullet list',
    group: 'block',
    exclusive: true,
    apply: ctx => {
      if (isLinePrefixed(ctx, '- ')) return linePrefixToggle(ctx, '- ')
      return linePrefixToggle(stripBlockPrefixes(ctx), '- ')
    },
    isActive: ctx => isLinePrefixed(ctx, '- '),
  },
  {
    id: 'ordered-list',
    icon: <ListOrdered size={ICON_SIZE} />,
    label: 'Numbered list',
    group: 'block',
    exclusive: true,
    apply: ctx => {
      const isActive = (() => {
        const { value, selectionStart, selectionEnd } = ctx
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
        const lineEnd = value.indexOf('\n', selectionEnd)
        const effectiveEnd = lineEnd === -1 ? value.length : lineEnd
        const lines = value.slice(lineStart, effectiveEnd).split('\n')
        return lines.length > 0 && lines.every(line => /^\d+\.\s/.test(line))
      })()

      const effective = isActive ? ctx : stripBlockPrefixes(ctx)
      const { value, selectionStart, selectionEnd } = effective
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
      const lineEnd = value.indexOf('\n', selectionEnd)
      const effectiveEnd = lineEnd === -1 ? value.length : lineEnd
      const lines = value.slice(lineStart, effectiveEnd).split('\n')

      const allNumbered = lines.every(line => /^\d+\.\s/.test(line))
      const newLines = allNumbered
        ? lines.map(line => line.replace(/^\d+\.\s/, ''))
        : lines.map((line, i) => `${i + 1}. ${line}`)

      const replacement = newLines.join('\n')
      const newValue = value.slice(0, lineStart) + replacement + value.slice(effectiveEnd)
      const delta = replacement.length - (effectiveEnd - lineStart)

      return { value: newValue, selectionStart: lineStart, selectionEnd: effectiveEnd + delta }
    },
    isActive: ctx => {
      const { value, selectionStart, selectionEnd } = ctx
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
      const lineEnd = value.indexOf('\n', selectionEnd)
      const effectiveEnd = lineEnd === -1 ? value.length : lineEnd
      const lines = value.slice(lineStart, effectiveEnd).split('\n')
      return lines.length > 0 && lines.every(line => /^\d+\.\s/.test(line))
    },
  },
  {
    id: 'link',
    icon: <Link size={ICON_SIZE} />,
    label: 'Link',
    group: 'link',
    apply: ctx => {
      const { value, selectionStart, selectionEnd, selectedText } = ctx

      // Toggle off when selection is inside an existing markdown link: [text](url)
      const openBracket = value.lastIndexOf('[', selectionStart)
      const closeText = openBracket === -1 ? -1 : value.indexOf('](', openBracket)
      const closeParen = closeText === -1 ? -1 : value.indexOf(')', closeText + 2)

      if (openBracket !== -1 && closeText !== -1 && closeParen !== -1 && selectionEnd <= closeParen) {
        const textStart = openBracket + 1
        const textEnd = closeText
        const urlStart = closeText + 2
        const urlEnd = closeParen
        const isWithinLink =
          (selectionStart >= textStart && selectionEnd <= textEnd) ||
          (selectionStart >= urlStart && selectionEnd <= urlEnd) ||
          (selectionStart === openBracket && selectionEnd === closeParen + 1)

        if (isWithinLink) {
          const linkText = value.slice(textStart, textEnd)
          const newValue = value.slice(0, openBracket) + linkText + value.slice(closeParen + 1)
          return {
            value: newValue,
            selectionStart: openBracket,
            selectionEnd: openBracket + linkText.length,
          }
        }
      }

      const linkText = selectedText || 'link text'
      const replacement = `[${linkText}](url)`
      const newValue = value.slice(0, selectionStart) + replacement + value.slice(selectionEnd)
      const urlStart = selectionStart + linkText.length + 3
      return { value: newValue, selectionStart: urlStart, selectionEnd: urlStart + 3 }
    },
    isActive: ctx => {
      const { value, selectionStart, selectionEnd } = ctx
      const openBracket = value.lastIndexOf('[', selectionStart)
      if (openBracket === -1) return false
      const closeText = value.indexOf('](', openBracket)
      if (closeText === -1) return false
      const closeParen = value.indexOf(')', closeText + 2)
      if (closeParen === -1 || selectionEnd > closeParen + 1) return false
      return selectionStart >= openBracket && selectionEnd <= closeParen + 1
    },
  },
]

// ── SelectionToolbar — textarea-specific composition ──

export interface SelectionToolbarProps {
  /** Reference to the textarea element */
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  /** Reference to a hidden mirror div for position calculation (optional — creates one internally if not provided) */
  mirrorRef?: React.RefObject<HTMLDivElement | null>
  /** Current textarea value */
  value: string
  /** Callback when value changes due to formatting */
  onValueChange: (value: string) => void
  /** Custom toolbar actions (defaults to markdown formatting) */
  actions?: ToolbarAction[]
  /** Additional className for the toolbar */
  className?: string
}

export function SelectionToolbar({
  textareaRef,
  mirrorRef: mirrorRefProp,
  value,
  onValueChange,
  actions = defaultToolbarActions,
  className,
}: SelectionToolbarProps) {
  const { hasSelection, selection, selectionRect, toolbarRef, mirrorRef } = useTextareaSelection(
    textareaRef,
    mirrorRefProp,
  )

  // After a toolbar action, the controlled value change resets the browser selection.
  // We store the expected selection so activeValues computes correctly and the toolbar
  // stays open during the transition until the real selection is restored.
  const [pending, setPending] = React.useState<{ value: string; start: number; end: number } | null>(null)
  const [lastRect, setLastRect] = React.useState<typeof selectionRect>(null)

  // Remember the last valid selection rect so toolbar doesn't jump/disappear during action
  React.useEffect(() => {
    if (selectionRect) {
      setLastRect(selectionRect)
    }
  }, [selectionRect])

  // Compute active values from the current selection context
  const activeValues = React.useMemo(() => {
    // Use pending selection when value matches (after a toolbar action, before real selection restores)
    if (pending && pending.value === value) {
      const ctx: FormatContext = {
        value: pending.value,
        selectionStart: pending.start,
        selectionEnd: pending.end,
        selectedText: value.slice(pending.start, pending.end),
      }
      return actions.filter(action => action.isActive?.(ctx)).map(action => action.id)
    }
    if (!selection) return []
    const ctx: FormatContext = {
      value,
      selectionStart: selection.start,
      selectionEnd: selection.end,
      selectedText: selection.text,
    }
    return actions.filter(action => action.isActive?.(ctx)).map(action => action.id)
  }, [actions, selection, value, pending])

  const handleAction = React.useCallback(
    (action: FloatingToolbarAction) => {
      const textarea = textareaRef.current
      const toolbarAction = action as ToolbarAction
      if (!textarea || !selection || !toolbarAction.apply) return

      const ctx: FormatContext = {
        value,
        selectionStart: selection.start,
        selectionEnd: selection.end,
        selectedText: selection.text,
      }

      const result = toolbarAction.apply(ctx)

      // Store expected selection so the next render computes correct activeValues
      setPending({ value: result.value, start: result.selectionStart, end: result.selectionEnd })

      onValueChange(result.value)

      requestAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(result.selectionStart, result.selectionEnd)
        // Clear pending once real selection is restored
        setPending(null)
      })
    },
    [textareaRef, selection, value, onValueChange],
  )

  // Toolbar stays open when there's a pending action (selection temporarily lost during value change)
  const isOpen = hasSelection || pending !== null
  const effectiveRect = selectionRect ?? lastRect

  return (
    <>
      {!mirrorRefProp && (
        <div ref={mirrorRef} aria-hidden="true" className="pointer-events-none absolute inset-0 invisible" />
      )}
      <FloatingToolbar
        open={isOpen}
        selectionRect={effectiveRect}
        actions={actions}
        onAction={handleAction}
        activeValues={activeValues}
        toolbarRef={toolbarRef}
        className={className}
      />
    </>
  )
}
