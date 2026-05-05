'use client'

import { Avatar, Badge, Button, Callout, Card } from '@bwalkt/ui/elements'
import { FieldGroup, RadioCards, Slider, Textarea, TextField } from '@bwalkt/ui/form'
import { MiniCalendarNext } from '@bwalkt/ui/form/date'
import { Section } from '@bwalkt/ui/layouts/section/Section'
import { readThemeResponsiveProfileSignals, useThemeContext } from '@bwalkt/ui/theme'
import { Heading } from '@bwalkt/ui/typography/heading/Heading'
import { Text } from '@bwalkt/ui/typography/text/Text'
import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'

type PreviewTokens = {
  primaryColor: string
  background: string
  radius: string
  fontSans: string
  fontSerif: string
  responsiveProfile: string
  textScale: string
  headingScale: string
  cardPaddingMd: string
  sectionSpace4: string
  fieldRowGap: string
}

type PreviewMetrics = {
  sectionPaddingTop: string
  cardPaddingTop: string
  fieldRowGap: string
}

const previewColors = [
  'slate',
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
  'inverse',
  'light',
  'dark',
] as const

const EMPTY_PREVIEW_TOKENS: PreviewTokens = {
  primaryColor: '',
  background: '',
  radius: '',
  fontSans: '',
  fontSerif: '',
  responsiveProfile: '',
  textScale: '',
  headingScale: '',
  cardPaddingMd: '',
  sectionSpace4: '',
  fieldRowGap: '',
}

const EMPTY_PREVIEW_METRICS: PreviewMetrics = {
  sectionPaddingTop: '',
  cardPaddingTop: '',
  fieldRowGap: '',
}

function getToken(styles: CSSStyleDeclaration, name: string) {
  return styles.getPropertyValue(name).trim()
}

function getElementMetric<T extends HTMLElement>(element: T | null, metric: 'paddingTop' | 'rowGap') {
  return element ? getComputedStyle(element)[metric] : ''
}

function getPreviewTokens(styles: CSSStyleDeclaration): PreviewTokens {
  const profileSignals = readThemeResponsiveProfileSignals(styles)

  return {
    primaryColor: getToken(styles, '--color-primary-primary'),
    background: getToken(styles, '--background'),
    radius: getToken(styles, '--radius'),
    fontSans: getToken(styles, '--font-sans'),
    fontSerif: getToken(styles, '--font-serif'),
    responsiveProfile: profileSignals.responsiveProfile,
    textScale: profileSignals.textScale,
    headingScale: profileSignals.headingScale,
    cardPaddingMd: profileSignals.cardPaddingMd,
    sectionSpace4: profileSignals.sectionSpace4,
    fieldRowGap: profileSignals.fieldGroupRowGap,
  }
}

function getPreviewMetrics(args: {
  section: HTMLElement | null
  card: HTMLDivElement | null
  fieldRow: HTMLDivElement | null
}): PreviewMetrics {
  return {
    sectionPaddingTop: getElementMetric(args.section, 'paddingTop'),
    cardPaddingTop: getElementMetric(args.card, 'paddingTop'),
    fieldRowGap: getElementMetric(args.fieldRow, 'rowGap'),
  }
}

export const Route = createFileRoute('/docs/preview')({
  component: PreviewPage,
})

