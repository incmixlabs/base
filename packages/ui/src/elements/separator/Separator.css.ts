import { styleVariants } from '@vanilla-extract/css'
import type { separatorPropDefs } from './separator.props'

export type SeparatorSize = (typeof separatorPropDefs.size.values)[number]

export const separatorSizeVariants: Record<SeparatorSize, string> = styleVariants({
  xs: { vars: { '--separator-width': '1px' } },
  sm: { vars: { '--separator-width': '2px' } },
  md: { vars: { '--separator-width': '4px' } },
  lg: { vars: { '--separator-width': '8px' } },
})
