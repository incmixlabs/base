import { catalog, getCatalogEntryRuntimeScopeLoader, LiveCodeBlock, ThemesPropsTable } from '@incmix/ui/editor/docs'
import { Badge, Card, DataList } from '@incmix/ui/elements'
import { Heading } from '@incmix/ui/typography/heading/Heading'
import { Text } from '@incmix/ui/typography/text/Text'
import { createFileRoute } from '@tanstack/react-router'

const chartsCatalog = catalog.filter(entry => entry.family === 'charts')

export const Route = createFileRoute('/docs/charts')({
  component: ChartsDocsPage,
})

function ChartsDocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="2x">
          Charts
        </Heading>
        <Text size="sm" className="mt-2 text-muted-foreground">
          Base chart components live in the UI package as frontend-owned primitives. They are catalog-backed, remain
          outside the root package barrel, and are meant to be composed into higher-level authored blocks later.
        </Text>
      </div>

      <div className="grid gap-4">
        {chartsCatalog.map(entry => (
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
                    {entry.runtime.rendererId}
                  </Badge>
                </div>
              </div>

              <DataList.Root orientation="horizontal">
                <DataList.Item>
                  <DataList.Label>ID</DataList.Label>
                  <DataList.Value>{entry.id}</DataList.Value>
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
                  <DataList.Label>Source Path</DataList.Label>
                  <DataList.Value>{entry.sourcePath}</DataList.Value>
                </DataList.Item>
              </DataList.Root>

              <div className="space-y-2">
                <Text size="sm" className="font-medium text-foreground">
                  Example
                </Text>
                <LiveCodeBlock
                  initialCode={entry.overviewCode}
                  scopeLoader={getCatalogEntryRuntimeScopeLoader(entry)}
                />
              </div>

              <div className="space-y-2">
                <Text size="sm" className="font-medium text-foreground">
                  Props
                </Text>
                <ThemesPropsTable defs={entry.propDefs} />
              </div>
            </div>
          </Card.Root>
        ))}
      </div>
    </div>
  )
}
