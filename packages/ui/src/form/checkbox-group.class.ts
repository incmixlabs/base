import type { CheckboxGroupOrientation } from './checkbox-group.props'

import type { FormSize } from './form-size'

export const checkboxGroupRootBase = 'flex'

export const checkboxGroupRootOrientation = {
  vertical: 'flex-col gap-[var(--af-checkbox-group-gap,0.5rem)]',
  horizontal: 'flex-row flex-wrap gap-[var(--af-checkbox-group-inline-gap,1rem)]',
} as const satisfies Record<CheckboxGroupOrientation, string>

export const checkboxGroupItemBase = 'flex items-start'

export const checkboxGroupItemGap: Record<FormSize, string> = {
  xs: 'gap-[var(--component-checkbox-group-size-xs-item-gap,0.5rem)]',
  sm: 'gap-[var(--component-checkbox-group-size-sm-item-gap,0.5rem)]',
  md: 'gap-[var(--component-checkbox-group-size-md-item-gap,0.5rem)]',
  lg: 'gap-[var(--component-checkbox-group-size-lg-item-gap,0.5rem)]',
}

export const checkboxGroupClassNames = [
  checkboxGroupRootBase,
  checkboxGroupItemBase,
  ...Object.values(checkboxGroupRootOrientation),
  ...Object.values(checkboxGroupItemGap),
]
