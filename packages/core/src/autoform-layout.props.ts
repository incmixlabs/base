export const autoFormResponsiveBreakpoints = ['base', 'initial', 'xs', 'sm', 'md', 'lg', 'xl'] as const
export const autoFormNormalizedResponsiveBreakpoints = ['initial', 'xs', 'sm', 'md', 'lg', 'xl'] as const

export const autoFormSectionLayoutValues = ['stacked', 'horizontal'] as const
export const autoFormFieldLayoutValues = ['stacked', 'horizontal', 'checkbox-row'] as const
export const autoFormLabelPlacementValues = ['top', 'start', 'end'] as const

export type AutoFormResponsiveBreakpoint = (typeof autoFormResponsiveBreakpoints)[number]
export type AutoFormNormalizedResponsiveBreakpoint = (typeof autoFormNormalizedResponsiveBreakpoints)[number]
export type AutoFormSectionLayout = (typeof autoFormSectionLayoutValues)[number]
export type AutoFormFieldLayout = (typeof autoFormFieldLayoutValues)[number]
export type AutoFormLabelPlacement = (typeof autoFormLabelPlacementValues)[number]

export type AutoFormResponsiveValue<T> = T | Partial<Record<AutoFormResponsiveBreakpoint, T>>
export type AutoFormNormalizedResponsiveValue<T> = T | Partial<Record<AutoFormNormalizedResponsiveBreakpoint, T>>
