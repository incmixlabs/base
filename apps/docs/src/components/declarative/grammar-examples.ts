import type { AppDocument, PageDocument } from '@bwalkt/core'

export const declarativeUiTabbedSupportPage: PageDocument = {
  kind: 'page',
  id: 'support.dashboard',
  title: 'Support Dashboard',
  meta: {
    mode: 'interactive',
    defaultView: 'summary',
    availableViews: ['summary', 'detail'],
  },
  runtime: {
    loadQuery: 'bootstrap',
  },
  queries: {
    bootstrap: {
      type: 'rest',
      method: 'GET',
      url: '/api/support/dashboard',
    },
  },
  root: {
    $ref: '#/components/PageShell',
    slots: {
      header: {
        type: 'template',
        props: {
          template: 'Support Dashboard Header',
        },
      },
      footer: {
        type: 'template',
        props: {
          template: 'Support Dashboard Footer',
        },
      },
    },
    children: [
      {
        $ref: '#/components/ViewTabs',
      },
      {
        type: 'layout',
        props: {
          direction: 'vertical',
          gap: 12,
        },
        children: [
          {
            $ref: '#/components/SummaryView',
            meta: {
              visibleWhen: 'context.activeView !== "detail"',
            },
          },
          {
            $ref: '#/components/DetailView',
            meta: {
              visibleWhen: 'context.activeView === "detail"',
            },
          },
        ],
      },
    ],
  },
  components: {
    PageShell: {
      type: 'layout',
      props: {
        direction: 'vertical',
        gap: 24,
      },
    },
    ViewTabs: {
      type: 'component',
      props: {
        component: 'Tabs',
        label: 'Dashboard views',
        tabs: [
          { id: 'summary', label: 'Summary' },
          { id: 'detail', label: 'Detail' },
        ],
      },
      meta: {
        on: {
          'select:summary': {
            type: 'emitEvent',
            event: 'view.summary',
          },
          'select:detail': {
            type: 'emitEvent',
            event: 'view.detail',
          },
        },
      },
    },
    SummaryView: {
      type: 'layout',
      props: {
        direction: 'vertical',
        gap: 8,
      },
      children: [
        {
          type: 'template',
          props: {
            template: 'Summary KPIs',
          },
        },
        {
          type: 'component',
          props: {
            component: 'MetricCard',
            label: 'Open Requests',
          },
        },
      ],
    },
    DetailView: {
      type: 'layout',
      props: {
        direction: 'vertical',
        gap: 8,
      },
      children: [
        {
          type: 'template',
          props: {
            template: 'Detail Feed',
          },
        },
        {
          type: 'component',
          props: {
            component: 'ActivityFeed',
            label: 'Recent escalations',
          },
        },
      ],
    },
  },
}

export const declarativeUiReadonlyAuditPage: PageDocument = {
  kind: 'page',
  id: 'support.audit',
  title: 'Incident Audit',
  meta: {
    mode: 'view',
    readOnly: true,
  },
  root: {
    $ref: '#/components/PageShell',
    slots: {
      header: {
        type: 'template',
        props: {
          template: 'Incident Audit Header',
        },
      },
      footer: {
        type: 'template',
        props: {
          template: 'Audit timeline is immutable in view mode.',
        },
      },
    },
    children: [
      {
        type: 'template',
        props: {
          template: 'View-only audit trail',
        },
        meta: {
          visibleWhen: 'context.mode === "view"',
        },
      },
      {
        type: 'form',
        children: [
          {
            type: 'field',
            props: {
              name: 'incidentId',
              label: 'Incident ID',
              readOnly: true,
            },
          },
          {
            type: 'field',
            props: {
              name: 'owner',
              label: 'Owner',
              readOnly: true,
            },
          },
        ],
      },
      {
        type: 'component',
        props: {
          component: 'Button',
          label: 'Request Edit Access',
        },
        meta: {
          enabledWhen: 'context.canEdit !== true',
          on: {
            click: {
              type: 'emitEvent',
              event: 'audit.edit.requested',
            },
          },
        },
      },
    ],
  },
  components: {
    PageShell: {
      type: 'layout',
      props: {
        direction: 'vertical',
        gap: 20,
      },
    },
  },
}

export const declarativeUiGrammarPressureApp: AppDocument = {
  kind: 'app',
  id: 'support.workbench',
  title: 'Support Workbench',
  components: {
    WorkspaceShell: {
      type: 'layout',
      props: {
        direction: 'vertical',
        gap: 32,
      },
      slots: {
        header: {
          type: 'template',
          props: {
            template: 'Workspace Header',
          },
        },
        footer: {
          type: 'template',
          props: {
            template: 'Workspace Footer',
          },
        },
      },
    },
    WorkspaceNav: {
      type: 'component',
      props: {
        component: 'Tabs',
        label: 'Workspace navigation',
        tabs: [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'audit', label: 'Audit' },
        ],
      },
    },
  },
  pages: {
    dashboard: {
      title: 'Support Dashboard',
      meta: {
        pageType: 'workspace',
        variant: 'tabbed',
      },
      root: {
        $ref: '#/components/WorkspaceShell',
        children: [
          {
            $ref: '#/components/WorkspaceNav',
          },
          {
            $ref: '#/components/DashboardBody',
          },
        ],
      },
      components: {
        DashboardBody: {
          type: 'layout',
          props: {
            direction: 'vertical',
            gap: 12,
          },
          children: [
            {
              type: 'template',
              props: {
                template: 'Dashboard body',
              },
            },
            {
              type: 'component',
              props: {
                component: 'MetricCard',
                label: 'Escalations this week',
              },
            },
          ],
        },
      },
    },
    audit: {
      title: 'Incident Audit',
      meta: {
        pageType: 'workspace',
        variant: 'view-only',
      },
      root: {
        $ref: '#/components/WorkspaceShell',
        children: [
          {
            $ref: '#/components/WorkspaceNav',
          },
          {
            $ref: '#/components/AuditBody',
          },
        ],
      },
      components: {
        AuditBody: {
          type: 'layout',
          props: {
            direction: 'vertical',
            gap: 12,
          },
          children: [
            {
              type: 'template',
              props: {
                template: 'Audit body',
              },
            },
            {
              type: 'field',
              props: {
                name: 'incidentId',
                label: 'Incident ID',
                readOnly: true,
              },
            },
          ],
        },
      },
    },
  },
  routes: [
    {
      path: '/support',
      page: '#/pages/dashboard',
      title: 'Dashboard',
    },
    {
      path: '/support/audit',
      page: '#/pages/audit',
      title: 'Audit',
    },
  ],
}
