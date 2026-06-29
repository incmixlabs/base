export const formControlTransition =
  'transition-[background-color,border-color,box-shadow,color] duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)]'

export const formControlRadius = 'rounded-[var(--element-border-radius,var(--radius-md))]'

export const formControlBorderColor = '[border-color:var(--color-neutral-border)]'

export const formControlSubtleBorderColor = '[border-color:var(--color-neutral-border-subtle)]'

export const formControlPrimaryBorderColor = '[border-color:var(--color-primary-border)]'

export const formControlErrorBorderColor = '[border-color:var(--color-error-border)]'

export const formControlBorderFrame = `border border-solid ${formControlRadius}`

export const formControlBorderedSurface = `${formControlBorderFrame} ${formControlBorderColor}`

export const formControlSubtleBorderedSurface = `${formControlBorderFrame} ${formControlSubtleBorderColor}`

export const formControlDashedFrame = `border-2 border-dashed ${formControlRadius}`

export const formControlDashedSurface = `${formControlDashedFrame} ${formControlBorderColor}`

export const formControlNeutralBackground = '[background-color:var(--color-neutral-background)]'

export const formControlNeutralHoverBackground = 'hover:[background-color:var(--color-neutral-surface-hover)]'

export const formControlPrimaryHoverBorder = 'hover:[border-color:var(--color-primary-border)]'

export const formControlErrorHoverBorder = 'hover:[border-color:var(--color-error-border)]'

export const formControlNeutralHoverBorder = 'hover:[border-color:var(--color-neutral-border)]'

export const formControlErrorSurface =
  '[border-color:var(--color-error-border)] [background-color:var(--color-error-surface)]'

export const formControlPrimarySurface =
  '[border-color:var(--color-primary-border)] [background-color:var(--color-primary-surface)]'

export const formControlDisabled = 'opacity-50 cursor-not-allowed'

export const formControlClassNames = [
  formControlTransition,
  formControlRadius,
  formControlBorderColor,
  formControlSubtleBorderColor,
  formControlPrimaryBorderColor,
  formControlErrorBorderColor,
  formControlBorderFrame,
  formControlBorderedSurface,
  formControlSubtleBorderedSurface,
  formControlDashedFrame,
  formControlDashedSurface,
  formControlNeutralBackground,
  formControlNeutralHoverBackground,
  formControlPrimaryHoverBorder,
  formControlErrorHoverBorder,
  formControlNeutralHoverBorder,
  formControlErrorSurface,
  formControlPrimarySurface,
  formControlDisabled,
]
