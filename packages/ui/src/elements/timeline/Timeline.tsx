'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import {
  timelineContent as timelineContentStyle,
  timelineDate as timelineDateStyle,
  timelineHeader as timelineHeaderStyle,
  timelineIndicatorBase,
  timelineIndicatorPosition,
  timelineItemBase,
  timelineItemOrientation,
  timelineRoot,
  timelineSeparatorBase,
  timelineSeparatorCompleted,
  timelineSeparatorPosition,
  timelineSizeVars,
  timelineTitle as timelineTitleStyle,
} from './Timeline.css'
import { timelinePropDefs } from './timeline.props'

// ─── Types ───────────────────────────────────────────────────────────────────

type TimelineOrientation = (typeof timelinePropDefs.orientation.values)[number]
type TimelineSize = (typeof timelinePropDefs.size.values)[number]

// ─── Context ─────────────────────────────────────────────────────────────────

type TimelineContextValue = {
  orientation: TimelineOrientation
  activeStep?: number
  setActiveStep: (step: number) => void
}

type TimelineItemContextValue = {
  isCompleted: boolean | undefined
  isActive: boolean | undefined
  separatorCompleted: boolean
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
  orientation?: TimelineOrientation
  size?: TimelineSize
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
}

const TimelineRoot = React.forwardRef<HTMLDivElement, TimelineRootProps>(
  (
    {
      orientation = timelinePropDefs.orientation.default,
      size = timelinePropDefs.size.default,
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

    const setActiveStep = React.useCallback(
      (step: number) => {
        if (!isControlled) setUncontrolledValue(step)
        onValueChange?.(step)
      },
      [isControlled, onValueChange],
    )

    const ctxValue = React.useMemo(
      () => ({ orientation: resolvedOrientation, activeStep, setActiveStep }),
      [resolvedOrientation, activeStep, setActiveStep],
    )

    return (
      <TimelineContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={cn(timelineRoot[resolvedOrientation], timelineSizeVars[resolvedSize], className)}
          data-orientation={resolvedOrientation}
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
    const { orientation, activeStep } = useTimeline()
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
        <div
          ref={ref}
          className={cn(timelineItemBase, timelineItemOrientation[orientation], className)}
          data-completed={isCompleted || undefined}
          data-active={isActive || undefined}
          aria-current={isActive ? 'step' : undefined}
          {...props}
        >
          {children}
        </div>
      </TimelineItemContext.Provider>
    )
  },
)
TimelineItem.displayName = 'Timeline.Item'

// ─── Indicator ───────────────────────────────────────────────────────────────

export type TimelineIndicatorProps = React.ComponentProps<'div'>

const TimelineIndicator = React.forwardRef<HTMLDivElement, TimelineIndicatorProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = useTimeline()
    const { isCompleted, isActive } = useTimelineItem()

    const state =
      isCompleted !== undefined
        ? isCompleted && !isActive
          ? 'completed'
          : isActive
            ? 'active'
            : 'inactive'
        : undefined

    return (
      <div
        ref={ref}
        aria-hidden
        data-state={state}
        className={cn(timelineIndicatorBase, timelineIndicatorPosition[orientation], className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)
TimelineIndicator.displayName = 'Timeline.Indicator'

// ─── Separator ───────────────────────────────────────────────────────────────

export type TimelineSeparatorProps = React.ComponentProps<'div'>

const TimelineSeparator = React.forwardRef<HTMLDivElement, TimelineSeparatorProps>(({ className, ...props }, ref) => {
  const { orientation } = useTimeline()
  const { separatorCompleted } = useTimelineItem()

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        timelineSeparatorBase,
        timelineSeparatorPosition[orientation],
        separatorCompleted && timelineSeparatorCompleted,
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
    <div ref={ref} className={cn(timelineHeaderStyle, className)} {...props}>
      {children}
    </div>
  ),
)
TimelineHeader.displayName = 'Timeline.Header'

// ─── Title ───────────────────────────────────────────────────────────────────

export type TimelineTitleProps = React.ComponentProps<'h3'>

const TimelineTitle = React.forwardRef<HTMLHeadingElement, TimelineTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3 ref={ref} className={cn(timelineTitleStyle, className)} {...props}>
        {children}
      </h3>
    )
  },
)
TimelineTitle.displayName = 'Timeline.Title'

// ─── Date ────────────────────────────────────────────────────────────────────

export type TimelineDateProps = React.ComponentProps<'time'>

const TimelineDate = React.forwardRef<HTMLTimeElement, TimelineDateProps>(({ className, children, ...props }, ref) => {
  return (
    <time ref={ref} className={cn(timelineDateStyle, className)} {...props}>
      {children}
    </time>
  )
})
TimelineDate.displayName = 'Timeline.Date'

// ─── Content ─────────────────────────────────────────────────────────────────

export type TimelineContentProps = React.ComponentProps<'div'>

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(timelineContentStyle, className)} {...props}>
        {children}
      </div>
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
