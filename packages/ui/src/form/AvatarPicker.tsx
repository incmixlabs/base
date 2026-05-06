'use client'

import { Check, ChevronDown, X } from 'lucide-react'
import * as React from 'react'
import { IconButton } from '@/elements'
import { Avatar, type AvatarHoverCardData, type AvatarSize } from '@/elements/avatar/Avatar'
import { AvatarGroup } from '@/elements/avatar/AvatarGroup'
import { AvatarListHoverCard } from '@/elements/avatar/AvatarListHoverCard'
import { avatarSizeStyles } from '@/elements/avatar/avatar.context'
import type { AvatarListItem } from '@/elements/avatar/avatar-list.props'
import type { AvatarListEntry } from '@/elements/avatar/avatar-list-hover-card.shared'
import { Flex } from '@/layouts/flex/Flex'
import { isActivationKey, KEYBOARD_KEYS } from '@/lib/keyboard-keys'
import { partitionVisibleOverflow } from '@/lib/overflow'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import { Text } from '@/typography'
import {
  avatarPickerDropdownCls,
  avatarPickerInlineCls,
  avatarPickerRootCls,
  avatarPickerTriggerContentCls,
} from './avatar-picker.css'
import { avatarPickerPropDefs } from './avatar-picker.props'
import { useFieldGroup } from './FieldGroupContext'
import { formColorVars } from './form-color'
import { type FormSize, resolveFormSize } from './form-size'
import { MultiSelect, type MultiSelectOption } from './MultiSelect'
import {
  pickerEmptyStateBase,
  pickerEmptyStateBySize,
  pickerIndicatorBySize,
  pickerOptionItemBase,
  pickerOptionItemBySize,
  pickerPopupBase,
  pickerPopupViewportBase,
  pickerPopupViewportBySize,
  pickerSearchRowBase,
} from './picker-popup.css'
import { SearchInput } from './SearchInput'
import { textFieldColorVariants, textFieldInputBaseCls, textFieldSizeVariants } from './text-field.css'
import { resolveSurfaceVariant } from './text-field-variant'
import { highlightColorStyles } from './textFieldStyles'

/**
 * Represents an item that can be selected in the AvatarPicker
 */
export type AvatarItem = AvatarListItem

export interface AvatarPickerProps {
  /** DOM id for the trigger element */
  id?: string
  /** External label element id */
  ariaLabelledby?: string
  /** List of items to choose from */
  items: AvatarItem[]
  /** Enable multiple selection with checkboxes */
  multiple?: boolean
  /** Selected item ID(s) - single ID for single mode, array for multiple */
  value?: string | string[]
  /** Callback when selection changes */
  onValueChange?: (value: string | string[]) => void
  /** Called when user confirms multi-selection (shows "Add" button when provided in multiple mode) */
  onApply?: (selectedItems: AvatarItem[]) => void
  /** Called when the picker wants to close itself (inline mode). Forwarded to MultiSelect. */
  onClose?: () => void
  /** Render only the dropdown content (no trigger button). Useful when embedding inside another component. */
  inline?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Search placeholder */
  searchPlaceholder?: string
  /** Size of the picker */
  size?: FormSize
  /** Highlight color for dropdown items */
  highlightColor?: Color
  /** Whether the picker is in an invalid/error state */
  error?: boolean
  /** Whether the picker is disabled */
  disabled?: boolean
  /** Show search input */
  searchable?: boolean
  /** Maximum height of dropdown */
  maxHeight?: number
  /** Custom render function for items (single-select mode only) */
  renderItem?: (item: AvatarItem, isSelected: boolean, isHighlighted: boolean) => React.ReactNode
  /** Text when no items match search */
  noResultsText?: string
  /** Additional class names */
  className?: string
  /** External search text (e.g. from a trigger query). Used until the user types in the search input. */
  defaultSearch?: string
  /** Show shared hover cards for avatar surfaces */
  showHoverCard?: boolean | AvatarHoverCardData
}

/**
 * A dropdown picker for selecting items with avatars.
 *
 * Multi-select mode delegates to MultiSelect for dropdown/search/selection logic.
 * Single-select mode uses a simplified trigger + dropdown.
 */
/** AvatarPicker export. */

const avatarPickerTextSizeBySize: Record<FormSize, 'xs' | 'sm' | 'md' | 'lg'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

