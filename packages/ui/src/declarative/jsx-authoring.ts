import type { DeclarativeNode, DeclarativeValue, PageDocument } from '@incmix/core'
import { generateElement } from '@incmix/react-runner'
import * as React from 'react'
import { Accordion } from '@/elements/accordion/Accordion'
import { Avatar } from '@/elements/avatar/Avatar'
import { AvatarGroup } from '@/elements/avatar/AvatarGroup'
import { AvatarPie } from '@/elements/avatar/AvatarPie'
import { Badge } from '@/elements/badge/Badge'
import { Button } from '@/elements/button/Button'
import { IconButton } from '@/elements/button/IconButton'
import { Callout } from '@/elements/callout/Callout'
import { Card } from '@/elements/card/Card'
import { Image } from '@/elements/image/Image'
import { Spinner } from '@/elements/spinner/Spinner'
import { SegmentedControl } from '@/elements/tabs/SegmentedControl'
import { Tabs } from '@/elements/tabs/Tabs'
import { Slider } from '@/form/Slider'

type AuthoringComponent = (props: Record<string, unknown>) => React.ReactElement | null

export type DeclarativeJsxAuthoringLocation = {
  line: number
  column: number
}

export class DeclarativeJsxAuthoringError extends Error {
  location?: DeclarativeJsxAuthoringLocation
  path?: string

  constructor(message: string, options?: { location?: DeclarativeJsxAuthoringLocation; path?: string }) {
    super(message)
    this.name = 'DeclarativeJsxAuthoringError'
    this.location = options?.location
    this.path = options?.path
  }
}

export type DeclarativeJsxCompileResult = {
  page: PageDocument
  projectedJsx: string
}

export function Layout(): null {
  return null
}

export function Template(): null {
  return null
}

export function Widget(): null {
  return null
}

type AuthoringIntrinsicName = 'Layout' | 'Template' | 'Widget'

const intrinsicComponentMap = new Map<unknown, AuthoringIntrinsicName>([
  [Layout, 'Layout'],
  [Template, 'Template'],
  [Widget, 'Widget'],
])

const catalogComponentEntries = [
  { name: 'Accordion', component: Accordion },
  { name: 'Avatar', component: Avatar },
  { name: 'AvatarGroup', component: AvatarGroup },
  { name: 'AvatarPie', component: AvatarPie },
  { name: 'Badge', component: Badge },
  { name: 'Button', component: Button },
  { name: 'Callout', component: Callout },
  { name: 'Card', component: Card },
  { name: 'IconButton', component: IconButton },
  { name: 'Image', component: Image },
  { name: 'SegmentedControl', component: SegmentedControl },
  { name: 'Slider', component: Slider },
  { name: 'Spinner', component: Spinner },
  { name: 'Tabs', component: Tabs },
] as const

const catalogComponentMap = new Map<unknown, string>(
  catalogComponentEntries.map(entry => [entry.component, entry.name]),
)

export const declarativeJsxAuthoringScope = catalogComponentEntries.reduce<Record<string, unknown>>(
  (scope, entry) => {
    scope[entry.name] = entry.component
    return scope
  },
  {
    Layout,
    Template,
    Widget,
  },
)

function extractLocationFromMessage(message: string): DeclarativeJsxAuthoringLocation | undefined {
  const directMatch = message.match(/\((\d+):(\d+)\)/)
  if (directMatch) {
    return {
      line: Number(directMatch[1]),
      // The parenthesized runner format reports a zero-based column.
      column: Number(directMatch[2]) + 1,
    }
  }

  const prefixedMatch = message.match(/:(\d+):(\d+)/)
  if (prefixedMatch) {
    return {
      line: Number(prefixedMatch[1]),
      // The prefixed format already reports a one-based column.
      column: Number(prefixedMatch[2]),
    }
  }

  return undefined
}

