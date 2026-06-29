import type { FormSize } from './form-size'

export type CheckboxCardSize = FormSize

export const checkboxCardSizeVariants = {
  xs: '[--cbc-padding:var(--component-checkbox-cards-size-xs-padding,0.75rem)] [--cbc-cb-size:var(--component-checkbox-cards-size-xs-box-size,0.875rem)] [--cbc-icon-size:var(--component-checkbox-cards-size-xs-icon-size,0.75rem)] [--cbc-font-size:var(--component-checkbox-cards-size-xs-font-size,0.75rem)] [--cbc-gap:var(--component-checkbox-cards-size-xs-gap,0.5rem)]',
  sm: '[--cbc-padding:var(--component-checkbox-cards-size-sm-padding,0.75rem)] [--cbc-cb-size:var(--component-checkbox-cards-size-sm-box-size,1rem)] [--cbc-icon-size:var(--component-checkbox-cards-size-sm-icon-size,0.875rem)] [--cbc-font-size:var(--component-checkbox-cards-size-sm-font-size,0.875rem)] [--cbc-gap:var(--component-checkbox-cards-size-sm-gap,0.5rem)]',
  md: '[--cbc-padding:var(--component-checkbox-cards-size-md-padding,1rem)] [--cbc-cb-size:var(--component-checkbox-cards-size-md-box-size,1.25rem)] [--cbc-icon-size:var(--component-checkbox-cards-size-md-icon-size,1rem)] [--cbc-font-size:var(--component-checkbox-cards-size-md-font-size,1rem)] [--cbc-gap:var(--component-checkbox-cards-size-md-gap,0.75rem)]',
  lg: '[--cbc-padding:var(--component-checkbox-cards-size-lg-padding,1.25rem)] [--cbc-cb-size:var(--component-checkbox-cards-size-lg-box-size,1.5rem)] [--cbc-icon-size:var(--component-checkbox-cards-size-lg-icon-size,1.25rem)] [--cbc-font-size:var(--component-checkbox-cards-size-lg-font-size,1.125rem)] [--cbc-gap:var(--component-checkbox-cards-size-lg-gap,0.75rem)]',
} as const satisfies Record<CheckboxCardSize, string>

export const checkboxCardsClassNames = Object.values(checkboxCardSizeVariants)
