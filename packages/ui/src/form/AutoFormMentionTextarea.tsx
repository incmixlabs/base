'use client'

import * as React from 'react'
import type { AvatarHoverCardData } from '@/elements/avatar/Avatar'
import type { AvatarItem } from './AvatarPicker'
import { type MentionItem, MentionTextarea, type MentionTextareaProps, type TriggerConfig } from './MentionTextarea'
import type { MultiSelectOption } from './MultiSelect'
import { AvatarMentionPicker, MultiSelectMentionPicker } from './mention-pickers'

type AutoFormMentionItem = {
  id: string
  label: string
  value?: string
  description?: string
  avatar?: string
  hoverCard?: boolean | AvatarHoverCardData
  disabled?: boolean
}

type AutoFormAvatarItem = {
  id: string
  name: string
  description?: string
  avatar?: string
  hoverCard?: boolean | AvatarHoverCardData
  disabled?: boolean
}

type AutoFormMultiSelectOption = {
  value: string
  label: string
  disabled?: boolean
}

type AutoFormMentionTriggerConfig = {
  trigger: string
  items?: AutoFormMentionItem[]
  picker?: 'default' | 'avatar' | 'multi-select'
  avatarItems?: AutoFormAvatarItem[]
  options?: AutoFormMultiSelectOption[]
  searchable?: boolean
  searchPlaceholder?: string
  placeholder?: string
  noResultsText?: string
  maxSelected?: number
  maxSelectedText?: string
  showBadges?: boolean
  maxVisibleBadges?: number
}

export type AutoFormMentionTextareaConfig = {
  mentions?: AutoFormMentionItem[]
  trigger?: string
  triggers?: AutoFormMentionTriggerConfig[]
  maxItems?: number
  noMatchesText?: string
  toolbar?: boolean
  autoSize?: boolean
  rows?: number
  minRows?: number
  maxRows?: number
}

export interface AutoFormMentionTextareaProps
  extends Omit<
    MentionTextareaProps,
    | 'mentions'
    | 'trigger'
    | 'triggers'
    | 'maxItems'
    | 'noMatchesText'
    | 'toolbar'
    | 'autoSize'
    | 'rows'
    | 'minRows'
    | 'maxRows'
  > {
  config?: AutoFormMentionTextareaConfig
}

export const AutoFormMentionTextarea = React.forwardRef<HTMLTextAreaElement, AutoFormMentionTextareaProps>(
  ({ config, ...props }, ref) => {
    const triggers = React.useMemo(() => buildMentionTriggers(config), [config])

    return (
      <MentionTextarea
        {...props}
        ref={ref}
        mentions={!triggers ? toMentionItems(config?.mentions) : undefined}
        trigger={config?.trigger}
        triggers={triggers}
        maxItems={config?.maxItems}
        noMatchesText={config?.noMatchesText}
        toolbar={config?.toolbar}
        autoSize={config?.autoSize}
        rows={config?.rows}
        minRows={config?.minRows}
        maxRows={config?.maxRows}
      />
    )
  },
)

AutoFormMentionTextarea.displayName = 'AutoFormMentionTextarea'

function buildMentionTriggers(config: AutoFormMentionTextareaConfig | undefined): TriggerConfig[] | undefined {
  if (!config?.triggers?.length) return undefined

  const triggers = config.triggers.flatMap(triggerConfig => {
    if (triggerConfig.picker === 'avatar') {
      const avatarItems = toAvatarItems(triggerConfig.avatarItems)
      if (!avatarItems.length) return []

      return [
        {
          trigger: triggerConfig.trigger,
          items: avatarItems.map(avatarToMentionItem),
          renderPicker: props => (
            <AvatarMentionPicker
              {...props}
              items={avatarItems}
              toMention={avatarToMentionItem}
              size="xs"
              searchable={triggerConfig.searchable}
              searchPlaceholder={triggerConfig.searchPlaceholder}
              noResultsText={triggerConfig.noResultsText}
            />
          ),
        } satisfies TriggerConfig,
      ]
    }

    if (triggerConfig.picker === 'multi-select') {
      const options = toMultiSelectOptions(triggerConfig.options)
      if (!options.length) return []

      return [
        {
          trigger: triggerConfig.trigger,
          items: options.map(option => optionToMentionItem(option.value, option)),
          renderPicker: props => (
            <MultiSelectMentionPicker
              {...props}
              options={options}
              toMention={optionToMentionItem}
              size="xs"
              searchable={triggerConfig.searchable}
              searchPlaceholder={triggerConfig.searchPlaceholder}
              placeholder={triggerConfig.placeholder}
              maxSelected={triggerConfig.maxSelected}
              maxSelectedText={triggerConfig.maxSelectedText}
              showBadges={triggerConfig.showBadges}
              maxVisibleBadges={triggerConfig.maxVisibleBadges}
            />
          ),
        } satisfies TriggerConfig,
      ]
    }

    const items = toMentionItems(triggerConfig.items)
    if (!items?.length) return []

    return [
      {
        trigger: triggerConfig.trigger,
        items,
      } satisfies TriggerConfig,
    ]
  })

  return triggers.length > 0 ? triggers : undefined
}

function toMentionItems(items: AutoFormMentionItem[] | undefined): MentionItem[] | undefined {
  if (!items?.length) return undefined

  return items.map(item => ({
    id: item.id,
    label: item.label,
    value: item.value,
    description: item.description,
    avatar: item.avatar,
    hoverCard: item.hoverCard,
    disabled: item.disabled,
  }))
}

function toAvatarItems(items: AutoFormAvatarItem[] | undefined): AvatarItem[] {
  if (!items?.length) return []

  return items.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    avatar: item.avatar,
    hoverCard: item.hoverCard,
    disabled: item.disabled,
  }))
}

function toMultiSelectOptions(options: AutoFormMultiSelectOption[] | undefined): MultiSelectOption[] {
  if (!options?.length) return []

  return options.map(option => ({
    value: option.value,
    label: option.label,
    disabled: option.disabled,
  }))
}

function avatarToMentionItem(item: AvatarItem): MentionItem {
  return {
    id: item.id,
    label: item.name,
    value: `user:${item.id}`,
    description: item.description,
    avatar: item.avatar,
    hoverCard: item.hoverCard,
    disabled: item.disabled,
  }
}

function optionToMentionItem(value: string, option?: MultiSelectOption): MentionItem {
  return {
    id: value,
    label: option?.label ?? value,
    value: `tag:${value}`,
    disabled: option?.disabled,
  }
}
