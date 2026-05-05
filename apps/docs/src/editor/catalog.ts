import {
  COMPONENT_REGISTRY_ENTRY_KIND,
  COMPONENT_REGISTRY_SCHEMA_VERSION,
  type ComponentRegistryDiscoveryMetadata,
  type ComponentRegistryEntry,
} from '@incmix/core'
import { barChartPropDefs } from '@/charts/bar-chart/props'
import { mapChartProjections } from '@/charts/map-chart/props'
import { textPropDefs } from '@/typography/text/text.props'
import {
  accordionPropDefs,
  avatarGroupPropDefs,
  avatarPiePropDefs,
  avatarPropDefs,
  badgePropDefs,
  barChartPropDefs as barChartCatalogPropDefs,
  boxDocsPropDefs,
  buttonPropDefs,
  calloutPropDefs,
  cardPropDefs,
  compactHorizontalChartPropDefs as compactHorizontalChartCatalogPropDefs,
  containerDocsPropDefs,
  createDocsPropDefs,
  dataListPropDefs,
  flexDocsPropDefs as flexCatalogPropDefs,
  gradientBackgroundPropDefs,
  gridDocsPropDefs as gridCatalogPropDefs,
  iconButtonPropDefs,
  iconPropDefs,
  imagePropDefs,
  insetPropDefs,
  mapChartPropDefs as mapChartCatalogPropDefs,
  type PropDef,
  segmentedControlPropDefs,
  sliderPropDefs,
  spinnerPropDefs,
  tabsPropDefs,
} from './prop-defs'

export type CatalogFamily = 'elements' | 'form' | 'layouts' | 'table' | 'blocks' | 'charts' | 'composites'

export type CatalogEntry = {
  schemaVersion: ComponentRegistryEntry['schemaVersion']
  kind: ComponentRegistryEntry['kind']
  id: ComponentRegistryEntry['id']
  slug: string
  title: string
  description: string
  family: CatalogFamily
  category: string
  runtime: ComponentRegistryEntry['runtime']
  discovery: ComponentRegistryEntry['discovery']
  ownership: ComponentRegistryEntry['ownership']
  persistence: ComponentRegistryEntry['persistence']
  meta?: ComponentRegistryEntry['meta']
  sourcePath: string
  propDefs: PropDef[]
  overviewCode: string
  runtimeScope?: Record<string, unknown>
}

export type CatalogNavItem = {
  slug: string
  title: string
  family: CatalogFamily
  category: string
}

type CatalogEntryConfig = {
  slug: string
  title: string
  description: string
  family: CatalogFamily
  category: string
  sourcePath: string
  componentName: string
  propDefs: readonly PropDef[]
  overviewCode: string
  discovery?: CatalogEntryDiscoveryConfig
  meta?: ComponentRegistryEntry['meta']
}

type CatalogRuntimeScopeLoader = () => Promise<Record<string, unknown>>

type CatalogEntryDiscoveryConfig = Omit<
  Partial<ComponentRegistryDiscoveryMetadata>,
  'hierarchy' | 'keywords' | 'tags'
> & {
  hierarchy?: readonly string[]
  keywords?: readonly string[]
  tags?: readonly string[]
}

const catalogRuntimeScopeCache = new Map<string, Promise<Record<string, unknown>>>()

const directionalFlexCatalogPropDefs = flexCatalogPropDefs.filter(prop => prop.name !== 'direction')

function titleCaseSegment(value: string): string {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(Boolean))]
}

function toRendererId(family: CatalogFamily) {
  return {
    elements: 'ui.element',
    form: 'ui.form',
    layouts: 'ui.layout',
    table: 'ui.table',
    blocks: 'ui.block',
    charts: 'ui.chart',
    composites: 'ui.composite',
  }[family]
}

function getDiscoveryDefaults(config: CatalogEntryConfig): ComponentRegistryDiscoveryMetadata {
  return {
    summary: config.description,
    group: titleCaseSegment(config.category),
    hierarchy: [config.family, config.category],
    tags: uniqueStrings([config.family, config.category, ...config.slug.split('-')]),
    keywords: uniqueStrings([config.title, config.slug, ...config.title.toLowerCase().split(/\s+/)]),
  }
}

