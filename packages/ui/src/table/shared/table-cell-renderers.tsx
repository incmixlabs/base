'use client'

import * as React from 'react'
import { Sparkline } from '@/charts/sparklines'
import type { AvatarSize } from '@/elements/avatar/Avatar'
import { Avatar } from '@/elements/avatar/Avatar'
import { AvatarGroup } from '@/elements/avatar/AvatarGroup'
import { Icon } from '@/elements/button/Icon'
import {
  getDefaultPriorityIcon,
  getDefaultPriorityIconColor,
  isKnownPriorityValue,
  normalizePriorityValue,
  type PriorityIconPriority,
  priorityLabelByValue,
  prioritySemanticColorByValue,
  priorityToneByValue,
} from '@/elements/priority-icon/priority-icon.shared'
import {
  isKnownStatusValue,
  lucideStatusIcons,
  type StatusIconStatus,
  statusIconColorTokenByValue,
  statusLabelByValue,
  statusSemanticColorByValue,
  statusToneByValue,
} from '@/elements/status-icon/status-icon.shared'
import { SimpleTooltip } from '@/elements/tooltip/Tooltip'
import type { CheckboxSize } from '@/form/Checkbox'
import { Checkbox } from '@/form/Checkbox'
import { Flex } from '@/layouts/flex/Flex'
import type { TableSize } from '@/table/basic/Table'
import { TableLabel } from '@/table/shared/TableLabel'
import { SemanticColor, semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import type {
  TableAvatarCellValue,
  TableAvatarGroupCellValue,
  TableCellRenderer,
  TableCellValue,
  TableCheckboxCellValue,
  TableClassificationCellValue,
  TableClassificationValue,
  TableLabelCellValue,
  TablePriorityCellValue,
  TableSparklineCellValue,
  TableStatusCellValue,
  TableTimelineCellValue,
} from './table-cell.props'

const avatarSizeByTableSize: Record<TableSize, AvatarSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
}

const checkboxSizeByTableSize: Record<TableSize, CheckboxSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
}

const iconSizeByTableSize: Record<TableSize, 'xs' | 'sm' | 'md' | 'lg'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !React.isValidElement(value)
}

function resolveRenderer(renderer: TableCellRenderer | undefined): TableCellRenderer {
  return renderer ?? { type: 'string' }
}

const classificationLabelByValue: Record<TableClassificationValue, React.ReactNode> = {
  bug: 'Bug',
  release: 'Release',
  feature: 'Feature',
  checklist: 'Checklist',
  milestone: 'Milestone',
}

const classificationToneByValue: Record<
  TableClassificationValue,
  { iconColor: Color; background: string; border: string; text: string }
> = {
  bug: {
    iconColor: 'error',
    background: semanticColorVar('error', 'soft'),
    border: semanticColorVar('error', 'border'),
    text: semanticColorVar('error', 'text'),
  },
  release: {
    iconColor: 'success',
    background: semanticColorVar('success', 'soft'),
    border: semanticColorVar('success', 'border'),
    text: semanticColorVar('success', 'text'),
  },
  feature: {
    iconColor: 'info',
    background: semanticColorVar('info', 'soft'),
    border: semanticColorVar('info', 'border'),
    text: semanticColorVar('info', 'text'),
  },
  checklist: {
    iconColor: 'neutral',
    background: semanticColorVar('neutral', 'soft'),
    border: semanticColorVar('neutral', 'border'),
    text: semanticColorVar('neutral', 'text'),
  },
  milestone: {
    iconColor: 'success',
    background: semanticColorVar('success', 'soft'),
    border: semanticColorVar('success', 'border'),
    text: semanticColorVar('success', 'text'),
  },
}

const classificationSemanticColorByValue: Record<TableClassificationValue, Color> = {
  bug: 'error',
  release: 'success',
  feature: 'info',
  checklist: 'neutral',
  milestone: 'success',
}

function hasOwnRecordKey<T extends object>(record: T, key: string): key is Extract<keyof T, string> {
  return Object.hasOwn(record, key)
}

function isKnownClassificationValue(value: string): value is TableClassificationValue {
  return hasOwnRecordKey(classificationToneByValue, value)
}

