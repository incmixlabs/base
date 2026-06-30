export const tabsPanelBase =
  'focus-visible:outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-highlight'

export const tabsPanelAnimated =
  'motion-safe:animate-[af-tabs-panel-enter_var(--af-motion-medium)_var(--af-ease-standard)] motion-reduce:animate-none'

export const tabsPanelInactive = 'absolute inset-x-0 opacity-0 pointer-events-none'

export const tabsClassNames = [tabsPanelBase, tabsPanelAnimated, tabsPanelInactive]
