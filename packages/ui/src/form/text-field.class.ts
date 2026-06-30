import { themeSizeTokens } from '@incmix/theme'
import { surfaceUnoColorVariants } from '../elements/surface/surface.class'
import type { SurfaceVariant } from '../elements/surface/surface.props'
import { semanticColorKeys, semanticColorVar } from '../theme/props/color.prop'
import { textFieldSizeVar } from '../theme/runtime/component-vars'
import type { Color } from '../theme/tokens'
import { type ExtendedFormSize, extendedFormSizes } from './form-size'

export const textFieldRootCls = 'relative w-full'

export const textFieldInputBaseCls = 'w-full outline-none transition-all duration-150 ease-in-out'

export const textFieldIconContainerCls = 'absolute top-1/2 -translate-y-1/2 z-10'

export const textFieldLeftIconContainerCls =
  'left-[var(--tf-icon-inset)] h-[var(--tf-icon-size)] w-[var(--tf-icon-size)]'

export const textFieldRightIconContainerCls =
  'right-[var(--tf-icon-inset)] h-[var(--tf-icon-size)] w-[var(--tf-icon-size)]'

export const textFieldInputWithLeftElementCls = '[padding-left:var(--tf-left-slot-width,var(--tf-icon-text-offset))]'

export const textFieldInputWithRightElementCls = '[padding-right:var(--tf-right-slot-width,var(--tf-icon-text-offset))]'

const textFieldVariantKeys = [
  'classic',
  'solid',
  'soft',
  'surface',
  'outline',
  'ghost',
] as const satisfies readonly SurfaceVariant[]

type TextFieldVariant = SurfaceVariant
type FloatingStyle = 'filled' | 'outlined' | 'standard'

function classValue(value: string) {
  return value.replace(/\s+/g, '_')
}

function cssDeclaration(property: string, value: string) {
  return `[${property}:${classValue(value)}]`
}

function variantCssDeclaration(variant: string, property: string, value: string) {
  return `${variant}:[${property}:${classValue(value)}]`
}

function colorVar(color: Color, token: Parameters<typeof semanticColorVar>[1]) {
  return semanticColorVar(color, token)
}

function textFieldFocusClasses(color: Color) {
  return [
    variantCssDeclaration('focus', 'border-color', colorVar(color, 'primary')),
    'focus:outline-solid focus:outline-2 focus:outline-offset-2',
    variantCssDeclaration('focus', 'outline-color', colorVar(color, 'primary-alpha')),
  ].join(' ')
}

function textFieldPlaceholderClasses(color: Color) {
  return `placeholder:[color:${colorVar(color, 'text')}] placeholder:opacity-50`
}

function textFieldSoftEnhancementClasses(color: Color) {
  return [
    cssDeclaration('background-color', colorVar(color, 'surface-subtle')),
    cssDeclaration('border-color', colorVar(color, 'border-subtle')),
  ].join(' ')
}

function textFieldOutlineInteractionClasses() {
  return 'hover:bg-transparent hover:[background-image:none] active:bg-transparent active:[background-image:none]'
}

function textFieldGhostInteractionClasses(color: Color) {
  return [
    variantCssDeclaration('hover', 'border-color', colorVar(color, 'primary')),
    'hover:outline-solid hover:outline-2 hover:outline-offset-2',
    variantCssDeclaration('hover', 'outline-color', colorVar(color, 'primary-alpha')),
    'hover:bg-transparent hover:[background-image:none]',
  ].join(' ')
}

function createTextFieldEnhancements(color: Color): Record<TextFieldVariant, string> {
  return Object.fromEntries(
    textFieldVariantKeys.map(variant => [
      variant,
      [
        variant === 'soft' ? textFieldSoftEnhancementClasses(color) : '',
        textFieldPlaceholderClasses(color),
        textFieldFocusClasses(color),
        variant === 'outline' ? textFieldOutlineInteractionClasses() : '',
        variant === 'ghost' ? textFieldGhostInteractionClasses(color) : '',
      ]
        .filter(Boolean)
        .join(' '),
    ]),
  ) as Record<TextFieldVariant, string>
}

const textFieldEnhancementVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, createTextFieldEnhancements(color)]),
) as Record<Color, Record<TextFieldVariant, string>>

export const textFieldSurfaceColorVariants: Record<Color, Record<TextFieldVariant, string>> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    Object.fromEntries(textFieldVariantKeys.map(variant => [variant, surfaceUnoColorVariants[color][variant]])),
  ]),
) as Record<Color, Record<TextFieldVariant, string>>

export { textFieldEnhancementVariants }

export const textFieldColorVariants: Record<Color, Record<TextFieldVariant, string>> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    Object.fromEntries(
      textFieldVariantKeys.map(variant => [
        variant,
        `${textFieldSurfaceColorVariants[color][variant]} ${textFieldEnhancementVariants[color][variant]}`,
      ]),
    ),
  ]),
) as Record<Color, Record<TextFieldVariant, string>>

