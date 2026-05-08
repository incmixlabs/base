'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Tabs } from '@/elements'
import type { AvatarHoverCardData } from '@/elements/avatar/Avatar'
import { Row } from '@/layouts/flex/Flex'
import { isActivationKey, KEYBOARD_KEYS } from '@/lib/keyboard-keys'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { mentionTextareaVar } from '@/theme/runtime/component-vars'
import type { Color } from '@/theme/tokens'
import { Text } from '@/typography'
import { mentionDragOverlayColorVariants, mentionItemHighlightColorVariants } from './MentionTextarea.css'
import {
  getStructuredMentionTokens,
  MentionMarkdownPreview,
  type MentionReferenceSource,
  serializeMentionToken,
} from './mention-markdown'
import { SelectionToolbar, type ToolbarAction } from './SelectionToolbar'
import { Textarea, type TextareaProps } from './Textarea'

function serializeMention(trigger: string, item: MentionItem): string {
  const reference = item.value ?? item.id
  return serializeMentionToken(trigger, item.label, reference)
}

type EditorSegment = {
  kind: 'text' | 'mention'
  displayText: string
  serializedText: string
  displayStart: number
  displayEnd: number
  serializedStart: number
  serializedEnd: number
}

type MentionEditorState = {
  displayValue: string
  segments: EditorSegment[]
}

function buildMentionEditorState(value: string, triggerChars: string[]): MentionEditorState {
  const tokens = getStructuredMentionTokens(value, triggerChars)
  const segments: EditorSegment[] = []
  let displayValue = ''
  let displayCursor = 0
  let serializedCursor = 0

  for (const token of tokens) {
    if (token.start > serializedCursor) {
      const text = value.slice(serializedCursor, token.start)
      segments.push({
        kind: 'text',
        displayText: text,
        serializedText: text,
        displayStart: displayCursor,
        displayEnd: displayCursor + text.length,
        serializedStart: serializedCursor,
        serializedEnd: token.start,
      })
      displayValue += text
      displayCursor += text.length
    }

    segments.push({
      kind: 'mention',
      displayText: token.displayText,
      serializedText: token.serializedText,
      displayStart: displayCursor,
      displayEnd: displayCursor + token.displayText.length,
      serializedStart: token.start,
      serializedEnd: token.end,
    })
    displayValue += token.displayText
    displayCursor += token.displayText.length
    serializedCursor = token.end
  }

  if (serializedCursor < value.length) {
    const text = value.slice(serializedCursor)
    segments.push({
      kind: 'text',
      displayText: text,
      serializedText: text,
      displayStart: displayCursor,
      displayEnd: displayCursor + text.length,
      serializedStart: serializedCursor,
      serializedEnd: value.length,
    })
    displayValue += text
  }

  return { displayValue, segments }
}

function findMentionSegmentAtDisplayIndex(segments: EditorSegment[], index: number): EditorSegment | undefined {
  return segments.find(
    segment => segment.kind === 'mention' && index > segment.displayStart && index < segment.displayEnd,
  )
}

const MENTION_SUGGESTION_MAX_WIDTH_FALLBACK_PX = 300

function mapDisplayIndexToSerializedIndex(state: MentionEditorState, index: number): number {
  for (const segment of state.segments) {
    if (index < segment.displayStart) return segment.serializedStart
    if (index === segment.displayStart) return segment.serializedStart
    if (index === segment.displayEnd) return segment.serializedEnd
    if (index > segment.displayStart && index < segment.displayEnd) {
      if (segment.kind === 'mention') {
        return segment.serializedEnd
      }

      return segment.serializedStart + (index - segment.displayStart)
    }
  }

  const lastSegment = state.segments[state.segments.length - 1]
  return lastSegment?.serializedEnd ?? 0
}

function applyDisplayValueChange(serializedValue: string, state: MentionEditorState, nextDisplayValue: string): string {
  const previousDisplayValue = state.displayValue
  let prefixLength = 0
  while (
    prefixLength < previousDisplayValue.length &&
    prefixLength < nextDisplayValue.length &&
    previousDisplayValue[prefixLength] === nextDisplayValue[prefixLength]
  ) {
    prefixLength += 1
  }

  let suffixLength = 0
  while (
    suffixLength < previousDisplayValue.length - prefixLength &&
    suffixLength < nextDisplayValue.length - prefixLength &&
    previousDisplayValue[previousDisplayValue.length - 1 - suffixLength] ===
      nextDisplayValue[nextDisplayValue.length - 1 - suffixLength]
  ) {
    suffixLength += 1
  }

  let previousStart = prefixLength
  let previousEnd = previousDisplayValue.length - suffixLength
  const nextEnd = nextDisplayValue.length - suffixLength

  const startMention = findMentionSegmentAtDisplayIndex(state.segments, previousStart)
  if (startMention) previousStart = startMention.displayStart

  const endMention = findMentionSegmentAtDisplayIndex(state.segments, previousEnd)
  if (endMention) previousEnd = endMention.displayEnd

  const serializedStart = mapDisplayIndexToSerializedIndex(state, previousStart)
  const serializedEnd = mapDisplayIndexToSerializedIndex(state, previousEnd)
  const replacement = nextDisplayValue.slice(previousStart, nextEnd)

  return `${serializedValue.slice(0, serializedStart)}${replacement}${serializedValue.slice(serializedEnd)}`
}

