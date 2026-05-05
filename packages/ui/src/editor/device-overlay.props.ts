import type * as React from 'react'
import { type FormFactorProfile, formFactors } from '@/theme/form-factors'
import type { PropDef } from '@/theme/props/prop-def'
import type { EditorSizeToken } from './editor.shared.props'
import type { EditorGridProps } from './editor-grid.props'

export type DeviceOverlayType = FormFactorProfile

export interface DeviceOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  device?: DeviceOverlayType
  frameColor?: string
  bezelColor?: string
  overlayTint?: string
  maxWidth?: EditorSizeToken
  contentClassName?: string
  showGridInside?: boolean
  gridProps?: Omit<EditorGridProps, 'children' | 'className'>
}

export const deviceOverlayPropDefs = {
  device: { type: 'enum', values: formFactors, default: 'desktop' },
  frameColor: { type: 'string' },
  bezelColor: { type: 'string' },
  overlayTint: { type: 'string' },
  maxWidth: { type: 'string' },
  contentClassName: { type: 'string' },
  showGridInside: { type: 'boolean', default: false },
} satisfies {
  device: PropDef<DeviceOverlayType>
  frameColor: PropDef<string>
  bezelColor: PropDef<string>
  overlayTint: PropDef<string>
  maxWidth: PropDef<string>
  contentClassName: PropDef<string>
  showGridInside: PropDef<boolean>
}
