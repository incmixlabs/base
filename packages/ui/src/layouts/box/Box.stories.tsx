import type { Meta, StoryObj } from '@storybook/react-vite'
import { getPropDefValues } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { selectArgType } from '@/theme/props/storybook'
import { Box } from './Box'
import { boxPropDefs } from './box.props'

const meta: Meta<typeof Box> = {
  title: 'Layouts/Box',
  component: Box,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    as: selectArgType(boxPropDefs.as),
    display: selectArgType(boxPropDefs.display, { if: { arg: 'layout', exists: false } }),
    layout: selectArgType(boxPropDefs.layout),
    p: selectArgType(boxPropDefs.p),
    radius: selectArgType(radiusPropDef.radius),
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  args: {
    p: '4',
    children: 'Basic Box with padding',
    className: 'bg-muted rounded-md',
  },
}

export const AsSpan: Story = {
  args: {
    as: 'span',
    p: '2',
    children: 'Box as span',
    className: 'bg-primary text-primary-foreground rounded',
  },
}

export const RadiusVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {getPropDefValues(radiusPropDef.radius).map(radius => (
        <Box key={radius} radius={radius} p="4" className="border border-border bg-muted text-sm">
          radius=&quot;{radius}&quot;
        </Box>
      ))}
    </div>
  ),
}

// ============================================================================
// Padding Examples
// ============================================================================

export const PaddingScale: Story = {
  render: () => (
    <div className="space-y-2">
      {getPropDefValues(boxPropDefs.p).map(p => (
        <Box key={p} p={p} className="bg-muted rounded">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">p={p}</span>
        </Box>
      ))}
    </div>
  ),
}

export const DirectionalPadding: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Box px="6" className="bg-muted rounded">
        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">px=6</span>
      </Box>
      <Box py="6" className="bg-muted rounded">
        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">py=6</span>
      </Box>
      <Box pt="6" className="bg-muted rounded">
        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">pt=6</span>
      </Box>
      <Box pb="6" className="bg-muted rounded">
        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">pb=6</span>
      </Box>
    </div>
  ),
}

// ============================================================================
// Responsive Examples
// ============================================================================

export const ResponsivePadding: Story = {
  render: () => (
    <Box p={{ initial: '2', sm: '4', md: '6', lg: '8' }} className="bg-muted rounded-md">
      <span className="text-sm">Responsive padding: p-2 → sm:p-4 → md:p-6 → lg:p-8</span>
    </Box>
  ),
}

// ============================================================================
// Sizing Examples
// ============================================================================

export const CustomSizing: Story = {
  render: () => (
    <div className="space-y-4">
      <Box width="200px" height="100px" className="bg-muted rounded-md flex items-center justify-center">
        200px × 100px
      </Box>
      <Box width="100%" maxWidth="400px" p="4" className="bg-muted rounded-md">
        100% width, max 400px
      </Box>
      <Box minHeight="150px" p="4" className="bg-muted rounded-md">
        Min height 150px
      </Box>
    </div>
  ),
}

// ============================================================================
// Position Examples
// ============================================================================

export const Positioning: Story = {
  render: () => (
    <Box position="relative" height="200px" className="bg-muted rounded-md">
      <Box position="absolute" top="2" left="2" p="2" className="bg-primary text-primary-foreground rounded">
        Top Left
      </Box>
      <Box position="absolute" top="2" right="2" p="2" className="bg-primary text-primary-foreground rounded">
        Top Right
      </Box>
      <Box position="absolute" bottom="2" left="2" p="2" className="bg-primary text-primary-foreground rounded">
        Bottom Left
      </Box>
      <Box position="absolute" bottom="2" right="2" p="2" className="bg-primary text-primary-foreground rounded">
        Bottom Right
      </Box>
    </Box>
  ),
}

// ============================================================================
// Display Examples
// ============================================================================

export const DisplayModes: Story = {
  render: () => (
    <div className="space-y-4">
      <Box display="block" p="4" className="bg-muted rounded">
        display="block" (full width)
      </Box>
      <Box display="inline-block" p="4" className="bg-muted rounded">
        display="inline-block"
      </Box>
      <Box display="flex" p="4" className="bg-muted rounded gap-2">
        <span className="bg-primary text-primary-foreground px-2 py-1 rounded">Flex</span>
        <span className="bg-primary text-primary-foreground px-2 py-1 rounded">Items</span>
      </Box>
    </div>
  ),
}

export const LayoutComposition: Story = {
  render: () => (
    <Box layout="grid" columns={{ initial: '1', md: '3' }} gap="3" p="4" color="neutral" variant="soft" radius="lg">
      {['Revenue', 'Pipeline', 'Retention'].map(label => (
        <Box key={label} p="3" color="neutral" variant="surface" borderColor="neutral-border" radius="md">
          {label}
        </Box>
      ))}
    </Box>
  ),
}

// ============================================================================
// Overflow Examples
// ============================================================================

export const OverflowBehavior: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Box overflow="auto" width="200px" height="100px" p="2" className="bg-muted rounded">
        <div className="w-[300px] h-[200px] bg-primary/20 rounded p-2">overflow="auto" - scrollable content</div>
      </Box>
      <Box overflow="hidden" width="200px" height="100px" p="2" className="bg-muted rounded">
        <div className="w-[300px] h-[200px] bg-primary/20 rounded p-2">overflow="hidden" - clipped content</div>
      </Box>
    </div>
  ),
}
