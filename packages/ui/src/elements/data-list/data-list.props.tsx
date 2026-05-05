import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import { leadingTrimPropDef } from '@/theme/props/leading-trim.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { sizesSmToLg } from '@/theme/props/scales'
import { widthPropDefs } from '@/theme/props/width.props'

const dataListAlignValues = ['start', 'center', 'end', 'baseline', 'stretch', 'between'] as const
const dataListOrientationValues = ['horizontal', 'vertical'] as const
const dataListSizes = sizesSmToLg
const dataListTrimValues = leadingTrimPropDef.trim.values

type DataListAlign = (typeof dataListAlignValues)[number]
type DataListOrientation = (typeof dataListOrientationValues)[number]
type DataListSize = (typeof dataListSizes)[number]
type DataListTrim = (typeof dataListTrimValues)[number]

const dataListRootPropDefs = {
  orientation: {
    type: 'enum',
    className: 'af-r-orientation',
    values: dataListOrientationValues,
    default: 'horizontal',
    responsive: true,
  },
  size: {
    type: 'enum',
    className: 'af-r-size',
    values: dataListSizes,
    default: 'md',
    responsive: true,
  },
  trim: {
    ...leadingTrimPropDef.trim,
  },
} satisfies {
  orientation: PropDef<DataListOrientation>
  size: PropDef<DataListSize>
  trim: typeof leadingTrimPropDef.trim
}

const dataListItemPropDefs = {
  align: {
    type: 'enum',
    className: 'af-r-ai',
    values: dataListAlignValues,
    responsive: true,
  },
} satisfies {
  align: PropDef<DataListAlign>
}

const dataListLabelPropDefs = {
  ...widthPropDefs,
  ...colorPropDef,
  ...highContrastPropDef,
}

const dataListPropDefs = {
  Root: dataListRootPropDefs,
  Item: dataListItemPropDefs,
  Label: dataListLabelPropDefs,
} as const

export type { DataListAlign, DataListOrientation, DataListSize, DataListTrim }
export { dataListAlignValues, dataListOrientationValues, dataListPropDefs, dataListSizes, dataListTrimValues }
