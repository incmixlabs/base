'use client'

import { AlertDialog, Button, ContextMenu, Dialog, DropdownMenu, ScrollArea, Timeline } from '@incmix/ui/elements'
import {
  alertDialogPropDefs as alertDialogElementPropDefs,
  contextMenuPropDefs as contextMenuElementPropDefs,
  dialogPropDefs as dialogElementPropDefs,
  dropdownMenuPropDefs as dropdownMenuElementPropDefs,
  scrollAreaPropDefs as scrollAreaElementPropDefs,
  tablePropDefs as tableElementPropDefs,
} from '@incmix/ui/elements/props'
import { Flex } from '@incmix/ui/layouts'
import {
  alertDialogPropDefs as alertDialogDocsPropDefs,
  contextMenuPropDefs as contextMenuDocsPropDefs,
  dialogPropDefs as dialogDocsPropDefs,
  dropdownMenuPropDefs as dropdownMenuDocsPropDefs,
  scrollAreaPropDefs as scrollAreaDocsPropDefs,
  tablePropDefs as tableDocsPropDefs,
  timelinePropDefs,
} from '@incmix/ui/props'
import { Table } from '@incmix/ui/table'
import { Text } from '@incmix/ui/typography/text/Text'
import {
  autoProps,
  createAutogenEntry,
  createEnumShowcaseSection,
  type ElementDocsBaseEntry,
  type ElementDocsEntry,
} from '../element-docs-types'

function createElementBaseEntry(config: {
  slug: string
  title: string
  description: string
  sourcePath: string
  overviewCode: string
  propDefs: ElementDocsBaseEntry['propDefs']
  runtimeScope: ElementDocsBaseEntry['runtimeScope']
}): ElementDocsBaseEntry {
  return {
    slug: config.slug,
    title: config.title,
    description: config.description,
    sourcePath: config.sourcePath,
    propDefs: config.propDefs,
    overviewCode: config.overviewCode,
    runtimeScope: config.runtimeScope,
  }
}

