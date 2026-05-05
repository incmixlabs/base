import { createVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { getControlSizeValues } from '@/elements/control-size'
import { surfaceColorVariants } from '@/elements/surface/surface.css'
import { type SurfaceVariant, surfaceVariants } from '@/elements/surface/surface.props'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { textFieldSizeVar } from '@/theme/runtime/component-vars'
import type { Color } from '@/theme/tokens'
import { type ExtendedFormSize, extendedFormSizes } from './form-size'

// ── Static base classes (tailwind) ──

export const textFieldRootCls = 'relative w-full'

export const textFieldInputBaseCls = 'w-full outline-none transition-all duration-150 ease-in-out'

export const textFieldIconContainerCls =
  'absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-[calc(var(--tf-padding-x)*2+var(--tf-icon-size))] z-10'

// ── Color × Variant styles ──
// One VE class per color+variant combo (same pattern as surface.css.ts).

type TextFieldVariant = SurfaceVariant

const placeholderStyle = (color: Color, variant: TextFieldVariant) => ({
  '&::placeholder': {
    color: semanticColorVar(color, variant === 'classic' || variant === 'solid' ? 'contrast' : 'text'),
    opacity: variant === 'classic' || variant === 'solid' ? '0.68' : '0.5',
  },
})

const focusRing = (color: Color) => ({
  '&:focus': {
    borderColor: semanticColorVar(color, 'primary'),
    outline: `2px solid ${semanticColorVar(color, 'primary-alpha')}`,
    outlineOffset: '2px',
  },
})

const outlineNoHoverBackground = () => ({
  '&:hover': {
    backgroundColor: 'transparent',
    backgroundImage: 'none',
  },
  '&:active': {
    backgroundColor: 'transparent',
    backgroundImage: 'none',
  },
})

const ghostHoverAsFocusedOutline = (color: Color) => ({
  '&:hover': {
    borderColor: semanticColorVar(color, 'primary'),
    outline: `2px solid ${semanticColorVar(color, 'primary-alpha')}`,
    outlineOffset: '2px',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
  },
})

const textFieldVariantKeys = surfaceVariants

const createTextFieldEnhancements = (color: Color): Record<TextFieldVariant, string> =>
  Object.fromEntries(
    textFieldVariantKeys.map(variant => [
      variant,
      style({
        selectors: {
          ...placeholderStyle(color, variant),
          ...focusRing(color),
          ...(variant === 'outline' ? outlineNoHoverBackground() : {}),
          ...(variant === 'ghost' ? ghostHoverAsFocusedOutline(color) : {}),
        },
      }),
    ]),
  ) as Record<TextFieldVariant, string>

const textFieldEnhancementVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, createTextFieldEnhancements(color)]),
) as Record<Color, Record<TextFieldVariant, string>>

export const textFieldColorVariants: Record<Color, Record<TextFieldVariant, string>> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    Object.fromEntries(
      textFieldVariantKeys.map(variant => [
        variant,
        `${surfaceColorVariants[color][variant]} ${textFieldEnhancementVariants[color][variant]}`,
      ]),
    ),
  ]),
) as Record<Color, Record<TextFieldVariant, string>>

// ── Floating wrapper color class ──
// Sets CSS vars on the wrapper so label (sibling of input) can reference them.

export const textFieldFloatingWrapperColorVariants: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      vars: {
        '--tf-color-text': semanticColorVar(color, 'text'),
        '--tf-color-primary': semanticColorVar(color, 'primary'),
      },
    }),
  ]),
) as Record<Color, string>

// ── Floating color variants ──
// VE for prop-dependent color on the input; static layout stays in TW.

type FloatingStyle = 'filled' | 'outlined' | 'standard'

