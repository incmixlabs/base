import { createVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { getControlSizeValues } from '@/elements/control-size'
import { surfaceColorVariants, surfaceHighContrastByVariant } from '@/elements/surface/surface.css'
import { iconButtonSizeVar } from '@/theme/runtime/component-vars'
import { iconButtonPropDefs } from './icon-button.props'

const iconSizeVar = createVar()
export const iconButtonSizeIconScope = style({})

globalStyle(`${iconButtonSizeIconScope} svg`, {
  width: iconSizeVar,
  height: iconSizeVar,
  flexShrink: 0,
})

export const iconButtonBase = style({
  borderStyle: 'solid',
  borderWidth: 0,
})

export const iconButtonColorVariants = surfaceColorVariants

export const iconButtonHighContrastByVariant = styleVariants({
  solid: [surfaceHighContrastByVariant.solid, { boxShadow: 'var(--shadow-3)' }],
  soft: [surfaceHighContrastByVariant.soft],
  outline: [surfaceHighContrastByVariant.outline, { filter: 'contrast(1.15) saturate(1.1)' }],
  ghost: [surfaceHighContrastByVariant.ghost, { filter: 'contrast(1.15) saturate(1.1)' }],
})

const iconButtonSizes = iconButtonPropDefs.size.values
type IconButtonSize = (typeof iconButtonPropDefs.size.values)[number]

function getIconButtonSizeValues(size: IconButtonSize) {
  return getControlSizeValues(size)
}

export const iconButtonSizeVariants = styleVariants(
  Object.fromEntries(
    iconButtonSizes.map(size => {
      const token = getIconButtonSizeValues(size)
      return [
        size,
        {
          height: iconButtonSizeVar(size, 'height', token.height),
          width: iconButtonSizeVar(size, 'height', token.height),
          fontSize: iconButtonSizeVar(size, 'fontSize', token.fontSize),
          vars: {
            [iconSizeVar]: iconButtonSizeVar(size, 'iconSize', token.iconSize),
          },
        },
      ]
    }),
  ) as Record<
    IconButtonSize,
    {
      height: string
      width: string
      fontSize: string
      vars: {
        [iconSizeVar]: string
      }
    }
  >,
)

export const iconSizeVariants = styleVariants(
  Object.fromEntries(
    iconButtonSizes.map(size => {
      const token = getIconButtonSizeValues(size)
      return [
        size,
        {
          width: iconButtonSizeVar(size, 'iconSize', token.iconSize),
          height: iconButtonSizeVar(size, 'iconSize', token.iconSize),
          fontSize: iconButtonSizeVar(size, 'iconSize', token.iconSize),
          vars: {
            [iconSizeVar]: iconButtonSizeVar(size, 'iconSize', token.iconSize),
          },
        },
      ]
    }),
  ) as Record<
    IconButtonSize,
    {
      width: string
      height: string
      fontSize: string
      vars: {
        [iconSizeVar]: string
      }
    }
  >,
)