function PreviewPage() {
  const theme = useThemeContext()
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [priority, setPriority] = React.useState('balanced')
  const [risk, setRisk] = React.useState([42])
  const previewRef = React.useRef<HTMLDivElement | null>(null)
  const sectionRef = React.useRef<HTMLElement | null>(null)
  const cardRef = React.useRef<HTMLDivElement | null>(null)
  const fieldRowRef = React.useRef<HTMLDivElement | null>(null)
  const [tokens, setTokens] = React.useState<PreviewTokens>(EMPTY_PREVIEW_TOKENS)
  const [metrics, setMetrics] = React.useState<PreviewMetrics>(EMPTY_PREVIEW_METRICS)

  React.useLayoutEffect(() => {
    let disposed = false
    const read = () => {
      if (disposed) return
      const root = previewRef.current
      if (!root) return
      const styles = getComputedStyle(root)
      setTokens(getPreviewTokens(styles))
      setMetrics(
        getPreviewMetrics({
          section: sectionRef.current,
          card: cardRef.current,
          fieldRow: fieldRowRef.current,
        }),
      )
    }

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            read()
          })
        : null

    if (previewRef.current) resizeObserver?.observe(previewRef.current)
    window.addEventListener('resize', read)

    read()
    document.fonts?.ready.then(() => {
      if (!disposed) read()
    })

    return () => {
      disposed = true
      resizeObserver?.disconnect()
      window.removeEventListener('resize', read)
    }
  }, [
    theme.accentColor,
    theme.appearance,
    theme.radius,
    theme.scaling,
    theme.typography.fontSans,
    theme.typography.fontSerif,
    theme.typography.fontSources,
    theme.typography.responsiveProfile,
  ])

  return (
    <div ref={previewRef} className="docs-prose">
      <Heading as="h1" size="2x">
        Preview
      </Heading>
      <Text size="sm" className="mt-3 text-muted-foreground">
        Live preview for ThemePanel changes. Use the <strong>Typography → Responsive Profile</strong> control to switch
        between <code>compact</code>, <code>balanced</code>, and <code>expressive</code>, or swap font sources and
        verify the live type and rhythm changes below.
      </Text>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border/70">
        <div className="bg-primary px-5 py-6 text-primary-foreground">
          <Text size="xs" className="uppercase tracking-[0.18em] opacity-80">
            Live Theme Signals
          </Text>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-6">
            <TokenCell label="--color-primary-primary" value={tokens.primaryColor} />
            <TokenCell label="--background" value={tokens.background} />
            <TokenCell label="--radius" value={tokens.radius} />
            <TokenCell label="--font-sans" value={tokens.fontSans} />
            <TokenCell label="--font-serif" value={tokens.fontSerif} />
            <TokenCell
              label="responsiveProfile"
              value={tokens.responsiveProfile || theme.typography.responsiveProfile}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border/70">
        <div className="bg-muted/40 px-5 py-6">
          <Text size="xs" className="uppercase tracking-[0.18em] text-muted-foreground">
            Responsive Profile Signals
          </Text>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-6">
            <TokenCell label="text scale" value={tokens.textScale} />
            <TokenCell label="heading scale" value={tokens.headingScale} />
            <TokenCell label="card md padding" value={tokens.cardPaddingMd} />
            <TokenCell label="section size 4" value={tokens.sectionSpace4} />
            <TokenCell label="field row gap" value={tokens.fieldRowGap} />
            <TokenCell label="active profile" value={theme.typography.responsiveProfile} />
          </div>
        </div>
      </div>

      <Callout.Root variant="surface" color="warning" className="mt-6">
        <Callout.Text>
          If ThemePanel changes are applied, the live CSS-variable cells and the measured `Section`, `Card`, and
          `FieldGroup.Row` values below should update immediately.
        </Callout.Text>
      </Callout.Root>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card.Root className="space-y-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <Heading as="h2" size="md">
              Intake
            </Heading>
            <div className="flex items-center gap-2">
              <Avatar name="Ava Walker" size="xs" />
              <Badge size="xs" variant="soft" color="primary">
                Draft
              </Badge>
            </div>
          </div>

          <TextField size="xs" label="Project name" placeholder="Q2 Revenue Attribution" />
          <TextField size="xs" label="Owner" placeholder="Alex Morgan" />
          <Textarea size="xs" label="Summary" placeholder="Short brief for the team..." />

          <div className="flex flex-wrap gap-2">
            <Button size="xs">Save draft</Button>
            <Button size="xs" variant="soft" color="secondary">
              Request review
            </Button>
          </div>

          <div className="rounded-lg border border-border/70 p-3">
            <Text size="xs" className="mb-2 block text-muted-foreground">
              Color Matrix (Buttons)
            </Text>
            <div className="flex flex-wrap gap-2">
              {previewColors.map(color => (
                <Button key={`solid-${color}`} size="xs" color={color}>
                  {color}
                </Button>
              ))}
            </div>
          </div>
        </Card.Root>

        <div className="grid gap-6">
          <Card.Root className="space-y-3 p-4">
            <Heading as="h3" size="sm">
              Scheduling
            </Heading>
            <MiniCalendarNext size="sm" value={date} onChange={setDate} color="primary" />
          </Card.Root>

          <Card.Root className="space-y-3 p-4">
            <Heading as="h3" size="sm">
              Risk Tuning
            </Heading>
            <Text size="xs" className="text-muted-foreground">
              Confidence threshold: {risk[0]}%
            </Text>
            <Slider size="xs" value={risk} onValueChange={setRisk} min={0} max={100} step={1} />

            <RadioCards.Root value={priority} onValueChange={setPriority} columns={3} size="xs">
              <RadioCards.Item value="fast">
                <strong>Fast</strong>
                <Text size="xs" className="mt-1 block text-muted-foreground">
                  Bias speed
                </Text>
              </RadioCards.Item>
              <RadioCards.Item value="balanced">
                <strong>Balanced</strong>
                <Text size="xs" className="mt-1 block text-muted-foreground">
                  Team default
                </Text>
              </RadioCards.Item>
              <RadioCards.Item value="safe">
                <strong>Safe</strong>
                <Text size="xs" className="mt-1 block text-muted-foreground">
                  Reduce risk
                </Text>
              </RadioCards.Item>
            </RadioCards.Root>
          </Card.Root>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <Heading as="h2" size="lg">
            Responsive Profile Surface
          </Heading>
          <Text size="sm" className="mt-2 text-muted-foreground">
            This section is intentionally small. Toggle the responsive profile in ThemePanel and verify both the numeric
            readouts and the visible spacing changes.
          </Text>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Section ref={sectionRef} size="4" className="rounded-2xl border border-border/70">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text size="xs" className="uppercase tracking-[0.18em] text-muted-foreground">
                    Section
                  </Text>
                  <Heading as="h3" size="md">
                    Profile-sensitive spacing
                  </Heading>
                </div>
                <MeasuredBadge label="padding-top" value={metrics.sectionPaddingTop} />
              </div>

              <Card.Root ref={cardRef} size="xl">
                <Card.Header>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Card.Title>Card rhythm sample</Card.Title>
                      <Card.Description>
                        Card padding should tighten in compact mode and open up in expressive mode.
                      </Card.Description>
                    </div>
                    <MeasuredBadge label="card padding" value={metrics.cardPaddingTop} />
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="flex flex-wrap gap-2">
                    <Badge size="xs" variant="soft" color="primary">
                      Active
                    </Badge>
                    <Badge size="xs" variant="soft" color="secondary">
                      Preview
                    </Badge>
                    <Badge size="xs" variant="soft" color="accent">
                      Profile
                    </Badge>
                  </div>
                </Card.Content>
              </Card.Root>
            </div>
          </Section>

          <Card.Root className="space-y-4 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Text size="xs" className="uppercase tracking-[0.18em] text-muted-foreground">
                  FieldGroup.Row
                </Text>
                <Heading as="h3" size="md">
                  Side-label form rhythm
                </Heading>
              </div>
              <MeasuredBadge label="row gap" value={metrics.fieldRowGap} />
            </div>
            <FieldGroup layout="side-labels">
              <FieldGroup.Row ref={fieldRowRef} label="First name" description="Measured row spacing">
                <TextField size="sm" placeholder="Ada" />
              </FieldGroup.Row>
              <FieldGroup.Row label="Last name" description="Reference row">
                <TextField size="sm" placeholder="Lovelace" />
              </FieldGroup.Row>
              <FieldGroup.Row label="Notes" description="Text rhythm and field spacing">
                <Textarea size="sm" placeholder="Profile-sensitive field layout..." />
              </FieldGroup.Row>
            </FieldGroup>
          </Card.Root>
        </div>
      </div>
    </div>
  )
}

function TokenCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 p-2">
      <Text size="xs" className="opacity-80">
        {label}
      </Text>
      <code className="mt-1 block text-xs">{value || 'n/a'}</code>
    </div>
  )
}

function MeasuredBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-right">
      <Text size="xs" className="block text-muted-foreground">
        {label}
      </Text>
      <code className="mt-1 block text-xs">{value || 'n/a'}</code>
    </div>
  )
}
