import * as React from 'react'
import { cn } from '@/lib/utils'
import type { EditorSizeToken } from './editor.shared.props'
import type { EditorGridProps } from './editor-grid.props'
import './editor-grid.css'

export type { EditorGridProps } from './editor-grid.props'

function toCssUnit(value: EditorSizeToken | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

export const EditorGrid = React.forwardRef<HTMLDivElement, EditorGridProps>(
  (
    {
      className,
      style,
      majorCellSize,
      minorCellSize = 24,
      majorEvery = 5,
      majorLineColor,
      minorLineColor,
      lineThickness = 1,
      backgroundColor,
      showMinorGrid = true,
      ...props
    },
    ref,
  ) => {
    const normalizedMajorEvery = Number.isFinite(majorEvery) && majorEvery > 0 ? majorEvery : 5

    const resolvedMajorCellSize =
      majorCellSize !== undefined
        ? majorCellSize
        : typeof minorCellSize === 'number'
          ? minorCellSize * normalizedMajorEvery
          : `calc(${minorCellSize} * ${normalizedMajorEvery})`

    const gridStyle: React.CSSProperties = {
      ...style,
      '--editor-grid-major-size': toCssUnit(resolvedMajorCellSize),
      '--editor-grid-minor-size': toCssUnit(minorCellSize),
      '--editor-grid-line-thickness': toCssUnit(lineThickness),
      ...(majorLineColor ? { '--editor-grid-major-color': majorLineColor } : {}),
      ...(minorLineColor ? { '--editor-grid-minor-color': minorLineColor } : {}),
      ...(backgroundColor ? { '--editor-grid-background': backgroundColor } : {}),
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        data-minor-grid={showMinorGrid}
        className={cn('editor-EditorGrid', className)}
        style={gridStyle}
        {...props}
      />
    )
  },
)

EditorGrid.displayName = 'EditorGrid'