const createFloatingColorStyles = (color: Color): Record<FloatingStyle, string> => ({
  filled: style({
    borderColor: semanticColorVar(color, 'primary'),
    backgroundColor: 'var(--color-secondary-soft)',
    selectors: {
      '&:focus': {
        borderColor: semanticColorVar(color, 'primary'),
      },
    },
  }),
  outlined: style({
    borderColor: semanticColorVar(color, 'primary'),
    backgroundColor: 'transparent',
    selectors: {
      '&:focus': {
        borderColor: semanticColorVar(color, 'primary'),
        outline: `2px solid ${semanticColorVar(color, 'primary-alpha')}`,
        outlineOffset: '2px',
      },
    },
  }),
  standard: style({
    borderColor: semanticColorVar(color, 'primary'),
    backgroundColor: 'transparent',
    selectors: {
      '&:focus': {
        borderColor: semanticColorVar(color, 'primary'),
      },
    },
  }),
})

export const textFieldFloatingColorVariants: Record<Color, Record<FloatingStyle, string>> = Object.fromEntries(
  semanticColorKeys.map(color => [color, createFloatingColorStyles(color)]),
) as Record<Color, Record<FloatingStyle, string>>

// ── Floating input base class ──
// VE for shared floating input styles (height, box-sizing, disabled).

export const floatingInputBaseCls =
  'box-border h-[var(--tf-floating-height)] disabled:cursor-not-allowed disabled:opacity-50'

// ── Floating input layout variants ──
// VE for prop-dependent layout per floating style (padding, border-width, border-radius).

export const floatingInputStyleVariants: Record<FloatingStyle, string> = {
  filled: style({
    fontSize: 'var(--tf-font-size)',
    lineHeight: 'var(--tf-line-height)',
    borderStyle: 'solid',
    borderWidth: '0 0 2px 0',
    borderRadius: 'var(--element-border-radius) var(--element-border-radius) 0 0',
    paddingLeft: 'var(--tf-padding-x)',
    paddingRight: 'var(--tf-padding-x)',
    paddingTop: 'var(--tf-line-height)',
    paddingBottom: 'var(--tf-padding-y)',
  }),
  outlined: style({
    fontSize: 'var(--tf-font-size)',
    lineHeight: 'var(--tf-line-height)',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: 'var(--element-border-radius)',
    paddingLeft: 'var(--tf-padding-x)',
    paddingRight: 'var(--tf-padding-x)',
    paddingTop: 'var(--tf-line-height)',
    paddingBottom: 'var(--tf-padding-y)',
  }),
  standard: style({
    fontSize: 'var(--tf-font-size)',
    lineHeight: 'var(--tf-line-height)',
    borderStyle: 'solid',
    borderWidth: '0 0 2px 0',
    borderRadius: '0',
    paddingLeft: '0',
    paddingRight: '0',
    paddingTop: 'var(--tf-line-height)',
    paddingBottom: 'var(--tf-padding-y)',
  }),
}

// Icon/element padding overrides for floating input
export const floatingInputWithLeftIconCls = style({
  paddingLeft: 'calc(var(--tf-padding-x) * 2 + var(--tf-icon-size))',
})

export const floatingInputWithRightIconCls = style({
  paddingRight: 'calc(var(--tf-padding-x) * 2 + var(--tf-icon-size))',
})

// ── Floating label layout variants ──
// VE for prop-dependent positioning per floating style.
// Uses globalStyle for peer-dependent selectors (placeholder-shown, focus).

const _floatingLabelFilled = style({
  fontSize: 'var(--tf-font-size)',
  color: 'var(--tf-color-text)',
  left: 'var(--tf-padding-x)',
  top: '1rem',
  zIndex: 10,
  transform: 'translateY(-1.25rem) scale(0.9)',
})

globalStyle(`.peer:placeholder-shown ~ ${_floatingLabelFilled}`, {
  transform: 'translateY(0) scale(1)',
})

globalStyle(`.peer:focus ~ ${_floatingLabelFilled}`, {
  transform: 'translateY(-1.25rem) scale(0.9)',
})

