import type { GetPropDefTypes, PropDef } from '@/theme/props/prop-def'

const ratioValues = ['1/1', '4/3', '16/9', '21/9', '3/4', '9/16', '3/2', '2/3'] as const

const aspectRatioPropDefs = {
  ratio: {
    type: 'enum',
    values: ratioValues,
    default: '16/9',
  },
  customRatio: { type: 'number' },
} satisfies {
  ratio: PropDef<(typeof ratioValues)[number]>
  customRatio: PropDef<number>
}

type AspectRatioOwnProps = GetPropDefTypes<typeof aspectRatioPropDefs>

export type { AspectRatioOwnProps }
export { aspectRatioPropDefs, ratioValues as aspectRatioValues }
