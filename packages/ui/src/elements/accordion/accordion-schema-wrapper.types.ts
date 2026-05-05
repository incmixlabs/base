import type * as React from 'react'
import type { ButtonProps } from '../button/Button'
import type { AccordionRootProps } from './Accordion'

export type AccordionSchemaWrapperAction = {
  id: string
  label: React.ReactNode
  onSelect?: () => void
  href?: string
  disabled?: boolean
  variant?: ButtonProps['variant']
  color?: ButtonProps['color']
}

export type AccordionSchemaWrapperMeta = {
  id: string
  label: React.ReactNode
  value: React.ReactNode
}

export type AccordionSchemaWrapperItem = {
  value: string
  title: React.ReactNode
  description?: React.ReactNode
  content?: React.ReactNode
  meta?: AccordionSchemaWrapperMeta[]
  actions?: AccordionSchemaWrapperAction[]
  disabled?: boolean
  open?: boolean
}

export type AccordionSchema = {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  items: AccordionSchemaWrapperItem[]
}

export type AccordionSchemaWrapperRenderItem = (
  item: AccordionSchemaWrapperItem,
  defaults: { trigger: React.ReactNode; content: React.ReactNode },
) => Partial<{ trigger: React.ReactNode; content: React.ReactNode }>

export type AccordionSchemaWrapperProps = Omit<AccordionRootProps, 'children'> & {
  schema: AccordionSchema
  onActionSelect?: (action: AccordionSchemaWrapperAction, item: AccordionSchemaWrapperItem) => void
  renderItem?: AccordionSchemaWrapperRenderItem
}
