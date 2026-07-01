import { toKebabCase } from '@incmix/theme'

function withFallback(cssVar: string, fallback: string): string {
  return `var(${cssVar}, ${fallback})`
}

function componentSizeVar(component: string, size: string, slot: string, fallback: string): string {
  return withFallback(`--af-${toKebabCase(component)}-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

function componentVar(component: string, slot: string, fallback: string): string {
  return withFallback(`--af-${toKebabCase(component)}-${toKebabCase(slot)}`, fallback)
}

export type PopoverSizeTokenSlot = 'padding' | 'fontSize' | 'lineHeight'
export type PopoverMaxWidthTokenSlot = 'maxWidth'
export type TooltipSizeTokenSlot = 'padding' | 'fontSize' | 'lineHeight'
export type TooltipMaxWidthTokenSlot = 'maxWidth'
export type SliderSizeTokenSlot = 'trackHeight' | 'thumbSize'
export type SliderVariantTokenSlot = 'boxShadow'
export type FieldGroupSectionTokenSlot = 'separatorMarginBlock' | 'headerMarginBottom' | 'descriptionMarginTop'
export type FieldGroupRowTokenSlot = 'rootGap' | 'columnGap' | 'descriptionMarginTop'
export type FileUploadSizeTokenSlot =
  | 'defaultPadding'
  | 'minimalPadding'
  | 'cardPadding'
  | 'iconShellPadding'
  | 'iconSize'
  | 'titleFontSize'
  | 'descriptionFontSize'
export type DateSizeTokenSlot =
  | 'controlHeight'
  | 'controlFontSize'
  | 'controlLineHeight'
  | 'controlPaddingInline'
  | 'controlPaddingBlock'
  | 'controlGap'
  | 'controlIconSize'
  | 'calendarDaySize'
  | 'calendarNavSize'
  | 'calendarNavIconSize'
  | 'calendarFontSize'
  | 'calendarLineHeight'
  | 'calendarGridGap'
  | 'calendarPopoverPadding'
  | 'calendarHeadingGap'
  | 'rangeFieldMinWidth'
  | 'miniCalendarPadding'
  | 'miniCalendarBodyGap'
  | 'miniCalendarHeaderGap'
  | 'miniCalendarTitleFontSize'
export type TextFieldSizeTokenSlot =
  | 'height'
  | 'floatingHeight'
  | 'fontSize'
  | 'lineHeight'
  | 'paddingInline'
  | 'paddingBlock'
  | 'iconSize'
  | 'gap'
  | 'floatingOutlinedPlaceholderTranslate'
export type SwitchSizeTokenSlot = 'rootHeight' | 'rootWidth' | 'thumbSize' | 'thumbTranslate' | 'gap'
export type SwitchGroupTokenSlot = 'gap' | 'inlineGap'
export type RatingSizeTokenSlot = 'iconSize' | 'gap'
export type AppShellLayoutTokenSlot =
  | 'bodyGridTemplateColumns'
  | 'bodyWithSecondaryGridTemplateColumns'
  | 'bodyWithSecondaryRightGridTemplateColumns'
export type AppShellContentTokenSlot = 'paddingInline' | 'paddingBlock' | 'paddingInlineDesktop' | 'paddingBlockDesktop'
export type ContentBodyTokenSlot = 'background' | 'foreground' | 'borderColor'
export type ScrollAreaSizeTokenSlot = 'thickness' | 'thumbInset'
export type ScrollAreaShapeTokenSlot = 'radius'

export function fieldGroupSectionVar(slot: FieldGroupSectionTokenSlot, fallback: string): string {
  return withFallback(`--af-field-group-section-${toKebabCase(slot)}`, fallback)
}

export function fieldGroupRowVar(slot: FieldGroupRowTokenSlot, fallback: string): string {
  return withFallback(`--af-field-group-row-${toKebabCase(slot)}`, fallback)
}

export function fileUploadSizeVar(size: string, slot: FileUploadSizeTokenSlot, fallback: string): string {
  return withFallback(`--af-file-upload-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function dateSizeVar(size: string, slot: DateSizeTokenSlot, fallback: string): string {
  return withFallback(`--af-date-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function popoverSizeVar(size: string, slot: PopoverSizeTokenSlot, fallback: string): string {
  return withFallback(`--af-popover-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function popoverMaxWidthVar(size: string, slot: PopoverMaxWidthTokenSlot, fallback: string): string {
  return withFallback(`--af-popover-max-width-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function tooltipSizeVar(size: string, slot: TooltipSizeTokenSlot, fallback: string): string {
  return withFallback(`--af-tooltip-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function tooltipMaxWidthVar(size: string, slot: TooltipMaxWidthTokenSlot, fallback: string): string {
  return withFallback(`--af-tooltip-max-width-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function sliderSizeVar(size: string, slot: SliderSizeTokenSlot, fallback: string): string {
  return withFallback(`--af-slider-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function sliderVariantVar(variant: string, slot: SliderVariantTokenSlot, fallback: string): string {
  return withFallback(`--af-slider-variant-${toKebabCase(variant)}-${toKebabCase(slot)}`, fallback)
}

export function textFieldSizeVar(size: string, slot: TextFieldSizeTokenSlot, fallback: string): string {
  return withFallback(`--af-text-field-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function switchSizeVar(size: string, slot: SwitchSizeTokenSlot, fallback: string): string {
  return withFallback(`--af-switch-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function switchGroupVar(slot: SwitchGroupTokenSlot, fallback: string): string {
  return componentVar('switch-group', slot, fallback)
}

export function ratingSizeVar(size: string, slot: RatingSizeTokenSlot, fallback: string): string {
  return componentSizeVar('rating', size, slot, fallback)
}

export function appShellLayoutVar(slot: AppShellLayoutTokenSlot, fallback: string): string {
  return withFallback(`--af-app-shell-layout-${toKebabCase(slot)}`, fallback)
}

export function appShellContentVar(slot: AppShellContentTokenSlot, fallback: string): string {
  return withFallback(`--af-app-shell-content-${toKebabCase(slot)}`, fallback)
}

export function contentBodyVar(slot: ContentBodyTokenSlot, fallback: string): string {
  return withFallback(`--af-content-body-${toKebabCase(slot)}`, fallback)
}

export function scrollAreaSizeVar(size: string, slot: ScrollAreaSizeTokenSlot, fallback: string): string {
  return withFallback(`--af-scroll-area-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function scrollAreaShapeVar(shape: string, slot: ScrollAreaShapeTokenSlot, fallback: string): string {
  return withFallback(`--af-scroll-area-shape-${toKebabCase(shape)}-${toKebabCase(slot)}`, fallback)
}
