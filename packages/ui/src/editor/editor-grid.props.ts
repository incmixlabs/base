import type * as React from 'react'
import type { PropDef } from '@/theme/props/prop-def'
import type { EditorSizeToken } from './editor.shared.props'

export interface EditorGridProps extends React.HTMLAttributes<HTMLDivElement> {
  majorCellSize?: EditorSizeToken
  minorCellSize?: EditorSizeToken
  majorEvery?: number
  majorLineColor?: string
  minorLineColor?: string
  lineThickness?: EditorSizeToken
  backgroundColor?: string
  showMinorGrid?: boolean
}

export const editorGridPropDefs = {
  majorCellSize: { type: 'string' },
  minorCellSize: { type: 'string', default: '24' },
  majorEvery: { type: 'number', default: 5 },
  majorLineColor: { type: 'string' },
  minorLineColor: { type: 'string' },
  lineThickness: { type: 'string', default: '1' },
  backgroundColor: { type: 'string' },
  showMinorGrid: { type: 'boolean', default: true },
} satisfies {
  majorCellSize: PropDef<string>
  minorCellSize: PropDef<string>
  majorEvery: PropDef<number>
  majorLineColor: PropDef<string>
  minorLineColor: PropDef<string>
  lineThickness: PropDef<string>
  backgroundColor: PropDef<string>
  showMinorGrid: PropDef<boolean>
}
