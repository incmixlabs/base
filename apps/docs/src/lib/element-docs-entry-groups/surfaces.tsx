'use client'

import { cardCatalogEntry, dataListCatalogEntry } from '@incmix/ui/editor/catalog'
import { Badge, DataList, IconButton } from '@incmix/ui/elements'
import { elementPropDefsByComponent } from '@incmix/ui/elements/props'
import { Flex } from '@incmix/ui/layouts'
import { Code, Link } from '@incmix/ui/typography'
import { Copy as CopyIcon } from 'lucide-react'
import type { ElementDocsEntry } from '../element-docs-types'
import { toEnumArrayLiteral } from '../element-docs-types'
import { createDocsPropDefs } from '../props'

const cardElementPropDefs = elementPropDefsByComponent.card
const dataListElementPropDefs = elementPropDefsByComponent['data-list']
const dataListDocsPropDefs = createDocsPropDefs(dataListElementPropDefs)

export const surfaceEntries: Record<string, ElementDocsEntry> = {
  card: {
    ...cardCatalogEntry,
    sections: [
      {
        id: 'variants',
        title: 'Variants',
        description: 'Use variants to change how much chrome the card carries.',
        code: `export default function Example() {
  const variants = ${toEnumArrayLiteral(cardElementPropDefs.variant.values)}
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {variants.map(variant => (
        <Card.Root key={variant} variant={variant}>
          <Card.Header>
            <Card.Title>{variant}</Card.Title>
            <Card.Description>{variant} treatment.</Card.Description>
          </Card.Header>
        </Card.Root>
      ))}
    </div>
  )
}`,
      },
      {
        id: 'colors',
        title: 'Colors',
        description: 'Color changes the shell without changing the composition API.',
        code: `export default function Example() {
  const colors = ${toEnumArrayLiteral(cardElementPropDefs.color.values)}
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {colors.map(color => (
        <Card.Root key={color} color={color}>
          <Card.Header>
            <Card.Title>{color}</Card.Title>
            <Card.Description>{color} card.</Card.Description>
          </Card.Header>
        </Card.Root>
      ))}
    </div>
  )
}`,
      },
      {
        id: 'container-queries',
        title: 'Container Queries',
        description: 'Responsive size values respond to the card container width, not the viewport.',
        code: `export default function Example() {
  const widths = [
    { label: 'Narrow container', width: 280 },
    { label: 'Medium container', width: 520 },
    { label: 'Wide container', width: 760 },
  ]

  return (
    <div className="space-y-4">
      {widths.map(item => (
        <div key={item.label} className="space-y-2">
          <div className="text-sm font-medium text-foreground">{item.label} ({item.width}px)</div>
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-4" style={{ width: item.width }}>
            <Card.Root size={{ initial: 'xs', md: 'md', xl: 'xl' }} className="w-full">
              <Card.Header>
                <Card.Title>Container query padding</Card.Title>
                <Card.Description>This card responds to its container width.</Card.Description>
              </Card.Header>
            </Card.Root>
          </div>
        </div>
      ))}
    </div>
  )
}`,
      },
      {
        id: 'composition',
        title: 'Composition',
        description: 'Use header, content, and footer slots to keep actions and metadata aligned.',
        code: `export default function Example() {
  return (
    <Card.Root className="max-w-md">
      <Card.Header className="gap-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <Card.Title>Quarterly roadmap</Card.Title>
          <Card.Description>Updated 12 minutes ago</Card.Description>
        </div>
        <Badge variant="soft" color="primary">In review</Badge>
      </Card.Header>
      <Card.Content className="space-y-3">
        <Card.Description>
          Use Card for grouped content where metadata and actions should stay together.
        </Card.Description>
      </Card.Content>
      <Card.Footer className="justify-end gap-2">
        <Button variant="outline">Share</Button>
        <Button>Open</Button>
      </Card.Footer>
    </Card.Root>
  )
}`,
      },
    ],
  },
  'data-list': {
    ...dataListCatalogEntry,
    overviewCode: `export default function Example() {
  return (
    <DataList.Root>
      <DataList.Item align="center">
        <DataList.Label minWidth="88px">Status</DataList.Label>
        <DataList.Value>
          <Badge color="success" variant="soft" radius="full">
            Authorized
          </Badge>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">ID</DataList.Label>
        <DataList.Value>
          <Flex align="center" gap="2">
            <Code variant="ghost">u_2J89JSA4GJ</Code>
            <IconButton
              size="xs"
              aria-label="Copy value"
              color="gray"
              variant="ghost"
            >
              <CopyIcon />
            </IconButton>
          </Flex>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">Name</DataList.Label>
        <DataList.Value>Vlad Moroz</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">Email</DataList.Label>
        <DataList.Value>
          <Link href="mailto:vlad@workos.com">vlad@workos.com</Link>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">Company</DataList.Label>
        <DataList.Value>
          <Link target="_blank" href="https://workos.com">
            WorkOS
          </Link>
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  )
}`,
    propDefs: dataListDocsPropDefs,
    runtimeScope: {
      Badge,
      Code,
      CopyIcon,
      DataList,
      Flex,
      IconButton,
      Link,
    },
    sections: [
      {
        id: 'vertical-orientation',
        title: 'Vertical Orientation',
        description: 'Switch to vertical orientation when narrow containers need labels stacked above their values.',
        code: `export default function Example() {
  return (
    <div className="w-[320px] rounded-xl border p-4">
      <DataList.Root orientation="vertical" size="sm" trim="both">
        <DataList.Item>
          <DataList.Label>Status</DataList.Label>
          <DataList.Value>
            <Badge color="success" variant="soft">Authorized</Badge>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Email</DataList.Label>
          <DataList.Value>
            <Link href="mailto:vlad@workos.com">vlad@workos.com</Link>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Company</DataList.Label>
          <DataList.Value>
            <Link target="_blank" href="https://workos.com">
              WorkOS
            </Link>
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </div>
  )
}`,
      },
      {
        id: 'responsive-size',
        title: 'Responsive Size',
        description: 'Use responsive root sizing to increase spacing and type scale as the local container grows.',
        code: `export default function Example() {
  const widths = [
    { label: 'Narrow container', width: 280 },
    { label: 'Medium container', width: 520 },
    { label: 'Wide container', width: 760 },
  ]

  return (
    <div className="space-y-4">
      {widths.map(item => (
        <div key={item.label} className="space-y-2">
          <div className="text-sm font-medium text-foreground">{item.label} ({item.width}px)</div>
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-4" style={{ width: item.width }}>
            <DataList.Root size={{ initial: 'sm', md: 'lg' }}>
              <DataList.Item>
                <DataList.Label minWidth="96px">Viewport</DataList.Label>
                <DataList.Value>Small at the base breakpoint, large from md upward.</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="96px">Typography</DataList.Label>
                <DataList.Value>Root spacing and text scale switch together.</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </div>
        </div>
      ))}
    </div>
  )
}`,
      },
    ],
  },
} as const satisfies Record<string, ElementDocsEntry>
