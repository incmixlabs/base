import { LiveCodeBlock, ThemesPropsTable } from '@incmix/ui/editor/docs'
import { Callout, Card, GradientBackground, type GradientPresetKey, gradientPresets } from '@incmix/ui/elements'
import { Slider, TextField } from '@incmix/ui/form'
import { Flex } from '@incmix/ui/layouts'
import { Code } from '@incmix/ui/typography'
import { Heading } from '@incmix/ui/typography/heading/Heading'
import { Text } from '@incmix/ui/typography/text/Text'
import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { HUE_NAMES } from '@/theme/tokens'

export const Route = createFileRoute('/docs/theme/gradient')({
  component: GradientDocsPage,
})

const presetKeys = Object.keys(gradientPresets) as GradientPresetKey[]

const gradientPreviewScope = {
  Card,
  Flex,
  GradientBackground,
  Heading,
  Text,
}

const gradientEditableExample = `<GradientBackground
  as="Box"
  preset="tropical"
  radius="lg"
  p="6"
  minHeight="10rem"
  style={{ color: '#fff' }}
>
  <Flex direction="column" gap="2">
    <Heading as="h3" size="lg" weight="medium">
      Editable gradient
    </Heading>
    <Text size="sm" style={{ opacity: 0.82 }}>
      Change as, preset, padding, radius, colors, or duration.
    </Text>
  </Flex>
</GradientBackground>`

function PresetGallery() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {presetKeys.map(key => (
        <GradientBackground key={key} preset={key} radius="lg" duration={15} style={{ minHeight: 100 }}>
          <Flex align="center" justify="center" className="h-full p-4" style={{ color: '#fff' }}>
            <Text size="sm" weight="medium">
              {gradientPresets[key].name}
            </Text>
          </Flex>
        </GradientBackground>
      ))}
    </div>
  )
}

const COMPOSER_HUES = HUE_NAMES.filter(h => h !== 'gray')
const COMPOSER_STEPS = [5, 6, 7, 8, 9, 10, 11, 12] as const

