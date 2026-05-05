import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Badge, Button, Card, Progress } from '@/elements'
import { FieldGroup } from '@/form/FieldGroup'
import { Slider } from '@/form/Slider'
import { Switch } from '@/form/Switch'
import { TextField } from '@/form/TextField'
import { Box } from '@/layouts/box/Box'
import { Section } from '@/layouts/section/Section'
import { radii } from '@/theme/props/radius.prop'
import { HUE_NAMES } from '@/theme/tokens'
import { Code, Heading, Kbd, Link, Text } from '@/typography'
import { Theme } from './ThemeProvider'
import { useThemeContext } from './theme-provider.context'

const meta: Meta<typeof Theme> = {
  title: 'Theme/Theme',
  component: Theme,
  parameters: {
    layout: 'fullscreen',
    disableGlobalTheme: true,
  },
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['light', 'dark', 'inherit'],
    },
    accentColor: {
      control: 'select',
      options: HUE_NAMES,
    },
    radius: {
      control: 'select',
      options: radii,
    },
    scaling: {
      control: 'select',
      options: ['90%', '95%', '100%', '105%', '110%'],
    },
    panelBackground: {
      control: 'select',
      options: ['solid', 'translucent'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Example
// ============================================================================

export const Default: Story = {
  render: () => (
    <Theme className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Theme Demo</h1>
        <p className="text-muted-foreground">The Theme component provides context for styling all child components.</p>

        <div className="flex gap-4 flex-wrap">
          <Button>Primary Button</Button>
          <Button variant="soft">Soft Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge>Default</Badge>
          <Badge color="primary">Primary</Badge>
          <Badge color="success">Success</Badge>
          <Badge color="warning">Warning</Badge>
          <Badge color="error">Error</Badge>
        </div>

        <Card.Root>
          <Card.Header>
            <Card.Title>Card Title</Card.Title>
            <Card.Description>Card description goes here</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm w-20">Switch:</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-20">Slider:</span>
                <Slider defaultValue={[50]} className="flex-1" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-20">Progress:</span>
                <Progress value={65} className="flex-1" />
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </Theme>
  ),
}

// ============================================================================
// Accent Colors
// ============================================================================

export const AccentColors: Story = {
  render: () => {
    const colors = HUE_NAMES

    return (
      <Box display="flex" className="flex-wrap gap-4 p-8">
        {colors.map(color => (
          <Theme key={color} accentColor={color} className="p-4 rounded-lg border">
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium capitalize">{color}</p>
              <Button size="md">Button</Button>
            </div>
          </Theme>
        ))}
      </Box>
    )
  },
}

// ============================================================================
// Radius Options
// ============================================================================

export const RadiusOptions: Story = {
  render: () => {
    const themeRadii = radii

    return (
      <Box display="flex" className="flex-wrap gap-4 p-8">
        {themeRadii.map(radius => (
          <Theme key={radius} radius={radius} className="p-4 rounded-lg border">
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium capitalize">{radius}</p>
              <Button size="md">Button</Button>
            </div>
          </Theme>
        ))}
      </Box>
    )
  },
}

// ============================================================================
// Light and Dark
// ============================================================================

export const LightAndDark: Story = {
  render: () => (
    <div className="flex">
      <Theme appearance="light" className="flex-1 p-8 min-h-[400px]">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Light Mode</h2>
          <Button>Primary Button</Button>
          <Card.Root>
            <Card.Header>
              <Card.Title>Light Card</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>Content in light mode</p>
            </Card.Content>
          </Card.Root>
        </div>
      </Theme>

      <Theme appearance="dark" className="flex-1 p-8 min-h-[400px]">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Dark Mode</h2>
          <Button>Primary Button</Button>
          <Card.Root>
            <Card.Header>
              <Card.Title>Dark Card</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>Content in dark mode</p>
            </Card.Content>
          </Card.Root>
        </div>
      </Theme>
    </div>
  ),
}

// ============================================================================
// Using Theme Context
// ============================================================================

const ThemeInfo: React.FC = () => {
  const theme = useThemeContext()

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Current Theme Settings</Card.Title>
      </Card.Header>
      <Card.Content>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Appearance:</dt>
          <dd className="font-medium">{theme.appearance}</dd>
          <dt className="text-muted-foreground">Accent Color:</dt>
          <dd className="font-medium">{theme.accentColor}</dd>
          <dt className="text-muted-foreground">Gray Color:</dt>
          <dd className="font-medium">{theme.resolvedGrayColor}</dd>
          <dt className="text-muted-foreground">Radius:</dt>
          <dd className="font-medium">{theme.radius}</dd>
          <dt className="text-muted-foreground">Scaling:</dt>
          <dd className="font-medium">{theme.scaling}</dd>
          <dt className="text-muted-foreground">Panel Background:</dt>
          <dd className="font-medium">{theme.panelBackground}</dd>
          <dt className="text-muted-foreground">Responsive Profile:</dt>
          <dd className="font-medium">{theme.typography.responsiveProfile}</dd>
        </dl>
      </Card.Content>
    </Card.Root>
  )
}

export const UsingContext: Story = {
  render: () => (
    <Theme accentColor="violet" radius="lg" className="min-h-screen p-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Theme Context</h1>
        <p className="text-muted-foreground">Use the useThemeContext hook to access theme settings.</p>
        <ThemeInfo />
      </div>
    </Theme>
  ),
}

// ============================================================================
// Nested Themes
// ============================================================================

export const NestedThemes: Story = {
  render: () => (
    <Theme accentColor="blue" className="p-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Outer Theme (Blue)</h2>
        <Button>Blue Button</Button>

        <Theme accentColor="green" className="p-4 border rounded-lg mt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Nested Theme (Green)</h3>
            <Button>Green Button</Button>

            <Theme accentColor="purple" className="p-4 border rounded-lg">
              <div className="space-y-4">
                <h4 className="font-bold">Deep Nested Theme (Purple)</h4>
                <Button>Purple Button</Button>
              </div>
            </Theme>
          </div>
        </Theme>
      </div>
    </Theme>
  ),
}

export const TypographyProfiles: Story = {
  render: () => {
    const profiles = ['compact', 'balanced', 'expressive'] as const

    return (
      <Box display="flex" className="flex-wrap gap-4 p-8">
        {profiles.map(profile => (
          <Theme key={profile} typography={{ responsiveProfile: profile }} className="w-[320px] rounded-xl border p-5">
            <div className="space-y-4">
              <div>
                <Text size="xs" variant="muted" className="block">
                  Responsive profile
                </Text>
                <Heading as="h3" size="2x">
                  {profile.charAt(0).toUpperCase() + profile.slice(1)}
                </Heading>
              </div>

              <Text size="md">
                The quick brown fox jumps over the lazy dog and adapts to the selected theme typography profile.
              </Text>

              <Link href="#" size="lg">
                Read profile docs
              </Link>

              <div className="flex items-center gap-3">
                <Code size="md">npm run build</Code>
                <Kbd size="md">⌘K</Kbd>
              </div>
            </div>
          </Theme>
        ))}
      </Box>
    )
  },
}

export const RhythmDebug: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6 p-8">
      <Text size="sm" className="max-w-3xl text-muted-foreground">
        Debug story for profile-driven rhythm work. It prints computed `Section` padding, `Card` padding, and
        `FieldGroup.Row` gap so profile changes can be validated numerically instead of by eye.
      </Text>
      <RhythmDebugRow label="Section" renderSample={profile => <SectionDebugSample profile={profile} />} />
      <RhythmDebugRow label="Card" renderSample={profile => <CardDebugSample profile={profile} />} />
      <RhythmDebugRow label="FieldGroup.Row" renderSample={profile => <FieldGroupRowDebugSample profile={profile} />} />
    </Box>
  ),
}

