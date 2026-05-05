import { describe, expect, it } from 'vitest'
import {
  type AppDocument,
  type DeclarativeDocument,
  normalizeAppDocument,
  normalizeDeclarativeDocument,
  normalizePageDocument,
  type PageDocument,
  resolveDeclarativeRef,
} from './declarative-ui'
import {
  declarativeUiGrammarPressureApp,
  declarativeUiReadonlyAuditPage,
  declarativeUiTabbedSupportPage,
} from './declarative-ui.examples'

describe('declarative-ui', () => {
  it('resolves local refs and merges inline props and meta', () => {
    const document: DeclarativeDocument = {
      schemaVersion: '0.2',
      root: {
        $ref: '#/components/Page',
        props: {
          gap: 24,
        },
        meta: {
          visibleWhen: 'state.matches("ready")',
        },
      },
      components: {
        Page: {
          type: 'layout',
          props: {
            direction: 'vertical',
            gap: 12,
          },
          meta: {
            enabledWhen: 'state.context.canEdit === true',
          },
          children: [
            {
              type: 'component',
              props: {
                component: 'Button',
                label: 'Save',
              },
            },
          ],
        },
      },
    }

    const normalized = normalizeDeclarativeDocument(document)

    expect(normalized.root).toMatchObject({
      type: 'layout',
      props: {
        direction: 'vertical',
        gap: 24,
      },
      meta: {
        enabledWhen: 'state.context.canEdit === true',
        visibleWhen: 'state.matches("ready")',
      },
    })
  })

  it('normalizes nested refs in children and slots', () => {
    const document: DeclarativeDocument = {
      root: {
        type: 'layout',
        children: [
          {
            $ref: '#/components/Card',
          },
        ],
        slots: {
          footer: {
            $ref: '#/components/Footer',
          },
        },
      },
      components: {
        Card: {
          type: 'component',
          props: {
            component: 'Card',
            title: 'Overview',
          },
        },
        Footer: {
          type: 'template',
          props: {
            template: '<strong>Ready</strong>',
          },
        },
      },
    }

    const normalized = normalizeDeclarativeDocument(document)

    expect(normalized.root.children?.[0]).toMatchObject({
      type: 'component',
      props: { component: 'Card', title: 'Overview' },
    })
    expect(normalized.root.slots?.footer).toMatchObject({
      type: 'template',
    })
  })

  it('rejects external refs', () => {
    const document: DeclarativeDocument = {
      root: {
        $ref: 'https://example.com/spec.json#/components/Page',
      },
    }

    expect(() => resolveDeclarativeRef('https://example.com/spec.json#/components/Page', document)).toThrow(
      /only local refs/i,
    )
  })

  it('rejects cyclic refs', () => {
    const document: DeclarativeDocument = {
      root: {
        $ref: '#/components/Page',
      },
      components: {
        Page: {
          $ref: '#/components/Page',
        },
      },
    }

    expect(() => normalizeDeclarativeDocument(document)).toThrow(/cyclic/i)
  })

  it('rejects indirect cyclic refs', () => {
    const document: DeclarativeDocument = {
      root: {
        $ref: '#/components/A',
      },
      components: {
        A: {
          $ref: '#/components/B',
        },
        B: {
          $ref: '#/components/A',
        },
      },
    }

    expect(() => normalizeDeclarativeDocument(document)).toThrow(/cyclic/i)
  })

  it('normalizes a page document into renderer-ready nodes', () => {
    const page: PageDocument = {
      kind: 'page',
      id: 'requests.index',
      title: 'Requests',
      runtime: {
        loadQuery: 'requests',
      },
      root: {
        $ref: '#/components/PageLayout',
      },
      components: {
        PageLayout: {
          type: 'layout',
          props: {
            direction: 'vertical',
          },
          children: [
            {
              type: 'component',
              props: {
                component: 'Heading',
                label: 'Requests',
              },
            },
          ],
        },
      },
      queries: {
        requests: {
          type: 'rest',
          method: 'GET',
          url: '/api/requests',
        },
      },
    }

    const normalized = normalizePageDocument(page)

    expect(normalized.root.type).toBe('layout')
    expect(normalized.root.children?.[0]).toMatchObject({
      type: 'component',
      props: {
        component: 'Heading',
        label: 'Requests',
      },
    })
    expect(normalized.queries?.requests?.url).toBe('/api/requests')
    expect(normalized.runtime?.loadQuery).toMatchObject({
      id: 'requests',
      spec: {
        url: '/api/requests',
      },
    })
    expect(normalized.runtime?.actions).toEqual([])
  })

  it('compiles node event actions into page runtime descriptors', () => {
    const page: PageDocument = {
      kind: 'page',
      id: 'requests.actions',
      root: {
        type: 'layout',
        children: [
          {
            type: 'component',
            props: {
              component: 'Button',
            },
            meta: {
              on: {
                click: {
                  type: 'navigate',
                  to: '/requests/next',
                  confirm: {
                    guard: 'dirty',
                    title: 'Abandon changes?',
                    message: 'Discard changes and open the next request?',
                    cancelLabel: 'Keep editing',
                    confirmLabel: 'Discard changes',
                  },
                },
              },
            },
          },
        ],
      },
    }

    const normalized = normalizePageDocument(page)

    expect(normalized.runtime?.actions).toEqual([
      {
        nodePath: 'root.children[0]',
        trigger: 'click',
        action: {
          type: 'navigate',
          to: '/requests/next',
          confirm: {
            guard: 'dirty',
            title: 'Abandon changes?',
            message: 'Discard changes and open the next request?',
            cancelLabel: 'Keep editing',
            confirmLabel: 'Discard changes',
          },
        },
      },
    ])
  })

  it('normalizes workflow transitions with dirty confirmation metadata', () => {
    const page: PageDocument = {
      kind: 'page',
      id: 'requests.workflow',
      root: {
        type: 'layout',
      },
      actions: {
        openNext: {
          type: 'navigate',
          to: '/requests/next',
        },
      },
      runtime: {
        workflow: {
          transitions: {
            openNextRequest: {
              event: 'request.openNext',
              from: 'editing',
              to: 'ready',
              action: 'openNext',
              confirm: {
                guard: 'dirty',
                title: 'Abandon changes?',
                message: 'Discard changes and open the next request?',
                cancelLabel: 'Keep editing',
                confirmLabel: 'Discard changes',
              },
            },
          },
        },
      },
    }

    const normalized = normalizePageDocument(page)

    expect(normalized.runtime?.workflow?.transitions).toEqual([
      {
        id: 'openNextRequest',
        event: 'request.openNext',
        from: 'editing',
        to: 'ready',
        action: {
          type: 'navigate',
          to: '/requests/next',
          confirm: {
            guard: 'dirty',
            title: 'Abandon changes?',
            message: 'Discard changes and open the next request?',
            cancelLabel: 'Keep editing',
            confirmLabel: 'Discard changes',
          },
        },
        confirm: {
          guard: 'dirty',
          title: 'Abandon changes?',
          message: 'Discard changes and open the next request?',
          cancelLabel: 'Keep editing',
          confirmLabel: 'Discard changes',
        },
      },
    ])
  })

  it('deep-clones referenced workflow transition actions', () => {
    const page: PageDocument = {
      kind: 'page',
      id: 'requests.workflow.clone',
      root: {
        type: 'layout',
      },
      actions: {
        openNext: {
          type: 'navigate',
          to: '/requests/next',
          confirm: {
            title: 'Open next?',
            message: 'Open the next request?',
            cancelLabel: 'Stay here',
            confirmLabel: 'Open next',
          },
        },
      },
      runtime: {
        workflow: {
          transitions: {
            openNextRequest: {
              event: 'request.openNext',
              action: 'openNext',
            },
          },
        },
      },
    }

    const normalized = normalizePageDocument(page)
    const normalizedAction = normalized.runtime?.workflow?.transitions[0]?.action

    expect(normalizedAction).toEqual(page.actions?.openNext)
    expect(normalizedAction).not.toBe(page.actions?.openNext)
    expect(normalizedAction?.confirm).not.toBe(page.actions?.openNext.confirm)
  })

  it('normalizes a tabbed page with view variants, slots, and loader metadata', () => {
    const normalized = normalizePageDocument(declarativeUiTabbedSupportPage)

    expect(normalized.runtime?.loadQuery).toMatchObject({
      id: 'bootstrap',
      spec: {
        url: '/api/support/dashboard',
      },
    })
    expect(normalized.runtime?.actions).toEqual([
      {
        nodePath: 'root.children[0]',
        trigger: 'select:summary',
        action: {
          type: 'emitEvent',
          event: 'view.summary',
        },
      },
      {
        nodePath: 'root.children[0]',
        trigger: 'select:detail',
        action: {
          type: 'emitEvent',
          event: 'view.detail',
        },
      },
    ])
    expect(normalized.root.slots?.header).toMatchObject({
      type: 'template',
      props: {
        template: 'Support Dashboard Header',
      },
    })
    expect(normalized.root.children?.[1]).toMatchObject({
      type: 'layout',
      children: [
        {
          type: 'layout',
          meta: {
            visibleWhen: 'context.activeView !== "detail"',
          },
        },
        {
          type: 'layout',
          meta: {
            visibleWhen: 'context.activeView === "detail"',
          },
        },
      ],
    })
  })

  it('preserves explicit view-only/read-only page metadata and field props', () => {
    const normalized = normalizePageDocument(declarativeUiReadonlyAuditPage)

    expect(normalized.meta).toMatchObject({
      mode: 'view',
      readOnly: true,
    })
    expect(normalized.root.children?.[1]).toMatchObject({
      type: 'form',
      children: [
        {
          type: 'field',
          props: {
            name: 'incidentId',
            readOnly: true,
          },
        },
        {
          type: 'field',
          props: {
            name: 'owner',
            readOnly: true,
          },
        },
      ],
    })
  })

  it('normalizes an app document with shared components and route refs', () => {
    const app: AppDocument = {
      kind: 'app',
      id: 'requests-workbench',
      title: 'Requests Workbench',
      components: {
        AppShell: {
          type: 'layout',
          props: {
            direction: 'vertical',
            gap: 12,
          },
        },
      },
      pages: {
        requests: {
          title: 'Requests',
          root: {
            $ref: '#/components/AppShell',
            children: [
              {
                $ref: '#/components/PageBody',
              },
            ],
          },
          components: {
            PageBody: {
              type: 'component',
              props: {
                component: 'Table',
                id: 'requests-table',
              },
            },
          },
        },
      },
      routes: [
        {
          path: '/requests',
          page: '#/pages/requests',
        },
      ],
    }

    const normalized = normalizeAppDocument(app)

    expect(normalized.routes).toEqual([
      {
        path: '/requests',
        pageId: 'requests',
      },
    ])
    expect(normalized.pages.requests?.root).toMatchObject({
      type: 'layout',
      children: [
        {
          type: 'component',
          props: {
            component: 'Table',
            id: 'requests-table',
          },
        },
      ],
    })
    expect(normalized.pages.requests?.id).toBe('requests')
  })

  it('normalizes a broader app document with shared shells, tabbed pages, and view-only pages', () => {
    const normalized = normalizeAppDocument(declarativeUiGrammarPressureApp)

    expect(normalized.routes).toEqual([
      {
        path: '/support',
        pageId: 'dashboard',
        title: 'Dashboard',
      },
      {
        path: '/support/audit',
        pageId: 'audit',
        title: 'Audit',
      },
    ])
    expect(normalized.pages.dashboard?.root).toMatchObject({
      type: 'layout',
      children: [
        {
          type: 'component',
          props: {
            component: 'Tabs',
          },
        },
        {
          type: 'layout',
        },
      ],
    })
    expect(normalized.pages.audit?.meta).toMatchObject({
      variant: 'view-only',
    })
    expect(normalized.pages.audit?.root.children?.[1]).toMatchObject({
      type: 'layout',
      children: [
        {
          type: 'template',
        },
        {
          type: 'field',
          props: {
            readOnly: true,
          },
        },
      ],
    })
  })

  it('rejects app routes that reference unknown pages', () => {
    const app: AppDocument = {
      kind: 'app',
      pages: {},
      routes: [
        {
          path: '/requests',
          page: '#/pages/missing',
        },
      ],
    }

    expect(() => normalizeAppDocument(app)).toThrow(/unknown page/i)
  })

  it('rejects app routes that use bare page ids instead of page refs', () => {
    const app = {
      pages: {
        requests: {
          root: {
            type: 'layout',
          },
        },
      },
      routes: [
        {
          path: '/requests',
          page: 'requests',
        },
      ],
    } as unknown as AppDocument

    expect(() => normalizeAppDocument(app)).toThrow(/must reference pages via "#\/pages\/\.\.\."/i)
  })
})
