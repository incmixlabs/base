'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { ContextMenu } from './ContextMenu'
import { DropdownMenu } from './DropdownMenu'
import type {
  MenuWrapperActionItem,
  MenuWrapperCheckboxItem,
  MenuWrapperEntry,
  MenuWrapperGroup,
  MenuWrapperProps,
  MenuWrapperRadioGroup,
  MenuWrapperSubmenu,
} from './menu-wrapper.types'

function isActionItem(item: MenuWrapperEntry): item is MenuWrapperActionItem {
  return item.kind === undefined || item.kind === 'item'
}

function isCheckboxItem(item: MenuWrapperEntry): item is MenuWrapperCheckboxItem {
  return item.kind === 'checkbox'
}

function isRadioGroup(item: MenuWrapperEntry): item is MenuWrapperRadioGroup {
  return item.kind === 'radio-group'
}

function isSubmenu(item: MenuWrapperEntry): item is MenuWrapperSubmenu {
  return item.kind === 'submenu'
}

function DropdownEntries({
  items,
  renderItem,
  onItemSelect,
  onCheckboxChange,
  onRadioValueChange,
}: {
  items: MenuWrapperEntry[]
} & Pick<MenuWrapperProps, 'renderItem' | 'onItemSelect' | 'onCheckboxChange' | 'onRadioValueChange'>) {
  return (
    <>
      {items.map((item, index) => {
        const key = item.id ?? `${item.kind ?? 'item'}-${index}`

        if (item.kind === 'separator') {
          const defaultRender = <DropdownMenu.Separator key={key} />
          return renderItem ? (
            <React.Fragment key={key}>{renderItem(item, defaultRender)}</React.Fragment>
          ) : (
            defaultRender
          )
        }

        if (item.kind === 'label') {
          const defaultRender = <DropdownMenu.Label key={key}>{item.label}</DropdownMenu.Label>
          return renderItem ? (
            <React.Fragment key={key}>{renderItem(item, defaultRender)}</React.Fragment>
          ) : (
            defaultRender
          )
        }

        if (isActionItem(item)) {
          const defaultRender = (
            <DropdownMenu.Item
              key={key}
              color={item.color}
              shortcut={item.shortcut}
              disabled={item.disabled}
              bold={item.bold}
              italic={item.italic}
              strikethrough={item.strikethrough}
              onClick={() => {
                item.onSelect?.()
                onItemSelect?.(item)
              }}
            >
              {item.label}
            </DropdownMenu.Item>
          )
          return renderItem ? (
            <React.Fragment key={key}>{renderItem(item, defaultRender)}</React.Fragment>
          ) : (
            defaultRender
          )
        }

        if (isCheckboxItem(item)) {
          const defaultRender = (
            <DropdownMenu.CheckboxItem
              key={key}
              checked={item.checked}
              color={item.color}
              shortcut={item.shortcut}
              disabled={item.disabled}
              bold={item.bold}
              italic={item.italic}
              strikethrough={item.strikethrough}
              onCheckedChange={checked => {
                item.onCheckedChange?.(checked)
                onCheckboxChange?.(item, checked)
              }}
            >
              {item.label}
            </DropdownMenu.CheckboxItem>
          )
          return renderItem ? (
            <React.Fragment key={key}>{renderItem(item, defaultRender)}</React.Fragment>
          ) : (
            defaultRender
          )
        }

        if (isRadioGroup(item)) {
          const defaultRender = (
            <DropdownMenu.RadioGroup
              key={key}
              value={item.value}
              onValueChange={value => {
                item.onValueChange?.(value)
                onRadioValueChange?.(item, value)
              }}
            >
              {item.items.map((option, optionIndex) => (
                <DropdownMenu.RadioItem
                  key={option.id ?? `${item.id}-option-${optionIndex}`}
                  value={option.value}
                  color={option.color}
                  disabled={option.disabled}
                  bold={option.bold}
                  italic={option.italic}
                  strikethrough={option.strikethrough}
                >
                  {option.label}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          )
          return renderItem ? (
            <React.Fragment key={key}>{renderItem(item, defaultRender)}</React.Fragment>
          ) : (
            defaultRender
          )
        }

        if (isSubmenu(item)) {
          const defaultRender = (
            <DropdownMenu.Sub key={key}>
              <DropdownMenu.SubTrigger
                color={item.color}
                disabled={item.disabled}
                bold={item.bold}
                italic={item.italic}
                strikethrough={item.strikethrough}
              >
                {item.label}
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownEntries
                  items={item.items}
                  renderItem={renderItem}
                  onItemSelect={onItemSelect}
                  onCheckboxChange={onCheckboxChange}
                  onRadioValueChange={onRadioValueChange}
                />
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          )
          return renderItem ? (
            <React.Fragment key={key}>{renderItem(item, defaultRender)}</React.Fragment>
          ) : (
            defaultRender
          )
        }

        return null
      })}
    </>
  )
}

function ContextEntries({
  items,
  renderItem,
  onItemSelect,
  onCheckboxChange,
  onRadioValueChange,
}: {
  items: MenuWrapperEntry[]
} & Pick<MenuWrapperProps, 'renderItem' | 'onItemSelect' | 'onCheckboxChange' | 'onRadioValueChange'>) {
  return (
    <>
      {items.map((item, index) => {
        const key = item.id ?? `${item.kind ?? 'item'}-${index}`

        if (item.kind === 'separator') {
          const defaultRender = <ContextMenu.Separator key={key} />
          return renderItem ? (
            <React.Fragment key={key}>{renderItem(item, defaultRender)}</React.Fragment>
          ) : (
            defaultRender
          )
        }

        if (item.kind === 'label') {
          const defaultRender = <ContextMenu.Label key={key}>{item.label}</ContextMenu.Label>
          return renderItem ? (
            <React.Fragment key={key}>{renderItem(item, defaultRender)}</React.Fragment>
          ) : (
            defaultRender
          )
        }

        if (isActionItem(item)) {
          const defaultRender = (
            <ContextMenu.Item
              key={key}
              color={item.color}
              shortcut={item.shortcut}
              disabled={item.disabled}
              bold={item.bold}
              italic={item.italic}
              strikethrough={item.strikethrough}
              onClick={() => {
                item.onSelect?.()
                onItemSelect?.(item)
              }}
            >
              {item.label}
            </ContextMenu.Item>
          )
          return renderItem ? (
            <React.Fragment key={key}>{renderItem(item, defaultRender)}</React.Fragment>
          ) : (
            defaultRender
          )
        }

        if (isCheckboxItem(item)) {
          const defaultRender = (
            <ContextMenu.CheckboxItem
              key={key}
              checked={item.checked}
              color={item.color}
              shortcut={item.shortcut}
              disabled={item.disabled}
              bold={item.bold}
              italic={item.italic}
              strikethrough={item.strikethrough}
              onCheckedChange={checked => {
                item.onCheckedChange?.(checked)
                onCheckboxChange?.(item, checked)
              }}
            >
              {item.label}
            </ContextMenu.CheckboxItem>
          )
          return renderItem ? (
            <React.Fragment key={key}>{renderItem(item, defaultRender)}</React.Fragment>
          ) : (
            defaultRender
          )
        }

        if (isRadioGroup(item)) {
          const defaultRender = (
            <ContextMenu.RadioGroup
              key={key}
              value={item.value}
              onValueChange={value => {
                item.onValueChange?.(value)
                onRadioValueChange?.(item, value)
              }}
            >
              {item.items.map((option, optionIndex) => (
                <ContextMenu.RadioItem
                  key={option.id ?? `${item.id}-option-${optionIndex}`}
                  value={option.value}
                  color={option.color}
                  disabled={option.disabled}
                  bold={option.bold}
                  italic={option.italic}
                  strikethrough={option.strikethrough}
                >
                  {option.label}
                </ContextMenu.RadioItem>
              ))}
            </ContextMenu.RadioGroup>
          )
          return renderItem ? (
            <React.Fragment key={key}>{renderItem(item, defaultRender)}</React.Fragment>
          ) : (
            defaultRender
          )
        }

        if (isSubmenu(item)) {
          const defaultRender = (
            <ContextMenu.Sub key={key}>
              <ContextMenu.SubTrigger
                color={item.color}
                disabled={item.disabled}
                bold={item.bold}
                italic={item.italic}
                strikethrough={item.strikethrough}
              >
                {item.label}
              </ContextMenu.SubTrigger>
              <ContextMenu.SubContent>
                <ContextEntries
                  items={item.items}
                  renderItem={renderItem}
                  onItemSelect={onItemSelect}
                  onCheckboxChange={onCheckboxChange}
                  onRadioValueChange={onRadioValueChange}
                />
              </ContextMenu.SubContent>
            </ContextMenu.Sub>
          )
          return renderItem ? (
            <React.Fragment key={key}>{renderItem(item, defaultRender)}</React.Fragment>
          ) : (
            defaultRender
          )
        }

        return null
      })}
    </>
  )
}

function DropdownGroup({
  group,
  isFirst,
  renderGroup,
  ...entryProps
}: {
  group: MenuWrapperGroup
  isFirst: boolean
  renderGroup?: MenuWrapperProps['renderGroup']
} & Pick<MenuWrapperProps, 'renderItem' | 'onItemSelect' | 'onCheckboxChange' | 'onRadioValueChange'>) {
  const defaultRender = (
    <DropdownMenu.Group>
      {!isFirst ? <DropdownMenu.Separator /> : null}
      {group.label ? <DropdownMenu.Label>{group.label}</DropdownMenu.Label> : null}
      <DropdownEntries items={group.items} {...entryProps} />
    </DropdownMenu.Group>
  )
  return <>{renderGroup ? renderGroup(group, defaultRender) : defaultRender}</>
}

function ContextGroup({
  group,
  isFirst,
  renderGroup,
  ...entryProps
}: {
  group: MenuWrapperGroup
  isFirst: boolean
  renderGroup?: MenuWrapperProps['renderGroup']
} & Pick<MenuWrapperProps, 'renderItem' | 'onItemSelect' | 'onCheckboxChange' | 'onRadioValueChange'>) {
  const defaultRender = (
    <ContextMenu.Group>
      {!isFirst ? <ContextMenu.Separator /> : null}
      {group.label ? <ContextMenu.Label>{group.label}</ContextMenu.Label> : null}
      <ContextEntries items={group.items} {...entryProps} />
    </ContextMenu.Group>
  )
  return <>{renderGroup ? renderGroup(group, defaultRender) : defaultRender}</>
}

export function MenuWrapper({
  data,
  mode = 'dropdown',
  trigger,
  size = 'md',
  variant = 'solid',
  color = SemanticColor.slate,
  onItemSelect,
  onCheckboxChange,
  onRadioValueChange,
  renderItem,
  renderGroup,
  className,
  contentClassName,
  ...modeProps
}: MenuWrapperProps) {
  if (mode === 'context') {
    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger className={cn('inline-flex outline-none', className)}>
          {trigger ?? (
            <div className="inline-flex min-h-24 min-w-72 items-center justify-center rounded-md border border-border bg-background px-4 text-sm text-muted-foreground">
              Right click to open menu
            </div>
          )}
        </ContextMenu.Trigger>
        <ContextMenu.Content size={size} variant={variant} color={color} className={contentClassName}>
          {data.map((group, index) => (
            <ContextGroup
              key={group.id}
              group={group}
              isFirst={index === 0}
              renderGroup={renderGroup}
              renderItem={renderItem}
              onItemSelect={onItemSelect}
              onCheckboxChange={onCheckboxChange}
              onRadioValueChange={onRadioValueChange}
            />
          ))}
        </ContextMenu.Content>
      </ContextMenu.Root>
    )
  }

  const dropdownProps = modeProps as Extract<MenuWrapperProps, { mode?: 'dropdown' }>
  const { side = 'bottom', align = 'start', sideOffset = 4, open, defaultOpen, onOpenChange } = dropdownProps

  return (
    <DropdownMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger className={className}>
        {trigger ?? <button type="button">Open menu</button>}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        size={size}
        variant={variant}
        color={color}
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={contentClassName}
      >
        {data.map((group, index) => (
          <DropdownGroup
            key={group.id}
            group={group}
            isFirst={index === 0}
            renderGroup={renderGroup}
            renderItem={renderItem}
            onItemSelect={onItemSelect}
            onCheckboxChange={onCheckboxChange}
            onRadioValueChange={onRadioValueChange}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

MenuWrapper.displayName = 'MenuWrapper'

export type {
  MenuWrapperActionItem,
  MenuWrapperCheckboxItem,
  MenuWrapperData,
  MenuWrapperEntry,
  MenuWrapperGroup,
  MenuWrapperLabel,
  MenuWrapperMode,
  MenuWrapperProps,
  MenuWrapperRadioGroup,
  MenuWrapperRadioOption,
  MenuWrapperRenderGroup,
  MenuWrapperRenderItem,
  MenuWrapperSeparator,
  MenuWrapperSubmenu,
} from './menu-wrapper.types'
