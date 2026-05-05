'use client'

import * as React from 'react'
import { type AvatarItem, AvatarPicker, type AvatarPickerProps } from './AvatarPicker'
import type { MentionItem, PickerRenderProps } from './MentionTextarea'
import { MultiSelect, type MultiSelectOption, type MultiSelectProps } from './MultiSelect'

// ── AvatarMentionPicker ──
// A self-contained picker component that directly implements the PickerRenderProps contract.
// Wraps AvatarPicker in multi-select inline mode and maps AvatarItem → MentionItem.

export interface AvatarMentionPickerProps
  extends PickerRenderProps,
    Omit<
      AvatarPickerProps,
      'items' | 'multiple' | 'inline' | 'onApply' | 'onClose' | 'onValueChange' | 'defaultSearch'
    > {
  /** The avatar items to display */
  items: AvatarItem[]
  /** Converts an AvatarItem to a MentionItem for insertion */
  toMention: (item: AvatarItem) => MentionItem
}

/**
 * Self-contained picker that bridges AvatarPicker to the MentionTextarea `renderPicker` contract.
 * Accepts `PickerRenderProps` directly — no adapter glue needed at the call site.
 *
 * @example
 * ```tsx
 * renderPicker: props => (
 *   <AvatarMentionPicker items={avatarUsers} toMention={toMention} size="xs" {...props} />
 * )
 * ```
 */
export function AvatarMentionPicker({
  items,
  toMention,
  onConfirm,
  onClose,
  onSelectionChange,
  searchTerm,
  ...pickerProps
}: AvatarMentionPickerProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  return (
    <AvatarPicker
      {...pickerProps}
      items={items}
      multiple
      inline
      value={selectedIds}
      defaultSearch={searchTerm}
      onClose={onClose}
      onApply={selected => {
        onConfirm(selected.map(toMention))
        setSelectedIds([])
      }}
      onValueChange={ids => {
        const idArr = Array.isArray(ids) ? ids : ids ? [ids] : []
        setSelectedIds(idArr)
        onSelectionChange(items.filter(a => idArr.includes(a.id)).map(toMention))
      }}
    />
  )
}

// ── MultiSelectMentionPicker ──
// A self-contained picker component that directly implements the PickerRenderProps contract.
// Wraps MultiSelect in inline popup mode and maps option values → MentionItem.

export interface MultiSelectMentionPickerProps
  extends PickerRenderProps,
    Omit<MultiSelectProps, 'options' | 'inline' | 'popup' | 'onApply' | 'onClose' | 'onChange' | 'defaultSearch'> {
  /** The options to display */
  options: MultiSelectOption[]
  /** Converts an option value (and optional option object) to a MentionItem for insertion */
  toMention: (value: string, option?: MultiSelectOption) => MentionItem
}

/**
 * Self-contained picker that bridges MultiSelect to the MentionTextarea `renderPicker` contract.
 * Accepts `PickerRenderProps` directly — no adapter glue needed at the call site.
 *
 * @example
 * ```tsx
 * renderPicker: props => (
 *   <MultiSelectMentionPicker options={tagOptions} toMention={toMention} size="xs" {...props} />
 * )
 * ```
 */
export function MultiSelectMentionPicker({
  options,
  toMention,
  onConfirm,
  onClose,
  onSelectionChange,
  searchTerm,
  ...selectProps
}: MultiSelectMentionPickerProps) {
  const [selectedValues, setSelectedValues] = React.useState<string[]>([])

  const resolve = (val: string) => {
    const opt = options.find(o => o.value === val)
    return toMention(val, opt)
  }

  return (
    <MultiSelect
      {...selectProps}
      options={options}
      inline
      popup
      value={selectedValues}
      defaultSearch={searchTerm}
      onClose={onClose}
      onChange={selected => {
        setSelectedValues(selected)
        onSelectionChange(selected.map(resolve))
      }}
      onApply={selected => {
        onConfirm(selected.map(resolve))
        setSelectedValues([])
      }}
    />
  )
}
