import { catalog, getCatalogEntryRuntimeScopeLoader, LiveCodeBlock } from '@bwalkt/ui/editor/docs'
import { Badge, Card, DataList } from '@bwalkt/ui/elements'
import { Heading } from '@bwalkt/ui/typography/heading/Heading'
import { Text } from '@bwalkt/ui/typography/text/Text'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/docs/declarative/registry')({
  component: DeclarativeRegistryPage,
})

function DeclarativeRegistryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="2x">
          Declarative Registry Contract
        </Heading>
        <Text size="sm" className="mt-2 text-muted-foreground">
          Phase 5 PR 4 defines the component registry contract and discovery metadata without implementing persistence.
          This page exposes the current code-authored seed entries and the metadata now attached to each one.
        </Text>
      </div>

      <section>
        <Heading as="h2" size="lg" id="overview" data-heading>
          Overview
        </Heading>
        <Text size="sm" className="mt-2 text-muted-foreground">
          Each card below represents one catalog seed entry with its discovery metadata, runtime identity, repository
          ownership, and example code.
        </Text>
      </section>

      <section>
        <Heading as="h2" size="lg" id="registry-entries" data-heading>
          Registry Entries
        </Heading>
      </section>

      <div className="grid gap-4">
        {catalog.map(entry => (
          <Card.Root key={entry.id} color="light" className="border border-border/70 p-5">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <Heading as="h3" size="lg" id={entry.slug} data-heading>
                    {entry.title}
                  </Heading>
                  <Text size="sm" className="text-muted-foreground">
                    {entry.description}
                  </Text>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Badge size="xs" variant="soft">
                    {entry.family}
                  </Badge>
                  <Badge size="xs" variant="soft" color="info">
                    {entry.runtime.componentName}
                  </Badge>
                  <Badge size="xs" variant="soft" color="success">
                    {entry.ownership.scope}
                  </Badge>
                  <Badge size="xs" variant="soft" color="warning">
                    {entry.persistence.source}
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
                  <DataList.Label>Group</DataList.Label>
                  <DataList.Value>{entry.discovery.group ?? 'n/a'}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Hierarchy</DataList.Label>
                  <DataList.Value>
                    {entry.discovery.hierarchy && entry.discovery.hierarchy.length > 0
                      ? entry.discovery.hierarchy.join(' / ')
                      : 'n/a'}
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Mutable</DataList.Label>
                  <DataList.Value>{String(entry.persistence.mutable)}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Source Path</DataList.Label>
                  <DataList.Value>{entry.sourcePath}</DataList.Value>
                </DataList.Item>
              </DataList.Root>

              <div className="space-y-2">
                <Text size="sm" className="font-medium text-foreground">
                  Tags
                </Text>
                <div className="flex flex-wrap gap-2">
                  {entry.discovery.tags && entry.discovery.tags.length > 0 ? (
                    entry.discovery.tags.map(tag => (
                      <Badge key={tag} size="xs" variant="outline">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <Text size="sm" className="text-muted-foreground">
                      No tags
                    </Text>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Text size="sm" className="font-medium text-foreground">
                  Keywords
                </Text>
                <div className="flex flex-wrap gap-2">
                  {entry.discovery.keywords && entry.discovery.keywords.length > 0 ? (
                    entry.discovery.keywords.map(keyword => (
                      <Badge key={keyword} size="xs" variant="surface">
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <Text size="sm" className="text-muted-foreground">
                      No keywords
                    </Text>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <Text size="sm" className="font-medium text-foreground">
                  Persistence Notes
                </Text>
                <Text size="sm" className="mt-1 text-muted-foreground">
                  {entry.persistence.notes ?? 'No persistence notes'}
                </Text>
              </div>

              <div className="space-y-2">
                <Text size="sm" className="font-medium text-foreground">
                  Example
                </Text>
                <LiveCodeBlock
                  initialCode={entry.overviewCode}
                  scopeLoader={getCatalogEntryRuntimeScopeLoader(entry)}
                />
              </div>
            </div>
          </Card.Root>
        ))}
      </div>
    </div>
  )
}
