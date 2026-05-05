import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '@/elements/card/Card'
import { Masonry } from './Masonry'

const COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f59e0b',
  '#6366f1',
  '#10b981',
]

function getHeight(index: number) {
  const heights = [120, 180, 240, 160, 200, 280, 140, 220, 170, 250, 190, 260]
  return heights[index % heights.length] ?? 180
}

const meta: Meta<typeof Masonry.Root> = {
  title: 'Layouts/Masonry',
  component: Masonry.Root,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Virtualized masonry grid layout with dynamic item sizing, scroll-based rendering, and automatic column distribution. Items are positioned using an interval tree for efficient range queries.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columnWidth: {
      control: { type: 'number', min: 100, max: 600, step: 50 },
      description: 'Target width for each column in pixels',
    },
    columnCount: {
      control: { type: 'number', min: 1, max: 8 },
      description: 'Fixed number of columns (overrides columnWidth)',
    },
    maxColumnCount: {
      control: { type: 'number', min: 1, max: 8 },
      description: 'Maximum number of columns',
    },
    gap: {
      control: { type: 'number', min: 0, max: 48, step: 4 },
      description: 'Gap between items in pixels',
    },
    itemHeight: {
      control: { type: 'number', min: 100, max: 600, step: 50 },
      description: 'Estimated item height for virtualization calculations',
    },
    overscan: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Number of viewport heights to render outside visible area',
    },
    linear: {
      control: 'boolean',
      description: 'Preserve item order across columns when possible',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Default
// ============================================================================

export const Default: Story = {
  args: {
    columnWidth: 200,
    gap: 16,
    overscan: 2,
    linear: false,
  },
  render: args => (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <Masonry.Root {...args}>
        {Array.from({ length: 24 }, (_, i) => (
          <Masonry.Item key={i}>
            <div
              style={{
                height: getHeight(i),
                backgroundColor: COLORS[i % COLORS.length],
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {i + 1}
            </div>
          </Masonry.Item>
        ))}
      </Masonry.Root>
    </div>
  ),
}

// ============================================================================
// Fixed Column Count
// ============================================================================

export const FixedColumns: Story = {
  args: {
    columnCount: 3,
    gap: 12,
  },
  render: args => (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Masonry.Root {...args}>
        {Array.from({ length: 18 }, (_, i) => (
          <Masonry.Item key={i}>
            <div
              style={{
                height: getHeight(i),
                backgroundColor: COLORS[i % COLORS.length],
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {i + 1}
            </div>
          </Masonry.Item>
        ))}
      </Masonry.Root>
    </div>
  ),
}

// ============================================================================
// Custom Gap
// ============================================================================

export const CustomGap: Story = {
  args: {
    columnWidth: 200,
    gap: { column: 24, row: 8 },
  },
  render: args => (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <Masonry.Root {...args}>
        {Array.from({ length: 20 }, (_, i) => (
          <Masonry.Item key={i}>
            <div
              style={{
                height: getHeight(i),
                backgroundColor: COLORS[i % COLORS.length],
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {i + 1}
            </div>
          </Masonry.Item>
        ))}
      </Masonry.Root>
    </div>
  ),
}

// ============================================================================
// Linear Ordering
// ============================================================================

export const LinearOrdering: Story = {
  args: {
    columnWidth: 200,
    gap: 16,
    linear: true,
  },
  render: args => (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <Masonry.Root {...args}>
        {Array.from({ length: 24 }, (_, i) => (
          <Masonry.Item key={i}>
            <div
              style={{
                height: getHeight(i),
                backgroundColor: COLORS[i % COLORS.length],
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {i + 1}
            </div>
          </Masonry.Item>
        ))}
      </Masonry.Root>
    </div>
  ),
}

// ============================================================================
// With Cards
// ============================================================================

const CARD_DATA = [
  { title: 'Getting Started', desc: 'Learn the basics of our platform and set up your first project.' },
  { title: 'API Reference', desc: 'Comprehensive documentation for all API endpoints.' },
  { title: 'Design Tokens', desc: 'Color, spacing, and typography scales used throughout the system.' },
  { title: 'Authentication', desc: 'Secure your application with OAuth 2.0 and API key authentication patterns.' },
  { title: 'Components', desc: 'Pre-built UI components.' },
  { title: 'Deployment', desc: 'Deploy to production with CI/CD pipelines, environment management, and monitoring.' },
  { title: 'Testing', desc: 'Write reliable tests with our testing utilities and best practices guide.' },
  { title: 'Performance', desc: 'Optimize bundle size, rendering, and network requests for the best user experience.' },
  { title: 'Accessibility', desc: 'Build inclusive interfaces following WCAG 2.1 guidelines.' },
]

export const WithCards: Story = {
  args: {
    columnWidth: 280,
    gap: 16,
  },
  render: args => (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <Masonry.Root {...args}>
        {CARD_DATA.map((item, i) => (
          <Masonry.Item key={i}>
            <Card.Root>
              <Card.Header>
                <Card.Title>{item.title}</Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card.Content>
            </Card.Root>
          </Masonry.Item>
        ))}
      </Masonry.Root>
    </div>
  ),
}

// ============================================================================
// Image Gallery
// ============================================================================

export const ImageGallery: Story = {
  args: {
    columnWidth: 240,
    gap: 8,
  },
  render: args => (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <Masonry.Root {...args}>
        {Array.from({ length: 16 }, (_, i) => (
          <Masonry.Item key={i}>
            <div
              style={{
                height: getHeight(i),
                background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 3) % COLORS.length]})`,
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                gap: 4,
              }}
            >
              <span style={{ fontSize: 24 }}>{['🏔️', '🌊', '🌅', '🏙️', '🌸', '🍂', '❄️', '🌈'][i % 8]}</span>
              <span style={{ fontSize: 12, opacity: 0.8 }}>Photo {i + 1}</span>
            </div>
          </Masonry.Item>
        ))}
      </Masonry.Root>
    </div>
  ),
}
