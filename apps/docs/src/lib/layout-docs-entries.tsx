'use client'

import {
  aspectRatioDocsPropDefs,
  boxDocsPropDefs,
  containerDocsPropDefs,
  flexDocsPropDefs,
  gridDocsPropDefs,
  sectionDocsPropDefs,
  sidebarDocsPropDefs,
} from '@incmix/ui/editor/docs'
import { Button, Card } from '@incmix/ui/elements'
import { AspectRatio, Box, Container, Flex, Grid, Masonry, Section, Sidebar } from '@incmix/ui/layouts'
import { masonryPropDefs } from '@incmix/ui/props'
import { Text } from '@incmix/ui/typography/text/Text'
import type { ElementDocsEntry } from './element-docs-types'

export const layoutDocsEntries: Record<string, ElementDocsEntry> = {
  masonry: {
    slug: 'masonry',
    title: 'Masonry',
    description: 'Virtualized masonry grid for uneven card heights with automatic column distribution.',
    sourcePath: 'packages/ui/src/layouts/masonry/Masonry.tsx',
    propDefs: masonryPropDefs,
    overviewCode: `export default function Example() {
  return (
    <Box style={{ maxWidth: 700, height: 400, overflow: 'auto' }}>
      <Masonry.Root columnWidth={200} gap={12}>
        {Array.from({ length: 12 }, (_, i) => (
          <Masonry.Item key={i}>
            <Box
              height={['120px', '180px', '240px', '160px', '200px', '140px'][i % 6]}
              className="rounded-xl"
              style={{
                background: ['var(--red-9)', 'var(--blue-9)', 'var(--green-9)', 'var(--amber-9)', 'var(--purple-9)', 'var(--pink-9)'][i % 6],
              }}
            />
          </Masonry.Item>
        ))}
      </Masonry.Root>
    </Box>
  )
}`,
    runtimeScope: { Box, Card, Masonry, Text },
    sections: [
      {
        id: 'fixed-columns',
        title: 'Fixed Columns',
        description: 'Set columnCount when the column grid should stay stable instead of adapting from a target width.',
        code: `export default function Example() {
  return (
    <Box style={{ maxWidth: 700, height: 400, overflow: 'auto' }}>
      <Masonry.Root columnCount={3} gap={16}>
        {Array.from({ length: 9 }, (_, i) => (
          <Masonry.Item key={i}>
            <Card.Root>
              <Card.Header>
                <Card.Title>Card {i + 1}</Card.Title>
              </Card.Header>
              <Card.Content>
                <Text size="sm">
                  {'Content of varying length. '.repeat((i % 3) + 1)}
                </Text>
              </Card.Content>
            </Card.Root>
          </Masonry.Item>
        ))}
      </Masonry.Root>
    </Box>
  )
}`,
      },
      {
        id: 'linear-ordering',
        title: 'Linear Ordering',
        description:
          'Enable linear when preserving visual item order matters more than always filling the shortest column first.',
        code: `export default function Example() {
  return (
    <Box style={{ maxWidth: 700, height: 400, overflow: 'auto' }}>
      <Masonry.Root columnWidth={200} gap={12} linear>
        {Array.from({ length: 12 }, (_, i) => (
          <Masonry.Item key={i}>
            <Box
              height={['120px', '200px', '160px', '240px', '140px', '180px'][i % 6]}
              className="rounded-xl"
              style={{
                background: ['var(--blue-9)', 'var(--green-9)', 'var(--amber-9)', 'var(--purple-9)', 'var(--red-9)', 'var(--cyan-9)'][i % 6],
              }}
            />
          </Masonry.Item>
        ))}
      </Masonry.Root>
    </Box>
  )
}`,
      },
    ],
  },
  'aspect-ratio': {
    slug: 'aspect-ratio',
    title: 'Aspect Ratio',
    description: 'Constrain media and containers to predictable ratios without hand-authored sizing wrappers.',
    sourcePath: 'packages/ui/src/layouts/aspect-ratio/AspectRatio.tsx',
    propDefs: aspectRatioDocsPropDefs,
    overviewCode: `export default function Example() {
  return (
    <AspectRatio ratio="16/9" className="w-[360px] overflow-hidden rounded-lg border">
      <Box className="h-full w-full bg-muted/30" />
    </AspectRatio>
  )
}`,
    runtimeScope: { AspectRatio, Box },
    sections: [
      {
        id: 'ratios',
        title: 'Ratios',
        description: 'Use the predefined ratio values for common media and embed surfaces.',
        code: `export default function Example() {
  return (
    <Grid columns="2" gap="3" style={{ width: 420 }}>
      <AspectRatio ratio="1/1" className="overflow-hidden rounded-md border">
        <Box className="h-full w-full bg-muted/30" />
      </AspectRatio>
      <AspectRatio ratio="4/3" className="overflow-hidden rounded-md border">
        <Box className="h-full w-full bg-muted/30" />
      </AspectRatio>
      <AspectRatio ratio="16/9" className="overflow-hidden rounded-md border">
        <Box className="h-full w-full bg-muted/30" />
      </AspectRatio>
      <AspectRatio ratio="21/9" className="overflow-hidden rounded-md border">
        <Box className="h-full w-full bg-muted/30" />
      </AspectRatio>
    </Grid>
  )
}`,
      },
      {
        id: 'custom-ratio',
        title: 'Custom Ratio',
        description: 'Use customRatio when the surface does not fit one of the predefined ratio options.',
        code: `export default function Example() {
  return (
    <AspectRatio customRatio={2.39} className="w-[420px] overflow-hidden rounded-lg border">
      <Box className="h-full w-full bg-muted/30" />
    </AspectRatio>
  )
}`,
      },
    ],
  },
  box: {
    slug: 'box',
    title: 'Box',
    description: 'Foundational layout primitive for spacing, sizing, positioning, and display props.',
    sourcePath: 'packages/ui/src/layouts/box/Box.tsx',
    propDefs: boxDocsPropDefs,
    overviewCode: `export default function Example() {
  return (
    <Box p="4" bg="sky-3" borderColor="sky-7" className="rounded-2xl">
      <Box p="3" bg="light-background" borderColor="sky-8" className="rounded-xl">
        <Text size="sm" color="sky-11">Box content</Text>
      </Box>
    </Box>
  )
}`,
    runtimeScope: { Box, Container, Text },
    sections: [
      {
        id: 'responsive',
        title: 'Responsive',
        description: 'Responsive props accept breakpoint objects, so a single Box can adapt its spacing and sizing.',
        code: `export default function Example() {
  return (
    <Box p={{ initial: '3', md: '5' }} bg="sky-3" borderColor="sky-7" className="rounded-2xl">
      <Box p="3" bg="light-background" borderColor="sky-8" className="rounded-xl">
        <Text size="sm" color="sky-11">Box content</Text>
      </Box>
    </Box>
  )
}`,
      },
      {
        id: 'container-queries',
        title: 'Container Queries',
        description:
          'Box is a neutral wrapper, so it is useful for sizing or framing a region around components that respond to their container.',
        code: `export default function Example() {
  return (
    <Box width="18rem" p="4" bg="sky-3" borderColor="sky-7">
      <Container size="4">
        <Box height="4rem" bg="light-background" borderColor="sky-8" className="rounded-xl" />
      </Container>
    </Box>
  )
}`,
      },
    ],
  },
  container: {
    slug: 'container',
    title: 'Container',
    description: 'Centered max-width wrapper with responsive sizing and alignment controls.',
    sourcePath: 'packages/ui/src/layouts/container/Container.tsx',
    propDefs: containerDocsPropDefs,
    overviewCode: `export default function Example() {
  return (
    <Box px="4" py="6" bg="green-3" borderColor="indigo-7">
      <Container size="1">
        <Box height="6rem" bg="indigo-2" borderColor="indigo-8" />
      </Container>
    </Box>
  )
}`,
    runtimeScope: { Box, Container, Flex, Text },
    sections: [
      {
        id: 'alignment',
        title: 'Alignment',
        description: 'Change align when the inner max-width surface should pin left or right instead of centering.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="4">
      {(['left', 'center', 'right'] as const).map(align => (
        <Box key={align} px="4" py="4" bg="indigo-3" borderColor="indigo-7" className="rounded-2xl">
          <Text mb="2" size="xs" weight="medium" color="indigo-11">
            align=&quot;{align}&quot;
          </Text>
          <Container size="2" align={align}>
            <Box
              width="10rem"
              height="5rem"
              bg="indigo-2"
              borderColor="indigo-8"
            />
          </Container>
        </Box>
      ))}
    </Flex>
  )
}`,
      },
      {
        id: 'container-queries',
        title: 'Container Queries',
        description:
          'Container establishes an inline-size container, so its internal spacing and width behavior can adapt to the available region instead of the viewport.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="4">
      <Box width="100%" maxWidth="80rem" px="4" py="4" bg="indigo-3" borderColor="indigo-7">
        <Container size="1">
          <Box width="100%" height="4rem" bg="indigo-2" borderColor="indigo-8" />
        </Container>
      </Box>
      <Box width="100%" maxWidth="80rem" px="4" py="4" bg="indigo-3" borderColor="indigo-7">
        <Container size="4">
          <Box width="100%" height="4rem" bg="indigo-2" borderColor="indigo-8" />
        </Container>
      </Box>
    </Flex>
  )
}`,
      },
    ],
  },
  flex: {
    slug: 'flex',
    title: 'Flex',
    description: 'Flexbox composition primitive for rows, columns, alignment, and shared gap control.',
    sourcePath: 'packages/ui/src/layouts/flex/Flex.tsx',
    propDefs: flexDocsPropDefs,
    overviewCode: `export default function Example() {
  return (
    <Flex gap="3">
      <Box width="4rem" height="4rem" bg="teal-3" borderColor="teal-7" className="rounded-xl" />
      <Box width="4rem" height="4rem" bg="cyan-3" borderColor="cyan-7" className="rounded-xl" />
      <Box width="4rem" height="4rem" bg="emerald-3" borderColor="emerald-7" className="rounded-xl" />
    </Flex>
  )
}`,
    runtimeScope: { Box, Flex },
    sections: [
      {
        id: 'responsive-direction',
        title: 'Responsive Direction',
        description: 'Switch between stacked and horizontal layouts with responsive direction values.',
        code: `export default function Example() {
  return (
    <Flex direction={{ initial: 'column', md: 'row' }} gap="3">
      <Box height="4rem" bg="teal-3" borderColor="teal-7" className="rounded-xl" />
      <Box height="4rem" bg="cyan-3" borderColor="cyan-7" className="rounded-xl" />
      <Box height="4rem" bg="emerald-3" borderColor="emerald-7" className="rounded-xl" />
    </Flex>
  )
}`,
      },
      {
        id: 'split-gap',
        title: 'Split Gap',
        description: 'Use gapX and gapY when wrapped rows need different horizontal and vertical spacing.',
        code: `export default function Example() {
  return (
    <Flex wrap="wrap" gapX="5" gapY="2" p="3" className="rounded-2xl border border-border/70 bg-muted/30" style={{ width: 320 }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Box
          key={index}
          width="5rem"
          height="3rem"
          bg="teal-3"
          borderColor="teal-7"
          className="rounded-xl"
        />
      ))}
    </Flex>
  )
}`,
      },
    ],
  },
  grid: {
    slug: 'grid',
    title: 'Grid',
    description: 'Structured two-dimensional layout primitive for repeated cells and responsive track definitions.',
    sourcePath: 'packages/ui/src/layouts/grid/Grid.tsx',
    propDefs: gridDocsPropDefs,
    overviewCode: `export default function Example() {
  return (
    <Grid columns="3" gap="3" width="auto">
      {Array.from({ length: 6 }).map((_, index) => (
        <Box
          key={index}
          height="4rem"
          bg="violet-3"
          borderColor="violet-7"
          className="rounded-xl"
        />
      ))}
    </Grid>
  )
}`,
    runtimeScope: { Box, Grid },
    sections: [
      {
        id: 'responsive-columns',
        title: 'Responsive Columns',
        description: 'Columns accepts breakpoint objects, so dense grids can collapse gracefully on smaller surfaces.',
        code: `export default function Example() {
  return (
    <Grid columns={{ initial: '1', md: '2' }} gap="3" width="auto">
      <Box height="4rem" bg="violet-3" borderColor="violet-7" />
      <Box height="4rem" bg="fuchsia-3" borderColor="fuchsia-7" />
      <Box height="4rem" bg="indigo-3" borderColor="indigo-7" />
      <Box height="4rem" bg="sky-3" borderColor="sky-7" />
    </Grid>
  )
}`,
      },
      {
        id: 'split-gap',
        title: 'Split Gap',
        description: 'Use gapX and gapY to control column and row spacing independently.',
        code: `export default function Example() {
  return (
    <Grid columns="3" gapX="5" gapY="2" p="3" className="rounded-2xl border border-border/70 bg-muted/30" width="auto">
      {Array.from({ length: 6 }).map((_, index) => (
        <Box
          key={index}
          height="4rem"
          bg="violet-3"
          borderColor="violet-7"
          className="rounded-xl"
        />
      ))}
    </Grid>
  )
}`,
      },
    ],
  },
  section: {
    slug: 'section',
    title: 'Section',
    description: 'Vertical rhythm wrapper for page sections and stacked documentation blocks.',
    sourcePath: 'packages/ui/src/layouts/section/Section.tsx',
    propDefs: sectionDocsPropDefs,
    overviewCode: `export default function Example() {
  return (
    <Section size="2" className="rounded-2xl border border-border/70 bg-muted/30">
      <Box className="h-16 rounded-xl border border-border/70 bg-background" />
    </Section>
  )
}`,
    runtimeScope: { Box, Section },
    sections: [
      {
        id: 'responsive-size',
        title: 'Responsive Size',
        description:
          'Use responsive size values when sections need tighter spacing on small screens and wider rhythm on larger ones.',
        code: `export default function Example() {
  return (
    <Section size={{ initial: '1', md: '3' }} className="rounded-2xl border border-border/70 bg-muted/30">
      <Box className="h-16 rounded-xl border border-border/70 bg-background" />
    </Section>
  )
}`,
      },
      {
        id: 'padding-overrides',
        title: 'Padding Overrides',
        description:
          'Explicit padding props override the size preset when a section needs custom top and bottom rhythm.',
        code: `export default function Example() {
  return (
    <Section pt="2" pb="8" className="rounded-2xl border border-border/70 bg-muted/30">
      <Box className="h-16 rounded-xl border border-border/70 bg-background" />
    </Section>
  )
}`,
      },
    ],
  },
  sidebar: {
    slug: 'sidebar',
    title: 'Sidebar',
    description: 'Responsive navigation shell with desktop collapse modes and mobile sheet behavior.',
    sourcePath: 'packages/ui/src/layouts/sidebar/Sidebar.tsx',
    propDefs: sidebarDocsPropDefs,
    overviewCode: `export default function Example() {
  return (
    <Sidebar.Provider defaultOpen>
      <div className="flex h-[360px] w-[720px] overflow-hidden rounded-2xl border border-border/70">
        <Sidebar.Root variant="surface" collapsible="offcanvas">
          <Sidebar.Content>
            <Sidebar.Group anchor="top">
              <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton isActive>Dashboard</Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Rail />
        </Sidebar.Root>

        <Sidebar.Inset>
          <Box className="p-4">
            <Sidebar.Trigger />
          </Box>
        </Sidebar.Inset>
      </div>
    </Sidebar.Provider>
  )
}`,
    runtimeScope: { Box, Button, Sidebar },
    sections: [
      {
        id: 'variants-and-collapse',
        title: 'Variants And Collapse',
        description: 'Use variant, collapsible, and color together to tune panel treatment and desktop behavior.',
        code: `export default function Example() {
  return (
    <Sidebar.Provider defaultOpen>
      <div className="flex h-[280px] w-[640px] overflow-hidden rounded-2xl border border-border/70">
        <Sidebar.Root variant="solid" collapsible="icon" color="slate">
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton>Inbox</Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Rail />
        </Sidebar.Root>
        <Sidebar.Inset>
          <Box className="p-4">
            <Sidebar.Trigger />
          </Box>
        </Sidebar.Inset>
      </div>
    </Sidebar.Provider>
  )
}`,
      },
      {
        id: 'menu-buttons',
        title: 'Menu Buttons',
        description:
          'MenuButton and MenuSubButton expose their own size and variant controls for dense navigation surfaces.',
        code: `export default function Example() {
  return (
    <Sidebar.Provider defaultOpen>
      <div className="flex h-[280px] w-[520px] overflow-hidden rounded-2xl border border-border/70">
        <Sidebar.Root>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton variant="outline" size="sm">Search</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton isActive>Inbox</Sidebar.MenuButton>
                  <Sidebar.MenuSub>
                    <Sidebar.MenuSubItem>
                      <Sidebar.MenuSubButton size="sm">Unread</Sidebar.MenuSubButton>
                    </Sidebar.MenuSubItem>
                    <Sidebar.MenuSubItem>
                      <Sidebar.MenuSubButton size="sm">Starred</Sidebar.MenuSubButton>
                    </Sidebar.MenuSubItem>
                  </Sidebar.MenuSub>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Rail />
        </Sidebar.Root>
        <Sidebar.Inset>
          <Box className="p-4">
            <Button variant="outline" size="sm">Content area</Button>
          </Box>
        </Sidebar.Inset>
      </div>
    </Sidebar.Provider>
  )
}`,
      },
    ],
  },
} as const satisfies Record<string, ElementDocsEntry>
