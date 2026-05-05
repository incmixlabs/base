'use client'

import type { ActionSpec, DeclarativeNode, DeclarativeTypedNode, NormalizedPageDocument } from '@incmix/core'
import { useSelector } from '@xstate/react'
import type { ComponentType, FormEvent, MouseEvent, ReactNode } from 'react'
import { Fragment } from 'react'
import type { AnyActorRef } from 'xstate'

export type DeclarativeActionHandler = (action: Exclude<ActionSpec, { type: 'emitEvent' }>) => void

export type DeclarativeComponentRendererProps = {
  node: DeclarativeTypedNode
  actorRef: AnyActorRef
  snapshot: unknown
  enabled: boolean
  slots: Record<string, ReactNode>
  children: ReactNode
  triggerAction: (name: string, domEvent?: MouseEvent<HTMLElement> | FormEvent<HTMLFormElement>) => void
}

export type DeclarativeRendererRegistry = Record<string, ComponentType<DeclarativeComponentRendererProps>>

export type DeclarativeRendererProps = {
  node: DeclarativeNode
  actorRef: AnyActorRef
  components?: DeclarativeRendererRegistry
  onAction?: DeclarativeActionHandler
}

export type DeclarativePageRendererProps = {
  page: NormalizedPageDocument
  actorRef: AnyActorRef
  components?: DeclarativeRendererRegistry
  onAction?: DeclarativeActionHandler
}

type DeclarativeExpressionScope = {
  state: unknown
  context: unknown
}

function isQuotedString(value: string) {
  return (value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))
}

function parseLiteral(value: string) {
  const normalized = value.trim()

  if (normalized === 'true') return true
  if (normalized === 'false') return false
  if (normalized === 'null') return null
  if (normalized === 'undefined') return undefined
  if (isQuotedString(normalized)) return normalized.slice(1, -1)

  const numericValue = Number(normalized)
  if (!Number.isNaN(numericValue) && normalized.length > 0) {
    return numericValue
  }

  return undefined
}

function readPathValue(source: unknown, path: string) {
  if (!path) return source

  return path.split('.').reduce<unknown>((current, segment) => {
    if (current == null || typeof current !== 'object') return undefined
    return (current as Record<string, unknown>)[segment]
  }, source)
}

