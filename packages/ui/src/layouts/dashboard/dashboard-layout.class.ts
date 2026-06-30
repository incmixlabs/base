export const dashboardItemFallback =
  'flex min-h-20 h-full items-center justify-center p-4 text-sm font-medium text-center text-neutral opacity-70'

export const presetPicker = 'grid gap-3 sm:grid-cols-2 lg:grid-cols-4'

export const presetButton =
  'grid min-w-0 gap-2 p-2 border border-border rounded-md bg-neutral-surface text-foreground text-left outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-in-out hover:border-ring focus-visible:shadow-[0_0_0_2px_var(--ring)]'

export const presetButtonSelected = 'border-ring bg-accent-soft'

export const presetName = 'overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium'

export const presetPreview = 'grid overflow-hidden p-1 rounded bg-neutral-soft'

export const presetPreviewCell = 'rounded-sm bg-border shadow-[0_0_0_1px_var(--color-neutral-background)]'

export const modeControl = 'inline-grid grid-cols-2 gap-1 p-1 border border-border rounded-md bg-neutral-soft'

export const modeButton =
  'px-3 py-1.5 border-0 rounded bg-transparent text-neutral opacity-70 text-sm font-medium capitalize outline-none transition-[background-color,color,box-shadow,opacity] duration-150 ease-in-out hover:opacity-100 hover:text-foreground focus-visible:shadow-[0_0_0_2px_var(--ring)]'

export const modeButtonSelected = 'bg-background text-foreground opacity-100 shadow-sm'

export const dashboardLayoutClassNames = [
  dashboardItemFallback,
  presetPicker,
  presetButton,
  presetButtonSelected,
  presetName,
  presetPreview,
  presetPreviewCell,
  modeControl,
  modeButton,
  modeButtonSelected,
]