function getAvatarSize(tableSize: TableSize): AvatarSize {
  return avatarSizeByTableSize[tableSize]
}

function getCheckboxSize(tableSize: TableSize): CheckboxSize {
  return checkboxSizeByTableSize[tableSize]
}

function getIconSize(tableSize: TableSize): 'xs' | 'sm' | 'md' | 'lg' {
  return iconSizeByTableSize[tableSize]
}

function getTimelineClasses(tableSize: TableSize) {
  return {
    xs: { root: 'gap-1 text-[10px]', dot: 'h-1 w-1', secondary: 'text-[9px]' },
    sm: { root: 'gap-1 text-[11px]', dot: 'h-1.5 w-1.5', secondary: 'text-[10px]' },
    md: { root: 'gap-1.5 text-xs', dot: 'h-1.5 w-1.5', secondary: 'text-[11px]' },
    lg: { root: 'gap-1.5 text-xs', dot: 'h-2 w-2', secondary: 'text-[11px]' },
  }[tableSize]
}

function getSparklineDimensions(tableSize: TableSize) {
  return {
    xs: { width: 56, height: 16, strokeWidth: 1.5 },
    sm: { width: 72, height: 20, strokeWidth: 1.75 },
    md: { width: 88, height: 24, strokeWidth: 2 },
    lg: { width: 104, height: 28, strokeWidth: 2 },
  }[tableSize]
}

function wrapIconOnlyTooltip(content: React.ReactElement, tooltipContent: React.ReactNode) {
  if (tooltipContent === null || tooltipContent === undefined || tooltipContent === '') return content

  return (
    <SimpleTooltip content={tooltipContent} size="xs" showArrow={false} variant="surface" color="slate">
      <Flex as="div" display="inline-flex">
        {content}
      </Flex>
    </SimpleTooltip>
  )
}

function getIconOnlyTooltipContent(icon: React.ReactNode, label: React.ReactNode, iconColor?: string) {
  return (
    <span className="inline-flex items-center gap-1 text-xs leading-none">
      <span className="inline-flex shrink-0" style={iconColor ? { color: iconColor } : undefined}>
        {icon}
      </span>
      <span className="text-foreground">{label}</span>
    </span>
  )
}

function getPriorityIconProps(priority: PriorityIconPriority) {
  if (priority === 'blocker') {
    return {
      fill: 'currentColor',
      strokeWidth: 0,
    } as const
  }

  return undefined
}

function renderPriorityResolvedIcon(
  priority: PriorityIconPriority,
  icon?: string,
  colorOverride?: Color,
  size: 'xs' | 'sm' | 'md' | 'lg' = 'sm',
) {
  const color = colorOverride ?? getDefaultPriorityIconColor(priority)
  if (icon) return <Icon icon={icon} size={size} color={color} />
  return (
    <Icon
      icon={getDefaultPriorityIcon(priority)}
      size={size}
      color={color}
      iconProps={getPriorityIconProps(priority)}
    />
  )
}

function renderStatusResolvedIcon(status: StatusIconStatus, icon?: string, size: 'xs' | 'sm' | 'md' | 'lg' = 'sm') {
  const color = statusIconColorTokenByValue[status]
  if (icon) return <Icon icon={icon} size={size} color={color} />
  return <Icon icon={lucideStatusIcons[status]} size={size} color={color} />
}

function getDefaultClassificationIcon(value: TableClassificationValue) {
  switch (value) {
    case 'bug':
      return 'bug'
    case 'release':
      return 'rocket'
    case 'feature':
      return 'feather'
    case 'checklist':
      return 'checklist'
    case 'milestone':
      return 'flag'
  }
}

function getClassificationIconProps(value: TableClassificationValue) {
  if (value === 'milestone') {
    return {
      fill: 'currentColor',
      stroke: 'currentColor',
      strokeWidth: 1.5,
    } as const
  }

  return undefined
}

