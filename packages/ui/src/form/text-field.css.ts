import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { getControlSizeValues } from '@/elements/control-size'
import { surfaceUnoColorVariants } from '@/elements/surface/surface.class'
import { type SurfaceVariant, surfaceVariants } from '@/elements/surface/surface.props'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { textFieldSizeVar } from '@/theme/runtime/component-vars'
import type { Color } from '@/theme/tokens'
import { type ExtendedFormSize, extendedFormSizes } from './form-size'

// ── Static base classes (tailwind) ──

export const textFieldRootCls = 'relative w-full'

export const textFieldInputBaseCls = 'w-full outline-none transition-all duration-150 ease-in-out'

export const textFieldIconContainerCls = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
})

const iconInset = 'calc(var(--tf-padding-x) + var(--tf-gap))'
const iconTextOffset = `calc(${iconInset} + var(--tf-icon-size) + var(--tf-gap))`

export const textFieldLeftIconContainerCls = style({
  left: iconInset,
  width: 'var(--tf-icon-size)',
  height: 'var(--tf-icon-size)',
})

export const textFieldRightIconContainerCls = style({
  right: iconInset,
  width: 'var(--tf-icon-size)',
  height: 'var(--tf-icon-size)',
})

export const textFieldInputWithLeftElementCls = style({
  paddingLeft: `var(--tf-left-slot-width, ${iconTextOffset})`,
})

export const textFieldInputWithRightElementCls = style({
  paddingRight: `var(--tf-right-slot-width, ${iconTextOffset})`,
})

// ── Color × Variant styles ──
// One VE class per color+variant combo (same pattern as surface.class.ts).

type TextFieldVariant = SurfaceVariant

