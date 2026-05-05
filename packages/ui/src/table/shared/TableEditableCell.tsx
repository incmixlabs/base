'use client'

import { Combobox } from '@base-ui/react/combobox'
import { CheckIcon, SquareIcon } from 'lucide-react'
import * as React from 'react'
import { Icon } from '@/elements'
import { Avatar } from '@/elements/avatar/Avatar'
import { Button } from '@/elements/button/Button'
import { Select, SelectItem } from '@/form/Select'
import { KEYBOARD_KEYS } from '@/lib/keyboard-keys'
import { cn } from '@/lib/utils'
import { useThemePortalContainer } from '@/theme/theme-provider.context'
import { resolveThemeColorToken, type ThemeColorToken } from '@/theme/tokens'
import {
  editableCellCheckbox,
  editableCellControl,
  editableCellEditContainer,
  editableCellError,
  editableCellReadView,
} from './table-editable-cell.css'
import type {
  TableEditableCellNavigation,
  TableEditableCellNavigationOptions,
  TableEditableCellProps,
} from './table-editable-cell.props'
import type { TableCellEditor } from './table-editing'
import { resolveTableCellEditor, validateTableCellEdit } from './table-editing'

type DraftValue = string | boolean
function toDraftValue(value: unknown, editor: TableCellEditor): DraftValue {
  if (editor.type === 'checkbox') return Boolean(value)
  if (editor.type === 'multi-select') {
    if (!Array.isArray(value)) return '[]'
    const ids = value.map((v: unknown) => {
      if (typeof v === 'string') return v
      if (v && typeof v === 'object') {
        const obj = v as Record<string, unknown>
        if ('value' in obj) return String(obj.value)
        if ('id' in obj) return String(obj.id)
        if ('name' in obj) return String(obj.name)
      }
      return String(v)
    })
    return JSON.stringify(ids)
  }
  if (editor.type === 'select' && value != null && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    if ('value' in obj) return String(obj.value)
    if ('id' in obj) return String(obj.id)
    if ('name' in obj) return String(obj.name)
  }
  return value == null ? '' : String(value)
}

function parseDraftValue<TValue>(draftValue: DraftValue, editor: TableCellEditor<TValue>): TValue {
  if (editor.type === 'checkbox') return Boolean(draftValue) as TValue
  if (editor.type === 'number') {
    const trimmed = String(draftValue).trim()
    if (trimmed === '' && editor.default != null) return editor.default as TValue
    if (trimmed === '') return Number.NaN as TValue
    let num = Number(trimmed)
    if (editor.decimal != null) num = Number(num.toFixed(Math.max(0, Math.min(100, Math.trunc(editor.decimal)))))
    return num as TValue
  }
  if (editor.type === 'select') {
    const option = editor.options.find(item => String(item.value) === String(draftValue))
    return (option?.data ?? option?.value ?? draftValue) as TValue
  }
  if (editor.type === 'multi-select') {
    let selectedIds: string[]
    try {
      selectedIds = JSON.parse(String(draftValue))
    } catch {
      selectedIds = []
    }
    return selectedIds.map(id => {
      const option = editor.options.find(o => String(o.value) === id)
      return option?.data ?? option?.value ?? id
    }) as TValue
  }
  return draftValue as TValue
}

function isAllowedNumberDraft(value: string, editor: Extract<TableCellEditor, { type: 'number' }>) {
  if (value === '') return true
  const allowNegative = editor.min == null || editor.min < 0
  const base = allowNegative ? /^-?\d*(?:\.\d*)?$/ : /^\d*(?:\.\d*)?$/
  if (!base.test(value)) return false
  if (editor.decimal != null) {
    if (editor.decimal === 0 && value.includes('.')) return false
    const dot = value.indexOf('.')
    if (dot !== -1 && value.length - dot - 1 > editor.decimal) return false
  }
  return true
}

function getInitials(text: string): string {
  return text
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .join('')
    .toLowerCase()
}

