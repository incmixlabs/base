export const autoFormFileUploadWidgetVariants = ['default', 'minimal', 'card'] as const
export const autoFormFileUploadWidgetSizes = ['xs', 'sm', 'md', 'lg'] as const
export const autoFormFileUploadWidgetRadii = ['none', 'sm', 'md', 'lg', 'full'] as const
export const autoFormMentionTriggerPickers = ['default', 'avatar', 'multi-select'] as const

export type AutoFormFileUploadWidgetVariant = (typeof autoFormFileUploadWidgetVariants)[number]
export type AutoFormFileUploadWidgetSize = (typeof autoFormFileUploadWidgetSizes)[number]
export type AutoFormFileUploadWidgetRadius = (typeof autoFormFileUploadWidgetRadii)[number]
export type AutoFormMentionTriggerPicker = (typeof autoFormMentionTriggerPickers)[number]

export interface AutoFormHoverCardProps {
  title?: string
  email?: string
  presence?: string
  managerId?: string
  color?: string
  variant?: string
  highContrast?: boolean
  radius?: string
}

export interface AutoFormAvatarItemProps {
  id: string
  name: string
  description?: string
  avatar?: string
  hoverCard?: boolean | AutoFormHoverCardProps
  disabled?: boolean
}

export interface AutoFormMultiSelectOptionProps {
  value: string
  label: string
  disabled?: boolean
}

