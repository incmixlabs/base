'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ToggleGroup } from '@/elements/toggle/Toggle'
import { cn } from '@/lib/utils'
import type { Color } from '@/theme/tokens'
import {
  toolbarButtonActiveVariants,
  toolbarButtonColorVariants,
  toolbarSeparatorCls,
  toolbarSurfaceCls,
} from './FloatingToolbar.css'

// ── Types ──

export interface FloatingToolbarAction {
  /** Unique key */
  id: string
  /** Icon to display */
  icon: React.ReactNode
  /** Tooltip / aria-label */
  label: string
  /** Whether this action is currently active (e.g. bold is on) */
  active?: boolean
  /** Separator group — actions with different group values get a divider between them */
  group?: string
  /** When true, only one action in this group can be active at a time (e.g. block formats) */
  exclusive?: boolean
}

export interface FloatingToolbarProps {
  /** Whether the toolbar is visible */
  open: boolean
  /** Bounding rect of the selection (viewport coordinates) used for positioning */
  selectionRect: FloatingToolbarRect | null
  /** Toolbar actions to render */
  actions: FloatingToolbarAction[]
  /** Called when an action button is clicked */
  onAction: (action: FloatingToolbarAction) => void
  /** IDs of currently active actions (computed from selection context) */
  activeValues?: string[]
  /** Semantic color for toolbar buttons (default: 'primary') */
  color?: Color
  /** Additional className for the toolbar container */
  className?: string
  /** Ref forwarded to the toolbar container (useful for blur/focus checks) */
  toolbarRef?: React.RefObject<HTMLDivElement | null>
  /** Prevent default on mousedown to keep source element focused (default: true) */
  preventBlur?: boolean
  /** Children rendered after action buttons (for custom content) */
  children?: React.ReactNode
}

export interface FloatingToolbarRect {
  top: number
  left: number
  width: number
  height: number
}

// ── Position calculation ──

function calcPosition(
  rect: FloatingToolbarRect,
  toolbarWidth: number,
  toolbarHeight: number,
): { top: number; left: number } {
  const gap = 8

  const top = rect.top - toolbarHeight - gap
  const centerX = rect.left + rect.width / 2
  const halfWidth = toolbarWidth / 2

  // Clamp the toolbar center so translated edges remain inside the viewport.
  const clampedLeft = Math.max(8 + halfWidth, Math.min(centerX, window.innerWidth - 8 - halfWidth))
  const clampedTop = top < 8 ? rect.top + rect.height + gap : top

  return { top: clampedTop, left: clampedLeft }
}

// ── Component ──

/** Group consecutive actions by their `group` property */
interface ActionGroup {
  key: string
  actions: FloatingToolbarAction[]
  /** When true, only one action in the group can be active (ToggleGroup multiple={false}) */
  exclusive: boolean
}

function groupActions(actions: FloatingToolbarAction[]): ActionGroup[] {
  const groups: ActionGroup[] = []
  for (const action of actions) {
    const groupKey = action.group ?? action.id
    const last = groups[groups.length - 1]
    if (last && last.key === groupKey) {
      last.actions.push(action)
      if (action.exclusive) last.exclusive = true
    } else {
      groups.push({ key: groupKey, actions: [action], exclusive: !!action.exclusive })
    }
  }
  return groups
}

export function FloatingToolbar({
  open,
  selectionRect,
  actions,
  onAction,
  activeValues = [],
  color = 'primary',
  className,
  toolbarRef: externalRef,
  preventBlur = true,
  children,
}: FloatingToolbarProps) {
  const internalRef = React.useRef<HTMLDivElement>(null)
  const ref = externalRef ?? internalRef
  const [toolbarSize, setToolbarSize] = React.useState({ width: 200, height: 40 })

  React.useLayoutEffect(() => {
    if (!open) return
    const el = ref.current
    if (!el) return

    const updateSize = () => {
      const next = { width: el.offsetWidth || 200, height: el.offsetHeight || 40 }
      setToolbarSize(prev => (prev.width === next.width && prev.height === next.height ? prev : next))
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(el)

    return () => observer.disconnect()
  }, [open, ref])

  if (!open || !selectionRect) return null

  const position = calcPosition(selectionRect, toolbarSize.width, toolbarSize.height)
  const groups = groupActions(actions)

  // Build active values per group
  const activeSet = new Set([...actions.filter(action => action.active).map(action => action.id), ...activeValues])

  const handleGroupValueChange = (group: ActionGroup, newValues: string[]) => {
    // Find which value was toggled by comparing newValues to the previous active values for this group
    const groupActiveIds = group.actions.filter(a => activeSet.has(a.id)).map(a => a.id)
    const added = newValues.find(v => !groupActiveIds.includes(v))
    const removed = groupActiveIds.find(v => !newValues.includes(v))
    const toggledId = added ?? removed
    if (toggledId) {
      const action = group.actions.find(a => a.id === toggledId)
      if (action) onAction(action)
    }
  }

  return ReactDOM.createPortal(
    <div
      ref={ref}
      role="toolbar"
      aria-label="Text formatting"
      className={cn(
        'fixed z-[9999] flex items-center gap-0.5',
        'rounded-lg border px-1 py-1 shadow-lg',
        'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2',
        toolbarSurfaceCls,
        className,
      )}
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateX(-50%)',
      }}
      onMouseDown={preventBlur ? e => e.preventDefault() : undefined}
    >
      {groups.map((group, groupIndex) => {
        const groupActiveValues = group.actions.filter(a => activeSet.has(a.id)).map(a => a.id)

        return (
          <React.Fragment key={`${group.key}:${groupIndex}`}>
            {groupIndex > 0 && <div className={cn('mx-0.5 h-5 w-px', toolbarSeparatorCls)} aria-hidden="true" />}
            <ToggleGroup.Root
              size="xs"
              variant="soft"
              flush={true}
              color={color}
              multiple={!group.exclusive}
              value={groupActiveValues}
              onValueChange={(newValues: string[]) => handleGroupValueChange(group, newValues)}
            >
              {group.actions.map(action => (
                <ToggleGroup.Item key={action.id} value={action.id} aria-label={action.label} title={action.label}>
                  {action.icon}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </React.Fragment>
        )
      })}
      {children}
    </div>,
    document.body,
  )
}

// ── Compound sub-components ──

export function FloatingToolbarSeparator() {
  return <div className={cn('mx-0.5 h-5 w-px', toolbarSeparatorCls)} aria-hidden="true" />
}

export function FloatingToolbarButton({
  icon,
  label,
  active,
  onClick,
  color = 'slate',
  className: cls,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
  color?: Color
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        'flex items-center justify-center rounded-md p-1.5',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        active ? toolbarButtonActiveVariants[color] : toolbarButtonColorVariants[color],
        cls,
      )}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}
