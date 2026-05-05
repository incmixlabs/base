'use client'

import * as React from 'react'
import { KEYBOARD_KEYS } from '@/lib/keyboard-keys'
import type { FloatingToolbarRect } from './FloatingToolbar'

export interface TextareaSelection {
  start: number
  end: number
  text: string
}

export interface UseTextareaSelectionReturn {
  /** Whether text is currently selected */
  hasSelection: boolean
  /** The current selection range and text */
  selection: TextareaSelection | null
  /** Bounding rect of the selection in viewport coordinates (for FloatingToolbar) */
  selectionRect: FloatingToolbarRect | null
  /** Ref to attach to a hidden mirror div (required for position calculation) */
  mirrorRef: React.RefObject<HTMLDivElement | null>
  /** Ref to the toolbar container — pass to FloatingToolbar so blur checks work */
  toolbarRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Calculate the bounding rect of a text selection within a textarea
 * using the mirror div technique.
 */
function getSelectionRect(
  textarea: HTMLTextAreaElement,
  mirror: HTMLDivElement,
  selectionStart: number,
  selectionEnd: number,
): FloatingToolbarRect | null {
  if (selectionStart === selectionEnd) return null

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
    letter-spacing: ${styles.letterSpacing};
    padding: ${styles.padding};
    border: ${styles.border};
    box-sizing: ${styles.boxSizing};
  `

  const value = textarea.value
  mirror.innerHTML = ''

  const textBefore = document.createTextNode(value.slice(0, selectionStart))
  const selectionSpan = document.createElement('span')
  selectionSpan.textContent = value.slice(selectionStart, selectionEnd) || '\u200B'

  mirror.appendChild(textBefore)
  mirror.appendChild(selectionSpan)

  // Append remaining text to ensure correct wrapping
  const textAfter = document.createTextNode(value.slice(selectionEnd))
  mirror.appendChild(textAfter)

  const spanRect = selectionSpan.getBoundingClientRect()

  return {
    top: spanRect.top - textarea.scrollTop,
    left: spanRect.left - textarea.scrollLeft,
    width: spanRect.width,
    height: spanRect.height,
  }
}

/**
 * Hook that tracks text selection in a textarea and provides the selection rect
 * for positioning a FloatingToolbar.
 *
 * Uses the mirror div technique to calculate pixel coordinates of the selection.
 */
export function useTextareaSelection(
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  mirrorRefParam?: React.RefObject<HTMLDivElement | null>,
): UseTextareaSelectionReturn {
  const internalMirrorRef = React.useRef<HTMLDivElement>(null)
  const mirrorRef = mirrorRefParam ?? internalMirrorRef
  const toolbarRef = React.useRef<HTMLDivElement>(null)
  const mouseUpTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const [hasSelection, setHasSelection] = React.useState(false)
  const [selection, setSelection] = React.useState<TextareaSelection | null>(null)
  const [selectionRect, setSelectionRect] = React.useState<FloatingToolbarRect | null>(null)

  const clear = React.useCallback(() => {
    setHasSelection(false)
    setSelection(null)
    setSelectionRect(null)
  }, [])

  const update = React.useCallback(() => {
    const textarea = textareaRef.current
    const mirror = mirrorRef.current
    if (!textarea || !mirror) return

    // Only track selection when this textarea is focused
    if (document.activeElement !== textarea) {
      clear()
      return
    }

    const { selectionStart, selectionEnd } = textarea
    if (selectionStart === selectionEnd) {
      clear()
      return
    }

    const text = textarea.value.slice(selectionStart, selectionEnd)
    setSelection({ start: selectionStart, end: selectionEnd, text })
    setHasSelection(true)

    const rect = getSelectionRect(textarea, mirror, selectionStart, selectionEnd)
    setSelectionRect(rect)
  }, [textareaRef, mirrorRef, clear])

  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const handleSelectionChange = () => {
      // Only respond to selectionchange when this textarea is focused
      if (document.activeElement !== textarea) return
      requestAnimationFrame(update)
    }

    const handleMouseUp = () => {
      if (mouseUpTimeoutRef.current) clearTimeout(mouseUpTimeoutRef.current)
      mouseUpTimeoutRef.current = setTimeout(update, 10)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.shiftKey || e.key === KEYBOARD_KEYS.shift) {
        update()
      }
    }

    const handleBlur = (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as Node | null
      if (toolbarRef.current?.contains(relatedTarget)) return
      clear()
    }

    // Re-measure position on scroll/resize so toolbar tracks the selection
    const handleScrollOrResize = () => {
      if (document.activeElement !== textarea) return
      requestAnimationFrame(update)
    }

    textarea.addEventListener('mouseup', handleMouseUp)
    textarea.addEventListener('keyup', handleKeyUp)
    textarea.addEventListener('blur', handleBlur)
    document.addEventListener('selectionchange', handleSelectionChange)
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)

    return () => {
      if (mouseUpTimeoutRef.current) {
        clearTimeout(mouseUpTimeoutRef.current)
        mouseUpTimeoutRef.current = null
      }
      textarea.removeEventListener('mouseup', handleMouseUp)
      textarea.removeEventListener('keyup', handleKeyUp)
      textarea.removeEventListener('blur', handleBlur)
      document.removeEventListener('selectionchange', handleSelectionChange)
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [textareaRef, update, clear])

  return { hasSelection, selection, selectionRect, mirrorRef, toolbarRef }
}