function getDiscoveryMetadata(config: CatalogEntryConfig): ComponentRegistryDiscoveryMetadata {
  const defaults = getDiscoveryDefaults(config)
  const discovery = config.discovery
  if (!discovery) return defaults

  return {
    ...defaults,
    ...discovery,
    hierarchy: discovery.hierarchy ? [...discovery.hierarchy] : defaults.hierarchy,
    tags: discovery.tags ? [...discovery.tags] : defaults.tags,
    keywords: discovery.keywords ? [...discovery.keywords] : defaults.keywords,
  }
}

function createCatalogEntry(config: CatalogEntryConfig): CatalogEntry {
  return {
    schemaVersion: COMPONENT_REGISTRY_SCHEMA_VERSION,
    kind: COMPONENT_REGISTRY_ENTRY_KIND,
    id: `${toRendererId(config.family)}.${config.slug}`,
    slug: config.slug,
    title: config.title,
    description: config.description,
    family: config.family,
    category: config.category,
    runtime: {
      kind: 'known-renderer',
      rendererId: toRendererId(config.family),
      componentName: config.componentName,
    },
    discovery: getDiscoveryMetadata(config),
    ownership: {
      scope: 'public',
      ownerKind: 'system',
      ownerId: 'packages/ui',
    },
    persistence: {
      source: 'code',
      mutable: false,
      scope: 'repository',
      notes:
        'Code-authored catalog seed that documents repository-level persistence semantics without implementing persistence.',
    },
    meta: config.meta,
    sourcePath: config.sourcePath,
    propDefs: [...config.propDefs],
    overviewCode: config.overviewCode,
  }
}

