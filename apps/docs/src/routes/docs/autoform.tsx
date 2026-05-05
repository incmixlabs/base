import { Callout, Card } from '@bwalkt/ui/elements'
import { Heading } from '@bwalkt/ui/typography/heading/Heading'
import { Text } from '@bwalkt/ui/typography/text/Text'
import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { wrapperDocsBySlug } from './api/wrappers/-docs'

export const Route = createFileRoute('/docs/autoform')({
  component: AutoFormPage,
})

const featuredWrapperSlugs = ['dialog', 'popover', 'sidebar'] as const
const featuredAutoformPages = [
  {
    title: 'Lifecycle Audit',
    href: '/docs/autoform/audit',
    description: 'Status, coverage, and the remaining lifecycle gaps for the current AutoForm stack.',
  },
  {
    title: 'Renderer',
    href: '/docs/autoform/renderer',
    description: 'Normalized renderer examples covering repeaters, rich widgets, responsive layouts, and stepper flow.',
  },
  {
    title: 'Runtime',
    href: '/docs/autoform/runtime',
    description: 'Validation, async submit, server errors, conditions, and branch pruning behavior.',
  },
  {
    title: 'Schema AST',
    href: '/docs/autoform/schema-ast',
    description: 'How JSON Schema resolves into the internal AST and where AJV validation stops.',
  },
  {
    title: 'Schema Contract',
    href: '/docs/autoform/schema-contract',
    description: 'Ownership split between JSON Schema, UI schema, and the normalized runtime model.',
  },
  {
    title: 'E2E Fixtures',
    href: '/docs/autoform/e2e',
    description: 'Stable browser-test fixtures for validation, conditions, repeaters, stepper flow, and server errors.',
  },
]

const autoformPages = featuredWrapperSlugs.map(slug => {
  const entry = wrapperDocsBySlug[slug]
  const title = entry.title.endsWith('Wrapper') ? entry.title : `${entry.title} Wrapper`

  return {
    title,
    href: `/docs/api/wrappers/${slug}`,
    description: entry.description,
  }
})

function AutoFormPage() {
  const location = useLocation()

  if (location.pathname !== '/docs/autoform') {
    return <Outlet />
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="2x">
          AutoForm
        </Heading>
        <Text size="sm" className="mt-2 text-muted-foreground">
          Architecture, schema contracts, runtime lifecycle, and renderer behavior for dynamic forms.
        </Text>
      </div>

      <Callout.Root variant="surface" color="info">
        <Callout.Text>
          AutoForm now has dedicated reference pages in <code>docs</code> for lifecycle, renderer internals, runtime
          behavior, schema-to-model translation, and browser-test fixtures.
        </Callout.Text>
      </Callout.Root>

      <section>
        <Heading as="h2" size="lg" id="overview" data-heading>
          Overview
        </Heading>
        <Text size="sm" className="mt-2 text-muted-foreground">
          AutoForm separates form concerns into four layers: JSON Schema for the data contract, UI schema for
          presentation intent, a normalized runtime model for orchestration, and renderer or wrapper surfaces for the
          actual UI.
        </Text>
        <Text size="sm" className="mt-2 text-muted-foreground">
          The pages below cover the native normalized path as well as the wrapper adapter path that still exists for
          schema-driven overlays like dialogs and popovers.
        </Text>
      </section>

      <section>
        <Heading as="h2" size="lg" id="reference-pages" data-heading>
          Reference Pages
        </Heading>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredAutoformPages.map(page => (
            <Card.Root key={page.href} className="border border-border/70 p-5">
              <div className="space-y-2">
                <Heading as="h3" size="md">
                  <Link to={page.href} className="underline-offset-4 hover:underline">
                    {page.title}
                  </Link>
                </Heading>
                <Text size="sm" className="text-muted-foreground">
                  {page.description}
                </Text>
              </div>
            </Card.Root>
          ))}
        </div>
      </section>

      <section>
        <Heading as="h2" size="lg" id="wrapper-pages" data-heading>
          Wrapper Pages
        </Heading>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {autoformPages.map(page => (
            <Card.Root key={page.href} className="border border-border/70 p-5">
              <div className="space-y-2">
                <Heading as="h3" size="md">
                  <Link to={page.href} className="underline-offset-4 hover:underline">
                    {page.title}
                  </Link>
                </Heading>
                <Text size="sm" className="text-muted-foreground">
                  {page.description}
                </Text>
              </div>
            </Card.Root>
          ))}
        </div>
      </section>
    </div>
  )
}