export const AvatarPicker = React.forwardRef<HTMLDivElement, AvatarPickerProps>(
  (
    {
      items,
      id,
      ariaLabelledby,
      multiple = false,
      value,
      onValueChange,
      onApply,
      onClose,
      inline = false,
      placeholder = 'Select...',
      searchPlaceholder = 'Search...',
      size: sizeProp,
      highlightColor = SemanticColor.slate,
      error = false,
      disabled: disabledProp = false,
      searchable = true,
      maxHeight = 300,
      renderItem,
      noResultsText = 'No results found',
      className,
      defaultSearch,
      showHoverCard = true,
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const requestedSize = (sizeProp ?? fieldGroup.size ?? avatarPickerPropDefs.size.default) as FormSize
    const size = resolveFormSize(requestedSize)
    const disabled = disabledProp || fieldGroup.readOnly
    const avatarSize = size as AvatarSize
    const textSize = avatarPickerTextSizeBySize[size]
    const effectiveHighlightColor = error ? SemanticColor.error : highlightColor

    // Controlled / uncontrolled selection handling
    const [internalValue, setInternalValue] = React.useState<string[]>([])
    const isControlled = value !== undefined
    const selectedIds = React.useMemo(() => {
      const v = isControlled ? value : internalValue
      if (!v) return []
      return Array.isArray(v) ? v : [v]
    }, [isControlled, value, internalValue])

    const selectedItems = React.useMemo(() => items.filter(item => selectedIds.includes(item.id)), [items, selectedIds])

    // ── Multi-select mode: delegate to MultiSelect ──
    if (multiple) {
      // Map AvatarItem[] → MultiSelectOption[] with Avatar as icon
      const options: MultiSelectOption[] = items.map(item => ({
        value: item.id,
        label: item.name,
        icon: (
          <Avatar
            id={item.id}
            src={item.avatar}
            name={item.name}
            title={item.title}
            email={item.email}
            description={item.description}
            presence={item.presence}
            managerId={item.managerId}
            size={avatarSize}
            hoverCard={item.hoverCard ?? showHoverCard}
          />
        ),
        disabled: item.disabled,
      }))

      const handleMultiChange = (newIds: string[]) => {
        if (!isControlled) setInternalValue(newIds)
        onValueChange?.(newIds)
      }

      const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (disabled) return
        if (!isControlled) setInternalValue([])
        onValueChange?.([])
      }

      if (inline) {
        // Inline multi-select: popup wrapper + MultiSelect (footer handled by MultiSelect via onApply)
        return (
          <div
            ref={ref}
            className={cn(pickerPopupBase, avatarPickerInlineCls, textFieldSizeVariants[size], className)}
            style={formColorVars[effectiveHighlightColor] as React.CSSProperties}
          >
            <MultiSelect
              inline
              options={options}
              value={selectedIds}
              onChange={handleMultiChange}
              size={size}
              color={effectiveHighlightColor}
              searchable={searchable}
              searchPlaceholder={searchPlaceholder}
              error={error}
              disabled={disabled}
              defaultSearch={defaultSearch}
              onClose={onClose}
              onApply={
                onApply
                  ? () => {
                      onApply(selectedItems)
                    }
                  : undefined
              }
            />
          </div>
        )
      }

      // Non-inline multi-select: AvatarGroup trigger + MultiSelect dropdown
      return (
        <AvatarPickerMultiTrigger
          ref={ref}
          id={id}
          ariaLabelledby={ariaLabelledby}
          options={options}
          selectedIds={selectedIds}
          selectedItems={selectedItems}
          onMultiChange={handleMultiChange}
          onClear={handleClear}
          onApply={onApply}
          onClose={onClose}
          size={size}
          avatarSize={avatarSize}
          textSize={textSize}
          highlightColor={effectiveHighlightColor}
          error={error}
          disabled={disabled}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          placeholder={placeholder}
          className={className}
          defaultSearch={defaultSearch}
          showHoverCard={showHoverCard}
        />
      )
    }

    // ── Single-select mode: simplified trigger + dropdown ──
    return (
      <AvatarPickerSingle
        ref={ref}
        {...{
          items,
          id,
          ariaLabelledby,
          onValueChange,
          inline,
          placeholder,
          searchPlaceholder,
          size,
          highlightColor: effectiveHighlightColor,
          error,
          disabled,
          searchable,
          maxHeight,
          renderItem,
          noResultsText,
          className,
          selectedIds,
          selectedItems,
          isControlled,
          setInternalValue,
          avatarSize,
          textSize,
          defaultSearch,
          showHoverCard,
        }}
      />
    )
  },
)

