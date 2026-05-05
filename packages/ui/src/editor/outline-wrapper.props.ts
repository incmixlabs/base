import type * as React from 'react'
import type { PropDef } from '@/theme/props/prop-def'
import type { EditorSizeToken } from './editor.shared.props'

export interface OutlineWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  enabled?: boolean
  boxColor?: string
  inlineColor?: string
  lineWidth?: EditorSizeToken
}

export const outlineWrapperPropDefs = {
  enabled: { type: 'boolean', default: true },
  boxColor: { type: 'string' },
  inlineColor: { type: 'string' },
  lineWidth: { type: 'string', default: '1' },
} satisfies {
  enabled: PropDef<boolean>
  boxColor: PropDef<string>
  inlineColor: PropDef<string>
  lineWidth: PropDef<string>
}
