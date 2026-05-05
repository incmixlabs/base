'use client'

import { avatarCatalogEntry, avatarGroupCatalogEntry, avatarPieCatalogEntry } from '@bwalkt/ui/editor/catalog'
import {
  avatarPropDefs as avatarElementPropDefs,
  avatarGroupPropDefs as avatarGroupElementPropDefs,
} from '@bwalkt/ui/elements/props'
import type { ElementDocsEntry } from '../element-docs-types'
import { createEnumShowcaseSection, toEnumArrayLiteral } from '../element-docs-types'

export const avatarEntries = {
  avatar: {
    ...avatarCatalogEntry,
    sections: [
      createEnumShowcaseSection({
        componentLabel: 'avatar',
        prop: 'size',
        values: avatarElementPropDefs.size.values,
        code: `export default function Example() {
  const sizes = __VALUES__
  return (
    <Flex align="end" gap="3">
      {sizes.map(size => (
        <Avatar key={size} size={size} name="Ava Chen" />
      ))}
    </Flex>
  )
}`,
      }),
      {
        id: 'color-modes',
        title: 'Color Modes',
        description: 'AvatarProvider switches the fallback palette for initials between soft and solid modes.',
        code: `export default function Example() {
  const sizes = ${toEnumArrayLiteral(avatarElementPropDefs.size.values)}
  const variants = ${toEnumArrayLiteral(avatarGroupElementPropDefs.variant.values)}

  return (
    <Flex direction="column" gap="4">
      <Flex gap="3" className="pl-11">
        {variants.map(v => (
          <Text key={v} size="sm" className="w-[12rem] font-medium">
            {v}
          </Text>
        ))}
      </Flex>
      {sizes.map(size => (
        <Flex key={size} align="center" gap="3">
          <Text size="sm" className="w-8 text-muted-foreground">
            {size}
          </Text>
          {variants.map(v => (
            <AvatarProvider key={v} colorMode={v}>
              <Flex gap="3" align="center" className="w-[12rem]">
                <Avatar size={size} name="Ava Chen" />
                <Avatar size={size} name="Noah Diaz" />
                <Avatar size={size} name="Mia Reed" />
              </Flex>
            </AvatarProvider>
          ))}
        </Flex>
      ))}
    </Flex>
  )
}`,
      },
      {
        id: 'deterministic-colors',
        title: 'Deterministic Colors',
        description: 'Provide id alongside name when identical labels should hash to different fallback hues.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="3">
      <Flex gap="3" align="center">
        <Avatar id="workspace-1" name="Alex Kim" />
        <Text size="sm">Workspace Alex</Text>
      </Flex>
      <Flex gap="3" align="center">
        <Avatar id="user-1" name="Alex Kim" />
        <Text size="sm">User Alex</Text>
      </Flex>
    </Flex>
  )
}`,
      },
    ],
  },
  'avatar-group': {
    ...avatarGroupCatalogEntry,
    sections: [
      createEnumShowcaseSection({
        componentLabel: 'avatar group',
        prop: 'layout',
        values: avatarGroupElementPropDefs.layout.values,
        code: `export default function Example() {
  const values = __VALUES__
  return (
    <Flex direction="column" gap="4" align="start">
      {values.map(value => (
        <AvatarGroup key={value} size="md" layout={value}>
          <Avatar name="Ava Chen" />
          <Avatar name="Noah Diaz" />
          <Avatar name="Mia Reed" />
          <Avatar name="Evan Cole" />
        </AvatarGroup>
      ))}
    </Flex>
  )
}`,
      }),
      {
        id: 'overflow',
        title: 'Overflow',
        description: 'Use max to cap visible avatars and collapse the rest into an overflow indicator.',
        code: `export default function Example() {
  return (
    <AvatarGroup size="md" max={3} layout="spread">
      <Avatar name="Ava Chen" />
      <Avatar name="Noah Diaz" />
      <Avatar name="Mia Reed" />
      <Avatar name="Evan Cole" />
      <Avatar name="Liam Park" />
    </AvatarGroup>
  )
}`,
      },
      {
        id: 'sizes',
        title: 'Sizes',
        description: 'Stacked avatar groups scale from xs through 2x in both soft and solid avatar variants.',
        code: `export default function Example() {
  const variants = ['soft', 'solid'] as const

  return (
    <Flex direction="column" gap="4" align="start">
      <Flex gap="10" className="pl-16">
        {variants.map(variant => (
          <Text key={variant} size="sm" className="w-72 font-medium capitalize">
            {variant}
          </Text>
        ))}
      </Flex>
      {(['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const).map(size => {
        return (
          <Flex key={size} align="center" gap="4">
            <Text size="sm" className="w-12 text-muted-foreground">
              {size}
            </Text>
            {variants.map(variant => (
              <Flex key={variant} className="w-72">
                <AvatarGroup size={size} layout="stack" max={4} variant={variant}>
                  <Avatar name="Ava Chen" />
                  <Avatar name="Noah Diaz" />
                  <Avatar name="Mia Reed" />
                  <Avatar name="Evan Cole" />
                  <Avatar name="Liam Park" />
                </AvatarGroup>
              </Flex>
            ))}
          </Flex>
        )
      })}
    </Flex>
  )
}`,
      },
      {
        id: 'hover-card',
        title: 'Hover Card',
        description:
          'Enable a group-level hover card to reveal the full list without depending on overlap hit targets.',
        code: `export default function Example() {
  return (
    <AvatarGroup
      size="md"
      max={3}
      layout="spread"
      hoverCard={{ title: 'Reviewers' }}
    >
      <Avatar name="Ava Chen" description="ava@example.com" />
      <Avatar name="Noah Diaz" description="noah@example.com" />
      <Avatar name="Mia Reed" description="mia@example.com" />
      <Avatar name="Evan Cole" description="evan@example.com" />
      <Avatar name="Liam Park" description="liam@example.com" />
    </AvatarGroup>
  )
}`,
      },
    ],
  },
  'avatar-pie': {
    ...avatarPieCatalogEntry,
    sections: [
      {
        id: 'two-up',
        title: 'Two Up',
        description: 'Two avatars split the circle into a two-slice composition.',
        code: `export default function Example() {
  return (
    <AvatarPie size="lg">
      <Avatar name="Maya" />
      <Avatar name="Nora" />
    </AvatarPie>
  )
}`,
      },
      {
        id: 'overflow-counts',
        title: 'Overflow Counts',
        description: 'Counts above three show the first two avatars plus an overflow label for the remainder.',
        code: `export default function Example() {
  return (
    <Flex align="center" gap="6">
      {[4, 5, 11].map(count => (
        <div key={count} className="flex flex-col items-center gap-2">
          <AvatarPie size="lg">
            {Array.from({ length: count }).map((_, index) => (
              <Avatar key={index} name={["Maya", "Nora", "Omar", "Zoe", "Liam"][index % 5]} />
            ))}
          </AvatarPie>
          <span className="text-xs text-muted-foreground">{count} avatars</span>
        </div>
      ))}
    </Flex>
  )
}`,
      },
      {
        id: 'hover-card-list',
        title: 'Hover Card List',
        description: 'Use the built-in hover card to expose the full participant list behind the compact pie.',
        code: `export default function Example() {
  return (
    <AvatarPie size="lg" hoverCard={{ title: "Selected people" }}>
      <Avatar name="Maya Lane" description="maya@example.com" />
      <Avatar name="Nora Bell" description="nora@example.com" />
      <Avatar name="Omar Diaz" description="omar@example.com" />
      <Avatar name="Zoe Park" description="zoe@example.com" />
    </AvatarPie>
  )
}`,
      },
    ],
  },
} as const satisfies Record<string, ElementDocsEntry>
