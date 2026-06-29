import type { CheckboxGroupOrientation } from './checkbox-group.props'

export const checkboxGroupRootBase = 'flex'

export const checkboxGroupRootOrientation = {
  vertical: 'flex-col gap-[var(--af-checkbox-group-gap,0.5rem)]',
  horizontal: 'flex-row flex-wrap gap-[var(--af-checkbox-group-inline-gap,1rem)]',
} as const satisfies Record<CheckboxGroupOrientation, string>

export const checkboxGroupItemBase = 'flex items-start gap-[var(--af-checkbox-group-item-gap,0.5rem)]'

export const checkboxGroupClassNames = [
  checkboxGroupRootBase,
  checkboxGroupItemBase,
  ...Object.values(checkboxGroupRootOrientation),
]