AvatarPicker.displayName = 'AvatarPicker'

// ── Multi-select trigger implementation ──
// Uses AvatarGroup in the trigger and MultiSelect inline for the dropdown content.

const AVATAR_PICKER_MAX_VISIBLE_AVATARS = 3

interface AvatarPickerMultiTriggerProps {
  id?: string
  ariaLabelledby?: string
  options: MultiSelectOption[]
  selectedIds: string[]
  selectedItems: AvatarItem[]
  onMultiChange: (ids: string[]) => void
  onClear: (e: React.MouseEvent) => void
  onApply?: (selectedItems: AvatarItem[]) => void
  onClose?: () => void
  size: FormSize
  avatarSize: AvatarSize
  textSize: 'xs' | 'sm' | 'md' | 'lg'
  highlightColor: Color
  error: boolean
  disabled: boolean
  searchable: boolean
  searchPlaceholder: string
  placeholder: string
  className?: string
  defaultSearch?: string
  showHoverCard: boolean | AvatarHoverCardData
}

const AvatarPickerMultiTrigger = React.forwardRef<HTMLDivElement, AvatarPickerMultiTriggerProps>(
  (
    {
      options,
      id,
      ariaLabelledby,
      selectedIds,
      selectedItems,
      onMultiChange,
      onClear,
      onApply,
      onClose,
      size,
      avatarSize,
      textSize,
      highlightColor,
      error,
      disabled,
      searchable,
      searchPlaceholder,
      placeholder,
      className,
      defaultSearch,
      showHoverCard,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const triggerRef = React.useRef<HTMLDivElement>(null)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const summaryId = React.useId()

    React.useImperativeHandle(ref, () => triggerRef.current as HTMLDivElement)

    const surfaceVariant = resolveSurfaceVariant(useFieldGroup().variant ?? 'outline', { allowLegacy: true })

    const { visibleItems: visibleSelectedItems, overflowCount: hiddenSelectedCount } = React.useMemo(
      () => partitionVisibleOverflow(selectedItems, AVATAR_PICKER_MAX_VISIBLE_AVATARS),
      [selectedItems],
    )

    const selectedSummary = React.useMemo(() => {
      if (selectedItems.length === 0) return placeholder
      const visibleNames = visibleSelectedItems.map(item => item.name).join(', ')
      return hiddenSelectedCount > 0 ? `${visibleNames} +${hiddenSelectedCount}` : visibleNames
    }, [hiddenSelectedCount, placeholder, selectedItems.length, visibleSelectedItems])
    const hoverCardConfig = typeof showHoverCard === 'object' ? showHoverCard : undefined
    const selectedListEntries = React.useMemo<AvatarListEntry[]>(
      () =>
        selectedItems.map(item => {
          const itemHoverData = typeof item.hoverCard === 'object' ? item.hoverCard : undefined

          return {
            key: item.id,
            size: avatarSize,
            avatar: {
              id: item.id,
              src: item.avatar,
              name: item.name,
              size: avatarSize,
              radius: 'full',
            },
            title: itemHoverData?.title ?? item.title ?? item.name,
            email: itemHoverData?.email ?? item.email,
            description: itemHoverData?.description ?? item.description,
            presence: itemHoverData?.presence ?? item.presence,
            managerId: itemHoverData?.managerId ?? item.managerId,
          }
        }),
      [avatarSize, selectedItems],
    )

    // Close when clicking outside
    React.useEffect(() => {
      if (!isOpen) return
      const handleClickOutside = (e: PointerEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false)
        }
      }
      document.addEventListener('pointerdown', handleClickOutside)
      return () => document.removeEventListener('pointerdown', handleClickOutside)
    }, [isOpen])

    return (
      <div
        className={cn(avatarPickerRootCls, textFieldSizeVariants[size], className)}
        style={formColorVars[highlightColor] as React.CSSProperties}
      >
        <div
          ref={triggerRef}
          id={id}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-labelledby={[ariaLabelledby, summaryId].filter(Boolean).join(' ') || undefined}
          aria-invalid={error || undefined}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={event => {
            if (disabled) return
            const target = event.target
            if (target instanceof HTMLElement && target.closest('button')) return
            setIsOpen(open => !open)
          }}
          onKeyDown={e => {
            if (disabled || e.target !== e.currentTarget) return
            if (e.key === KEYBOARD_KEYS.arrowDown || isActivationKey(e.key)) {
              e.preventDefault()
              setIsOpen(true)
            }
            if (e.key === KEYBOARD_KEYS.escape) setIsOpen(false)
          }}
          className={cn(
            textFieldInputBaseCls,
            'inline-flex w-full items-center justify-between gap-2 box-border border',
            'min-h-[var(--tf-height)] px-[var(--tf-padding-x)] py-[var(--tf-padding-y)] text-left',
            'text-[length:var(--tf-font-size)] leading-[var(--tf-line-height)] rounded-[var(--element-border-radius)]',
            textFieldColorVariants[highlightColor][surfaceVariant],
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          {selectedItems.length === 0 ? (
            <div className={avatarPickerTriggerContentCls}>
              <Text id={summaryId} size={textSize} color="neutral" truncate>
                {placeholder}
              </Text>
            </div>
          ) : showHoverCard ? (
            <AvatarListHoverCard
              entries={selectedListEntries}
              size={avatarSize}
              title={hoverCardConfig?.title ?? 'People'}
              color={hoverCardConfig?.color}
              variant={hoverCardConfig?.variant}
              highContrast={hoverCardConfig?.highContrast}
              radius={hoverCardConfig?.radius}
            >
              <div className={avatarPickerTriggerContentCls}>
                <AvatarGroup
                  size={avatarSize}
                  max={AVATAR_PICKER_MAX_VISIBLE_AVATARS}
                  hoverCard={false}
                  renderOverflow={count => (
                    <span
                      className={cn(
                        'inline-flex shrink-0 items-center justify-center rounded-full border bg-muted text-muted-foreground font-medium',
                        avatarSizeStyles[avatarSize],
                      )}
                    >
                      +{count}
                    </span>
                  )}
                >
                  {selectedItems.map(item => (
                    <Avatar
                      key={item.id}
                      id={item.id}
                      src={item.avatar}
                      name={item.name}
                      title={item.title}
                      email={item.email}
                      description={item.description}
                      presence={item.presence}
                      managerId={item.managerId}
                      size={avatarSize}
                      hoverCard={false}
                    />
                  ))}
                </AvatarGroup>
                <Text size={textSize} truncate title={selectedItems.map(item => item.name).join(', ')}>
                  <span id={summaryId}>{selectedSummary}</span>
                </Text>
              </div>
            </AvatarListHoverCard>
          ) : (
            <div className={avatarPickerTriggerContentCls}>
              <AvatarGroup
                size={avatarSize}
                max={AVATAR_PICKER_MAX_VISIBLE_AVATARS}
                hoverCard={false}
                renderOverflow={count => (
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center justify-center rounded-full border bg-muted text-muted-foreground font-medium',
                      avatarSizeStyles[avatarSize],
                    )}
                  >
                    +{count}
                  </span>
                )}
              >
                {selectedItems.map(item => (
                  <Avatar
                    key={item.id}
                    id={item.id}
                    src={item.avatar}
                    name={item.name}
                    title={item.title}
                    email={item.email}
                    description={item.description}
                    presence={item.presence}
                    managerId={item.managerId}
                    size={avatarSize}
                    hoverCard={item.hoverCard ?? showHoverCard}
                  />
                ))}
              </AvatarGroup>
              <Text size={textSize} truncate title={selectedItems.map(item => item.name).join(', ')}>
                <span id={summaryId}>{selectedSummary}</span>
              </Text>
            </div>
          )}
          <Flex align="center" gap="1">
            {selectedItems.length > 0 && (
              <IconButton size="xs" variant="ghost" onClick={onClear} aria-label="Clear selection" disabled={disabled}>
                <X className={cn('opacity-50', pickerIndicatorBySize[size])} />
              </IconButton>
            )}
            <ChevronDown
              className={cn(
                'shrink-0 opacity-50 transition-transform',
                pickerIndicatorBySize[size],
                isOpen && 'rotate-180',
              )}
            />
          </Flex>
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            role="dialog"
            aria-label="Multi-select options"
            className={cn(avatarPickerDropdownCls, pickerPopupBase)}
            onKeyDown={e => {
              if (e.key === KEYBOARD_KEYS.escape) {
                e.preventDefault()
                e.stopPropagation()
                setIsOpen(false)
                triggerRef.current?.focus()
              }
            }}
          >
            <MultiSelect
              inline
              options={options}
              value={selectedIds}
              onChange={onMultiChange}
              size={size}
              color={highlightColor}
              error={error}
              searchable={searchable}
              searchPlaceholder={searchPlaceholder}
              disabled={disabled}
              defaultSearch={defaultSearch}
              onClose={onClose}
              onApply={
                onApply
                  ? () => {
                      onApply(selectedItems)
                    }
                  : undefined
              }
            />
          </div>
        )}
      </div>
    )
  },
)

