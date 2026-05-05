import type { PropDef } from '@/theme/props/prop-def'
import { sizesXsToLg } from '@/theme/props/scales'

const stepperOrientations = ['horizontal', 'vertical'] as const
const stepperVariants = ['default', 'pill', 'minimal'] as const
const stepperSizes = sizesXsToLg

const stepperPropDefs = {
  orientation: { type: 'enum', values: stepperOrientations, default: 'horizontal' },
  variant: { type: 'enum', values: stepperVariants, default: 'default' },
  size: { type: 'enum', values: stepperSizes, default: 'md', responsive: true },
  allowStepSelect: { type: 'boolean', default: true },
  showControls: { type: 'boolean', default: true },
} satisfies {
  orientation: PropDef<(typeof stepperOrientations)[number]>
  variant: PropDef<(typeof stepperVariants)[number]>
  size: PropDef<(typeof stepperSizes)[number]>
  allowStepSelect: PropDef<boolean>
  showControls: PropDef<boolean>
}

export { stepperOrientations, stepperPropDefs, stepperSizes, stepperVariants }
