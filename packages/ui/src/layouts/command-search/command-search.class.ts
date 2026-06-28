export const commandDialogContent =
  'fixed z-50 box-border inset-x-4 top-[10vh] mx-auto max-h-[calc(100dvh-2rem)] w-[92vw] max-w-[37.5rem] overflow-hidden rounded-[calc(var(--radius-factor)_*_1rem)] border border-solid border-neutral bg-neutral-surface text-neutral shadow-[0_24px_64px_color-mix(in_oklch,black_24%,transparent)] focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'

export const commandDialogRoot = 'flex flex-col text-neutral'

export const commandSearchTrigger =
  'border-neutral bg-neutral-surface text-neutral hover:bg-neutral-soft active:bg-[var(--color-neutral-soft-hover)]'

export const commandInputRow = 'flex items-center gap-3 border-0 border-b border-solid border-neutral px-4'

export const commandSearchIcon = 'h-4 w-4 shrink-0 text-neutral opacity-[0.55]'

export const commandInput =
  'h-14 w-full border-0 bg-transparent p-0 text-base text-neutral outline-none placeholder:text-neutral placeholder:opacity-[0.55]'

export const commandList =
  'max-h-[50vh] overflow-y-auto py-2 transition-[height] duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)] [&_[cmdk-list-sizer]]:flex [&_[cmdk-list-sizer]]:flex-col'

export const commandEmptyState = 'px-4 py-8 text-[0.9375rem] text-neutral opacity-[0.65]'

export const commandGroup =
  '[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-[0.08em] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-neutral [&_[cmdk-group-heading]]:opacity-[0.5]'

export const commandItem =
  'relative flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 pl-5 text-neutral outline-none transition-[background-color,color] duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-[0.45] data-[selected=true]:bg-slate-soft data-[selected=true]:before:content-[""] data-[selected=true]:before:absolute data-[selected=true]:before:left-0 data-[selected=true]:before:top-[0.35rem] data-[selected=true]:before:bottom-[0.35rem] data-[selected=true]:before:w-1 data-[selected=true]:before:rounded-r-full data-[selected=true]:before:bg-primary-solid'

export const commandItemText = 'flex min-w-0 flex-1 flex-col'

export const commandItemLabel = 'truncate text-[0.9375rem] font-semibold'

export const commandItemDescription = 'truncate text-sm text-neutral opacity-[0.7]'

export const shortcutRow = 'flex shrink-0 items-center gap-1'

export const shortcutKey = 'min-w-6 justify-center'
