type PickerPopupSize = 'xs' | 'sm' | 'md' | 'lg' | '2x'

const pickerTextBySize = {
  xs: 'text-xs leading-4',
  sm: 'text-sm leading-5',
  md: 'text-sm leading-5',
  lg: 'text-base leading-6',
  '2x': 'text-xl leading-7',
} as const satisfies Record<PickerPopupSize, string>

export const pickerPopupBase =
  'overflow-hidden rounded-[var(--element-border-radius,0.375rem)] border border-neutral bg-neutral-surface text-neutral [box-shadow:var(--shadow-2)]'

export const pickerPopupViewportBase = 'overflow-y-auto'

export const pickerPopupViewportBySize = {
  xs: 'max-h-40 p-1',
  sm: 'max-h-48 p-1',
  md: 'max-h-[13.5rem] p-1',
  lg: 'max-h-56 p-1',
  '2x': 'max-h-64 p-1',
} as const satisfies Record<PickerPopupSize, string>

export const pickerStatusRowBase = 'border-b border-neutral text-muted'

export const pickerStatusRowBySize = {
  xs: `px-3 py-2 ${pickerTextBySize.xs}`,
  sm: `px-3 py-2 ${pickerTextBySize.sm}`,
  md: `px-3 py-2 ${pickerTextBySize.md}`,
  lg: `px-3 py-2 ${pickerTextBySize.lg}`,
  '2x': `px-3 py-2 ${pickerTextBySize['2x']}`,
} as const satisfies Record<PickerPopupSize, string>

export const pickerEmptyStateBase = 'text-center text-muted'

export const pickerEmptyStateBySize = {
  xs: `py-2 ${pickerTextBySize.xs}`,
  sm: `py-2 ${pickerTextBySize.sm}`,
  md: `py-2 ${pickerTextBySize.md}`,
  lg: `py-2 ${pickerTextBySize.lg}`,
  '2x': `py-2 ${pickerTextBySize['2x']}`,
} as const satisfies Record<PickerPopupSize, string>

export const pickerSearchRowBase = 'flex items-center p-0'

export const pickerSearchInputBase = 'w-full border-0 border-b border-neutral bg-transparent p-0 placeholder:text-muted'

export const pickerSearchInputBySize = {
  xs: `h-6 ${pickerTextBySize.xs}`,
  sm: `h-8 ${pickerTextBySize.sm}`,
  md: `h-9 ${pickerTextBySize.md}`,
  lg: `h-10 ${pickerTextBySize.lg}`,
  '2x': `h-12 ${pickerTextBySize['2x']}`,
} as const satisfies Record<PickerPopupSize, string>

export const pickerOptionItemBase =
  'w-full cursor-default select-none rounded-sm outline-none hover:bg-accent-soft hover:text-accent focus:bg-accent-soft focus:text-accent aria-selected:bg-[color-mix(in_oklch,var(--color-accent-soft)_50%,transparent)] aria-disabled:pointer-events-none aria-disabled:opacity-50'

export const pickerOptionItemBySize = {
  xs: `ps-2 pe-7 py-1 ${pickerTextBySize.xs}`,
  sm: `ps-2 pe-8 py-1.5 ${pickerTextBySize.sm}`,
  md: `ps-2.5 pe-8 py-2 ${pickerTextBySize.md}`,
  lg: `ps-3 pe-9 py-2.5 ${pickerTextBySize.lg}`,
  '2x': `ps-4 pe-10 py-3.5 ${pickerTextBySize['2x']}`,
} as const satisfies Record<PickerPopupSize, string>

export const pickerIndicatorBySize = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  '2x': 'h-6 w-6',
} as const satisfies Record<PickerPopupSize, string>

export const pickerFooterStatusBase = 'border-t border-neutral text-muted'

export const pickerFooterActionsBase = 'flex items-center justify-end gap-1 border-t border-neutral'

export const pickerFooterBySize = pickerStatusRowBySize

export const pickerPopupClassNames = [
  pickerPopupBase,
  pickerPopupViewportBase,
  ...Object.values(pickerPopupViewportBySize),
  ...Object.values(pickerTextBySize),
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
