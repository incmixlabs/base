import { toKebabCase } from '@incmix/theme'

function withFallback(cssVar: string, fallback: string): string {
  return `var(${cssVar}, ${fallback})`
}

function componentSizeVar(component: string, size: string, slot: string, fallback: string): string {
  return withFallback(`--component-${toKebabCase(component)}-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

function componentVar(component: string, slot: string, fallback: string): string {
  return withFallback(`--component-${toKebabCase(component)}-${toKebabCase(slot)}`, fallback)
}

export type ButtonSizeTokenSlot =
  | 'height'
  | 'paddingInline'
  | 'paddingBlock'
  | 'fontSize'
  | 'lineHeight'
  | 'gap'
  | 'iconSize'

export type SurfaceVariantTokenSlot = 'boxShadow'
export type SurfaceShapeTokenSlot = 'radius'
export type AccordionSizeTokenSlot =
  | 'triggerPaddingInline'
  | 'triggerPaddingBlock'
  | 'contentPaddingInline'
  | 'contentPaddingBlock'
  | 'fontSize'
  | 'lineHeight'
  | 'gap'
  | 'iconSize'
  | 'triggerTransition'
export type BadgeSizeTokenSlot =
  | 'fontSize'
  | 'lineHeight'
  | 'paddingInline'
  | 'paddingBlock'
  | 'gap'
  | 'deleteButtonSize'
  | 'deleteButtonMarginStart'
  | 'avatarMarginStart'
  | 'avatarSize'
export type CalloutSizeTokenSlot =
  | 'padding'
  | 'rowGap'
  | 'columnGap'
  | 'iconHeight'
  | 'iconSize'
  | 'fontSize'
  | 'lineHeight'
export type CardSizeTokenSlot = 'padding'
export type PopoverSizeTokenSlot = 'padding' | 'fontSize' | 'lineHeight'
export type PopoverMaxWidthTokenSlot = 'maxWidth'
export type TooltipSizeTokenSlot = 'padding' | 'fontSize' | 'lineHeight'
export type TooltipMaxWidthTokenSlot = 'maxWidth'
export type ProgressSizeTokenSlot = 'height'
export type ProgressVariantTokenSlot = 'boxShadow'
export type ProgressMotionTokenSlot = 'indicatorTransition' | 'indeterminateDuration' | 'indeterminateWidth'
export type DialogSizeTokenSlot =
  | 'maxWidth'
  | 'titleFontSize'
  | 'titleLineHeight'
  | 'descriptionFontSize'
  | 'descriptionLineHeight'
  | 'padding'
  | 'footerGap'
export type SliderSizeTokenSlot = 'trackHeight' | 'thumbSize'
export type SliderVariantTokenSlot = 'boxShadow'
export type StepperSizeTokenSlot =
  | 'rootGap'
  | 'navGap'
  | 'itemGap'
  | 'triggerGap'
  | 'triggerFontSize'
  | 'indicatorSize'
  | 'titleFontSize'
  | 'descriptionFontSize'
  | 'panelPadding'
  | 'footerGap'
  | 'footerMetaFontSize'
  | 'separatorOffset'
export type TimelineSizeTokenSlot =
  | 'indicatorSize'
  | 'itemOffset'
  | 'itemGap'
  | 'itemPaddingInlineEnd'
  | 'itemPaddingBlockEnd'
  | 'titleFontSize'
  | 'dateFontSize'
  | 'contentFontSize'
export type FieldGroupSectionTokenSlot = 'separatorMarginBlock' | 'headerMarginBottom' | 'descriptionMarginTop'
export type FieldGroupRowTokenSlot = 'rootGap' | 'columnGap' | 'descriptionMarginTop'
export type PickerPopupSizeTokenSlot =
  | 'viewportMaxHeight'
  | 'popupPadding'
  | 'statusPaddingX'
  | 'statusPaddingY'
  | 'searchHeight'
  | 'fontSize'
  | 'lineHeight'
  | 'rowPaddingX'
  | 'rowPaddingY'
  | 'rowTrailingPadding'
  | 'iconSize'
export type FileUploadSizeTokenSlot =
  | 'defaultPadding'
  | 'minimalPadding'
  | 'cardPadding'
  | 'iconShellPadding'
  | 'iconSize'
  | 'titleFontSize'
  | 'descriptionFontSize'
export type MentionTextareaTokenSlot =
  | 'suggestionMinWidth'
  | 'suggestionMaxWidth'
  | 'suggestionFontSize'
  | 'suggestionEmptyPaddingInline'
  | 'suggestionEmptyPaddingBlock'
  | 'dragOverlayFontSize'
  | 'previewMinHeight'
  | 'previewPaddingInline'
  | 'previewPaddingBlock'
  | 'previewFontSize'
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
export type CheckboxSizeTokenSlot = 'boxSize' | 'iconSize' | 'borderRadius'
export type CheckboxGroupTokenSlot = 'gap' | 'inlineGap' | 'itemGap'
export type CheckboxCardsSizeTokenSlot = 'padding' | 'boxSize' | 'iconSize' | 'fontSize' | 'gap'
export type SwitchSizeTokenSlot = 'rootHeight' | 'rootWidth' | 'thumbSize' | 'thumbTranslate' | 'gap'
export type SwitchGroupTokenSlot = 'gap' | 'inlineGap'
export type RadioSizeTokenSlot = 'radioSize' | 'indicatorSize' | 'gap'
export type RadioGroupTokenSlot = 'gap' | 'inlineGap'
export type RadioCardsSizeTokenSlot = 'padding' | 'gap' | 'indicatorSize' | 'indicatorInnerSize' | 'fontSize'
export type IconButtonSizeTokenSlot = 'height' | 'fontSize' | 'iconSize'
export type ToggleSizeTokenSlot = 'height' | 'paddingInline' | 'fontSize' | 'iconSize' | 'gap'
export type ToggleGroupTokenSlot = 'gap'
export type RatingSizeTokenSlot = 'iconSize' | 'gap'
export type AppShellLayoutTokenSlot =
  | 'bodyGridTemplateColumns'
  | 'bodyWithSecondaryGridTemplateColumns'
  | 'bodyWithSecondaryRightGridTemplateColumns'
export type AppShellContentTokenSlot = 'paddingInline' | 'paddingBlock' | 'paddingInlineDesktop' | 'paddingBlockDesktop'
export type ContentBodyTokenSlot = 'background' | 'foreground' | 'borderColor'
export type ScrollAreaSizeTokenSlot = 'thickness' | 'thumbInset'
export type ScrollAreaShapeTokenSlot = 'radius'
export type TreeViewSizeTokenSlot =
  | 'itemPaddingInline'
  | 'itemPaddingBlock'
  | 'fontSize'
  | 'lineHeight'
  | 'gap'
  | 'iconSize'
  | 'itemRadius'

export function buttonSizeVar(size: string, slot: ButtonSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-button-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function buttonMotionVar(slot: string, fallback: string): string {
  return withFallback(`--component-button-motion-${toKebabCase(slot)}`, fallback)
}

export function surfaceVariantVar(variant: string, slot: SurfaceVariantTokenSlot, fallback: string): string {
  return withFallback(`--component-surface-variant-${toKebabCase(variant)}-${toKebabCase(slot)}`, fallback)
}

export function surfaceShapeVar(shape: string, slot: SurfaceShapeTokenSlot, fallback: string): string {
  return withFallback(`--component-surface-shape-${toKebabCase(shape)}-${toKebabCase(slot)}`, fallback)
}

export function accordionSizeVar(size: string, slot: AccordionSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-accordion-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function fieldGroupSectionVar(slot: FieldGroupSectionTokenSlot, fallback: string): string {
  return withFallback(`--component-field-group-section-${toKebabCase(slot)}`, fallback)
}

export function fieldGroupRowVar(slot: FieldGroupRowTokenSlot, fallback: string): string {
  return withFallback(`--component-field-group-row-${toKebabCase(slot)}`, fallback)
}

export function pickerPopupSizeVar(size: string, slot: PickerPopupSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-picker-popup-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function fileUploadSizeVar(size: string, slot: FileUploadSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-file-upload-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function mentionTextareaVar(slot: MentionTextareaTokenSlot, fallback: string): string {
  return withFallback(`--component-mention-textarea-${toKebabCase(slot)}`, fallback)
}

export function dateSizeVar(size: string, slot: DateSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-date-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function badgeSizeVar(size: string, slot: BadgeSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-badge-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function calloutSizeVar(size: string, slot: CalloutSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-callout-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function cardSizeVar(size: string, slot: CardSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-card-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function popoverSizeVar(size: string, slot: PopoverSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-popover-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function popoverMaxWidthVar(size: string, slot: PopoverMaxWidthTokenSlot, fallback: string): string {
  return withFallback(`--component-popover-max-width-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function tooltipSizeVar(size: string, slot: TooltipSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-tooltip-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function tooltipMaxWidthVar(size: string, slot: TooltipMaxWidthTokenSlot, fallback: string): string {
  return withFallback(`--component-tooltip-max-width-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function progressSizeVar(size: string, slot: ProgressSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-progress-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function progressVariantVar(variant: string, slot: ProgressVariantTokenSlot, fallback: string): string {
  return withFallback(`--component-progress-variant-${toKebabCase(variant)}-${toKebabCase(slot)}`, fallback)
}

export function progressMotionVar(slot: ProgressMotionTokenSlot, fallback: string): string {
  return withFallback(`--component-progress-motion-${toKebabCase(slot)}`, fallback)
}

export function dialogSizeVar(size: string, slot: DialogSizeTokenSlot, fallback: string): string {
  return componentSizeVar('dialog', size, slot, fallback)
}

export function sliderSizeVar(size: string, slot: SliderSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-slider-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function sliderVariantVar(variant: string, slot: SliderVariantTokenSlot, fallback: string): string {
  return withFallback(`--component-slider-variant-${toKebabCase(variant)}-${toKebabCase(slot)}`, fallback)
}

export function stepperSizeVar(size: string, slot: StepperSizeTokenSlot, fallback: string): string {
  return componentSizeVar('stepper', size, slot, fallback)
}

export function timelineSizeVar(size: string, slot: TimelineSizeTokenSlot, fallback: string): string {
  return componentSizeVar('timeline', size, slot, fallback)
}

export function textFieldSizeVar(size: string, slot: TextFieldSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-text-field-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function checkboxSizeVar(size: string, slot: CheckboxSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-checkbox-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function checkboxGroupVar(slot: CheckboxGroupTokenSlot, fallback: string): string {
  return componentVar('checkbox-group', slot, fallback)
}

export function checkboxCardsSizeVar(size: string, slot: CheckboxCardsSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-checkbox-cards-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function switchSizeVar(size: string, slot: SwitchSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-switch-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function switchGroupVar(slot: SwitchGroupTokenSlot, fallback: string): string {
  return componentVar('switch-group', slot, fallback)
}

export function radioSizeVar(size: string, slot: RadioSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-radio-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function radioGroupVar(slot: RadioGroupTokenSlot, fallback: string): string {
  return componentVar('radio-group', slot, fallback)
}

export function radioCardsSizeVar(size: string, slot: RadioCardsSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-radio-cards-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function iconButtonSizeVar(size: string, slot: IconButtonSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-icon-button-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function toggleSizeVar(size: string, slot: ToggleSizeTokenSlot, fallback: string): string {
  return componentSizeVar('toggle', size, slot, fallback)
}

export function toggleGroupVar(slot: ToggleGroupTokenSlot, fallback: string): string {
  return componentVar('toggle-group', slot, fallback)
}

export function ratingSizeVar(size: string, slot: RatingSizeTokenSlot, fallback: string): string {
  return componentSizeVar('rating', size, slot, fallback)
}

export function appShellLayoutVar(slot: AppShellLayoutTokenSlot, fallback: string): string {
  return withFallback(`--component-app-shell-layout-${toKebabCase(slot)}`, fallback)
}

export function appShellContentVar(slot: AppShellContentTokenSlot, fallback: string): string {
  return withFallback(`--component-app-shell-content-${toKebabCase(slot)}`, fallback)
}

export function contentBodyVar(slot: ContentBodyTokenSlot, fallback: string): string {
  return withFallback(`--component-content-body-${toKebabCase(slot)}`, fallback)
}

export function scrollAreaSizeVar(size: string, slot: ScrollAreaSizeTokenSlot, fallback: string): string {
  return withFallback(`--component-scroll-area-size-${toKebabCase(size)}-${toKebabCase(slot)}`, fallback)
}

export function scrollAreaShapeVar(shape: string, slot: ScrollAreaShapeTokenSlot, fallback: string): string {
  return withFallback(`--component-scroll-area-shape-${toKebabCase(shape)}-${toKebabCase(slot)}`, fallback)
}

export function treeViewSizeVar(size: string, slot: TreeViewSizeTokenSlot, fallback: string): string {
  return componentSizeVar('tree-view', size, slot, fallback)
}
