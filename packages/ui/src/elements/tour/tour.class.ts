export const tourStepBase =
  'fixed z-50 flex w-[min(32rem,calc(100vw-2rem))] flex-col gap-4 rounded-[var(--element-border-radius)] border bg-popover p-4 text-popover-foreground shadow-md outline-none'

export const tourSpotlightBase =
  'fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0'

export const tourSpotlightRingBase = 'pointer-events-none fixed z-50 border-ring ring-[3px] ring-ring/50'

export const tourArrowSvgBase = 'block fill-popover stroke-border'

export const tourHeaderBase = 'flex flex-col gap-1.5 text-center sm:text-left'

export const tourTitleBase = 'font-semibold text-lg leading-none tracking-tight'

export const tourDescriptionBase = 'text-muted-foreground text-sm'

export const tourCloseBase =
  "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"

export const tourStepCounterBase = 'mr-auto shrink-0 whitespace-nowrap text-muted-foreground text-sm'

export const tourFooterBase = 'flex w-full flex-wrap items-center gap-2'

export const tourClassNames = [
  tourStepBase,
  tourSpotlightBase,
  tourSpotlightRingBase,
  tourArrowSvgBase,
  tourHeaderBase,
  tourTitleBase,
  tourDescriptionBase,
  tourCloseBase,
  tourStepCounterBase,
  tourFooterBase,
]