const _floatingLabelOutlined = style({
  fontSize: 'var(--tf-font-size)',
  color: 'var(--tf-color-text)',
  left: 'var(--tf-padding-x)',
  top: '0.5rem',
  zIndex: 10,
  transform: 'translateY(-1.25rem) scale(0.9)',
  backgroundColor: 'var(--background)',
  paddingLeft: '0.25rem',
  paddingRight: '0.25rem',
})

const floatingOutlinedPlaceholderTranslateVar = createVar()
const floatingOutlinedPlaceholderTranslateBySize: Record<ExtendedFormSize, string> = {
  xs: '0.05rem',
  sm: '0.25rem',
  md: '0.25rem',
  lg: '0.45rem',
  '2x': '1rem',
}

globalStyle(`.peer:placeholder-shown ~ ${_floatingLabelOutlined}`, {
  transform: `translateY(${floatingOutlinedPlaceholderTranslateVar}) scale(1)`,
})

globalStyle(`.peer:focus ~ ${_floatingLabelOutlined}`, {
  transform: 'translateY(-1.25rem) scale(0.9)',
  paddingLeft: '0.25rem',
  paddingRight: '0.25rem',
})

const _floatingLabelStandard = style({
  fontSize: 'var(--tf-font-size)',
  color: 'var(--tf-color-text)',
  left: '0',
  top: '0.75rem',
  zIndex: 10,
  transform: 'translateY(-1.75rem) scale(0.9)',
})

globalStyle(`.peer:placeholder-shown ~ ${_floatingLabelStandard}`, {
  transform: 'translateY(0) scale(1)',
})

globalStyle(`.peer:focus ~ ${_floatingLabelStandard}`, {
  transform: 'translateY(-1.75rem) scale(0.9)',
})

export const floatingLabelStyleVariants: Record<FloatingStyle, string> = {
  filled: _floatingLabelFilled,
  outlined: _floatingLabelOutlined,
  standard: _floatingLabelStandard,
}

// Left icon/element offset — overrides `left` for labels with leftIcon/leftElement
export const floatingLabelWithLeftIconCls = style({
  left: 'calc(var(--tf-padding-x) * 2 + var(--tf-icon-size))',
})

// ── Size variants ──
// Sets CSS custom properties on the root element so child elements
// (input, label, icon containers) can reference them via var().

export type TextFieldSize = ExtendedFormSize

export const textFieldSizeVariants: Record<TextFieldSize, string> = styleVariants(
  Object.fromEntries(
    extendedFormSizes.map(size => {
      const token = getControlSizeValues(size)
      return [
        size,
        {
          vars: {
            '--tf-height': textFieldSizeVar(size, 'height', token.height),
            '--tf-floating-height': textFieldSizeVar(
              size,
              'floatingHeight',
              `calc(${token.height} + ${token.paddingY} * 1.65 )`,
            ),
            '--tf-font-size': textFieldSizeVar(size, 'fontSize', token.fontSize),
            '--tf-line-height': textFieldSizeVar(size, 'lineHeight', token.lineHeight),
            '--tf-padding-x': textFieldSizeVar(size, 'paddingInline', token.paddingX),
            '--tf-padding-y': textFieldSizeVar(size, 'paddingBlock', token.paddingY),
            '--tf-icon-size': textFieldSizeVar(size, 'iconSize', token.iconSize),
            '--tf-gap': textFieldSizeVar(size, 'gap', token.gap),
            [floatingOutlinedPlaceholderTranslateVar]: textFieldSizeVar(
              size,
              'floatingOutlinedPlaceholderTranslate',
              floatingOutlinedPlaceholderTranslateBySize[size],
            ),
          },
        },
      ]
    }),
  ),
)

// ── Icon sizing ──
// Applied to icon containers so SVGs scale with the size variant.

export const textFieldIconCls = style({})

globalStyle(`${textFieldIconCls} > svg`, {
  width: 'var(--tf-icon-size)',
  height: 'var(--tf-icon-size)',
  flexShrink: 0,
})
