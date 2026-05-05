'use client'

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Radius } from '@/theme/tokens'
import { getRadiusStyles, useThemeRadius } from '../utils'
import {
  accordionChevron,
  accordionContentBase,
  accordionContentInner,
  accordionContentPaddingless,
  accordionHeaderBase,
  accordionItemBase,
  accordionItemBorderless,
  accordionPanelTransition,
  accordionPanelVariants,
  accordionRootBase,
  accordionRootBorderless,
  accordionSizeVars,
  accordionTriggerBase,
  accordionTriggerPaddingless,
} from './Accordion.css'
import { accordionRootPropDefs } from './accordion.props'

type AccordionSize = (typeof accordionRootPropDefs.size.values)[number]
type AccordionTriggerIconPosition = (typeof accordionRootPropDefs.triggerIconPosition.values)[number]

interface AccordionContextValue {
  size: AccordionSize
  border: boolean
  triggerPadding: boolean
  contentPadding: boolean
  triggerIconPosition: AccordionTriggerIconPosition
  openItems: string[]
}

const AccordionContext = React.createContext<AccordionContextValue>({
  size: accordionRootPropDefs.size.default,
  border: accordionRootPropDefs.border.default,
  triggerPadding: accordionRootPropDefs.triggerPadding.default,
  contentPadding: accordionRootPropDefs.contentPadding.default,
  triggerIconPosition: accordionRootPropDefs.triggerIconPosition.default,
  openItems: [],
})

const AccordionItemContext = React.createContext<{ isOpen: boolean }>({ isOpen: false })

export interface AccordionRootProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> {
  size?: AccordionSize
  border?: boolean
  triggerPadding?: boolean
  contentPadding?: boolean
  radius?: Radius
  triggerIconPosition?: AccordionTriggerIconPosition
}

// TODO(accordion-tests): Add component tests covering border={false}, triggerPadding={false},
// and contentPadding={false} across root/item/trigger/content class application.
const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  (
    {
      className,
      size = accordionRootPropDefs.size.default,
      border = accordionRootPropDefs.border.default,
      triggerPadding = accordionRootPropDefs.triggerPadding.default,
      contentPadding = accordionRootPropDefs.contentPadding.default,
      radius: radiusProp,
      triggerIconPosition = accordionRootPropDefs.triggerIconPosition.default,
      style,
      children,
      value: valueProp,
      defaultValue,
      onValueChange: onValueChangeProp,
      ...props
    },
    ref,
  ) => {
    const safeSize = (normalizeEnumPropValue(accordionRootPropDefs.size, size) ??
      accordionRootPropDefs.size.default) as AccordionSize
    const safeTriggerIconPosition = (normalizeEnumPropValue(
      accordionRootPropDefs.triggerIconPosition,
      triggerIconPosition,
    ) ?? accordionRootPropDefs.triggerIconPosition.default) as AccordionTriggerIconPosition
    const safeRadius = useThemeRadius(radiusProp)
    const rootRadiusStyles = getRadiusStyles(safeRadius)

    const [openItems, setOpenItems] = React.useState<string[]>(() => {
      const init = valueProp ?? defaultValue
      if (!init) return []
      return Array.isArray(init) ? init : [init]
    })

    React.useEffect(() => {
      if (valueProp !== undefined) {
        setOpenItems(Array.isArray(valueProp) ? valueProp : [valueProp])
      }
    }, [valueProp])

    const handleValueChange = React.useCallback(
      (newValue: string | string[], eventDetails: unknown) => {
        if (valueProp === undefined) {
          setOpenItems(Array.isArray(newValue) ? newValue : [newValue])
        }
        ;(onValueChangeProp as (...args: unknown[]) => void)?.(newValue, eventDetails)
      },
      [onValueChangeProp, valueProp],
    )

    return (
      <AccordionContext.Provider
        value={{
          size: safeSize,
          border,
          triggerPadding,
          contentPadding,
          triggerIconPosition: safeTriggerIconPosition,
          openItems,
        }}
      >
        <AccordionPrimitive.Root
          ref={ref}
          value={valueProp}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          className={
            typeof className === 'function'
              ? state =>
                  cn(
                    accordionRootBase,
                    !border && accordionRootBorderless,
                    accordionSizeVars[safeSize],
                    className(state),
                  )
              : cn(accordionRootBase, !border && accordionRootBorderless, accordionSizeVars[safeSize], className)
          }
          style={
            typeof style === 'function'
              ? state => ({ ...rootRadiusStyles, ...(style(state) ?? {}) })
              : { ...rootRadiusStyles, ...(style ?? {}) }
          }
          {...props}
        >
          {children}
        </AccordionPrimitive.Root>
      </AccordionContext.Provider>
    )
  },
)

