import type { PageDocument, WidgetDocument } from '@bwalkt/core'
import type { LocalWidgetRegistry } from '@bwalkt/ui/widgets'

export const supportSummaryWidget: WidgetDocument = {
  kind: 'widget',
  id: 'support.summary-widget',
  title: 'Support Summary Widget',
  node: {
    type: 'layout',
    props: {
      direction: 'vertical',
      gap: 8,
    },
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
        meta: {
          on: {
            click: {
              type: 'emitEvent',
              event: 'widget.review-queue',
            },
          },
        },
      },
    ],
  },
}

export const auditEscalationWidget: WidgetDocument = {
  kind: 'widget',
  id: 'support.audit-escalation-widget',
  title: 'Audit Escalation Widget',
  node: {
    type: 'layout',
    props: {
      direction: 'vertical',
      gap: 8,
    },
    children: [
      {
        type: 'template',
        props: {
          template: 'Escalation Watchlist',
        },
      },
      {
        type: 'component',
        props: {
          component: 'ActivityFeed',
          label: 'Escalations needing review',
        },
      },
    ],
  },
}

export const localWidgetRegistry: LocalWidgetRegistry = {
  [supportSummaryWidget.id]: supportSummaryWidget,
  [auditEscalationWidget.id]: auditEscalationWidget,
}

export const declarativeUiWidgetProofPage: PageDocument = {
  kind: 'page',
  id: 'support.widgets',
  title: 'Support Widget Proof',
  root: {
    type: 'layout',
    props: {
      direction: 'vertical',
      gap: 12,
    },
    children: [
      {
        type: 'widget',
        props: {
          widget: supportSummaryWidget.id,
        },
      },
      {
        type: 'widget',
        props: {
          widget: auditEscalationWidget.id,
        },
      },
    ],
  },
}