const catalogRuntimeScopeLoaders = {
  accordion: async () => {
    const [{ Accordion }, { Flex }] = await Promise.all([
      import('@/elements/accordion/Accordion'),
      import('@/layouts/flex/Flex'),
    ])
    return { Accordion, Flex }
  },
  avatar: async () => {
    const [{ Avatar }, { AvatarProvider }, { Flex }, { Text }] = await Promise.all([
      import('@/elements/avatar/Avatar'),
      import('@/elements/avatar/avatar.context'),
      import('@/layouts/flex/Flex'),
      import('@/typography/text/Text'),
    ])
    return { Avatar, AvatarProvider, Flex, Text }
  },
  'avatar-group': async () => {
    const [{ Avatar }, { AvatarGroup }, { Flex }, { Text }] = await Promise.all([
      import('@/elements/avatar/Avatar'),
      import('@/elements/avatar/AvatarGroup'),
      import('@/layouts/flex/Flex'),
      import('@/typography/text/Text'),
    ])
    return { Avatar, AvatarGroup, Flex, Text }
  },
  'avatar-pie': async () => {
    const [{ Avatar }, { AvatarPie }, { Flex }] = await Promise.all([
      import('@/elements/avatar/Avatar'),
      import('@/elements/avatar/AvatarPie'),
      import('@/layouts/flex/Flex'),
    ])
    return { Avatar, AvatarPie, Flex }
  },
  badge: async () => {
    const [{ Badge }, { Flex }] = await Promise.all([import('@/elements/badge/Badge'), import('@/layouts/flex/Flex')])
    return { Badge, Flex }
  },
  box: async () => {
    const [{ Box }, { Text }] = await Promise.all([import('@/layouts/box/Box'), import('@/typography/text/Text')])
    return { Box, Text }
  },
  button: async () => {
    const [{ Button }, { Flex }] = await Promise.all([
      import('@/elements/button/Button'),
      import('@/layouts/flex/Flex'),
    ])
    return { Button, Flex }
  },
  callout: async () => {
    const [{ Callout }, { Flex }] = await Promise.all([
      import('@/elements/callout/Callout'),
      import('@/layouts/flex/Flex'),
    ])
    return { Callout, Flex }
  },
  'data-list': async () => {
    const [{ DataList }] = await Promise.all([import('@/elements/data-list/DataList')])
    return { DataList }
  },
  card: async () => {
    const [{ Badge }, { Button }, { Card }] = await Promise.all([
      import('@/elements/badge/Badge'),
      import('@/elements/button/Button'),
      import('@/elements/card/Card'),
    ])
    return { Badge, Button, Card }
  },
  'gradient-background': async () => {
    const [{ GradientBackground }, { Flex }, { Heading }, { Text }] = await Promise.all([
      import('@/elements/gradient-background/GradientBackground'),
      import('@/layouts/flex/Flex'),
      import('@/typography/heading/Heading'),
      import('@/typography/text/Text'),
    ])
    return { Flex, GradientBackground, Heading, Text }
  },
  inset: async () => {
    const [{ Card }, { Inset }] = await Promise.all([import('@/elements/card/Card'), import('@/elements/card/Inset')])
    return { Card, Inset }
  },
  image: async () => {
    const [{ AspectRatio }, { Image }] = await Promise.all([
      import('@/layouts/aspect-ratio/AspectRatio'),
      import('@/elements/image/Image'),
    ])
    return { AspectRatio, Image }
  },
  icon: async () => {
    const [{ Flex }, { Icon }] = await Promise.all([import('@/layouts/flex/Flex'), import('@/elements/button/Icon')])
    return { Flex, Icon }
  },
  'icon-button': async () => {
    const [{ Flex }, { IconButton }] = await Promise.all([
      import('@/layouts/flex/Flex'),
      import('@/elements/button/IconButton'),
    ])
    return { Flex, IconButton }
  },
  spinner: async () => {
    const [{ Flex }, { Spinner }, { Text }] = await Promise.all([
      import('@/layouts/flex/Flex'),
      import('@/elements/spinner/Spinner'),
      import('@/typography/text/Text'),
    ])
    return { Flex, Spinner, Text }
  },
  'segmented-control': async () => {
    const [{ Flex }, { SegmentedControl }] = await Promise.all([
      import('@/layouts/flex/Flex'),
      import('@/elements/tabs/SegmentedControl'),
    ])
    return { Flex, SegmentedControl }
  },
  slider: async () => {
    const [{ Slider }, { Flex }] = await Promise.all([import('@/form/Slider'), import('@/layouts/flex/Flex')])
    return { Slider, Flex }
  },
  tabs: async () => {
    const [{ Tabs }, { Flex }] = await Promise.all([import('@/elements/tabs/Tabs'), import('@/layouts/flex/Flex')])
    return { Tabs, Flex }
  },
  text: async () => {
    const [{ Text }] = await Promise.all([import('@/typography/text/Text')])
    return { Text }
  },
  flex: async () => {
    const [{ Flex }, { Text }] = await Promise.all([import('@/layouts/flex/Flex'), import('@/typography/text/Text')])
    return { Flex, Text }
  },
  container: async () => {
    const [{ Container }, { Text }] = await Promise.all([
      import('@/layouts/container/Container'),
      import('@/typography/text/Text'),
    ])
    return { Container, Text }
  },
  row: async () => {
    const [{ Row }, { Text }] = await Promise.all([import('@/layouts/flex/Flex'), import('@/typography/text/Text')])
    return { Row, Text }
  },
  column: async () => {
    const [{ Column }, { Text }] = await Promise.all([import('@/layouts/flex/Flex'), import('@/typography/text/Text')])
    return { Column, Text }
  },
  grid: async () => {
    const [{ Card }, { Grid }] = await Promise.all([import('@/elements/card/Card'), import('@/layouts/grid/Grid')])
    return { Card, Grid }
  },
  'bar-chart': async () => {
    const [{ BarChart }] = await Promise.all([import('@/charts/bar-chart/BarChart')])
    return { BarChart }
  },
  'compact-horizontal-chart': async () => {
    const [{ CompactHorizontalChart }] = await Promise.all([import('@/charts/compact-horizontal-chart')])
    return { CompactHorizontalChart }
  },
  'map-chart': async () => {
    const [{ MapChart, mapChartProjections, sampleSalesLocations, sampleWorldMapFeatures }] = await Promise.all([
      import('@/charts/map-chart'),
    ])
    return { MapChart, mapChartProjections, sampleSalesLocations, sampleWorldMapFeatures }
  },
} satisfies Record<string, CatalogRuntimeScopeLoader>

const catalogRuntimeScopeLoadersBySlug: Partial<Record<string, CatalogRuntimeScopeLoader>> = catalogRuntimeScopeLoaders

export async function loadCatalogEntryRuntimeScope(entry: Pick<CatalogEntry, 'slug' | 'runtimeScope'>) {
  if (entry.runtimeScope) {
    return entry.runtimeScope
  }

  const loader = catalogRuntimeScopeLoadersBySlug[entry.slug]
  if (!loader) {
    return {}
  }

  const cached = catalogRuntimeScopeCache.get(entry.slug)
  if (cached) {
    return cached
  }

  const pending = loader().catch(error => {
    catalogRuntimeScopeCache.delete(entry.slug)
    throw error
  })
  catalogRuntimeScopeCache.set(entry.slug, pending)
  return pending
}

