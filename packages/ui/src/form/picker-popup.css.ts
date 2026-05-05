import { style, styleVariants } from '@vanilla-extract/css'
import { pickerPopupSizeVar } from '@/theme/runtime/component-vars'
import { pickerPopupSizeTokens } from '@/theme/token-maps'

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

export const pickerPopupBase = style({
  overflow: 'hidden',
  borderRadius: 'var(--element-border-radius, 0.375rem)',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--popover)',
  color: 'var(--popover-foreground)',
  boxShadow: 'var(--shadow-2)',
})

export const pickerPopupViewportBase = style({
  maxHeight: 'var(--picker-popup-viewport-max-height)',
  overflowY: 'auto',
})

export const pickerPopupViewportBySize: Record<PickerPopupSize, string> = styleVariants(
  mapPickerPopupSizeTokens((size, token) => ({
    vars: {
      '--picker-popup-viewport-max-height': pickerPopupSizeVar(size, 'viewportMaxHeight', token.viewportMaxHeight),
    },
    padding: pickerPopupSizeVar(size, 'popupPadding', token.popupPadding),
  })),
)

export const pickerStatusRowBase = style({
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  borderBottom: '1px solid var(--border)',
})

export const pickerStatusRowBySize: Record<PickerPopupSize, string> = styleVariants(
  mapPickerPopupSizeTokens((size, token) => ({
    paddingInline: pickerPopupSizeVar(size, 'statusPaddingX', token.statusPaddingX),
    paddingBlock: pickerPopupSizeVar(size, 'statusPaddingY', token.statusPaddingY),
    fontSize: pickerPopupSizeVar(size, 'fontSize', token.fontSize),
    lineHeight: pickerPopupSizeVar(size, 'lineHeight', token.lineHeight),
  })),
)

export const pickerEmptyStateBase = style({
  textAlign: 'center',
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
})

export const pickerEmptyStateBySize: Record<PickerPopupSize, string> = styleVariants(
  mapPickerPopupSizeTokens((size, token) => ({
    paddingBlock: pickerPopupSizeVar(size, 'statusPaddingY', '1.5rem'),
    fontSize: pickerPopupSizeVar(size, 'fontSize', token.fontSize),
    lineHeight: pickerPopupSizeVar(size, 'lineHeight', token.lineHeight),
  })),
)

export const pickerSearchRowBase = style({
  display: 'flex',
  alignItems: 'center',
  padding: 0,
})

export const pickerSearchInputBase = style({
  width: '100%',
  border: 0,
  borderBottom: '1px solid var(--border)',
  backgroundColor: 'transparent',
  padding: 0,
  selectors: {
    '&::placeholder': {
      color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
    },
  },
})

export const pickerSearchInputBySize: Record<PickerPopupSize, string> = styleVariants(
  mapPickerPopupSizeTokens((size, token) => ({
    height: pickerPopupSizeVar(size, 'searchHeight', token.searchHeight),
    fontSize: pickerPopupSizeVar(size, 'fontSize', token.fontSize),
    lineHeight: pickerPopupSizeVar(size, 'lineHeight', token.lineHeight),
  })),
)

export const pickerOptionItemBase = style({
  width: '100%',
  cursor: 'default',
  userSelect: 'none',
  borderRadius: '0.125rem',
  outline: 'none',
  selectors: {
    '&:focus': {
      backgroundColor: 'var(--color-accent-soft)',
      color: 'var(--color-accent-text)',
    },
    '&:hover': {
      backgroundColor: 'var(--color-accent-soft)',
      color: 'var(--color-accent-text)',
    },
    '&[aria-selected="true"]': {
      backgroundColor: 'color-mix(in oklch, var(--color-accent-soft) 50%, transparent)',
    },
    '&[aria-disabled="true"]': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },
})

export const pickerOptionItemBySize: Record<PickerPopupSize, string> = styleVariants(
  mapPickerPopupSizeTokens((size, token) => ({
    paddingInlineStart: pickerPopupSizeVar(size, 'rowPaddingX', token.rowPaddingX),
    paddingInlineEnd: pickerPopupSizeVar(size, 'rowTrailingPadding', token.rowTrailingPadding),
    paddingBlock: pickerPopupSizeVar(size, 'rowPaddingY', token.rowPaddingY),
    fontSize: pickerPopupSizeVar(size, 'fontSize', token.fontSize),
    lineHeight: pickerPopupSizeVar(size, 'lineHeight', token.lineHeight),
  })),
)

export const pickerIndicatorBySize: Record<PickerPopupSize, string> = styleVariants(
  mapPickerPopupSizeTokens((size, token) => ({
    width: pickerPopupSizeVar(size, 'iconSize', token.iconSize),
    height: pickerPopupSizeVar(size, 'iconSize', token.iconSize),
  })),
)

// ── Shared footer styles for inline pickers (MultiSelect, AvatarPicker, etc.) ──

/** Footer status row — "N selected" text */
export const pickerFooterStatusBase = style({
  borderTop: '1px solid var(--border)',
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
})

/** Footer button row — right-aligned actions (Clear / Add) */
export const pickerFooterActionsBase = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '4px',
  borderTop: '1px solid var(--border)',
})

/** Size-dependent footer spacing */
export const pickerFooterBySize: Record<PickerPopupSize, string> = styleVariants(
  mapPickerPopupSizeTokens((size, token) => ({
    paddingInline: pickerPopupSizeVar(size, 'statusPaddingX', token.statusPaddingX),
    paddingBlock: pickerPopupSizeVar(size, 'statusPaddingY', token.statusPaddingY),
    fontSize: pickerPopupSizeVar(size, 'fontSize', token.fontSize),
    lineHeight: pickerPopupSizeVar(size, 'lineHeight', token.lineHeight),
  })),
)