export const textFieldFloatingWrapperColorVariants: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    [
      cssDeclaration('--tf-color-text', colorVar(color, 'text')),
      cssDeclaration('--tf-color-primary', colorVar(color, 'primary')),
    ].join(' '),
  ]),
) as Record<Color, string>

const createFloatingColorClasses = (color: Color): Record<FloatingStyle, string> => ({
  filled: [
    cssDeclaration('border-color', colorVar(color, 'primary')),
    cssDeclaration('background-color', colorVar(color, 'surface-subtle')),
    variantCssDeclaration('focus', 'border-color', colorVar(color, 'primary')),
  ].join(' '),
  outlined: [
    cssDeclaration('border-color', colorVar(color, 'primary')),
    'bg-transparent',
    variantCssDeclaration('focus', 'border-color', colorVar(color, 'primary')),
    'focus:outline-solid focus:outline-2 focus:outline-offset-2',
    variantCssDeclaration('focus', 'outline-color', colorVar(color, 'primary-alpha')),
  ].join(' '),
  standard: [
    cssDeclaration('border-color', colorVar(color, 'primary')),
    'bg-transparent',
    variantCssDeclaration('focus', 'border-color', colorVar(color, 'primary')),
  ].join(' '),
})

export const textFieldFloatingColorVariants: Record<Color, Record<FloatingStyle, string>> = Object.fromEntries(
  semanticColorKeys.map(color => [color, createFloatingColorClasses(color)]),
) as Record<Color, Record<FloatingStyle, string>>

export const floatingInputBaseCls =
  'box-border h-[var(--tf-floating-height)] disabled:cursor-not-allowed disabled:opacity-50'

export const floatingInputStyleVariants: Record<FloatingStyle, string> = {
  filled:
    '[font-size:var(--tf-font-size)] leading-[var(--tf-line-height)] border-solid border-x-0 border-t-0 border-b-2 rounded-t-[var(--element-border-radius)] rounded-b-none pl-[var(--tf-padding-x)] pr-[var(--tf-padding-x)] pt-[var(--tf-line-height)] pb-[var(--tf-padding-y)]',
  outlined:
    '[font-size:var(--tf-font-size)] leading-[var(--tf-line-height)] border border-solid rounded-[var(--element-border-radius)] pl-[var(--tf-padding-x)] pr-[var(--tf-padding-x)] pt-[var(--tf-line-height)] pb-[var(--tf-padding-y)]',
  standard:
    '[font-size:var(--tf-font-size)] leading-[var(--tf-line-height)] border-solid border-x-0 border-t-0 border-b-2 rounded-none px-0 pt-[var(--tf-line-height)] pb-[var(--tf-padding-y)]',
}

export const floatingInputWithLeftIconCls = '[padding-left:var(--tf-left-slot-width,var(--tf-icon-text-offset))]'

export const floatingInputWithRightIconCls = '[padding-right:var(--tf-right-slot-width,var(--tf-icon-text-offset))]'

const floatingLabelBase =
  'overflow-hidden absolute text-ellipsis origin-[0] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] whitespace-nowrap z-10'

const floatingLabelFilled =
  '[font-size:var(--tf-font-size)] [color:var(--tf-color-text)] left-[var(--tf-padding-x)] leading-[var(--tf-line-height)] [max-width:calc(100%_-_(var(--tf-padding-x)_*_2))] top-4 transition-[color,transform] translate-y-[-1.25rem] scale-[0.9] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:translate-y-[-1.25rem] peer-focus:scale-[0.9] peer-focus:[color:var(--tf-color-primary)] peer-data-[filled]:translate-y-[-1.25rem] peer-data-[filled]:scale-[0.9] peer-data-[focused]:translate-y-[-1.25rem] peer-data-[focused]:scale-[0.9] peer-data-[focused]:[color:var(--tf-color-primary)] peer-data-[placeholder]:translate-y-0 peer-data-[placeholder]:scale-100 peer-data-[popup-open]:translate-y-[-1.25rem] peer-data-[popup-open]:scale-[0.9] peer-data-[popup-open]:[color:var(--tf-color-primary)]'

const floatingLabelOutlined =
  '[font-size:var(--tf-font-size)] [color:var(--tf-color-text)] left-[var(--tf-padding-x)] leading-[var(--tf-line-height)] [max-width:calc(100%_-_(var(--tf-padding-x)_*_2))] top-2 transition-[background-color,color,padding,top,transform] translate-y-[-1.25rem] scale-[0.9] bg-[var(--background)] px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:translate-y-[-1.25rem] peer-focus:scale-[0.9] peer-focus:[color:var(--tf-color-primary)] peer-focus:px-1 peer-data-[filled]:top-2 peer-data-[filled]:translate-y-[-1.25rem] peer-data-[filled]:scale-[0.9] peer-data-[focused]:top-2 peer-data-[focused]:translate-y-[-1.25rem] peer-data-[focused]:scale-[0.9] peer-data-[focused]:[color:var(--tf-color-primary)] peer-data-[focused]:px-1 peer-data-[placeholder]:top-1/2 peer-data-[placeholder]:-translate-y-1/2 peer-data-[placeholder]:scale-100 peer-data-[popup-open]:top-2 peer-data-[popup-open]:translate-y-[-1.25rem] peer-data-[popup-open]:scale-[0.9] peer-data-[popup-open]:[color:var(--tf-color-primary)] peer-data-[popup-open]:bg-[var(--background)] peer-data-[popup-open]:px-1'

