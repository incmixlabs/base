'use client'

import { Check, ChevronDown } from 'lucide-react'
import * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import { isActivationKey } from '@/lib/keyboard-keys'
import { SemanticColor } from '@/theme/props/color.prop'
import type { Color, Radius, Responsive, Variant } from '@/theme/tokens'
import { DropdownMenu } from '../menu/DropdownMenu'
import type { MenuSize } from '../menu/menu.props'
import { Button } from './Button'
import type { buttonPropDefs } from './button.props'
import { Icon } from './Icon'

// ============================================================================
// Types
// ============================================================================

export interface SplitButtonItem {
  /** Unique identifier for this item */
  id: string
  /** Display label */
  label: string
  /** Description shown below the label */
  description?: string
  /** Lucide icon name */
  icon?: string
  /** Submenu content rendered when this item has child actions (e.g. a Select) */
  children?: React.ReactNode
  /** Click handler for direct action items (items without children) */
  onClick?: () => void
  /** Whether this item is disabled */
  disabled?: boolean
}

type ButtonSize = (typeof buttonPropDefs.size.values)[number]

export type SplitButtonRenderItem = (
  item: SplitButtonItem,
  defaultRender: React.ReactNode,
  meta: { isSelected: boolean },
) => React.ReactNode

export interface SplitButtonProps {
  /** Dropdown items */
  items: SplitButtonItem[]
  /** Controlled selected item id */
  value?: string
  /** Default selected item id (uncontrolled) */
  defaultValue?: string
  /** Callback when selection changes */
  onValueChange?: (value: string) => void
  /** Callback when main button is clicked with the current selected item */
  onAction?: (item: SplitButtonItem) => void
  /** Custom renderer for dropdown menu items */
  renderItem?: SplitButtonRenderItem
  /** Button size */
  size?: Responsive<ButtonSize>
  /** Visual variant */
  variant?: Variant
  /** Color scheme */
  color?: Color
  /** Border radius */
  radius?: Radius
  /** Whether the button is loading */
  loading?: boolean
  /** Whether the button is disabled */
  disabled?: boolean
  /** High contrast mode */
  highContrast?: boolean
  /** Inverse text treatment */
  inverse?: boolean
  /** Override icon at the start of button label */
  iconStart?: string
  /** Override icon at the end of button label (before dropdown trigger) */
  iconEnd?: string
  /** Dropdown menu size */
  menuSize?: MenuSize
  /** Dropdown alignment */
  menuAlign?: 'start' | 'center' | 'end'
  /** Additional class name for the root container */
  className?: string
}

// ============================================================================
// SplitButton
// ============================================================================

