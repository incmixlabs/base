import { createVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { getControlSizeValues } from '@/elements/control-size'
import { surfaceColorVariants, surfaceHighContrastByVariant } from '@/elements/surface/surface.css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { buttonMotionVar, buttonSizeVar } from '@/theme/runtime/component-vars'
import type { Color, Variant } from '@/theme/tokens'
import { buttonPropDefs } from './button.props'

export const buttonBaseCls =
  'relative inline-flex items-center justify-center select-none border outline-none box-border'

export const buttonLoadingOverlayCls = 'absolute inset-0 flex items-center justify-center'
const iconSizeVar = createVar()
export const buttonSizeIconScope = style({})

globalStyle(`${buttonSizeIconScope} svg`, {
  width: iconSizeVar,
  height: iconSizeVar,
  flexShrink: 0,
})

const buttonSizes = buttonPropDefs.size.values
type ButtonSize = (typeof buttonPropDefs.size.values)[number]

export const buttonSizeVariants = styleVariants(
  Object.fromEntries(
    buttonSizes.map(size => {
      const token = getControlSizeValues(size)
      return [
        size,
        {
          height: buttonSizeVar(size, 'height', token.height),
          paddingInline: buttonSizeVar(size, 'paddingInline', token.paddingX),
          paddingBlock: buttonSizeVar(size, 'paddingBlock', token.paddingY),
          fontSize: buttonSizeVar(size, 'fontSize', token.fontSize),
          lineHeight: buttonSizeVar(size, 'lineHeight', token.lineHeight),
          gap: buttonSizeVar(size, 'gap', token.gap),
          vars: {
            [iconSizeVar]: buttonSizeVar(size, 'iconSize', token.iconSize),
          },
        },
      ]
    }),
  ) as Record<
    ButtonSize,
    {
      height: string
      paddingInline: string
      paddingBlock: string
      fontSize: string
      lineHeight: string
      gap: string
      vars: {
        [iconSizeVar]: string
      }
    }
  >,
)

export const buttonMotion = style({
  transition: buttonMotionVar(
    'transition',
    'background-color var(--af-motion-fast) var(--af-ease-standard), color var(--af-motion-fast) var(--af-ease-standard), border-color var(--af-motion-fast) var(--af-ease-standard), box-shadow var(--af-motion-fast) var(--af-ease-standard), filter var(--af-motion-fast) var(--af-ease-standard)',
  ),
})

export const buttonLoading = style({
  color: 'transparent',
})

export const buttonColorVariants = surfaceColorVariants as Record<Color, Record<Variant, string>>

const createInverseVariantStyles = (color: Color): Record<Variant, string> => ({
  classic: style({}),
  // TODO(theme): solid inverse currently matches base solid contrast text; revisit when inverse semantics are finalized.
  solid: style({
    color: semanticColorVar(color, 'contrast'),
  }),
  soft: style({
    color: semanticColorVar(color, 'text'),
  }),
  surface: style({}),
  outline: style({}),
  ghost: style({}),
})

export const buttonInverseVariants: Record<Color, Record<Variant, string>> = Object.fromEntries(
  semanticColorKeys.map(color => [color, createInverseVariantStyles(color)]),
) as Record<Color, Record<Variant, string>>

export const highContrastByVariant = surfaceHighContrastByVariant
