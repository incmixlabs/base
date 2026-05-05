import type { DiagrammerDocument } from './types'

export interface DbDiagramNodePayload {
  kind: 'table' | 'domain' | 'enum'
  schema?: string
}

export const sampleDbDiagramDocument: DiagrammerDocument<DbDiagramNodePayload> = {
  version: 1,
  title: 'Commerce schema',
  nodes: [
    {
      id: 'table-users',
      type: 'table',
      position: { x: 80, y: 80 },
      data: {
        label: 'users',
        description: 'Customer identity and profile data',
        icon: 'database',
        tone: 'primary',
        payload: { kind: 'table', schema: 'public' },
        ports: [
          { id: 'id', label: 'id uuid pk', side: 'right', direction: 'output' },
          { id: 'email', label: 'email text unique', side: 'right', direction: 'output' },
        ],
      },
    },
    {
      id: 'table-orders',
      type: 'table',
      position: { x: 430, y: 120 },
      data: {
        label: 'orders',
        description: 'Purchases created by users',
        icon: 'table-2',
        tone: 'secondary',
        payload: { kind: 'table', schema: 'public' },
        ports: [
          { id: 'id', label: 'id uuid pk', side: 'left', direction: 'input' },
          { id: 'user_id', label: 'user_id uuid fk', side: 'left', direction: 'input' },
        ],
      },
    },
    {
      id: 'enum-order-status',
      type: 'enum',
      position: { x: 430, y: 330 },
      data: {
        label: 'order_status',
        description: 'pending, paid, shipped, cancelled',
        icon: 'list-tree',
        tone: 'accent',
        payload: { kind: 'enum' },
      },
    },
  ],
  edges: [
    {
      id: 'users-to-orders',
      type: 'smoothstep',
      source: 'table-users',
      sourcePortId: 'id',
      target: 'table-orders',
      targetPortId: 'user_id',
      data: { label: 'places' },
    },
  ],
}

export interface RulesDiagramNodePayload {
  kind: 'start' | 'condition' | 'action' | 'end'
}

export const sampleRulesDiagramDocument: DiagrammerDocument<RulesDiagramNodePayload> = {
  version: 1,
  title: 'Discount rule',
  nodes: [
    {
      id: 'start',
      position: { x: 80, y: 160 },
      data: {
        label: 'Order received',
        icon: 'play',
        tone: 'success',
        payload: { kind: 'start' },
        ports: [{ id: 'out', label: 'event', side: 'right', direction: 'output' }],
      },
    },
    {
      id: 'condition',
      position: { x: 350, y: 120 },
      data: {
        label: 'Cart total > $500',
        description: 'Condition node; expression editor can become Lexical later.',
        icon: 'git-branch',
        tone: 'warning',
        payload: { kind: 'condition' },
        ports: [
          { id: 'in', label: 'input', side: 'left', direction: 'input' },
          { id: 'yes', label: 'yes', side: 'right', direction: 'output' },
          { id: 'no', label: 'no', side: 'bottom', direction: 'output' },
        ],
      },
    },
    {
      id: 'action',
      position: { x: 680, y: 95 },
      data: {
        label: 'Apply VIP discount',
        icon: 'badge-percent',
        tone: 'primary',
        payload: { kind: 'action' },
        ports: [{ id: 'in', label: 'input', side: 'left', direction: 'input' }],
      },
    },
  ],
  edges: [
    { id: 'start-condition', source: 'start', sourcePortId: 'out', target: 'condition', targetPortId: 'in' },
    {
      id: 'condition-action',
      source: 'condition',
      sourcePortId: 'yes',
      target: 'action',
      targetPortId: 'in',
      data: { label: 'yes' },
    },
  ],
}
