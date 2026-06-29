import { colorPropDef, SemanticColor } from '../../theme/props/color.prop'
import { highContrastPropDef } from '../../theme/props/high-contrast.prop'
import type { PropDef } from '../../theme/props/prop-def'
import { radiusPropDef } from '../../theme/props/radius.prop'

const navigationMenuSizes = ['sm', 'md', 'lg'] as const
const navigationMenuVariants = ['solid', 'soft'] as const

const navigationMenuRootPropDefs = {
  size: {
    type: 'enum',
    values: navigationMenuSizes,
    default: 'md',
  },
  variant: {
    type: 'enum',
    values: navigationMenuVariants,
    default: 'solid',
  },
  color: { ...colorPropDef.color, default: SemanticColor.slate },
  highContrast: { ...highContrastPropDef.highContrast, default: false },
  ...radiusPropDef,
} as const satisfies Record<string, PropDef>

const navigationMenuPropDefs = { Root: navigationMenuRootPropDefs } as const

export type NavigationMenuSize = (typeof navigationMenuSizes)[number]
export type NavigationMenuVariant = (typeof navigationMenuVariants)[number]
export { navigationMenuPropDefs, navigationMenuSizes, navigationMenuVariants }
