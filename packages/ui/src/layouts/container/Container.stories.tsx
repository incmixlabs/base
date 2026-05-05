import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from '@/elements/tabs/Tabs'
import { layoutCompositionPropDefs } from '@/theme/props/layout-composition.props'
import { selectArgType } from '@/theme/props/storybook'
import { Text } from '@/typography/text/Text'
import { Box } from '../box/Box'
import { Container } from './Container'
import { containerSizeMaxWidth } from './container.css'
import { containerPropDefs } from './container.props'
import { Column, Row } from '../flex/Flex'
import { Grid } from '../grid/Grid'

const remToPxLabel = (value: string) => {
  const rem = Number.parseFloat(value)
  return Number.isFinite(rem) ? `${rem * 16}px` : value
}

const meta: Meta<typeof Container> = {
  title: 'Layouts/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    size: '4',
    align: 'center',
    display: 'initial',
    px: '4',
  },
  argTypes: {
    size: selectArgType(containerPropDefs.size),
    align: selectArgType(containerPropDefs.align),
    display: selectArgType(containerPropDefs.display),
    layout: selectArgType(layoutCompositionPropDefs.layout),
    layoutProps: { control: { type: 'object' } },
    p: { control: { type: 'object' } },
    px: { control: { type: 'object' } },
    py: { control: { type: 'object' } },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: args => (
    <Box color="neutral" variant="soft" py="8">
      <Container {...args}>
        <Box width="full" p="4" color="neutral" variant="surface" borderColor="neutral-border" radius="lg">
          <Column gap="2">
            <Text as="p">Default container</Text>
            <Text as="p" size="sm" color="neutral" variant="muted">
              The container is driven by Storybook args for size, alignment, display, and spacing.
            </Text>
          </Column>
        </Box>
      </Container>
    </Box>
  ),
}

// ============================================================================
// Size Variants
// ============================================================================

export const SizeVariants: Story = {
  render: args => (
    <Box color="neutral" variant="soft" py="8">
      <Column gap="8">
        {containerPropDefs.size.values.map(size => (
          <Container key={size} {...args} size={size}>
            <Box width="full" p="4" color="neutral" variant="surface" borderColor="neutral-border" radius="lg">
              <Column gap="2">
                <Text as="p" weight="medium">
                  size="{size}"
                </Text>
                <Text as="p" size="sm" color="neutral" variant="muted">
                  Max-width: {remToPxLabel(containerSizeMaxWidth[size])}
                </Text>
              </Column>
            </Box>
          </Container>
        ))}
      </Column>
    </Box>
  ),
}

// ============================================================================
// Alignment
// ============================================================================

export const Alignment: Story = {
  args: {
    size: '2',
  },
  render: args => (
    <Box color="neutral" variant="soft" py="8">
      <Column gap="8">
        {containerPropDefs.align.values.map(alignment => (
          <Container key={alignment} {...args} align={alignment}>
            <Box width="16rem" p="4" color="neutral" variant="surface" borderColor="neutral-border" radius="lg">
              <Column gap="2">
                <Text as="p" weight="medium">
                  align="{alignment}"
                </Text>
                <Text as="p" size="sm" color="neutral" variant="muted">
                  Content aligned to the {alignment}
                </Text>
              </Column>
            </Box>
          </Container>
        ))}
      </Column>
    </Box>
  ),
}

// ============================================================================
// Tokenized Size
// ============================================================================

export const TokenizedSize: Story = {
  args: {
    size: '4',
  },
  render: args => (
    <Box color="neutral" variant="soft" py="8">
      <Container {...args}>
        <Box width="full" p="4" color="neutral" variant="surface" borderColor="neutral-border" radius="lg">
          <Column gap="2">
            <Text as="p" weight="medium">
              Tokenized Container
            </Text>
            <Text as="p" size="sm" color="neutral" variant="muted">
              Container sizes are tokenized. Use a specific size per layout.
            </Text>
          </Column>
        </Box>
      </Container>
    </Box>
  ),
}

export const ResponsiveSpacing: Story = {
  args: {
    px: { initial: '2', md: '4' },
    py: { initial: '3', lg: '6' },
  },
  render: args => (
    <Box color="neutral" variant="soft" py="8">
      <Container {...args}>
        <Box width="full" p="4" color="neutral" variant="surface" borderColor="neutral-border" radius="lg">
          <Column gap="2">
            <Text as="p" weight="medium">
              Responsive spacing
            </Text>
            <Text as="p" size="sm" color="neutral" variant="muted">
              Container padding uses responsive px and py props: initial 2 to md 4, initial 3 to lg 6.
            </Text>
          </Column>
        </Box>
      </Container>
    </Box>
  ),
}

export const InnerLayoutComposition: Story = {
  args: {
    layout: 'grid',
    layoutProps: { columns: { initial: '1', md: '3' }, gap: '4' },
  },
  render: args => (
    <Box color="neutral" variant="soft" py="8">
      <Container {...args}>
        {['Overview', 'Activity', 'Forecast'].map(label => (
          <Box key={label} p="4" color="neutral" variant="surface" borderColor="neutral-border" radius="lg">
            <Text weight="medium">{label}</Text>
          </Box>
        ))}
      </Container>
    </Box>
  ),
}

// ============================================================================
// With Content
// ============================================================================

