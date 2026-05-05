import type { ComplexStyleRule } from '@vanilla-extract/css'

export const getDateNextCalendarButtonSurface = (sizeVar: string) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: sizeVar,
  height: sizeVar,
  borderRadius: 'var(--element-border-radius)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border)',
  backgroundColor: 'var(--background)',
  transition:
    'background-color var(--af-motion-fast) var(--af-ease-standard), border-color var(--af-motion-fast) var(--af-ease-standard), box-shadow var(--af-motion-fast) var(--af-ease-standard)',
  selectors: {
    '&:focus-visible': {
      borderColor: 'var(--ring)',
      boxShadow: '0 0 0 2px color-mix(in srgb, var(--ring) 24%, transparent)',
    },
  },
})

export const getDateNextCalendarSurfaceRoot = () => ({
  width: 'max-content',
  maxWidth: '100%',
  display: 'inline-flex',
  flexDirection: 'column' as const,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border)',
  backgroundColor: 'var(--background)',
})

export const getDateNextDisabledState = () => ({
  opacity: 0.5,
  pointerEvents: 'none' as const,
})

export const getDateNextNavButtonSurface = (sizeVar: string) => ({
  width: sizeVar,
  height: sizeVar,
  padding: 0,
  borderRadius: 'var(--element-border-radius)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const getDateNextNavIconStyle = (iconSizeVar: string) => ({
  width: iconSizeVar,
  height: iconSizeVar,
})

export const getDateNextMonthPickerIconStyle = (iconSizeVar: string) => ({
  width: `calc(${iconSizeVar} * 0.48)`,
  height: `calc(${iconSizeVar} * 0.48)`,
  flexShrink: 0,
  opacity: 0.85,
})

export const getDateNextCalendarTypography = (fontSizeVar: string, lineHeightVar: string) => ({
  fontSize: fontSizeVar,
  lineHeight: lineHeightVar,
})

export const getDateNextWeekdayRowStyle = () => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: 0,
  textAlign: 'center' as const,
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
})

export const getDateNextDayGridStyle = () => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: 0,
})

export const getDateNextDayInteractiveStyle = (options?: { unavailableLineThrough?: boolean }): ComplexStyleRule => ({
  appearance: 'none',
  border: 0,
  background: 'transparent',
  padding: 0,
  margin: 0,
  fontFamily: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
  textAlign: 'center' as const,
  outline: 'none',
  selectors: {
    '&[data-outside-month]': {
      color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
    },
    '&[data-unavailable]': {
      color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
      ...(options?.unavailableLineThrough ? { textDecoration: 'line-through' } : {}),
    },
    '&:hover:not([data-unavailable]):not([data-selected])': {
      backgroundColor: 'var(--color-accent-soft)',
    },
    '&[data-unavailable]:hover': {
      backgroundColor: 'transparent',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--ring)',
    },
    '&:disabled': {
      cursor: 'default',
      opacity: 1,
    },
  },
})