const floatingLabelStandard =
  '[font-size:var(--tf-font-size)] [color:var(--tf-color-text)] left-0 leading-[var(--tf-line-height)] max-w-full top-3 transition-[color,transform] translate-y-[-1.75rem] scale-[0.9] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:translate-y-[-1.75rem] peer-focus:scale-[0.9] peer-focus:[color:var(--tf-color-primary)] peer-data-[filled]:translate-y-[-1.75rem] peer-data-[filled]:scale-[0.9] peer-data-[focused]:translate-y-[-1.75rem] peer-data-[focused]:scale-[0.9] peer-data-[focused]:[color:var(--tf-color-primary)] peer-data-[placeholder]:translate-y-0 peer-data-[placeholder]:scale-100 peer-data-[popup-open]:translate-y-[-1.75rem] peer-data-[popup-open]:scale-[0.9] peer-data-[popup-open]:[color:var(--tf-color-primary)]'

export const floatingLabelStyleVariants: Record<FloatingStyle, string> = {
  filled: `${floatingLabelBase} ${floatingLabelFilled}`,
  outlined: `${floatingLabelBase} ${floatingLabelOutlined}`,
  standard: `${floatingLabelBase} ${floatingLabelStandard}`,
}

export const floatingLabelWithLeftIconCls =
  '[left:var(--tf-left-slot-width,var(--tf-icon-text-offset))] [max-width:calc(100%_-_(var(--tf-left-slot-width,var(--tf-icon-text-offset))_+_var(--tf-padding-x)))]'

export type TextFieldSize = ExtendedFormSize

export const textFieldSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const token = themeSizeTokens[size]
    const floatingHeightFallback = `calc(${token.height} + ${token.paddingY} * 1.65)`

    return [
      size,
      [
        cssDeclaration('--tf-height', textFieldSizeVar(size, 'height', token.height)),
        cssDeclaration('--tf-floating-height', textFieldSizeVar(size, 'floatingHeight', floatingHeightFallback)),
        cssDeclaration('--tf-font-size', textFieldSizeVar(size, 'fontSize', token.fontSize)),
        cssDeclaration('--tf-line-height', textFieldSizeVar(size, 'lineHeight', token.lineHeight)),
        cssDeclaration('--tf-padding-x', textFieldSizeVar(size, 'paddingInline', token.paddingX)),
        cssDeclaration('--tf-padding-y', textFieldSizeVar(size, 'paddingBlock', token.paddingY)),
        cssDeclaration('--tf-icon-size', textFieldSizeVar(size, 'iconSize', token.iconSize)),
        cssDeclaration('--tf-gap', textFieldSizeVar(size, 'gap', token.gap)),
        cssDeclaration('--tf-icon-inset', 'calc(var(--tf-padding-x) + var(--tf-gap))'),
        cssDeclaration('--tf-icon-text-offset', 'calc(var(--tf-icon-inset) + var(--tf-icon-size) + var(--tf-gap))'),
      ].join(' '),
    ]
  }),
) as Record<TextFieldSize, string>

export const textFieldIconCls = '[&_svg]:h-[var(--tf-icon-size)] [&_svg]:w-[var(--tf-icon-size)] [&_svg]:shrink-0'

const nestedClassMapValues = <Value extends string>(map: Record<string, Record<string, Value>>) =>
  Object.values(map).flatMap(value => Object.values(value))

export const textFieldClassNames = [
  textFieldRootCls,
  textFieldInputBaseCls,
  textFieldIconContainerCls,
  textFieldLeftIconContainerCls,
  textFieldRightIconContainerCls,
  textFieldInputWithLeftElementCls,
  textFieldInputWithRightElementCls,
  ...nestedClassMapValues(textFieldEnhancementVariants),
  ...nestedClassMapValues(textFieldSurfaceColorVariants),
  ...nestedClassMapValues(textFieldColorVariants),
  ...Object.values(textFieldFloatingWrapperColorVariants),
  ...nestedClassMapValues(textFieldFloatingColorVariants),
  floatingInputBaseCls,
  ...Object.values(floatingInputStyleVariants),
  floatingInputWithLeftIconCls,
  floatingInputWithRightIconCls,
  ...Object.values(floatingLabelStyleVariants),
  floatingLabelWithLeftIconCls,
  ...Object.values(textFieldSizeVariants),
  textFieldIconCls,
]
