import { themeSizeTokens } from '@incmix/theme'
import { surfaceUnoColorVariants } from '../elements/surface/surface.class'
import type { SurfaceVariant } from '../elements/surface/surface.props'
import { semanticColorKeys, semanticColorVar } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'
import { formControlNeutralBackground } from './form-control.class'
import { type ExtendedFormSize, extendedFormSizes } from './form-size'

export const textFieldRootCls = 'relative w-full'

export const textFieldInputBaseCls = 'w-full outline-none transition-all duration-150 ease-in-out'

export const textFieldIconContainerCls = 'absolute top-1/2 -translate-y-1/2 z-10'

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

function arbitraryValueClass(prefix: string, value: string) {
  return `${prefix}-[${classValue(value)}]`
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

function textFieldSizeTokenClasses(size: TextFieldSize) {
  const token = themeSizeTokens[size]
  const iconInset = `calc(${token.paddingX} + ${token.gap})`
  const iconTextOffset = `calc(${token.paddingX} + ${token.gap} + ${token.iconSize} + ${token.gap})`
  const floatingHeight = `calc(${token.height} + ${token.paddingY} * 1.65)`
  const dateIconPaddingRight = `calc(${token.paddingX} * 2 + ${token.iconSize})`

  return {
    dateIconPaddingRight,
    floatingHeight,
    iconInset,
    iconTextOffset,
    token,
  }
}

function textFieldTypographyClassName(size: TextFieldSize) {
  const { token } = textFieldSizeTokenClasses(size)
  return `${cssDeclaration('font-size', token.fontSize)} ${arbitraryValueClass('leading', token.lineHeight)}`
}

function textFieldPaddingClassName(size: TextFieldSize) {
  const { token } = textFieldSizeTokenClasses(size)
  return `${arbitraryValueClass('px', token.paddingX)} ${arbitraryValueClass('py', token.paddingY)}`
}

function textFieldBlockPaddingClassName(size: TextFieldSize) {
  const { token } = textFieldSizeTokenClasses(size)
  return arbitraryValueClass('py', token.paddingY)
}

export type TextFieldSize = ExtendedFormSize

export const textFieldTypographySizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => [size, textFieldTypographyClassName(size)]),
) as Record<TextFieldSize, string>

export const textFieldInputLeftPaddingSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { token } = textFieldSizeTokenClasses(size)
    return [size, cssDeclaration('padding-left', token.paddingX)]
  }),
) as Record<TextFieldSize, string>

export const textFieldInputRightPaddingSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { token } = textFieldSizeTokenClasses(size)
    return [size, cssDeclaration('padding-right', token.paddingX)]
  }),
) as Record<TextFieldSize, string>

export const textFieldControlContentSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { token } = textFieldSizeTokenClasses(size)
    return [
      size,
      [
        arbitraryValueClass('h', token.height),
        textFieldBlockPaddingClassName(size),
        textFieldTypographySizeVariants[size],
      ].join(' '),
    ]
  }),
) as Record<TextFieldSize, string>

export const textFieldControlSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    return [
      size,
      [
        textFieldControlContentSizeVariants[size],
        textFieldInputLeftPaddingSizeVariants[size],
        textFieldInputRightPaddingSizeVariants[size],
      ].join(' '),
    ]
  }),
) as Record<TextFieldSize, string>

export const textFieldHeightSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { token } = textFieldSizeTokenClasses(size)
    return [size, arbitraryValueClass('h', token.height)]
  }),
) as Record<TextFieldSize, string>

export const textFieldElementSlotOffsetSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconTextOffset } = textFieldSizeTokenClasses(size)
    return [size, iconTextOffset]
  }),
) as Record<TextFieldSize, string>

export const textFieldLabelEndPaddingSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { token } = textFieldSizeTokenClasses(size)
    return [size, token.paddingX]
  }),
) as Record<TextFieldSize, string>

export const textFieldMinControlSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { token } = textFieldSizeTokenClasses(size)
    return [
      size,
      [
        arbitraryValueClass('min-h', token.height),
        textFieldPaddingClassName(size),
        textFieldTypographySizeVariants[size],
      ].join(' '),
    ]
  }),
) as Record<TextFieldSize, string>

