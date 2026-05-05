import '@testing-library/jest-dom/vitest'
import { normalizePageDocument } from '@incmix/core'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { assign } from 'xstate'
import { DeclarativePageRenderer } from '@/declarative/DeclarativeRenderer'
import { createDeclarativePageActor } from '@/declarative/runtime'
import { declarativeUiWidgetProofPage, localWidgetRegistry, resolveLocalWidgetsInPageDocument } from './local-registry'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('local widget registry', () => {
  it('expands local widget references into ordinary declarative nodes before normalization', () => {
    const resolvedPage = resolveLocalWidgetsInPageDocument(declarativeUiWidgetProofPage, localWidgetRegistry)
    const normalizedPage = normalizePageDocument(resolvedPage)

    expect(normalizedPage.root.children?.[0]).toMatchObject({
      type: 'layout',
      children: [
        {
          type: 'template',
          props: {
            template: 'Summary Snapshot',
          },
        },
        {
          type: 'component',
          props: {
            component: 'MetricCard',
            label: 'Open Requests',
          },
        },
        {
          type: 'component',
          props: {
            component: 'Button',
            label: 'Review Queue',
          },
        },
      ],
    })
    expect(normalizedPage.runtime?.actions).toEqual([
      {
        nodePath: 'root.children[0].children[2]',
        trigger: 'click',
        action: {
          type: 'emitEvent',
          event: 'widget.review-queue',
        },
      },
    ])
  })

  it('throws when a widget node omits props.widget', () => {
    expect(() =>
      resolveLocalWidgetsInPageDocument(
        {
          kind: 'page',
          id: 'broken.missing-widget-prop',
          root: {
            type: 'widget',
          },
        },
        localWidgetRegistry,
      ),
    ).toThrow('resolveLocalWidgetsInPageDocument: widget nodes must provide props.widget')
  })

  it('throws when a widget id is not present in the registry', () => {
    expect(() =>
      resolveLocalWidgetsInPageDocument(
        {
          kind: 'page',
          id: 'broken.unknown-widget',
          root: {
            type: 'widget',
            props: {
              widget: 'support.missing-widget',
            },
          },
        },
        localWidgetRegistry,
      ),
    ).toThrow('resolveLocalWidgetsInPageDocument: unknown widget "support.missing-widget"')
  })

  it('throws when widget definitions contain a cycle', () => {
    expect(() =>
      resolveLocalWidgetsInPageDocument(
        {
          kind: 'page',
          id: 'broken.cyclic-widget',
          root: {
            type: 'widget',
            props: {
              widget: 'cyclic.a',
            },
          },
        },
        {
          'cyclic.a': {
            kind: 'widget',
            id: 'cyclic.a',
            node: {
              type: 'widget',
              props: {
                widget: 'cyclic.b',
              },
            },
          },
          'cyclic.b': {
            kind: 'widget',
            id: 'cyclic.b',
            node: {
              type: 'widget',
              props: {
                widget: 'cyclic.a',
              },
            },
          },
        },
      ),
    ).toThrow('resolveLocalWidgetsInPageDocument: cyclic widget reference detected for "cyclic.a"')
  })

  it('renders resolved widget pages through the existing declarative component registry path', async () => {
    const page = normalizePageDocument(
      resolveLocalWidgetsInPageDocument(declarativeUiWidgetProofPage, localWidgetRegistry),
    )
    const actorRef = createDeclarativePageActor({
      page,
      context: {
        reviewCount: 0,
      },
      states: {
        ready: {
          on: {
            'widget.review-queue': {
              actions: assign({
                reviewCount: ({ context }) => context.reviewCount + 1,
              }),
            },
          },
        },
      },
    })
    actorRef.start()

    render(
      <DeclarativePageRenderer
        page={page}
        actorRef={actorRef}
        components={{
          MetricCard: ({ node }) => <div>{String(node.props?.label)}</div>,
          ActivityFeed: ({ node }) => <div>{String(node.props?.label)}</div>,
        }}
      />,
    )

    expect(screen.getByText('Summary Snapshot')).toBeInTheDocument()
    expect(screen.getByText('Open Requests')).toBeInTheDocument()
    expect(screen.getByText('Escalation Watchlist')).toBeInTheDocument()
    expect(screen.getByText('Escalations needing review')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Review Queue' }))

    expect(actorRef.getSnapshot().context.reviewCount).toBe(1)

    actorRef.stop()
  })
})
