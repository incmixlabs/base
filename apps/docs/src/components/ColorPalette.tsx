import { Callout } from '@incmix/ui/elements'
import { Flex, Grid } from '@incmix/ui/layouts'
import { Heading } from '@incmix/ui/typography/heading/Heading'
import { Text } from '@incmix/ui/typography/text/Text'
import { HUE_NAMES } from '@/theme/tokens'

const ALL_HUES = HUE_NAMES

const STEPS = [6, 7, 8, 9, 10, 11] as const

const STEP_LABELS: Record<number | string, string> = {
  6: 'Soft bg',
  7: 'Soft hover',
  8: 'Border',
  9: 'Solid',
  10: 'Solid hover',
  11: 'Text',
  contrast: 'Contrast',
}

function AvailableColors() {
  return (
    <Grid columns={{ initial: '4', sm: '6', md: '9' }} gap="4" mt="6">
      {ALL_HUES.map(hue => (
        <Flex key={hue} direction="column" align="center" gap="1">
          <div
            className="h-14 w-14 rounded-lg shadow-sm"
            style={{ backgroundColor: `var(--${hue}-9)` }}
            title={`--${hue}-9`}
          />
          <Text size="xs" className="capitalize text-muted-foreground">
            {hue}
          </Text>
        </Flex>
      ))}
    </Grid>
  )
}

function ShadeScale() {
  const columns = [...STEPS.map(String), 'contrast']

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="w-20 pb-2 text-left">
              <Text size="xs" className="font-medium text-muted-foreground">
                Color
              </Text>
            </th>
            {columns.map(col => (
              <th key={col} className="pb-2 text-center">
                <Text size="xs" className="font-medium text-muted-foreground">
                  {col}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALL_HUES.map(hue => (
            <tr key={hue}>
              <td className="py-1 pr-3">
                <Text size="xs" className="capitalize text-muted-foreground">
                  {hue}
                </Text>
              </td>
              {STEPS.map(step => (
                <td key={step} className="p-1">
                  <div
                    className="mx-auto h-8 w-full min-w-8 rounded"
                    style={{ backgroundColor: `var(--${hue}-${step})` }}
                    title={`--${hue}-${step}: ${STEP_LABELS[step]}`}
                  />
                </td>
              ))}
              <td className="p-1">
                <Flex
                  align="center"
                  justify="center"
                  className="mx-auto h-8 w-full min-w-8 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `var(--${hue}-9)`,
                    color: `var(--${hue}-contrast)`,
                  }}
                  title={`--${hue}-contrast`}
                >
                  Aa
                </Flex>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ColorPalette() {
  return (
    <>
      <Heading as="h2" size="lg" id="available-palette-colors" data-heading className="mt-10">
        Available palette colors
      </Heading>
      <Text size="sm" className="mt-3 text-muted-foreground">
        There are 19 accent colors plus gray to choose from. Each is derived from Radix Colors and converted to OKLCh
        for perceptual uniformity.
      </Text>
      <AvailableColors />

      <Heading as="h2" size="lg" id="shade-scale-anatomy" data-heading className="mt-10">
        Shade scale anatomy
      </Heading>
      <Text size="sm" className="mt-3 text-muted-foreground">
        Each color provides 6 shades plus a contrast token. Steps 4-5 are soft backgrounds, 7 is used for surfaces, 7-9
        cover border and primary emphasis, 11 is for tinted text, and contrast is the text color used on top of the
        primary (step 9) background.
      </Text>
      <ShadeScale />

      <Callout.Root variant="surface" color="info" className="mt-6">
        <Callout.Text>
          Step 11 is a tinted text color for use on page or soft backgrounds (steps 4-5). The contrast token is for text
          on primary fills (step 9). Do not pair step 11 with step 9. Use contrast instead.
        </Callout.Text>
      </Callout.Root>
    </>
  )
}
