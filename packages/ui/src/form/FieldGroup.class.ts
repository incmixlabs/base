import type { Spacing } from '../theme/tokens'

export const fieldGroupSideLabelsBase = '[container-type:inline-size]'

export const fieldGroupRowBase =
  'grid grid-cols-[minmax(0,1fr)] items-start gap-y-[var(--theme-rhythm-field-group-row-gap,var(--af-field-group-row-root-gap,1rem))]'

export const fieldGroupRowResponsive =
  'cq-md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] cq-md:gap-x-[var(--theme-rhythm-field-group-column-gap,var(--af-field-group-row-column-gap,2rem))]'

export const fieldGroupSectionSeparator = 'my-[var(--af-field-group-section-separator-margin-block,1.5rem)]'

export const fieldGroupSectionHeader = 'mb-[var(--af-field-group-section-header-margin-bottom,1rem)]'

export const fieldGroupSectionDescription = 'mt-[var(--af-field-group-section-description-margin-top,0.25rem)]'

export const fieldGroupRowDescription = 'mt-[var(--af-field-group-row-description-margin-top,0.25rem)]'

export const fieldGroupLabelText = 'text-sm font-medium text-neutral'

export const fieldGroupDescriptionText = 'text-sm text-neutral opacity-70'

export const fieldGroupRowGapClasses: Record<Spacing, string> = {
  '0': 'gap-0',
  '1': 'gap-1',
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '5': 'gap-5',
  '6': 'gap-6',
  '7': 'gap-7',
  '8': 'gap-8',
  '9': 'gap-9',
}

export const fieldGroupClassNames = [
  fieldGroupSideLabelsBase,
  fieldGroupRowBase,
  fieldGroupRowResponsive,
  fieldGroupSectionSeparator,
  fieldGroupSectionHeader,
  fieldGroupSectionDescription,
  fieldGroupRowDescription,
  fieldGroupLabelText,
  fieldGroupDescriptionText,
  ...Object.values(fieldGroupRowGapClasses),
]
