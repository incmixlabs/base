import type { stepperPropDefs } from './stepper.props'

export type StepperOrientation = (typeof stepperPropDefs.orientation.values)[number]
export type StepperVariant = (typeof stepperPropDefs.variant.values)[number]
export type StepperSize = (typeof stepperPropDefs.size.values)[number]

export const stepperRoot = 'grid w-full gap-4'

export const stepperNav = {
  horizontal: 'flex w-full items-stretch gap-3',
  vertical: 'grid w-full gap-3',
} as const satisfies Record<StepperOrientation, string>

export const stepperItem = {
  horizontal: 'flex min-w-0 flex-1 items-center gap-3',
  vertical: 'grid min-w-0 items-start gap-3',
} as const satisfies Record<StepperOrientation, string>

export const stepperTriggerBase =
  'box-border flex min-w-0 appearance-none items-center border-0 bg-transparent p-0 text-neutral outline-none enabled:cursor-pointer aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-highlight'

export const stepperTriggerOrientation = {
  horizontal: 'flex-1 justify-start',
  vertical: 'w-full',
} as const satisfies Record<StepperOrientation, string>

export const stepperTriggerSize = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-[length:0.9375rem]',
  lg: 'text-base',
} as const satisfies Record<StepperSize, string>

export const stepperTriggerVariant = {
  default: 'rounded-2xl px-1.5 py-1',
  pill: 'rounded-full bg-neutral-soft px-2.5 py-1.5',
  minimal: 'px-0 py-0.5',
} as const satisfies Record<StepperVariant, string>

export const stepperIndicatorBase =
  'inline-flex shrink-0 items-center justify-center box-border rounded-full border border-solid border-neutral font-semibold transition-[background-color,border-color,color] duration-150 ease-in-out'

export const stepperIndicatorSize = {
  xs: 'h-5 w-5 text-xs',
  sm: 'h-6 w-6 text-sm',
  md: 'h-7 w-7 text-[length:0.9375rem]',
  lg: 'h-8 w-8 text-base',
} as const satisfies Record<StepperSize, string>

export const stepperIndicatorVariant = {
  default:
    'data-[state=active]:bg-primary-soft data-[state=active]:[border-color:var(--color-primary-solid)] data-[state=active]:text-primary data-[state=completed]:bg-primary-solid data-[state=completed]:[border-color:var(--color-primary-solid)] data-[state=completed]:text-primary-contrast',
  pill: 'border-transparent bg-neutral-soft data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=completed]:bg-primary-solid data-[state=completed]:text-primary-contrast',
  minimal:
    'bg-transparent data-[state=active]:[border-color:var(--color-primary-solid)] data-[state=active]:text-primary data-[state=completed]:bg-primary-soft data-[state=completed]:[border-color:var(--color-primary-solid)] data-[state=completed]:text-primary',
} as const satisfies Record<StepperVariant, string>

export const stepperText = 'grid min-w-0 gap-0.5'

export const stepperTitle = 'font-semibold leading-[1.4]'

export const stepperTitleSize = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-[length:0.9375rem]',
  lg: 'text-base',
} as const satisfies Record<StepperSize, string>

export const stepperDescription = 'text-muted'

export const stepperDescriptionSize = {
  xs: 'text-[length:0.6875rem]',
  sm: 'text-xs',
  md: 'text-[length:0.8125rem]',
  lg: 'text-sm',
} as const satisfies Record<StepperSize, string>

export const stepperSeparator = {
  horizontal: 'self-center h-px min-w-4 flex-auto bg-[var(--color-neutral-border)]',
  vertical: 'h-8 w-px bg-[var(--color-neutral-border)]',
} as const satisfies Record<StepperOrientation, string>

export const stepperSeparatorOffset = {
  xs: '[margin-inline-start:calc(0.625rem_-_0.5px)]',
  sm: '[margin-inline-start:calc(0.75rem_-_0.5px)]',
  md: '[margin-inline-start:calc(0.875rem_-_0.5px)]',
  lg: '[margin-inline-start:calc(1rem_-_0.5px)]',
} as const satisfies Record<StepperSize, string>

export const stepperSeparatorCompleted = 'bg-primary-solid'

export const stepperPanel = 'min-h-40 rounded-2xl border border-solid border-neutral p-4'

export const stepperPanelAnimated =
  'animate-in fade-in-0 blur-in-4 duration-300 ease-in-out motion-reduce:animate-none motion-reduce:duration-0'

export const stepperFooter = 'flex items-center justify-between gap-2'

export const stepperFooterMeta = 'text-muted text-sm'

export const stepperFooterActions = 'flex items-center gap-2'

export const stepperClassNames = [
  stepperRoot,
  ...Object.values(stepperNav),
  ...Object.values(stepperItem),
  stepperTriggerBase,
  ...Object.values(stepperTriggerOrientation),
  ...Object.values(stepperTriggerSize),
  ...Object.values(stepperTriggerVariant),
  stepperIndicatorBase,
  ...Object.values(stepperIndicatorSize),
  ...Object.values(stepperIndicatorVariant),
  stepperText,
  stepperTitle,
  ...Object.values(stepperTitleSize),
  stepperDescription,
  ...Object.values(stepperDescriptionSize),
  ...Object.values(stepperSeparator),
  ...Object.values(stepperSeparatorOffset),
  stepperSeparatorCompleted,
  stepperPanel,
  stepperPanelAnimated,
  stepperFooter,
  stepperFooterMeta,
  stepperFooterActions,
]
