'use client'

import * as React from 'react'
import { Button } from '../button/Button'
import { Accordion } from './Accordion'
import type {
  AccordionSchemaWrapperAction,
  AccordionSchemaWrapperItem,
  AccordionSchemaWrapperProps,
} from './accordion-schema-wrapper.types'

function TriggerLayout({ item }: { item: AccordionSchemaWrapperItem }) {
  return (
    <span className="flex min-w-0 flex-col items-start gap-1 text-left">
      <span>{item.title}</span>
      {item.description ? <span className="text-xs text-muted-foreground">{item.description}</span> : null}
    </span>
  )
}

function MetaGrid({ item }: { item: AccordionSchemaWrapperItem }) {
  if (!item.meta || item.meta.length === 0) return null
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {item.meta.map(meta => (
        <div key={meta.id} className="rounded-md border border-border p-3">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{meta.label}</div>
          <div className="mt-1 text-sm">{meta.value}</div>
        </div>
      ))}
    </div>
  )
}

function ActionRow({
  item,
  onActionSelect,
}: {
  item: AccordionSchemaWrapperItem
  onActionSelect?: AccordionSchemaWrapperProps['onActionSelect']
}) {
  if (!item.actions || item.actions.length === 0) return null

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {item.actions.map((action: AccordionSchemaWrapperAction) => (
        <Button
          key={action.id}
          size="sm"
          variant={action.variant ?? 'outline'}
          color={action.color ?? 'slate'}
          disabled={action.disabled}
          onClick={() => {
            action.onSelect?.()
            onActionSelect?.(action, item)
            // Navigate only when no explicit onSelect handler is provided.
            if (!action.onSelect && action.href && typeof window !== 'undefined') {
              window.location.assign(action.href)
            }
          }}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}

export function AccordionSchemaWrapper({
  schema,
  onActionSelect,
  renderItem,
  multiple,
  className: rootClassName,
  ...rootProps
}: AccordionSchemaWrapperProps) {
  const data = schema.items
  const values = React.useMemo(() => data.map(item => item.value), [data])
  const duplicateValue = React.useMemo(() => {
    const seen = new Set<string>()
    for (const value of values) {
      if (seen.has(value)) return value
      seen.add(value)
    }
    return null
  }, [values])

  if (duplicateValue) {
    throw new Error(`AccordionSchemaWrapper item values must be unique. Duplicate value: "${duplicateValue}"`)
  }

  const hasExplicitValue = rootProps.value !== undefined || rootProps.defaultValue !== undefined
  const derivedDefaultValue = React.useMemo(() => {
    if (hasExplicitValue) return undefined
    const openValues = values.filter((_value, index) => data[index]?.open)
    if (openValues.length === 0) return undefined
    if (multiple) return openValues
    return openValues.slice(0, 1)
  }, [data, hasExplicitValue, multiple, values])

  return (
    <div>
      {schema.title ? <div className="text-base font-semibold">{schema.title}</div> : null}
      {schema.description ? <div className="mt-1 text-sm text-muted-foreground">{schema.description}</div> : null}
      <div className={schema.title || schema.description ? 'mt-3' : undefined}>
        <Accordion.Root
          multiple={multiple}
          className={rootClassName}
          {...rootProps}
          {...(derivedDefaultValue !== undefined ? { defaultValue: derivedDefaultValue } : null)}
        >
          {data.map((item, index) => {
            const value = values[index]
            const defaultTrigger = (
              <Accordion.Trigger disabled={item.disabled}>
                <TriggerLayout item={item} />
              </Accordion.Trigger>
            )
            const defaultContent = (
              <Accordion.Content>
                {item.content ? <div className="mb-3 text-sm">{item.content}</div> : null}
                <MetaGrid item={item} />
                <ActionRow item={item} onActionSelect={onActionSelect} />
              </Accordion.Content>
            )
            const overrides = renderItem?.(item, { trigger: defaultTrigger, content: defaultContent })

            return (
              <Accordion.Item key={value} value={value}>
                {overrides?.trigger ?? defaultTrigger}
                {overrides?.content ?? defaultContent}
              </Accordion.Item>
            )
          })}
        </Accordion.Root>
      </div>
    </div>
  )
}

AccordionSchemaWrapper.displayName = 'AccordionSchemaWrapper'

export type {
  AccordionSchema,
  AccordionSchemaWrapperAction,
  AccordionSchemaWrapperItem,
  AccordionSchemaWrapperMeta,
  AccordionSchemaWrapperProps,
  AccordionSchemaWrapperRenderItem,
} from './accordion-schema-wrapper.types'
