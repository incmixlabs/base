import { isValidFontWeightDescriptor, type ThemeFontSource, type ThemeFontSourceMap } from '../font-sources.js'
import type { TypographyResponsiveProfile } from '../token-constants.js'

function hasOwnProp<T extends object, K extends PropertyKey>(obj: T, prop: K): obj is T & Record<K, unknown> {
  return Object.hasOwn(obj, prop)
}

export const THEME_CONTRACT_SCHEMA_VERSION = '1.0.0' as const

export type ThemeLifecycle = 'draft' | 'review' | 'published'

export type ButtonComponentTokens = {
  size?: Record<
    string,
    Partial<{
      height: string
      paddingInline: string
      paddingBlock: string
      fontSize: string
      lineHeight: string
      gap: string
      iconSize: string
    }>
  >
  motion?: Partial<{
    transition: string
  }>
}

export type SurfaceComponentTokens = {
  variant?: Record<
    string,
    Partial<{
      boxShadow: string
    }>
  >
  shape?: Record<
    string,
    Partial<{
      radius: string
    }>
  >
}

export type AccordionComponentTokens = {
  size?: Record<
    string,
    Partial<{
      triggerPaddingInline: string
      triggerPaddingBlock: string
      contentPaddingInline: string
      contentPaddingBlock: string
      fontSize: string
      lineHeight: string
      gap: string
      iconSize: string
      triggerTransition: string
    }>
  >
}

export type BadgeComponentTokens = {
  size?: Record<
    string,
    Partial<{
      fontSize: string
      lineHeight: string
      paddingInline: string
      paddingBlock: string
      gap: string
      deleteButtonSize: string
      deleteButtonMarginStart: string
      avatarMarginStart: string
      avatarSize: string
    }>
  >
}

export type CalloutComponentTokens = {
  size?: Record<
    string,
    Partial<{
      padding: string
      rowGap: string
      columnGap: string
      iconHeight: string
      iconSize: string
      fontSize: string
      lineHeight: string
    }>
  >
}

export type CardComponentTokens = {
  size?: Record<
    string,
    Partial<{
      padding: string
    }>
  >
}

export type PopoverComponentTokens = {
  size?: Record<
    string,
    Partial<{
      padding: string
      fontSize: string
      lineHeight: string
    }>
  >
  maxWidth?: Record<
    string,
    Partial<{
      maxWidth: string
    }>
  >
}

export type TooltipComponentTokens = {
  size?: Record<
    string,
    Partial<{
      padding: string
      fontSize: string
      lineHeight: string
    }>
  >
  maxWidth?: Record<
    string,
    Partial<{
      maxWidth: string
    }>
  >
}

export type ProgressComponentTokens = {
  size?: Record<
    string,
    Partial<{
      height: string
    }>
  >
  variant?: Record<
    string,
    Partial<{
      boxShadow: string
    }>
  >
  motion?: Partial<{
    indicatorTransition: string
    indeterminateDuration: string
    indeterminateWidth: string
  }>
}

export type DialogComponentTokens = {
  size?: Record<
    string,
    Partial<{
      maxWidth: string
      titleFontSize: string
      titleLineHeight: string
      descriptionFontSize: string
      descriptionLineHeight: string
      padding: string
      footerGap: string
    }>
  >
}

export type SliderComponentTokens = {
  size?: Record<
    string,
    Partial<{
      trackHeight: string
      thumbSize: string
    }>
  >
  variant?: Record<
    string,
    Partial<{
      boxShadow: string
    }>
  >
}

export type TextFieldComponentTokens = {
  size?: Record<
    string,
    Partial<{
      height: string
      floatingHeight: string
      fontSize: string
      lineHeight: string
      paddingInline: string
      paddingBlock: string
      iconSize: string
      gap: string
      floatingOutlinedPlaceholderTranslate: string
    }>
  >
}

export type CheckboxComponentTokens = {
  size?: Record<
    string,
    Partial<{
      boxSize: string
      iconSize: string
      borderRadius: string
    }>
  >
}

export type CheckboxGroupComponentTokens = {
  gap?: string
  inlineGap?: string
  itemGap?: string
}

