import * as React from 'react'
import { cn } from '@/lib/utils'
import type { EditorSizeToken } from './editor.shared.props'
import type { OutlineWrapperProps } from './outline-wrapper.props'
import './outline-wrapper.css'

export type { OutlineWrapperProps } from './outline-wrapper.props'

function toCssUnit(value: EditorSizeToken | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

export const OutlineWrapper = React.forwardRef<HTMLDivElement, OutlineWrapperProps>(
  ({ className, style, enabled = true, boxColor, inlineColor, lineWidth = 1, ...props }, ref) => {
    const outlineStyle: React.CSSProperties = {
      ...style,
      '--outline-width': toCssUnit(lineWidth),
      ...(boxColor ? { '--outline-box-color': boxColor } : {}),
      ...(inlineColor ? { '--outline-inline-color': inlineColor } : {}),
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        data-outline={enabled}
        className={cn('editor-OutlineWrapper', className)}
        style={outlineStyle}
        {...props}
      />
    )
  },
)

OutlineWrapper.displayName = 'OutlineWrapper'