export const textFieldTextareaSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { token } = textFieldSizeTokenClasses(size)
    return [
      size,
      [
        arbitraryValueClass('min-h', `calc(${token.height} * 2)`),
        textFieldPaddingClassName(size),
        textFieldTypographySizeVariants[size],
      ].join(' '),
    ]
  }),
) as Record<TextFieldSize, string>

export const textFieldTextareaMinHeightVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { token } = textFieldSizeTokenClasses(size)
    return [size, arbitraryValueClass('min-h', `calc(${token.height} * 2)`)]
  }),
) as Record<TextFieldSize, string>

export const textFieldFloatingBaseSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { floatingHeight } = textFieldSizeTokenClasses(size)
    return [size, arbitraryValueClass('h', floatingHeight)]
  }),
) as Record<TextFieldSize, string>

export const textFieldFloatingInputContentSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { token } = textFieldSizeTokenClasses(size)
    return [
      size,
      [
        textFieldTypographySizeVariants[size],
        arbitraryValueClass('pt', token.lineHeight),
        arbitraryValueClass('pb', token.paddingY),
      ].join(' '),
    ]
  }),
) as Record<TextFieldSize, string>

export const textFieldFloatingInputSizeVariants: Record<
  TextFieldSize,
  Record<FloatingStyle, string>
> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const sizeBase = [
      textFieldFloatingInputContentSizeVariants[size],
      textFieldInputLeftPaddingSizeVariants[size],
      textFieldInputRightPaddingSizeVariants[size],
    ].join(' ')

    return [
      size,
      {
        filled: sizeBase,
        outlined: sizeBase,
        standard: sizeBase,
      },
    ]
  }),
) as Record<TextFieldSize, Record<FloatingStyle, string>>

export const textFieldInputWithLeftIconSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconTextOffset } = textFieldSizeTokenClasses(size)
    return [size, cssDeclaration('padding-left', iconTextOffset)]
  }),
) as Record<TextFieldSize, string>

export const textFieldInputWithRightIconSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconTextOffset } = textFieldSizeTokenClasses(size)
    return [size, cssDeclaration('padding-right', iconTextOffset)]
  }),
) as Record<TextFieldSize, string>

export const textFieldLeftIconContainerSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconInset, token } = textFieldSizeTokenClasses(size)
    return [
      size,
      `${cssDeclaration('left', iconInset)} ${arbitraryValueClass('h', token.iconSize)} ${arbitraryValueClass('w', token.iconSize)}`,
    ]
  }),
) as Record<TextFieldSize, string>

export const textFieldRightIconContainerSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconInset, token } = textFieldSizeTokenClasses(size)
    return [
      size,
      `${cssDeclaration('right', iconInset)} ${arbitraryValueClass('h', token.iconSize)} ${arbitraryValueClass('w', token.iconSize)}`,
    ]
  }),
) as Record<TextFieldSize, string>

export const textFieldInputWithLeftElementSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconTextOffset } = textFieldSizeTokenClasses(size)
    return [size, cssDeclaration('padding-left', iconTextOffset)]
  }),
) as Record<TextFieldSize, string>

export const textFieldInputWithRightElementSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconTextOffset } = textFieldSizeTokenClasses(size)
    return [size, cssDeclaration('padding-right', iconTextOffset)]
  }),
) as Record<TextFieldSize, string>

export const floatingInputWithLeftIconSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconTextOffset } = textFieldSizeTokenClasses(size)
    return [size, cssDeclaration('padding-left', iconTextOffset)]
  }),
) as Record<TextFieldSize, string>

export const floatingInputWithRightIconSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconTextOffset } = textFieldSizeTokenClasses(size)
    return [size, cssDeclaration('padding-right', iconTextOffset)]
  }),
) as Record<TextFieldSize, string>

export const floatingInputWithLeftElementSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconTextOffset } = textFieldSizeTokenClasses(size)
    return [size, cssDeclaration('padding-left', iconTextOffset)]
  }),
) as Record<TextFieldSize, string>

export const floatingInputWithRightElementSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconTextOffset } = textFieldSizeTokenClasses(size)
    return [size, cssDeclaration('padding-right', iconTextOffset)]
  }),
) as Record<TextFieldSize, string>