export type SwitchComponentTokens = {
  size?: Record<
    string,
    Partial<{
      rootHeight: string
      rootWidth: string
      thumbSize: string
      thumbTranslate: string
      gap: string
    }>
  >
  group?: Partial<{
    gap: string
    inlineGap: string
  }>
}

export type RadioComponentTokens = {
  size?: Record<
    string,
    Partial<{
      radioSize: string
      indicatorSize: string
      gap: string
    }>
  >
  group?: Partial<{
    gap: string
    inlineGap: string
  }>
}

export type FieldGroupComponentTokens = {
  section?: Partial<{
    separatorMarginBlock: string
    headerMarginBottom: string
    descriptionMarginTop: string
  }>
  row?: Partial<{
    rootGap: string
    columnGap: string
    descriptionMarginTop: string
  }>
}

export type CheckboxCardsComponentTokens = {
  size?: Record<
    string,
    Partial<{
      padding: string
      boxSize: string
      iconSize: string
      fontSize: string
      gap: string
    }>
  >
}

export type RadioCardsComponentTokens = {
  size?: Record<
    string,
    Partial<{
      padding: string
      gap: string
      indicatorSize: string
      indicatorInnerSize: string
      fontSize: string
    }>
  >
}

export type IconButtonComponentTokens = {
  size?: Record<
    string,
    Partial<{
      height: string
      fontSize: string
      iconSize: string
    }>
  >
}

export type StepperComponentTokens = {
  size?: Record<
    string,
    Partial<{
      rootGap: string
      navGap: string
      itemGap: string
      triggerGap: string
      triggerFontSize: string
      indicatorSize: string
      titleFontSize: string
      descriptionFontSize: string
      panelPadding: string
      footerGap: string
      footerMetaFontSize: string
      separatorOffset: string
    }>
  >
}

export type ToggleComponentTokens = {
  size?: Record<
    string,
    Partial<{
      height: string
      fontSize: string
      iconSize: string
    }>
  >
  group?: Partial<{
    gap: string
  }>
}

export type TimelineComponentTokens = {
  size?: Record<
    string,
    Partial<{
      indicatorSize: string
      itemOffset: string
      itemGap: string
      itemPaddingInlineEnd: string
      itemPaddingBlockEnd: string
      titleFontSize: string
      dateFontSize: string
      contentFontSize: string
    }>
  >
}

export type RatingComponentTokens = {
  size?: Record<
    string,
    Partial<{
      iconSize: string
      gap: string
    }>
  >
}

export type PickerPopupComponentTokens = {
  size?: Record<
    string,
    Partial<{
      viewportMaxHeight: string
      popupPadding: string
      statusPaddingX: string
      statusPaddingY: string
      searchHeight: string
      fontSize: string
      lineHeight: string
      rowPaddingX: string
      rowPaddingY: string
      rowTrailingPadding: string
      iconSize: string
    }>
  >
}

export type FileUploadComponentTokens = {
  size?: Record<
    string,
    Partial<{
      defaultPadding: string
      minimalPadding: string
      cardPadding: string
      iconShellPadding: string
      iconSize: string
      titleFontSize: string
      descriptionFontSize: string
    }>
  >
}

export type MentionTextareaComponentTokens = Partial<{
  suggestionMinWidth: string
  suggestionMaxWidth: string
  suggestionFontSize: string
  suggestionEmptyPaddingInline: string
  suggestionEmptyPaddingBlock: string
  dragOverlayFontSize: string
  previewMinHeight: string
  previewPaddingInline: string
  previewPaddingBlock: string
  previewFontSize: string
}>

export type DateComponentTokens = {
  size?: Record<
    string,
    Partial<{
      controlHeight: string
      controlFontSize: string
      controlLineHeight: string
      controlPaddingInline: string
      controlPaddingBlock: string
      controlGap: string
      controlIconSize: string
      calendarDaySize: string
      calendarNavSize: string
      calendarNavIconSize: string
      calendarFontSize: string
      calendarLineHeight: string
      calendarGridGap: string
      calendarPopoverPadding: string
      calendarHeadingGap: string
      rangeFieldMinWidth: string
      miniCalendarPadding: string
      miniCalendarBodyGap: string
      miniCalendarHeaderGap: string
      miniCalendarTitleFontSize: string
    }>
  >
}

/** @deprecated Use DateComponentTokens. */
export type DateNextComponentTokens = DateComponentTokens