export function getCatalogEntryRuntimeScopeLoader(entry: Pick<CatalogEntry, 'slug' | 'runtimeScope'>) {
  if (entry.runtimeScope) {
    return (_code: string) => Promise.resolve(entry.runtimeScope ?? {})
  }

  const loader = catalogRuntimeScopeLoadersBySlug[entry.slug]
  return loader ? (_code: string) => loadCatalogEntryRuntimeScope(entry) : undefined
}

export const accordionCatalogEntry = createCatalogEntry({
  slug: 'accordion',
  title: 'Accordion',
  description: 'Expandable sections for FAQs, detail panels, and progressive disclosure.',
  family: 'elements',
  category: 'controls',
  sourcePath: 'packages/ui/src/elements/accordion/Accordion.tsx',
  componentName: 'Accordion',
  propDefs: accordionPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Accordion.Root defaultValue={['item-1']} className="w-[420px]">
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Release notes</Accordion.Trigger>
        <Accordion.Content>Accordion reveals supporting detail on demand.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}`,
})

export const avatarCatalogEntry = createCatalogEntry({
  slug: 'avatar',
  title: 'Avatar',
  description:
    'Avatar displays a user image with automatic fallback content and deterministic initials-based color handling.',
  family: 'elements',
  category: 'media',
  sourcePath: 'packages/ui/src/elements/avatar/Avatar.tsx',
  componentName: 'Avatar',
  propDefs: avatarPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Flex gap="3" align="center">
      <Avatar src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face" name="Jordan Lee" />
      <Avatar name="Ava Chen" />
      <Avatar />
    </Flex>
  )
}`,
})

export const avatarGroupCatalogEntry = createCatalogEntry({
  slug: 'avatar-group',
  title: 'Avatar Group',
  description: 'Avatar Group arranges multiple avatars in a stack or spread layout and can collapse overflow into +N.',
  family: 'elements',
  category: 'media',
  sourcePath: 'packages/ui/src/elements/avatar/AvatarGroup.tsx',
  componentName: 'AvatarGroup',
  propDefs: avatarGroupPropDefs,
  overviewCode: `export default function Example() {
  return (
    <AvatarGroup size="md" max={4} layout="spread">
      <Avatar name="Ava Chen" />
      <Avatar name="Noah Diaz" />
      <Avatar name="Mia Reed" />
      <Avatar name="Evan Cole" />
      <Avatar name="Liam Park" />
    </AvatarGroup>
  )
}`,
})

export const avatarPieCatalogEntry = createCatalogEntry({
  slug: 'avatar-pie',
  title: 'AvatarPie',
  description:
    'AvatarPie composes up to three visible slices in a circular surface and collapses larger sets into an overflow slice.',
  family: 'elements',
  category: 'media',
  sourcePath: 'packages/ui/src/elements/avatar/AvatarPie.tsx',
  componentName: 'AvatarPie',
  propDefs: avatarPiePropDefs,
  overviewCode: `export default function Example() {
  return (
    <AvatarPie size="lg">
      <Avatar name="Maya Lane" />
      <Avatar name="Nora Bell" />
      <Avatar name="Omar Diaz" />
      <Avatar name="Zoe Park" />
    </AvatarPie>
  )
}`,
})

export const badgeCatalogEntry = createCatalogEntry({
  slug: 'badge',
  title: 'Badge',
  description: 'Compact labels for status, metadata, and lightweight ownership cues.',
  family: 'elements',
  category: 'feedback',
  sourcePath: 'packages/ui/src/elements/badge/Badge.tsx',
  componentName: 'Badge',
  propDefs: badgePropDefs,
  overviewCode: `<Flex wrap="wrap" align="center" gap="3">
  <Badge variant="soft" color="success">Shipped</Badge>
  <Badge variant="surface" color="warning">Needs review</Badge>
  <Badge variant="outline" color="info">Beta</Badge>
</Flex>`,
})

export const boxCatalogEntry = createCatalogEntry({
  slug: 'box',
  title: 'Box',
  description: 'Low-level layout surface for token-aware background, text color, display, and spacing.',
  family: 'layouts',
  category: 'composition',
  sourcePath: 'packages/ui/src/layouts/box/Box.tsx',
  componentName: 'Box',
  propDefs: boxDocsPropDefs,
  overviewCode: `<Box color="info" variant="soft" px="4" py="3">
  <Text size="sm" weight="bold">Box provides token-aware surface styling.</Text>
</Box>`,
})