export const SplitButton = React.forwardRef<HTMLButtonElement, SplitButtonProps>(
  (
    {
      items,
      value: controlledValue,
      defaultValue,
      onValueChange,
      onAction,
      renderItem,
      size = 'md',
      variant = 'soft',
      color = SemanticColor.primary,
      radius,
      loading = false,
      disabled = false,
      highContrast = false,
      inverse = false,
      iconStart,
      iconEnd,
      menuSize = 'md',
      menuAlign = 'end',
      className,
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? items[0]?.id)
    const selectedId = controlledValue ?? internalValue

    const selectedItem = React.useMemo(
      () => items.find(item => item.id === selectedId) ?? items[0],
      [items, selectedId],
    )

    const handleSelect = React.useCallback(
      (item: SplitButtonItem) => {
        if (controlledValue === undefined) {
          setInternalValue(item.id)
        }
        onValueChange?.(item.id)
      },
      [controlledValue, onValueChange],
    )

    const handleAction = React.useCallback(() => {
      if (selectedItem) {
        onAction?.(selectedItem)
      }
    }, [selectedItem, onAction])

    if (items.length === 0) {
      return null
    }

    const resolvedIconStart = iconStart ?? selectedItem?.icon

    return (
      <Flex display="inline-flex" className={className}>
        {/* Main action button */}
        <Button
          ref={ref}
          size={size}
          variant={variant}
          color={color}
          radius={radius}
          loading={loading}
          disabled={disabled}
          highContrast={highContrast}
          inverse={inverse}
          iconStart={resolvedIconStart}
          iconEnd={iconEnd}
          onClick={handleAction}
          className="rounded-r-none border-r-0"
        >
          {selectedItem?.label}
        </Button>

        {/* Dropdown trigger */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button
              size={size}
              variant={variant}
              color={color}
              radius={radius}
              disabled={disabled || loading}
              highContrast={highContrast}
              inverse={inverse}
              aria-label="Open options"
              className="rounded-l-none px-2"
            >
              <ChevronDown className="h-4 w-4" aria-hidden />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content size={menuSize} align={menuAlign} sideOffset={4}>
            {items.map(item => {
              const isSelected = item.id === selectedId
              const hasChildren = item.children != null

              if (hasChildren) {
                const defaultSubRender = (
                  <DropdownMenu.Sub>
                    <SplitButtonSubTrigger item={item} isSelected={isSelected} onSelect={handleSelect} />
                    <DropdownMenu.SubContent>{item.children}</DropdownMenu.SubContent>
                  </DropdownMenu.Sub>
                )
                return (
                  <React.Fragment key={item.id}>
                    {renderItem ? renderItem(item, defaultSubRender, { isSelected }) : defaultSubRender}
                  </React.Fragment>
                )
              }

              const defaultRender = <SplitButtonMenuItem item={item} isSelected={isSelected} onSelect={handleSelect} />
              return (
                <React.Fragment key={item.id}>
                  {renderItem ? renderItem(item, defaultRender, { isSelected }) : defaultRender}
                </React.Fragment>
              )
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    )
  },
)

SplitButton.displayName = 'SplitButton'

// ============================================================================
// Internal menu item (no children)
// ============================================================================

interface SplitButtonMenuItemProps {
  item: SplitButtonItem
  isSelected: boolean
  onSelect: (item: SplitButtonItem) => void
}

function SplitButtonMenuItem({ item, isSelected, onSelect }: SplitButtonMenuItemProps) {
  return (
    <DropdownMenu.Item
      disabled={item.disabled}
      onClick={() => {
        onSelect(item)
        item.onClick?.()
      }}
    >
      <Flex as="span" display="inline-flex" align="center" gap="3" width="100%">
        {/* Check indicator */}
        <Flex as="span" align="center" justify="center" width="16px" flexShrink="0">
          {isSelected && <Check className="h-4 w-4" aria-hidden />}
        </Flex>
        {/* Icon */}
        {item.icon && (
          <Flex as="span" align="center" flexShrink="0">
            <Icon icon={item.icon} />
          </Flex>
        )}
        {/* Label + description */}
        <Flex as="span" direction="column" minWidth="0" flexGrow="1">
          <span className="truncate font-semibold">{item.label}</span>
          {item.description && <span className="truncate text-xs text-foreground/70">{item.description}</span>}
        </Flex>
      </Flex>
    </DropdownMenu.Item>
  )
}

// ============================================================================
// Internal sub-trigger item (has children)
// ============================================================================

interface SplitButtonSubTriggerProps {
  item: SplitButtonItem
  isSelected: boolean
  onSelect: (item: SplitButtonItem) => void
}

function SplitButtonSubTrigger({ item, isSelected, onSelect }: SplitButtonSubTriggerProps) {
  return (
    <DropdownMenu.SubTrigger
      disabled={item.disabled}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation()
        onSelect(item)
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (isActivationKey(e.key)) {
          e.stopPropagation()
          onSelect(item)
        }
      }}
    >
      <Flex as="span" display="inline-flex" align="center" gap="3" width="100%">
        {/* Check indicator */}
        <Flex as="span" align="center" justify="center" className="w-4 shrink-0">
          {isSelected && <Check className="h-4 w-4" aria-hidden />}
        </Flex>
        {/* Icon */}
        {item.icon && (
          <Flex as="span" align="center" className="shrink-0">
            <Icon icon={item.icon} />
          </Flex>
        )}
        {/* Label + description */}
        <Flex as="span" direction="column" className="min-w-0 flex-1">
          <span className="truncate font-semibold">{item.label}</span>
          {item.description && <span className="truncate text-xs text-foreground/70">{item.description}</span>}
        </Flex>
      </Flex>
    </DropdownMenu.SubTrigger>
  )
}