export function resolveTableCellJustify({
  justify,
  rowHeader,
  renderer,
}: {
  justify?: 'start' | 'center' | 'end'
  rowHeader?: boolean
  renderer?: TableCellRenderer
}) {
  if (justify) return justify
  if (rowHeader) return 'start'

  const safeRenderer = resolveRenderer(renderer)
  if (safeRenderer.type === 'avatar') {
    return safeRenderer.display === 'icon-only' ? 'center' : 'start'
  }

  if (
    safeRenderer.type === 'avatar-group' ||
    safeRenderer.type === 'checkbox' ||
    safeRenderer.type === 'timeline' ||
    safeRenderer.type === 'sparkline'
  ) {
    return 'center'
  }

  if (safeRenderer.type === 'priority' && safeRenderer.display === 'icon-only') {
    return 'center'
  }

  if (safeRenderer.type === 'status' && safeRenderer.display === 'icon-only') {
    return 'center'
  }

  if (safeRenderer.type === 'classification' && safeRenderer.display === 'icon-only') {
    return 'center'
  }

  return 'start'
}

export function isFullCellRenderer(renderer?: TableCellRenderer) {
  const safeRenderer = resolveRenderer(renderer)
  return (
    safeRenderer.type === 'label' ||
    (safeRenderer.type === 'priority' && safeRenderer.display === 'label-only') ||
    (safeRenderer.type === 'status' && safeRenderer.display === 'label-only') ||
    (safeRenderer.type === 'classification' && safeRenderer.display === 'label-only')
  )
}

function renderStringValue(value: TableCellValue) {
  if (React.isValidElement(value)) return value
  if (value === null || value === undefined) return null

  if (isPlainObject(value)) {
    const text = 'text' in value ? value.text : undefined
    const secondary = 'secondary' in value ? value.secondary : undefined
    if (typeof text === 'string' || typeof text === 'number') {
      return (
        <div className="flex flex-col gap-0.5">
          <span>{text}</span>
          {typeof secondary === 'string' || typeof secondary === 'number' ? (
            <span className="text-xs text-muted-foreground">{secondary}</span>
          ) : null}
        </div>
      )
    }

    const label = 'label' in value ? value.label : undefined
    if (typeof label === 'string' || typeof label === 'number') {
      return String(label)
    }

    const rawValue = 'value' in value ? value.value : undefined
    if (typeof rawValue === 'string' || typeof rawValue === 'number') {
      return String(rawValue)
    }

    const id = 'id' in value ? value.id : undefined
    if (typeof id === 'string' || typeof id === 'number') {
      return String(id)
    }

    return JSON.stringify(value)
  }

  return value as React.ReactNode
}

function renderLabelValue(
  renderer: Extract<TableCellRenderer, { type: 'label' }>,
  value: TableLabelCellValue,
  tableSize: TableSize,
) {
  if (React.isValidElement(value)) return value

  const normalized =
    isPlainObject(value) && typeof value.value === 'string'
      ? {
          value: value.value,
          label: value.label,
          color: value.color,
          variant: value.variant,
          radius: value.radius,
        }
      : {
          value: String(value ?? ''),
          label: undefined,
          color: undefined,
          variant: undefined,
          radius: undefined,
        }

  const config = renderer.values?.find(item => item.value === normalized.value)
  const color = normalized.color ?? config?.color ?? renderer.monochrome ?? renderer.color ?? 'slate'
  const variant = normalized.variant ?? config?.variant ?? renderer.variant ?? 'solid'
  const label = normalized.label ?? config?.label ?? normalized.value
  return (
    <TableLabel color={color} variant={variant} size={tableSize}>
      {label}
    </TableLabel>
  )
}

function renderAvatarValue(
  renderer: Extract<TableCellRenderer, { type: 'avatar' }>,
  value: TableAvatarCellValue,
  tableSize: TableSize,
) {
  if (React.isValidElement(value)) return value

  const props = typeof value === 'string' ? { name: value } : value
  const label = typeof value === 'string' ? value : props.name
  const display = renderer.display ?? 'icon-and-label'

  if (display === 'icon-only') {
    return wrapIconOnlyTooltip(
      <Avatar {...props} size={renderer.size ?? props.size ?? getAvatarSize(tableSize)} />,
      getIconOnlyTooltipContent(<Avatar {...props} size="xs" />, label),
    )
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Avatar {...props} size={renderer.size ?? props.size ?? getAvatarSize(tableSize)} />
      {label ? <span>{label}</span> : null}
    </div>
  )
}

