export const tourStepBase =
  'fixed z-50 flex w-[min(32rem,calc(100vw-2rem))] flex-col gap-4 rounded-[var(--element-border-radius)] border bg-neutral-surface p-4 text-neutral shadow-md outline-none'

export const tourSpotlightBase =
  'fixed inset-0 z-50 [background-color:rgb(0_0_0_/_0.8)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0'

export const tourSpotlightRingBase = 'pointer-events-none fixed z-50 border-primary ring-[3px] ring-primary/50'

export const tourCloseBase =
  'absolute top-4 right-4 inline-flex h-4 w-4 appearance-none cursor-pointer items-center justify-center rounded-xs border-0 bg-transparent p-0 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none'

export const tourControlButtonBase = 'h-6 px-2'

export const tourClassNames = [
  tourStepBase,
  tourSpotlightBase,
  tourSpotlightRingBase,
  tourCloseBase,
  tourControlButtonBase,
]
