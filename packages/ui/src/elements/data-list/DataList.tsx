'use client'

import * as React from 'react'
import type { Responsive } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { getTextSizeClasses } from '@/typography/get-text-size-classes'
import { getResponsiveVariantClasses, typographyBreakpointKeys } from '@/typography/responsive'
import {
  dataListItemBase,
  dataListItemByAlign,
  dataListItemByOrientation,
  dataListLabelBase,
  dataListLabelByOrientation,
  dataListRootBase,
  dataListRootByOrientation,
  dataListRootBySize,
  dataListRootByTrim,
  dataListRootSizeResponsive,
  dataListValueBase,
} from './DataList.css'
import type { DataListAlign, DataListOrientation, DataListSize, DataListTrim } from './data-list.props'

// Context for sharing props
interface DataListContextValue {
  orientation: DataListOrientation
}

const DataListContext = React.createContext<DataListContextValue>({
  orientation: 'horizontal',
})

function isCrossAxisAlign(align: DataListAlign): align is Exclude<DataListAlign, 'between'> {
  return align !== 'between'
}

function getDataListSizeClasses(size: Responsive<DataListSize> | undefined): string {
  return getResponsiveVariantClasses(
    size,
    dataListRootBySize,
    dataListRootSizeResponsive,
    'sm',
    typographyBreakpointKeys,
  )
}

// ============================================================================
// Root
// ============================================================================

interface DataListRootProps extends React.HTMLAttributes<HTMLDListElement> {
  /** Size of the data list */
  size?: Responsive<DataListSize>
  /** Orientation of items */
  orientation?: DataListOrientation
  /** Leading trim behavior */
  trim?: DataListTrim
}

const DataListRoot = React.forwardRef<HTMLDListElement, DataListRootProps>(
  ({ size = 'sm', orientation = 'horizontal', trim = 'normal', className, children, ...props }, ref) => {
    const sizeClasses = getDataListSizeClasses(size)
    const textSizeClasses = getTextSizeClasses(size, 'sm')

    return (
      <DataListContext.Provider value={{ orientation }}>
        <dl
          ref={ref}
          className={cn(
            dataListRootBase,
            dataListRootByOrientation[orientation],
            dataListRootByTrim[trim],
            sizeClasses,
            textSizeClasses,
            className,
          )}
          {...props}
        >
          {children}
        </dl>
      </DataListContext.Provider>
    )
  },
)

DataListRoot.displayName = 'DataList.Root'

// ============================================================================
// Item
// ============================================================================

interface DataListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: DataListAlign
}

const DataListItem = React.forwardRef<HTMLDivElement, DataListItemProps>(
  ({ align = 'baseline', className, children, style, ...props }, ref) => {
    const { orientation } = React.useContext(DataListContext)
    const rowAlign = align === 'between' ? align : null
    const itemAlign = isCrossAxisAlign(align) ? align : null
    const rowStyle =
      orientation === 'horizontal' && rowAlign
        ? {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...style,
          }
        : style

    return (
      <div
        ref={ref}
        className={cn(
          dataListItemBase,
          dataListItemByOrientation[orientation],
          itemAlign ? dataListItemByAlign[itemAlign] : null,
          className,
        )}
        style={rowStyle}
        {...props}
      >
        {children}
      </div>
    )
  },
)

DataListItem.displayName = 'DataList.Item'

// ============================================================================
// Label
// ============================================================================

interface DataListLabelProps extends React.HTMLAttributes<HTMLElement> {
  /** Minimum width of the label column */
  minWidth?: string
  /** Width of the label column */
  width?: string
}

const DataListLabel = React.forwardRef<HTMLElement, DataListLabelProps>(
  ({ minWidth, width, className, children, style, ...props }, ref) => {
    const { orientation } = React.useContext(DataListContext)
    const resolvedMinWidth = minWidth ?? width

    return (
      <dt
        ref={ref}
        className={cn(dataListLabelBase, dataListLabelByOrientation[orientation], className)}
        style={resolvedMinWidth ? { ...style, minWidth: resolvedMinWidth } : style}
        {...props}
      >
        {children}
      </dt>
    )
  },
)

DataListLabel.displayName = 'DataList.Label'

// ============================================================================
// Value
// ============================================================================

type DataListValueProps = React.HTMLAttributes<HTMLElement>

const DataListValue = React.forwardRef<HTMLElement, DataListValueProps>(({ className, children, ...props }, ref) => {
  return (
    <dd ref={ref} className={cn(dataListValueBase, className)} {...props}>
      {children}
    </dd>
  )
})

DataListValue.displayName = 'DataList.Value'

// ============================================================================
// Export compound component
// ============================================================================

/** DataList export. */
export const DataList = {
  Root: DataListRoot,
  Item: DataListItem,
  Label: DataListLabel,
  Value: DataListValue,
}

export type DataListProps = {
  Root: typeof DataListRoot
  Item: typeof DataListItem
  Label: typeof DataListLabel
  Value: typeof DataListValue
}
