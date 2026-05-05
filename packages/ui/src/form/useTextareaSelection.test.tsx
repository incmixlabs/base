import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTextareaSelection } from './useTextareaSelection'

// ── Helpers ──

function createTextarea(value = 'hello world'): HTMLTextAreaElement {
  const el = document.createElement('textarea')
  el.value = value
  document.body.appendChild(el)
  return el
}

function createMirror(): HTMLDivElement {
  const el = document.createElement('div')
  document.body.appendChild(el)
  return el
}

/** Stub getBoundingClientRect on any span created inside the mirror div */
function stubSpanRect(rect: Partial<DOMRect> = {}) {
  vi.spyOn(HTMLSpanElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 100,
    left: 200,
    width: 80,
    height: 20,
    bottom: 120,
    right: 280,
    x: 200,
    y: 100,
    toJSON: () => ({}),
    ...rect,
  })
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  cleanup()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

// ── Helpers for timer flushing ──

/** Flush both setTimeout and requestAnimationFrame */
function flushTimers() {
  vi.advanceTimersByTime(20)
  vi.runAllTimers()
}

// ── Tests ──

describe('useTextareaSelection', () => {
  describe('focus ownership', () => {
    it('does not report selection when textarea is not focused', () => {
      const textarea = createTextarea()
      const mirror = createMirror()
      const textareaRef = { current: textarea }
      const mirrorRef = { current: mirror }

      stubSpanRect()

      // Set a selection range on the textarea (but don't focus it)
      textarea.setSelectionRange(0, 5)

      const { result } = renderHook(() => useTextareaSelection(textareaRef, mirrorRef))

      // Fire selectionchange — should be ignored because textarea is not focused
      act(() => {
        document.dispatchEvent(new Event('selectionchange'))
      })

      expect(result.current.hasSelection).toBe(false)
      expect(result.current.selection).toBeNull()
    })

    it('reports selection when textarea is focused', () => {
      const textarea = createTextarea()
      const mirror = createMirror()
      const textareaRef = { current: textarea }
      const mirrorRef = { current: mirror }

      stubSpanRect()

      const { result } = renderHook(() => useTextareaSelection(textareaRef, mirrorRef))

      // Focus and select
      textarea.focus()
      textarea.setSelectionRange(0, 5)

      act(() => {
        textarea.dispatchEvent(new Event('mouseup'))
      })

      // mouseup uses setTimeout(10), flush it
      act(() => {
        flushTimers()
      })

      // In jsdom, document.activeElement should be the textarea after focus()
      expect(result.current.hasSelection).toBe(true)
      expect(result.current.selection).toEqual({ start: 0, end: 5, text: 'hello' })
    })

    it('clears selection on blur', () => {
      const textarea = createTextarea()
      const mirror = createMirror()
      const textareaRef = { current: textarea }
      const mirrorRef = { current: mirror }

      stubSpanRect()

      const { result } = renderHook(() => useTextareaSelection(textareaRef, mirrorRef))

      // Focus, select, then mouseup
      textarea.focus()
      textarea.setSelectionRange(0, 5)
      act(() => {
        textarea.dispatchEvent(new Event('mouseup'))
      })
      act(() => {
        flushTimers()
      })

      expect(result.current.hasSelection).toBe(true)

      // Blur the textarea
      act(() => {
        textarea.dispatchEvent(new FocusEvent('blur', { relatedTarget: null }))
      })

      expect(result.current.hasSelection).toBe(false)
      expect(result.current.selection).toBeNull()
    })

    it('does not re-open toolbar after blur when selectionchange fires from elsewhere', () => {
      const textarea = createTextarea()
      const mirror = createMirror()
      const textareaRef = { current: textarea }
      const mirrorRef = { current: mirror }

      stubSpanRect()

      const { result } = renderHook(() => useTextareaSelection(textareaRef, mirrorRef))

      // Focus, select, then blur
      textarea.focus()
      textarea.setSelectionRange(0, 5)
      act(() => {
        textarea.dispatchEvent(new Event('mouseup'))
      })
      act(() => {
        flushTimers()
      })

      expect(result.current.hasSelection).toBe(true)

      // Blur — moves activeElement away from textarea
      act(() => {
        textarea.blur()
      })

      expect(result.current.hasSelection).toBe(false)

      // Now a selectionchange fires (e.g. user selected text elsewhere)
      // The textarea still has stale selectionStart/End but is not focused
      act(() => {
        document.dispatchEvent(new Event('selectionchange'))
      })

      // Should remain closed — the focus guard prevents re-opening
      expect(result.current.hasSelection).toBe(false)
      expect(result.current.selection).toBeNull()
    })
  })

  describe('scroll and resize repositioning', () => {
    it('re-measures position on window scroll when textarea is focused', () => {
      const textarea = createTextarea()
      const mirror = createMirror()
      const textareaRef = { current: textarea }
      const mirrorRef = { current: mirror }

      stubSpanRect({ top: 100, left: 200, width: 80, height: 20 })

      const { result } = renderHook(() => useTextareaSelection(textareaRef, mirrorRef))

      // Focus and select
      textarea.focus()
      textarea.setSelectionRange(0, 5)
      act(() => {
        textarea.dispatchEvent(new Event('mouseup'))
      })
      act(() => {
        flushTimers()
      })

      expect(result.current.selectionRect?.top).toBe(100)

      // Simulate scroll — rect changes
      vi.spyOn(HTMLSpanElement.prototype, 'getBoundingClientRect').mockReturnValue({
        top: 50,
        left: 200,
        width: 80,
        height: 20,
        bottom: 70,
        right: 280,
        x: 200,
        y: 50,
        toJSON: () => ({}),
      })

      act(() => {
        window.dispatchEvent(new Event('scroll'))
        flushTimers()
      })

      // Should have re-measured with new rect
      expect(result.current.selectionRect?.top).toBe(50)
    })

    it('re-measures position on window resize when textarea is focused', () => {
      const textarea = createTextarea()
      const mirror = createMirror()
      const textareaRef = { current: textarea }
      const mirrorRef = { current: mirror }

      stubSpanRect({ top: 100, left: 200, width: 80, height: 20 })

      const { result } = renderHook(() => useTextareaSelection(textareaRef, mirrorRef))

      textarea.focus()
      textarea.setSelectionRange(0, 5)
      act(() => {
        textarea.dispatchEvent(new Event('mouseup'))
      })
      act(() => {
        flushTimers()
      })

      expect(result.current.hasSelection).toBe(true)

      // Change rect and fire resize
      vi.spyOn(HTMLSpanElement.prototype, 'getBoundingClientRect').mockReturnValue({
        top: 150,
        left: 300,
        width: 80,
        height: 20,
        bottom: 170,
        right: 380,
        x: 300,
        y: 150,
        toJSON: () => ({}),
      })

      act(() => {
        window.dispatchEvent(new Event('resize'))
        flushTimers()
      })

      expect(result.current.selectionRect?.top).toBe(150)
      expect(result.current.selectionRect?.left).toBe(300)
    })

    it('ignores scroll when textarea is not focused', () => {
      const textarea = createTextarea()
      const mirror = createMirror()
      const textareaRef = { current: textarea }
      const mirrorRef = { current: mirror }

      stubSpanRect()

      const { result } = renderHook(() => useTextareaSelection(textareaRef, mirrorRef))

      // Don't focus — just fire scroll
      textarea.setSelectionRange(0, 5)

      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })

      // Should not have opened
      expect(result.current.hasSelection).toBe(false)
    })
  })

  describe('blur with toolbar interaction', () => {
    it('does not clear selection when blur target is inside toolbar', () => {
      const textarea = createTextarea()
      const mirror = createMirror()
      const textareaRef = { current: textarea }
      const mirrorRef = { current: mirror }

      stubSpanRect()

      const { result } = renderHook(() => useTextareaSelection(textareaRef, mirrorRef))

      // Set up toolbar ref
      const toolbarDiv = document.createElement('div')
      const toolbarButton = document.createElement('button')
      toolbarDiv.appendChild(toolbarButton)
      document.body.appendChild(toolbarDiv)
      ;(result.current.toolbarRef as { current: HTMLDivElement | null }).current = toolbarDiv

      // Focus and select
      textarea.focus()
      textarea.setSelectionRange(0, 5)
      act(() => {
        textarea.dispatchEvent(new Event('mouseup'))
      })
      act(() => {
        flushTimers()
      })

      expect(result.current.hasSelection).toBe(true)

      // Blur with relatedTarget inside toolbar — should NOT clear
      act(() => {
        textarea.dispatchEvent(new FocusEvent('blur', { relatedTarget: toolbarButton }))
      })

      expect(result.current.hasSelection).toBe(true)
    })
  })
})