function formatAuthoringError(error: unknown): DeclarativeJsxAuthoringError {
  if (error instanceof DeclarativeJsxAuthoringError) {
    return error
  }

  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('is not defined')) {
    const match = message.match(/['"]?(\w+)['"]?\s+is not defined/i)
    const symbol = match?.[1] ?? message.split(' ')[0]
    return new DeclarativeJsxAuthoringError(`Unknown component or symbol "${symbol}" in JSX authoring input`, {
      location: extractLocationFromMessage(message),
    })
  }

  return new DeclarativeJsxAuthoringError(message, {
    location: extractLocationFromMessage(message),
  })
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value) && value.constructor === Object
}

function normalizeDeclarativeValue(value: unknown, path: string): DeclarativeValue {
  if (value === undefined) {
    throw new DeclarativeJsxAuthoringError(`Undefined values are not supported in declarative props at ${path}`, {
      path,
    })
  }

  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => normalizeDeclarativeValue(item, `${path}[${index}]`))
  }

  if (React.isValidElement(value)) {
    throw new DeclarativeJsxAuthoringError('Nested JSX values are only supported as children, not as prop values', {
      path,
    })
  }

  if (typeof value === 'function') {
    throw new DeclarativeJsxAuthoringError('Function props are not supported in declarative JSX authoring', {
      path,
    })
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, normalizeDeclarativeValue(entryValue, `${path}.${key}`)]),
    )
  }

  throw new DeclarativeJsxAuthoringError(`Unsupported prop value at ${path}`, { path })
}

function collectElementProps(props: Record<string, unknown>, path: string) {
  const nodeProps: Record<string, DeclarativeValue> = {}
  let meta: Record<string, unknown> | undefined

  for (const [key, value] of Object.entries(props)) {
    if (key === 'children' || value === undefined) continue

    if (key === 'meta') {
      if (!isPlainObject(value)) {
        throw new DeclarativeJsxAuthoringError('meta must be a plain object', { path: `${path}.meta` })
      }
      meta = normalizeDeclarativeValue(value, `${path}.meta`) as Record<string, unknown>
      continue
    }

    nodeProps[key] = normalizeDeclarativeValue(value, `${path}.props.${key}`)
  }

  return {
    props: Object.keys(nodeProps).length > 0 ? nodeProps : undefined,
    meta,
  }
}

function collectNodeChildren(children: unknown, path: string): DeclarativeNode[] {
  const items = React.Children.toArray(children as React.ReactNode)
  const nodes: DeclarativeNode[] = []

  items.forEach((child, index) => {
    if (typeof child === 'string') {
      if (child.trim().length === 0) return
      throw new DeclarativeJsxAuthoringError(
        'Text children are only supported on Template or simple labeled components',
        {
          path: `${path}.children[${index}]`,
        },
      )
    }

    if (typeof child === 'number' || typeof child === 'boolean') {
      throw new DeclarativeJsxAuthoringError('Primitive children must be expressed as props, not direct JSX children', {
        path: `${path}.children[${index}]`,
      })
    }

    if (!React.isValidElement(child)) return

    nodes.push(convertReactElementToDeclarativeNode(child, `${path}.children[${nodes.length}]`))
  })

  return nodes
}

function collectSingleTextChild(children: unknown): string | undefined {
  const items = React.Children.toArray(children as React.ReactNode).filter(
    child => !(typeof child === 'string' && child.trim().length === 0),
  )
  if (items.length === 0) return undefined
  if (items.length === 1 && typeof items[0] === 'string') return items[0]
  return undefined
}

