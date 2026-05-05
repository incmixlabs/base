'use client'

import { normalizePageDocument } from '@incmix/core'
import { DeclarativePageRenderer, type DeclarativeRendererRegistry } from '@incmix/ui/declarative/renderer'
import { assignDeclarativePageContext, createDeclarativePageActor } from '@incmix/ui/declarative/runtime'
import { type ViewportPreset, ViewportPreview, ViewportPreviewControls } from '@incmix/ui/editor/docs'
import { Badge, Card, Tabs } from '@incmix/ui/elements'
import { Heading } from '@incmix/ui/typography/heading/Heading'
import { Text } from '@incmix/ui/typography/text/Text'
import { resolveLocalWidgetsInPageDocument } from '@incmix/ui/widgets'
import * as React from 'react'
import {
  declarativeUiGrammarPressureApp,
  declarativeUiReadonlyAuditPage,
  declarativeUiTabbedSupportPage,
} from './grammar-examples'
import { JsxAuthoringWorkbench } from './JsxAuthoringWorkbench'
import {
  auditEscalationWidget,
  declarativeUiWidgetProofPage,
  localWidgetRegistry,
  supportSummaryWidget,
} from './widget-examples'

const tabbedPage = normalizePageDocument(declarativeUiTabbedSupportPage)
const readonlyPage = normalizePageDocument(declarativeUiReadonlyAuditPage)
const widgetPage = normalizePageDocument(
  resolveLocalWidgetsInPageDocument(declarativeUiWidgetProofPage, localWidgetRegistry),
)