function renderAvatarGroupValue(
  renderer: Extract<TableCellRenderer, { type: 'avatar-group' }>,
  value: TableAvatarGroupCellValue,
  tableSize: TableSize,
) {
  if (React.isValidElement(value)) return value

  const items = Array.isArray(value) ? value : value.items
  return (
    <AvatarGroup size={renderer.size ?? getAvatarSize(tableSize)} max={renderer.max}>
      {items.map((item, index) => (
        <Avatar key={item.id ?? item.name ?? item.src ?? index} {...item} />
      ))}
    </AvatarGroup>
  )
}

function renderCheckboxValue(
  renderer: Extract<TableCellRenderer, { type: 'checkbox' }>,
  value: TableCheckboxCellValue,
  tableSize: TableSize,
) {
  const checked = typeof value === 'boolean' ? value : value.checked
  const indeterminate = typeof value === 'boolean' ? false : !!value.indeterminate

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        color={renderer.color ?? SemanticColor.slate}
        variant={renderer.variant}
        size={getCheckboxSize(tableSize)}
        disabled
        aria-label={checked ? 'Checked' : 'Unchecked'}
      />
    </div>
  )
}

function toDate(value: string | number | Date) {
  if (typeof value === 'string') {
    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch
      const parsed = new Date(Number(year), Number(month) - 1, Number(day))
      return Number.isNaN(parsed.getTime()) ? null : parsed
    }
  }

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getInclusiveDaySpan(start: Date, end: Date) {
  const safeStart = startOfDay(start)
  const safeEnd = startOfDay(end)
  return Math.max(1, Math.floor((safeEnd.getTime() - safeStart.getTime()) / 86400000) + 1)
}

function formatTimelineRange(start: Date, end: Date) {
  const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()
  const sameYear = start.getFullYear() === end.getFullYear()
  const startDay = start.getDate()
  const endDay = end.getDate()
  const startMonth = start.toLocaleString('en-US', { month: 'short' })
  const endMonth = end.toLocaleString('en-US', { month: 'short' })

  if (sameMonth) return `${startDay} - ${endDay} ${endMonth}`
  if (sameYear) return `${startDay} ${startMonth} - ${endDay} ${endMonth}`
  return `${startDay} ${startMonth} ${start.getFullYear()} - ${endDay} ${endMonth} ${end.getFullYear()}`
}

