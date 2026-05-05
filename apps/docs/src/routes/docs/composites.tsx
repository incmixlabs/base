import { catalog, getCatalogEntryRuntimeScopeLoader, LiveCodeBlock } from '@incmix/ui/editor/docs'
import { Badge, Card, DataList } from '@incmix/ui/elements'
import { Heading } from '@incmix/ui/typography/heading/Heading'
import { Text } from '@incmix/ui/typography/text/Text'
import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'

const compositeCatalog = catalog.filter(entry => entry.family === 'composites')

function getStringMeta(entry: (typeof catalog)[number], key: string) {
  const value = entry.meta?.[key]
  return typeof value === 'string' ? value : undefined
}

function getStringArrayMeta(entry: (typeof catalog)[number], key: string) {
  const value = entry.meta?.[key]
  return Array.isArray(value) && value.every(item => typeof item === 'string') ? value : []
}

function CompositePreviewImage({ alt, src }: { alt: string; src?: string }) {
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div className="flex aspect-[12/7] items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20">
        <Text size="sm" className="text-muted-foreground">
          {src ? 'Preview unavailable' : 'No preview image'}
        </Text>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="aspect-[12/7] w-full rounded-2xl border border-border/70 object-cover"
      onError={() => setFailed(true)}
    />
  )
}

export const Route = createFileRoute('/docs/composites')({
  component: CompositesDocsPage,
})

function CompositesDocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="2x">
          Composite Templates
        </Heading>
        <Text size="sm" className="mt-2 text-muted-foreground">
          Composite entries are catalog-backed authored templates. The current examples are repository seeds, but their
          metadata is shaped so a backend catalog can supply the same fields later.
        </Text>
      </div>

      {compositeCatalog.length === 0 ? (
        <Card.Root color="light" className="border border-border/70 p-5">
          <Text size="sm" className="text-muted-foreground">
            No composite templates are available yet.
          </Text>
        </Card.Root>
      ) : (
        <div className="grid gap-4">
          {compositeCatalog.map(entry => {
            const previewImage = getStringMeta(entry, 'previewImage')
            const dependencies = getStringArrayMeta(entry, 'dependencies')
            const scopeLoader = getCatalogEntryRuntimeScopeLoader(entry)

            return (
              <Card.Root key={entry.id} color="light" className="border border-border/70 p-5">
                <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                  <div className="space-y-3">
                    <CompositePreviewImage src={previewImage} alt={`${entry.title} preview`} />

                    <div className="flex flex-wrap gap-2">
                      {entry.discovery.tags?.map(tag => (
                        <Badge key={tag} size="xs" variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="min-w-0 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <Heading as="h2" size="lg" id={entry.slug} data-heading>
                          {entry.title}
                        </Heading>
                        <Text size="sm" className="text-muted-foreground">
                          {entry.description}
                        </Text>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Badge size="xs" variant="soft">
                          {entry.family}
                        </Badge>
                        <Badge size="xs" variant="soft" color="info">
                          {getStringMeta(entry, 'sourceKind') ?? entry.persistence.source}
                        </Badge>
                      </div>
                    </div>

                    <DataList.Root orientation="horizontal">
                      <DataList.Item>
                        <DataList.Label>ID</DataList.Label>
                        <DataList.Value>{entry.id}</DataList.Value>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.Label>Runtime</DataList.Label>
                        <DataList.Value>{entry.runtime.rendererId}</DataList.Value>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.Label>Dependencies</DataList.Label>
                        <DataList.Value>{dependencies.length > 0 ? dependencies.join(', ') : 'n/a'}</DataList.Value>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.Label>Persistence Shape</DataList.Label>
                        <DataList.Value>{getStringMeta(entry, 'persistenceShape') ?? 'n/a'}</DataList.Value>
                      </DataList.Item>
                    </DataList.Root>

                    <div className="space-y-2">
                      <Text size="sm" className="font-medium text-foreground">
                        Template Preview
                      </Text>
                      {scopeLoader ? (
                        <LiveCodeBlock initialCode={entry.overviewCode} scopeLoader={scopeLoader} />
                      ) : (
                        <Text size="sm" className="text-muted-foreground">
                          Runtime scope loader is not registered for this template.
                        </Text>
                      )}
                    </div>
                  </div>
                </div>
              </Card.Root>
            )
          })}
        </div>
      )}
    </div>
  )
}
