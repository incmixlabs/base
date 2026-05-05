export type DeclarativeValue = string | number | boolean | null | DeclarativeObject | DeclarativeValue[]

export type DeclarativeObject = {
  [key: string]: DeclarativeValue | undefined
}

export type QuerySpec = {
  type: 'rest' | 'graphql'
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  params?: Record<string, unknown>
  headers?: Record<string, unknown>
  mapResponse?: string
}

export type ConfirmSpec = {
  title: string
  message: string
  guard?: 'dirty'
  cancelLabel?: string
  confirmLabel?: string
  confirmColor?: string
}

export type ActionSpec =
  | {
      type: 'apiCall'
      method?: QuerySpec['method']
      url?: string
      confirm?: ConfirmSpec
      successEvent?: string
      failureEvent?: string
    }
  | {
      type: 'navigate'
      to: string
      confirm?: ConfirmSpec
      successEvent?: string
      failureEvent?: string
    }
  | {
      type: 'openModal' | 'closeModal'
      confirm?: ConfirmSpec
      successEvent?: string
      failureEvent?: string
    }
  | {
      type: 'emitEvent'
      event: string
      confirm?: ConfirmSpec
      successEvent?: string
      failureEvent?: string
    }

export type PermissionSpec = {
  action: string
  subject: string
  field?: string
  conditions?: Record<string, unknown>
}

export type NodeEventMap = Record<string, ActionSpec>

export type PageWorkflowTransitionSpec = {
  event: string
  from?: string | string[]
  to?: string
  action?: string | ActionSpec
  confirm?: ConfirmSpec
  successEvent?: string
  failureEvent?: string
}

export type PageWorkflowDefinition = {
  transitions: Record<string, PageWorkflowTransitionSpec>
}

export type DeclarativeNodeMeta = {
  on?: NodeEventMap
  enabledWhen?: string
  visibleWhen?: string
  permission?: PermissionSpec
  query?: QuerySpec
  [key: string]: unknown
}

export type DeclarativeNodeBase = {
  props?: Record<string, unknown>
  children?: DeclarativeNode[]
  slots?: Record<string, DeclarativeNode>
  meta?: DeclarativeNodeMeta
}

export type DeclarativeTypedNode = DeclarativeNodeBase & {
  type: string
}

export type DeclarativeRefNode = DeclarativeNodeBase & {
  $ref: string
}

export type DeclarativeNode = DeclarativeTypedNode | DeclarativeRefNode

export type DeclarativeDocument = {
  schemaVersion?: string
  root: DeclarativeNode
  components?: Record<string, DeclarativeNode>
}

export type WidgetDocument = {
  schemaVersion?: string
  kind?: 'widget'
  id: string
  title?: string
  node: DeclarativeNode
  meta?: Record<string, unknown>
}

export type PageAuthoringMetadata = {
  title?: string
  queries?: Record<string, QuerySpec>
  actions?: Record<string, ActionSpec>
  runtime?: PageRuntimeDefinition
  meta?: Record<string, unknown>
}

export type StandalonePageDocument = DeclarativeDocument &
  PageAuthoringMetadata & {
    kind: 'page'
    id: string
  }

export type AppPageDocument = DeclarativeDocument &
  PageAuthoringMetadata & {
    kind?: 'page'
    id?: string
  }

export type PageDocument = StandalonePageDocument

export type PageDocumentId = string

export type PageDocumentRef = `#/pages/${string}`

export type AppRouteDocument = {
  path: string
  page: PageDocumentRef
  id?: string
  title?: string
  meta?: Record<string, unknown>
}

export type AppDocument = {
  schemaVersion?: string
  kind: 'app'
  id?: string
  title?: string
  routes: AppRouteDocument[]
  pages: Record<string, AppPageDocument>
  components?: Record<string, DeclarativeNode>
  meta?: Record<string, unknown>
}

export type NormalizedDeclarativeNode = DeclarativeTypedNode

export type NormalizedDeclarativeDocument = {
  schemaVersion?: string
  root: NormalizedDeclarativeNode
  components?: Record<string, NormalizedDeclarativeNode>
}

export type NormalizedPageDocument = {
  schemaVersion?: string
  kind: 'page'
  id: string
  title?: string
  queries?: Record<string, QuerySpec>
  actions?: Record<string, ActionSpec>
  meta?: Record<string, unknown>
  root: NormalizedDeclarativeNode
  components?: Record<string, NormalizedDeclarativeNode>
  runtime?: NormalizedPageRuntimeDescriptor
}

export type NormalizedAppRoute = {
  path: string
  pageId: PageDocumentId
  id?: string
  title?: string
  meta?: Record<string, unknown>
}