function renderTimelineValue(
  renderer: Extract<TableCellRenderer, { type: 'timeline' }>,
  value: TableTimelineCellValue,
  tableSize: TableSize,
) {
  if (isPlainObject(value) && 'start' in value && 'end' in value) {
    const start = toDate(value.start as string | number | Date)
    const end = toDate(value.end as string | number | Date)
    const current = toDate((value.current as string | number | Date | undefined) ?? new Date())

    if (start && end && current) {
      const semanticValue = typeof value.value === 'string' ? value.value : undefined
      const color =
        value.color ??
        renderer.values?.find(item => item.value === semanticValue)?.color ??
        renderer.color ??
        SemanticColor.slate
      const totalDays = getInclusiveDaySpan(start, end)
      const safeCurrent = startOfDay(current)
      const safeStart = startOfDay(start)
      const elapsedDays =
        safeCurrent < safeStart ? 0 : Math.min(totalDays, Math.max(0, getInclusiveDaySpan(start, current)))
      const progress = Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100))
      const isWarning = color === SemanticColor.warning
      const textColor = isWarning ? semanticColorVar('neutral', 'text') : '#fff'
      const doneColor = semanticColorVar(color, 'primary')
      const remainingColor = isWarning ? 'var(--gray-8)' : 'var(--gray-11)'
      const label = value.label ?? formatTimelineRange(start, end)

      return (
        <div className="flex items-center justify-center">
          <div className="relative inline-flex h-7 min-w-32 overflow-hidden rounded-full text-xs font-medium">
            <div
              className="absolute inset-y-0 left-0 rounded-l-full"
              style={{ width: `${progress}%`, backgroundColor: doneColor }}
            />
            <div
              className="absolute inset-y-0 right-0 rounded-r-full"
              style={{ width: `${100 - progress}%`, backgroundColor: remainingColor }}
            />
            <Flex
              align="center"
              justify="center"
              className="relative z-10 h-full min-w-32 px-3 text-center"
              style={{ color: textColor }}
            >
              {label}
            </Flex>
          </div>
        </div>
      )
    }
  }

  const normalized = isPlainObject(value) && 'date' in value ? value : { date: value, label: undefined }
  const date = toDate(normalized.date as string | number | Date)

  if (!date) return renderStringValue(value)

  const semanticValue =
    isPlainObject(normalized) && 'value' in normalized && typeof normalized.value === 'string'
      ? normalized.value
      : undefined
  const color =
    (isPlainObject(normalized) && 'color' in normalized && typeof normalized.color === 'string'
      ? normalized.color
      : undefined) ??
    renderer.values?.find(item => item.value === semanticValue)?.color ??
    renderer.color ??
    SemanticColor.slate
  const textColor = semanticColorVar(color, 'text')
  const dotColor = semanticColorVar(color, 'primary')
  const timelineSize = getTimelineClasses(tableSize)

  return (
    <div
      className={`inline-flex items-center justify-center whitespace-nowrap ${timelineSize.root}`}
      style={{ color: textColor }}
    >
      <span className={`${timelineSize.dot} rounded-full`} aria-hidden="true" style={{ backgroundColor: dotColor }} />
      <div className="flex flex-col items-start leading-tight">
        <time dateTime={date.toISOString()}>
          {new Intl.DateTimeFormat('en-US', { dateStyle: renderer.dateStyle ?? 'medium' }).format(date)}
        </time>
        {normalized.label ? <span className={timelineSize.secondary}>{normalized.label}</span> : null}
      </div>
    </div>
  )
}

function renderSparklineValue(
  renderer: Extract<TableCellRenderer, { type: 'sparkline' }>,
  value: TableSparklineCellValue,
  tableSize: TableSize,
) {
  const normalized = Array.isArray(value) ? { data: value, color: renderer.color } : value
  const dimensions = getSparklineDimensions(tableSize)
  return (
    <div className="flex items-center justify-center text-muted-foreground">
      <Sparkline
        data={normalized.data}
        color={normalized.color ?? renderer.color}
        strokeWidth={renderer.strokeWidth ?? dimensions.strokeWidth}
        width={renderer.width ?? dimensions.width}
        height={renderer.height ?? dimensions.height}
      />
    </div>
  )
}

function renderIconLabelDisplay({
  label,
  renderIcon,
  display,
  variant,
  semanticColor,
  toneText,
  toneColor,
  tableSize,
}: {
  label: React.ReactNode
  renderIcon: (size: 'xs' | 'sm' | 'md' | 'lg') => React.ReactNode
  display: 'icon-and-label' | 'icon-only' | 'label-only'
  variant?: 'solid' | 'soft' | 'surface' | 'outline'
  semanticColor: Color
  toneText: string
  toneColor?: string
  tableSize: TableSize
}) {
  if (display === 'label-only') {
    return (
      <TableLabel color={semanticColor} variant={variant ?? 'solid'} size={tableSize}>
        {label}
      </TableLabel>
    )
  }

  if (display === 'icon-only') {
    const iconNode = renderIcon(getIconSize(tableSize))
    const tooltipIcon = renderIcon('xs')
    return wrapIconOnlyTooltip(
      <div className="flex items-center justify-center">{iconNode}</div>,
      getIconOnlyTooltipContent(tooltipIcon, label, toneColor),
    )
  }

  return (
    <div className="inline-flex items-center gap-2" style={{ color: toneText }}>
      {renderIcon(getIconSize(tableSize))}
      <span>{label}</span>
    </div>
  )
}