export const textFieldIconSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { token } = textFieldSizeTokenClasses(size)
    return [
      size,
      [
        arbitraryValueClass('[&_svg]:h', token.iconSize),
        arbitraryValueClass('[&_svg]:w', token.iconSize),
        '[&_svg]:shrink-0',
      ].join(' '),
    ]
  }),
) as Record<TextFieldSize, string>

export const textFieldDateSegmentSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { dateIconPaddingRight, token } = textFieldSizeTokenClasses(size)
    return [
      size,
      [
        arbitraryValueClass('px', token.paddingX),
        cssDeclaration('padding-right', dateIconPaddingRight),
        textFieldTypographySizeVariants[size],
      ].join(' '),
    ]
  }),
) as Record<TextFieldSize, string>

export const textFieldDateRangeSurfaceSizeVariants: Record<TextFieldSize, string> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { dateIconPaddingRight, token } = textFieldSizeTokenClasses(size)
    return [
      size,
      `${arbitraryValueClass('px', token.paddingX)} ${cssDeclaration('padding-right', dateIconPaddingRight)}`,
    ]
  }),
) as Record<TextFieldSize, string>

function textFieldFocusClasses(color: Color) {
  return [
    variantCssDeclaration('focus', 'border-color', colorVar(color, 'solid')),
    'focus:outline-solid focus:outline-2 focus:outline-offset-2',
    variantCssDeclaration('focus', 'outline-color', colorVar(color, 'solid-alpha')),
  ].join(' ')
}

function textFieldPlaceholderClasses(color: Color) {
  return `placeholder:[color:${colorVar(color, 'text')}] placeholder:opacity-50`
}

function textFieldSoftSurfaceClasses(color: Color) {
  return [
    cssDeclaration('background-color', colorVar(color, 'surface-subtle')),
    cssDeclaration('border-color', colorVar(color, 'border-subtle')),
    `text-${color}`,
  ].join(' ')
}

function textFieldOutlineInteractionClasses() {
  return 'hover:bg-transparent hover:[background-image:none] active:bg-transparent active:[background-image:none]'
}

function textFieldGhostInteractionClasses(color: Color) {
  return [
    variantCssDeclaration('hover', 'border-color', colorVar(color, 'solid')),
    'hover:outline-solid hover:outline-2 hover:outline-offset-2',
    variantCssDeclaration('hover', 'outline-color', colorVar(color, 'solid-alpha')),
    'hover:bg-transparent hover:[background-image:none]',
  ].join(' ')
}

