export const wheelPickerWrapper =
  'w-56 rounded-[var(--element-border-radius,var(--radius-md))] border border-neutral bg-neutral-surface px-1 text-neutral shadow-xs [&>[data-rwp]:first-child_[data-rwp-highlight-wrapper]]:rounded-s-md [&>[data-rwp]:last-child_[data-rwp-highlight-wrapper]]:rounded-e-md'

export const wheelPickerOptionItem = 'text-slate opacity-60 [&[data-disabled=true]]:opacity-40'

export const wheelPickerHighlightWrapper =
  '[background-color:var(--wheel-picker-highlight-bg,var(--color-slate-soft))] [color:var(--wheel-picker-highlight-text,var(--color-slate-text))] [&[data-rwp-focused=true]]:[box-shadow:inset_0_0_0_2px_var(--wheel-picker-highlight-border,var(--color-slate-border))]'

export const wheelPickerHighlightItem = '[&[data-disabled=true]]:opacity-40'

export const wheelPickerClassNames = [
  wheelPickerWrapper,
  wheelPickerOptionItem,
  wheelPickerHighlightWrapper,
  wheelPickerHighlightItem,
]