const placeholderStyle = (color: Color) => ({
  '&::placeholder': {
    color: semanticColorVar(color, 'text'),
    opacity: '0.5',
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
        ...(variant === 'soft'
          ? {
              backgroundColor: semanticColorVar(color, 'surface-subtle'),
              borderColor: semanticColorVar(color, 'border-subtle'),
            }
          : {}),
        selectors: {
          ...placeholderStyle(color),
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
    backgroundColor: semanticColorVar(color, 'surface-subtle'),
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
  paddingLeft: `var(--tf-left-slot-width, ${iconTextOffset})`,
})

export const floatingInputWithRightIconCls = style({
  paddingRight: `var(--tf-right-slot-width, ${iconTextOffset})`,
})

// ── Floating label layout variants ──
// VE for prop-dependent positioning per floating style.
// Uses globalStyle for peer-dependent selectors (placeholder-shown, focus).

const _floatingLabelFilled = style({
  fontSize: 'var(--tf-font-size)',
  color: 'var(--tf-color-text)',
  left: 'var(--tf-padding-x)',
  lineHeight: 'var(--tf-line-height)',
  maxWidth: 'calc(100% - (var(--tf-padding-x) * 2))',
  overflow: 'hidden',
  position: 'absolute',
  textOverflow: 'ellipsis',
  top: '1rem',
  transformOrigin: '0',
  transitionDuration: '300ms',
  transitionProperty: 'color, transform',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  whiteSpace: 'nowrap',
  zIndex: 10,
  transform: 'translateY(-1.25rem) scale(0.9)',
})

globalStyle(`.peer:placeholder-shown ~ ${_floatingLabelFilled}`, {
  transform: 'translateY(0) scale(1)',
})

globalStyle(`.peer:focus ~ ${_floatingLabelFilled}`, {
  transform: 'translateY(-1.25rem) scale(0.9)',
  color: 'var(--tf-color-primary)',
})

globalStyle(`.peer[data-filled] ~ ${_floatingLabelFilled}`, {
  transform: 'translateY(-1.25rem) scale(0.9)',
})

globalStyle(`.peer[data-focused] ~ ${_floatingLabelFilled}`, {
  transform: 'translateY(-1.25rem) scale(0.9)',
  color: 'var(--tf-color-primary)',
})

globalStyle(`.peer[data-placeholder] ~ ${_floatingLabelFilled}`, {
  transform: 'translateY(0) scale(1)',
})

globalStyle(`.peer[data-popup-open] ~ ${_floatingLabelFilled}`, {
  transform: 'translateY(-1.25rem) scale(0.9)',
  color: 'var(--tf-color-primary)',
})

const _floatingLabelOutlined = style({
  fontSize: 'var(--tf-font-size)',
  color: 'var(--tf-color-text)',
  left: 'var(--tf-padding-x)',
  lineHeight: 'var(--tf-line-height)',
  maxWidth: 'calc(100% - (var(--tf-padding-x) * 2))',
  overflow: 'hidden',
  position: 'absolute',
  textOverflow: 'ellipsis',
  top: '0.5rem',
  transformOrigin: '0',
  transitionDuration: '300ms',
  transitionProperty: 'background-color, color, padding, top, transform',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  whiteSpace: 'nowrap',
  zIndex: 10,
  transform: 'translateY(-1.25rem) scale(0.9)',
  backgroundColor: 'var(--background)',
  paddingLeft: '0.25rem',
  paddingRight: '0.25rem',
})

globalStyle(`.peer:placeholder-shown ~ ${_floatingLabelOutlined}`, {
  top: '50%',
  transform: 'translateY(-50%) scale(1)',
})

globalStyle(`.peer:focus ~ ${_floatingLabelOutlined}`, {
  top: '0.5rem',
  transform: 'translateY(-1.25rem) scale(0.9)',
  color: 'var(--tf-color-primary)',
  paddingLeft: '0.25rem',
  paddingRight: '0.25rem',
})

globalStyle(`.peer[data-filled] ~ ${_floatingLabelOutlined}`, {
  top: '0.5rem',
  transform: 'translateY(-1.25rem) scale(0.9)',
})

globalStyle(`.peer[data-focused] ~ ${_floatingLabelOutlined}`, {
  top: '0.5rem',
  transform: 'translateY(-1.25rem) scale(0.9)',
  color: 'var(--tf-color-primary)',
  paddingLeft: '0.25rem',
  paddingRight: '0.25rem',
})

globalStyle(`.peer[data-placeholder] ~ ${_floatingLabelOutlined}`, {
  top: '50%',
  transform: 'translateY(-50%) scale(1)',
})

globalStyle(`.peer[data-popup-open] ~ ${_floatingLabelOutlined}`, {
  top: '0.5rem',
  transform: 'translateY(-1.25rem) scale(0.9)',
  color: 'var(--tf-color-primary)',
  backgroundColor: 'var(--background)',
  paddingLeft: '0.25rem',
  paddingRight: '0.25rem',
})

const _floatingLabelStandard = style({
  fontSize: 'var(--tf-font-size)',
  color: 'var(--tf-color-text)',
  left: '0',
  lineHeight: 'var(--tf-line-height)',
  maxWidth: '100%',
  overflow: 'hidden',
  position: 'absolute',
  textOverflow: 'ellipsis',
  top: '0.75rem',
  transformOrigin: '0',
  transitionDuration: '300ms',
  transitionProperty: 'color, transform',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  whiteSpace: 'nowrap',
  zIndex: 10,
  transform: 'translateY(-1.75rem) scale(0.9)',
})

globalStyle(`.peer:placeholder-shown ~ ${_floatingLabelStandard}`, {
  transform: 'translateY(0) scale(1)',
})

globalStyle(`.peer:focus ~ ${_floatingLabelStandard}`, {
  transform: 'translateY(-1.75rem) scale(0.9)',
  color: 'var(--tf-color-primary)',
})

globalStyle(`.peer[data-filled] ~ ${_floatingLabelStandard}`, {
  transform: 'translateY(-1.75rem) scale(0.9)',
})

globalStyle(`.peer[data-focused] ~ ${_floatingLabelStandard}`, {
  transform: 'translateY(-1.75rem) scale(0.9)',
  color: 'var(--tf-color-primary)',
})

globalStyle(`.peer[data-placeholder] ~ ${_floatingLabelStandard}`, {
  transform: 'translateY(0) scale(1)',
})

globalStyle(`.peer[data-popup-open] ~ ${_floatingLabelStandard}`, {
  transform: 'translateY(-1.75rem) scale(0.9)',
  color: 'var(--tf-color-primary)',
})

export const floatingLabelStyleVariants: Record<FloatingStyle, string> = {
  filled: _floatingLabelFilled,
  outlined: _floatingLabelOutlined,
  standard: _floatingLabelStandard,
}

// Left icon/element offset — overrides `left` for labels with leftIcon/leftElement
export const floatingLabelWithLeftIconCls = style({
  left: `var(--tf-left-slot-width, ${iconTextOffset})`,
  maxWidth: `calc(100% - (var(--tf-left-slot-width, ${iconTextOffset}) + var(--tf-padding-x)))`,
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
          },
        },
      ]
    }),
  ),
)

// ── Icon sizing ──
// Applied to icon containers so SVGs scale with the size variant.

export const textFieldIconCls = style({})

globalStyle(`${textFieldIconCls} svg`, {
  width: 'var(--tf-icon-size)',
  height: 'var(--tf-icon-size)',
  flexShrink: 0,
})