function normalizeContiguousMentionDuplicates(serializedValue: string, triggerChars: string[]): string {
  const tokens = getStructuredMentionTokens(serializedValue, triggerChars)
  if (tokens.length === 0) return serializedValue

  let result = ''
  let cursor = 0
  let currentRunTokens: string[] = []
  let previousTokenEnd = 0
  let seenKeys = new Set<string>()

  const flushRun = () => {
    if (currentRunTokens.length === 0) return
    result += currentRunTokens.join(', ')
    currentRunTokens = []
    seenKeys = new Set<string>()
  }

  for (const token of tokens) {
    const interstitial = serializedValue.slice(cursor, token.start)
    const continuesRun = previousTokenEnd > 0 && /^[,\s]+$/.test(interstitial)
    if (!continuesRun) {
      flushRun()
      result += interstitial
    }

    const key = `${token.trigger}:${token.reference}`
    if (!seenKeys.has(key)) {
      currentRunTokens.push(token.serializedText)
      seenKeys.add(key)
    }

    cursor = token.end
    previousTokenEnd = token.end
  }

  flushRun()
  result += serializedValue.slice(cursor)
  return result
}

/**
 * Represents a mentionable item
 */
export interface MentionItem {
  /** Unique identifier */
  id: string
  /** Display label shown in the dropdown */
  label: string
  /** Optional stable reference serialized inside the mention token (defaults to id) */
  value?: string
  /** Optional icon or avatar */
  icon?: React.ReactNode
  /** Optional avatar image used for resolved user previews */
  avatar?: string
  /** Optional secondary text used in resolved preview hover cards */
  description?: string
  /** Optional hover-card override used in resolved preview */
  hoverCard?: boolean | AvatarHoverCardData
  /** Whether this item is disabled */
  disabled?: boolean
}

function buildMentionReferenceSources(triggers: TriggerConfig[]): MentionReferenceSource[] | undefined {
  const sources = triggers.flatMap(trigger =>
    trigger.items.map(item => ({
      reference: item.value ?? item.id,
      label: item.label,
      description: item.description,
      avatar: item.avatar,
      hoverCard: item.hoverCard,
      color: trigger.highlightColor,
    })),
  )

  return sources.length > 0 ? sources : undefined
}

/**
 * Props passed to a custom picker rendered by `renderPicker`.
 * The picker owns all selection logic; MentionTextArea only positions the portal.
 */
export interface PickerRenderProps {
  /** Confirm selection — inserts all items as mentions and closes */
  onConfirm: (items: MentionItem[]) => void
  /** Close the picker. Applies any pending selections reported via `onSelectionChange`.
   *  To close without applying, call `onSelectionChange([])` first. */
  onClose: () => void
  /** Report current selection changes. Called on every toggle.
   *  Pending selections are applied on close (including click-outside and Escape). */
  onSelectionChange: (items: MentionItem[]) => void
  /** The text typed after the trigger character, for pre-filtering the picker */
  searchTerm: string
}

/**
 * Configuration for a single trigger
 */
export interface TriggerConfig {
  /** The trigger character (e.g., "@", "#") */
  trigger: string
  /** List of mentionable items for this trigger */
  items: MentionItem[]
  /** Highlight color for this trigger's dropdown */
  highlightColor?: Color
  /**
   * Custom picker rendered in place of the default dropdown.
   * The picker handles all selection logic internally (search, multi-select, apply/cancel).
   * MentionTextArea only positions the portal and receives the final result via `onConfirm`.
   */
  renderPicker?: (props: PickerRenderProps) => React.ReactNode
}

export interface MentionTextareaProps extends Omit<TextareaProps, 'onChange'> {
  /** List of mentionable items (used with single trigger) */
  mentions?: MentionItem[]
  /** Trigger character (default: "@") - used with mentions prop */
  trigger?: string
  /** Multiple triggers configuration - overrides mentions/trigger props */
  triggers?: TriggerConfig[]
  /** Controlled value */
  value?: string
  /** Callback when value changes */
  onValueChange?: (value: string) => void
  /** Callback when a mention is selected */
  onMentionSelect?: (item: MentionItem, trigger: string) => void
  /** Custom render function for mention items */
  renderItem?: (item: MentionItem, isHighlighted: boolean, trigger: string) => React.ReactNode
  /** Maximum items to show in dropdown */
  maxItems?: number
  /** Placeholder when no matches */
  noMatchesText?: string
  /** Highlight color for dropdown items (default trigger) */
  highlightColor?: Color
  /** Enable selection toolbar for markdown formatting (select text to see toolbar) */
  toolbar?: boolean
  /** Custom toolbar actions (overrides default markdown actions) */
  toolbarActions?: ToolbarAction[]
  /** Show Write/Preview tabs for markdown preview (default: true) */
  preview?: boolean
  /** Handler for file uploads. When provided, enables drag-and-drop and paste for images.
   *  Should upload the file and return the URL string. */
  onFileUpload?: (file: File) => Promise<string>
}