export type AppShellComponentTokens = {
  content?: Partial<{
    paddingInline: string
    paddingBlock: string
    paddingInlineDesktop: string
    paddingBlockDesktop: string
  }>
  layout?: Partial<{
    bodyGridTemplateColumns: string
    bodyWithSecondaryGridTemplateColumns: string
    bodyWithSecondaryRightGridTemplateColumns: string
  }>
}

export type ScrollAreaComponentTokens = {
  size?: Record<
    string,
    Partial<{
      thickness: string
      thumbInset: string
    }>
  >
  shape?: Record<
    string,
    Partial<{
      radius: string
    }>
  >
}

export type TreeViewComponentTokens = {
  size?: Record<
    string,
    Partial<{
      itemPaddingInline: string
      itemPaddingBlock: string
      fontSize: string
      lineHeight: string
      gap: string
      iconSize: string
      itemRadius: string
    }>
  >
}

export type ThemeContract = {
  metadata: {
    schemaVersion: typeof THEME_CONTRACT_SCHEMA_VERSION
    themeId: string
    tenantId?: string
    version: string
    extends?: string | null
    lifecycle: ThemeLifecycle
    fonts?: ThemeFontSourceMap
  }
  global: {
    color: { hue: Record<string, Record<string, string>> }
    size: Record<string, Record<string, string>>
    fontWeight: { light: string; regular: string; medium: string; bold: string }
    borderRadius: { none: string; sm: string; md: string; lg: string; full: string }
    spacing: Record<string, string>
    breakpoint: { xs: string; sm: string; md: string; lg: string; xl: string }
    typography: {
      fontSans: string
      fontSerif: string
      fontMono: string
      responsiveProfile: TypographyResponsiveProfile
    }
  }
  semantic: {
    color: Record<string, Record<string, string>>
  }
  component: {
    button: ButtonComponentTokens
    accordion: AccordionComponentTokens
    fieldGroup: FieldGroupComponentTokens
    pickerPopup: PickerPopupComponentTokens
    fileUpload: FileUploadComponentTokens
    mentionTextarea: MentionTextareaComponentTokens
    date: DateComponentTokens
    textField: TextFieldComponentTokens
    checkbox: CheckboxComponentTokens
    checkboxGroup: CheckboxGroupComponentTokens
    checkboxCards: CheckboxCardsComponentTokens
    radio: RadioComponentTokens
    radioCards: RadioCardsComponentTokens
    switch: SwitchComponentTokens
    iconButton: IconButtonComponentTokens
    toggle: ToggleComponentTokens
    badge: BadgeComponentTokens
    callout: CalloutComponentTokens
    card: CardComponentTokens
    popover: PopoverComponentTokens
    tooltip: TooltipComponentTokens
    progress: ProgressComponentTokens
    dialog: DialogComponentTokens
    slider: SliderComponentTokens
    stepper: StepperComponentTokens
    surface: SurfaceComponentTokens
    timeline: TimelineComponentTokens
    rating: RatingComponentTokens
    appShell: AppShellComponentTokens
    scrollArea: ScrollAreaComponentTokens
    treeView: TreeViewComponentTokens
  }
}

export type ThemeContractValidation = { ok: true; value: ThemeContract } | { ok: false; errors: string[] }

const lifecycleValues: ThemeLifecycle[] = ['draft', 'review', 'published']

function isObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

export function migrateThemeContract(input: unknown): unknown {
  if (!isObject(input)) return input

  const component = input.component
  if (!isObject(component)) return input
  if (component.date !== undefined || component.dateNext === undefined) return input

  const { dateNext, ...nextComponent } = component

  return {
    ...input,
    component: {
      ...nextComponent,
      date: dateNext,
    },
  }
}

function hasString(obj: Record<string, unknown>, key: string): boolean {
  return typeof obj[key] === 'string' && (obj[key] as string).trim().length > 0
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (!isObject(value)) return false
  // Intentionally allow empty objects; schema permits draft token maps with zero entries.
  return Object.values(value).every(isNonEmptyString)
}

function isNestedStringRecord(value: unknown): value is Record<string, Record<string, string>> {
  if (!isObject(value)) return false
  // Intentionally allow empty objects; schema permits draft token maps with zero entries.
  return Object.values(value).every(entry => isStringRecord(entry))
}

