'use client'

import {
  Background,
  type Connection,
  Controls,
  type EdgeTypes,
  Handle,
  MiniMap,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  Position,
  ReactFlow,
  SelectionMode,
  type Viewport,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import * as React from 'react'
import { Icon } from '@/elements/button/Icon'
import { Box } from '@/layouts/box/Box'
import { Flex } from '@/layouts/flex/Flex'
import { Grid } from '@/layouts/grid/Grid'
import { cn } from '@/lib/utils'
import { Text } from '@/typography/text/Text'
import {
  diagrammerCanvasClass,
  diagrammerNodeClass,
  diagrammerNodeDescriptionClass,
  diagrammerNodeHeaderClass,
  diagrammerNodeSelectedClass,
  diagrammerPortClass,
  diagrammerRootClass,
} from './Diagrammer.css'
import {
  applyDiagrammerEdgeChanges,
  applyDiagrammerNodeChanges,
  connectDiagrammerNodes,
  toDiagrammerFlowEdges,
  toDiagrammerFlowNodes,
  updateDiagrammerViewport,
} from './react-flow-model'
import type {
  DiagrammerAdapter,
  DiagrammerDocument,
  DiagrammerFlowEdge,
  DiagrammerFlowNode,
  DiagrammerFlowNodeProps,
  DiagrammerPort,
} from './types'

function mapPortSideToPosition(side: DiagrammerPort['side'] | undefined) {
  switch (side) {
    case 'top':
      return Position.Top
    case 'bottom':
      return Position.Bottom
    case 'left':
      return Position.Left
    default:
      return Position.Right
  }
}

function getPortHandleTypes(direction: DiagrammerPort['direction'] | undefined) {
  if (direction === 'input') return ['target'] as const
  if (direction === 'both') return ['target', 'source'] as const
  return ['source'] as const
}

function getPortHandleStyle(port: DiagrammerPort, ports: DiagrammerPort[]): React.CSSProperties | undefined {
  const side = port.side ?? 'right'
  const portsOnSide = ports.filter(candidate => (candidate.side ?? 'right') === side)
  if (portsOnSide.length <= 1) return undefined

  const portIndex = portsOnSide.indexOf(port)
  const offset = `${((portIndex + 1) / (portsOnSide.length + 1)) * 100}%`

  if (side === 'top' || side === 'bottom') return { left: offset }
  return { top: offset }
}

export function DiagrammerDefaultNode({ data, selected }: DiagrammerFlowNodeProps) {
  const node = data.diagramNode
  const adapter = data.adapter
  const customNode = adapter?.renderNode?.({ node, selected })

  if (customNode) return <>{customNode}</>

  const ports = node.data.ports ?? []

  return (
    <Box className={cn(diagrammerNodeClass, selected && diagrammerNodeSelectedClass)}>
      <Flex align="center" gap="2" className={cn('px-3 py-2.5', diagrammerNodeHeaderClass)}>
        {node.data.icon ? <Icon icon={node.data.icon} size="sm" color={node.data.tone ?? 'neutral'} /> : null}
        <Text weight="medium" truncate title={node.data.label}>
          {node.data.label}
        </Text>
      </Flex>
      {node.data.description || ports.length > 0 ? (
        <Grid gap="2" className="px-3 py-2.5">
          {node.data.description ? (
            <Text size="sm" className={diagrammerNodeDescriptionClass}>
              {node.data.description}
            </Text>
          ) : null}
          {ports.length > 0 ? (
            <Grid gap="1">
              {ports.map(port => (
                <Flex
                  key={port.id}
                  align="center"
                  justify="between"
                  gap="3"
                  className={cn('min-h-6', diagrammerPortClass)}
                >
                  {getPortHandleTypes(port.direction).map(type => (
                    <Handle
                      key={type}
                      id={port.id}
                      type={type}
                      position={mapPortSideToPosition(port.side)}
                      style={getPortHandleStyle(port, ports)}
                    />
                  ))}
                  <Text as="span" size="sm" truncate title={port.label ?? port.id}>
                    {port.label ?? port.id}
                  </Text>
                  <Text as="span" size="sm" className={diagrammerNodeDescriptionClass}>
                    {port.direction ?? 'port'}
                  </Text>
                </Flex>
              ))}
            </Grid>
          ) : null}
        </Grid>
      ) : null}
    </Box>
  )
}

const diagrammerNodeTypes = {
  diagrammer: DiagrammerDefaultNode,
} satisfies NodeTypes

export interface DiagrammerProps<TNodePayload = unknown, TEdgePayload = unknown>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'onChange'> {
  document?: DiagrammerDocument<TNodePayload, TEdgePayload>
  defaultDocument?: DiagrammerDocument<TNodePayload, TEdgePayload>
  adapter?: DiagrammerAdapter<TNodePayload, TEdgePayload>
  nodeTypes?: NodeTypes
  edgeTypes?: EdgeTypes
  readonly?: boolean
  showControls?: boolean
  showMiniMap?: boolean
  fitView?: boolean
  height?: number | string
  onDocumentChange?: (document: DiagrammerDocument<TNodePayload, TEdgePayload>) => void
  onConnect?: (connection: Connection, document: DiagrammerDocument<TNodePayload, TEdgePayload>) => void
}

export function Diagrammer<TNodePayload = unknown, TEdgePayload = unknown>({
  document,
  defaultDocument,
  adapter,
  nodeTypes,
  edgeTypes,
  readonly = false,
  showControls = true,
  showMiniMap = false,
  fitView = true,
  height = 520,
  className,
  style,
  onDocumentChange,
  onConnect,
  ...props
}: DiagrammerProps<TNodePayload, TEdgePayload>) {
  const isControlled = document !== undefined
  const [internalDocument, setInternalDocument] = React.useState<DiagrammerDocument<TNodePayload, TEdgePayload>>(
    () => defaultDocument ?? { version: 1, nodes: [], edges: [] },
  )
  const currentDocument = document ?? internalDocument
  const latestDocumentRef = React.useRef(currentDocument)
  latestDocumentRef.current = currentDocument

  const nodes = React.useMemo(() => toDiagrammerFlowNodes(currentDocument, adapter), [adapter, currentDocument])
  const edges = React.useMemo(() => toDiagrammerFlowEdges(currentDocument, adapter), [adapter, currentDocument])
  const mergedNodeTypes = React.useMemo(() => ({ ...diagrammerNodeTypes, ...nodeTypes }), [nodeTypes])
  const reactFlowDocumentKey = React.useMemo(
    () =>
      JSON.stringify({
        id: currentDocument.id ?? 'diagram',
        nodeIds: currentDocument.nodes.map(node => node.id),
      }),
    [currentDocument.id, currentDocument.nodes],
  )

  const applyDocument = React.useCallback(
    (
      updater:
        | DiagrammerDocument<TNodePayload, TEdgePayload>
        | ((
            previousDocument: DiagrammerDocument<TNodePayload, TEdgePayload>,
          ) => DiagrammerDocument<TNodePayload, TEdgePayload>),
    ) => {
      const previousDocument = latestDocumentRef.current
      const nextDocument = typeof updater === 'function' ? updater(previousDocument) : updater
      latestDocumentRef.current = nextDocument
      if (!isControlled) setInternalDocument(nextDocument)
      onDocumentChange?.(nextDocument)
      return nextDocument
    },
    [isControlled, onDocumentChange],
  )

  const handleNodesChange = React.useCallback<OnNodesChange<DiagrammerFlowNode<TNodePayload>>>(
    changes => {
      if (readonly) return
      applyDocument(previousDocument => applyDiagrammerNodeChanges(previousDocument, changes, adapter))
    },
    [adapter, applyDocument, readonly],
  )

  const handleEdgesChange = React.useCallback<OnEdgesChange<DiagrammerFlowEdge<TEdgePayload>>>(
    changes => {
      if (readonly) return
      applyDocument(previousDocument => applyDiagrammerEdgeChanges(previousDocument, changes, adapter))
    },
    [adapter, applyDocument, readonly],
  )

  const handleConnect = React.useCallback<OnConnect>(
    connection => {
      if (readonly || !connection.source || !connection.target) return
      let connectedDocument: DiagrammerDocument<TNodePayload, TEdgePayload> | null = null
      const nextDocument = applyDocument(previousDocument => {
        if (
          adapter?.validateConnection &&
          !adapter.validateConnection({
            sourceId: connection.source,
            targetId: connection.target,
            sourcePortId: connection.sourceHandle ?? undefined,
            targetPortId: connection.targetHandle ?? undefined,
            document: previousDocument,
          })
        ) {
          return previousDocument
        }

        const updatedDocument = connectDiagrammerNodes(previousDocument, connection)
        if (updatedDocument !== previousDocument) connectedDocument = updatedDocument
        return updatedDocument
      })
      if (connectedDocument) onConnect?.(connection, nextDocument)
    },
    [adapter, applyDocument, onConnect, readonly],
  )

  const handleViewportChange = React.useCallback(
    (viewport: Viewport) => {
      applyDocument(previousDocument => updateDiagrammerViewport(previousDocument, viewport))
    },
    [applyDocument],
  )

  const proOptions = { hideAttribution: true }
  return (
    <Box
      className={cn(diagrammerRootClass, className)}
      radius="lg"
      style={{ height: typeof height === 'number' ? `${height}px` : height, ...style }}
      {...props}
    >
      <ReactFlow
        key={isControlled ? undefined : reactFlowDocumentKey}
        className={diagrammerCanvasClass}
        nodes={isControlled ? nodes : undefined}
        edges={isControlled ? edges : undefined}
        defaultNodes={isControlled ? undefined : nodes}
        defaultEdges={isControlled ? undefined : edges}
        nodeTypes={mergedNodeTypes}
        edgeTypes={edgeTypes}
        fitView={fitView && !currentDocument.viewport}
        defaultViewport={currentDocument.viewport}
        nodesDraggable={!readonly}
        nodesConnectable={!readonly}
        edgesReconnectable={!readonly}
        elementsSelectable
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        panOnScroll
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onViewportChange={handleViewportChange}
        proOptions={proOptions}
      >
        <Background />
        {showMiniMap ? <MiniMap pannable zoomable /> : null}
        {showControls ? <Controls showInteractive={!readonly} /> : null}
      </ReactFlow>
    </Box>
  )
}
