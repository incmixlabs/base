import type { PropDef } from '@/theme/props/prop-def'
import type { SurfaceColorKey } from '@/theme/tokens'
import {
  chartClassNamePropDef,
  chartColorPropDef,
  chartDescriptionPropDef,
  chartHeightPropDef,
  chartStringTitlePropDef,
} from '../props'

const barChartPropDefs = {
  data: { type: 'string', required: true },
  title: chartStringTitlePropDef,
  description: chartDescriptionPropDef,
  height: { ...chartHeightPropDef, default: 320 },
  color: chartColorPropDef,
  showValueLabels: { type: 'boolean', default: true },
  valueLabelOffset: { type: 'number', default: 16 },
  className: chartClassNamePropDef,
} satisfies {
  data: PropDef<string>
  title: PropDef<string>
  description: PropDef<string>
  height: PropDef<number>
  color: PropDef<SurfaceColorKey>
  showValueLabels: PropDef<boolean>
  valueLabelOffset: PropDef<number>
  className: PropDef<string>
}

export { barChartPropDefs }