function validateComponentTokenBranch(value: unknown, path: string, errors: string[], allowEmptyObject = true): void {
  if (isNonEmptyString(value)) return

  if (!isObject(value)) {
    errors.push(`${path} must be a non-empty string token value or an object containing token values`)
    return
  }

  const entries = Object.entries(value)
  if (!allowEmptyObject && entries.length === 0) {
    errors.push(`${path} must contain at least one non-empty string token value`)
    return
  }

  for (const [key, entry] of entries) {
    validateComponentTokenBranch(entry, `${path}.${key}`, errors, false)
  }
}

function isFontSource(value: unknown): value is ThemeFontSource {
  if (!isObject(value)) return false
  if (!isNonEmptyString(value.kind) || !isNonEmptyString(value.url)) return false
  const keys = Object.keys(value)

  if (value.kind === 'css-url') {
    return keys.every(key => key === 'kind' || key === 'url')
  }

  if (value.kind !== 'file-url') {
    return false
  }

  if (
    hasOwnProp(value, 'format') &&
    value.format !== 'woff2' &&
    value.format !== 'woff' &&
    value.format !== 'truetype' &&
    value.format !== 'opentype'
  ) {
    return false
  }
  if (hasOwnProp(value, 'weight') && (!isNonEmptyString(value.weight) || !isValidFontWeightDescriptor(value.weight))) {
    return false
  }
  if (hasOwnProp(value, 'style') && value.style !== 'normal' && value.style !== 'italic') return false
  if (
    hasOwnProp(value, 'display') &&
    value.display !== 'auto' &&
    value.display !== 'block' &&
    value.display !== 'swap' &&
    value.display !== 'fallback' &&
    value.display !== 'optional'
  ) {
    return false
  }

  return keys.every(
    key =>
      key === 'kind' || key === 'url' || key === 'format' || key === 'weight' || key === 'style' || key === 'display',
  )
}

function isFontSourceMap(value: unknown): value is ThemeFontSourceMap {
  if (!isObject(value)) return false
  return Object.entries(value).every(([key, entry]) => {
    if (!['sans', 'serif', 'mono'].includes(key)) return false
    return entry === undefined || isFontSource(entry)
  })
}