export const buttonCatalogEntry = createCatalogEntry({
  slug: 'button',
  title: 'Button',
  description: 'Primary call-to-action button with token-driven variants, sizing, and loading states.',
  family: 'elements',
  category: 'actions',
  sourcePath: 'packages/ui/src/elements/button/Button.tsx',
  componentName: 'Button',
  propDefs: buttonPropDefs,
  overviewCode: `<Flex gap="3" wrap="wrap">
  <Button>Save changes</Button>
  <Button variant="soft">Preview</Button>
  <Button variant="outline">Invite</Button>
</Flex>`,
})

export const calloutCatalogEntry = createCatalogEntry({
  slug: 'callout',
  title: 'Callout',
  description: 'Inline messaging surface for success, warning, and system guidance.',
  family: 'elements',
  category: 'feedback',
  sourcePath: 'packages/ui/src/elements/callout/Callout.tsx',
  componentName: 'Callout',
  propDefs: calloutPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Callout.Root color="info" className="max-w-xl">
      <Callout.Icon name="info" />
      <Callout.Text>
        Scheduled maintenance starts at 02:00 UTC. Expect write operations to pause briefly.
      </Callout.Text>
    </Callout.Root>
  )
}`,
})

export const dataListCatalogEntry = createCatalogEntry({
  slug: 'data-list',
  title: 'Data List',
  description: 'Structured label-value pairs for metadata, system facts, and compact record summaries.',
  family: 'elements',
  category: 'data-display',
  sourcePath: 'packages/ui/src/elements/data-list/DataList.tsx',
  componentName: 'DataList',
  propDefs: dataListPropDefs.Root,
  overviewCode: `export default function Example() {
  return (
    <DataList.Root size="sm" className="w-[420px]">
      <DataList.Item>
        <DataList.Label>Status</DataList.Label>
        <DataList.Value>Healthy</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Region</DataList.Label>
        <DataList.Value>us-west-2</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Version</DataList.Label>
        <DataList.Value>v3.12.4</DataList.Value>
      </DataList.Item>
    </DataList.Root>
  )
}`,
})

export const cardCatalogEntry = createCatalogEntry({
  slug: 'card',
  title: 'Card',
  description: 'Composable surface for grouped content, actions, and lightweight summaries.',
  family: 'elements',
  category: 'surfaces',
  sourcePath: 'packages/ui/src/elements/card/Card.tsx',
  componentName: 'Card',
  propDefs: cardPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Card.Root layout="column" gap="3" className="w-[320px]">
      <Card.Header>
        <Card.Title>Project update</Card.Title>
        <Card.Description>Surface-backed content grouping.</Card.Description>
      </Card.Header>
      <Card.Content>
        <Card.Description>Card keeps related content and actions together.</Card.Description>
      </Card.Content>
    </Card.Root>
  )
}`,
})

export const gradientBackgroundCatalogEntry = createCatalogEntry({
  slug: 'gradient-background',
  title: 'Gradient Background',
  description:
    'Animated gradient surface that can render as a native div, Box, Card, or Container while preserving those component props.',
  family: 'elements',
  category: 'surfaces',
  sourcePath: 'packages/ui/src/elements/gradient-background/GradientBackground.tsx',
  componentName: 'GradientBackground',
  propDefs: gradientBackgroundPropDefs,
  overviewCode: `<GradientBackground
  as="Box"
  preset="tropical"
  radius="lg"
  width="420px"
  p="6"
  minHeight="10rem"
  layout="column"
  layoutProps={{ gap: '2' }}
  style={{ color: '#fff' }}
>
  <Heading as="h3" size="lg" weight="medium">
    Editable gradient
  </Heading>
  <Text size="sm" style={{ opacity: 0.82 }}>
    Render the same gradient as Box, Card, or Container.
  </Text>
</GradientBackground>`,
})

