import { createControlButtonPropDefs } from '@/elements/control-button-props'
import { surfaceVariants } from '@/elements/surface/surface.props'
import type { PropDef } from '@/theme/props/prop-def'

const baseTablePaginationPropDefs = createControlButtonPropDefs({
  variants: surfaceVariants,
  defaultVariant: 'surface',
})

const pageLabelPropDef = {
  type: 'string',
  default: undefined,
} as const satisfies PropDef<string | undefined>

export const tablePaginationPropDefs = {
  ...baseTablePaginationPropDefs,
  prevLabel: pageLabelPropDef,
  nextLabel: pageLabelPropDef,
} as const