function RhythmDebugRow({
  label,
  renderSample,
}: {
  label: string
  renderSample: (profile: 'compact' | 'balanced' | 'expressive') => React.ReactNode
}) {
  const profiles = ['compact', 'balanced', 'expressive'] as const

  return (
    <div className="space-y-3">
      <Text size="xs" variant="muted" className="uppercase tracking-[0.14em]">
        {label}
      </Text>
      <Box display="grid" className="grid-cols-3 gap-4">
        {profiles.map(profile => (
          <div key={profile} className="rounded-xl border p-4">
            {renderSample(profile)}
          </div>
        ))}
      </Box>
    </div>
  )
}

function RhythmDebugHeader({
  profile,
  metricLabel,
  metricValue,
}: {
  profile: 'compact' | 'balanced' | 'expressive'
  metricLabel: string
  metricValue: string
}) {
  return (
    <div className="min-h-[9.5rem]">
      <Text size="xs" variant="muted" className="block">
        {profile}
      </Text>
      <Heading as="h3" size="2x">
        {profile.charAt(0).toUpperCase() + profile.slice(1)}
      </Heading>
      <Text size="xs" variant="muted" className="mt-2 block">
        {metricLabel} {metricValue || '...'}
      </Text>
    </div>
  )
}

function SectionDebugSample({ profile }: { profile: 'compact' | 'balanced' | 'expressive' }) {
  const sectionRef = React.useRef<HTMLElement | null>(null)
  const [paddingTop, setPaddingTop] = React.useState('')

  React.useLayoutEffect(() => {
    const read = () => {
      setPaddingTop(sectionRef.current ? window.getComputedStyle(sectionRef.current).paddingTop : '')
    }

    read()
    document.fonts?.ready.then(read)
  }, [])

  return (
    <Theme typography={{ responsiveProfile: profile }} className="rounded-xl border">
      <div className="space-y-8 p-6">
        <RhythmDebugHeader profile={profile} metricLabel="padding-top" metricValue={paddingTop} />
        <Section ref={sectionRef} size="4" className="rounded-xl border">
          <div className="rounded-lg border border-dashed border-border p-3">
            <Text size="sm">Section spacing sample</Text>
          </div>
        </Section>
      </div>
    </Theme>
  )
}