export const insetCatalogEntry = createCatalogEntry({
  slug: 'inset',
  title: 'Inset',
  description: 'Inner spacing and edge-bleed helper for card media, headers, and content sections.',
  family: 'elements',
  category: 'surfaces',
  sourcePath: 'packages/ui/src/elements/card/Inset.tsx',
  componentName: 'Inset',
  propDefs: insetPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Card.Root className="w-[320px] overflow-hidden">
      <Inset side="top" clip="padding-box">
        <div className="h-24 bg-muted" />
      </Inset>
      <Inset px="current" pb="current">
        <div className="text-sm text-muted-foreground">Inset controls inner spacing and bleed.</div>
      </Inset>
    </Card.Root>
  )
}`,
})

export const imageCatalogEntry = createCatalogEntry({
  slug: 'image',
  title: 'Image',
  description:
    'Responsive media primitive with fallback support, aspect-ratio-friendly usage, and object-fit controls.',
  family: 'elements',
  category: 'media',
  sourcePath: 'packages/ui/src/elements/image/Image.tsx',
  componentName: 'Image',
  propDefs: imagePropDefs,
  overviewCode: `export default function Example() {
  return (
    <AspectRatio ratio="4/3" className="w-[420px] overflow-hidden rounded-2xl border">
      <Image
        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
        alt="Workspace collaboration"
        className="h-full w-full"
      />
    </AspectRatio>
  )
}`,
})

export const iconCatalogEntry = createCatalogEntry({
  slug: 'icon',
  title: 'Icon',
  description: 'Lucide-backed icon primitive with token-aware color, sizing, and optional tooltip content.',
  family: 'elements',
  category: 'actions',
  sourcePath: 'packages/ui/src/elements/button/Icon.tsx',
  componentName: 'Icon',
  propDefs: iconPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Flex align="center" gap="3" wrap="wrap">
      <Icon icon="search" title="Search" />
      <Icon icon="settings" color="info" title="Settings" />
      <Icon icon="triangle-alert" color="warning" title="Alert" />
    </Flex>
  )
}`,
})

export const iconButtonCatalogEntry = createCatalogEntry({
  slug: 'icon-button',
  title: 'Icon Button',
  description: 'Compact icon-only action surface for toolbars, menus, and dense controls.',
  family: 'elements',
  category: 'actions',
  sourcePath: 'packages/ui/src/elements/button/IconButton.tsx',
  componentName: 'IconButton',
  propDefs: iconButtonPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Flex gap="3">
      <IconButton aria-label="Search" variant="soft">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </IconButton>
      <IconButton aria-label="Settings" variant="outline">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
        </svg>
      </IconButton>
    </Flex>
  )
}`,
})

export const spinnerCatalogEntry = createCatalogEntry({
  slug: 'spinner',
  title: 'Spinner',
  description: 'Progress indicator for loading states that need a compact inline affordance.',
  family: 'elements',
  category: 'feedback',
  sourcePath: 'packages/ui/src/elements/spinner/Spinner.tsx',
  componentName: 'Spinner',
  propDefs: spinnerPropDefs,
  overviewCode: `<Flex gap="3" align="center">
  <Spinner size="2" />
  <Text size="sm">Syncing deployment activity…</Text>
</Flex>`,
})

export const segmentedControlCatalogEntry = createCatalogEntry({
  slug: 'segmented-control',
  title: 'Segmented Control',
  description: 'Inline single-select control for compact view switching and mode toggles.',
  family: 'elements',
  category: 'controls',
  sourcePath: 'packages/ui/src/elements/tabs/SegmentedControl.tsx',
  componentName: 'SegmentedControl',
  propDefs: segmentedControlPropDefs,
  overviewCode: `export default function Example() {
  return (
    <SegmentedControl.Root defaultValue="overview">
      <SegmentedControl.Item value="overview">Overview</SegmentedControl.Item>
      <SegmentedControl.Item value="activity">Activity</SegmentedControl.Item>
      <SegmentedControl.Item value="settings">Settings</SegmentedControl.Item>
    </SegmentedControl.Root>
  )
}`,
})

export const sliderCatalogEntry = createCatalogEntry({
  slug: 'slider',
  title: 'Slider',
  description: 'Single or multi-thumb range input for tunable numeric values.',
  family: 'form',
  category: 'inputs',
  sourcePath: 'packages/ui/src/form/Slider.tsx',
  componentName: 'Slider',
  propDefs: sliderPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Flex direction="column" gap="4" className="w-[360px]">
      <Slider defaultValue={[32]} />
      <Slider defaultValue={[18, 76]} color="info" />
    </Flex>
  )
}`,
})

export const tabsCatalogEntry = createCatalogEntry({
  slug: 'tabs',
  title: 'Tabs',
  description: 'Tabbed content organization with triggers, panels, and token-aligned variants.',
  family: 'elements',
  category: 'controls',
  sourcePath: 'packages/ui/src/elements/tabs/Tabs.tsx',
  componentName: 'Tabs',
  propDefs: tabsPropDefs.Root,
  overviewCode: `export default function Example() {
  return (
    <Tabs.Root defaultValue="details" className="w-[420px]">
      <Tabs.List>
        <Tabs.Trigger value="details">Details</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="details">Order details and shipment status.</Tabs.Content>
      <Tabs.Content value="activity">Recent edits and comments.</Tabs.Content>
    </Tabs.Root>
  )
}`,
})

