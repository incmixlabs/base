'use client'

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Radius } from '@/theme/tokens'
import { getRadiusStyles, useThemeRadius } from '../utils'
import {
  accordionChevron,
  accordionChevronSizeVariants,
  accordionContentAnimated,
  accordionContentBase,
  accordionContentInner,
  accordionContentPaddingless,
  accordionContentSizeVariants,
  accordionHeaderBase,
  accordionItemBase,
  accordionItemBorderless,
  accordionRootBase,
  accordionRootBorderless,
  accordionTextSizeVariants,
  accordionTriggerBase,
  accordionTriggerPaddingless,
  accordionTriggerSizeVariants,
} from './accordion.class'
import { accordionRootPropDefs } from './accordion.props'

type PrimitiveAccordionRootProps = Omit<
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
  'defaultValue' | 'onValueChange' | 'value'
>
type AccordionValue = string | string[]
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

export interface AccordionRootProps extends PrimitiveAccordionRootProps {
  size?: AccordionSize
  border?: boolean
  triggerPadding?: boolean
  contentPadding?: boolean
  radius?: Radius
  triggerIconPosition?: AccordionTriggerIconPosition
  value?: AccordionValue
  defaultValue?: AccordionValue
  onValueChange?: (value: AccordionValue, eventDetails: AccordionPrimitive.Root.ChangeEventDetails) => void
}

function normalizeAccordionValue(value: AccordionValue | undefined): string[] | undefined {
  if (value === undefined) return undefined
  return Array.isArray(value) ? value : [value]
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
      multiple,
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
    const rootValue = normalizeAccordionValue(valueProp)
    const rootDefaultValue = normalizeAccordionValue(defaultValue)

    const [uncontrolledOpenItems, setUncontrolledOpenItems] = React.useState<string[]>(() => {
      return normalizeAccordionValue(valueProp ?? defaultValue) ?? []
    })
    const openItems = rootValue ?? uncontrolledOpenItems

    const handleValueChange = React.useCallback(
      (newValue: string[], eventDetails: AccordionPrimitive.Root.ChangeEventDetails) => {
        if (valueProp === undefined) {
          setUncontrolledOpenItems(newValue)
        }
        onValueChangeProp?.(multiple ? newValue : (newValue[0] ?? ''), eventDetails)
      },
      [multiple, onValueChangeProp, valueProp],
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
          value={rootValue}
          defaultValue={rootDefaultValue}
          multiple={multiple}
          onValueChange={handleValueChange}
          className={
            typeof className === 'function'
              ? state => cn(accordionRootBase, !border && accordionRootBorderless, className(state))
              : cn(accordionRootBase, !border && accordionRootBorderless, className)
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
    const { isOpen } = React.useContext(AccordionItemContext)
    const resolvedIcon = triggerIcon ?? (
      <ChevronDown
        className={cn(accordionChevron, accordionChevronSizeVariants[accordion.size], isOpen && 'rotate-180')}
        aria-hidden="true"
      />
    )
    const resolvedTriggerIconPosition = triggerIconPosition ?? accordion.triggerIconPosition
    return (
      <AccordionPrimitive.Header className={accordionHeaderBase}>
        <AccordionPrimitive.Trigger
          ref={ref}
          className={
            typeof className === 'function'
              ? state =>
                  cn(
                    accordionTriggerBase,
                    accordionTextSizeVariants[accordion.size],
                    accordionTriggerSizeVariants[accordion.size],
                    !accordion.triggerPadding && accordionTriggerPaddingless,
                    className(state),
                  )
              : cn(
                  accordionTriggerBase,
                  accordionTextSizeVariants[accordion.size],
                  accordionTriggerSizeVariants[accordion.size],
                  !accordion.triggerPadding && accordionTriggerPaddingless,
                  className,
                )
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
              ? state =>
                  cn(
                    accordionContentBase,
                    accordionTextSizeVariants[accordion.size],
                    accordionContentFillClassName,
                    className(state),
                  )
              : cn(
                  accordionContentBase,
                  accordionTextSizeVariants[accordion.size],
                  accordionContentFillClassName,
                  className,
                )
          }
          {...props}
        >
          <div
            className={cn(
              accordionContentInner,
              accordionContentSizeVariants[accordion.size],
              accordionContentFillClassName,
              !accordion.contentPadding && accordionContentPaddingless,
            )}
          >
            {children}
          </div>
        </AccordionPrimitive.Panel>
      )
    }

    return (
      <AccordionPrimitive.Panel
        ref={ref}
        className={
          typeof className === 'function'
            ? state =>
                cn(
                  accordionContentBase,
                  accordionContentAnimated,
                  accordionTextSizeVariants[accordion.size],
                  className(state),
                )
            : cn(accordionContentBase, accordionContentAnimated, accordionTextSizeVariants[accordion.size], className)
        }
        {...props}
      >
        <div
          className={cn(
            accordionContentInner,
            accordionContentSizeVariants[accordion.size],
            !accordion.contentPadding && accordionContentPaddingless,
          )}
        >
          {children}
        </div>
      </AccordionPrimitive.Panel>
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
