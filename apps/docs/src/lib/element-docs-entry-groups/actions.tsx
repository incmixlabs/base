'use client'

import { Button, Popover } from '@incmix/ui/elements'
import { buttonCatalogEntry, iconButtonCatalogEntry } from '@/editor/catalog'
import {
  elementPropDefsByComponent,
  iconButtonPropDefs as iconButtonElementPropDefs,
  popoverPropDefs as popoverElementPropDefs,
} from '@/editor/elements/props'
import { popoverPropDefs } from '@/editor/prop-defs'
import type { ElementDocsBaseEntry, ElementDocsEntry } from '../element-docs-types'
import { autoProps, createAutogenEntry, createEnumShowcaseSection } from '../element-docs-types'

const buttonElementPropDefs = elementPropDefsByComponent.button

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

export const actionEntries = {
  button: createAutogenEntry({
    base: buttonCatalogEntry,
    propDefsByName: buttonElementPropDefs,
    props: autoProps.filter(prop => prop !== 'highContrast'),
    display: 'inline',
    inlineComponent: 'Button',
    extraSections: [
      {
        id: 'high-contrast',
        title: 'High Contrast',
        description: 'Use high contrast where actions need stronger separation from dense surfaces.',
        code: `<Flex wrap="wrap" gap="4">
  <Button variant="solid">Standard</Button>
  <Button variant="solid" highContrast>High contrast</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="outline" highContrast>High contrast</Button>
</Flex>`,
      },
    ],
  }),
  'icon-button': {
    ...iconButtonCatalogEntry,
    sections: [
      createEnumShowcaseSection({
        componentLabel: 'icon-button',
        prop: 'size',
        values: iconButtonElementPropDefs.size.values,
        code: `export default function Example() {
  const sizes = __VALUES__
  return (
    <Flex align="center" gap="3" wrap="wrap">
      {sizes.map(size => (
        <IconButton key={size} size={size} icon="search" title={'Search \u00b7 ' + size} />
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'icon-button',
        prop: 'variant',
        values: iconButtonElementPropDefs.variant.values,
        code: `export default function Example() {
  const values = __VALUES__
  return (
    <Flex align="center" gap="3" wrap="wrap">
      {values.map(value => (
        <IconButton key={value} variant={value} icon="search" title={value} />
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'icon-button',
        prop: 'color',
        values: iconButtonElementPropDefs.color.values,
        code: `export default function Example() {
  const colors = __VALUES__
  return (
    <Flex align="center" gap="3" wrap="wrap">
      {colors.map(color => (
        <IconButton key={color} color={color} variant="soft" icon="settings" title={color} />
      ))}
    </Flex>
  )
}`,
      }),
      {
        id: 'high-contrast',
        title: 'High Contrast',
        description: 'Use high contrast to strengthen icon-only actions across shared surface variants.',
        code: `export default function Example() {
  return (
    <Flex align="center" gap="3" wrap="wrap">
      <IconButton icon="copy" title="Solid" variant="solid" color="primary" />
      <IconButton icon="copy" title="Solid \u00b7 High contrast" variant="solid" color="primary" highContrast />
      <IconButton icon="settings" title="Outline" variant="outline" color="primary" />
      <IconButton icon="settings" title="Outline \u00b7 High contrast" variant="outline" color="primary" highContrast />
    </Flex>
  )
}`,
      },
      {
        id: 'dynamic-icons',
        title: 'Dynamic Icons',
        description: 'Pass icon names as strings to resolve lucide icons dynamically at runtime.',
        code: `export default function Example() {
  return (
    <Flex align="center" gap="3" wrap="wrap">
      <IconButton icon="search" title="Search" />
      <IconButton icon="copy" title="Copy" variant="outline" />
      <IconButton icon="close" title="Close" variant="ghost" />
      <IconButton icon="settings" title="Settings" color="info" />
    </Flex>
  )
}`,
      },
    ],
  },
  popover: createAutogenEntry({
    base: createElementBaseEntry({
      slug: 'popover',
      title: 'Popover',
      description:
        'Popovers display contextual content anchored to a trigger. Visual treatment is driven by Surface variants and color lanes.',
      sourcePath: 'packages/ui/src/elements/popover/Popover.tsx',
      propDefs: popoverPropDefs,
      overviewCode: `<Popover.Root>
  <Popover.Trigger>
    <Button variant="outline">Open Popover</Button>
  </Popover.Trigger>
  <Popover.Content variant="surface" color="info" size="sm" maxWidthToken="sm">
    <Popover.Close />
    <div className="space-y-2">
      <h4 className="font-medium">Popover Title</h4>
      <p className="text-sm text-muted-foreground">This popover uses Surface-driven styles.</p>
    </div>
    <Popover.Arrow variant="surface" color="info" />
  </Popover.Content>
</Popover.Root>`,
      runtimeScope: { Popover, Button },
    }),
    propDefsByName: popoverElementPropDefs,
    props: autoProps,
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {sizes.map(size => (
        <Popover.Root key={size}>
          <Popover.Trigger>
            <Button variant="outline">{size}</Button>
          </Popover.Trigger>
          <Popover.Content size={size} variant="surface" color="info">
            <p className="text-sm">Size {size}</p>
            <Popover.Arrow size={size} variant="surface" color="info" />
          </Popover.Content>
        </Popover.Root>
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {variants.map(variant => (
        <Popover.Root key={variant}>
          <Popover.Trigger>
            <Button variant="outline" className="capitalize">{variant}</Button>
          </Popover.Trigger>
          <Popover.Content variant={variant} color="primary">
            <p className="text-sm capitalize">{variant} popover</p>
            <Popover.Arrow variant={variant} color="primary" />
          </Popover.Content>
        </Popover.Root>
      ))}
    </Flex>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex wrap="wrap" gap="3">
      {colors.map(color => (
        <Popover.Root key={color}>
          <Popover.Trigger>
            <Button variant="outline" className="capitalize">{color}</Button>
          </Popover.Trigger>
          <Popover.Content color={color} variant="surface">
            <p className="text-sm capitalize">{color} popover</p>
            <Popover.Arrow color={color} variant="surface" />
          </Popover.Content>
        </Popover.Root>
      ))}
    </Flex>
  )
}`,
      highContrast: () => `export default function Example() {
  return (
    <Flex wrap="wrap" gap="3">
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="outline">Standard</Button>
        </Popover.Trigger>
        <Popover.Content variant="surface" color="primary">
          <p className="text-sm">Standard surface popover</p>
          <Popover.Arrow variant="surface" color="primary" />
        </Popover.Content>
      </Popover.Root>
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="outline">High contrast</Button>
        </Popover.Trigger>
        <Popover.Content variant="surface" color="primary" highContrast>
          <p className="text-sm">High contrast surface popover</p>
          <Popover.Arrow variant="surface" color="primary" highContrast />
        </Popover.Content>
      </Popover.Root>
    </Flex>
  )
}`,
    },
    extraSections: [
      {
        id: 'positioning',
        title: 'Positioning',
        description: 'Use side, align, and offsets to tune placement relative to the trigger.',
        code: `export default function Example() {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="outline">Aligned End</Button>
      </Popover.Trigger>
      <Popover.Content side="bottom" align="end" sideOffset={10} alignOffset={4} variant="surface" color="slate">
        <p className="text-sm">Use side, align, and offsets to tune placement.</p>
        <Popover.Arrow variant="surface" color="slate" />
      </Popover.Content>
    </Popover.Root>
  )
}`,
      },
    ],
  }),
} as const satisfies Record<string, ElementDocsEntry>