export const textCatalogEntry = createCatalogEntry({
  slug: 'text',
  title: 'Text',
  description: 'Responsive typography primitive for readable inline and block copy.',
  family: 'elements',
  category: 'typography',
  sourcePath: 'packages/ui/src/typography/text/Text.tsx',
  componentName: 'Text',
  propDefs: createDocsPropDefs(textPropDefs),
  overviewCode: `<Text as="p" size="sm" weight="medium">
  Text uses the theme typography scale and semantic color tokens.
</Text>`,
})

export const flexCatalogEntry = createCatalogEntry({
  slug: 'flex',
  title: 'Flex',
  description: 'Responsive flex layout primitive for stacking, aligning, and distributing interface content.',
  family: 'layouts',
  category: 'composition',
  sourcePath: 'packages/ui/src/layouts/flex/Flex.tsx',
  componentName: 'Flex',
  propDefs: flexCatalogPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Flex justify="between" align="center" gap="4" className="rounded-xl border p-4">
      <Text weight="medium">Pipeline</Text>
      <Text size="sm" color="slate">14 active deals</Text>
    </Flex>
  )
}`,
})

export const containerCatalogEntry = createCatalogEntry({
  slug: 'container',
  title: 'Container',
  description: 'Responsive layout container for constraining and positioning composed UI regions.',
  family: 'layouts',
  category: 'composition',
  sourcePath: 'packages/ui/src/layouts/container/Container.tsx',
  componentName: 'Container',
  propDefs: containerDocsPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Container size="3" px="6" py="5" radius="lg" borderColor="neutral-border">
      <Text size="sm" color="slate">Container constrains responsive layout width.</Text>
    </Container>
  )
}`,
})

export const rowCatalogEntry = createCatalogEntry({
  slug: 'row',
  title: 'Row',
  description: 'Horizontal flex layout convenience wrapper for arranging content in a row.',
  family: 'layouts',
  category: 'composition',
  sourcePath: 'packages/ui/src/layouts/flex/Flex.tsx',
  componentName: 'Row',
  propDefs: directionalFlexCatalogPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Row align="center" gap="3" className="rounded-xl border p-4">
      <Text weight="medium">Owner</Text>
      <Text size="sm" color="slate">Design systems</Text>
    </Row>
  )
}`,
})

export const columnCatalogEntry = createCatalogEntry({
  slug: 'column',
  title: 'Column',
  description: 'Vertical flex layout convenience wrapper for stacking content in a column.',
  family: 'layouts',
  category: 'composition',
  sourcePath: 'packages/ui/src/layouts/flex/Flex.tsx',
  componentName: 'Column',
  propDefs: directionalFlexCatalogPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Column gap="2" className="rounded-xl border p-4">
      <Text weight="medium">Component metadata</Text>
      <Text size="sm" color="slate">Name, tags, and catalog placement.</Text>
    </Column>
  )
}`,
})

export const gridCatalogEntry = createCatalogEntry({
  slug: 'grid',
  title: 'Grid',
  description: 'Responsive grid layout primitive for structured dashboards, galleries, and comparison surfaces.',
  family: 'layouts',
  category: 'composition',
  sourcePath: 'packages/ui/src/layouts/grid/Grid.tsx',
  componentName: 'Grid',
  propDefs: gridCatalogPropDefs,
  overviewCode: `export default function Example() {
  return (
    <Grid columns="3" gap="4" className="w-[720px]">
      <Card.Root className="p-4">Revenue</Card.Root>
      <Card.Root className="p-4">Pipeline</Card.Root>
      <Card.Root className="p-4">Retention</Card.Root>
    </Grid>
  )
}`,
})

const barChartData = [
  { label: 'Research', value: 28 },
  { label: 'Concept', value: 44 },
  { label: 'Build', value: 61 },
  { label: 'Launch', value: 36 },
]

const compactHorizontalChartData = [
  { label: 'United States', value: 34 },
  { label: 'Russia', value: 26 },
  { label: 'Ukraine', value: 15 },
  { label: 'India', value: 12 },
  { label: 'China', value: 8 },
  { label: 'Other', value: 5 },
]