function renderPriorityValue(
  renderer: Extract<TableCellRenderer, { type: 'priority' }>,
  value: TablePriorityCellValue,
  tableSize: TableSize,
) {
  if (React.isValidElement(value)) return value

  const normalized =
    isPlainObject(value) && typeof value.value === 'string'
      ? {
          value: value.value as PriorityIconPriority,
          label: value.label,
          color: value.color,
          icon: typeof value.icon === 'string' ? value.icon : undefined,
        }
      : {
          value: (value ?? 'none') as PriorityIconPriority,
          label: undefined,
          color: undefined,
          icon: undefined,
        }

  if (!isKnownPriorityValue(normalized.value)) return renderStringValue(value)

  const priority = normalizePriorityValue(normalized.value)
  const config = renderer.values?.find(item => (item.value === 'medium' ? 'med' : item.value) === priority)
  const label = normalized.label ?? config?.label ?? priorityLabelByValue[normalized.value]
  const icon = normalized.icon ?? config?.icon
  const iconColor = normalized.color ?? config?.color
  const tone = priorityToneByValue[priority]

  return renderIconLabelDisplay({
    label,
    renderIcon: size => renderPriorityResolvedIcon(priority, icon, iconColor, size),
    display: renderer.display ?? 'icon-and-label',
    variant: renderer.variant,
    semanticColor: prioritySemanticColorByValue[priority],
    toneText: tone.text,
    toneColor: tone.color,
    tableSize,
  })
}

function renderStatusValue(
  renderer: Extract<TableCellRenderer, { type: 'status' }>,
  value: TableStatusCellValue,
  tableSize: TableSize,
) {
  if (React.isValidElement(value)) return value

  const normalized =
    isPlainObject(value) && typeof value.value === 'string'
      ? {
          value: value.value as StatusIconStatus,
          label: value.label,
          icon: typeof value.icon === 'string' ? value.icon : undefined,
        }
      : {
          value: (value ?? 'todo') as StatusIconStatus,
          label: undefined,
          icon: undefined,
        }

  if (!isKnownStatusValue(normalized.value)) return renderStringValue(value)

  const config = renderer.values?.find(item => item.value === normalized.value)
  const label = normalized.label ?? config?.label ?? statusLabelByValue[normalized.value]
  const icon = normalized.icon ?? config?.icon
  const tone = statusToneByValue[normalized.value]

  return renderIconLabelDisplay({
    label,
    renderIcon: size => renderStatusResolvedIcon(normalized.value, icon, size),
    display: renderer.display ?? 'icon-and-label',
    variant: renderer.variant,
    semanticColor: statusSemanticColorByValue[normalized.value],
    toneText: tone.text,
    toneColor: tone.color,
    tableSize,
  })
}

function renderClassificationValue(
  renderer: Extract<TableCellRenderer, { type: 'classification' }>,
  value: TableClassificationCellValue,
  tableSize: TableSize,
) {
  if (React.isValidElement(value)) return value

  const normalized =
    isPlainObject(value) && typeof value.value === 'string'
      ? {
          value: value.value as TableClassificationValue,
          label: value.label,
          color: value.color,
          icon: typeof value.icon === 'string' ? value.icon : undefined,
        }
      : {
          value: (value ?? 'feature') as TableClassificationValue,
          label: undefined,
          color: undefined,
          icon: undefined,
        }

  if (!isKnownClassificationValue(normalized.value)) return renderStringValue(value)

  const config = renderer.values?.find(item => item.value === normalized.value)
  const label = normalized.label ?? config?.label ?? classificationLabelByValue[normalized.value]
  const icon = normalized.icon ?? config?.icon
  const tone = classificationToneByValue[normalized.value]
  const iconColor = normalized.color ?? config?.color ?? tone.iconColor
  const resolvedIcon = icon ?? getDefaultClassificationIcon(normalized.value)
  const iconProps = !icon ? getClassificationIconProps(normalized.value) : undefined

  return renderIconLabelDisplay({
    label,
    renderIcon: size => <Icon icon={resolvedIcon} size={size} color={iconColor} iconProps={iconProps} />,
    display: renderer.display ?? 'icon-and-label',
    variant: renderer.variant,
    semanticColor: classificationSemanticColorByValue[normalized.value],
    toneText: tone.text,
    tableSize,
  })
}