function createComponentRenderers(
  onSelectView?: (view: 'summary' | 'detail') => void,
  activeView?: 'summary' | 'detail',
): DeclarativeRendererRegistry {
  return {
    Tabs: ({ node, triggerAction }) => {
      const tabs = Array.isArray(node.props?.tabs) ? (node.props.tabs as Array<{ id: string; label: string }>) : []

      return (
        <Tabs.Root
          value={activeView}
          onValueChange={value => {
            const view = value === 'detail' ? 'detail' : 'summary'
            onSelectView?.(view)
            triggerAction(`select:${value}`)
          }}
          variant="surface"
          size="sm"
        >
          <Tabs.List>
            {tabs.map(tab => (
              <Tabs.Trigger key={tab.id} value={tab.id}>
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      )
    },
    MetricCard: ({ node }) => (
      <Card.Root className="border border-border/70 p-4">
        <div className="space-y-1">
          <Text size="xs" className="uppercase tracking-[0.14em] text-muted-foreground">
            Variant Surface
          </Text>
          <Heading as="h3" size="md">
            {String(node.props?.label ?? 'Metric')}
          </Heading>
        </div>
      </Card.Root>
    ),
    ActivityFeed: ({ node }) => (
      <Card.Root className="border border-border/70 p-4">
        <div className="space-y-2">
          <Heading as="h3" size="md">
            {String(node.props?.label ?? 'Activity')}
          </Heading>
          <Text size="sm" className="text-muted-foreground">
            Mixed composition can swap this feed in without changing the outer shell.
          </Text>
        </div>
      </Card.Root>
    ),
  }
}

export function GrammarPreview() {
  const [viewportPreset, setViewportPreset] = React.useState<ViewportPreset>('desktop')
  const [activeView, setActiveView] = React.useState<'summary' | 'detail'>('summary')
  const tabbedActor = React.useMemo(() => {
    return createDeclarativePageActor({
      page: tabbedPage,
      context: {
        activeView: 'summary' as 'summary' | 'detail',
      },
      states: {
        ready: {
          on: {
            'view.summary': {
              actions: assignDeclarativePageContext(() => ({
                activeView: 'summary' as const,
              })),
            },
            'view.detail': {
              actions: assignDeclarativePageContext(() => ({
                activeView: 'detail' as const,
              })),
            },
          },
        },
      },
    })
  }, [])

  const readonlyActor = React.useMemo(() => {
    return createDeclarativePageActor({
      page: readonlyPage,
      context: {
        mode: 'view',
        canEdit: false,
      },
    })
  }, [])

  const widgetActor = React.useMemo(() => {
    return createDeclarativePageActor<{ reviewCount: number }>({
      page: widgetPage,
      context: {
        reviewCount: 0,
      },
      states: {
        ready: {
          on: {
            'widget.review-queue': {
              actions: assignDeclarativePageContext<{ reviewCount: number }>(currentContext => ({
                reviewCount: Number(currentContext.reviewCount ?? 0) + 1,
              })),
            },
          },
        },
      },
    })
  }, [])

  React.useEffect(() => {
    tabbedActor.start()
    return () => {
      tabbedActor.stop()
    }
  }, [tabbedActor])

  React.useEffect(() => {
    readonlyActor.start()
    return () => {
      readonlyActor.stop()
    }
  }, [readonlyActor])

  React.useEffect(() => {
    widgetActor.start()
    return () => {
      widgetActor.stop()
    }
  }, [widgetActor])

  React.useEffect(() => {
    const subscription = tabbedActor.subscribe(snapshot => {
      const nextView = snapshot.context?.activeView
      setActiveView(nextView === 'detail' ? 'detail' : 'summary')
    })

    setActiveView(tabbedActor.getSnapshot().context?.activeView === 'detail' ? 'detail' : 'summary')

    return () => {
      subscription.unsubscribe()
    }
  }, [tabbedActor])

  const componentRenderers = React.useMemo(() => createComponentRenderers(setActiveView, activeView), [activeView])

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div>
          <Heading as="h2" size="lg" id="tabbed-view-variants" data-heading>
            Tabbed View Variants
          </Heading>
          <Text size="sm" className="mt-2 text-muted-foreground">
            This page shape pressure-tests tabs, slot composition, and in-page view switching through declarative
            events.
          </Text>
        </div>
        <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-5">
          <ViewportPreviewControls preset={viewportPreset} onPresetChange={setViewportPreset} />
          <ViewportPreview preset={viewportPreset}>
            <DeclarativePageRenderer page={tabbedPage} actorRef={tabbedActor} components={componentRenderers} />
          </ViewportPreview>
        </div>
      </section>

      <JsxAuthoringWorkbench />

      <section className="space-y-3">
        <div>
          <Heading as="h2" size="lg" id="view-only-read-only" data-heading>
            View-Only / Read-Only
          </Heading>
          <Text size="sm" className="mt-2 text-muted-foreground">
            This shape keeps the page interactive enough to render, but the data fields are explicitly read-only and the
            edit CTA remains disabled.
          </Text>
        </div>
        <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-5">
          <ViewportPreviewControls preset={viewportPreset} onPresetChange={setViewportPreset} />
          <ViewportPreview preset={viewportPreset}>
            <DeclarativePageRenderer page={readonlyPage} actorRef={readonlyActor} components={componentRenderers} />
          </ViewportPreview>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Heading as="h2" size="lg" id="json-defined-widgets" data-heading>
            JSON-Defined Widgets
          </Heading>
          <Badge variant="soft" color="success">
            PR 3
          </Badge>
        </div>
        <Text size="sm" className="text-muted-foreground">
          This page resolves local JSON widget documents into ordinary declarative nodes before normalization, then
          renders them through the same existing component registry path.
        </Text>
        <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-5">
          <ViewportPreviewControls preset={viewportPreset} onPresetChange={setViewportPreset} />
          <ViewportPreview preset={viewportPreset}>
            <DeclarativePageRenderer page={widgetPage} actorRef={widgetActor} components={componentRenderers} />
          </ViewportPreview>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="space-y-2">
            <Text size="sm" className="font-medium text-foreground">
              Page Authoring JSON
            </Text>
            <pre className="overflow-x-auto rounded-2xl border border-border/70 bg-muted/20 p-4 text-xs leading-6">
              <code>{JSON.stringify(declarativeUiWidgetProofPage, null, 2)}</code>
            </pre>
          </div>
          <div className="space-y-2">
            <Text size="sm" className="font-medium text-foreground">
              Widget Registry JSON
            </Text>
            <pre className="overflow-x-auto rounded-2xl border border-border/70 bg-muted/20 p-4 text-xs leading-6">
              <code>{JSON.stringify([supportSummaryWidget, auditEscalationWidget], null, 2)}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Heading as="h2" size="lg" id="mixed-app-composition" data-heading>
            Mixed App Composition
          </Heading>
          <Badge variant="soft" color="info">
            App-Level
          </Badge>
        </div>
        <Text size="sm" className="text-muted-foreground">
          The broader app fixture combines shared shells, route refs, and page-specific bodies. That shape is validated
          in core normalization tests and represented here as authoring JSON.
        </Text>
        <pre className="overflow-x-auto rounded-2xl border border-border/70 bg-muted/20 p-4 text-xs leading-6">
          <code>{JSON.stringify(declarativeUiGrammarPressureApp, null, 2)}</code>
        </pre>
      </section>
    </div>
  )
}
