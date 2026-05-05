import { capitalize } from '@/utils/strings'
import { BLACK, HUE_NAMES, type HueName, WHITE } from './tokens'

export interface HueSwatchSeed {
  label: string
  swatchColor: string
}

export const HUE_SWATCH_SEEDS: readonly HueSwatchSeed[] = [
  { label: 'Black', swatchColor: BLACK },
  { label: 'White', swatchColor: WHITE },
  ...HUE_NAMES.map(
    (hue: HueName): HueSwatchSeed => ({
      label: capitalize(hue),
      swatchColor: `var(--${hue}-9)`,
    }),
  ),
] as const
