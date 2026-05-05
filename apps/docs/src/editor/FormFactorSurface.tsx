import * as React from 'react'
import { cn } from '@/lib/utils'
import { EditorGrid } from './EditorGrid'
import type { FormFactorSurfaceProps } from './form-factor-surface.props'
import { OutlineWrapper } from './OutlineWrapper'
import './form-factor-surface.css'

export type { FormFactor, FormFactorSurfaceProps } from './form-factor-surface.props'

export const FormFactorSurface = React.forwardRef<HTMLDivElement, FormFactorSurfaceProps>(
  (
    {
      className,
      children,
      formFactor = 'desktop',
      contentClassName,
      showGridInside = false,
      gridProps,
      showOutlineInside = false,
      outlineProps,
      ...props
    },
    ref,
  ) => {
    const outlined = showOutlineInside ? (
      <OutlineWrapper {...outlineProps} enabled className="editor-FormFactorSurface__outline">
        {children}
      </OutlineWrapper>
    ) : (
      children
    )

    const content = showGridInside ? (
      <EditorGrid {...gridProps} className="editor-FormFactorSurface__grid">
        {outlined}
      </EditorGrid>
    ) : (
      outlined
    )

    return (
      <div ref={ref} data-form-factor={formFactor} className={cn('editor-FormFactorSurface', className)} {...props}>
        <div className={cn('editor-FormFactorSurface__content', contentClassName)}>{content}</div>
      </div>
    )
  },
)

FormFactorSurface.displayName = 'FormFactorSurface'
