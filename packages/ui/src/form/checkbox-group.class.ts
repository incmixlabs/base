import type { CheckboxGroupOrientation } from './checkbox-group.props'

import type { FormSize } from './form-size'

export const checkboxGroupRootBase = 'flex'

export const checkboxGroupRootOrientation = {
  vertical: 'flex-col gap-2',
  horizontal: 'flex-row flex-wrap gap-4',
} as const satisfies Record<CheckboxGroupOrientation, string>

export const checkboxGroupItemBase = 'flex items-start'

export const checkboxGroupItemGap: Record<FormSize, string> = {
  xs: 'gap-2',
  sm: 'gap-2',
  md: 'gap-2',
  lg: 'gap-2',
}

export const checkboxGroupClassNames = [
  checkboxGroupRootBase,
  checkboxGroupItemBase,
  ...Object.values(checkboxGroupRootOrientation),
  ...Object.values(checkboxGroupItemGap),
]
