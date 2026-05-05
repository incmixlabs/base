import { Grid } from '@bwalkt/ui/layouts'
import { semanticColors } from '@bwalkt/ui/theme'
import { Heading } from '@bwalkt/ui/typography/heading/Heading'
import { Text } from '@bwalkt/ui/typography/text/Text'

const baseTokens = [
  { name: 'background', cssVar: '--background', description: 'App page background.' },
  { name: 'foreground', cssVar: '--foreground', description: 'Default foreground/text context.' },
  { name: 'surface', cssVar: '--color-surface', description: 'Neutral surface for cards and panels.' },
  { name: 'border', cssVar: '--border', description: 'Default border token.' },
] as const

const semanticTokenKinds = [
  { suffix: 'soft', label: 'soft', description: 'Low-emphasis semantic surface.' },
  { suffix: 'border', label: 'border', description: 'Semantic border treatment.' },
  { suffix: 'text', label: 'text', description: 'Readable semantic foreground color.' },
] as const

const semanticTokens = semanticColors.flatMap(color =>
  semanticTokenKinds.map(kind => ({
    name: `${color} ${kind.label}`,
    cssVar: `--color-${color}-${kind.suffix}`,
    description: `${kind.description} Lane: ${color}.`,
  })),
)

function SwatchCard({ name, cssVar, description }: { name: string; cssVar: string; description: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <Heading as="h3" size="sm">
            {name}
          </Heading>
          <Text size="xs" className="mt-1 text-muted-foreground">
            {description}
          </Text>
        </div>
        <div
          className="h-10 w-10 shrink-0 rounded-full border border-border/70"
          style={{ backgroundColor: `var(${cssVar})` }}
        />
      </div>
      <Text size="xs" className="mt-3 text-muted-foreground">
        {`var(${cssVar})`}
      </Text>
    </div>
  )
}

export function TokenGrid() {
  return (
    <>
      <Heading as="h1" size="3x">
        Token Grid
      </Heading>
      <Text size="xl" className="mt-3 max-w-3xl text-muted-foreground">
        Semantic tokens sit above the raw palette. Use these when you want UI intent such as surface, border, text, or
        status treatment instead of choosing raw hue steps directly.
      </Text>

      <Heading as="h2" size="lg" id="base-ui-tokens" data-heading className="mt-10">
        Base UI Tokens
      </Heading>
      <Grid columns={{ initial: '1', md: '2' }} gap="4" mt="6">
        {baseTokens.map(token => (
          <SwatchCard key={token.cssVar} {...token} />
        ))}
      </Grid>

      <Heading as="h2" size="lg" id="semantic-color-tokens" data-heading className="mt-10">
        Semantic Color Tokens
      </Heading>
      <Text size="sm" className="mt-3 max-w-3xl text-muted-foreground">
        These tokens are the stable design-system layer. Theme generation can change the underlying palette values while
        these semantic names stay consistent.
      </Text>
      <Grid columns={{ initial: '1', md: '2' }} gap="4" mt="6">
        {semanticTokens.map(token => (
          <SwatchCard key={token.cssVar} {...token} />
        ))}
      </Grid>
    </>
  )
}