AvatarPickerMultiTrigger.displayName = 'AvatarPickerMultiTrigger'

// ── Single-select implementation ──
// Kept separate to isolate single-select state/effects from multi-select (which delegates to MultiSelect).

interface AvatarPickerSingleProps {
  id?: string
  ariaLabelledby?: string
  items: AvatarItem[]
  onValueChange?: (value: string | string[]) => void
  inline: boolean
  placeholder: string
  searchPlaceholder: string
  size: FormSize
  highlightColor: Color
  error: boolean
  disabled: boolean
  searchable: boolean
  maxHeight: number
  renderItem?: AvatarPickerProps['renderItem']
  noResultsText: string
  className?: string
  selectedIds: string[]
  selectedItems: AvatarItem[]
  isControlled: boolean
  setInternalValue: React.Dispatch<React.SetStateAction<string[]>>
  avatarSize: AvatarSize
  textSize: 'xs' | 'sm' | 'md' | 'lg'
  defaultSearch?: string
  showHoverCard: boolean | AvatarHoverCardData
}

const AvatarPickerSingle = React.forwardRef<HTMLDivElement, AvatarPickerSingleProps>(
  (
    {
      items,
      id,
      ariaLabelledby,
      onValueChange,
      inline,
      placeholder,
      searchPlaceholder,
      size,
      highlightColor,
      error,
      disabled,
      searchable,
      maxHeight,
      renderItem,
      noResultsText,
      className,
      selectedIds,
      selectedItems,
      isControlled,
      setInternalValue,
      avatarSize,
      textSize,
      defaultSearch,
      showHoverCard,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchInput, setSearchInput] = React.useState<string | null>(null)
    const searchTerm = searchInput ?? defaultSearch ?? ''
    const [highlightedIndex, setHighlightedIndex] = React.useState(0)
    const summaryId = React.useId()

    const triggerRef = React.useRef<HTMLDivElement>(null)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const searchInputRef = React.useRef<HTMLInputElement>(null)
    const optionRefs = React.useRef<Array<HTMLElement | null>>([])
    const wasOpenRef = React.useRef(false)
    const listboxId = React.useId()

    React.useImperativeHandle(ref, () => triggerRef.current as HTMLDivElement)

    const surfaceVariant = resolveSurfaceVariant(useFieldGroup().variant ?? 'outline', { allowLegacy: true })

    const filteredItems = React.useMemo(() => {
      if (!searchTerm) return items
      const lower = searchTerm.toLowerCase()
      return items.filter(
        item => item.name.toLowerCase().includes(lower) || item.description?.toLowerCase().includes(lower),
      )
    }, [items, searchTerm])

    React.useEffect(() => {
      if (highlightedIndex >= filteredItems.length && filteredItems.length > 0) {
        setHighlightedIndex(0)
      }
    }, [filteredItems.length, highlightedIndex])

    const handleSelect = React.useCallback(
      (item: AvatarItem) => {
        if (disabled || item.disabled) return
        if (!isControlled) setInternalValue([item.id])
        onValueChange?.(item.id)
        setIsOpen(false)
      },
      [disabled, onValueChange, isControlled, setInternalValue],
    )

    // Close dropdown when disabled changes to true
    React.useEffect(() => {
      if (disabled) setIsOpen(false)
    }, [disabled])

    const handleTriggerKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled || e.target !== e.currentTarget) return
        if (!isOpen) {
          if (isActivationKey(e.key) || e.key === KEYBOARD_KEYS.arrowDown) {
            e.preventDefault()
            setIsOpen(true)
          }
          return
        }
        if (filteredItems.length === 0) {
          if (e.key === KEYBOARD_KEYS.escape) {
            e.preventDefault()
            setIsOpen(false)
          }
          return
        }
        switch (e.key) {
          case KEYBOARD_KEYS.arrowDown:
            e.preventDefault()
            setHighlightedIndex(i => (i + 1) % filteredItems.length)
            break
          case KEYBOARD_KEYS.arrowUp:
            e.preventDefault()
            setHighlightedIndex(i => (i - 1 + filteredItems.length) % filteredItems.length)
            break
          case KEYBOARD_KEYS.enter:
            e.preventDefault()
            if (filteredItems[highlightedIndex]) handleSelect(filteredItems[highlightedIndex])
            break
          case KEYBOARD_KEYS.escape:
            e.preventDefault()
            setIsOpen(false)
            break
        }
      },
      [disabled, isOpen, filteredItems, highlightedIndex, handleSelect],
    )

    const handlePopupKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === KEYBOARD_KEYS.escape) {
          event.preventDefault()
          event.stopPropagation()
          setIsOpen(false)
          triggerRef.current?.focus()
          return
        }
        if (filteredItems.length === 0) return
        if (event.key === KEYBOARD_KEYS.arrowDown) {
          event.preventDefault()
          setHighlightedIndex(i => (i + 1) % filteredItems.length)
          return
        }
        if (event.key === KEYBOARD_KEYS.arrowUp) {
          event.preventDefault()
          setHighlightedIndex(i => (i - 1 + filteredItems.length) % filteredItems.length)
          return
        }
        if (event.target instanceof HTMLInputElement) {
          if (event.key === KEYBOARD_KEYS.enter) {
            event.preventDefault()
            if (filteredItems[highlightedIndex]) handleSelect(filteredItems[highlightedIndex])
          }
          return
        }
        if (isActivationKey(event.key)) {
          event.preventDefault()
          if (filteredItems[highlightedIndex]) handleSelect(filteredItems[highlightedIndex])
        }
      },
      [filteredItems, handleSelect, highlightedIndex],
    )

    // Close when clicking outside
    React.useEffect(() => {
      if (!isOpen) return

      const handleClickOutside = (e: PointerEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false)
        }
      }
      document.addEventListener('pointerdown', handleClickOutside)
      return () => document.removeEventListener('pointerdown', handleClickOutside)
    }, [isOpen])

    // Focus management
    React.useEffect(() => {
      if (inline && searchable) {
        setTimeout(() => searchInputRef.current?.focus(), 0)
        return
      }
      const justOpened = isOpen && !wasOpenRef.current
      wasOpenRef.current = isOpen
      if (justOpened && searchable) {
        setTimeout(() => searchInputRef.current?.focus(), 0)
      } else if (justOpened && filteredItems.length > 0) {
        setTimeout(() => optionRefs.current[highlightedIndex]?.focus(), 0)
      }
      if (!isOpen) {
        setSearchInput(null)
        setHighlightedIndex(0)
      }
    }, [filteredItems.length, highlightedIndex, inline, isOpen, searchable])

    React.useEffect(() => {
      if (!isOpen || searchable || filteredItems.length === 0) return
      const node = optionRefs.current[highlightedIndex]
      node?.focus()
      node?.scrollIntoView({ block: 'nearest' })
    }, [filteredItems.length, highlightedIndex, isOpen, searchable])

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!isControlled) setInternalValue([])
      onValueChange?.('')
    }

    const renderAvatar = (item: AvatarItem) => (
      <Avatar
        id={item.id}
        src={item.avatar}
        name={item.name}
        title={item.title}
        email={item.email}
        description={item.description}
        presence={item.presence}
        managerId={item.managerId}
        size={avatarSize}
        hoverCard={item.hoverCard ?? showHoverCard}
      />
    )

    const defaultRenderItem = (item: AvatarItem, isSelected: boolean, _isHighlighted: boolean) => (
      <Flex align="center" gap="2" className={cn('min-w-0 flex-1', item.disabled && 'opacity-50')}>
        {renderAvatar(item)}
        <Flex direction="column" className="min-w-0 flex-1">
          <Text size={textSize} weight="medium" truncate>
            {item.name}
          </Text>
          {item.description ? (
            <Text size="xs" color="neutral" truncate>
              {item.description}
            </Text>
          ) : null}
        </Flex>
        {isSelected && <Check className={cn('shrink-0 text-[color:var(--fc-primary)]', pickerIndicatorBySize[size])} />}
      </Flex>
    )

    const firstSelected = selectedItems[0]

    const dropdownContent = (
      <div
        ref={dropdownRef}
        className={cn(inline ? avatarPickerInlineCls : avatarPickerDropdownCls, pickerPopupBase, className)}
      >
        {searchable && (
          <Flex align="center" gap="2" className={pickerSearchRowBase}>
            <SearchInput
              ref={searchInputRef}
              disabled={disabled}
              m="0"
              value={searchTerm}
              onChange={event => setSearchInput(event.target.value)}
              onKeyDown={handlePopupKeyDown}
              onClick={event => event.stopPropagation()}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              size={size}
              variant="outline"
              className="flex-1"
            />
          </Flex>
        )}

        <div
          id={listboxId}
          className={cn(pickerPopupViewportBase, pickerPopupViewportBySize[size])}
          style={{ maxHeight }}
          role="listbox"
          onKeyDown={handlePopupKeyDown}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const isSelected = selectedIds.includes(item.id)
              const isHighlighted = index === highlightedIndex
              return (
                <Flex
                  key={item.id}
                  ref={node => {
                    optionRefs.current[index] = node
                  }}
                  id={`${listboxId}-option-${item.id}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={disabled || item.disabled || undefined}
                  tabIndex={disabled || item.disabled ? -1 : index === highlightedIndex ? 0 : -1}
                  align="center"
                  onClick={() => handleSelect(item)}
                  onFocus={() => setHighlightedIndex(index)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    'relative',
                    pickerOptionItemBase,
                    pickerOptionItemBySize[size],
                    (isSelected || isHighlighted) && highlightColorStyles[highlightColor],
                    item.disabled && 'pointer-events-none opacity-50',
                  )}
                >
                  {renderItem
                    ? renderItem(item, isSelected, isHighlighted)
                    : defaultRenderItem(item, isSelected, isHighlighted)}
                </Flex>
              )
            })
          ) : (
            <div className={cn(pickerEmptyStateBase, pickerEmptyStateBySize[size])}>{noResultsText}</div>
          )}
        </div>
      </div>
    )

    if (inline) {
      return (
        <div className={cn(textFieldSizeVariants[size])} style={formColorVars[highlightColor] as React.CSSProperties}>
          {dropdownContent}
        </div>
      )
    }

    return (
      <div
        className={cn(avatarPickerRootCls, textFieldSizeVariants[size], className)}
        style={formColorVars[highlightColor] as React.CSSProperties}
      >
        <div
          ref={triggerRef}
          id={id}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-labelledby={[ariaLabelledby, summaryId].filter(Boolean).join(' ') || undefined}
          aria-invalid={error || undefined}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={isOpen ? listboxId : undefined}
          onClick={event => {
            if (disabled) return
            const target = event.target
            if (target instanceof HTMLElement && target.closest('button')) return
            setIsOpen(open => !open)
          }}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            textFieldInputBaseCls,
            'inline-flex w-full items-center justify-between gap-2 box-border border',
            'min-h-[var(--tf-height)] px-[var(--tf-padding-x)] py-[var(--tf-padding-y)] text-left',
            'text-[length:var(--tf-font-size)] leading-[var(--tf-line-height)] rounded-[var(--element-border-radius)]',
            textFieldColorVariants[highlightColor][surfaceVariant],
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <div className={avatarPickerTriggerContentCls}>
            {firstSelected ? (
              <>
                {renderAvatar(firstSelected)}
                <Text id={summaryId} size={textSize} truncate>
                  {firstSelected.name}
                </Text>
              </>
            ) : (
              <Text id={summaryId} size={textSize} color="neutral" truncate>
                {placeholder}
              </Text>
            )}
          </div>
          <Flex align="center" gap="1">
            {selectedItems.length > 0 && (
              <IconButton
                size="xs"
                variant="ghost"
                onClick={handleClear}
                aria-label="Clear selection"
                disabled={disabled}
              >
                <X className={cn('opacity-50', pickerIndicatorBySize[size])} />
              </IconButton>
            )}
            <ChevronDown
              className={cn(
                'shrink-0 opacity-50 transition-transform',
                pickerIndicatorBySize[size],
                isOpen && 'rotate-180',
              )}
            />
          </Flex>
        </div>
        {isOpen && dropdownContent}
      </div>
    )
  },
)

AvatarPickerSingle.displayName = 'AvatarPickerSingle'