export type NormalizedAppDocument = {
  schemaVersion?: string
  kind: 'app'
  id?: string
  title?: string
  meta?: Record<string, unknown>
  pages: Record<PageDocumentId, NormalizedPageDocument>
  routes: NormalizedAppRoute[]
  components?: Record<string, NormalizedDeclarativeNode>
}

export type PageRuntimeDefinition = {
  loadQuery?: string
  workflow?: PageWorkflowDefinition
}

export type NormalizedPageQueryDescriptor = {
  id: string
  spec: QuerySpec
}

export type NormalizedNodeActionDescriptor = {
  nodePath: string
  trigger: string
  action: ActionSpec
}

export type NormalizedPageWorkflowTransitionDescriptor = Omit<PageWorkflowTransitionSpec, 'action'> & {
  id: string
  action?: ActionSpec
}

export type NormalizedPageRuntimeDescriptor = {
  loadQuery?: NormalizedPageQueryDescriptor
  actions: NormalizedNodeActionDescriptor[]
  workflow?: {
    transitions: NormalizedPageWorkflowTransitionDescriptor[]
  }
}

function deepCloneValue<T>(value: T): T {
  return structuredClone(value)
}

function cloneNode<T extends DeclarativeNode>(node: T): T {
  return {
    ...node,
    props: node.props ? deepCloneValue(node.props) : undefined,
    meta: node.meta ? deepCloneValue(node.meta) : undefined,
    children: node.children?.map(child => cloneNode(child)),
    slots: node.slots
      ? Object.fromEntries(Object.entries(node.slots).map(([key, value]) => [key, cloneNode(value)]))
      : undefined,
  } as T
}

export function resolveDeclarativeRef(ref: string, document: DeclarativeDocument): DeclarativeNode {
  if (!ref.startsWith('#/')) {
    throw new Error(`resolveDeclarativeRef: only local refs are supported, received "${ref}"`)
  }

  const segments = ref.slice(2).split('/').filter(Boolean)

  let current: unknown = document

  for (const segment of segments) {
    if (!current || typeof current !== 'object' || !(segment in current)) {
      throw new Error(`resolveDeclarativeRef: unable to resolve "${ref}"`)
    }

    current = (current as Record<string, unknown>)[segment]
  }

  if (!current || typeof current !== 'object') {
    throw new Error(`resolveDeclarativeRef: "${ref}" did not resolve to a node`)
  }

  return cloneNode(current as DeclarativeNode)
}

export function normalizeDeclarativeNode(
  node: DeclarativeNode,
  document: DeclarativeDocument,
  seen = new Set<string>(),
): DeclarativeNode {
  let current = cloneNode(node)

  if ('$ref' in current) {
    if (seen.has(current.$ref)) {
      throw new Error(`normalizeDeclarativeNode: cyclic $ref detected for "${current.$ref}"`)
    }

    const nextSeen = new Set(seen)
    nextSeen.add(current.$ref)

    const base = normalizeDeclarativeNode(resolveDeclarativeRef(current.$ref, document), document, nextSeen)
    const { $ref: _ignored, ...inline } = current
    const mergedChildren = inline.children ?? base.children
    const mergedSlots = inline.slots ?? base.slots

    current = {
      ...base,
      ...Object.fromEntries(Object.entries(inline).filter(([, value]) => value !== undefined)),
      props: { ...base.props, ...inline.props },
      meta: { ...base.meta, ...inline.meta },
      children: mergedChildren,
      slots: mergedSlots,
    }
  }

  if (current.children) {
    current.children = current.children.map(child => normalizeDeclarativeNode(child, document, new Set(seen)))
  }

  if (current.slots) {
    current.slots = Object.fromEntries(
      Object.entries(current.slots).map(([key, value]) => [
        key,
        normalizeDeclarativeNode(value, document, new Set(seen)),
      ]),
    )
  }

  return current
}

export function normalizeDeclarativeDocument(document: DeclarativeDocument) {
  const normalizedComponents = document.components
    ? Object.fromEntries(
        Object.entries(document.components).map(([key, value]) => [
          key,
          normalizeDeclarativeNode(value, document) as NormalizedDeclarativeNode,
        ]),
      )
    : undefined

  return {
    ...document,
    root: normalizeDeclarativeNode(document.root, document) as NormalizedDeclarativeNode,
    components: normalizedComponents,
  }
}

