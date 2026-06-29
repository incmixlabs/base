import { pickerPopupSizeTokens } from '../theme/token-maps'

type PickerPopupSize = keyof typeof pickerPopupSizeTokens

function mapPickerPopupSizeTokens<T>(
  mapToken: (size: PickerPopupSize, token: (typeof pickerPopupSizeTokens)[PickerPopupSize]) => T,
): Record<PickerPopupSize, T> {
  return Object.fromEntries(
    Object.entries(pickerPopupSizeTokens).map(([size, token]) => [
      size,
      mapToken(size as PickerPopupSize, token as (typeof pickerPopupSizeTokens)[PickerPopupSize]),
    ]),
  ) as Record<PickerPopupSize, T>
}

const joinClass = (...parts: string[]) => parts.join('')
const pickerPopupSizeVar = (size: string, slot: string, fallback: string) =>
  joinClass('var(--af-picker-popup-size-', size, '-', slot, ',', fallback, ')')

const mutedNeutralText = 'text-[color-mix(in_oklch,var(--color-neutral-text)_68%,transparent)]'
const mutedNeutralPlaceholder = 'placeholder:text-[color-mix(in_oklch,var(--color-neutral-text)_68%,transparent)]'

export const pickerPopupBase =
  'overflow-hidden rounded-[var(--element-border-radius,0.375rem)] border border-neutral bg-neutral-surface text-neutral [box-shadow:var(--shadow-2)]'

export const pickerPopupViewportBase = 'overflow-y-auto'

export const pickerPopupViewportBySize: Record<PickerPopupSize, string> = mapPickerPopupSizeTokens((size, token) =>
  [
    joinClass('max-h-[', pickerPopupSizeVar(size, 'viewport-max-height', token.viewportMaxHeight), ']'),
    joinClass('p-[', pickerPopupSizeVar(size, 'popup-padding', token.popupPadding), ']'),
  ].join(' '),
)

export const pickerStatusRowBase = joinClass('border-b border-neutral ', mutedNeutralText)

export const pickerStatusRowBySize: Record<PickerPopupSize, string> = mapPickerPopupSizeTokens((size, token) =>
  [
    joinClass('px-[', pickerPopupSizeVar(size, 'status-padding-x', token.statusPaddingX), ']'),
    joinClass('py-[', pickerPopupSizeVar(size, 'status-padding-y', token.statusPaddingY), ']'),
    joinClass('text-[length:', pickerPopupSizeVar(size, 'font-size', token.fontSize), ']'),
    joinClass('leading-[', pickerPopupSizeVar(size, 'line-height', token.lineHeight), ']'),
  ].join(' '),
)

export const pickerEmptyStateBase = joinClass('text-center ', mutedNeutralText)

export const pickerEmptyStateBySize: Record<PickerPopupSize, string> = mapPickerPopupSizeTokens((size, token) =>
  [
    joinClass('py-[', pickerPopupSizeVar(size, 'status-padding-y', '1.5rem'), ']'),
    joinClass('text-[length:', pickerPopupSizeVar(size, 'font-size', token.fontSize), ']'),
    joinClass('leading-[', pickerPopupSizeVar(size, 'line-height', token.lineHeight), ']'),
  ].join(' '),
)

export const pickerSearchRowBase = 'flex items-center p-0'

export const pickerSearchInputBase = joinClass(
  'w-full border-0 border-b border-neutral bg-transparent p-0 ',
  mutedNeutralPlaceholder,
)

export const pickerSearchInputBySize: Record<PickerPopupSize, string> = mapPickerPopupSizeTokens((size, token) =>
  [
    joinClass('h-[', pickerPopupSizeVar(size, 'search-height', token.searchHeight), ']'),
    joinClass('text-[length:', pickerPopupSizeVar(size, 'font-size', token.fontSize), ']'),
    joinClass('leading-[', pickerPopupSizeVar(size, 'line-height', token.lineHeight), ']'),
  ].join(' '),
)

export const pickerOptionItemBase =
  'w-full cursor-default select-none rounded-sm outline-none hover:bg-accent-soft hover:text-accent focus:bg-accent-soft focus:text-accent aria-selected:bg-[color-mix(in_oklch,var(--color-accent-soft)_50%,transparent)] aria-disabled:pointer-events-none aria-disabled:opacity-50'

export const pickerOptionItemBySize: Record<PickerPopupSize, string> = mapPickerPopupSizeTokens((size, token) =>
  [
    joinClass('[padding-inline-start:', pickerPopupSizeVar(size, 'row-padding-x', token.rowPaddingX), ']'),
    joinClass('[padding-inline-end:', pickerPopupSizeVar(size, 'row-trailing-padding', token.rowTrailingPadding), ']'),
    joinClass('[padding-block:', pickerPopupSizeVar(size, 'row-padding-y', token.rowPaddingY), ']'),
    joinClass('text-[length:', pickerPopupSizeVar(size, 'font-size', token.fontSize), ']'),
    joinClass('leading-[', pickerPopupSizeVar(size, 'line-height', token.lineHeight), ']'),
  ].join(' '),
)

export const pickerIndicatorBySize: Record<PickerPopupSize, string> = mapPickerPopupSizeTokens((size, token) =>
  [
    joinClass('h-[', pickerPopupSizeVar(size, 'icon-size', token.iconSize), ']'),
    joinClass('w-[', pickerPopupSizeVar(size, 'icon-size', token.iconSize), ']'),
  ].join(' '),
)

export const pickerFooterStatusBase = joinClass('border-t border-neutral ', mutedNeutralText)

export const pickerFooterActionsBase = 'flex items-center justify-end gap-1 border-t border-neutral'

export const pickerFooterBySize: Record<PickerPopupSize, string> = mapPickerPopupSizeTokens((size, token) =>
  [
    joinClass('px-[', pickerPopupSizeVar(size, 'status-padding-x', token.statusPaddingX), ']'),
    joinClass('py-[', pickerPopupSizeVar(size, 'status-padding-y', token.statusPaddingY), ']'),
    joinClass('text-[length:', pickerPopupSizeVar(size, 'font-size', token.fontSize), ']'),
    joinClass('leading-[', pickerPopupSizeVar(size, 'line-height', token.lineHeight), ']'),
  ].join(' '),
)

export const pickerPopupClassNames = [
  pickerPopupBase,
  pickerPopupViewportBase,
  ...Object.values(pickerPopupViewportBySize),
  pickerStatusRowBase,
  ...Object.values(pickerStatusRowBySize),
  pickerEmptyStateBase,
  ...Object.values(pickerEmptyStateBySize),
  pickerSearchRowBase,
  pickerSearchInputBase,
  ...Object.values(pickerSearchInputBySize),
  pickerOptionItemBase,
  ...Object.values(pickerOptionItemBySize),
  ...Object.values(pickerIndicatorBySize),
  pickerFooterStatusBase,
  pickerFooterActionsBase,
  ...Object.values(pickerFooterBySize),
]