function evaluateOperand(expression: string, scope: DeclarativeExpressionScope): unknown {
  const normalized = expression.trim()
  const literalValue = parseLiteral(normalized)
  if (literalValue !== undefined || normalized === 'undefined') return literalValue

  const matchesCall = normalized.match(/^state\.matches\((['"])(.+)\1\)$/)
  if (matchesCall) {
    const stateValue = matchesCall[2]
    if (!stateValue) return false
    const snapshot = scope.state as { matches?: (value: string) => boolean } | undefined
    return typeof snapshot?.matches === 'function' ? snapshot.matches(stateValue) : false
  }

  if (normalized === 'state') return scope.state
  if (normalized === 'context') return scope.context
  if (normalized.startsWith('state.')) return readPathValue(scope.state, normalized.slice('state.'.length))
  if (normalized.startsWith('context.')) return readPathValue(scope.context, normalized.slice('context.'.length))

  throw new Error(`Unsupported declarative expression operand: ${normalized}`)
}

function splitTopLevel(expression: string, operator: '||' | '&&'): string[] | null {
  const parts: string[] = []
  let current = ''
  let inSingle = false
  let inDouble = false
  let depth = 0

  for (let index = 0; index < expression.length; index += 1) {
    const char = expression[index]
    const next = expression[index + 1]

    if (!inDouble && char === "'" && expression[index - 1] !== '\\') {
      inSingle = !inSingle
      current += char
      continue
    }

    if (!inSingle && char === '"' && expression[index - 1] !== '\\') {
      inDouble = !inDouble
      current += char
      continue
    }

    if (!inSingle && !inDouble) {
      if (char === '(') depth += 1
      else if (char === ')') depth = Math.max(0, depth - 1)

      if (depth === 0 && char === operator[0] && next === operator[1]) {
        parts.push(current.trim())
        current = ''
        index += 1
        continue
      }
    }

    current += char
  }

  if (!parts.length) return null

  parts.push(current.trim())

  if (parts.some(part => part.length === 0)) {
    throw new Error(`Malformed declarative expression near "${operator}"`)
  }

  return parts
}

export function evaluateSafeDeclarativeExpression(expression: string, scope: DeclarativeExpressionScope): boolean {
  const normalized = expression.trim()
  if (!normalized) return true

  const orParts = splitTopLevel(normalized, '||')
  if (orParts) {
    return orParts.some(part => evaluateSafeDeclarativeExpression(part, scope))
  }

  const andParts = splitTopLevel(normalized, '&&')
  if (andParts) {
    return andParts.every(part => evaluateSafeDeclarativeExpression(part, scope))
  }

  if (normalized.startsWith('!')) {
    return !evaluateSafeDeclarativeExpression(normalized.slice(1), scope)
  }

  // TODO(declarative-ui): this parser intentionally supports only binary === / !== comparisons.
  // Chained expressions like `a === b === c` are not part of the supported grammar.
  const strictEqualityParts = normalized.split('===')
  if (strictEqualityParts.length === 2) {
    const [left, right] = strictEqualityParts
    if (left == null || right == null) return false
    return evaluateOperand(left, scope) === evaluateOperand(right, scope)
  }

  const strictInequalityParts = normalized.split('!==')
  if (strictInequalityParts.length === 2) {
    const [left, right] = strictInequalityParts
    if (left == null || right == null) return false
    return evaluateOperand(left, scope) !== evaluateOperand(right, scope)
  }

  return Boolean(evaluateOperand(normalized, scope))
}

export function evaluateDeclarativeExpression(expression: string | undefined, snapshot: unknown) {
  if (!expression) return true

  try {
    return evaluateSafeDeclarativeExpression(expression, {
      state: snapshot,
      context:
        snapshot && typeof snapshot === 'object' && 'context' in snapshot
          ? (snapshot as { context?: unknown }).context
          : undefined,
    })
  } catch {
    return false
  }
}

export function isDeclarativeNodeVisible(node: DeclarativeNode, snapshot: unknown) {
  return evaluateDeclarativeExpression(node.meta?.visibleWhen, snapshot)
}

export function isDeclarativeNodeEnabled(node: DeclarativeNode, snapshot: unknown) {
  return evaluateDeclarativeExpression(node.meta?.enabledWhen, snapshot)
}

function dispatchDeclarativeAction(
  action: ActionSpec,
  actorRef: AnyActorRef,
  onAction: DeclarativeActionHandler | undefined,
) {
  if (action.type === 'emitEvent') {
    actorRef.send({ type: action.event })
    return
  }

  onAction?.(action)
}

function renderChildNodes(
  nodes: DeclarativeNode[] | undefined,
  actorRef: AnyActorRef,
  components: DeclarativeRendererRegistry | undefined,
  onAction: DeclarativeActionHandler | undefined,
) {
  if (!nodes?.length) return null

  return nodes.map((child, index) => (
    <DeclarativeRenderer
      key={`${('type' in child && child.type) || ('$ref' in child && child.$ref) || 'node'}:${index}`}
      node={child}
      actorRef={actorRef}
      components={components}
      onAction={onAction}
    />
  ))
}

export function DeclarativeRenderer({ node, actorRef, components, onAction }: DeclarativeRendererProps) {
  const snapshot = useSelector(actorRef, state => state)

  if (!('type' in node)) {
    throw new Error('DeclarativeRenderer expects normalized nodes. Resolve $ref values before rendering.')
  }

  if (!isDeclarativeNodeVisible(node, snapshot)) {
    return null
  }

  const enabled = isDeclarativeNodeEnabled(node, snapshot)
  const childContent = renderChildNodes(node.children, actorRef, components, onAction)
  const slotContent = Object.fromEntries(
    Object.entries(node.slots ?? {}).map(([key, value]) => [
      key,
      <DeclarativeRenderer key={key} node={value} actorRef={actorRef} components={components} onAction={onAction} />,
    ]),
  )

  const triggerAction = (name: string, domEvent?: MouseEvent<HTMLElement> | FormEvent<HTMLFormElement>) => {
    if (!enabled) {
      domEvent?.preventDefault()
      return
    }

    const action = node.meta?.on?.[name]
    if (!action) return

    dispatchDeclarativeAction(action, actorRef, onAction)
  }

  const rendererName = node.type === 'component' ? String(node.props?.component ?? '') : node.type
  const renderer = rendererName ? components?.[rendererName] : undefined

  if (renderer) {
    const CustomRenderer = renderer

    return (
      <CustomRenderer
        node={node}
        actorRef={actorRef}
        snapshot={snapshot}
        enabled={enabled}
        slots={slotContent}
        triggerAction={triggerAction}
      >
        {childContent}
      </CustomRenderer>
    )
  }

  switch (node.type) {
    case 'layout':
      return (
        <div
          data-node-type="layout"
          style={{
            display: 'flex',
            flexDirection: node.props?.direction === 'horizontal' ? 'row' : 'column',
            gap:
              typeof node.props?.gap === 'number' || typeof node.props?.gap === 'string' ? node.props.gap : undefined,
          }}
        >
          {childContent}
          {Object.values(slotContent)}
        </div>
      )
    case 'form':
      return (
        <form
          data-node-type="form"
          onSubmit={event => {
            event.preventDefault()
            triggerAction('submit', event)
          }}
        >
          {childContent}
          {Object.values(slotContent)}
        </form>
      )
    case 'field': {
      const label = typeof node.props?.label === 'string' ? node.props.label : undefined
      const name = typeof node.props?.name === 'string' ? node.props.name : undefined
      const readOnly = node.props?.readOnly === true

      return (
        <label data-node-type="field">
          {label ? <span>{label}</span> : null}
          {/* TODO: Replace this uncontrolled fallback with actor-bound field rendering or require a registry renderer for field nodes. */}
          <input name={name} disabled={!enabled} readOnly={readOnly} />
        </label>
      )
    }
    case 'template':
      return <div data-node-type="template">{String(node.props?.template ?? '')}</div>
    case 'component':
      return (
        <button type="button" disabled={!enabled} onClick={event => triggerAction('click', event)}>
          {typeof node.props?.label === 'string' ? node.props.label : String(node.props?.component ?? 'Component')}
        </button>
      )
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `DeclarativeRenderer: Unknown node type "${node.type}". Register a custom renderer or use a built-in type.`,
        )
      }
      return <Fragment />
  }
}

export function DeclarativePageRenderer({ page, actorRef, components, onAction }: DeclarativePageRendererProps) {
  return <DeclarativeRenderer node={page.root} actorRef={actorRef} components={components} onAction={onAction} />
}