export const extendedEntries = {
  'alert-dialog': createAutogenEntry({
    base: createElementBaseEntry({
      slug: 'alert-dialog',
      title: 'Alert Dialog',
      description: 'Destructive or high-importance confirmation dialog with modal focus handling.',
      sourcePath: 'packages/ui/src/elements/dialog/AlertDialog.tsx',
      propDefs: alertDialogDocsPropDefs,
      overviewCode: `<AlertDialog.Root>
  <AlertDialog.Trigger>
    <Button color="error">Delete project</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content size="md" color="error" variant="surface">
    <AlertDialog.Header>
      <AlertDialog.Title>Delete project?</AlertDialog.Title>
      <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>
        <Button variant="soft" color="neutral">Cancel</Button>
      </AlertDialog.Cancel>
      <AlertDialog.Action>
        <Button color="error">Delete</Button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`,
      runtimeScope: { AlertDialog, Button },
    }),
    propDefsByName: alertDialogElementPropDefs,
    props: autoProps,
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {sizes.map(size => (
        <AlertDialog.Root key={size}>
          <AlertDialog.Trigger>
            <Button variant="outline">{size}</Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content size={size} color="error" variant="surface">
            <AlertDialog.Header>
              <AlertDialog.Title>{size} alert dialog</AlertDialog.Title>
              <AlertDialog.Description>Use size to tune the reading width.</AlertDialog.Description>
            </AlertDialog.Header>
          </AlertDialog.Content>
        </AlertDialog.Root>
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {variants.map(variant => (
        <AlertDialog.Root key={variant}>
          <AlertDialog.Trigger>
            <Button variant="outline">{variant}</Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content variant={variant} color="error">
            <AlertDialog.Header>
              <AlertDialog.Title>{variant} alert dialog</AlertDialog.Title>
              <AlertDialog.Description>Variant changes the surface treatment.</AlertDialog.Description>
            </AlertDialog.Header>
          </AlertDialog.Content>
        </AlertDialog.Root>
      ))}
    </Flex>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {colors.map(color => (
        <AlertDialog.Root key={color}>
          <AlertDialog.Trigger>
            <Button variant="outline">{color}</Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content color={color} variant="surface">
            <AlertDialog.Header>
              <AlertDialog.Title>{color} alert dialog</AlertDialog.Title>
              <AlertDialog.Description>Color communicates severity or context.</AlertDialog.Description>
            </AlertDialog.Header>
          </AlertDialog.Content>
        </AlertDialog.Root>
      ))}
    </Flex>
  )
}`,
      highContrast: () => `export default function Example() {
  return (
    <Flex wrap="wrap" gap="3">
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button variant="outline">Standard</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content color="error" variant="surface">
          <AlertDialog.Header>
            <AlertDialog.Title>Standard</AlertDialog.Title>
          </AlertDialog.Header>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button variant="outline">High contrast</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content color="error" variant="surface" highContrast>
          <AlertDialog.Header>
            <AlertDialog.Title>High contrast</AlertDialog.Title>
          </AlertDialog.Header>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Flex>
  )
}`,
    },
  }),
  dialog: createAutogenEntry({
    base: createElementBaseEntry({
      slug: 'dialog',
      title: 'Dialog',
      description: 'Modal overlay for focused flows like editing, forms, and multistep confirmation.',
      sourcePath: 'packages/ui/src/elements/dialog/Dialog.tsx',
      propDefs: dialogDocsPropDefs,
      overviewCode: `<Dialog.Root>
  <Dialog.Trigger>
    <Button>Edit profile</Button>
  </Dialog.Trigger>
  <Dialog.Content size="md">
    <Dialog.Close />
    <Dialog.Header>
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>Make changes to your profile.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Body>
      <Text size="sm">Dialog body content goes here.</Text>
    </Dialog.Body>
  </Dialog.Content>
</Dialog.Root>`,
      runtimeScope: { Button, Dialog, Flex, Text },
    }),
    propDefsByName: dialogElementPropDefs,
    props: autoProps,
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {sizes.map(size => (
        <Dialog.Root key={size}>
          <Dialog.Trigger>
            <Button variant="outline">{size}</Button>
          </Dialog.Trigger>
          <Dialog.Content size={size}>
            <Dialog.Header>
              <Dialog.Title>{size} dialog</Dialog.Title>
              <Dialog.Description>Use size to change reading width.</Dialog.Description>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {variants.map(variant => (
        <Dialog.Root key={variant}>
          <Dialog.Trigger>
            <Button variant="outline">{variant}</Button>
          </Dialog.Trigger>
          <Dialog.Content variant={variant} color="primary">
            <Dialog.Header>
              <Dialog.Title>{variant} dialog</Dialog.Title>
              <Dialog.Description>Variant adjusts the container chrome.</Dialog.Description>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </Flex>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {colors.map(color => (
        <Dialog.Root key={color}>
          <Dialog.Trigger>
            <Button variant="outline">{color}</Button>
          </Dialog.Trigger>
          <Dialog.Content color={color} variant="surface">
            <Dialog.Header>
              <Dialog.Title>{color} dialog</Dialog.Title>
              <Dialog.Description>Color can align the dialog with a semantic lane.</Dialog.Description>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </Flex>
  )
}`,
      highContrast: () => `export default function Example() {
  return (
    <Flex wrap="wrap" gap="3">
      <Dialog.Root>
        <Dialog.Trigger>
          <Button variant="outline">Standard</Button>
        </Dialog.Trigger>
        <Dialog.Content variant="surface" color="primary">
          <Dialog.Header>
            <Dialog.Title>Standard dialog</Dialog.Title>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button variant="outline">High contrast</Button>
        </Dialog.Trigger>
        <Dialog.Content variant="surface" color="primary" highContrast>
          <Dialog.Header>
            <Dialog.Title>High contrast dialog</Dialog.Title>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  )
}`,
    },
    extraSections: [
      {
        id: 'alignment',
        title: 'Alignment',
        description: 'Use align when the content should anchor to the top instead of the centered default.',
        code: `export default function Example() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="outline">Top aligned</Button>
      </Dialog.Trigger>
      <Dialog.Content align="start">
        <Dialog.Header>
          <Dialog.Title>Top aligned</Dialog.Title>
          <Dialog.Description>Use align="start" for top placement.</Dialog.Description>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog.Root>
  )
}`,
      },
    ],
  }),
  'context-menu': createAutogenEntry({
    base: createElementBaseEntry({
      slug: 'context-menu',
      title: 'Context Menu',
      description: 'Right-click or long-press menu surface for contextual actions.',
      sourcePath: 'packages/ui/src/elements/menu/ContextMenu.tsx',
      propDefs: contextMenuDocsPropDefs,
      overviewCode: `<ContextMenu.Root>
  <ContextMenu.Trigger>
    <div className="rounded-xl border border-border/70 p-6 text-sm">Right click this area</div>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item>Rename</ContextMenu.Item>
    <ContextMenu.Item>Duplicate</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>`,
      runtimeScope: { Button, ContextMenu },
    }),
    propDefsByName: contextMenuElementPropDefs,
    props: ['size', 'variant', 'color'],
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {sizes.map(size => (
        <ContextMenu.Root key={size}>
          <ContextMenu.Trigger>
            <Button variant="outline">{size}</Button>
          </ContextMenu.Trigger>
          <ContextMenu.Content size={size}>
            <ContextMenu.Item>Rename</ContextMenu.Item>
            <ContextMenu.Item>Duplicate</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {variants.map(variant => (
        <ContextMenu.Root key={variant}>
          <ContextMenu.Trigger>
            <Button variant="outline">{variant}</Button>
          </ContextMenu.Trigger>
          <ContextMenu.Content variant={variant}>
            <ContextMenu.Item>Rename</ContextMenu.Item>
            <ContextMenu.Item>Duplicate</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      ))}
    </Flex>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {colors.map(color => (
        <ContextMenu.Root key={color}>
          <ContextMenu.Trigger>
            <Button variant="outline">{color}</Button>
          </ContextMenu.Trigger>
          <ContextMenu.Content color={color}>
            <ContextMenu.Item>Rename</ContextMenu.Item>
            <ContextMenu.Item>Duplicate</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      ))}
    </Flex>
  )
}`,
    },
  }),
  'dropdown-menu': createAutogenEntry({
    base: createElementBaseEntry({
      slug: 'dropdown-menu',
      title: 'Dropdown Menu',
      description: 'Trigger-based action menu for compact command lists and settings surfaces.',
      sourcePath: 'packages/ui/src/elements/menu/DropdownMenu.tsx',
      propDefs: dropdownMenuDocsPropDefs.Content,
      overviewCode: `<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Button variant="outline">Open menu</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>Rename</DropdownMenu.Item>
    <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>`,
      runtimeScope: { Button, DropdownMenu },
    }),
    propDefsByName: dropdownMenuElementPropDefs.Content,
    props: ['size', 'variant', 'color'],
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {sizes.map(size => (
        <DropdownMenu.Root key={size}>
          <DropdownMenu.Trigger>
            <Button variant="outline">{size}</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content size={size}>
            <DropdownMenu.Item>Rename</DropdownMenu.Item>
            <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {variants.map(variant => (
        <DropdownMenu.Root key={variant}>
          <DropdownMenu.Trigger>
            <Button variant="outline">{variant}</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant={variant}>
            <DropdownMenu.Item>Rename</DropdownMenu.Item>
            <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ))}
    </Flex>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {colors.map(color => (
        <DropdownMenu.Root key={color}>
          <DropdownMenu.Trigger>
            <Button variant="outline">{color}</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content color={color}>
            <DropdownMenu.Item>Rename</DropdownMenu.Item>
            <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ))}
    </Flex>
  )
}`,
    },
  }),
  'scroll-area': createAutogenEntry({
    base: createElementBaseEntry({
      slug: 'scroll-area',
      title: 'Scroll Area',
      description: 'Constrain overflowing content with configurable rails, tracker styling, and directional behavior.',
      sourcePath: 'packages/ui/src/elements/scroll-area/ScrollArea.tsx',
      propDefs: scrollAreaDocsPropDefs,
      overviewCode: `<ScrollArea type="hover" scroll="vertical" size="xs" controls className="h-56 w-80 rounded-lg border">
  <div className="px-4 py-4 pr-2">
    {Array.from({ length: 8 }, (_, i) => (
      <p key={i} className="mb-3 text-sm">
        Item {i + 1} — Lorem ipsum dolor sit amet.
      </p>
    ))}
  </div>
</ScrollArea>`,
      runtimeScope: { ScrollArea },
    }),
    propDefsByName: scrollAreaElementPropDefs,
    props: ['size', 'variant', 'color'],
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="4">
      {sizes.map(size => (
        <ScrollArea key={size} size={size} type="always" controls className="h-44 w-56 rounded-lg border">
          <div className="px-3 py-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={i}>${'${'}size{'}'} item {i + 1}</p>
            ))}
          </div>
        </ScrollArea>
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="4">
      {variants.map(variant => (
        <ScrollArea key={variant} variant={variant} type="always" controls className="h-44 w-56 rounded-lg border">
          <div className="px-3 py-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={i}>{variant} {i + 1}</p>
            ))}
          </div>
        </ScrollArea>
      ))}
    </Flex>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="4">
      {colors.map(color => (
        <ScrollArea key={color} color={color} type="always" controls className="h-44 w-56 rounded-lg border">
          <div className="px-3 py-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={i}>{color} {i + 1}</p>
            ))}
          </div>
        </ScrollArea>
      ))}
    </Flex>
  )
}`,
    },
    extraSections: [
      {
        id: 'types',
        title: 'Types',
        description:
          'Switch between auto, always, and hover visibility depending on how persistent the rail should be.',
        code: `export default function Example() {
  return (
    <Flex wrap="wrap" gap="4">
      <ScrollArea type="auto" scroll="vertical" className="h-44 w-56 rounded-lg border">
        <div className="px-3 py-3">{Array.from({ length: 10 }).map((_, i) => <p key={i}>Auto {i + 1}</p>)}</div>
      </ScrollArea>
      <ScrollArea type="always" scroll="vertical" controls className="h-44 w-56 rounded-lg border">
        <div className="px-3 py-3">{Array.from({ length: 10 }).map((_, i) => <p key={i}>Always {i + 1}</p>)}</div>
      </ScrollArea>
      <ScrollArea type="hover" scroll="vertical" className="h-44 w-56 rounded-lg border">
        <div className="px-3 py-3">{Array.from({ length: 10 }).map((_, i) => <p key={i}>Hover {i + 1}</p>)}</div>
      </ScrollArea>
    </Flex>
  )
}`,
      },
      {
        id: 'directions',
        title: 'Directions',
        description:
          'Use scroll to control whether the area should overflow vertically, horizontally, or on both axes.',
        code: `export default function Example() {
  return (
    <Flex wrap="wrap" gap="4">
      <ScrollArea scroll="vertical" className="h-44 w-56 rounded-lg border">
        <div className="px-3 py-3">{Array.from({ length: 8 }).map((_, i) => <p key={i}>Vertical {i + 1}</p>)}</div>
      </ScrollArea>
      <ScrollArea scroll="horizontal" className="h-44 w-56 rounded-lg border">
        <div className="px-3 py-3">
          <div style={{ width: '36rem' }} className="flex gap-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-20 w-20 rounded bg-muted" />)}</div>
        </div>
      </ScrollArea>
      <ScrollArea scroll="both" className="h-44 w-56 rounded-lg border">
        <div className="px-3 py-3">
          <div style={{ width: '48rem' }} className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[10rem_14rem_minmax(20rem,1fr)] gap-3">
                <span>Both {i + 1}</span>
                <span>Horizontal rail should remain visible.</span>
                <span>Extra width keeps the example overflowing on both axes.</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </Flex>
  )
}`,
      },
    ],
  }),
  table: createAutogenEntry({
    base: createElementBaseEntry({
      slug: 'table',
      title: 'Table',
      description: 'Composable data table primitive with size, layout, and surface variants for structured records.',
      sourcePath: 'packages/ui/src/table/basic/Table.tsx',
      propDefs: tableDocsPropDefs.Root,
      overviewCode: `<Table.Root size="md">
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell justify="end">Seats</Table.ColumnHeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.RowHeaderCell>Acme</Table.RowHeaderCell>
      <Table.Cell>Active</Table.Cell>
      <Table.Cell justify="end">24</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>`,
      runtimeScope: { Table },
    }),
    propDefsByName: tableElementPropDefs.Root,
    props: ['size', 'variant'],
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {sizes.map(size => (
        <Table.Root key={size} size={size}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.RowHeaderCell>{size}</Table.RowHeaderCell>
              <Table.Cell>Active</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {variants.map(variant => (
        <Table.Root key={variant} variant={variant}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.RowHeaderCell>{variant}</Table.RowHeaderCell>
              <Table.Cell>Active</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      ))}
    </Flex>
  )
}`,
    },
    extraSections: [
      {
        id: 'layout',
        title: 'Layout',
        description: 'Use layout when dense numeric tables need tighter fit behavior or a fixed column strategy.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="4">
      <Table.Root layout="auto">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Layout</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>Auto</Table.RowHeaderCell>
            <Table.Cell>Columns size to their content.</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
      <Table.Root layout="fixed">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Layout</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>Fixed</Table.RowHeaderCell>
            <Table.Cell>Columns share fixed table width more evenly.</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Flex>
  )
}`,
      },
    ],
  }),
  timeline: {
    ...createElementBaseEntry({
      slug: 'timeline',
      title: 'Timeline',
      description: 'Ordered event list for activity feeds, onboarding steps, and deployment histories.',
      sourcePath: 'packages/ui/src/elements/timeline/Timeline.tsx',
      propDefs: timelinePropDefs,
      overviewCode: `export default function Example() {
  return (
    <Timeline.Root>
      <Timeline.Item>
        <Timeline.Indicator />
        <Timeline.Separator separatorCompleted />
        <Timeline.Header>
          <Timeline.Title>Application received</Timeline.Title>
          <Timeline.Date>Apr 4</Timeline.Date>
        </Timeline.Header>
        <Timeline.Content>Review started by the operations team.</Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Indicator />
        <Timeline.Header>
          <Timeline.Title>Interview scheduled</Timeline.Title>
          <Timeline.Date>Apr 7</Timeline.Date>
        </Timeline.Header>
        <Timeline.Content>Candidate moved to the next stage.</Timeline.Content>
      </Timeline.Item>
    </Timeline.Root>
  )
}`,
      runtimeScope: { Timeline },
    }),
    sections: [
      createEnumShowcaseSection({
        componentLabel: 'timeline',
        prop: 'orientation',
        values: ['horizontal', 'vertical'],
        code: `export default function Example() {
  const values = __VALUES__
  return (
    <Flex direction="column" gap="6">
      {values.map(value => (
        <Timeline.Root key={value} orientation={value}>
          <Timeline.Item>
            <Timeline.Indicator />
            <Timeline.Separator separatorCompleted />
            <Timeline.Header>
              <Timeline.Title>{value}</Timeline.Title>
              <Timeline.Date>Today</Timeline.Date>
            </Timeline.Header>
            <Timeline.Content>Orientation changes the event flow direction.</Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Indicator />
            <Timeline.Header>
              <Timeline.Title>Complete</Timeline.Title>
              <Timeline.Date>Next</Timeline.Date>
            </Timeline.Header>
            <Timeline.Content>Use the same content model in both directions.</Timeline.Content>
          </Timeline.Item>
        </Timeline.Root>
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'timeline',
        prop: 'size',
        values: ['xs', 'sm', 'md', 'lg'],
        code: `export default function Example() {
  const values = __VALUES__
  return (
    <Flex direction="column" gap="5">
      {values.map(value => (
        <Timeline.Root key={value} size={value}>
          <Timeline.Item>
            <Timeline.Indicator />
            <Timeline.Separator separatorCompleted />
            <Timeline.Header>
              <Timeline.Title>{value}</Timeline.Title>
              <Timeline.Date>Today</Timeline.Date>
            </Timeline.Header>
            <Timeline.Content>Use size to adjust indicator and text rhythm.</Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Indicator />
            <Timeline.Header>
              <Timeline.Title>Complete</Timeline.Title>
              <Timeline.Date>Next</Timeline.Date>
            </Timeline.Header>
            <Timeline.Content>The content model stays the same across sizes.</Timeline.Content>
          </Timeline.Item>
        </Timeline.Root>
      ))}
    </Flex>
  )
}`,
      }),
    ],
  },
} as const satisfies Record<string, ElementDocsEntry>