AccordionRoot.displayName = 'Accordion.Root'

export interface AccordionItemProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(({ className, value, ...props }, ref) => {
  const accordion = React.useContext(AccordionContext)
  const isOpen = value !== undefined && accordion.openItems.includes(value as string)

  return (
    <AccordionItemContext.Provider value={{ isOpen }}>
      <AccordionPrimitive.Item
        ref={ref}
        value={value}
        className={
          typeof className === 'function'
            ? state => cn(accordionItemBase, !accordion.border && accordionItemBorderless, className(state))
            : cn(accordionItemBase, !accordion.border && accordionItemBorderless, className)
        }
        {...props}
      />
    </AccordionItemContext.Provider>
  )
})

AccordionItem.displayName = 'Accordion.Item'

export interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  /** @deprecated Use showTriggerIcon */
  chevron?: boolean
  showTriggerIcon?: boolean
  triggerIcon?: React.ReactNode
  triggerIconPosition?: AccordionTriggerIconPosition
}

const AccordionTrigger = React.forwardRef<HTMLElement, AccordionTriggerProps>(
  (
    { className, children, chevron, showTriggerIcon = chevron ?? true, triggerIcon, triggerIconPosition, ...props },
    ref,
  ) => {
    const accordion = React.useContext(AccordionContext)
    const resolvedIcon = triggerIcon ?? <ChevronDown className={accordionChevron} size={16} aria-hidden="true" />
    const resolvedTriggerIconPosition = triggerIconPosition ?? accordion.triggerIconPosition
    return (
      <AccordionPrimitive.Header className={accordionHeaderBase}>
        <AccordionPrimitive.Trigger
          ref={ref}
          className={
            typeof className === 'function'
              ? state =>
                  cn(accordionTriggerBase, !accordion.triggerPadding && accordionTriggerPaddingless, className(state))
              : cn(accordionTriggerBase, !accordion.triggerPadding && accordionTriggerPaddingless, className)
          }
          {...props}
        >
          {showTriggerIcon && resolvedTriggerIconPosition === 'left' ? resolvedIcon : null}
          <Flex as="span" flexGrow="1">
            {children}
          </Flex>
          {showTriggerIcon && resolvedTriggerIconPosition === 'right' ? resolvedIcon : null}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    )
  },
)

AccordionTrigger.displayName = 'Accordion.Trigger'

const accordionContentFillClassName = 'flex h-full min-h-0 flex-1 flex-col'

export interface AccordionContentProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Panel> {
  /** Lets the panel fill parent-managed height instead of animating height. */
  fill?: boolean
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, fill = false, ...props }, ref) => {
    const accordion = React.useContext(AccordionContext)
    const { isOpen } = React.useContext(AccordionItemContext)

    if (fill) {
      if (!isOpen) return null

      return (
        <AccordionPrimitive.Panel
          ref={ref}
          keepMounted
          hidden={false}
          className={
            typeof className === 'function'
              ? state => cn(accordionContentBase, accordionContentFillClassName, className(state))
              : cn(accordionContentBase, accordionContentFillClassName, className)
          }
          {...props}
        >
          <div
            className={cn(
              accordionContentInner,
              accordionContentFillClassName,
              accordionSizeVars[accordion.size],
              !accordion.contentPadding && accordionContentPaddingless,
            )}
          >
            {children}
          </div>
        </AccordionPrimitive.Panel>
      )
    }

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <AccordionPrimitive.Panel
            ref={ref}
            keepMounted
            hidden={false}
            render={
              <m.div
                key="accordion-panel"
                variants={accordionPanelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={accordionPanelTransition}
                style={{ overflow: 'hidden' }}
              />
            }
            className={
              typeof className === 'function'
                ? state => cn(accordionContentBase, className(state))
                : cn(accordionContentBase, className)
            }
            {...props}
          >
            <div
              className={cn(
                accordionContentInner,
                accordionSizeVars[accordion.size],
                !accordion.contentPadding && accordionContentPaddingless,
              )}
            >
              {children}
            </div>
          </AccordionPrimitive.Panel>
        )}
      </AnimatePresence>
    )
  },
)

AccordionContent.displayName = 'Accordion.Content'

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
}

export namespace AccordionProps {
  export type Root = AccordionRootProps
  export type Item = AccordionItemProps
  export type Trigger = AccordionTriggerProps
  export type Content = AccordionContentProps
  export type Size = AccordionSize
}

export type { AccordionSize }
export { AccordionContent, AccordionItem, AccordionRoot, AccordionTrigger }