function matchesFilter(
  option: { label: React.ReactNode; value: unknown; avatar?: { name?: string } },
  filter: string,
): boolean {
  const label = typeof option.label === 'string' ? option.label.toLowerCase() : ''
  const value = String(option.value).toLowerCase()
  if (label.includes(filter) || value.includes(filter)) return true
  const name = option.avatar?.name ?? (typeof option.label === 'string' ? option.label : '')
  if (name && getInitials(name).startsWith(filter)) return true
  return false
}

function renderSelectOptionLabel(option: {
  avatar?: { src?: string; name?: string }
  color?: React.ComponentProps<typeof Icon>['color']
  icon?: string
  iconColor?: React.ComponentProps<typeof Icon>['color']
  iconProps?: Record<string, unknown>
  label: React.ReactNode
  variant?: 'solid' | 'soft' | 'surface' | 'outline'
}) {
  if (option.avatar) {
    return (
      <span className="inline-flex min-w-0 items-center gap-2">
        <Avatar src={option.avatar.src} name={option.avatar.name} size="xs" />
        <span className="min-w-0 truncate">{option.label}</span>
      </span>
    )
  }

  if (option.variant && option.color) {
    const isSolid = option.variant === 'solid'
    const isOutline = option.variant === 'outline'
    const bgToken = isSolid ? 'primary' : option.variant === 'surface' ? 'surface' : 'soft'
    const badgeStyle: React.CSSProperties = {
      backgroundColor: isOutline ? 'transparent' : `var(--color-${option.color}-${bgToken})`,
      color: isSolid ? `var(--color-${option.color}-contrast)` : `var(--color-${option.color}-text)`,
      border: isOutline ? `1px solid var(--color-${option.color}-border)` : undefined,
      padding: '0.125rem 0.5rem',
      borderRadius: 'var(--radius-2)',
      fontWeight: 500,
      fontSize: 'inherit',
      lineHeight: 'inherit',
    }
    return (
      <span className="min-w-0 flex-1 text-center" style={badgeStyle}>
        {option.label}
      </span>
    )
  }

  const colorStyle = option.color ? { color: resolveThemeColorToken(option.color as ThemeColorToken) } : undefined
  const label = (
    <span className="min-w-0" style={colorStyle}>
      {option.label}
    </span>
  )

  if (!option.icon) return label

  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <Icon
        icon={option.icon}
        color={option.iconColor ?? option.color ?? 'slate'}
        size="xs"
        aria-hidden="true"
        iconProps={option.iconProps}
      />
      {label}
    </span>
  )
}

type TableEditableCellReadViewProps = {
  id?: string
  ariaLabel?: string
  children: React.ReactNode
  className?: string
  role?: React.AriaRole
  stopClickPropagation?: boolean
  onActivate?: () => void
  onNavigate?: (direction: TableEditableCellNavigation, options?: TableEditableCellNavigationOptions) => boolean
}

const TableEditableCellReadView = React.forwardRef<HTMLSpanElement, TableEditableCellReadViewProps>(
  (
    { id, ariaLabel, children, className, role, stopClickPropagation = false, onActivate, onNavigate },
    forwardedRef,
  ) => {
    const navigateFromReadView = React.useCallback(
      (direction: TableEditableCellNavigation) => {
        return onNavigate?.(direction, { probe: true }) === true
      },
      [onNavigate],
    )

    const handleReadKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLSpanElement>) => {
        if (event.key === KEYBOARD_KEYS.tab) {
          const direction = event.shiftKey ? 'previous' : 'next'
          const moved = navigateFromReadView(direction)
          if (!moved) return
          event.preventDefault()
          event.stopPropagation()
          onNavigate?.(direction)
          return
        }
        if (event.key === KEYBOARD_KEYS.arrowUp || event.key === KEYBOARD_KEYS.arrowDown) {
          const direction = event.key === KEYBOARD_KEYS.arrowUp ? 'up' : 'down'
          const moved = navigateFromReadView(direction)
          if (!moved) return
          event.preventDefault()
          event.stopPropagation()
          onNavigate?.(direction)
          return
        }
        if (event.key === KEYBOARD_KEYS.arrowLeft || event.key === KEYBOARD_KEYS.arrowRight) {
          const direction = event.key === KEYBOARD_KEYS.arrowLeft ? 'previous' : 'next'
          const moved = navigateFromReadView(direction)
          if (!moved) return
          event.preventDefault()
          event.stopPropagation()
          onNavigate?.(direction)
          return
        }
        if (!onActivate || (event.key !== KEYBOARD_KEYS.enter && event.key !== 'F2')) return
        event.preventDefault()
        event.stopPropagation()
        onActivate()
      },
      [navigateFromReadView, onActivate, onNavigate],
    )

    if (role === 'button') {
      return (
        <span
          id={id}
          ref={forwardedRef}
          role="button"
          tabIndex={0}
          className={cn(editableCellReadView, className)}
          onClick={event => {
            if (stopClickPropagation) event.stopPropagation()
            onActivate?.()
          }}
          onKeyDown={handleReadKeyDown}
          aria-label={ariaLabel}
        >
          {children}
        </span>
      )
    }

    return (
      <span
        id={id}
        ref={forwardedRef}
        role="gridcell"
        tabIndex={0}
        className={cn(editableCellReadView, className)}
        onClick={event => {
          event.currentTarget.focus()
        }}
        onKeyDown={handleReadKeyDown}
        aria-label={ariaLabel}
      >
        {children}
      </span>
    )
  },
)

