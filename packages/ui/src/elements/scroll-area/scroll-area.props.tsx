import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef, semanticColors } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { sizesNoneToMd, variantsSolidSoftSurfaceOutline } from '@/theme/props/scales'

const sizes = sizesNoneToMd
const types = ['auto', 'always', 'hover'] as const
const scrollbarsValues = ['vertical', 'horizontal', 'both', 'auto'] as const
const variants = variantsSolidSoftSurfaceOutline
const surfaceVariants = ['soft', 'solid', 'surface'] as const
const trackShapes = ['line', 'circle'] as const
const thumbStyles = ['default', 'dot'] as const
const railTones = ['auto', 'light', 'dark'] as const
const arrowTones = ['auto', 'light', 'dark'] as const
const thicknesses = ['thin', 'thick'] as const
const trackerStyles = ['line', 'dot'] as const

const scrollAreaPropDefs = {
  ...asChildPropDef,
  size: { type: 'enum', values: sizes, default: 'sm', responsive: true },
  type: { type: 'enum', values: types, default: 'hover' },
  variant: { type: 'enum', values: variants, default: 'soft' },
  ...colorPropDef,
  surfaceColor: {
    type: 'enum',
    values: semanticColors,
    default: 'neutral' as (typeof semanticColors)[number],
  },
  surfaceVariant: {
    type: 'enum',
    values: surfaceVariants,
    default: 'surface',
  },
  trackColor: {
    type: 'enum',
    values: semanticColors,
    default: undefined as (typeof semanticColors)[number] | undefined,
  },
  trackShape: {
    type: 'enum',
    values: trackShapes,
    default: 'line',
  },
  thumbStyle: {
    type: 'enum',
    values: thumbStyles,
    default: 'default',
  },
  rail: {
    type: 'enum',
    values: railTones,
    default: 'auto',
  },
  arrow: {
    type: 'enum',
    values: arrowTones,
    default: 'auto',
  },
  tracker: {
    type: 'enum',
    values: semanticColors,
    default: undefined as (typeof semanticColors)[number] | undefined,
  },
  thickness: {
    type: 'enum',
    values: thicknesses,
    default: 'thin',
  },
  trackerStyle: {
    type: 'enum',
    values: trackerStyles,
    default: 'line',
  },
  controls: {
    type: 'boolean',
    default: false,
  },
  ...radiusPropDef,
  // `scroll` is the primary prop. `scrollbars` remains as a legacy alias for compatibility.
  scroll: { type: 'enum', values: scrollbarsValues, default: 'vertical' },
  scrollbars: { type: 'enum', values: scrollbarsValues, default: 'both' },
} satisfies {
  size: PropDef<(typeof sizes)[number]>
  type: PropDef<(typeof types)[number]>
  variant: PropDef<(typeof variants)[number]>
  surfaceColor: PropDef<(typeof semanticColors)[number]>
  surfaceVariant: PropDef<(typeof surfaceVariants)[number]>
  trackColor: PropDef<(typeof semanticColors)[number]>
  trackShape: PropDef<(typeof trackShapes)[number]>
  thumbStyle: PropDef<(typeof thumbStyles)[number]>
  rail: PropDef<(typeof railTones)[number]>
  arrow: PropDef<(typeof arrowTones)[number]>
  tracker: PropDef<(typeof semanticColors)[number]>
  thickness: PropDef<(typeof thicknesses)[number]>
  trackerStyle: PropDef<(typeof trackerStyles)[number]>
  controls: PropDef<boolean>
  scroll: PropDef<(typeof scrollbarsValues)[number]>
  scrollbars: PropDef<(typeof scrollbarsValues)[number]>
}

export { scrollAreaPropDefs }
export type ScrollAreaVariant = (typeof variants)[number]
export type ScrollAreaSurfaceVariant = (typeof surfaceVariants)[number]
export type ScrollAreaTrackShape = (typeof trackShapes)[number]
export type ScrollAreaThumbStyle = (typeof thumbStyles)[number]
export type ScrollAreaRailTone = (typeof railTones)[number]
export type ScrollAreaArrowTone = (typeof arrowTones)[number]
export type ScrollAreaThickness = (typeof thicknesses)[number]
export type ScrollAreaTrackerStyle = (typeof trackerStyles)[number]