function GradientComposer() {
  const [stops, setStops] = React.useState<string[]>([
    'var(--teal-6)',
    'var(--blue-9)',
    'var(--purple-9)',
    'var(--pink-8)',
  ])
  const [duration, setDuration] = React.useState(12)
  const [direction, setDirection] = React.useState(135)

  function handleDurationInputChange(value: string) {
    if (value === '') return
    const next = Number(value)
    if (Number.isFinite(next)) {
      setDuration(Math.min(30, Math.max(0, next)))
    }
  }

  function handleDirectionInputChange(value: string) {
    if (value === '') return
    const next = Number(value)
    if (Number.isFinite(next)) {
      const clamped = Math.min(360, Math.max(0, next))
      setDirection(Math.round(clamped / 15) * 15)
    }
  }

  function toggleStop(token: string) {
    setStops(prev => {
      const idx = prev.indexOf(token)
      if (idx >= 0) return prev.filter((_, i) => i !== idx)
      if (prev.length >= 6) return prev
      return [...prev, token]
    })
  }

  const previewStops = stops.length >= 2 ? stops : ['var(--gray-6)', 'var(--gray-8)']

  const codeSnippet = `<GradientBackground
  colors={[
${previewStops.map(s => `    '${s}',`).join('\n')}
  ]}
  duration={${duration}}
  direction={${direction}}
  radius="lg"
/>`

  return (
    <div className="mt-6 space-y-4">
      <GradientBackground
        colors={previewStops}
        duration={duration}
        direction={direction}
        radius="lg"
        style={{ minHeight: 140 }}
      >
        <Flex align="center" justify="center" className="h-full p-6" style={{ color: '#fff' }}>
          <Text size="sm" weight="medium">
            {stops.length >= 2
              ? stops.map(s => s.replace('var(--', '').replace(')', '')).join(' → ')
              : 'Pick at least 2 colors'}
          </Text>
        </Flex>
      </GradientBackground>

      <Flex wrap="wrap" align="end" gap="4">
        <Flex direction="column" gap="1" style={{ width: 180 }}>
          <Text as="label" size="xs" className="text-muted-foreground">
            Duration (seconds)
          </Text>
          <Flex align="center" gap="2">
            <Slider
              size="sm"
              min={0}
              max={30}
              step={1}
              value={[duration]}
              onValueChange={([v]) => setDuration(v ?? 0)}
              aria-label="Gradient animation duration in seconds"
              className="flex-1"
            />
            <TextField
              size="sm"
              type="number"
              min={0}
              max={30}
              value={String(duration)}
              onChange={e => handleDurationInputChange(e.target.value)}
              className="w-14 tabular-nums"
              aria-label="Duration value"
            />
          </Flex>
        </Flex>
        <Flex direction="column" gap="1" style={{ width: 180 }}>
          <Text as="label" size="xs" className="text-muted-foreground">
            Angle (degrees)
          </Text>
          <Flex align="center" gap="2">
            <Slider
              size="sm"
              min={0}
              max={360}
              step={15}
              value={[direction]}
              onValueChange={([v]) => setDirection(v ?? 0)}
              aria-label="Gradient angle in degrees"
              className="flex-1"
            />
            <TextField
              size="sm"
              type="number"
              min={0}
              max={360}
              step={15}
              value={String(direction)}
              onChange={e => handleDirectionInputChange(e.target.value)}
              className="w-14 tabular-nums"
              aria-label="Angle value"
            />
          </Flex>
        </Flex>
        {stops.length > 0 && (
          <button
            type="button"
            onClick={() => setStops([])}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </Flex>

      <div className="overflow-x-auto rounded-lg border border-border/60 p-3">
        <Text size="xs" className="mb-2 font-medium text-muted-foreground">
          Click to add/remove stops (max 6)
        </Text>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" className="w-16 pb-1 text-left">
                <Text size="xs" className="text-muted-foreground">
                  Scale
                </Text>
              </th>
              {COMPOSER_STEPS.map(step => (
                <th key={step} scope="col" className="pb-1 text-center">
                  <Text size="xs" className="text-muted-foreground">
                    {step}
                  </Text>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPOSER_HUES.map(hue => (
              <tr key={hue}>
                <th scope="row" className="py-0.5 pr-2 text-left">
                  <Text size="xs" className="capitalize text-muted-foreground">
                    {hue}
                  </Text>
                </th>
                {COMPOSER_STEPS.map(step => {
                  const token = `var(--${hue}-${step})`
                  const isSelected = stops.includes(token)
                  const orderIndex = stops.indexOf(token)
                  return (
                    <td key={step} className="p-0.5">
                      <button
                        type="button"
                        aria-label={`${isSelected ? 'Remove' : 'Add'} ${hue} ${step} gradient stop`}
                        aria-pressed={isSelected}
                        onClick={() => toggleStop(token)}
                        className="relative block h-7 w-full rounded transition-shadow"
                        style={{
                          backgroundColor: token,
                          boxShadow: isSelected
                            ? '0 0 0 2px var(--color-background), 0 0 0 4px var(--blue-9)'
                            : undefined,
                        }}
                        title={`--${hue}-${step}`}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-sm">
                            {orderIndex + 1}
                          </span>
                        )}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <Text size="xs" className="font-medium text-muted-foreground">
            Generated code
          </Text>
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(codeSnippet)}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Copy
          </button>
        </div>
        <pre className="mt-2 text-xs">
          <code>{codeSnippet}</code>
        </pre>
      </div>
    </div>
  )
}

function RecipeSteps() {
  return (
    <div className="mt-6 space-y-3">
      <Flex direction="column" gap="3">
        <Text size="sm">
          <strong>1.</strong> Pick 3–4 colors from <em>different</em> scales or distant steps within a scale (e.g. step
          6 and step 11) for visible contrast.
        </Text>
        <Text size="sm">
          <strong>2.</strong> Use{' '}
          <Code className="text-xs">
            var(--{'<color>'}-{'<step>'})
          </Code>{' '}
          to stay on the design system — they adapt to light/dark mode automatically.
        </Text>
        <Text size="sm">
          <strong>3.</strong> Steps 8–9 are the most saturated. Mix with lighter steps (5–7) or darker steps (10–12) for
          depth.
        </Text>
        <Text size="sm">
          <strong>4.</strong> Adjacent hues (e.g. blue + indigo) produce subtle gradients. Distant hues (e.g. orange +
          violet) produce dramatic ones.
        </Text>
      </Flex>
    </div>
  )
}

function GradientDocsPage() {
  return (
    <>
      <Heading as="h1" size="2x" id="gradient-background" data-heading>
        Gradient Background
      </Heading>
      <Text size="sm" className="mt-3 text-muted-foreground">
        Animated gradient backgrounds using design system color tokens. Choose a built-in preset or compose custom
        gradients from the palette.
      </Text>

      <Heading as="h2" size="lg" id="presets" data-heading className="mt-10">
        Presets
      </Heading>
      <Text size="sm" className="mt-3 text-muted-foreground">
        Built-in presets use palette tokens and adapt to light/dark mode.
      </Text>
      <PresetGallery />

      <Heading as="h2" size="lg" id="custom-gradient" data-heading className="mt-10">
        Custom gradient
      </Heading>
      <Text size="sm" className="mt-3 text-muted-foreground">
        Pass your own color stops via the <Code className="text-xs">colors</Code> prop. Use palette tokens to stay on
        the design system.
      </Text>
      <GradientComposer />

      <Heading as="h2" size="lg" id="recipe" data-heading className="mt-10">
        Recipe
      </Heading>
      <RecipeSteps />

      <Callout.Root variant="surface" color="info" className="mt-6">
        <Callout.Text>
          Always use palette vars like <Code className="text-xs">var(--blue-9)</Code> instead of raw hex values. This
          keeps gradients in sync with the theme and ensures automatic light/dark adaptation.
        </Callout.Text>
      </Callout.Root>

      <Heading as="h2" size="lg" id="primitive-props" data-heading className="mt-10">
        Rendering as primitives
      </Heading>
      <Text size="sm" className="mt-3 text-muted-foreground">
        Use the <Code className="text-xs">as</Code> prop to render the gradient as Box, Card, or Container and pass that
        primitive's layout props directly.
      </Text>
      <div className="mt-6">
        <LiveCodeBlock initialCode={gradientEditableExample} scope={gradientPreviewScope} />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <Text size="xs" className="mb-2 font-medium text-muted-foreground">
            as="Box"
          </Text>
          <GradientBackground as="Box" preset="tropical" radius="lg" p="6" style={{ color: '#fff', minHeight: 100 }}>
            <Text size="sm" weight="medium">
              Box props pass through.
            </Text>
          </GradientBackground>
          <div className="mt-2 rounded-lg border border-border/60 bg-muted/30 p-3">
            <Code className="text-xs">
              {`<GradientBackground as="Box" preset="tropical" p="6">
  {children}
</GradientBackground>`}
            </Code>
          </div>
        </div>
        <div>
          <Text size="xs" className="mb-2 font-medium text-muted-foreground">
            as="Card"
          </Text>
          <GradientBackground as="Card" preset="aurora" radius="lg" size="sm">
            <Card.Header>
              <Card.Title>Card with gradient</Card.Title>
              <Card.Description>Card props pass through.</Card.Description>
            </Card.Header>
          </GradientBackground>
          <div className="mt-2 rounded-lg border border-border/60 bg-muted/30 p-3">
            <Code className="text-xs">
              {`<GradientBackground as="Card" preset="aurora" size="sm">
  <Card.Header>...</Card.Header>
</GradientBackground>`}
            </Code>
          </div>
        </div>
        <div>
          <Text size="xs" className="mb-2 font-medium text-muted-foreground">
            as="Container"
          </Text>
          <GradientBackground
            as="Container"
            preset="cosmic"
            radius="lg"
            size="2"
            px="4"
            py="6"
            style={{ color: '#fff' }}
          >
            <Text size="sm" weight="medium">
              Container props pass through.
            </Text>
          </GradientBackground>
          <div className="mt-2 rounded-lg border border-border/60 bg-muted/30 p-3">
            <Code className="text-xs">
              {`<GradientBackground as="Container" preset="cosmic" size="2" px="4" py="6">
  {children}
</GradientBackground>`}
            </Code>
          </div>
        </div>
      </div>

      <Heading as="h2" size="lg" id="props" data-heading className="mt-10">
        Props
      </Heading>
      <ThemesPropsTable defs="gradientBackgroundPropDefs" />
    </>
  )
}
