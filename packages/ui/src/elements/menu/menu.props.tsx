import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'

const contentSizes = ['sm', 'md', 'lg', 'xl'] as const
const contentVariants = ['solid', 'soft'] as const

const baseMenuContentPropDefs = {
  size: {
    type: 'enum',
    values: contentSizes,
    default: 'md',
    responsive: true,
  },
  variant: {
    type: 'enum',
    values: contentVariants,
    default: 'solid',
  },
  ...colorPropDef,
  ...highContrastPropDef,
} satisfies Record<string, PropDef>

const textStylePropDefs = {
  bold: { type: 'boolean' },
  italic: { type: 'boolean' },
  strikethrough: { type: 'boolean' },
} satisfies Record<string, PropDef>

const baseMenuItemPropDefs = {
  ...asChildPropDef,
  ...colorPropDef,
  shortcut: { type: 'string' },
  ...textStylePropDefs,
} satisfies Record<string, PropDef>

const baseMenuCheckboxItemPropDefs = {
  ...colorPropDef,
  shortcut: { type: 'string' },
  ...textStylePropDefs,
} satisfies Record<string, PropDef>

const baseMenuRadioItemPropDefs = {
  ...colorPropDef,
  ...textStylePropDefs,
} satisfies Record<string, PropDef>

type MenuSize = (typeof contentSizes)[number]
type MenuVariant = (typeof contentVariants)[number]

export {
  contentSizes,
  contentVariants,
  baseMenuContentPropDefs,
  baseMenuItemPropDefs,
  baseMenuCheckboxItemPropDefs,
  baseMenuRadioItemPropDefs,
}
export type { MenuSize, MenuVariant }