TableEditableCellReadView.displayName = 'TableEditableCell.ReadView'

function TableEditableCellRoot<TRow, TValue = unknown>({
  context,
  editor,
  validateEdit,
  onCommit,
  onNavigate,
  onReadNavigate,
  children,
  ariaLabel,
  readViewId,
  cellMode = 'read',
}: TableEditableCellProps<TRow, TValue>) {
  const resolvedEditor = React.useMemo(() => resolveTableCellEditor(editor, context.value), [editor, context.value])
  const compiledPattern = React.useMemo(() => {
    if (resolvedEditor.type !== 'number' || !resolvedEditor.pattern) {
      return { regex: undefined, invalid: false as const }
    }
    try {
      return { regex: new RegExp(resolvedEditor.pattern), invalid: false as const }
    } catch {
      return { regex: undefined, invalid: true as const }
    }
  }, [resolvedEditor])
  const portalContainer = useThemePortalContainer()
  const [isEditing, setIsEditing] = React.useState(cellMode === 'edit')
  const [isSelectOpen, setIsSelectOpen] = React.useState(false)
  const [draftValue, setDraftValue] = React.useState<DraftValue>(() => toDraftValue(context.value, resolvedEditor))
  const [error, setError] = React.useState<string | undefined>(undefined)
  const readViewRef = React.useRef<HTMLSpanElement | null>(null)
  const controlRef = React.useRef<HTMLInputElement | HTMLSelectElement | null>(null)
  const selectCommittedRef = React.useRef(false)
  const [comboboxFilter, setComboboxFilter] = React.useState('')
  const shouldRestoreReadFocusRef = React.useRef(false)
  const shouldFocusEditorRef = React.useRef(false)
  const [multiSelectSet, setMultiSelectSet] = React.useState<Set<string>>(() => new Set())
  const multiSelectPopupRef = React.useRef<HTMLDivElement | null>(null)
  const previousCellModeRef = React.useRef(cellMode)

  React.useEffect(() => {
    if (previousCellModeRef.current === cellMode) return
    previousCellModeRef.current = cellMode
    setError(undefined)
    setIsSelectOpen(false)
    setComboboxFilter('')
    setDraftValue(toDraftValue(context.value, resolvedEditor))
    setIsEditing(cellMode === 'edit')
  }, [cellMode, context.value, resolvedEditor])

  React.useEffect(() => {
    if (isEditing) return
    setDraftValue(toDraftValue(context.value, resolvedEditor))
  }, [context.value, isEditing, resolvedEditor])

  React.useEffect(() => {
    if (!isEditing || !shouldFocusEditorRef.current) return
    shouldFocusEditorRef.current = false
    controlRef.current?.focus()
    if (controlRef.current instanceof HTMLInputElement && controlRef.current.type !== 'checkbox') {
      controlRef.current.select()
    }
  }, [isEditing])

  React.useEffect(() => {
    if (isEditing || !shouldRestoreReadFocusRef.current) return
    shouldRestoreReadFocusRef.current = false
    readViewRef.current?.focus()
  }, [isEditing])

  const startEditing = React.useCallback(() => {
    selectCommittedRef.current = false
    setDraftValue(toDraftValue(context.value, resolvedEditor))
    setComboboxFilter('')
    setError(undefined)
    setIsSelectOpen(resolvedEditor.type === 'select' || resolvedEditor.type === 'multi-select')
    if (resolvedEditor.type === 'multi-select') {
      let ids: string[] = []
      try {
        ids = JSON.parse(toDraftValue(context.value, resolvedEditor) as string)
      } catch {
        /* empty */
      }
      setMultiSelectSet(new Set(ids))
    }
    shouldFocusEditorRef.current = true
    setIsEditing(true)
  }, [context.value, resolvedEditor])

  const cancelEditing = React.useCallback(() => {
    setDraftValue(toDraftValue(context.value, resolvedEditor))
    setComboboxFilter('')
    setError(undefined)
    setIsSelectOpen(false)
    shouldRestoreReadFocusRef.current = true
    setIsEditing(cellMode === 'edit')
  }, [cellMode, context.value, resolvedEditor])

  const commitDraftValue = React.useCallback(
    (
      nextDraftValue: DraftValue,
      {
        restoreFocus = true,
        navigate,
        navigationOptions,
      }: {
        restoreFocus?: boolean
        navigate?: TableEditableCellNavigation
        navigationOptions?: TableEditableCellNavigationOptions
      } = {},
    ) => {
      if (compiledPattern.invalid) {
        setError('Invalid number pattern configuration')
        return
      }
      if (compiledPattern.regex && !compiledPattern.regex.test(String(nextDraftValue))) {
        setError('Invalid format')
        return
      }
      const nextValue = parseDraftValue(nextDraftValue, resolvedEditor)
      const nextContext = { ...context, value: nextValue }
      const validationError = validateTableCellEdit({
        validate: validateEdit,
        editor: resolvedEditor,
        context: nextContext,
      })

      if (validationError) {
        setError(validationError)
        return
      }

      onCommit?.({
        ...nextContext,
        previousValue: context.value,
      })
      setError(undefined)
      setIsSelectOpen(false)
      shouldRestoreReadFocusRef.current = restoreFocus
      setIsEditing(cellMode === 'edit')
      if (navigate) {
        window.requestAnimationFrame(() => onNavigate?.(navigate, navigationOptions))
      }
    },
    [cellMode, compiledPattern, context, onCommit, onNavigate, resolvedEditor, validateEdit],
  )

  const commitEditing = React.useCallback(
    ({
      restoreFocus = true,
      navigate,
      navigationOptions,
    }: {
      restoreFocus?: boolean
      navigate?: TableEditableCellNavigation
      navigationOptions?: TableEditableCellNavigationOptions
    } = {}) => {
      commitDraftValue(draftValue, { restoreFocus, navigate, navigationOptions })
    },
    [commitDraftValue, draftValue],
  )

  const closeEditing = React.useCallback(
    ({ restoreFocus }: { restoreFocus: boolean }) => {
      setError(undefined)
      setIsSelectOpen(false)
      shouldRestoreReadFocusRef.current = restoreFocus
      setIsEditing(cellMode === 'edit')
    },
    [cellMode],
  )

  const handleEditorKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>) => {
      if (event.key === KEYBOARD_KEYS.escape) {
        event.preventDefault()
        event.stopPropagation()
        cancelEditing()
        return
      }
      if (event.key === KEYBOARD_KEYS.tab) {
        const direction = event.shiftKey ? 'previous' : 'next'
        const moved = onNavigate?.(direction, { probe: true }) === true
        if (!moved) return
        event.preventDefault()
        event.stopPropagation()
        commitEditing({
          restoreFocus: false,
          navigate: direction,
          navigationOptions: { activate: true },
        })
        return
      }
      if (event.key === KEYBOARD_KEYS.arrowUp || event.key === KEYBOARD_KEYS.arrowDown) {
        if ((resolvedEditor.type === 'select' || resolvedEditor.type === 'multi-select') && isSelectOpen) return
        const direction = event.key === KEYBOARD_KEYS.arrowUp ? 'up' : 'down'
        const moved = onNavigate?.(direction, { probe: true }) === true
        if (!moved) return
        event.preventDefault()
        event.stopPropagation()
        commitEditing({
          restoreFocus: false,
          navigate: direction,
          navigationOptions: { activate: true },
        })
        return
      }
      if (event.key === KEYBOARD_KEYS.arrowLeft || event.key === KEYBOARD_KEYS.arrowRight) {
        if ((resolvedEditor.type === 'select' || resolvedEditor.type === 'multi-select') && isSelectOpen) return
        if (
          resolvedEditor.type !== 'select' &&
          resolvedEditor.type !== 'multi-select' &&
          resolvedEditor.type !== 'checkbox'
        ) {
          const input = event.target as HTMLInputElement
          const allSelected = input.selectionStart === 0 && input.selectionEnd === input.value.length
          if (!allSelected) {
            if (input.selectionStart !== input.selectionEnd) return
            if (event.key === KEYBOARD_KEYS.arrowLeft && input.selectionStart !== 0) return
            if (event.key === KEYBOARD_KEYS.arrowRight && input.selectionStart !== input.value.length) return
          }
        }
        const direction = event.key === KEYBOARD_KEYS.arrowLeft ? 'previous' : 'next'
        const moved = onNavigate?.(direction, { probe: true }) === true
        if (!moved) return
        event.preventDefault()
        event.stopPropagation()
        commitEditing({
          restoreFocus: false,
          navigate: direction,
          navigationOptions: { activate: true },
        })
        return
      }
      if (event.key === KEYBOARD_KEYS.enter) {
        event.preventDefault()
        event.stopPropagation()
        commitEditing({ restoreFocus: true })
      }
    },
    [cancelEditing, commitEditing, isSelectOpen, onNavigate, resolvedEditor.type],
  )

  if (!isEditing) {
    return (
      <TableEditableCellReadView
        id={readViewId}
        ref={readViewRef}
        role="button"
        stopClickPropagation
        onActivate={startEditing}
        onNavigate={onReadNavigate ?? onNavigate}
        ariaLabel={ariaLabel}
      >
        {children}
      </TableEditableCellReadView>
    )
  }

  if (resolvedEditor.type === 'select') {
    return (
      <>
        <Select
          id={readViewId}
          ref={controlRef as React.Ref<HTMLButtonElement>}
          size="xs"
          variant="outline"
          defaultOpen={isSelectOpen}
          value={String(draftValue)}
          className={cn(editableCellControl, 'min-w-0')}
          portalContainer={portalContainer}
          onValueChange={(newValue: string | null) => {
            if (newValue === null) return
            selectCommittedRef.current = true
            setDraftValue(newValue)
            commitDraftValue(newValue, { restoreFocus: true })
          }}
          onOpenChange={(open: boolean) => {
            setIsSelectOpen(open)
            if (!open) {
              window.setTimeout(() => {
                if (!selectCommittedRef.current && !shouldRestoreReadFocusRef.current) {
                  closeEditing({ restoreFocus: false })
                }
              }, 0)
            }
          }}
          onClick={event => event.stopPropagation()}
          onKeyDown={event => {
            if (event.key === KEYBOARD_KEYS.escape) {
              event.preventDefault()
              event.stopPropagation()
              cancelEditing()
              return
            }
            handleEditorKeyDown(event as React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>)
          }}
          aria-invalid={error ? true : undefined}
          aria-label={ariaLabel}
        >
          {resolvedEditor.options.map(option => (
            <SelectItem key={String(option.value)} value={String(option.value)}>
              {renderSelectOptionLabel(option)}
            </SelectItem>
          ))}
        </Select>
        {error ? <div className={editableCellError}>{error}</div> : null}
      </>
    )
  }

  if (resolvedEditor.type === 'multi-select') {
    const normalizedFilter = comboboxFilter.toLowerCase()
    const filteredOptions = normalizedFilter
      ? resolvedEditor.options.filter(option => matchesFilter(option, normalizedFilter))
      : resolvedEditor.options

    const commitMultiSelect = ({ restoreFocus = true }: { restoreFocus?: boolean } = {}) => {
      selectCommittedRef.current = true
      const nextDraft = JSON.stringify([...multiSelectSet])
      commitDraftValue(nextDraft, { restoreFocus })
    }

    const commitMultiSelectAndNavigate = (
      direction: TableEditableCellNavigation,
      navigationOptions?: TableEditableCellNavigationOptions,
    ) => {
      selectCommittedRef.current = true
      const nextDraft = JSON.stringify([...multiSelectSet])
      commitDraftValue(nextDraft, { restoreFocus: false, navigate: direction, navigationOptions })
    }

    return (
      <>
        <Combobox.Root
          filter={null}
          open={isSelectOpen}
          value=""
          onValueChange={(newValue: string | null) => {
            if (!newValue) return
            setMultiSelectSet(prev => {
              const next = new Set(prev)
              if (next.has(newValue)) next.delete(newValue)
              else next.add(newValue)
              return next
            })
          }}
          onOpenChange={() => {
            setIsSelectOpen(true)
          }}
          onInputValueChange={(inputVal: string) => {
            setComboboxFilter(inputVal)
            setIsSelectOpen(true)
          }}
        >
          <span className={cn(editableCellEditContainer, 'gap-1')}>
            {!comboboxFilter &&
              resolvedEditor.options
                .filter(o => multiSelectSet.has(String(o.value)) && o.avatar)
                .map(o => (
                  <Avatar
                    key={String(o.value)}
                    src={o.avatar?.src}
                    name={o.avatar?.name}
                    size="xs"
                    className="shrink-0"
                  />
                ))}
            <Combobox.Input
              id={readViewId}
              ref={controlRef as React.Ref<HTMLInputElement>}
              className={cn(editableCellControl, 'min-w-0 flex-1 !w-0')}
              placeholder={multiSelectSet.size > 0 ? `${multiSelectSet.size} selected` : undefined}
              onClick={event => event.stopPropagation()}
              onBlur={event => {
                const nextFocused = event.relatedTarget as Node | null
                window.setTimeout(() => {
                  if (nextFocused && multiSelectPopupRef.current?.contains(nextFocused)) return
                  setIsSelectOpen(false)
                  commitMultiSelect({ restoreFocus: false })
                }, 0)
              }}
              onKeyDown={event => {
                if (event.key === KEYBOARD_KEYS.escape) {
                  event.preventDefault()
                  event.stopPropagation()
                  cancelEditing()
                  return
                }
                if (event.key === KEYBOARD_KEYS.enter) {
                  event.preventDefault()
                  event.stopPropagation()
                  if (isSelectOpen) {
                    commitMultiSelect()
                  } else {
                    setIsSelectOpen(true)
                  }
                  return
                }
                if (event.key === KEYBOARD_KEYS.tab) {
                  const direction = event.shiftKey ? 'previous' : 'next'
                  const moved = onNavigate?.(direction, { probe: true }) === true
                  if (!moved) return
                  event.preventDefault()
                  event.stopPropagation()
                  commitMultiSelectAndNavigate(direction, { activate: true })
                  return
                }
                if (event.key === KEYBOARD_KEYS.arrowUp || event.key === KEYBOARD_KEYS.arrowDown) {
                  if (isSelectOpen) return
                  const direction = event.key === KEYBOARD_KEYS.arrowUp ? 'up' : 'down'
                  const moved = onNavigate?.(direction, { probe: true }) === true
                  if (!moved) return
                  event.preventDefault()
                  event.stopPropagation()
                  commitMultiSelectAndNavigate(direction, { activate: true })
                  return
                }
                if (event.key === KEYBOARD_KEYS.arrowLeft || event.key === KEYBOARD_KEYS.arrowRight) {
                  if (isSelectOpen) return
                  const input = event.target as HTMLInputElement
                  const allSelected = input.selectionStart === 0 && input.selectionEnd === input.value.length
                  if (!allSelected) {
                    if (input.selectionStart !== input.selectionEnd) return
                    if (event.key === KEYBOARD_KEYS.arrowLeft && input.selectionStart !== 0) return
                    if (event.key === KEYBOARD_KEYS.arrowRight && input.selectionStart !== input.value.length) return
                  }
                  const direction = event.key === KEYBOARD_KEYS.arrowLeft ? 'previous' : 'next'
                  const moved = onNavigate?.(direction, { probe: true }) === true
                  if (!moved) return
                  event.preventDefault()
                  event.stopPropagation()
                  commitMultiSelectAndNavigate(direction, { activate: true })
                }
              }}
              aria-invalid={error ? true : undefined}
              aria-label={ariaLabel}
            />
          </span>
          <Combobox.Portal container={portalContainer}>
            <Combobox.Positioner sideOffset={4} side="bottom" align="start">
              <Combobox.Popup
                ref={multiSelectPopupRef}
                className={cn(
                  'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
                  'data-open:animate-in data-closed:animate-out',
                  'data-closed:fade-out-0 data-open:fade-in-0',
                  'data-closed:zoom-out-95 data-open:zoom-in-95',
                )}
              >
                <Combobox.List className="p-1">
                  {filteredOptions.map(option => {
                    const selected = multiSelectSet.has(String(option.value))
                    return (
                      <Combobox.Item
                        key={String(option.value)}
                        value={String(option.value)}
                        className={cn(
                          'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none',
                          'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
                          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                        )}
                      >
                        <SquareIcon className={cn('size-3.5 shrink-0 rounded-sm border', selected ? 'hidden' : '')} />
                        <CheckIcon
                          className={cn(
                            'size-3.5 shrink-0 rounded-sm border bg-primary text-primary-foreground',
                            selected ? '' : 'hidden',
                          )}
                        />
                        {renderSelectOptionLabel(option)}
                      </Combobox.Item>
                    )
                  })}
                  {filteredOptions.length === 0 && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">No matches</div>
                  )}
                </Combobox.List>
                <div className="flex gap-1 border-t p-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    color="neutral"
                    fill
                    onClick={() => cancelEditing()}
                    onMouseDown={event => event.preventDefault()}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="solid"
                    color="secondary"
                    fill
                    onClick={() => commitMultiSelect()}
                    onMouseDown={event => event.preventDefault()}
                  >
                    Done
                  </Button>
                </div>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
        {error ? <div className={editableCellError}>{error}</div> : null}
      </>
    )
  }

  if (resolvedEditor.type === 'checkbox') {
    return (
      <>
        <input
          id={readViewId}
          ref={controlRef as React.Ref<HTMLInputElement>}
          type="checkbox"
          className={editableCellCheckbox}
          checked={Boolean(draftValue)}
          onChange={event => setDraftValue(event.target.checked)}
          onBlur={() => commitEditing({ restoreFocus: false })}
          onKeyDown={handleEditorKeyDown}
          aria-invalid={error ? true : undefined}
          aria-label={ariaLabel}
        />
        {error ? <div className={editableCellError}>{error}</div> : null}
      </>
    )
  }

  return (
    <>
      <input
        id={readViewId}
        ref={controlRef as React.Ref<HTMLInputElement>}
        type="text"
        inputMode={resolvedEditor.type === 'number' ? 'decimal' : undefined}
        className={editableCellControl}
        value={String(draftValue)}
        placeholder={resolvedEditor.type === 'text' ? resolvedEditor.placeholder : undefined}
        onChange={event => {
          const nextValue = event.target.value
          if (resolvedEditor.type === 'number' && !isAllowedNumberDraft(nextValue, resolvedEditor)) return
          setDraftValue(nextValue)
        }}
        onBlur={() => commitEditing({ restoreFocus: false })}
        onKeyDown={handleEditorKeyDown}
        aria-invalid={error ? true : undefined}
        aria-label={ariaLabel}
      />
      {error ? <div className={editableCellError}>{error}</div> : null}
    </>
  )
}

export const TableEditableCell = Object.assign(TableEditableCellRoot, {
  Root: TableEditableCellRoot,
  ReadView: TableEditableCellReadView,
})
