import { assign, setup } from 'xstate'

export type AppShellDrawerTab = 'nav' | 'secondary'
export type AppShellSecondarySide = 'left' | 'right'

export interface AppShellMachineContext {
  overlay: boolean
  secondaryOpen: boolean
  secondaryRegistered: boolean
  secondarySide: AppShellSecondarySide
  primarySidebarVisible: boolean
  drawerOpen: boolean
  drawerTab: AppShellDrawerTab
  primaryOpenBeforeSecondary: boolean | null
  primaryOpenInitialized: boolean
}

export type AppShellMachineInput = {
  overlay: boolean
  defaultSecondaryOpen: boolean
}

export const AppShellMachineEventType = {
  SetOverlay: 'SET_OVERLAY',
  SetSecondaryOpen: 'SET_SECONDARY_OPEN',
  ToggleSecondary: 'TOGGLE_SECONDARY',
  RegisterSecondary: 'REGISTER_SECONDARY',
  UnregisterSecondary: 'UNREGISTER_SECONDARY',
  SetSecondarySide: 'SET_SECONDARY_SIDE',
  SetDrawerOpen: 'SET_DRAWER_OPEN',
  SetDrawerTab: 'SET_DRAWER_TAB',
  OpenDrawer: 'OPEN_DRAWER',
  ShowPrimary: 'SHOW_PRIMARY',
  HidePrimary: 'HIDE_PRIMARY',
  RememberPrimaryOpen: 'REMEMBER_PRIMARY_OPEN',
  ClearRememberedPrimaryOpen: 'CLEAR_REMEMBERED_PRIMARY_OPEN',
  MarkPrimaryOpenInitialized: 'MARK_PRIMARY_OPEN_INITIALIZED',
} as const

export type AppShellMachineEvent =
  | { type: typeof AppShellMachineEventType.SetOverlay; overlay: boolean }
  | { type: typeof AppShellMachineEventType.SetSecondaryOpen; open: boolean }
  | { type: typeof AppShellMachineEventType.ToggleSecondary }
  | { type: typeof AppShellMachineEventType.RegisterSecondary; side: AppShellSecondarySide }
  | { type: typeof AppShellMachineEventType.UnregisterSecondary }
  | { type: typeof AppShellMachineEventType.SetSecondarySide; side: AppShellSecondarySide }
  | { type: typeof AppShellMachineEventType.SetDrawerOpen; open: boolean }
  | { type: typeof AppShellMachineEventType.SetDrawerTab; tab: AppShellDrawerTab }
  | { type: typeof AppShellMachineEventType.OpenDrawer; tab: AppShellDrawerTab }
  | { type: typeof AppShellMachineEventType.ShowPrimary }
  | { type: typeof AppShellMachineEventType.HidePrimary }
  | { type: typeof AppShellMachineEventType.RememberPrimaryOpen; open: boolean }
  | { type: typeof AppShellMachineEventType.ClearRememberedPrimaryOpen }
  | { type: typeof AppShellMachineEventType.MarkPrimaryOpenInitialized }

export const appShellMachine = setup({
  types: {} as {
    context: AppShellMachineContext
    events: AppShellMachineEvent
    input: AppShellMachineInput
  },
}).createMachine({
  id: 'appShell',
  context: ({ input }) => ({
    overlay: input.overlay,
    secondaryOpen: input.defaultSecondaryOpen,
    secondaryRegistered: false,
    secondarySide: 'right',
    primarySidebarVisible: true,
    drawerOpen: false,
    drawerTab: 'nav',
    primaryOpenBeforeSecondary: null,
    primaryOpenInitialized: false,
  }),
  on: {
    [AppShellMachineEventType.SetOverlay]: {
      actions: assign(({ context, event }) => ({
        overlay: event.overlay,
        drawerOpen: event.overlay ? context.drawerOpen : false,
      })),
    },
    [AppShellMachineEventType.SetSecondaryOpen]: {
      actions: assign(({ event }) => ({
        secondaryOpen: event.open,
      })),
    },
    [AppShellMachineEventType.ToggleSecondary]: {
      actions: assign(({ context }) => ({
        secondaryOpen: !context.secondaryOpen,
      })),
    },
    [AppShellMachineEventType.RegisterSecondary]: {
      actions: assign(({ event }) => ({
        secondaryRegistered: true,
        secondarySide: event.side,
      })),
    },
    [AppShellMachineEventType.UnregisterSecondary]: {
      actions: assign(() => ({
        secondaryRegistered: false,
        secondarySide: 'right',
      })),
    },
    [AppShellMachineEventType.SetSecondarySide]: {
      actions: assign(({ event }) => ({
        secondarySide: event.side,
      })),
    },
    [AppShellMachineEventType.SetDrawerOpen]: {
      actions: assign(({ event }) => ({
        drawerOpen: event.open,
      })),
    },
    [AppShellMachineEventType.SetDrawerTab]: {
      actions: assign(({ event }) => ({
        drawerTab: event.tab,
      })),
    },
    [AppShellMachineEventType.OpenDrawer]: {
      actions: assign(({ event }) => ({
        drawerOpen: true,
        drawerTab: event.tab,
      })),
    },
    [AppShellMachineEventType.ShowPrimary]: {
      actions: assign(() => ({
        primarySidebarVisible: true,
      })),
    },
    [AppShellMachineEventType.HidePrimary]: {
      actions: assign(() => ({
        primarySidebarVisible: false,
      })),
    },
    [AppShellMachineEventType.RememberPrimaryOpen]: {
      actions: assign(({ event }) => ({
        primaryOpenBeforeSecondary: event.open,
      })),
    },
    [AppShellMachineEventType.ClearRememberedPrimaryOpen]: {
      actions: assign(() => ({
        primaryOpenBeforeSecondary: null,
      })),
    },
    [AppShellMachineEventType.MarkPrimaryOpenInitialized]: {
      actions: assign(() => ({
        primaryOpenInitialized: true,
      })),
    },
  },
})

export function getAppShellNavigationState(context: AppShellMachineContext) {
  const bothInlinePanelsCollapsed =
    context.secondaryRegistered && !context.secondaryOpen && !context.primarySidebarVisible
  const primarySidebarHidden = !context.primarySidebarVisible

  return {
    bothInlinePanelsCollapsed,
    primarySidebarHidden,
    label: context.overlay
      ? 'Open navigation drawer'
      : bothInlinePanelsCollapsed
        ? 'Open navigation and secondary panel'
        : primarySidebarHidden
          ? 'Open navigation'
          : context.secondaryRegistered
            ? 'Toggle secondary panel'
            : 'Toggle sidebar',
    icon:
      context.overlay || !context.secondaryRegistered || bothInlinePanelsCollapsed || primarySidebarHidden
        ? 'menu'
        : `panel-${context.secondarySide}-${context.secondaryOpen ? 'close' : 'open'}`,
  }
}
