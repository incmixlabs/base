import { describe, expect, it } from 'vitest'
import { createActor } from 'xstate'
import { AppShellMachineEventType, appShellMachine, getAppShellNavigationState } from './app-shell-machine'

function createAppShellActor(input: { overlay?: boolean; defaultSecondaryOpen?: boolean } = {}) {
  return createActor(appShellMachine, {
    input: {
      overlay: input.overlay ?? false,
      defaultSecondaryOpen: input.defaultSecondaryOpen ?? true,
    },
  }).start()
}

describe('appShellMachine', () => {
  it('tracks secondary registration and inline open state', () => {
    const actor = createAppShellActor()

    actor.send({ type: AppShellMachineEventType.RegisterSecondary, side: 'left' })

    expect(actor.getSnapshot().context.secondaryRegistered).toBe(true)
    expect(actor.getSnapshot().context.secondarySide).toBe('left')
    expect(actor.getSnapshot().context.secondaryOpen).toBe(true)

    actor.send({ type: AppShellMachineEventType.ToggleSecondary })

    expect(actor.getSnapshot().context.secondaryOpen).toBe(false)

    actor.send({ type: AppShellMachineEventType.UnregisterSecondary })

    expect(actor.getSnapshot().context.secondaryRegistered).toBe(false)
    expect(actor.getSnapshot().context.secondarySide).toBe('right')

    actor.stop()
  })

  it('closes the drawer when leaving overlay mode', () => {
    const actor = createAppShellActor({ overlay: true })

    actor.send({ type: AppShellMachineEventType.OpenDrawer, tab: 'secondary' })

    expect(actor.getSnapshot().context.drawerOpen).toBe(true)
    expect(actor.getSnapshot().context.drawerTab).toBe('secondary')

    actor.send({ type: AppShellMachineEventType.SetOverlay, overlay: false })

    expect(actor.getSnapshot().context.overlay).toBe(false)
    expect(actor.getSnapshot().context.drawerOpen).toBe(false)
    expect(actor.getSnapshot().context.drawerTab).toBe('secondary')

    actor.stop()
  })

  it('keeps overlay and drawer state coherent during rapid mode changes', () => {
    const actor = createAppShellActor({ overlay: false })

    actor.send({ type: AppShellMachineEventType.SetOverlay, overlay: true })
    actor.send({ type: AppShellMachineEventType.OpenDrawer, tab: 'secondary' })
    actor.send({ type: AppShellMachineEventType.SetOverlay, overlay: false })
    actor.send({ type: AppShellMachineEventType.SetOverlay, overlay: true })

    expect(actor.getSnapshot().context).toMatchObject({
      overlay: true,
      drawerOpen: false,
      drawerTab: 'secondary',
    })

    actor.stop()
  })

  it('remembers primary open state while entering inline secondary mode', () => {
    const actor = createAppShellActor()

    actor.send({ type: AppShellMachineEventType.RememberPrimaryOpen, open: true })

    expect(actor.getSnapshot().context.primaryOpenBeforeSecondary).toBe(true)

    actor.send({ type: AppShellMachineEventType.ClearRememberedPrimaryOpen })

    expect(actor.getSnapshot().context.primaryOpenBeforeSecondary).toBeNull()

    actor.stop()
  })

  it('derives navigation trigger labels for collapsed states', () => {
    const actor = createAppShellActor()

    expect(getAppShellNavigationState(actor.getSnapshot().context).label).toBe('Toggle sidebar')

    actor.send({ type: AppShellMachineEventType.RegisterSecondary, side: 'right' })

    expect(getAppShellNavigationState(actor.getSnapshot().context)).toMatchObject({
      icon: 'panel-right-close',
      label: 'Toggle secondary panel',
    })

    actor.send({ type: AppShellMachineEventType.SetSecondaryOpen, open: false })

    expect(getAppShellNavigationState(actor.getSnapshot().context)).toMatchObject({
      icon: 'panel-right-open',
      label: 'Toggle secondary panel',
    })

    actor.send({ type: AppShellMachineEventType.SetSecondaryOpen, open: true })
    actor.send({ type: AppShellMachineEventType.SetSecondarySide, side: 'left' })

    expect(getAppShellNavigationState(actor.getSnapshot().context)).toMatchObject({
      icon: 'panel-left-close',
      label: 'Toggle secondary panel',
    })

    actor.send({ type: AppShellMachineEventType.SetSecondaryOpen, open: false })
    actor.send({ type: AppShellMachineEventType.HidePrimary })

    expect(getAppShellNavigationState(actor.getSnapshot().context)).toMatchObject({
      bothInlinePanelsCollapsed: true,
      icon: 'menu',
      label: 'Open navigation and secondary panel',
    })

    actor.stop()
  })
})
