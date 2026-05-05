'use client'

import * as React from 'react'
import { Accordion, type AccordionRootProps } from './Accordion'

export interface AccordionWrapperItem {
  value: string
  title: React.ReactNode
  content: React.ReactNode
  open?: boolean
}

export interface AccordionWrapperProps extends Omit<AccordionRootProps, 'children'> {
  data: AccordionWrapperItem[]
}

export function AccordionWrapper({ data, multiple, ...rootProps }: AccordionWrapperProps) {
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
    throw new Error(`AccordionWrapper data values must be unique. Duplicate value: "${duplicateValue}"`)
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
    <Accordion.Root
      multiple={multiple}
      {...rootProps}
      {...(derivedDefaultValue !== undefined ? { defaultValue: derivedDefaultValue } : null)}
    >
      {data.map((item, index) => {
        const value = values[index]
        return (
          <Accordion.Item key={value} value={value}>
            <Accordion.Trigger>{item.title}</Accordion.Trigger>
            <Accordion.Content>{item.content}</Accordion.Content>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}

AccordionWrapper.displayName = 'AccordionWrapper'
