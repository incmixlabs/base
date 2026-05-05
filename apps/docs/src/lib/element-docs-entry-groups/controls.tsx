'use client'

import {
  accordionCatalogEntry,
  segmentedControlCatalogEntry,
  sliderCatalogEntry,
  tabsCatalogEntry,
} from '@incmix/ui/editor/catalog'
import {
  accordionPropDefs as accordionElementPropDefs,
  segmentedControlPropDefs as segmentedControlElementPropDefs,
  tabsPropDefs as tabsElementPropDefs,
} from '@incmix/ui/elements/props'
import { formPropDefsByComponent } from '@incmix/ui/form/props'
import type { ElementDocsEntry } from '../element-docs-types'
import { autoProps, createAutogenEntry, createEnumShowcaseSection } from '../element-docs-types'

const sliderFormPropDefs = formPropDefsByComponent.slider

export const controlEntries = {
  accordion: {
    ...accordionCatalogEntry,
    sections: [
      createEnumShowcaseSection({
        componentLabel: 'accordion',
        prop: 'size',
        values: accordionElementPropDefs.size.values,
        code: `export default function Example() {
  const sizes = __VALUES__
  return (
    <Flex direction="column" gap="4">
      {sizes.map(size => (
        <div key={size} className="space-y-2">
          <div className="text-sm text-muted-foreground">size={size}</div>
          <Accordion.Root size={size} defaultValue={['item-1']} className="w-[560px]">
            <Accordion.Item value="item-1">
              <Accordion.Trigger>Section one</Accordion.Trigger>
              <Accordion.Content>Size affects trigger and content density.</Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-2">
              <Accordion.Trigger>Section two</Accordion.Trigger>
              <Accordion.Content>Use smaller sizes for tighter layouts.</Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'accordion',
        prop: 'triggerIconPosition',
        values: accordionElementPropDefs.triggerIconPosition.values,
        code: `export default function Example() {
  const values = __VALUES__
  return (
    <Flex direction="column" gap="4">
      {values.map(value => (
        <div key={value} className="space-y-2">
          <div className="text-sm text-muted-foreground">triggerIconPosition={value}</div>
          <Accordion.Root triggerIconPosition={value} defaultValue={['item-1']} className="w-[560px]">
            <Accordion.Item value="item-1">
              <Accordion.Trigger>Release notes</Accordion.Trigger>
              <Accordion.Content>The indicator can sit left or right.</Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      ))}
    </Flex>
  )
}`,
      }),
      {
        id: 'multiple',
        title: 'Multiple',
        description: 'Enable multiple to allow more than one item to stay expanded.',
        code: `export default function Example() {
  return (
    <Accordion.Root multiple defaultValue={['a', 'c']} className="w-[560px]">
      <Accordion.Item value="a">
        <Accordion.Trigger>Performance</Accordion.Trigger>
        <Accordion.Content>Small, composable primitives with predictable render paths.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>Accessibility</Accordion.Trigger>
        <Accordion.Content>Keyboard navigation and semantic structure come from Base UI primitives.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="c">
        <Accordion.Trigger>Customization</Accordion.Trigger>
        <Accordion.Content>Use size and icon position props to match your shell.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}`,
      },
    ],
  },
  'segmented-control': {
    ...segmentedControlCatalogEntry,
    sections: [
      createEnumShowcaseSection({
        componentLabel: 'segmented-control',
        prop: 'size',
        values: segmentedControlElementPropDefs.size.values,
        code: `export default function Example() {
  const sizes = __VALUES__
  return (
    <Flex direction="column" gap="4" align="start">
      {sizes.map(size => (
        <SegmentedControl.Root variant='underline' key={size} size={size} defaultValue="a">
          <SegmentedControl.Item value="a">Option A</SegmentedControl.Item>
          <SegmentedControl.Item value="b">Option B</SegmentedControl.Item>
          <SegmentedControl.Item value="c">Option C</SegmentedControl.Item>
        </SegmentedControl.Root>
      ))}
    </Flex>
  )
}`,
      }),
      {
        id: 'variant',
        title: 'Variant',
        description: 'Use surface for a filled segmented treatment and underline for a lighter tab-like treatment.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="5" align="start">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">surface</div>
        <SegmentedControl.Root variant="surface" color="primary" defaultValue="a">
          <SegmentedControl.Item value="a">List</SegmentedControl.Item>
          <SegmentedControl.Item value="b">Board</SegmentedControl.Item>
          <SegmentedControl.Item value="c">Timeline</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">underline</div>
        <SegmentedControl.Root variant="underline" color="primary" defaultValue="a">
          <SegmentedControl.Item value="a">List</SegmentedControl.Item>
          <SegmentedControl.Item value="b">Board</SegmentedControl.Item>
          <SegmentedControl.Item value="c">Timeline</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
    </Flex>
  )
}`,
      },
      createEnumShowcaseSection({
        componentLabel: 'segmented-control',
        prop: 'color',
        values: segmentedControlElementPropDefs.color.values,
        code: `export default function Example() {
  const colors = __VALUES__
  return (
    <Flex direction="column" gap="4" align="start">
      {colors.map(color => (
        <SegmentedControl.Root key={color} color={color} defaultValue="a">
          <SegmentedControl.Item value="a">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="b">Month</SegmentedControl.Item>
          <SegmentedControl.Item value="c">Quarter</SegmentedControl.Item>
        </SegmentedControl.Root>
      ))}
    </Flex>
  )
}`,
      }),
      {
        id: 'highContrast',
        title: 'HighContrast',
        description: 'High contrast strengthens the active segment treatment for dense surfaces.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="4" align="start">
      <SegmentedControl.Root color="primary" defaultValue="a">
        <SegmentedControl.Item value="a">Normal</SegmentedControl.Item>
        <SegmentedControl.Item value="b">State</SegmentedControl.Item>
      </SegmentedControl.Root>
      <SegmentedControl.Root color="primary" highContrast defaultValue="a">
        <SegmentedControl.Item value="a">High</SegmentedControl.Item>
        <SegmentedControl.Item value="b">Contrast</SegmentedControl.Item>
      </SegmentedControl.Root>
    </Flex>
  )
}`,
      },
      {
        id: 'icons',
        title: 'Icons',
        description: 'Use the shared icons config to place icons left, right, or as icon-only triggers with tooltips.',
        code: `export default function Example() {
  return (
    <SegmentedControl.Root
      size="sm"
      defaultValue="desktop"
      icons={{
        position: 'only',
        icons: [
          { value: 'desktop', icon: 'monitor' },
          { value: 'tablet', icon: 'tablet' },
          { value: 'phone', icon: 'smartphone' },
        ],
      }}
    >
      <SegmentedControl.Item value="desktop">Desktop</SegmentedControl.Item>
      <SegmentedControl.Item value="tablet">Tablet</SegmentedControl.Item>
      <SegmentedControl.Item value="phone">Phone</SegmentedControl.Item>
    </SegmentedControl.Root>
  )
}`,
      },
    ],
  },
  slider: createAutogenEntry({
    base: sliderCatalogEntry,
    propDefsByName: sliderFormPropDefs,
    props: autoProps,
    display: 'stacked',
    extraSections: [
      {
        id: 'range',
        title: 'Range',
        description: 'Pass two values to render a bounded range slider with the same component.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="3" style={{ width: 288 }}>
      <Slider defaultValue={[20, 80]} />
      <Flex align="center" justify="between" className="text-xs text-muted-foreground">
        <span>20</span>
        <span>80</span>
      </Flex>
    </Flex>
  )
}`,
      },
    ],
  }),
  tabs: {
    ...tabsCatalogEntry,
    sections: [
      createEnumShowcaseSection({
        componentLabel: 'tabs',
        prop: 'size',
        values: tabsElementPropDefs.Root.size.values,
        code: `export default function Example() {
  const sizes = __VALUES__
  return (
    <Flex direction="column" gap="6">
      {sizes.map(size => (
        <Tabs.Root key={size} size={size} defaultValue="tab1" className="w-[400px]">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Analytics</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Reports</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'tabs',
        prop: 'variant',
        values: tabsElementPropDefs.Root.variant.values,
        code: `export default function Example() {
  const values = __VALUES__
  return (
    <Flex direction="column" gap="6">
      {values.map(value => (
        <Tabs.Root key={value} variant={value} defaultValue="tab1" className="w-[400px]">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Analytics</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Reports</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'tabs',
        prop: 'color',
        values: tabsElementPropDefs.Root.color.values,
        code: `export default function Example() {
  const colors = __VALUES__
  return (
    <Flex direction="column" gap="6">
      {colors.map(color => (
        <Tabs.Root key={color} color={color} variant="line" defaultValue="tab1" className="w-[400px]">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      ))}
    </Flex>
  )
}`,
      }),
      {
        id: 'highContrast',
        title: 'HighContrast',
        description: 'High contrast reinforces the active state for line and surface variants.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="6">
      <Tabs.Root variant="line" color="primary" defaultValue="tab1" className="w-[400px]">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Normal</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Contrast</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      <Tabs.Root variant="line" color="primary" highContrast defaultValue="tab1" className="w-[400px]">
        <Tabs.List>
          <Tabs.Trigger value="tab1">High</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Contrast</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    </Flex>
  )
}`,
      },
      {
        id: 'icons',
        title: 'Icons',
        description:
          'Tabs shares the same icons API, including icon-only triggers with accessible labels and tooltips.',
        code: `export default function Example() {
  return (
    <Tabs.Root
      defaultValue="desktop"
      className="w-[320px]"
      icons={{
        position: 'only',
        icons: [
          { value: 'desktop', icon: 'monitor' },
          { value: 'tablet', icon: 'tablet' },
          { value: 'phone', icon: 'smartphone' },
        ],
      }}
    >
      <Tabs.List>
        <Tabs.Trigger value="desktop">Desktop</Tabs.Trigger>
        <Tabs.Trigger value="tablet">Tablet</Tabs.Trigger>
        <Tabs.Trigger value="phone">Phone</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  )
}`,
      },
    ],
  },
} as const satisfies Record<string, ElementDocsEntry>