export const barChartCatalogEntry = createCatalogEntry({
  slug: 'bar-chart',
  title: 'Bar Chart',
  description: 'Narrative bar chart primitive for compact reporting, progress, and comparison surfaces.',
  family: 'charts',
  category: 'charts',
  sourcePath: 'packages/ui/src/charts/bar-chart/BarChart.tsx',
  componentName: 'BarChart',
  propDefs: barChartCatalogPropDefs,
  overviewCode: `<BarChart
  title="Workflow Throughput"
  description="A compact narrative chart for reporting surfaces."
  data={${JSON.stringify(barChartData, null, 4).split('\n').join('\n  ')}}
  height={320}
  color="${barChartPropDefs.color.default}"
/>`,
})

export const compactHorizontalChartCatalogEntry = createCatalogEntry({
  slug: 'compact-horizontal-chart',
  title: 'Compact Horizontal Chart',
  description: 'Compact part-to-whole bar rows for category distributions in narrow dashboard surfaces.',
  family: 'charts',
  category: 'charts',
  sourcePath: 'packages/ui/src/charts/compact-horizontal-chart/CompactHorizontalChart.tsx',
  componentName: 'CompactHorizontalChart',
  propDefs: compactHorizontalChartCatalogPropDefs,
  overviewCode: `<CompactHorizontalChart
  title="Top countries"
  description="Traffic distribution"
  data={${JSON.stringify(compactHorizontalChartData, null, 4).split('\n').join('\n  ')}}
  valueFormat="percent"
/>`,
})

export const mapChartCatalogEntry = createCatalogEntry({
  slug: 'map-chart',
  title: 'Map Chart',
  description: 'Geographic chart primitive for regional comparisons, location summaries, and dashboard maps.',
  family: 'charts',
  category: 'charts',
  sourcePath: 'packages/ui/src/charts/map-chart/MapChart.tsx',
  componentName: 'MapChart',
  propDefs: mapChartCatalogPropDefs,
  overviewCode: `<MapChart
  title="Most Sales Locations"
  metricLabel="Sales this month"
  trend="14.6% up"
  features={sampleWorldMapFeatures}
  locations={sampleSalesLocations}
  height={402}
  projection={mapChartProjections.${mapChartProjections.mercator}}
/>`,
})

export const localCatalogEntries: readonly CatalogEntry[] = [
  accordionCatalogEntry,
  avatarCatalogEntry,
  avatarGroupCatalogEntry,
  avatarPieCatalogEntry,
  badgeCatalogEntry,
  boxCatalogEntry,
  buttonCatalogEntry,
  calloutCatalogEntry,
  dataListCatalogEntry,
  cardCatalogEntry,
  gradientBackgroundCatalogEntry,
  insetCatalogEntry,
  imageCatalogEntry,
  iconCatalogEntry,
  iconButtonCatalogEntry,
  spinnerCatalogEntry,
  segmentedControlCatalogEntry,
  tabsCatalogEntry,
  textCatalogEntry,
  sliderCatalogEntry,
  flexCatalogEntry,
  containerCatalogEntry,
  rowCatalogEntry,
  columnCatalogEntry,
  gridCatalogEntry,
  barChartCatalogEntry,
  compactHorizontalChartCatalogEntry,
  mapChartCatalogEntry,
]

export function createCatalog(additionalEntries: readonly CatalogEntry[] = []): CatalogEntry[] {
  return [...localCatalogEntries, ...additionalEntries]
}

export const catalog: readonly CatalogEntry[] = createCatalog()

export const catalogNav: CatalogNavItem[] = catalog.map(entry => ({
  slug: entry.slug,
  title: entry.title,
  family: entry.family,
  category: entry.category,
}))

export const catalogBySlug = catalog.reduce<Record<string, CatalogEntry>>(
  (result, entry) => {
    if (result[entry.slug]) {
      throw new Error(`Duplicate catalog slug: ${entry.slug}`)
    }
    result[entry.slug] = entry
    return result
  },
  Object.create(null) as Record<string, CatalogEntry>,
)

export const elementCatalog = catalog.filter(entry => entry.family === 'elements')

export const elementCatalogNav: CatalogNavItem[] = elementCatalog.map(entry => ({
  slug: entry.slug,
  title: entry.title,
  family: entry.family,
  category: entry.category,
}))

export const elementCatalogBySlug = elementCatalog.reduce<Record<string, CatalogEntry>>(
  (result, entry) => {
    if (result[entry.slug]) {
      throw new Error(`Duplicate element catalog slug: ${entry.slug}`)
    }
    result[entry.slug] = entry
    return result
  },
  Object.create(null) as Record<string, CatalogEntry>,
)
