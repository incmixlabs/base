import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef } from '@/theme/props/color.prop'
import { heightPropDefs } from '@/theme/props/height.props'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { GetPropDefTypes, PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { widthPropDefs } from '@/theme/props/width.props'

const contentVariants = ['solid', 'soft', 'surface', 'outline'] as const
const contentSizes = ['xs', 'sm', 'md', 'lg'] as const
const maxWidthValues = ['xs', 'sm', 'md', 'lg', 'xl', 'none'] as const

const popoverContentPropDefs = {
  ...asChildPropDef,
  variant: {
    type: 'enum',
    values: contentVariants,
    default: 'surface',
  },
  size: {
    type: 'enum',
    values: contentSizes,
    default: 'sm',
    responsive: true,
  },
  maxWidthToken: {
    type: 'enum',
    values: maxWidthValues,
    default: 'sm',
  },
  ...colorPropDef,
  ...highContrastPropDef,
  ...radiusPropDef,
  width: widthPropDefs.width,
  minWidth: widthPropDefs.minWidth,
  maxWidth: { ...widthPropDefs.maxWidth, default: '480px' },
  ...heightPropDefs,
} satisfies {
  variant: PropDef<(typeof contentVariants)[number]>
  width: PropDef<string>
  minWidth: PropDef<string>
  maxWidth: PropDef<string>
  size: PropDef<(typeof contentSizes)[number]>
  maxWidthToken: PropDef<(typeof maxWidthValues)[number]>
}

type PopoverContentOwnProps = GetPropDefTypes<
  typeof popoverContentPropDefs & typeof asChildPropDef & typeof widthPropDefs & typeof heightPropDefs
>

type PopoverContentVariant = (typeof contentVariants)[number]
type PopoverContentSize = (typeof contentSizes)[number]
type PopoverContentMaxWidth = (typeof maxWidthValues)[number]

export { popoverContentPropDefs, contentVariants as popoverContentVariants, maxWidthValues as popoverMaxWidthValues }
export type { PopoverContentOwnProps }
export type { PopoverContentMaxWidth, PopoverContentSize, PopoverContentVariant }
