'use client'

import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import { Button } from '../button/Button'
import {
  stepperDescription,
  stepperFooter,
  stepperFooterActions,
  stepperFooterMeta,
  stepperIndicatorBase,
  stepperIndicatorSize,
  stepperIndicatorVariant,
  stepperItem,
  stepperNav,
  stepperPanel,
  stepperPanelTransition,
  stepperPanelVariants,
  stepperRoot,
  stepperSeparator,
  stepperSeparatorCompleted,
  stepperSeparatorOffset,
  stepperSizeVars,
  stepperText,
  stepperTitle,
  stepperTriggerBase,
  stepperTriggerOrientation,
  stepperTriggerSize,
  stepperTriggerVariant,
} from './Stepper.css'
import { stepperPropDefs } from './stepper.props'

type StepperOrientation = (typeof stepperPropDefs.orientation.values)[number]
type StepperVariant = (typeof stepperPropDefs.variant.values)[number]
type StepperSize = (typeof stepperPropDefs.size.values)[number]

export interface StepperStep {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  content?: React.ReactNode
  disabled?: boolean
}

export interface StepperRenderIndicatorArgs {
  index: number
  isActive: boolean
  isCompleted: boolean
  isDisabled: boolean
  step: StepperStep
}

export interface StepperRenderFooterArgs {
  activeIndex: number
  canGoNext: boolean
  canGoPrevious: boolean
  goNext: () => void
  goPrevious: () => void
  steps: StepperStep[]
}

export interface StepperProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  steps: StepperStep[]
  value?: number
  defaultValue?: number
  onValueChange?: (value: number, step: StepperStep) => void
  onComplete?: (step: StepperStep, index: number) => void
  orientation?: StepperOrientation
  variant?: StepperVariant
  size?: StepperSize
  allowStepSelect?: boolean
  showControls?: boolean
  animated?: boolean
  previousLabel?: string
  nextLabel?: string
  completeLabel?: string
  renderIndicator?: (args: StepperRenderIndicatorArgs) => React.ReactNode
  renderContent?: (step: StepperStep, index: number) => React.ReactNode
  renderFooter?: (args: StepperRenderFooterArgs) => React.ReactNode
  panelClassName?: string
}

function clampIndex(index: number, steps: StepperStep[]) {
  if (steps.length === 0) return 0
  return Math.min(Math.max(index, 0), steps.length - 1)
}