export function renderTableCellValue(
  value: TableCellValue,
  renderer: TableCellRenderer | undefined,
  tableSize: TableSize,
) {
  const safeRenderer = resolveRenderer(renderer)

  switch (safeRenderer.type) {
    case 'label':
      return renderLabelValue(safeRenderer, value as TableLabelCellValue, tableSize)
    case 'avatar':
      return renderAvatarValue(safeRenderer, value as TableAvatarCellValue, tableSize)
    case 'avatar-group':
      return renderAvatarGroupValue(safeRenderer, value as TableAvatarGroupCellValue, tableSize)
    case 'checkbox':
      return renderCheckboxValue(safeRenderer, value as TableCheckboxCellValue, tableSize)
    case 'timeline':
      return renderTimelineValue(safeRenderer, value as TableTimelineCellValue, tableSize)
    case 'sparkline':
      return renderSparklineValue(safeRenderer, value as TableSparklineCellValue, tableSize)
    case 'priority':
      return renderPriorityValue(safeRenderer, value as TablePriorityCellValue, tableSize)
    case 'status':
      return renderStatusValue(safeRenderer, value as TableStatusCellValue, tableSize)
    case 'classification':
      return renderClassificationValue(safeRenderer, value as TableClassificationCellValue, tableSize)
    default:
      return renderStringValue(value)
  }
}

export function getTableCellTextValue(value: TableCellValue) {
  if (React.isValidElement(value)) return ''
  if (value === null || value === undefined) return ''
  if (Array.isArray(value))
    return value.map(item => (typeof item === 'object' ? JSON.stringify(item) : String(item))).join(' ')
  if (value instanceof Date) return value.toISOString()

  if (isPlainObject(value)) {
    if ('value' in value && typeof value.value === 'string') return value.value
    if ('name' in value && typeof value.name === 'string') return value.name
    if ('date' in value) return String(value.date)
    if ('checked' in value) return value.checked ? 'true' : 'false'
    if ('data' in value && Array.isArray(value.data)) return value.data.join(',')
    if ('label' in value && typeof value.label === 'string') return value.label
    if ('text' in value && (typeof value.text === 'string' || typeof value.text === 'number')) return String(value.text)
  }

  return String(value)
}

type RendererEditorOption = {
  value: string
  label: React.ReactNode
  avatar?: { src?: string; name?: string }
  data?: unknown
  icon?: string
  iconColor?: string
  iconProps?: Record<string, unknown>
  color?: string
  variant?: 'solid' | 'soft' | 'surface' | 'outline'
}

type SchemaValue = { value: string; label?: React.ReactNode; icon?: string; color?: string }

function hasRendererValues(renderer: TableCellRenderer): renderer is TableCellRenderer & { values: SchemaValue[] } {
  if (renderer.type === 'timeline' || renderer.type === 'sparkline') return false
  return 'values' in renderer && Array.isArray(renderer.values) && renderer.values.length > 0
}

export function getRendererEditorOptions(renderer?: TableCellRenderer): RendererEditorOption[] | undefined {
  if (!renderer) return undefined

  if ((renderer.type === 'avatar' || renderer.type === 'avatar-group') && renderer.values?.length) {
    return renderer.values.map((av, index) => {
      const key = av.id ?? av.name ?? av.src ?? `avatar-${index}`
      return {
        value: key,
        label: av.name ?? av.id ?? av.src ?? key,
        avatar: { src: av.src, name: av.name },
        data: av,
      }
    })
  }

  if (renderer.type === 'label' && renderer.values?.length) {
    const variant = renderer.variant ?? 'solid'
    const fallbackColor = renderer.monochrome ?? renderer.color
    return renderer.values.map(v => ({
      value: v.value,
      label: v.label ?? v.value,
      color: v.color ?? fallbackColor ?? undefined,
      variant: v.variant ?? variant,
    }))
  }

  if (hasRendererValues(renderer)) {
    return renderer.values.map(v => ({
      value: v.value,
      label: v.label ?? v.value,
      icon: v.icon,
      ...('color' in v && v.color != null ? { iconColor: v.color as string, color: v.color as string } : {}),
    }))
  }

  return undefined
}
