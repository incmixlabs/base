'use client'

import * as React from 'react'
import { Column } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import { Heading, type HeadingProps, Text, type TextProps } from '@/typography'
import { Surface } from '../surface/Surface'
import {
  timelineIndicatorBase,
  timelineIndicatorPosition,
  timelineIndicatorSize,
  timelineItemByOrientationAndSize,
  timelineItemGap,
  timelineItemOrientation,
  timelineRoot,
  timelineSeparatorBase,
  timelineSeparatorCompleted,
  timelineSeparatorPosition,
} from './timeline.class'
import { timelinePropDefs } from './timeline.props'

// ─── Types ───────────────────────────────────────────────────────────────────

type TimelineOrientation = (typeof timelinePropDefs.orientation.values)[number]
type TimelineSize = (typeof timelinePropDefs.size.values)[number]
type TimelineVariant = (typeof timelinePropDefs.variant.values)[number]

// ─── Context ─────────────────────────────────────────────────────────────────

type TimelineContextValue = {
  color: Color
  orientation: TimelineOrientation
  size: TimelineSize
  variant: TimelineVariant
  activeStep?: number
  setActiveStep: (step: number) => void
}

type TimelineItemContextValue = {
  isCompleted: boolean | undefined
  isActive: boolean | undefined
  separatorCompleted: boolean
}

const timelineTitleSize: Record<TimelineSize, HeadingProps['size']> = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
}

const timelineTextSize: Record<TimelineSize, TextProps['size']> = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
}

const TimelineContext = React.createContext<TimelineContextValue | undefined>(undefined)
const TimelineItemContext = React.createContext<TimelineItemContextValue | undefined>(undefined)

function useTimeline() {
  const ctx = React.useContext(TimelineContext)
  if (!ctx) throw new Error('Timeline sub-components must be used within Timeline.Root')
  return ctx
}

function useTimelineItem() {
  const ctx = React.useContext(TimelineItemContext)
  if (!ctx) throw new Error('Timeline.Indicator/Separator must be used within Timeline.Item')
  return ctx
}

// ─── Root ────────────────────────────────────────────────────────────────────

export interface TimelineRootProps extends React.ComponentProps<'div'> {
  color?: Color
  orientation?: TimelineOrientation
  size?: TimelineSize
  variant?: TimelineVariant
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
}

const TimelineRoot = React.forwardRef<HTMLDivElement, TimelineRootProps>(
  (
    {
      color = timelinePropDefs.color.default,
      orientation = timelinePropDefs.orientation.default,
      size = timelinePropDefs.size.default,
      variant = timelinePropDefs.variant.default,
      value,
      defaultValue,
      onValueChange,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
    const isControlled = value !== undefined
    const activeStep = isControlled ? value : uncontrolledValue

    const resolvedOrientation =
      (normalizeEnumPropValue(timelinePropDefs.orientation, orientation) as TimelineOrientation | undefined) ??
      timelinePropDefs.orientation.default
    const resolvedSize =
      (normalizeEnumPropValue(timelinePropDefs.size, size) as TimelineSize | undefined) ?? timelinePropDefs.size.default
    const resolvedColor =
      (normalizeEnumPropValue(timelinePropDefs.color, color) as Color | undefined) ?? timelinePropDefs.color.default
    const resolvedVariant =
      (normalizeEnumPropValue(timelinePropDefs.variant, variant) as TimelineVariant | undefined) ??
      timelinePropDefs.variant.default

    const setActiveStep = React.useCallback(
      (step: number) => {
        if (!isControlled) setUncontrolledValue(step)
        onValueChange?.(step)
      },
      [isControlled, onValueChange],
    )

    const ctxValue = React.useMemo(
      () => ({
        color: resolvedColor,
        orientation: resolvedOrientation,
        size: resolvedSize,
        variant: resolvedVariant,
        activeStep,
        setActiveStep,
      }),
      [resolvedColor, resolvedOrientation, resolvedSize, resolvedVariant, activeStep, setActiveStep],
    )

    return (
      <TimelineContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={cn(timelineRoot[resolvedOrientation], className)}
          data-color={resolvedColor}
          data-orientation={resolvedOrientation}
          data-variant={resolvedVariant}
          {...props}
        >
          {children}
        </div>
      </TimelineContext.Provider>
    )
  },
)
TimelineRoot.displayName = 'Timeline.Root'

// ─── Item ────────────────────────────────────────────────────────────────────

export interface TimelineItemProps extends React.ComponentProps<'div'> {
  step: number
}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ step, className, children, ...props }, ref) => {
    const { orientation, size, activeStep } = useTimeline()
    const isPast = activeStep !== undefined && step < activeStep
    const isActive = activeStep !== undefined && step === activeStep
    const isCompleted = isPast || isActive
    const separatorCompleted = isPast

    const itemCtx = React.useMemo(
      () => ({
        isCompleted: activeStep !== undefined ? isCompleted : undefined,
        isActive: activeStep !== undefined ? isActive : undefined,
        separatorCompleted,
      }),
      [activeStep, isCompleted, isActive, separatorCompleted],
    )

    return (
      <TimelineItemContext.Provider value={itemCtx}>
        <Column
          ref={ref}
          position="relative"
          className={cn(
            timelineItemOrientation[orientation],
            timelineItemByOrientationAndSize[orientation][size],
            timelineItemGap,
            className,
          )}
          data-completed={isCompleted || undefined}
          data-active={isActive || undefined}
          aria-current={isActive ? 'step' : undefined}
          {...props}
        >
          {children}
        </Column>
      </TimelineItemContext.Provider>
    )
  },
)
TimelineItem.displayName = 'Timeline.Item'

