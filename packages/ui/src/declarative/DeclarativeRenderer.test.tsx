import '@testing-library/jest-dom/vitest'
import { normalizePageDocument, type DeclarativeNode, type NormalizedPageDocument } from '@incmix/core'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { assign, createActor, createMachine } from 'xstate'
import { DeclarativePageRenderer, DeclarativeRenderer, evaluateDeclarativeExpression } from './DeclarativeRenderer'
import { createDeclarativePageActor } from './runtime'
import { declarativeUiReadonlyAuditPageFixture, declarativeUiTabbedSupportPageFixture } from './test-pages'

afterEach(() => {
  cleanup()
})

describe('DeclarativeRenderer', () => {
  it('evaluates xstate expressions against the active snapshot', () => {
    const machine = createMachine({
      initial: 'ready',
      context: {
        dirty: true,
      },
      states: {
        ready: {},
      },
    })
    const actorRef = createActor(machine).start()

    expect(evaluateDeclarativeExpression('state.matches("ready")', actorRef.getSnapshot())).toBe(true)
    expect(evaluateDeclarativeExpression('state.context.dirty === true', actorRef.getSnapshot())).toBe(true)
  })

  it('hides nodes when visibleWhen is false', () => {
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {},
      },
    })
    const actorRef = createActor(machine).start()
    const node: DeclarativeNode = {
      type: 'component',
      props: {
        component: 'Button',
        label: 'Save',
      },
      meta: {
        visibleWhen: 'state.matches("ready")',
      },
    }

    render(<DeclarativeRenderer node={node} actorRef={actorRef} />)

    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
  })

  it('disables interactive nodes when enabledWhen is false', () => {
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {},
      },
    })
    const actorRef = createActor(machine).start()
    const node: DeclarativeNode = {
      type: 'component',
      props: {
        component: 'Button',
        label: 'Save',
      },
      meta: {
        enabledWhen: 'state.matches("ready")',
      },
    }

    render(<DeclarativeRenderer node={node} actorRef={actorRef} />)

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('dispatches emitEvent actions to the actor', async () => {
    const events: string[] = []
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          on: {
            'FORM.SUBMIT': {
              actions: ({ event }) => {
                events.push(event.type)
              },
            },
          },
        },
      },
    })
    const actorRef = createActor(machine).start()
    const node: DeclarativeNode = {
      type: 'component',
      props: {
        component: 'Button',
        label: 'Save',
      },
      meta: {
        on: {
          click: {
            type: 'emitEvent',
            event: 'FORM.SUBMIT',
          },
        },
      },
    }

    render(<DeclarativeRenderer node={node} actorRef={actorRef} />)

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(events).toEqual(['FORM.SUBMIT'])
  })

  it('forwards non-emit actions to the supplied handler', async () => {
    const onAction = vi.fn()
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {},
      },
    })
    const actorRef = createActor(machine).start()
    const node: DeclarativeNode = {
      type: 'component',
      props: {
        component: 'Button',
        label: 'Open',
      },
      meta: {
        on: {
          click: {
            type: 'openModal',
          },
        },
      },
    }

    render(<DeclarativeRenderer node={node} actorRef={actorRef} onAction={onAction} />)

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    expect(onAction).toHaveBeenCalledWith({
      type: 'openModal',
    })
  })

  it('passes the live actor snapshot into custom component renderers', () => {
    const machine = createMachine({
      initial: 'ready',
      context: {
        clickCount: 3,
      },
      states: {
        ready: {},
      },
    })
    const actorRef = createActor(machine).start()
    const node: DeclarativeNode = {
      type: 'component',
      props: {
        component: 'Counter',
        label: 'Clicks',
      },
    }

    render(
      <DeclarativeRenderer
        node={node}
        actorRef={actorRef}
        components={{
          Counter: ({ node: currentNode, snapshot }) => {
            const runtimeSnapshot = snapshot as { context?: { clickCount?: number } } | undefined
            return (
              <span>
                {String(currentNode.props?.label)}: {runtimeSnapshot?.context?.clickCount ?? 0}
              </span>
            )
          },
        }}
      />,
    )

    expect(screen.getByText('Clicks: 3')).toBeInTheDocument()
  })

  it('dispatches submit events from form nodes and prevents default submission', () => {
    const events: string[] = []
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          on: {
            'FORM.SUBMIT': {
              actions: ({ event }) => {
                events.push(event.type)
              },
            },
          },
        },
      },
    })
    const actorRef = createActor(machine).start()
    const node: DeclarativeNode = {
      type: 'form',
      meta: {
        on: {
          submit: {
            type: 'emitEvent',
            event: 'FORM.SUBMIT',
          },
        },
      },
      children: [
        {
          type: 'field',
          props: {
            name: 'name',
            label: 'Name',
          },
        },
      ],
    }

    const { container } = render(<DeclarativeRenderer node={node} actorRef={actorRef} />)

    const form = container.querySelector('form')
    expect(form).toBeInstanceOf(HTMLFormElement)
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    fireEvent(form as HTMLFormElement, submitEvent)

    expect(submitEvent.defaultPrevented).toBe(true)
    expect(events).toEqual(['FORM.SUBMIT'])
  })

  it('renders a normalized page document through the page wrapper', () => {
    const machine = createMachine({
      initial: 'ready',
      states: {
        ready: {},
      },
    })
    const actorRef = createActor(machine).start()
    const page: NormalizedPageDocument = {
      kind: 'page',
      id: 'requests.index',
      title: 'Requests',
      root: {
        type: 'component',
        props: {
          component: 'Button',
          label: 'Open Requests',
        },
      },
    }

    render(<DeclarativePageRenderer page={page} actorRef={actorRef} />)

    expect(screen.getByRole('button', { name: 'Open Requests' })).toBeInTheDocument()
  })

  it('renders tabbed page variants and swaps visible content through runtime events', async () => {
    const user = userEvent.setup()
    const actorRef = createDeclarativePageActor({
      page: normalizePageDocument(declarativeUiTabbedSupportPageFixture),
      context: {
        activeView: 'summary' as 'summary' | 'detail',
      },
      states: {
        ready: {
          on: {
            'view.summary': {
              actions: assign(() => ({
                activeView: 'summary' as const,
              })),
            },
            'view.detail': {
              actions: assign(() => ({
                activeView: 'detail' as const,
              })),
            },
          },
        },
      },
    })
    actorRef.start()

    render(
      <DeclarativePageRenderer
        page={normalizePageDocument(declarativeUiTabbedSupportPageFixture)}
        actorRef={actorRef}
        components={{
          Tabs: ({ node, triggerAction }) => {
            const tabs = Array.isArray(node.props?.tabs)
              ? (node.props.tabs as Array<{ id: string; label: string }>)
              : []

            return (
              <div aria-label="Dashboard views" role="tablist">
                {tabs.map(tab => (
                  <button key={tab.id} type="button" role="tab" onClick={() => triggerAction(`select:${tab.id}`)}>
                    {tab.label}
                  </button>
                ))}
              </div>
            )
          },
        }}
      />,
    )

    expect(screen.getByText('Support Dashboard Header')).toBeInTheDocument()
    expect(screen.getByText('Support Dashboard Footer')).toBeInTheDocument()
    expect(screen.getByText('Summary KPIs')).toBeInTheDocument()
    expect(screen.queryByText('Detail Feed')).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Detail' }))

    expect(screen.getByText('Detail Feed')).toBeInTheDocument()
    expect(screen.queryByText('Summary KPIs')).not.toBeInTheDocument()

    actorRef.stop()
  })

  it('renders view-only pages with read-only fields and enabled access-request actions', () => {
    const actorRef = createDeclarativePageActor({
      page: normalizePageDocument(declarativeUiReadonlyAuditPageFixture),
      context: {
        mode: 'view',
        canEdit: false,
      },
    })
    actorRef.start()

    render(
      <DeclarativePageRenderer
        page={normalizePageDocument(declarativeUiReadonlyAuditPageFixture)}
        actorRef={actorRef}
      />,
    )

    expect(screen.getByText('Incident Audit Header')).toBeInTheDocument()
    expect(screen.getByText('View-only audit trail')).toBeInTheDocument()
    expect(screen.getByLabelText('Incident ID')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Owner')).toHaveAttribute('readonly')
    expect(screen.getByRole('button', { name: 'Request Edit Access' })).toBeEnabled()

    actorRef.stop()
  })
})