function convertReactElementToDeclarativeNode(element: React.ReactElement, path: string): DeclarativeNode {
  const intrinsicName = intrinsicComponentMap.get(element.type)
  const catalogComponentName = catalogComponentMap.get(element.type)
  const rawProps = (element.props ?? {}) as Record<string, unknown>

  if (!intrinsicName && !catalogComponentName) {
    const componentName =
      typeof element.type === 'string'
        ? element.type
        : ((((element.type as { displayName?: string }).displayName ?? (element.type as AuthoringComponent).name) as
            | string
            | undefined) ?? 'anonymous')

    throw new DeclarativeJsxAuthoringError(`Unsupported declarative JSX element "${componentName}"`, { path })
  }

  if (intrinsicName === 'Layout') {
    const { props, meta } = collectElementProps(rawProps, path)
    const children = collectNodeChildren(rawProps.children, path)

    return {
      type: 'layout',
      ...(props ? { props } : {}),
      ...(meta ? { meta } : {}),
      ...(children.length > 0 ? { children } : {}),
    }
  }

  if (intrinsicName === 'Template') {
    const { props, meta } = collectElementProps(rawProps, path)
    const templateFromChildren = collectSingleTextChild(rawProps.children)
    const template = typeof props?.template === 'string' ? props.template : templateFromChildren

    if (!template) {
      throw new DeclarativeJsxAuthoringError('Template requires a string template prop or a single text child', {
        path,
      })
    }

    return {
      type: 'template',
      props: {
        ...(props ?? {}),
        template,
      },
      ...(meta ? { meta } : {}),
    }
  }

  if (intrinsicName === 'Widget') {
    const { props, meta } = collectElementProps(rawProps, path)

    if (typeof props?.widget !== 'string') {
      throw new DeclarativeJsxAuthoringError('Widget requires a string widget prop', { path })
    }

    return {
      type: 'widget',
      props,
      ...(meta ? { meta } : {}),
    }
  }

  const { props, meta } = collectElementProps(rawProps, path)
  const childLabel = collectSingleTextChild(rawProps.children)
  const childElements = React.Children.toArray(rawProps.children as React.ReactNode).filter(child =>
    React.isValidElement(child),
  )

  if (childElements.length > 0) {
    throw new DeclarativeJsxAuthoringError(
      `Component "${catalogComponentName}" does not support nested JSX children in this authoring bridge`,
      { path },
    )
  }

  return {
    type: 'component',
    props: {
      component: catalogComponentName,
      ...(props ?? {}),
      ...(childLabel && props?.label == null ? { label: childLabel } : {}),
    },
    ...(meta ? { meta } : {}),
  }
}

function formatPropValue(value: DeclarativeValue): string {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return `{${String(value)}}`
  if (value === null) return '{null}'

  return `{${JSON.stringify(value)}}`
}

function projectNodeToJsx(node: DeclarativeNode, indent = 0): string {
  if (!('type' in node)) {
    return `<Template template=${JSON.stringify(node.$ref)} />`
  }

  const padding = '  '.repeat(indent)
  const props = { ...(node.props ?? {}) }
  const meta = node.meta
  const children = node.children ?? []
  let tagName = 'Layout'

  if (node.type === 'template') {
    tagName = 'Template'
  } else if (node.type === 'widget') {
    tagName = 'Widget'
  } else if (node.type === 'component') {
    tagName = typeof props.component === 'string' ? props.component : 'Component'
    delete props.component
  }

  const propEntries = Object.entries(props).map(
    ([key, value]) => `${key}=${formatPropValue(value as DeclarativeValue)}`,
  )
  if (meta) {
    propEntries.push(`meta={${JSON.stringify(meta)}}`)
  }

  const openingTag = `${padding}<${tagName}${propEntries.length > 0 ? ` ${propEntries.join(' ')}` : ''}`

  if (children.length === 0) {
    return `${openingTag} />`
  }

  return `${openingTag}>\n${children.map(child => projectNodeToJsx(child, indent + 1)).join('\n')}\n${padding}</${tagName}>`
}

export function projectDeclarativePageToJsx(page: PageDocument): string {
  return projectNodeToJsx(page.root)
}

export function compileDeclarativeJsxToPage(code: string): DeclarativeJsxCompileResult {
  try {
    const element = generateElement({
      code,
      scope: declarativeJsxAuthoringScope,
    })

    if (!element || !React.isValidElement(element)) {
      throw new DeclarativeJsxAuthoringError('JSX authoring input must produce a single root element')
    }

    const root = convertReactElementToDeclarativeNode(element, 'root')
    const page: PageDocument = {
      kind: 'page',
      id: 'jsx.authoring.preview',
      title: 'JSX Authoring Preview',
      root,
    }

    return {
      page,
      projectedJsx: projectDeclarativePageToJsx(page),
    }
  } catch (error) {
    throw formatAuthoringError(error)
  }
}