export function normalizePageDocument(page: StandalonePageDocument): NormalizedPageDocument {
  const normalized = normalizeDeclarativeDocument(page)
  const loadQueryId = page.runtime?.loadQuery
  const loadQuerySpec = loadQueryId ? page.queries?.[loadQueryId] : undefined
  const workflowTransitions = Object.entries(page.runtime?.workflow?.transitions ?? {}).map(([id, transition]) => {
    const resolvedAction =
      typeof transition.action === 'string'
        ? page.actions?.[transition.action]
          ? deepCloneValue(page.actions[transition.action])
          : undefined
        : transition.action
          ? deepCloneValue(transition.action)
          : undefined

    if (typeof transition.action === 'string' && !resolvedAction) {
      throw new Error(`normalizePageDocument: unknown workflow transition action "${transition.action}"`)
    }

    return {
      ...deepCloneValue(transition),
      id,
      action: resolvedAction
        ? {
            ...resolvedAction,
            confirm: transition.confirm ?? resolvedAction.confirm,
            successEvent: transition.successEvent ?? resolvedAction.successEvent,
            failureEvent: transition.failureEvent ?? resolvedAction.failureEvent,
          }
        : undefined,
    }
  })

  if (loadQueryId && !loadQuerySpec) {
    throw new Error(`normalizePageDocument: unknown runtime load query "${loadQueryId}"`)
  }

  const compiledActions: NormalizedNodeActionDescriptor[] = []

  const collectNodeActions = (node: NormalizedDeclarativeNode, nodePath: string) => {
    for (const [trigger, action] of Object.entries(node.meta?.on ?? {})) {
      compiledActions.push({
        nodePath,
        trigger,
        action,
      })
    }

    node.children?.forEach((child, index) => {
      collectNodeActions(child as NormalizedDeclarativeNode, `${nodePath}.children[${index}]`)
    })

    for (const [slotName, slotNode] of Object.entries(node.slots ?? {})) {
      collectNodeActions(slotNode as NormalizedDeclarativeNode, `${nodePath}.slots.${slotName}`)
    }
  }

  collectNodeActions(normalized.root, 'root')
  const loadQuery =
    loadQueryId && loadQuerySpec
      ? {
          id: loadQueryId,
          spec: loadQuerySpec,
        }
      : undefined

  return {
    schemaVersion: page.schemaVersion,
    kind: 'page',
    id: page.id,
    title: page.title,
    queries: page.queries ? deepCloneValue(page.queries) : undefined,
    actions: page.actions ? deepCloneValue(page.actions) : undefined,
    meta: page.meta ? deepCloneValue(page.meta) : undefined,
    root: normalized.root,
    components: normalized.components,
    runtime: {
      loadQuery,
      actions: compiledActions,
      workflow: workflowTransitions.length ? { transitions: workflowTransitions } : undefined,
    },
  }
}

function resolveRoutePageId(route: AppRouteDocument, app: AppDocument) {
  const ref = route.page
  if (!ref.startsWith('#/pages/')) {
    throw new Error(
      `normalizeAppDocument: route "${route.path}" must reference pages via "#/pages/...", received "${ref}"`,
    )
  }

  const pageId = ref.slice('#/pages/'.length)
  if (!pageId || !(pageId in app.pages)) {
    throw new Error(`normalizeAppDocument: route "${route.path}" references unknown page "${ref}"`)
  }

  return pageId
}

export function normalizeAppDocument(app: AppDocument): NormalizedAppDocument {
  const normalizedComponents = app.components
    ? Object.fromEntries(
        Object.entries(app.components).map(([key, value]) => [
          key,
          normalizeDeclarativeNode(value, {
            schemaVersion: app.schemaVersion,
            root: value,
            components: app.components,
          }) as NormalizedDeclarativeNode,
        ]),
      )
    : undefined

  const normalizedPages = Object.fromEntries(
    Object.entries(app.pages).map(([pageId, page]) => {
      const pageWithSharedComponents: StandalonePageDocument = {
        ...page,
        kind: 'page',
        id: page.id ?? pageId,
        components: {
          ...(app.components ?? {}),
          ...(page.components ?? {}),
        },
      }

      return [pageId, normalizePageDocument(pageWithSharedComponents)]
    }),
  )

  const normalizedRoutes = app.routes.map(route => ({
    path: route.path,
    pageId: resolveRoutePageId(route, app),
    ...(route.id !== undefined ? { id: route.id } : {}),
    ...(route.title !== undefined ? { title: route.title } : {}),
    ...(route.meta !== undefined ? { meta: deepCloneValue(route.meta) } : {}),
  }))

  return {
    schemaVersion: app.schemaVersion,
    kind: 'app',
    ...(app.id !== undefined ? { id: app.id } : {}),
    ...(app.title !== undefined ? { title: app.title } : {}),
    ...(app.meta !== undefined ? { meta: deepCloneValue(app.meta) } : {}),
    components: normalizedComponents,
    pages: normalizedPages,
    routes: normalizedRoutes,
  }
}