export function validateThemeContract(input: unknown): ThemeContractValidation {
  const errors: string[] = []
  const inputComponent = isObject(input) ? input.component : undefined
  if (isObject(inputComponent) && inputComponent.date !== undefined && inputComponent.dateNext !== undefined) {
    errors.push('Provide only one of component.date or component.dateNext (component.dateNext is deprecated)')
  }
  const migratedInput = migrateThemeContract(input)

  if (!isObject(migratedInput)) {
    return { ok: false, errors: ['Theme contract must be an object'] }
  }

  const root = migratedInput as Record<string, unknown>
  const metadataRaw = root.metadata
  const globalRaw = root.global
  const semanticRaw = root.semantic
  const componentRaw = root.component

  if (!isObject(metadataRaw)) errors.push('metadata must be an object')
  if (!isObject(globalRaw)) errors.push('global must be an object')
  if (!isObject(semanticRaw)) errors.push('semantic must be an object')
  if (!isObject(componentRaw)) errors.push('component must be an object')

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  const metadata = metadataRaw as Record<string, unknown>
  const global = globalRaw as Record<string, unknown>
  const semantic = semanticRaw as Record<string, unknown>
  const component = componentRaw as Record<string, unknown>

  if (metadata.schemaVersion !== THEME_CONTRACT_SCHEMA_VERSION) {
    errors.push(`metadata.schemaVersion must equal ${THEME_CONTRACT_SCHEMA_VERSION}`)
  }

  if (!hasString(metadata, 'themeId')) errors.push('metadata.themeId must be a non-empty string')
  if (!hasString(metadata, 'version')) errors.push('metadata.version must be a non-empty string')

  const lifecycle = metadata.lifecycle
  if (typeof lifecycle !== 'string' || !lifecycleValues.includes(lifecycle as ThemeLifecycle)) {
    errors.push('metadata.lifecycle must be one of draft|review|published')
  }
  if (hasOwnProp(metadata, 'tenantId') && !isNonEmptyString(metadata.tenantId)) {
    errors.push('metadata.tenantId must be a non-empty string when provided')
  }
  if (hasOwnProp(metadata, 'extends') && metadata.extends !== null && !isNonEmptyString(metadata.extends)) {
    errors.push('metadata.extends must be a non-empty string or null when provided')
  }
  if (hasOwnProp(metadata, 'fonts') && !isFontSourceMap(metadata.fonts)) {
    errors.push('metadata.fonts must be an object keyed by sans|serif|mono with valid font source objects')
  }

  const requiredGlobal = ['color', 'size', 'fontWeight', 'borderRadius', 'spacing', 'breakpoint', 'typography']
  for (const key of requiredGlobal) {
    if (!isObject(global[key])) errors.push(`global.${key} must be an object`)
  }

  if (!isObject(semantic.color)) errors.push('semantic.color must be an object')

  const requiredComponent = [
    'button',
    'accordion',
    'fieldGroup',
    'pickerPopup',
    'fileUpload',
    'mentionTextarea',
    'date',
    'textField',
    'checkbox',
    'checkboxGroup',
    'checkboxCards',
    'radio',
    'radioCards',
    'switch',
    'iconButton',
    'toggle',
    'badge',
    'callout',
    'card',
    'popover',
    'tooltip',
    'progress',
    'dialog',
    'slider',
    'stepper',
    'surface',
    'timeline',
    'rating',
    'appShell',
    'scrollArea',
    'treeView',
  ]
  for (const key of requiredComponent) {
    const value = component[key]
    if (value === undefined) {
      component[key] = {}
      continue
    }
    if (!isObject(value)) errors.push(`component.${key} must be an object`)
    else validateComponentTokenBranch(value, `component.${key}`, errors)
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  const globalColor = global.color as Record<string, unknown>
  if (!isNestedStringRecord(globalColor.hue)) {
    errors.push('global.color.hue must be an object of objects with non-empty string values')
  }

  if (!isNestedStringRecord(global.size)) {
    errors.push('global.size must be an object of objects with non-empty string values')
  }

  const fontWeight = global.fontWeight as Record<string, unknown>
  const requiredFontWeights = ['light', 'regular', 'medium', 'bold']
  for (const key of requiredFontWeights) {
    if (!isNonEmptyString(fontWeight[key])) errors.push(`global.fontWeight.${key} must be a non-empty string`)
  }

  const borderRadius = global.borderRadius as Record<string, unknown>
  const requiredBorderRadius = ['none', 'sm', 'md', 'lg', 'full']
  for (const key of requiredBorderRadius) {
    if (!isNonEmptyString(borderRadius[key])) errors.push(`global.borderRadius.${key} must be a non-empty string`)
  }

  if (!isStringRecord(global.spacing)) {
    errors.push('global.spacing must be an object with non-empty string values')
  }

  const breakpoint = global.breakpoint as Record<string, unknown>
  const requiredBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl']
  for (const key of requiredBreakpoints) {
    if (!isNonEmptyString(breakpoint[key])) errors.push(`global.breakpoint.${key} must be a non-empty string`)
  }

  const typography = global.typography as Record<string, unknown>
  const requiredTypography = ['fontSans', 'fontSerif', 'fontMono', 'responsiveProfile'] as const
  const allowedResponsiveProfiles: TypographyResponsiveProfile[] = ['compact', 'balanced', 'expressive']
  for (const key of requiredTypography) {
    if (!isNonEmptyString(typography[key])) errors.push(`global.typography.${key} must be a non-empty string`)
  }
  if (
    isNonEmptyString(typography.responsiveProfile) &&
    !allowedResponsiveProfiles.includes(typography.responsiveProfile as TypographyResponsiveProfile)
  ) {
    errors.push('global.typography.responsiveProfile must be one of compact|balanced|expressive')
  }

  if (!isNestedStringRecord(semantic.color)) {
    errors.push('semantic.color must be an object of objects with non-empty string values')
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    value: {
      ...root,
      metadata,
      global,
      semantic,
      component,
    } as ThemeContract,
  }
}

export function parseThemeContract(input: unknown): ThemeContract {
  const result = validateThemeContract(input)
  if (result.ok) return result.value
  throw new Error(`Invalid theme contract: ${result.errors.join('; ')}`)
}
