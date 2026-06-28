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
  dataListItemGapBySize,
  dataListItemGapResponsive,
  dataListLabelBase,
  dataListLabelByOrientation,
  dataListLabelMinWidthBySize,
  dataListLabelMinWidthResponsive,
  dataListRootBase,
  dataListRootByOrientation,
  dataListRootBySize,
  dataListRootByTrim,
  dataListRootContainer,
  dataListRootSizeResponsive,
  dataListValueBase,
} from './data-list.class'
import type { DataListAlign, DataListOrientation, DataListSize, DataListTrim } from './data-list.props'

// Context for sharing props
interface DataListContextValue {
  orientation: DataListOrientation
  size: Responsive<DataListSize>
}

const DataListContext = React.createContext<DataListContextValue>({
  orientation: 'horizontal',
  size: 'sm',
})

function getDataListSizeClasses(size: Responsive<DataListSize> | undefined): string {
  return getResponsiveVariantClasses(
    size,
    dataListRootBySize,
    dataListRootSizeResponsive,
    'sm',
    typographyBreakpointKeys,
  )
}

function getDataListItemGapClasses(size: Responsive<DataListSize> | undefined): string {
  return getResponsiveVariantClasses(
    size,
    dataListItemGapBySize,
    dataListItemGapResponsive,
    'sm',
    typographyBreakpointKeys,
  )
}

function getDataListLabelMinWidthClasses(size: Responsive<DataListSize> | undefined): string {
  return getResponsiveVariantClasses(
    size,
    dataListLabelMinWidthBySize,
    dataListLabelMinWidthResponsive,
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
  ({ size = 'sm', orientation = 'horizontal', trim = 'normal', className, children, style, ...props }, ref) => {
    const sizeClasses = getDataListSizeClasses(size)
    const textSizeClasses = getTextSizeClasses(size, 'sm')

    return (
      <DataListContext.Provider value={{ orientation, size }}>
        <div className={cn(dataListRootContainer, className)} style={style}>
          <dl
            ref={ref}
            data-slot="data-list-root"
            className={cn(
              dataListRootBase,
              dataListRootByOrientation[orientation],
              dataListRootByTrim[trim],
              sizeClasses,
              textSizeClasses,
            )}
            {...props}
          >
            {children}
          </dl>
        </div>
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
    const { orientation, size } = React.useContext(DataListContext)
    const shouldJustifyBetween = orientation === 'horizontal' && align === 'between'
    const itemAlign: Exclude<DataListAlign, 'between'> = align === 'between' ? 'center' : align
    const itemGapClasses = orientation === 'horizontal' ? getDataListItemGapClasses(size) : null
    const rowStyle = shouldJustifyBetween
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
        data-slot="data-list-item"
        className={cn(
          dataListItemBase,
          dataListItemByOrientation[orientation],
          itemGapClasses,
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
    const { orientation, size } = React.useContext(DataListContext)
    const resolvedMinWidth = minWidth ?? width
    const labelSizeClasses = orientation === 'horizontal' ? getDataListLabelMinWidthClasses(size) : null

    return (
      <dt
        ref={ref}
        data-slot="data-list-label"
        className={cn(
          dataListLabelBase,
          orientation === 'vertical' ? dataListLabelByOrientation.vertical : labelSizeClasses,
          className,
        )}
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
    <dd ref={ref} data-slot="data-list-value" className={cn(dataListValueBase, className)} {...props}>
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