export interface AutoFormTreeLeafSelectOptionProps {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface AutoFormMentionItemProps {
  id: string
  label: string
  value?: string
  description?: string
  avatar?: string
  hoverCard?: boolean | AutoFormHoverCardProps
  disabled?: boolean
}

export interface AutoFormMentionTriggerProps {
  trigger: string
  items?: AutoFormMentionItemProps[]
  picker?: AutoFormMentionTriggerPicker
  avatarItems?: AutoFormAvatarItemProps[]
  options?: AutoFormMultiSelectOptionProps[]
  searchable?: boolean
  searchPlaceholder?: string
  placeholder?: string
  noResultsText?: string
  maxSelected?: number
  maxSelectedText?: string
  showBadges?: boolean
  maxVisibleBadges?: number
  creatable?: boolean
}

export interface AutoFormMentionTextareaWidgetProps {
  mentions?: AutoFormMentionItemProps[]
  trigger?: string
  triggers?: AutoFormMentionTriggerProps[]
  maxItems?: number
  noMatchesText?: string
  toolbar?: boolean
  autoSize?: boolean
  rows?: number
  minRows?: number
  maxRows?: number
}

export interface AutoFormAvatarPickerWidgetProps {
  items?: AutoFormAvatarItemProps[]
  placeholder?: string
  searchPlaceholder?: string
  searchable?: boolean
  noResultsText?: string
  maxHeight?: number
}

export interface AutoFormMultiSelectWidgetProps {
  options?: AutoFormMultiSelectOptionProps[]
  placeholder?: string
  searchable?: boolean
  searchPlaceholder?: string
  maxSelected?: number
  maxSelectedText?: string
  showBadges?: boolean
  maxVisibleBadges?: number
  creatable?: boolean
}

export interface AutoFormTreeLeafSelectWidgetProps {
  options?: AutoFormTreeLeafSelectOptionProps[]
  pathSeparator?: string
  expandAll?: boolean
  showSelectedPath?: boolean
  showDescription?: boolean
}

export interface AutoFormCountryPickerWidgetProps {
  label?: string
  size?: string
  variant?: string
  color?: string
  radius?: string
  defaultCountry?: string
  countryPlaceholder?: string
  statePlaceholder?: string
  showStateSelector?: boolean
}

export interface AutoFormDatePickerWidgetProps {
  placeholder?: string
  enableNaturalLanguage?: boolean
  dateFormat?: string
  size?: string
  variant?: string
  color?: string
  radius?: string
}

export interface AutoFormDateTimePickerWidgetProps {
  size?: string
  variant?: string
  color?: string
  radius?: string
  showSeconds?: boolean
  minuteStep?: number
}

export interface AutoFormTimePickerWidgetProps {
  placeholder?: string
  size?: string
  color?: string
  radius?: string
  showSeconds?: boolean
  use12HourFormat?: boolean
  minuteStep?: number
}

export interface AutoFormComboboxWidgetProps {
  options?: AutoFormMultiSelectOptionProps[]
  placeholder?: string
  searchPlaceholder?: string
  noResultsText?: string
  creatable?: boolean
  size?: string
  variant?: string
  color?: string
  radius?: string
}

export interface AutoFormFileUploadWidgetProps {
  accept?: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
  placeholder?: string
  description?: string
  showFileList?: boolean
  showStatusSections?: boolean
  variant?: AutoFormFileUploadWidgetVariant
  size?: AutoFormFileUploadWidgetSize
  radius?: AutoFormFileUploadWidgetRadius
}

export function getAutoFormFileUploadWidgetProps(value: unknown): AutoFormFileUploadWidgetProps {
  if (!isRecord(value)) return {}

  return {
    accept: getAcceptProp(value.accept),
    maxSize: getNumberProp(value.maxSize),
    maxFiles: getNumberProp(value.maxFiles),
    multiple: getBooleanProp(value.multiple),
    placeholder: getStringProp(value.placeholder),
    description: getStringProp(value.description),
    showFileList: getBooleanProp(value.showFileList),
    showStatusSections: getBooleanProp(value.showStatusSections),
    variant: getFileUploadVariantProp(value.variant),
    size: getFileUploadSizeProp(value.size),
    radius: getFileUploadRadiusProp(value.radius),
  }
}

export function getAutoFormMentionTextareaWidgetProps(value: unknown): AutoFormMentionTextareaWidgetProps {
  if (!isRecord(value)) return {}

  return {
    mentions: getMentionItemsProp(value.mentions),
    trigger: getStringProp(value.trigger),
    triggers: getMentionTriggersProp(value.triggers),
    maxItems: getNumberProp(value.maxItems),
    noMatchesText: getStringProp(value.noMatchesText),
    toolbar: getBooleanProp(value.toolbar),
    autoSize: getBooleanProp(value.autoSize),
    rows: getNumberProp(value.rows),
    minRows: getNumberProp(value.minRows),
    maxRows: getNumberProp(value.maxRows),
  }
}

export function getAutoFormAvatarPickerWidgetProps(value: unknown): AutoFormAvatarPickerWidgetProps {
  if (!isRecord(value)) return {}

  return {
    items: getAvatarItemsProp(value.items),
    placeholder: getStringProp(value.placeholder),
    searchPlaceholder: getStringProp(value.searchPlaceholder),
    searchable: getBooleanProp(value.searchable) ?? true,
    noResultsText: getStringProp(value.noResultsText),
    maxHeight: getNumberProp(value.maxHeight),
  }
}

export function getAutoFormMultiSelectWidgetProps(value: unknown): AutoFormMultiSelectWidgetProps {
  if (!isRecord(value)) return {}

  return {
    options: getMultiSelectOptionsProp(value.options),
    placeholder: getStringProp(value.placeholder),
    searchable: getBooleanProp(value.searchable) ?? true,
    searchPlaceholder: getStringProp(value.searchPlaceholder),
    maxSelected: getNumberProp(value.maxSelected),
    maxSelectedText: getStringProp(value.maxSelectedText),
    showBadges: getBooleanProp(value.showBadges),
    maxVisibleBadges: getNumberProp(value.maxVisibleBadges),
    creatable: getBooleanProp(value.creatable),
  }
}

export function getAutoFormTreeLeafSelectWidgetProps(value: unknown): AutoFormTreeLeafSelectWidgetProps {
  if (!isRecord(value)) return {}

  return {
    options: getTreeLeafSelectOptionsProp(value.options),
    pathSeparator: getStringProp(value.pathSeparator),
    expandAll: getBooleanProp(value.expandAll),
    showSelectedPath: getBooleanProp(value.showSelectedPath),
    showDescription: getBooleanProp(value.showDescription),
  }
}

export function getAutoFormCountryPickerWidgetProps(value: unknown): AutoFormCountryPickerWidgetProps {
  if (!isRecord(value)) return {}

  return {
    label: getStringProp(value.label),
    size: getStringProp(value.size),
    variant: getStringProp(value.variant),
    color: getStringProp(value.color),
    radius: getStringProp(value.radius),
    defaultCountry: getStringProp(value.defaultCountry),
    countryPlaceholder: getStringProp(value.countryPlaceholder),
    statePlaceholder: getStringProp(value.statePlaceholder),
    showStateSelector: getBooleanProp(value.showStateSelector),
  }
}

export function getAutoFormDatePickerWidgetProps(value: unknown): AutoFormDatePickerWidgetProps {
  if (!isRecord(value)) return {}

  return {
    placeholder: getStringProp(value.placeholder),
    enableNaturalLanguage: getBooleanProp(value.enableNaturalLanguage),
    dateFormat: getStringProp(value.dateFormat),
    size: getStringProp(value.size),
    variant: getStringProp(value.variant),
    color: getStringProp(value.color),
    radius: getStringProp(value.radius),
  }
}

export function getAutoFormDateTimePickerWidgetProps(value: unknown): AutoFormDateTimePickerWidgetProps {
  if (!isRecord(value)) return {}

  return {
    size: getStringProp(value.size),
    variant: getStringProp(value.variant),
    color: getStringProp(value.color),
    radius: getStringProp(value.radius),
    showSeconds: getBooleanProp(value.showSeconds),
    minuteStep: getNumberProp(value.minuteStep),
  }
}

export function getAutoFormTimePickerWidgetProps(value: unknown): AutoFormTimePickerWidgetProps {
  if (!isRecord(value)) return {}

  return {
    placeholder: getStringProp(value.placeholder),
    size: getStringProp(value.size),
    color: getStringProp(value.color),
    radius: getStringProp(value.radius),
    showSeconds: getBooleanProp(value.showSeconds),
    use12HourFormat: getBooleanProp(value.use12HourFormat),
    minuteStep: getNumberProp(value.minuteStep),
  }
}

export function getAutoFormComboboxWidgetProps(value: unknown): AutoFormComboboxWidgetProps {
  if (!isRecord(value)) return {}

  return {
    options: getMultiSelectOptionsProp(value.options),
    placeholder: getStringProp(value.placeholder),
    searchPlaceholder: getStringProp(value.searchPlaceholder),
    noResultsText: getStringProp(value.noResultsText),
    creatable: getBooleanProp(value.creatable),
    size: getStringProp(value.size),
    variant: getStringProp(value.variant),
    color: getStringProp(value.color),
    radius: getStringProp(value.radius),
  }
}

function getAcceptProp(value: unknown) {
  if (!isRecord(value)) return undefined

  const accept = Object.entries(value).reduce<Record<string, string[]>>((result, [mimeType, extensions]) => {
    if (typeof mimeType !== 'string' || !Array.isArray(extensions)) return result
    const validExtensions = extensions.filter((entry): entry is string => typeof entry === 'string')
    if (validExtensions.length > 0) {
      result[mimeType] = validExtensions
    }
    return result
  }, {})

  return Object.keys(accept).length > 0 ? accept : undefined
}

function getStringProp(value: unknown) {
  return typeof value === 'string' ? value : undefined
}

function getNumberProp(value: unknown) {
  return typeof value === 'number' ? value : undefined
}

function getBooleanProp(value: unknown) {
  return typeof value === 'boolean' ? value : undefined
}

function getHoverCardProp(value: unknown): boolean | AutoFormHoverCardProps | undefined {
  if (typeof value === 'boolean') return value
  if (!isRecord(value)) return undefined

  const hoverCard: AutoFormHoverCardProps = {
    title: getStringProp(value.title),
    email: getStringProp(value.email),
    presence: getStringProp(value.presence),
    managerId: getStringProp(value.managerId),
    color: getStringProp(value.color),
    variant: getStringProp(value.variant),
    highContrast: getBooleanProp(value.highContrast),
    radius: getStringProp(value.radius),
  }

  return Object.values(hoverCard).some(entry => entry !== undefined) ? hoverCard : undefined
}

function getAvatarItemsProp(value: unknown): AutoFormAvatarItemProps[] | undefined {
  if (!Array.isArray(value)) return undefined

  const items = value.flatMap(item => {
    if (!isRecord(item)) return []

    const id = getStringProp(item.id)
    const name = getStringProp(item.name)
    if (!id || !name) return []

    return [
      {
        id,
        name,
        description: getStringProp(item.description),
        avatar: getStringProp(item.avatar),
        hoverCard: getHoverCardProp(item.hoverCard),
        disabled: getBooleanProp(item.disabled),
      } satisfies AutoFormAvatarItemProps,
    ]
  })

  return items.length > 0 ? items : undefined
}

function getMultiSelectOptionsProp(value: unknown): AutoFormMultiSelectOptionProps[] | undefined {
  if (!Array.isArray(value)) return undefined

  const items = value.flatMap(item => {
    if (!isRecord(item)) return []

    const optionValue = getStringProp(item.value)
    const label = getStringProp(item.label)
    if (!optionValue || !label) return []

    return [
      {
        value: optionValue,
        label,
        disabled: getBooleanProp(item.disabled),
      } satisfies AutoFormMultiSelectOptionProps,
    ]
  })

  return items.length > 0 ? items : undefined
}

function getTreeLeafSelectOptionsProp(value: unknown): AutoFormTreeLeafSelectOptionProps[] | undefined {
  if (!Array.isArray(value)) return undefined

  const items = value.flatMap(item => {
    if (!isRecord(item)) return []

    const optionValue = getStringProp(item.value)
    const label = getStringProp(item.label)
    if (!optionValue || !label) return []

    return [
      {
        value: optionValue,
        label,
        description: getStringProp(item.description),
        disabled: getBooleanProp(item.disabled),
      } satisfies AutoFormTreeLeafSelectOptionProps,
    ]
  })

  return items.length > 0 ? items : undefined
}

function getMentionItemsProp(value: unknown): AutoFormMentionItemProps[] | undefined {
  if (!Array.isArray(value)) return undefined

  const items = value.flatMap(item => {
    if (!isRecord(item)) return []

    const id = getStringProp(item.id)
    const label = getStringProp(item.label)
    if (!id || !label) return []

    return [
      {
        id,
        label,
        value: getStringProp(item.value),
        description: getStringProp(item.description),
        avatar: getStringProp(item.avatar),
        hoverCard: getHoverCardProp(item.hoverCard),
        disabled: getBooleanProp(item.disabled),
      } satisfies AutoFormMentionItemProps,
    ]
  })

  return items.length > 0 ? items : undefined
}

function getMentionTriggersProp(value: unknown): AutoFormMentionTriggerProps[] | undefined {
  if (!Array.isArray(value)) return undefined

  const triggers = value.flatMap(item => {
    if (!isRecord(item)) return []

    const trigger = getStringProp(item.trigger)
    if (!trigger) return []

    const picker = getMentionTriggerPickerProp(item.picker)
    const next: AutoFormMentionTriggerProps = {
      trigger,
      picker,
      items: getMentionItemsProp(item.items),
      avatarItems: getAvatarItemsProp(item.avatarItems),
      options: getMultiSelectOptionsProp(item.options),
      searchable: getBooleanProp(item.searchable),
      searchPlaceholder: getStringProp(item.searchPlaceholder),
      placeholder: getStringProp(item.placeholder),
      noResultsText: getStringProp(item.noResultsText),
      maxSelected: getNumberProp(item.maxSelected),
      maxSelectedText: getStringProp(item.maxSelectedText),
      showBadges: getBooleanProp(item.showBadges),
      maxVisibleBadges: getNumberProp(item.maxVisibleBadges),
    }

    if (next.picker === 'avatar' && !next.avatarItems?.length) return []
    if (next.picker === 'multi-select' && !next.options?.length) return []
    if ((!next.picker || next.picker === 'default') && !next.items?.length) return []

    return [next]
  })

  return triggers.length > 0 ? triggers : undefined
}

function getFileUploadVariantProp(value: unknown): AutoFormFileUploadWidgetVariant | undefined {
  return autoFormFileUploadWidgetVariants.some(variant => variant === value)
    ? (value as AutoFormFileUploadWidgetVariant)
    : undefined
}

function getFileUploadSizeProp(value: unknown): AutoFormFileUploadWidgetSize | undefined {
  return autoFormFileUploadWidgetSizes.some(size => size === value)
    ? (value as AutoFormFileUploadWidgetSize)
    : undefined
}

function getFileUploadRadiusProp(value: unknown): AutoFormFileUploadWidgetRadius | undefined {
  return autoFormFileUploadWidgetRadii.some(radius => radius === value)
    ? (value as AutoFormFileUploadWidgetRadius)
    : undefined
}

function getMentionTriggerPickerProp(value: unknown): AutoFormMentionTriggerPicker | undefined {
  return autoFormMentionTriggerPickers.some(picker => picker === value)
    ? (value as AutoFormMentionTriggerPicker)
    : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