// ─── Indicator ───────────────────────────────────────────────────────────────

export type TimelineIndicatorProps = React.ComponentProps<'div'>

const TimelineIndicator = React.forwardRef<HTMLDivElement, TimelineIndicatorProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation, size, variant, color } = useTimeline()
    const { isCompleted, isActive } = useTimelineItem()

    const state =
      isCompleted !== undefined
        ? isCompleted && !isActive
          ? 'completed'
          : isActive
            ? 'active'
            : 'inactive'
        : undefined
    const isResolved = state === 'completed' || state === 'active'
    const indicatorColor = isResolved ? color : 'neutral'
    const indicatorVariant = isResolved ? variant : 'outline'

    return (
      <Surface asChild color={indicatorColor} variant={indicatorVariant} radius="full" shape="circle" square ref={ref}>
        <div
          aria-hidden
          data-state={state}
          className={cn(
            timelineIndicatorBase,
            timelineIndicatorSize[size],
            timelineIndicatorPosition[orientation][size],
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </Surface>
    )
  },
)
TimelineIndicator.displayName = 'Timeline.Indicator'

// ─── Separator ───────────────────────────────────────────────────────────────

export type TimelineSeparatorProps = React.ComponentProps<'div'>

const TimelineSeparator = React.forwardRef<HTMLDivElement, TimelineSeparatorProps>(({ className, ...props }, ref) => {
  const { orientation, size, color } = useTimeline()
  const { separatorCompleted } = useTimelineItem()

  return (
    <div
      ref={ref}
      aria-hidden
      data-timeline-separator
      className={cn(
        timelineSeparatorBase,
        timelineSeparatorPosition[orientation][size],
        separatorCompleted && timelineSeparatorCompleted[color],
        className,
      )}
      {...props}
    />
  )
})
TimelineSeparator.displayName = 'Timeline.Separator'

// ─── Header ──────────────────────────────────────────────────────────────────

export type TimelineHeaderProps = React.ComponentProps<'div'>

const TimelineHeader = React.forwardRef<HTMLDivElement, TimelineHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <Column ref={ref} gap="0.125rem" className={className} {...props}>
      {children}
    </Column>
  ),
)
TimelineHeader.displayName = 'Timeline.Header'

// ─── Title ───────────────────────────────────────────────────────────────────

export interface TimelineTitleProps extends Omit<HeadingProps, 'as'> {}

const TimelineTitle = React.forwardRef<HTMLHeadingElement, TimelineTitleProps>(
  ({ className, children, size: sizeProp, weight = 'medium', ...props }, ref) => {
    const { size } = useTimeline()

    return (
      <Heading
        ref={ref}
        as="h3"
        size={sizeProp ?? timelineTitleSize[size]}
        weight={weight}
        className={className}
        {...props}
      >
        {children}
      </Heading>
    )
  },
)
TimelineTitle.displayName = 'Timeline.Title'

// ─── Date ────────────────────────────────────────────────────────────────────

export type TimelineDateProps = React.ComponentProps<'time'>

const TimelineDate = React.forwardRef<HTMLTimeElement, TimelineDateProps>(({ className, children, ...props }, ref) => {
  const { size } = useTimeline()

  return (
    <Text asChild size={timelineTextSize[size]} weight="medium" color="neutral" variant="muted">
      <time ref={ref} className={className} {...props}>
        {children}
      </time>
    </Text>
  )
})
TimelineDate.displayName = 'Timeline.Date'

// ─── Content ─────────────────────────────────────────────────────────────────

export interface TimelineContentProps extends Omit<React.ComponentProps<'div'>, 'color'> {}

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, children, ...props }, ref) => {
    const { size } = useTimeline()

    return (
      <Text
        ref={ref as React.Ref<HTMLElement>}
        as="div"
        size={timelineTextSize[size]}
        color="neutral"
        className={className}
        {...props}
      >
        {children}
      </Text>
    )
  },
)
TimelineContent.displayName = 'Timeline.Content'

// ─── Compound export ─────────────────────────────────────────────────────────

export const Timeline = {
  Root: TimelineRoot,
  Item: TimelineItem,
  Indicator: TimelineIndicator,
  Separator: TimelineSeparator,
  Header: TimelineHeader,
  Title: TimelineTitle,
  Date: TimelineDate,
  Content: TimelineContent,
}

export namespace TimelineProps {
  export type Root = TimelineRootProps
  export type Item = TimelineItemProps
  export type Indicator = TimelineIndicatorProps
  export type Separator = TimelineSeparatorProps
  export type Header = TimelineHeaderProps
  export type Title = TimelineTitleProps
  export type Date = TimelineDateProps
  export type Content = TimelineContentProps
}
