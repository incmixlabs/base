export const tabsPanelBase =
  'focus-visible:outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-highlight'

export const tabsPanelAnimated =
  'motion-safe:transition-opacity motion-safe:duration-[var(--af-motion-medium)] motion-safe:ease-[var(--af-ease-standard)] motion-reduce:transition-none'

export const tabsPanelStack = 'grid min-w-0'

export const tabsPanelStackItem = 'col-start-1 row-start-1'

export const tabsPanelActive = 'opacity-100'

export const tabsPanelInactive = 'opacity-0 pointer-events-none'

export const tabsClassNames = [
  tabsPanelBase,
  tabsPanelAnimated,
  tabsPanelStack,
  tabsPanelStackItem,
  tabsPanelActive,
  tabsPanelInactive,
]