function CardDebugSample({ profile }: { profile: 'compact' | 'balanced' | 'expressive' }) {
  const cardRef = React.useRef<HTMLDivElement | null>(null)
  const [padding, setPadding] = React.useState('')

  React.useLayoutEffect(() => {
    const read = () => {
      setPadding(cardRef.current ? window.getComputedStyle(cardRef.current).paddingTop : '')
    }

    read()
    document.fonts?.ready.then(read)
  }, [])

  return (
    <Theme typography={{ responsiveProfile: profile }}>
      <div className="space-y-4">
        <RhythmDebugHeader profile={profile} metricLabel="padding" metricValue={padding} />
        <Card.Root ref={cardRef} size="xl">
          <Card.Header>
            <Card.Title>Card padding sample</Card.Title>
            <Card.Description>This block isolates card surface padding.</Card.Description>
          </Card.Header>
        </Card.Root>
      </div>
    </Theme>
  )
}

function FieldGroupRowDebugSample({ profile }: { profile: 'compact' | 'balanced' | 'expressive' }) {
  const rowRef = React.useRef<HTMLDivElement | null>(null)
  const [rowGap, setRowGap] = React.useState('')

  React.useLayoutEffect(() => {
    const read = () => {
      setRowGap(rowRef.current ? window.getComputedStyle(rowRef.current).rowGap : '')
    }

    read()
    document.fonts?.ready.then(read)
  }, [])

  return (
    <Theme typography={{ responsiveProfile: profile }}>
      <div className="space-y-4">
        <RhythmDebugHeader profile={profile} metricLabel="row gap" metricValue={rowGap} />
        <div className="rounded-xl border p-4">
          <FieldGroup layout="side-labels">
            <FieldGroup.Row ref={rowRef} label="First name" description="Measured row">
              <TextField size="sm" aria-label={`${profile} first name`} placeholder="Ada" />
            </FieldGroup.Row>
            <FieldGroup.Row label="Last name" description="Reference row">
              <TextField size="sm" aria-label={`${profile} last name`} placeholder="Lovelace" />
            </FieldGroup.Row>
          </FieldGroup>
        </div>
      </div>
    </Theme>
  )
}
