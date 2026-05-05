import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '@/elements/card/Card'
import { Flex } from '@/layouts/flex/Flex'
import { Heading } from '@/typography/heading/Heading'
import { Text } from '@/typography/text/Text'
import { GradientBackground, type GradientBackgroundProps } from './GradientBackground'
import { gradientPresets, type GradientPresetKey } from './gradient-presets'

const presetKeys = Object.keys(gradientPresets) as GradientPresetKey[]

const meta = {
  title: 'Elements/GradientBackground',
  component: GradientBackground,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Animated gradient background using CSS @keyframes. Can render as a native div or as a design-system primitive.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    preset: {
      control: 'select',
      options: presetKeys,
      description: 'Named gradient preset',
    },
    colors: {
      control: 'object',
      description: 'Custom color stops (overrides preset)',
    },
    duration: {
      control: { type: 'range', min: 0, max: 60, step: 1 },
      description: 'Animation cycle duration in seconds (0 = no animation)',
    },
    direction: {
      control: { type: 'range', min: 0, max: 360, step: 15 },
      description: 'Gradient angle in degrees',
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: 'Border-radius token',
    },
    as: {
      control: 'select',
      options: ['div', 'Box', 'Card', 'Container'],
      description: 'Render the gradient as a native div or a design-system primitive',
    },
    layout: {
      control: 'select',
      options: ['block', 'flex', 'row', 'column', 'grid'],
      description: 'Optional child layout mode applied to the rendered gradient root',
    },
    layoutProps: {
      control: 'object',
      description: 'Layout props such as gap, columns, align, and justify',
    },
  },
} satisfies Meta<GradientBackgroundProps>

export default meta
type Story = StoryObj<GradientBackgroundProps>

// ============================================================================
// Helpers
// ============================================================================

const DemoContent = () => (
  <Flex direction="column" align="center" gap="2" style={{ padding: 32, color: '#fff' }}>
    <Heading as="h3" size="lg" weight="medium">
      Gradient Background
    </Heading>
    <Text size="sm" style={{ opacity: 0.8 }}>
      Animated CSS gradient with 400% background-size
    </Text>
  </Flex>
)

// ============================================================================
// Stories
// ============================================================================

/** Default cosmic gradient (blue -> purple -> pink), 15 second cycle. */
export const Default: Story = {
  args: {
    preset: 'cosmic',
    duration: 15,
    direction: 135,
    radius: 'lg',
  },
  render: (args: GradientBackgroundProps) => (
    <GradientBackground {...args} style={{ width: 400, minHeight: 200 }}>
      <DemoContent />
    </GradientBackground>
  ),
}

/** Providing explicit color stops instead of a preset. */
export const CustomColors: Story = {
  args: {
    colors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3'],
    duration: 12,
    direction: 90,
    radius: 'lg',
  },
  render: (args: GradientBackgroundProps) => (
    <GradientBackground {...args} style={{ width: 400, minHeight: 200 }}>
      <DemoContent />
    </GradientBackground>
  ),
}

/** Gradient background composed with a Card. */
export const WithCard: Story = {
  render: () => (
    <GradientBackground
      as="Card"
      preset="aurora"
      radius="lg"
      size="md"
      layout="column"
      layoutProps={{ gap: '3' }}
      style={{ width: 400 }}
    >
      <Card.Header>
        <Card.Title>Card with Gradient</Card.Title>
        <Card.Description>Card props are passed directly to the rendered Card root.</Card.Description>
      </Card.Header>
      <Card.Content>
        <Text as="p">Content sits inside the card, on top of the gradient background.</Text>
      </Card.Content>
    </GradientBackground>
  ),
}

/** Gradient background with Card rendering and grid layout kept on a separate API axis. */
export const WithCardGridLayout: Story = {
  render: () => (
    <GradientBackground
      as="Card"
      preset="midnight"
      radius="lg"
      size="md"
      layout="grid"
      layoutProps={{ columns: '2', gap: '4' }}
      style={{ width: 520 }}
    >
      <Card.Header>
        <Card.Title>Visual target</Card.Title>
        <Card.Description>`as="Card"` selects the surface treatment.</Card.Description>
      </Card.Header>
      <Card.Content className="pt-0">
        <Text as="p">`layout="grid"` arranges the children without competing with `as`.</Text>
      </Card.Content>
    </GradientBackground>
  ),
}

/** Gradient background composed with a Box layout. */
export const WithBox: Story = {
  render: () => (
    <GradientBackground as="Box" preset="tropical" radius="lg" p="6" style={{ color: '#fff' }}>
      <Flex direction="column" gap="2">
        <Heading as="h3" size="lg" weight="medium">
          Box Gradient
        </Heading>
        <Text size="sm" style={{ opacity: 0.8 }}>
          Box layout props such as p, width, height, and radius are accepted directly.
        </Text>
      </Flex>
    </GradientBackground>
  ),
}

/** Gradient background composed with a Container layout. */
export const WithContainer: Story = {
  render: () => (
    <GradientBackground
      as="Container"
      preset="cosmic"
      radius="lg"
      size="2"
      width="520px"
      px="4"
      py="6"
      style={{ color: '#fff' }}
    >
      <Heading as="h3" size="lg" weight="medium">
        Container Gradient
      </Heading>
      <Text size="sm" style={{ opacity: 0.8 }}>
        Container props such as size, width, align, px, and py pass through.
      </Text>
    </GradientBackground>
  ),
}

/** A slow 30-second animation cycle for subtle motion. */
export const SlowAnimation: Story = {
  args: {
    preset: 'midnight',
    duration: 30,
    direction: 180,
    radius: 'lg',
  },
  render: (args: GradientBackgroundProps) => (
    <GradientBackground {...args} style={{ width: 400, minHeight: 200 }}>
      <DemoContent />
    </GradientBackground>
  ),
}

/** A fast 3-second animation cycle for energetic motion. */
export const FastAnimation: Story = {
  args: {
    preset: 'sunset',
    duration: 3,
    direction: 45,
    radius: 'lg',
  },
  render: (args: GradientBackgroundProps) => (
    <GradientBackground {...args} style={{ width: 400, minHeight: 200 }}>
      <DemoContent />
    </GradientBackground>
  ),
}

/** All built-in gradient presets displayed as a gallery. */
export const PresetGallery: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: 500 }}>
      {presetKeys.map(key => (
        <GradientBackground key={key} preset={key} radius="lg" duration={15} style={{ minHeight: 100 }}>
          <Flex align="center" justify="center" className="p-4 h-full" style={{ color: '#fff' }}>
            <Text size="sm" weight="medium">
              {gradientPresets[key].name}
            </Text>
          </Flex>
        </GradientBackground>
      ))}
    </div>
  ),
}