export const ArticleLayout: Story = {
  args: {
    size: '2',
  },
  render: args => (
    <Box color="neutral" variant="soft" py="8">
      <Container {...args}>
        <Box width="full" p="6" color="neutral" variant="surface" borderColor="neutral-border" radius="lg">
          <Column asChild gap="4">
            <article>
              <Column gap="4">
                <Text as="div" size="2x" weight="bold">
                  Article Title
                </Text>
                <Text as="p" color="neutral" variant="muted">
                  Published on January 1, 2024 • 5 min read
                </Text>
                <Text as="p">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </Text>
                <Text as="div" size="xl" weight="bold" mt="2">
                  Section Heading
                </Text>
                <Text as="p">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                  laborum.
                </Text>
                <Box p="4" color="neutral" variant="soft" radius="lg">
                  <Text size="sm">Code example or callout box</Text>
                </Box>
                <Text as="p">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                  totam rem aperiam.
                </Text>
              </Column>
            </article>
          </Column>
        </Box>
      </Container>
    </Box>
  ),
}

export const PageLayout: Story = {
  render: args => (
    <Box color="neutral" variant="soft" minHeight="100svh">
      <Column>
        <Box asChild color="accent" variant="solid" py="4">
          <header>
            <Container {...args}>
              <Row width="full" justify="between" align="center">
                <Text weight="bold">Logo</Text>
                <Row asChild gap="4">
                  <nav>
                    {['Home', 'About', 'Contact'].map(label => (
                      <Text key={label} asChild size="sm">
                        <a href="#">{label}</a>
                      </Text>
                    ))}
                  </nav>
                </Row>
              </Row>
            </Container>
          </header>
        </Box>

        <Box asChild py="8">
          <main>
            <Container {...args}>
              <Column width="full" gap="6">
                <Text as="div" size="3x" weight="bold">
                  Page Title
                </Text>
                <Grid columns={{ initial: '1', md: '3' }} gap="6">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Box key={i} p="4" color="neutral" variant="surface" borderColor="neutral-border" radius="lg">
                      <Box height="8rem" mb="3" color="neutral" variant="soft" radius="md" />
                      <Text as="div" weight="medium">
                        Card {i + 1}
                      </Text>
                      <Text as="p" size="sm" color="neutral" variant="muted">
                        Card description
                      </Text>
                    </Box>
                  ))}
                </Grid>
              </Column>
            </Container>
          </main>
        </Box>

        <Box asChild py="6" color="neutral" variant="surface" borderColor="neutral-border">
          <footer>
            <Container {...args}>
              <Text as="p" size="sm" color="neutral" variant="muted" align="center">
                © 2024 Your Company. All rights reserved.
              </Text>
            </Container>
          </footer>
        </Box>
      </Column>
    </Box>
  ),
}

// ============================================================================
// Nested Containers
// ============================================================================

export const NestedContainers: Story = {
  render: args => (
    <Box color="neutral" variant="soft" py="8">
      <Container {...args}>
        <Box width="full" p="4" color="neutral" variant="surface" borderColor="neutral-border" radius="lg">
          <Column gap="6">
            <Column gap="2">
              <Text as="div" size="xl" weight="bold">
                Outer Container
              </Text>
              <Text as="p" color="neutral" variant="muted">
                This container provides the maximum width for the page content.
              </Text>
            </Column>

            <Container size="2">
              <Box width="full" p="4" color="neutral" variant="soft" borderColor="neutral-border" radius="lg">
                <Column gap="2">
                  <Text as="div" size="lg" weight="medium">
                    Inner Container (size="2")
                  </Text>
                  <Text as="p" size="sm" color="neutral" variant="muted">
                    A narrower container for focused content like forms or articles.
                  </Text>
                </Column>
              </Box>
            </Container>
          </Column>
        </Box>
      </Container>
    </Box>
  ),
}

export const EmbeddedResponsivePreview: Story = {
  args: {
    size: { initial: '1', md: '3', xl: '4' },
    align: { initial: 'left', lg: 'center' },
    p: '4',
  },
  argTypes: {
    size: { control: { type: 'object' } },
    align: { control: { type: 'object' } },
  },
  render: args => {
    const previewWidths = {
      wide: 1040,
      medium: 720,
      narrow: 360,
    } as const

    return (
      <Box asChild p="6">
        <Tabs.Root defaultValue="wide">
          <Tabs.List>
            <Tabs.Trigger value="wide">Wide</Tabs.Trigger>
            <Tabs.Trigger value="medium">Medium</Tabs.Trigger>
            <Tabs.Trigger value="narrow">Narrow</Tabs.Trigger>
          </Tabs.List>
          {Object.entries(previewWidths).map(([viewport, width]) => (
            <Tabs.Content key={viewport} value={viewport}>
              <Column gap="3" pt="4">
                <Text as="div" size="sm" weight="medium">
                  Preview width: {width}px
                </Text>
                <Box width={`${width}px`} p="4" color="neutral" variant="soft" borderColor="neutral-border" radius="lg">
                  <Container {...args}>
                    <Box width="full" p="4" color="neutral" variant="surface" borderColor="neutral-border" radius="lg">
                      <Column gap="2">
                        <Text weight="medium">Embedded Container</Text>
                        <Text as="p" size="sm" color="neutral" variant="muted">
                          The container max-width and alignment now follow the local preview width instead of the
                          browser viewport.
                        </Text>
                      </Column>
                    </Box>
                  </Container>
                </Box>
              </Column>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Box>
    )
  },
}
