import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from '@/elements/tabs/Tabs'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Box } from '../box/Box'
import { Container } from '../container/Container'
import { Section } from './Section'
import { sectionPropDefs } from './section.props'

const sectionSizes = getPropDefValues(sectionPropDefs.size)
const sizeDescriptions: Record<string, string> = {
  '1': 'Vertical padding: 24px (py-6)',
  '2': 'Vertical padding: 40px (py-10)',
  '3': 'Vertical padding: 64px (py-16)',
  '4': 'Vertical padding: 96px (py-24)',
}

const meta: Meta<typeof Section> = {
  title: 'Layouts/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: sectionSizes,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => (
    <Section className="bg-muted/30">
      <Container size="3">
        <h2 className="text-2xl font-bold mb-4">Default Section</h2>
        <p className="text-muted-foreground">This section uses size="3" which applies py-16 (64px vertical padding).</p>
      </Container>
    </Section>
  ),
}

// ============================================================================
// Size Variants
// ============================================================================

export const SizeVariants: Story = {
  render: () => (
    <div>
      {sectionSizes.map((size, index) => (
        <Section key={size} size={size} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
          <Container size="3">
            <h3 className="text-xl font-semibold mb-2">size="{size}"</h3>
            <p className="text-muted-foreground">
              {sizeDescriptions[size] ?? 'Vertical padding defined by current theme tokens.'}
            </p>
          </Container>
        </Section>
      ))}
    </div>
  ),
}

// ============================================================================
// Landing Page Example
// ============================================================================

export const LandingPage: Story = {
  render: () => (
    <div>
      {/* Hero Section */}
      <Section size="4" className="bg-primary text-primary-foreground">
        <Container size="3" className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Build amazing products with our comprehensive design system and component library.
          </p>
          <div className="flex gap-4 justify-center">
            <Box p="3" px="6" className="bg-background text-foreground rounded-lg font-medium">
              Get Started
            </Box>
            <Box p="3" px="6" className="bg-primary-foreground/10 rounded-lg font-medium">
              Learn More
            </Box>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section size="3" className="bg-background">
        <Container size="4">
          <h2 className="text-2xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Fast', 'Flexible', 'Beautiful'].map(feature => (
              <Box key={feature} p="6" className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary text-2xl">✦</span>
                </div>
                <h3 className="font-semibold mb-2">{feature}</h3>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </Box>
            ))}
          </div>
        </Container>
      </Section>

      {/* Testimonials Section */}
      <Section size="3" className="bg-muted/30">
        <Container size="3">
          <h2 className="text-2xl font-bold text-center mb-12">What People Say</h2>
          <Box p="8" className="bg-background rounded-xl border text-center max-w-2xl mx-auto">
            <p className="text-lg italic mb-4">
              "This component library has transformed how we build products. The attention to detail is remarkable."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="text-left">
                <p className="font-medium">Jane Doe</p>
                <p className="text-sm text-muted-foreground">CEO, Example Inc</p>
              </div>
            </div>
          </Box>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section size="2" className="bg-primary text-primary-foreground">
        <Container size="2" className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="opacity-90 mb-6">Join thousands of developers building with our tools.</p>
          <Box p="3" px="8" className="bg-background text-foreground rounded-lg font-medium inline-block">
            Sign Up Free
          </Box>
        </Container>
      </Section>

      {/* Footer Section */}
      <Section size="1" className="bg-background border-t">
        <Container size="4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2024 Company Name. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground">
                Terms
              </a>
              <a href="#" className="hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  ),
}

// ============================================================================
// Alternating Backgrounds
// ============================================================================

export const AlternatingBackgrounds: Story = {
  render: () => (
    <div>
      <Section size="3" className="bg-background">
        <Container size="3">
          <h2 className="text-2xl font-bold mb-4">Section One</h2>
          <p className="text-muted-foreground">Light background section for primary content areas.</p>
        </Container>
      </Section>

      <Section size="3" className="bg-muted/30">
        <Container size="3">
          <h2 className="text-2xl font-bold mb-4">Section Two</h2>
          <p className="text-muted-foreground">Slightly tinted background to create visual separation.</p>
        </Container>
      </Section>

      <Section size="3" className="bg-background">
        <Container size="3">
          <h2 className="text-2xl font-bold mb-4">Section Three</h2>
          <p className="text-muted-foreground">Back to light background for variety.</p>
        </Container>
      </Section>

      <Section size="3" className="bg-primary text-primary-foreground">
        <Container size="3">
          <h2 className="text-2xl font-bold mb-4">Highlighted Section</h2>
          <p className="opacity-90">Primary colored section for important calls to action.</p>
        </Container>
      </Section>
    </div>
  ),
}

// ============================================================================
// Responsive Size
// ============================================================================

export const ResponsiveSize: Story = {
  render: () => (
    <Section size={{ initial: '1', sm: '2', md: '3', lg: '4' }} className="bg-muted/30">
      <Container size="3">
        <h2 className="text-2xl font-bold mb-4">Responsive Section</h2>
        <p className="text-muted-foreground">
          Padding changes based on viewport:
          <br />• Mobile: size="1" (24px)
          <br />• SM: size="2" (40px)
          <br />• MD: size="3" (64px)
          <br />• LG: size="4" (96px)
        </p>
      </Container>
    </Section>
  ),
}

export const EmbeddedResponsiveSize: Story = {
  render: () => {
    const previewWidths = {
      wide: 1040,
      medium: 720,
      narrow: 360,
    } as const

    return (
      <Tabs.Root defaultValue="wide" className="p-6">
        <Tabs.List>
          <Tabs.Trigger value="wide">Wide</Tabs.Trigger>
          <Tabs.Trigger value="medium">Medium</Tabs.Trigger>
          <Tabs.Trigger value="narrow">Narrow</Tabs.Trigger>
        </Tabs.List>

        {Object.entries(previewWidths).map(([viewport, width]) => (
          <Tabs.Content key={viewport} value={viewport}>
            <div className="space-y-3 pt-4">
              <div className="text-sm font-medium text-foreground">Preview width: {width}px</div>
              <div className="border rounded-xl overflow-hidden bg-background" style={{ width }}>
                <Section size={{ initial: '1', md: '4' }} className="bg-muted/30">
                  <div className="px-4">
                    <h2 className="text-lg font-semibold mb-2">Container-sized Section</h2>
                    <p className="text-sm text-muted-foreground">
                      This section only expands its vertical rhythm when the current preview pane is wide enough.
                    </p>
                  </div>
                </Section>
              </div>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    )
  },
}

// ============================================================================
// With Custom Padding Override
// ============================================================================

export const CustomPaddingOverride: Story = {
  render: () => (
    <div>
      <Section size="3" className="bg-muted/30">
        <Container size="3">
          <h3 className="font-semibold mb-2">Default size="3" padding</h3>
          <p className="text-sm text-muted-foreground">Uses the preset vertical padding.</p>
        </Container>
      </Section>

      <Section py="9" className="bg-background">
        <Container size="3">
          <h3 className="font-semibold mb-2">Custom py="9" override</h3>
          <p className="text-sm text-muted-foreground">
            When you specify py, p, pt, or pb, the size prop's default padding is overridden.
          </p>
        </Container>
      </Section>

      <Section pt="2" pb="8" className="bg-muted/30">
        <Container size="3">
          <h3 className="font-semibold mb-2">Asymmetric padding pt="2" pb="8"</h3>
          <p className="text-sm text-muted-foreground">Different top and bottom padding for special layouts.</p>
        </Container>
      </Section>
    </div>
  ),
}