/**
 * Textarea with @mention support.
 * Shows a dropdown when the trigger character is typed, allowing users to mention items.
 */
/** MentionTextarea export. */
export function MentionTextarea({
  mentions,
  trigger = '@',
  triggers: triggersProp,
  value: controlledValue,
  defaultValue,
  onValueChange,
  onMentionSelect,
  renderItem,
  maxItems = 5,
  noMatchesText = 'No matches found',
  highlightColor = SemanticColor.slate,
  toolbar = true,
  toolbarActions,
  preview = true,
  onFileUpload,
  color,
  error = false,
  className,
  ref,
  ...props
}: MentionTextareaProps & { ref?: React.Ref<HTMLTextAreaElement> }) {
  const [activeTab, setActiveTab] = React.useState<string>('write')
  const [internalValue, setInternalValue] = React.useState(() => (defaultValue == null ? '' : String(defaultValue)))
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [activeTrigger, setActiveTrigger] = React.useState<string | null>(null)

  // Normalize triggers - either from triggers prop or single trigger/mentions
  const triggers = React.useMemo<TriggerConfig[]>(() => {
    if (triggersProp && triggersProp.length > 0) {
      return triggersProp
    }
    if (mentions) {
      return [{ trigger, items: mentions, highlightColor }]
    }
    return []
  }, [triggersProp, mentions, trigger, highlightColor])
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)
  const [triggerPosition, setTriggerPosition] = React.useState<{
    top: number
    left: number
    showAbove?: boolean
  } | null>(null)

  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const mirrorRef = React.useRef<HTMLDivElement>(null)
  const animationFrameIdsRef = React.useRef<number[]>([])
  // Store cursor position when trigger is detected (before focus moves to picker)
  const triggerCursorRef = React.useRef<{ cursorPos: number; triggerIndex: number } | null>(null)
  // Track pending picker selections for auto-apply on click-outside
  const pendingPickerItemsRef = React.useRef<MentionItem[]>([])

  // Generate stable IDs for ARIA
  const listboxId = React.useId()
  const getOptionId = (index: number) => `${listboxId}-option-${index}`

  // Controlled/uncontrolled value handling
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue
  // Get all trigger characters for detection
  const triggerChars = React.useMemo(() => triggers.map(t => t.trigger), [triggers])
  const previewSources = React.useMemo(() => buildMentionReferenceSources(triggers), [triggers])
  const normalizedValue = React.useMemo(
    () => normalizeContiguousMentionDuplicates(value, triggerChars),
    [value, triggerChars],
  )
  const editorState = React.useMemo(
    () => buildMentionEditorState(normalizedValue, triggerChars),
    [normalizedValue, triggerChars],
  )
  const displayValue = editorState.displayValue
  const pendingSelectionRef = React.useRef<{ start: number; end: number } | null>(null)

  // ─── File upload state ────────────────────────────────────────────────────
  const [isDragOver, setIsDragOver] = React.useState(false)
  const uploadCounterRef = React.useRef(0)
  const dragCounterRef = React.useRef(0)
  const valueRef = React.useRef(normalizedValue)
  const onValueChangeRef = React.useRef(onValueChange)
  React.useLayoutEffect(() => {
    valueRef.current = normalizedValue
    onValueChangeRef.current = onValueChange
  })

  // Combine refs
  React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement)

  const scheduleAnimationFrame = React.useCallback((callback: () => void) => {
    const frameId = requestAnimationFrame(() => {
      animationFrameIdsRef.current = animationFrameIdsRef.current.filter(id => id !== frameId)
      callback()
    })

    animationFrameIdsRef.current.push(frameId)
    return frameId
  }, [])

  React.useEffect(() => {
    return () => {
      for (const frameId of animationFrameIdsRef.current) {
        cancelAnimationFrame(frameId)
      }
      animationFrameIdsRef.current = []
    }
  }, [])

  // Get active trigger config
  const activeTriggerConfig = React.useMemo(() => {
    return triggers.find(t => t.trigger === activeTrigger)
  }, [triggers, activeTrigger])

  React.useEffect(() => {
    if (normalizedValue === value) return

    if (!isControlled) {
      setInternalValue(normalizedValue)
      return
    }

    onValueChange?.(normalizedValue)
  }, [normalizedValue, value, isControlled, onValueChange])

  // Filter mentions based on search term and active trigger
  const filteredMentions = React.useMemo(() => {
    if (!activeTriggerConfig) return []
    const items = activeTriggerConfig.items
    if (!searchTerm) return items.slice(0, maxItems)
    const lower = searchTerm.toLowerCase()
    return items.filter(m => m.label.toLowerCase().includes(lower)).slice(0, maxItems)
  }, [activeTriggerConfig, searchTerm, maxItems])

  // Clamp highlightedIndex when filtered list shrinks
  React.useEffect(() => {
    if (highlightedIndex >= filteredMentions.length && filteredMentions.length > 0) {
      setHighlightedIndex(0)
    }
  }, [filteredMentions.length, highlightedIndex])

  // Calculate cursor position in textarea (viewport coordinates for portal)
  const calculateCursorPosition = React.useCallback(() => {
    const textarea = textareaRef.current
    const mirror = mirrorRef.current
    if (!textarea || !mirror) return null

    const cursorPos = textarea.selectionStart
    // Use textarea.value directly to avoid stale state during rapid typing
    const textBeforeCursor = textarea.value.slice(0, cursorPos)

    // Copy textarea styles to mirror
    const styles = window.getComputedStyle(textarea)
    mirror.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
        width: ${styles.width};
        font-family: ${styles.fontFamily};
        font-size: ${styles.fontSize};
        font-weight: ${styles.fontWeight};
        line-height: ${styles.lineHeight};
        padding: ${styles.padding};
        border: ${styles.border};
        box-sizing: ${styles.boxSizing};
      `

    // Create a span at cursor position
    mirror.innerHTML = ''
    const textNode = document.createTextNode(textBeforeCursor)
    const span = document.createElement('span')
    span.textContent = '\u200B' // Zero-width space
    mirror.appendChild(textNode)
    mirror.appendChild(span)

    const spanRect = span.getBoundingClientRect()

    // getBoundingClientRect() already returns viewport coordinates
    // No scroll offset adjustment needed for fixed positioning
    const spanTop = spanRect.top
    const spanBottom = spanRect.bottom
    const spanLeft = spanRect.left

    // Calculate position - check if dropdown should appear above or below
    const spaceBelow = window.innerHeight - spanBottom
    const dropdownHeight = 200 // Approximate max dropdown height
    const showAbove = spaceBelow < dropdownHeight && spanTop > dropdownHeight

    const dropdownWidth = dropdownRef.current?.offsetWidth ?? MENTION_SUGGESTION_MAX_WIDTH_FALLBACK_PX

    return {
      top: showAbove ? spanTop - dropdownHeight : spanBottom + 4,
      left: Math.max(8, Math.min(spanLeft, window.innerWidth - dropdownWidth - 8)),
      showAbove,
    }
  }, [])

  // Handle input change
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextDisplayValue = e.target.value
      const cursorPos = e.target.selectionStart
      const newValue = normalizeContiguousMentionDuplicates(
        applyDisplayValueChange(normalizedValue, editorState, nextDisplayValue),
        triggerChars,
      )

      pendingSelectionRef.current = {
        start: e.target.selectionStart,
        end: e.target.selectionEnd,
      }

      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)

      // Check for any trigger
      const textBeforeCursor = nextDisplayValue.slice(0, cursorPos)

      // Find the most recent valid trigger
      let foundTrigger: string | null = null
      let lastTriggerIndex = -1

      for (const triggerChar of triggerChars) {
        const idx = textBeforeCursor.lastIndexOf(triggerChar)
        if (idx > lastTriggerIndex) {
          // Check if trigger is at start or preceded by whitespace
          const charBefore = textBeforeCursor[idx - 1]
          const isValidTrigger = idx === 0 || (charBefore ? /\s/.test(charBefore) : true)

          if (isValidTrigger) {
            const textAfterTrigger = textBeforeCursor.slice(idx + triggerChar.length)
            // No spaces in mention search
            if (!/\s/.test(textAfterTrigger)) {
              foundTrigger = triggerChar
              lastTriggerIndex = idx
            }
          }
        }
      }

      if (foundTrigger && lastTriggerIndex !== -1) {
        const textAfterTrigger = textBeforeCursor.slice(lastTriggerIndex + foundTrigger.length)
        setSearchTerm(textAfterTrigger)
        setActiveTrigger(foundTrigger)
        setIsOpen(true)
        setHighlightedIndex(0)

        // Save cursor position so insertMentions works even after focus moves to picker
        triggerCursorRef.current = { cursorPos, triggerIndex: lastTriggerIndex }

        // Calculate position after state update
        scheduleAnimationFrame(() => {
          const pos = calculateCursorPosition()
          if (pos) setTriggerPosition(pos)
        })
        return
      }

      setIsOpen(false)
      setSearchTerm('')
      setActiveTrigger(null)
      triggerCursorRef.current = null
    },
    [
      triggerChars,
      isControlled,
      onValueChange,
      calculateCursorPosition,
      normalizedValue,
      editorState,
      scheduleAnimationFrame,
    ],
  )

  // Select a single mention (default dropdown behavior)
  const selectMention = React.useCallback(
    (item: MentionItem) => {
      if (item.disabled || !activeTrigger) return

      const textarea = textareaRef.current
      if (!textarea) return

      const cursorPos = textarea.selectionStart
      const textBeforeCursor = displayValue.slice(0, cursorPos)
      const lastTriggerIndex = textBeforeCursor.lastIndexOf(activeTrigger)

      // Guard against missing trigger (cursor moved away)
      if (lastTriggerIndex === -1) {
        setIsOpen(false)
        setSearchTerm('')
        setActiveTrigger(null)
        return
      }

      const mentionValue = serializeMention(activeTrigger, item)
      const serializedTriggerIndex = mapDisplayIndexToSerializedIndex(editorState, lastTriggerIndex)
      const serializedCursorPos = mapDisplayIndexToSerializedIndex(editorState, cursorPos)
      const newValue = normalizeContiguousMentionDuplicates(
        `${normalizedValue.slice(0, serializedTriggerIndex)}${mentionValue} ${normalizedValue.slice(serializedCursorPos)}`,
        triggerChars,
      )

      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
      onMentionSelect?.(item, activeTrigger)

      setIsOpen(false)
      setSearchTerm('')
      setActiveTrigger(null)

      // Move cursor after the mention
      const newCursorPos = lastTriggerIndex + `${activeTrigger}${item.label}`.length + 1
      scheduleAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      })
    },
    [
      normalizedValue,
      activeTrigger,
      isControlled,
      onValueChange,
      onMentionSelect,
      editorState,
      displayValue,
      triggerChars,
      scheduleAnimationFrame,
    ],
  )

  // Batch-insert multiple mentions (used by custom pickers via renderPicker)
  const insertMentions = React.useCallback(
    (items: MentionItem[], options?: { restoreFocus?: boolean }) => {
      if (!activeTrigger || items.length === 0) return

      const textarea = textareaRef.current
      if (!textarea) return

      // Use saved position (textarea may have lost focus when picker was interacted with)
      const saved = triggerCursorRef.current
      const cursorPos = saved?.cursorPos ?? textarea.selectionStart
      const lastTriggerIndex = saved?.triggerIndex ?? displayValue.slice(0, cursorPos).lastIndexOf(activeTrigger)
      if (lastTriggerIndex === -1) return

      const mentionText = items.map(item => serializeMention(activeTrigger, item)).join(', ')
      const displayMentionText = items.map(item => `${activeTrigger}${item.label}`).join(', ')
      const serializedTriggerIndex = mapDisplayIndexToSerializedIndex(editorState, lastTriggerIndex)
      const serializedCursorPos = mapDisplayIndexToSerializedIndex(editorState, cursorPos)

      const newValue = normalizeContiguousMentionDuplicates(
        `${normalizedValue.slice(0, serializedTriggerIndex)}${mentionText} ${normalizedValue.slice(serializedCursorPos)}`,
        triggerChars,
      )

      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
      for (const item of items) {
        onMentionSelect?.(item, activeTrigger)
      }

      setIsOpen(false)
      setSearchTerm('')
      setActiveTrigger(null)
      triggerCursorRef.current = null

      if (options?.restoreFocus !== false) {
        const newCursorPos = lastTriggerIndex + displayMentionText.length + 1
        scheduleAnimationFrame(() => {
          textarea.focus()
          textarea.setSelectionRange(newCursorPos, newCursorPos)
        })
      }
    },
    [
      normalizedValue,
      activeTrigger,
      isControlled,
      onValueChange,
      onMentionSelect,
      editorState,
      displayValue,
      triggerChars,
      scheduleAnimationFrame,
    ],
  )

  // Close picker without inserting (used by custom pickers)
  const closePicker = React.useCallback(
    (options?: { restoreFocus?: boolean }) => {
      setIsOpen(false)
      setSearchTerm('')
      setActiveTrigger(null)
      triggerCursorRef.current = null
      pendingPickerItemsRef.current = []
      if (options?.restoreFocus !== false) {
        scheduleAnimationFrame(() => {
          textareaRef.current?.focus()
        })
      }
    },
    [scheduleAnimationFrame],
  )

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!isOpen) return

      // When a custom picker is active, only handle Escape at the textarea level.
      // All other keyboard interaction (Enter, Tab, arrows) is owned by the picker.
      if (activeTriggerConfig?.renderPicker) {
        if (e.key === KEYBOARD_KEYS.escape) {
          e.preventDefault()
          if (pendingPickerItemsRef.current.length > 0) {
            const items = pendingPickerItemsRef.current
            pendingPickerItemsRef.current = []
            insertMentions(items)
          } else {
            closePicker()
          }
        }
        return
      }

      switch (e.key) {
        case KEYBOARD_KEYS.arrowDown:
          if (filteredMentions.length === 0) return
          e.preventDefault()
          setHighlightedIndex(i => (i + 1) % filteredMentions.length)
          break
        case KEYBOARD_KEYS.arrowUp:
          if (filteredMentions.length === 0) return
          e.preventDefault()
          setHighlightedIndex(i => (i - 1 + filteredMentions.length) % filteredMentions.length)
          break
        case KEYBOARD_KEYS.enter:
        case KEYBOARD_KEYS.tab:
          if (filteredMentions.length > 0) {
            e.preventDefault()
            const selected = filteredMentions[highlightedIndex]
            if (selected) {
              selectMention(selected)
            }
          }
          break
        case KEYBOARD_KEYS.escape:
          e.preventDefault()
          closePicker()
          break
      }
    },
    [isOpen, activeTriggerConfig, filteredMentions, highlightedIndex, selectMention, closePicker, insertMentions],
  )

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: PointerEvent) => {
      const clickedInDropdown = dropdownRef.current?.contains(e.target as Node)
      if (clickedInDropdown) return

      // When using a custom picker, close on any click outside the dropdown
      // Auto-apply pending selections if any
      if (activeTriggerConfig?.renderPicker) {
        if (pendingPickerItemsRef.current.length > 0) {
          insertMentions(pendingPickerItemsRef.current, { restoreFocus: false })
          pendingPickerItemsRef.current = []
        } else {
          closePicker({ restoreFocus: false })
        }
        return
      }

      // Default dropdown: close when clicking outside both dropdown and textarea
      const clickedInTextarea = textareaRef.current?.contains(e.target as Node)
      if (!clickedInTextarea) {
        closePicker({ restoreFocus: false })
      }
    }

    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [isOpen, activeTriggerConfig, closePicker, insertMentions])

  // Handle value changes from the toolbar (formatting)
  const handleToolbarValueChange = React.useCallback(
    (newValue: string) => {
      const nextSerializedValue = normalizeContiguousMentionDuplicates(
        applyDisplayValueChange(normalizedValue, editorState, newValue),
        triggerChars,
      )
      if (!isControlled) {
        setInternalValue(nextSerializedValue)
      }
      onValueChange?.(nextSerializedValue)
    },
    [isControlled, onValueChange, normalizedValue, editorState, triggerChars],
  )

  // ─── File upload handlers ─────────────────────────────────────────────────

  const replaceValueText = React.useCallback(
    (search: string, replacement: string) => {
      const latest = valueRef.current
      const replaced = latest.replace(search, replacement)
      if (replaced === latest) return
      valueRef.current = replaced
      if (!isControlled) setInternalValue(replaced)
      onValueChangeRef.current?.(replaced)
    },
    [isControlled],
  )

  const getImageDimensions = React.useCallback((file: File) => {
    return new Promise<{ width: number; height: number } | null>(resolve => {
      const objectUrl = URL.createObjectURL(file)
      const image = new Image()

      image.onload = () => {
        resolve({ width: image.naturalWidth, height: image.naturalHeight })
        URL.revokeObjectURL(objectUrl)
      }

      image.onerror = () => {
        resolve(null)
        URL.revokeObjectURL(objectUrl)
      }

      image.src = objectUrl
    })
  }, [])

  const serializeUploadedImage = React.useCallback(
    (safeName: string, url: string, dimensions: { width: number; height: number } | null, editorWidth?: number) => {
      const escapedAlt = safeName.replace(/"/g, '&quot;')
      const measuredEditorWidth = editorWidth && editorWidth > 0 ? Math.round(editorWidth) : undefined
      const naturalWidth = dimensions?.width
      const maxWidth =
        measuredEditorWidth && naturalWidth
          ? Math.min(measuredEditorWidth, naturalWidth)
          : (measuredEditorWidth ?? naturalWidth)
      if (!maxWidth) {
        return `![${safeName}](${url})`
      }

      return `<img alt="${escapedAlt}" src="${url}" style="width: 100%; max-width: ${maxWidth}px; height: auto;" />`
    },
    [],
  )

  const processFileDrop = React.useCallback(
    (files: File[]) => {
      if (!onFileUpload || files.length === 0) return
      const textarea = textareaRef.current
      if (!textarea) return
      const editorWidth = textarea.clientWidth

      const entries = files.map(file => {
        const counter = ++uploadCounterRef.current
        const safeName = file.name.replace(/[[\]]/g, '_')
        const placeholder = `![Uploading ${safeName}…](#upload-${counter})`
        return { file, safeName, placeholder }
      })

      const allPlaceholders = entries.map(e => e.placeholder).join('\n')
      const state = buildMentionEditorState(valueRef.current, triggerChars)
      const cursorPos = textarea.selectionStart
      const selEnd = textarea.selectionEnd
      const sStart = mapDisplayIndexToSerializedIndex(state, cursorPos)
      const sEnd = mapDisplayIndexToSerializedIndex(state, selEnd)

      const current = valueRef.current
      const withPlaceholders = `${current.slice(0, sStart)}${allPlaceholders}${current.slice(sEnd)}`
      valueRef.current = withPlaceholders
      if (!isControlled) setInternalValue(withPlaceholders)
      onValueChangeRef.current?.(withPlaceholders)

      for (const { file, safeName, placeholder } of entries) {
        Promise.all([onFileUpload(file), getImageDimensions(file)]).then(
          ([url, dimensions]) =>
            replaceValueText(placeholder, serializeUploadedImage(safeName, url, dimensions, editorWidth)),
          () => replaceValueText(placeholder, ''),
        )
      }
    },
    [onFileUpload, triggerChars, isControlled, replaceValueText, getImageDimensions, serializeUploadedImage],
  )

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('Files')) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDragEnter = React.useCallback((e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('Files')) return
    e.preventDefault()
    dragCounterRef.current++
    if (dragCounterRef.current === 1) setIsDragOver(true)
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('Files')) return
    e.preventDefault()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) setIsDragOver(false)
  }, [])

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      dragCounterRef.current = 0
      setIsDragOver(false)
      const imageFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
      if (imageFiles.length > 0) {
        e.preventDefault()
        processFileDrop(imageFiles)
      }
    },
    [processFileDrop],
  )

  const handlePaste = React.useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const imageFiles = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'))
      if (imageFiles.length === 0) return
      e.preventDefault()
      processFileDrop(imageFiles)
    },
    [processFileDrop],
  )

  // Get the effective highlight color for active trigger
  const effectiveHighlightColor = activeTriggerConfig?.highlightColor ?? highlightColor
  const effectiveDragOverlayColor: Color = error ? SemanticColor.error : (color ?? SemanticColor.slate)

  React.useLayoutEffect(() => {
    const textarea = textareaRef.current
    const selection = pendingSelectionRef.current
    if (!textarea || !selection || document.activeElement !== textarea) return

    textarea.setSelectionRange(selection.start, selection.end)
    pendingSelectionRef.current = null
  })

  // Default item renderer
  const defaultRenderItem = (item: MentionItem, isHighlighted: boolean) => (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 cursor-pointer',
        'transition-colors duration-150',
        isHighlighted && mentionItemHighlightColorVariants[effectiveHighlightColor],
        item.disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {item.icon && <span className="shrink-0">{item.icon}</span>}
      <span className="truncate">{item.label}</span>
    </div>
  )

  const textareaBlock = (
    <>
      <Textarea
        ref={textareaRef}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={className}
        color={color}
        error={error}
        aria-expanded={isOpen}
        aria-controls={isOpen && !activeTriggerConfig?.renderPicker ? listboxId : undefined}
        aria-activedescendant={
          isOpen && !activeTriggerConfig?.renderPicker && filteredMentions.length > 0
            ? getOptionId(highlightedIndex)
            : undefined
        }
        aria-autocomplete={activeTriggerConfig?.renderPicker ? undefined : 'list'}
        {...props}
        {...(onFileUpload ? { onPaste: handlePaste } : {})}
      />

      {/* Mention dropdown - rendered via portal to avoid clipping */}
      {isOpen &&
        triggerPosition &&
        ReactDOM.createPortal(
          activeTriggerConfig?.renderPicker ? (
            // Custom picker — delegates all selection logic to the picker component
            <div
              ref={node => {
                const prev = (dropdownRef as React.MutableRefObject<HTMLDivElement | null>).current
                ;(dropdownRef as React.MutableRefObject<HTMLDivElement | null>).current = node
                // Auto-focus first focusable element only on initial mount (prev was null)
                if (node && !prev) {
                  scheduleAnimationFrame(() => {
                    const focusable = node.querySelector<HTMLElement>('input, [tabindex="0"], [role="option"], button')
                    focusable?.focus()
                  })
                }
              }}
              role="dialog"
              aria-label="Picker"
              className="fixed z-[9999]"
              style={{
                top: triggerPosition.top,
                left: triggerPosition.left,
              }}
              onKeyDown={event => {
                if (event.key === KEYBOARD_KEYS.escape) {
                  event.preventDefault()
                  event.stopPropagation()
                  if (pendingPickerItemsRef.current.length > 0) {
                    const items = pendingPickerItemsRef.current
                    pendingPickerItemsRef.current = []
                    insertMentions(items)
                  } else {
                    closePicker()
                  }
                }
              }}
            >
              {activeTriggerConfig.renderPicker({
                onConfirm: items => {
                  pendingPickerItemsRef.current = []
                  insertMentions(items)
                },
                onClose: () => {
                  if (pendingPickerItemsRef.current.length > 0) {
                    const items = pendingPickerItemsRef.current
                    pendingPickerItemsRef.current = []
                    insertMentions(items)
                  } else {
                    closePicker()
                  }
                },
                onSelectionChange: items => {
                  pendingPickerItemsRef.current = items
                },
                searchTerm,
              })}
            </div>
          ) : (
            // Default single-select dropdown
            <div
              ref={dropdownRef}
              id={listboxId}
              role="listbox"
              aria-label="Mention suggestions"
              className={cn(
                'fixed z-[9999] min-w-[var(--mention-textarea-suggestion-min-width)] max-w-[var(--mention-textarea-suggestion-max-width)] text-[length:var(--mention-textarea-suggestion-font-size)]',
                'rounded-md border bg-popover text-popover-foreground shadow-lg',
                'animate-in fade-in-0 zoom-in-95',
                triggerPosition.showAbove && 'animate-in slide-in-from-bottom-2',
                !triggerPosition.showAbove && 'animate-in slide-in-from-top-2',
              )}
              style={
                {
                  top: triggerPosition.top,
                  left: triggerPosition.left,
                  '--mention-textarea-suggestion-min-width': mentionTextareaVar('suggestionMinWidth', '200px'),
                  '--mention-textarea-suggestion-max-width': mentionTextareaVar('suggestionMaxWidth', '300px'),
                  '--mention-textarea-suggestion-font-size': mentionTextareaVar('suggestionFontSize', '0.875rem'),
                  '--mention-textarea-suggestion-empty-padding-inline': mentionTextareaVar(
                    'suggestionEmptyPaddingInline',
                    '0.75rem',
                  ),
                  '--mention-textarea-suggestion-empty-padding-block': mentionTextareaVar(
                    'suggestionEmptyPaddingBlock',
                    '0.5rem',
                  ),
                } as React.CSSProperties
              }
            >
              {filteredMentions.length > 0 ? (
                <div className="py-1">
                  {filteredMentions.map((item, index) => (
                    <div
                      key={item.id}
                      id={getOptionId(index)}
                      role="option"
                      aria-selected={index === highlightedIndex}
                      aria-disabled={item.disabled}
                      tabIndex={-1}
                      onClick={() => selectMention(item)}
                      // onKeyDown kept for a11y linter rule, though keyboard nav is handled by textarea
                      onKeyDown={e => {
                        if (isActivationKey(e.key)) {
                          e.preventDefault()
                          selectMention(item)
                        }
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {renderItem
                        ? renderItem(item, index === highlightedIndex, activeTrigger || '')
                        : defaultRenderItem(item, index === highlightedIndex)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-[var(--mention-textarea-suggestion-empty-padding-inline)] py-[var(--mention-textarea-suggestion-empty-padding-block)] text-[length:var(--mention-textarea-suggestion-font-size)] text-muted-foreground">
                  {noMatchesText}
                </div>
              )}
            </div>
          ),
          document.body,
        )}

      {/* Selection toolbar for markdown formatting */}
      {toolbar && (
        <SelectionToolbar
          textareaRef={textareaRef}
          mirrorRef={mirrorRef}
          value={displayValue}
          onValueChange={handleToolbarValueChange}
          actions={toolbarActions}
        />
      )}
    </>
  )

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop on container; keyboard via onPaste
    <div
      className="relative"
      style={
        {
          '--mention-textarea-drag-overlay-font-size': mentionTextareaVar('dragOverlayFontSize', '0.875rem'),
        } as React.CSSProperties
      }
      onDragOver={onFileUpload ? handleDragOver : undefined}
      onDragEnter={onFileUpload ? handleDragEnter : undefined}
      onDragLeave={onFileUpload ? handleDragLeave : undefined}
      onDrop={onFileUpload ? handleDrop : undefined}
    >
      {isDragOver && (
        <Row
          align="center"
          justify="center"
          className={cn(
            'absolute inset-0 z-10 rounded-md border-2 border-dashed pointer-events-none',
            mentionDragOverlayColorVariants[effectiveDragOverlayColor],
          )}
        >
          <Text
            as="span"
            weight="medium"
            color="neutral"
            className="text-[length:var(--mention-textarea-drag-overlay-font-size)]"
          >
            Attach images by dropping them here
          </Text>
        </Row>
      )}

      {/* Hidden mirror div for cursor position calculation */}
      <div ref={mirrorRef} aria-hidden="true" />

      {preview ? (
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} size="xs">
          <Tabs.List>
            <Tabs.Trigger value="write">Write</Tabs.Trigger>
            <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="write">{textareaBlock}</Tabs.Content>
          <Tabs.Content value="preview">
            <div
              className={cn(
                'min-h-[var(--mention-textarea-preview-min-height)] rounded-md border px-[var(--mention-textarea-preview-padding-inline)] py-[var(--mention-textarea-preview-padding-block)] text-[length:var(--mention-textarea-preview-font-size)]',
                !value && 'text-muted-foreground',
              )}
              style={
                {
                  '--mention-textarea-preview-min-height': mentionTextareaVar('previewMinHeight', '80px'),
                  '--mention-textarea-preview-padding-inline': mentionTextareaVar('previewPaddingInline', '0.75rem'),
                  '--mention-textarea-preview-padding-block': mentionTextareaVar('previewPaddingBlock', '0.5rem'),
                  '--mention-textarea-preview-font-size': mentionTextareaVar('previewFontSize', '0.875rem'),
                  '--mention-textarea-drag-overlay-font-size': mentionTextareaVar('dragOverlayFontSize', '0.875rem'),
                } as React.CSSProperties
              }
            >
              {value ? (
                <MentionMarkdownPreview markdown={value} triggerChars={triggerChars} sources={previewSources} />
              ) : (
                'Nothing to preview'
              )}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      ) : (
        textareaBlock
      )}
    </div>
  )
}
