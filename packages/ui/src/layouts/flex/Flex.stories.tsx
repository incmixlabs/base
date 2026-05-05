import type { Meta, StoryObj } from '@storybook/react-vite'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Box } from '../box/Box'
import { Flex } from './Flex'
import { flexPropDefs } from './flex.props'

const directionValues = getPropDefValues(flexPropDefs.direction)
const alignValues = getPropDefValues(flexPropDefs.align)
const justifyValues = getPropDefValues(flexPropDefs.justify)
const wrapValues = getPropDefValues(flexPropDefs.wrap)
const gapValues = getPropDefValues(flexPropDefs.gap)

const meta: Meta<typeof Flex> = {
  title: 'Layouts/Flex',
  component: Flex,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: directionValues,
    },
    align: {
      control: 'select',
      options: alignValues,
    },
    justify: {
      control: 'select',
      options: justifyValues,
      // TODO(layout-ve): track justify option alignment in docs/issues/flex-justify-options-alignment.md.
    },
    wrap: {
      control: 'select',
      options: wrapValues,
    },
    gap: {
      control: 'select',
      options: gapValues,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const DemoBox = ({ children }: { children: React.ReactNode }) => (
  <Box p="3" className="bg-primary text-primary-foreground rounded-md text-sm">
    {children}
  </Box>
)

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => (
    <Flex gap="3">
      <DemoBox>One</DemoBox>
      <DemoBox>Two</DemoBox>
      <DemoBox>Three</DemoBox>
    </Flex>
  ),
}

// ============================================================================
// Direction Examples
// ============================================================================

export const Directions: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">direction="row" (default)</p>
        <Flex direction="row" gap="3">
          <DemoBox>1</DemoBox>
          <DemoBox>2</DemoBox>
          <DemoBox>3</DemoBox>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">direction="row-reverse"</p>
        <Flex direction="row-reverse" gap="3">
          <DemoBox>1</DemoBox>
          <DemoBox>2</DemoBox>
          <DemoBox>3</DemoBox>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">direction="column"</p>
        <Flex direction="column" gap="3">
          <DemoBox>1</DemoBox>
          <DemoBox>2</DemoBox>
          <DemoBox>3</DemoBox>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">direction="column-reverse"</p>
        <Flex direction="column-reverse" gap="3">
          <DemoBox>1</DemoBox>
          <DemoBox>2</DemoBox>
          <DemoBox>3</DemoBox>
        </Flex>
      </div>
    </div>
  ),
}

// ============================================================================
// Alignment Examples
// ============================================================================

export const AlignItems: Story = {
  render: () => (
    <div className="space-y-4">
      {alignValues.map(align => (
        <div key={align}>
          <p className="text-sm text-muted-foreground mb-2">align="{align}"</p>
          <Flex align={align} gap="3" className="bg-muted/50 rounded-md p-2 h-20">
            <Box p="2" className="bg-primary text-primary-foreground rounded text-xs">
              Tall
              <br />
              Item
            </Box>
            <Box p="2" className="bg-primary text-primary-foreground rounded text-xs">
              Short
            </Box>
            <Box p="2" className="bg-primary text-primary-foreground rounded text-xs">
              Medium
              <br />
              Height
            </Box>
          </Flex>
        </div>
      ))}
    </div>
  ),
}

export const JustifyContent: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      {justifyValues.map(justify => (
        <div key={justify}>
          <p className="text-sm text-muted-foreground mb-2">justify="{justify}"</p>
          <Flex justify={justify} className="bg-muted/50 rounded-md p-2">
            <DemoBox>A</DemoBox>
            <DemoBox>B</DemoBox>
            <DemoBox>C</DemoBox>
          </Flex>
        </div>
      ))}
    </div>
  ),
}

// ============================================================================
// Gap Examples
// ============================================================================

export const GapScale: Story = {
  render: () => (
    <div className="space-y-4">
      {gapValues.map(gap => (
        <div key={gap}>
          <p className="text-sm text-muted-foreground mb-2">gap="{gap}"</p>
          <Flex gap={gap} className="bg-muted/30 rounded p-1">
            <DemoBox>A</DemoBox>
            <DemoBox>B</DemoBox>
            <DemoBox>C</DemoBox>
          </Flex>
        </div>
      ))}
    </div>
  ),
}

export const DirectionalGap: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">gapX="6" gapY="2"</p>
        <Flex wrap="wrap" gapX="6" gapY="2" className="w-[300px] bg-muted/30 rounded p-2">
          <DemoBox>One</DemoBox>
          <DemoBox>Two</DemoBox>
          <DemoBox>Three</DemoBox>
          <DemoBox>Four</DemoBox>
          <DemoBox>Five</DemoBox>
        </Flex>
      </div>
    </div>
  ),
}

// ============================================================================
// Wrap Examples
// ============================================================================

export const FlexWrap: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">wrap="nowrap" (default)</p>
        <Flex wrap="nowrap" gap="2" className="w-[200px] bg-muted/30 rounded p-2 overflow-x-auto">
          <DemoBox>One</DemoBox>
          <DemoBox>Two</DemoBox>
          <DemoBox>Three</DemoBox>
          <DemoBox>Four</DemoBox>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">wrap="wrap"</p>
        <Flex wrap="wrap" gap="2" className="w-[200px] bg-muted/30 rounded p-2">
          <DemoBox>One</DemoBox>
          <DemoBox>Two</DemoBox>
          <DemoBox>Three</DemoBox>
          <DemoBox>Four</DemoBox>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">wrap="wrap-reverse"</p>
        <Flex wrap="wrap-reverse" gap="2" className="w-[200px] bg-muted/30 rounded p-2">
          <DemoBox>One</DemoBox>
          <DemoBox>Two</DemoBox>
          <DemoBox>Three</DemoBox>
          <DemoBox>Four</DemoBox>
        </Flex>
      </div>
    </div>
  ),
}

// ============================================================================
// Responsive Examples
// ============================================================================

export const ResponsiveDirection: Story = {
  render: () => (
    <Flex direction={{ initial: 'column', sm: 'row' }} gap="4" align="center">
      <DemoBox>Column on mobile</DemoBox>
      <DemoBox>Row on desktop</DemoBox>
      <DemoBox>Resize to see</DemoBox>
    </Flex>
  ),
}

// ============================================================================
// Common Patterns
// ============================================================================

export const SpaceBetween: Story = {
  render: () => (
    <Flex justify="between" align="center" p="4" className="bg-muted rounded-lg w-[400px]">
      <span className="font-medium">Title</span>
      <Flex gap="2">
        <Box p="2" className="bg-primary text-primary-foreground rounded text-sm">
          Action 1
        </Box>
        <Box p="2" className="bg-secondary text-secondary-foreground rounded text-sm">
          Action 2
        </Box>
      </Flex>
    </Flex>
  ),
}

export const CenteredContent: Story = {
  render: () => (
    <Flex
      align="center"
      justify="center"
      direction="column"
      gap="4"
      className="bg-muted rounded-lg w-[300px] h-[200px]"
    >
      <Box p="4" className="bg-primary text-primary-foreground rounded-full">
        Icon
      </Box>
      <span className="font-medium">Centered Content</span>
      <span className="text-sm text-muted-foreground">With description</span>
    </Flex>
  ),
}