function createTextFieldEnhancements(color: Color): Record<TextFieldVariant, string> {
  return Object.fromEntries(
    textFieldVariantKeys.map(variant => [
      variant,
      [
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
    Object.fromEntries(
      textFieldVariantKeys.map(variant => [
        variant,
        variant === 'soft' ? textFieldSoftSurfaceClasses(color) : surfaceUnoColorVariants[color][variant],
      ]),
    ),
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

export const textFieldFloatingLabelColorVariants: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    [
      cssDeclaration('color', colorVar(color, 'text')),
      variantCssDeclaration('peer-focus', 'color', colorVar(color, 'solid')),
      variantCssDeclaration('peer-data-[focused]', 'color', colorVar(color, 'solid')),
      variantCssDeclaration('peer-data-[popup-open]', 'color', colorVar(color, 'solid')),
    ].join(' '),
  ]),
) as Record<Color, string>

const createFloatingColorClasses = (color: Color): Record<FloatingStyle, string> => ({
  filled: [
    cssDeclaration('border-color', colorVar(color, 'solid')),
    cssDeclaration('background-color', colorVar(color, 'surface-subtle')),
    variantCssDeclaration('focus', 'border-color', colorVar(color, 'solid')),
  ].join(' '),
  outlined: [
    cssDeclaration('border-color', colorVar(color, 'solid')),
    'bg-transparent',
    variantCssDeclaration('focus', 'border-color', colorVar(color, 'solid')),
    'focus:outline-solid focus:outline-2 focus:outline-offset-2',
    variantCssDeclaration('focus', 'outline-color', colorVar(color, 'solid-alpha')),
  ].join(' '),
  standard: [
    cssDeclaration('border-color', colorVar(color, 'solid')),
    'bg-transparent',
    variantCssDeclaration('focus', 'border-color', colorVar(color, 'solid')),
  ].join(' '),
})

export const textFieldFloatingColorVariants: Record<Color, Record<FloatingStyle, string>> = Object.fromEntries(
  semanticColorKeys.map(color => [color, createFloatingColorClasses(color)]),
) as Record<Color, Record<FloatingStyle, string>>

export const floatingInputBaseCls = 'box-border disabled:cursor-not-allowed disabled:opacity-50'

export const floatingInputStyleVariants: Record<FloatingStyle, string> = {
  filled: 'border-solid border-x-0 border-t-0 border-b-2 rounded-t-[var(--element-border-radius)] rounded-b-none',
  outlined: 'border border-solid rounded-[var(--element-border-radius)]',
  standard: 'border-solid border-x-0 border-t-0 border-b-2 rounded-none',
}

const floatingLabelBase =
  'overflow-hidden absolute text-ellipsis origin-[0] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] whitespace-nowrap z-10'

const floatingLabelFilled =
  'top-4 transition-[color,top,transform] translate-y-[-1.25rem] scale-[0.9] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-data-[filled]:top-4 peer-data-[filled]:translate-y-[-1.25rem] peer-data-[filled]:scale-[0.9] peer-data-[placeholder]:top-1/2 peer-data-[placeholder]:-translate-y-1/2 peer-data-[placeholder]:scale-100 peer-data-[popup-open]:top-4 peer-data-[popup-open]:translate-y-[-1.25rem] peer-data-[popup-open]:scale-[0.9]'

const floatingLabelOutlined = `top-2 transition-[background-color,color,padding,top,transform] translate-y-[-1.25rem] scale-[0.9] ${formControlNeutralBackground} px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-data-[filled]:top-2 peer-data-[filled]:translate-y-[-1.25rem] peer-data-[filled]:scale-[0.9] peer-data-[focused]:px-1 peer-data-[placeholder]:top-1/2 peer-data-[placeholder]:-translate-y-1/2 peer-data-[placeholder]:scale-100 peer-data-[popup-open]:top-2 peer-data-[popup-open]:translate-y-[-1.25rem] peer-data-[popup-open]:scale-[0.9] peer-data-[popup-open]:${formControlNeutralBackground} peer-data-[popup-open]:px-1`

const floatingLabelStandard =
  'top-3 transition-[color,transform] translate-y-[-1.75rem] scale-[0.9] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-data-[filled]:translate-y-[-1.75rem] peer-data-[filled]:scale-[0.9] peer-data-[placeholder]:translate-y-0 peer-data-[placeholder]:scale-100 peer-data-[popup-open]:translate-y-[-1.75rem] peer-data-[popup-open]:scale-[0.9]'

export const floatingLabelStyleVariants: Record<FloatingStyle, string> = {
  filled: `${floatingLabelBase} ${floatingLabelFilled}`,
  outlined: `${floatingLabelBase} ${floatingLabelOutlined}`,
  standard: `${floatingLabelBase} ${floatingLabelStandard}`,
}

export const floatingLabelFocusedPlaceholderVariants: Record<FloatingStyle, string> = {
  filled: '!translate-y-[-1.25rem] !scale-[0.9]',
  outlined: '!top-2 !translate-y-[-1.25rem] !scale-[0.9] !px-1',
  standard: '!translate-y-[-1.75rem] !scale-[0.9]',
}

export const floatingLabelSizeVariants: Record<TextFieldSize, Record<FloatingStyle, string>> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { token } = textFieldSizeTokenClasses(size)
    const labelMaxWidth = `calc(100% - (${token.paddingX} * 2))`
    const labelBase = [
      textFieldTypographySizeVariants[size],
      cssDeclaration('left', token.paddingX),
      cssDeclaration('max-width', labelMaxWidth),
    ].join(' ')

    return [
      size,
      {
        filled: labelBase,
        outlined: labelBase,
        standard: labelBase,
      },
    ]
  }),
) as Record<TextFieldSize, Record<FloatingStyle, string>>

export const floatingLabelWithLeftIconSizeVariants: Record<
  TextFieldSize,
  Record<FloatingStyle, string>
> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconTextOffset, token } = textFieldSizeTokenClasses(size)
    const labelMaxWidth = `calc(100% - (${iconTextOffset} + ${token.paddingX}))`
    const labelBase = [
      textFieldTypographySizeVariants[size],
      cssDeclaration('left', iconTextOffset),
      cssDeclaration('max-width', labelMaxWidth),
    ].join(' ')

    return [
      size,
      {
        filled: labelBase,
        outlined: labelBase,
        standard: labelBase,
      },
    ]
  }),
) as Record<TextFieldSize, Record<FloatingStyle, string>>

export const floatingLabelWithLeftElementSizeVariants: Record<
  TextFieldSize,
  Record<FloatingStyle, string>
> = Object.fromEntries(
  extendedFormSizes.map(size => {
    const { iconTextOffset, token } = textFieldSizeTokenClasses(size)
    const labelMaxWidth = `calc(100% - (${iconTextOffset} + ${token.paddingX}))`
    const labelBase = [
      textFieldTypographySizeVariants[size],
      cssDeclaration('left', iconTextOffset),
      cssDeclaration('max-width', labelMaxWidth),
    ].join(' ')

    return [
      size,
      {
        filled: labelBase,
        outlined: labelBase,
        standard: `${textFieldTypographySizeVariants[size]} left-0 ${cssDeclaration('max-width', '100%')}`,
      },
    ]
  }),
) as Record<TextFieldSize, Record<FloatingStyle, string>>

const nestedClassMapValues = <Value extends string>(map: Record<string, Record<string, Value>>) =>
  Object.values(map).flatMap(value => Object.values(value))

export const textFieldClassNames = [
  textFieldRootCls,
  textFieldInputBaseCls,
  textFieldIconContainerCls,
  ...nestedClassMapValues(textFieldEnhancementVariants),
  ...nestedClassMapValues(textFieldSurfaceColorVariants),
  ...nestedClassMapValues(textFieldColorVariants),
  ...Object.values(textFieldFloatingLabelColorVariants),
  ...nestedClassMapValues(textFieldFloatingColorVariants),
  floatingInputBaseCls,
  ...Object.values(floatingInputStyleVariants),
  ...Object.values(textFieldTypographySizeVariants),
  ...Object.values(textFieldInputLeftPaddingSizeVariants),
  ...Object.values(textFieldInputRightPaddingSizeVariants),
  ...Object.values(textFieldControlContentSizeVariants),
  ...Object.values(textFieldControlSizeVariants),
  ...Object.values(textFieldHeightSizeVariants),
  ...Object.values(textFieldMinControlSizeVariants),
  ...Object.values(textFieldTextareaSizeVariants),
  ...Object.values(textFieldTextareaMinHeightVariants),
  ...Object.values(textFieldFloatingBaseSizeVariants),
  ...Object.values(textFieldFloatingInputContentSizeVariants),
  ...nestedClassMapValues(textFieldFloatingInputSizeVariants),
  ...Object.values(textFieldInputWithLeftIconSizeVariants),
  ...Object.values(textFieldInputWithRightIconSizeVariants),
  ...Object.values(textFieldLeftIconContainerSizeVariants),
  ...Object.values(textFieldRightIconContainerSizeVariants),
  ...Object.values(textFieldInputWithLeftElementSizeVariants),
  ...Object.values(textFieldInputWithRightElementSizeVariants),
  ...Object.values(floatingInputWithLeftIconSizeVariants),
  ...Object.values(floatingInputWithRightIconSizeVariants),
  ...Object.values(floatingInputWithLeftElementSizeVariants),
  ...Object.values(floatingInputWithRightElementSizeVariants),
  ...Object.values(textFieldIconSizeVariants),
  ...Object.values(textFieldDateSegmentSizeVariants),
  ...Object.values(textFieldDateRangeSurfaceSizeVariants),
  ...Object.values(floatingLabelStyleVariants),
  ...nestedClassMapValues(floatingLabelSizeVariants),
  ...nestedClassMapValues(floatingLabelWithLeftIconSizeVariants),
  ...nestedClassMapValues(floatingLabelWithLeftElementSizeVariants),
  ...Object.values(floatingLabelFocusedPlaceholderVariants),
]
