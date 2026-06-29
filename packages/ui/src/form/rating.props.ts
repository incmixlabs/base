import { colorPropDef } from '../theme/props/color.prop'
import type { PropDef } from '../theme/props/prop-def'

const ratingSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const
const ratingSteps = [0.5, 1] as const
const ratingOrientations = ['horizontal', 'vertical'] as const
const ratingActivationModes = ['automatic', 'manual'] as const

export type RatingSize = (typeof ratingSizes)[number]
export type RatingStep = (typeof ratingSteps)[number]
export type RatingOrientation = (typeof ratingOrientations)[number]
export type RatingActivationMode = (typeof ratingActivationModes)[number]

const ratingPropDefs = {
  size: { type: 'enum', values: ratingSizes, default: 'md' },
  ...colorPropDef,
  max: { type: 'number', default: 5 },
  step: { type: 'enum', values: ratingSteps, default: 1 },
  clearable: { type: 'boolean', default: false },
  disabled: { type: 'boolean', default: false },
  readOnly: { type: 'boolean', default: false },
  orientation: { type: 'enum', values: ratingOrientations, default: 'horizontal' },
  activationMode: { type: 'enum', values: ratingActivationModes, default: 'automatic' },
} satisfies {
  size: PropDef<RatingSize>
  max: PropDef<number>
  step: PropDef<RatingStep>
  clearable: PropDef<boolean>
  disabled: PropDef<boolean>
  readOnly: PropDef<boolean>
  orientation: PropDef<RatingOrientation>
  activationMode: PropDef<RatingActivationMode>
}

export { ratingActivationModes, ratingOrientations, ratingPropDefs, ratingSizes, ratingSteps }
