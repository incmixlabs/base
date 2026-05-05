import type { DeclarativeNode, PageDocument, WidgetDocument } from '@incmix/core'

export type LocalWidgetRegistry = Record<string, WidgetDocument>

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
          widget: 'support.summary-widget',
        },
      },
      {
        type: 'widget',
        props: {
          widget: 'support.audit-escalation-widget',
        },
      },
    ],
  },
}

function cloneNode<T>(node: T): T {
  return structuredClone(node)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isWidgetReferenceNode(node: DeclarativeNode): node is DeclarativeNode & { type: 'widget' } {
  return 'type' in node && node.type === 'widget'
}

function resolveWidgetNode(
  node: DeclarativeNode,
  registry: LocalWidgetRegistry,
  resolvingWidgets: string[] = [],
): DeclarativeNode {
  if (!isWidgetReferenceNode(node)) {
    const cloned = cloneNode(node)
    if ('children' in cloned && cloned.children) {
      cloned.children = cloned.children.map(child => resolveWidgetNode(child, registry, resolvingWidgets))
    }
    if ('slots' in cloned && cloned.slots) {
      cloned.slots = Object.fromEntries(
        Object.entries(cloned.slots).map(([slot, slotNode]) => [
          slot,
          resolveWidgetNode(slotNode, registry, resolvingWidgets),
        ]),
      )
    }
    return cloned
  }

  const widgetId = typeof node.props?.widget === 'string' ? node.props.widget : undefined
  if (!widgetId) {
    throw new Error('resolveLocalWidgetsInPageDocument: widget nodes must provide props.widget')
  }

  const widget = registry[widgetId]
  if (!widget) {
    throw new Error(`resolveLocalWidgetsInPageDocument: unknown widget "${widgetId}"`)
  }

  if (resolvingWidgets.includes(widgetId)) {
    throw new Error(`resolveLocalWidgetsInPageDocument: cyclic widget reference detected for "${widgetId}"`)
  }

  const resolvedBase = resolveWidgetNode(widget.node, registry, [...resolvingWidgets, widgetId])
  const inlineProps = isPlainObject(node.props)
    ? Object.fromEntries(Object.entries(node.props).filter(([key]) => key !== 'widget'))
    : undefined

  const merged: DeclarativeNode = {
    ...cloneNode(resolvedBase),
    ...('meta' in node && node.meta
      ? { meta: { ...('meta' in resolvedBase ? resolvedBase.meta : undefined), ...node.meta } }
      : {}),
    ...('children' in node && node.children ? { children: node.children } : {}),
    ...('slots' in node && node.slots ? { slots: node.slots } : {}),
    ...((inlineProps && Object.keys(inlineProps).length > 0) || ('props' in resolvedBase && resolvedBase.props)
      ? {
          props: {
            ...('props' in resolvedBase ? resolvedBase.props : undefined),
            ...(inlineProps ?? {}),
          },
        }
      : {}),
  }

  if ('children' in merged && merged.children) {
    merged.children = merged.children.map(child => resolveWidgetNode(child, registry, resolvingWidgets))
  }
  if ('slots' in merged && merged.slots) {
    merged.slots = Object.fromEntries(
      Object.entries(merged.slots).map(([slot, slotNode]) => [
        slot,
        resolveWidgetNode(slotNode, registry, resolvingWidgets),
      ]),
    )
  }

  return merged
}

export function resolveLocalWidgetsInPageDocument(page: PageDocument, registry: LocalWidgetRegistry): PageDocument {
  return {
    ...cloneNode(page),
    root: resolveWidgetNode(page.root, registry),
    components: page.components
      ? Object.fromEntries(
          Object.entries(page.components).map(([key, node]) => [key, resolveWidgetNode(node, registry)]),
        )
      : undefined,
  }
}