function findNextEnabledStep(steps: StepperStep[], start: number, direction: 1 | -1) {
  let next = start + direction
  while (next >= 0 && next < steps.length) {
    if (!steps[next]?.disabled) return next
    next += direction
  }
  return start
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      value,
      defaultValue = 0,
      onValueChange,
      onComplete,
      orientation = stepperPropDefs.orientation.default,
      variant = stepperPropDefs.variant.default,
      size = stepperPropDefs.size.default,
      allowStepSelect = stepperPropDefs.allowStepSelect.default,
      showControls = stepperPropDefs.showControls.default,
      animated = false,
      previousLabel = 'Back',
      nextLabel = 'Next',
      completeLabel = 'Complete',
      renderIndicator,
      renderContent,
      renderFooter,
      className,
      panelClassName,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
    const isControlled = value !== undefined
    const activeIndex = clampIndex(isControlled ? value : uncontrolledValue, steps)
    const resolvedOrientation =
      (normalizeEnumPropValue(stepperPropDefs.orientation, orientation) as StepperOrientation | undefined) ??
      stepperPropDefs.orientation.default
    const resolvedVariant =
      (normalizeEnumPropValue(stepperPropDefs.variant, variant) as StepperVariant | undefined) ??
      stepperPropDefs.variant.default
    const resolvedSize =
      (normalizeEnumPropValue(stepperPropDefs.size, size) as StepperSize | undefined) ?? stepperPropDefs.size.default
    const activeStep = steps[activeIndex]
    const triggerRefs = React.useRef<Array<HTMLButtonElement | null>>([])
    const id = React.useId()

    const setActiveIndex = React.useCallback(
      (nextIndex: number) => {
        const clamped = clampIndex(nextIndex, steps)
        const nextStep = steps[clamped]
        if (!nextStep || nextStep.disabled) return
        if (!isControlled) {
          setUncontrolledValue(clamped)
        }
        onValueChange?.(clamped, nextStep)
      },
      [isControlled, onValueChange, steps],
    )

    const goPrevious = React.useCallback(() => {
      const nextIndex = findNextEnabledStep(steps, activeIndex, -1)
      if (nextIndex !== activeIndex) {
        setActiveIndex(nextIndex)
      }
    }, [activeIndex, setActiveIndex, steps])

    const goNext = React.useCallback(() => {
      const nextIndex = findNextEnabledStep(steps, activeIndex, 1)
      if (nextIndex !== activeIndex) {
        setActiveIndex(nextIndex)
        return
      }

      if (activeStep && !activeStep.disabled) {
        onComplete?.(activeStep, activeIndex)
      }
    }, [activeIndex, activeStep, onComplete, setActiveIndex, steps])

    const canGoPrevious = findNextEnabledStep(steps, activeIndex, -1) !== activeIndex
    const canGoNext = findNextEnabledStep(steps, activeIndex, 1) !== activeIndex
    const activePanelId = activeStep ? `${id}-panel-${activeStep.id}` : undefined
    const activeTabId = activeStep ? `${id}-tab-${activeStep.id}` : undefined
    const activePanelContent = activeStep
      ? renderContent
        ? renderContent(activeStep, activeIndex)
        : activeStep.content
      : null

    return (
      <div ref={ref} className={cn(stepperRoot, stepperSizeVars[resolvedSize], className)} {...props}>
        <div className={stepperNav[resolvedOrientation]} role="tablist" aria-orientation={resolvedOrientation}>
          {steps.map((step, index) => {
            const isActive = index === activeIndex
            const isDisabled = Boolean(step.disabled)
            const isCompleted = !isDisabled && index < activeIndex
            const tabId = `${id}-tab-${step.id}`
            const panelId = `${id}-panel-${step.id}`

            return (
              <div key={step.id} className={stepperItem[resolvedOrientation]}>
                <button
                  ref={node => {
                    triggerRefs.current[index] = node
                  }}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-controls={panelId}
                  aria-selected={isActive}
                  aria-disabled={isDisabled}
                  tabIndex={isActive ? 0 : -1}
                  data-state={isCompleted ? 'completed' : isActive ? 'active' : 'inactive'}
                  className={cn(
                    stepperTriggerBase,
                    stepperTriggerOrientation[resolvedOrientation],
                    stepperTriggerSize,
                    stepperTriggerVariant[resolvedVariant],
                  )}
                  onClick={() => {
                    if (allowStepSelect) {
                      setActiveIndex(index)
                    }
                  }}
                  onKeyDown={event => {
                    const isHorizontal = resolvedOrientation === 'horizontal'
                    const focusIndex = (nextIndex: number) => triggerRefs.current[nextIndex]?.focus()

                    switch (event.key) {
                      case 'ArrowRight':
                        if (isHorizontal) {
                          event.preventDefault()
                          focusIndex((index + 1) % steps.length)
                        }
                        break
                      case 'ArrowLeft':
                        if (isHorizontal) {
                          event.preventDefault()
                          focusIndex((index - 1 + steps.length) % steps.length)
                        }
                        break
                      case 'ArrowDown':
                        if (!isHorizontal) {
                          event.preventDefault()
                          focusIndex((index + 1) % steps.length)
                        }
                        break
                      case 'ArrowUp':
                        if (!isHorizontal) {
                          event.preventDefault()
                          focusIndex((index - 1 + steps.length) % steps.length)
                        }
                        break
                      case 'Home':
                        event.preventDefault()
                        focusIndex(0)
                        break
                      case 'End':
                        event.preventDefault()
                        focusIndex(steps.length - 1)
                        break
                      case 'Enter':
                      case ' ':
                        if (allowStepSelect) {
                          event.preventDefault()
                          setActiveIndex(index)
                        }
                        break
                      default:
                        break
                    }
                  }}
                >
                  <span
                    className={cn(stepperIndicatorBase, stepperIndicatorSize, stepperIndicatorVariant[resolvedVariant])}
                    data-state={isCompleted ? 'completed' : isActive ? 'active' : 'inactive'}
                  >
                    {renderIndicator
                      ? renderIndicator({ index, isActive, isCompleted, isDisabled, step })
                      : isCompleted
                        ? '✓'
                        : index + 1}
                  </span>
                  <span className={stepperText}>
                    <span className={stepperTitle}>{step.title}</span>
                    {step.description ? <span className={stepperDescription}>{step.description}</span> : null}
                  </span>
                </button>
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      stepperSeparator[resolvedOrientation],
                      resolvedOrientation === 'vertical' && stepperSeparatorOffset,
                      isCompleted && stepperSeparatorCompleted,
                    )}
                  />
                ) : null}
              </div>
            )
          })}
        </div>

        {activeStep && animated ? (
          <AnimatePresence mode="wait">
            <m.div
              key={activeStep.id}
              id={activePanelId}
              role="tabpanel"
              aria-labelledby={activeTabId}
              className={cn(stepperPanel, panelClassName)}
              variants={stepperPanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stepperPanelTransition}
            >
              {activePanelContent}
            </m.div>
          </AnimatePresence>
        ) : activeStep ? (
          <div
            id={activePanelId}
            role="tabpanel"
            aria-labelledby={activeTabId}
            className={cn(stepperPanel, panelClassName)}
          >
            {activePanelContent}
          </div>
        ) : null}

        {showControls && activeStep ? (
          renderFooter ? (
            renderFooter({ activeIndex, canGoNext, canGoPrevious, goNext, goPrevious, steps })
          ) : (
            <div className={stepperFooter}>
              <div className={stepperFooterMeta}>
                Step {Math.min(activeIndex + 1, Math.max(steps.length, 1))} of {steps.length}
              </div>
              <div className={stepperFooterActions}>
                <Button type="button" variant="outline" onClick={goPrevious} disabled={!canGoPrevious}>
                  {previousLabel}
                </Button>
                <Button type="button" onClick={goNext} disabled={!canGoNext && !onComplete}>
                  {canGoNext ? nextLabel : completeLabel}
                </Button>
              </div>
            </div>
          )
        ) : null}
      </div>
    )
  },
)

Stepper.displayName = 'Stepper'

export { Stepper }
