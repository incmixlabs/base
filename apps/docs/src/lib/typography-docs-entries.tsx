'use client'

import { Flex } from '@incmix/ui/layouts'
import { Heading, Kbd, Link, Text } from '@incmix/ui/typography'
import { headingPropDefs, kbdPropDefs, linkPropDefs, textPropDefs } from '@/editor/elements/props'
import { createDocsPropDefs, withMarginPropDocs } from '@/editor/live'
import type { ElementDocsEntry } from './element-docs-types'
import { createEnumShowcaseSection } from './element-docs-types'

export const typographyEntries = {
  text: {
    slug: 'text',
    title: 'Text',
    description: 'Body copy and supporting text for labels, prose, metadata, and UI messaging.',
    sourcePath: 'packages/ui/src/typography/text/Text.tsx',
    propDefs: createDocsPropDefs(textPropDefs),
    overviewCode: `export default function Example() {
  return (
    <Flex direction="column" gap="3">
      <Text size="xs" color="slate">Caption and metadata</Text>
      <Text size="sm">Standard body copy for interfaces.</Text>
      <Text size="md" weight="medium">Emphasized text content.</Text>
      <Text size="lg" color="green-11">Raw palette colors also work.</Text>
    </Flex>
  )
}`,
    runtimeScope: { Flex, Text },
    sections: [
      createEnumShowcaseSection({
        componentLabel: 'text',
        prop: 'size',
        values: textPropDefs.size.values,
        code: `export default function Example() {
  const sizes = __VALUES__
  return (
    <Flex direction="column" gap="3">
      {sizes.map(size => (
        <Text key={size} size={size}>Text size {size}</Text>
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'text',
        prop: 'variant',
        values: textPropDefs.variant.values,
        code: `export default function Example() {
  const variants = __VALUES__
  return (
    <Flex direction="column" gap="3">
      {variants.map(variant => (
        <Text key={variant} variant={variant} color="primary">
          {variant} text treatment
        </Text>
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'text',
        prop: 'color',
        values: textPropDefs.color.values,
        code: `export default function Example() {
  const colors = __VALUES__
  return (
    <Flex direction="column" gap="3">
      {colors.map(color => (
        <Text key={color} color={color}>Color {color}</Text>
      ))}
    </Flex>
  )
}`,
      }),
    ],
  },
  heading: {
    slug: 'heading',
    title: 'Heading',
    description: 'Display and section headings with responsive sizing and semantic color support.',
    sourcePath: 'packages/ui/src/typography/heading/Heading.tsx',
    propDefs: createDocsPropDefs(headingPropDefs),
    overviewCode: `export default function Example() {
  return (
    <Flex direction="column" gap="4">
      <Heading as="h1" size="4x">Page heading</Heading>
      <Heading as="h2" size="2x" color="primary">Section heading</Heading>
      <Heading as="h3" size="lg" variant="muted">Subsection heading</Heading>
    </Flex>
  )
}`,
    runtimeScope: { Flex, Heading },
    sections: [
      createEnumShowcaseSection({
        componentLabel: 'heading',
        prop: 'size',
        values: headingPropDefs.size.values,
        code: `export default function Example() {
  const sizes = __VALUES__
  return (
    <Flex direction="column" gap="3">
      {sizes.map(size => (
        <Heading key={size} size={size}>Heading size {size}</Heading>
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'heading',
        prop: 'variant',
        values: headingPropDefs.variant.values,
        code: `export default function Example() {
  const variants = __VALUES__
  return (
    <Flex direction="column" gap="3">
      {variants.map(variant => (
        <Heading key={variant} variant={variant} color="accent">
          {variant} heading
        </Heading>
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'heading',
        prop: 'color',
        values: headingPropDefs.color.values,
        code: `export default function Example() {
  const colors = __VALUES__
  return (
    <Flex direction="column" gap="3">
      {colors.map(color => (
        <Heading key={color} size="lg" color={color}>
          {color} heading
        </Heading>
      ))}
    </Flex>
  )
}`,
      }),
    ],
  },
  link: {
    slug: 'link',
    title: 'Link',
    description: 'Inline and standalone links with underline behavior, responsive sizing, and semantic colors.',
    sourcePath: 'packages/ui/src/typography/link/Link.tsx',
    propDefs: withMarginPropDocs(createDocsPropDefs(linkPropDefs)),
    overviewCode: `export default function Example() {
  return (
    <Flex direction="column" gap="3">
      <Link href="#default">Default link</Link>
      <Link href="#accent" color="accent">Accent link</Link>
      <Link href="#always" underline="always">Always underlined link</Link>
    </Flex>
  )
}`,
    runtimeScope: { Flex, Link },
    sections: [
      createEnumShowcaseSection({
        componentLabel: 'link',
        prop: 'size',
        values: linkPropDefs.size.values,
        code: `export default function Example() {
  const sizes = __VALUES__
  return (
    <Flex direction="column" gap="3">
      {sizes.map(size => (
        <Link key={size} href={'#' + size} size={size}>Link size {size}</Link>
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'link',
        prop: 'underline',
        values: linkPropDefs.underline.values,
        code: `export default function Example() {
  const values = __VALUES__
  return (
    <Flex direction="column" gap="3">
      {values.map(value => (
        <Link key={value} href={'#' + value} underline={value}>
          underline = {value}
        </Link>
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'link',
        prop: 'color',
        values: linkPropDefs.color.values,
        code: `export default function Example() {
  const colors = __VALUES__
  return (
    <Flex direction="column" gap="3">
      {colors.map(color => (
        <Link key={color} href={'#' + color} color={color}>
          {color} link
        </Link>
      ))}
    </Flex>
  )
}`,
      }),
    ],
  },
  kbd: {
    slug: 'kbd',
    title: 'Kbd',
    description: 'Keyboard shortcut token for inline command hints, help text, and shortcuts menus.',
    sourcePath: 'packages/ui/src/typography/kbd/Kbd.tsx',
    propDefs: createDocsPropDefs(kbdPropDefs),
    overviewCode: `export default function Example() {
  return (
    <Flex align="center" gap="3" wrap="wrap">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <Kbd variant="soft">⇧</Kbd>
      <Kbd variant="soft">P</Kbd>
    </Flex>
  )
}`,
    runtimeScope: { Flex, Kbd },
    sections: [
      createEnumShowcaseSection({
        componentLabel: 'kbd',
        prop: 'size',
        values: kbdPropDefs.size.values,
        code: `export default function Example() {
  const sizes = __VALUES__
  return (
    <Flex align="center" gap="3" wrap="wrap">
      {sizes.map(size => (
        <Kbd key={size} size={size}>{size.toUpperCase()}</Kbd>
      ))}
    </Flex>
  )
}`,
      }),
      createEnumShowcaseSection({
        componentLabel: 'kbd',
        prop: 'variant',
        values: kbdPropDefs.variant.values,
        code: `export default function Example() {
  const variants = __VALUES__
  return (
    <Flex align="center" gap="3" wrap="wrap">
      {variants.map(variant => (
        <Kbd key={variant} variant={variant}>{variant}</Kbd>
      ))}
    </Flex>
  )
}`,
      }),
    ],
  },
} as const satisfies Record<string, ElementDocsEntry>
