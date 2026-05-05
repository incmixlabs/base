import type * as React from 'react'
import { type FormFactorProfile, formFactors } from '@/theme/form-factors'
import type { PropDef } from '@/theme/props/prop-def'
import type { EditorGridProps } from './editor-grid.props'
import type { OutlineWrapperProps } from './outline-wrapper.props'

export type FormFactor = FormFactorProfile

export interface FormFactorSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  formFactor?: FormFactor
  contentClassName?: string
  showGridInside?: boolean
  gridProps?: Omit<EditorGridProps, 'children' | 'className'>
  showOutlineInside?: boolean
  outlineProps?: Omit<OutlineWrapperProps, 'children' | 'className' | 'enabled'>
}

export const formFactorSurfacePropDefs = {
  formFactor: { type: 'enum', values: formFactors, default: 'desktop' },
  contentClassName: { type: 'string' },
  showGridInside: { type: 'boolean', default: false },
  showOutlineInside: { type: 'boolean', default: false },
} satisfies {
  formFactor: PropDef<FormFactor>
  contentClassName: PropDef<string>
  showGridInside: PropDef<boolean>
  showOutlineInside: PropDef<boolean>
}
