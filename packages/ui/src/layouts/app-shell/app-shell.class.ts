const appShellBodySlotColumns =
  '[&>[data-slot=app-shell-sidebar]]:[grid-column:1] [&>[data-slot=app-shell-sidebar]]:min-w-0'

export const appShellBody = `${appShellBodySlotColumns} [grid-template-columns:var(--af-app-shell-layout-body-grid-template-columns,auto_minmax(0,1fr))] [&>[data-slot=app-shell-main]]:[grid-column:2] [&>[data-slot=app-shell-main]]:min-w-0 [&>[data-slot=app-shell-secondary]]:[grid-column:2] [&>[data-slot=app-shell-secondary]]:min-w-0`

export const appShellBodyWithSecondary = `${appShellBodySlotColumns} [grid-template-columns:var(--af-app-shell-layout-body-with-secondary-grid-template-columns,auto_auto_minmax(0,1fr))] [&>[data-slot=app-shell-main]]:[grid-column:3] [&>[data-slot=app-shell-main]]:min-w-0 [&>[data-slot=app-shell-secondary]]:[grid-column:2] [&>[data-slot=app-shell-secondary]]:min-w-0`

export const appShellBodyWithSecondaryRight = `${appShellBodySlotColumns} [grid-template-columns:var(--af-app-shell-layout-body-with-secondary-right-grid-template-columns,auto_minmax(0,1fr)_auto)] [&>[data-slot=app-shell-main]]:[grid-column:2] [&>[data-slot=app-shell-main]]:min-w-0 [&>[data-slot=app-shell-secondary]]:[grid-column:3] [&>[data-slot=app-shell-secondary]]:min-w-0`

export const appShellContent =
  '[background-color:var(--af-content-body-background,var(--background))] [color:var(--af-content-body-foreground,var(--foreground))] [border-color:var(--af-content-body-border-color,transparent)] [padding-inline:var(--af-app-shell-content-padding-inline,1rem)] [padding-block:var(--af-app-shell-content-padding-block,1rem)] md:[padding-inline:var(--af-app-shell-content-padding-inline-desktop,1.5rem)] md:[padding-block:var(--af-app-shell-content-padding-block-desktop,1.5rem)]'

export const appShellSecondaryLeft = ''

export const appShellSecondaryRight = ''

export const appShellSecondaryResizeHandle =
  'absolute top-0 bottom-0 z-30 w-3 border-0 bg-transparent p-0 cursor-col-resize touch-none after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:h-12 after:w-1 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:[background-color:var(--af-content-body-border-color,var(--border))] hover:after:[background-color:var(--ring)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-[-2px] focus-visible:after:[background-color:var(--ring)] data-[resizing]:after:[background-color:var(--ring)]'

export const appShellSecondaryResizeHandleLeft = 'right-0'

export const appShellSecondaryResizeHandleRight = 'left-0'

export const appShellClassNames = [
  appShellBody,
  appShellBodyWithSecondary,
  appShellBodyWithSecondaryRight,
  appShellContent,
  appShellSecondaryResizeHandle,
  appShellSecondaryResizeHandleLeft,
  appShellSecondaryResizeHandleRight,
]
