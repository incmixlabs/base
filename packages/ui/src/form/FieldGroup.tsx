'use client'

import * as React from 'react'
import { Separator } from '@/elements/separator/Separator'
import { Flex } from '@/layouts/flex/Flex'
import { Grid } from '@/layouts/grid/Grid'
import { cn } from '@/lib/utils'
import type {
  AlignItems,
  FieldGroupLayout,
  GridColumns,
  Radius,
  Responsive,
  Size,
  TextFieldVariant,
} from '@/theme/tokens'
import {
  fieldGroupDescriptionText,
  fieldGroupLabelText,
  fieldGroupRowBase,
  fieldGroupRowDescription,
  fieldGroupRowGapClasses,
  fieldGroupRowResponsive,
  fieldGroupSectionDescription,
  fieldGroupSectionHeader,
  fieldGroupSectionSeparator,
  fieldGroupSideLabelsBase,
} from './FieldGroup.class'
import { FieldGroupProvider } from './FieldGroupContext'
import type { FieldGroupGap } from './field-group.props'

// ============================================================================
// FieldGroup Root Component
// ============================================================================

export interface FieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size to apply to all child form fields */
  size?: Size
  /** Border radius to apply to child form fields */
  radius?: Radius
  /** Variant to apply to all child form fields */
  variant?: TextFieldVariant
  /** Whether child form fields should be disabled */
  disabled?: boolean
  /** Whether child form fields should be read-only */
  readOnly?: boolean
  /** Gap between child elements */
  gap?: FieldGroupGap
  /** Layout mode */
  layout?: FieldGroupLayout
  /** Grid columns (for grid layout) */
  columns?: Responsive<GridColumns>
  /** Alignment for inline layout */
  align?: AlignItems
  /** Children elements */
  children: React.ReactNode
}

const FieldGroupRoot = React.forwardRef<HTMLDivElement, FieldGroupProps>(
  (
    {
      size,
      radius,
      variant,
      disabled,
      readOnly,
      gap = '4',
      layout = 'stacked',
      columns = '2',
      align,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const providerValue = React.useMemo(
      () => ({ size, radius, variant, layout, disabled, readOnly }),
      [disabled, layout, radius, readOnly, size, variant],
    )

    // Stacked layout - vertical flex column (default)
    if (layout === 'stacked') {
      return (
        <FieldGroupProvider value={providerValue}>
          <Flex ref={ref} direction="column" gap={gap} className={className} {...props}>
            {children}
          </Flex>
        </FieldGroupProvider>
      )
    }

    // Inline layout - horizontal flex row
    if (layout === 'inline') {
      return (
        <FieldGroupProvider value={providerValue}>
          <Flex ref={ref} direction="row" wrap="wrap" align={align || 'end'} gap={gap} className={className} {...props}>
            {children}
          </Flex>
        </FieldGroupProvider>
      )
    }

    // Grid layout
    if (layout === 'grid') {
      return (
        <FieldGroupProvider value={providerValue}>
          <Grid ref={ref} columns={columns} gap={gap} className={className} {...props}>
            {children}
          </Grid>
        </FieldGroupProvider>
      )
    }

    // Side-labels layout - vertical stack of self-contained rows
    if (layout === 'side-labels') {
      return (
        <FieldGroupProvider value={providerValue}>
          <Flex ref={ref} direction="column" gap={gap} className={cn(fieldGroupSideLabelsBase, className)} {...props}>
            {children}
          </Flex>
        </FieldGroupProvider>
      )
    }

    // Sectioned layout - vertical flex with sections
    if (layout === 'sectioned') {
      return (
        <FieldGroupProvider value={providerValue}>
          <Flex ref={ref} direction="column" className={className} {...props}>
            {children}
          </Flex>
        </FieldGroupProvider>
      )
    }

    // Fallback to stacked
    return (
      <FieldGroupProvider value={providerValue}>
        <Flex ref={ref} direction="column" gap={gap} className={className} {...props}>
          {children}
        </Flex>
      </FieldGroupProvider>
    )
  },
)

FieldGroupRoot.displayName = 'FieldGroup'

// ============================================================================
// FieldGroup.Section - For sectioned layout
// ============================================================================

export interface FieldGroupSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Whether to show a separator above (default: true). Pass false for the first section. */
  separator?: boolean
  /** Gap between fields in the section */
  gap?: FieldGroupGap
}

const FieldGroupSection = React.forwardRef<HTMLDivElement, FieldGroupSectionProps>(
  ({ title, description, separator = true, gap = '4', className, children, style, ...props }, ref) => (
    <Flex ref={ref} direction="column" className={className} style={style} {...props}>
      {separator && <Separator decorative size="xs" className={fieldGroupSectionSeparator} />}
      {(title || description) && (
        <Flex direction="column" className={fieldGroupSectionHeader}>
          {title && <span className="text-base font-medium text-neutral">{title}</span>}
          {description && (
            <span className={cn(fieldGroupSectionDescription, fieldGroupDescriptionText)}>{description}</span>
          )}
        </Flex>
      )}
      <Flex direction="column" gap={gap}>
        {children}
      </Flex>
    </Flex>
  ),
)

FieldGroupSection.displayName = 'FieldGroup.Section'

// ============================================================================
// FieldGroup.Row - For side-labels layout
// ============================================================================

export interface FieldGroupRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Row label */
  label?: string
  /** Row description */
  description?: string
  /** Gap between fields in the row */
  gap?: FieldGroupGap
}

const FieldGroupRow = React.forwardRef<HTMLDivElement, FieldGroupRowProps>(
  ({ label, description, gap = '4', className, children, style, ...props }, ref) => (
    <div ref={ref} className={cn(fieldGroupRowBase, fieldGroupRowResponsive, className)} style={style} {...props}>
      {/* Label column */}
      <div className="flex flex-col">
        {label && <span className={fieldGroupLabelText}>{label}</span>}
        {description && <span className={cn(fieldGroupRowDescription, fieldGroupDescriptionText)}>{description}</span>}
      </div>
      {/* Content column */}
      <div className={cn('flex flex-col', fieldGroupRowGapClasses[gap])}>{children}</div>
    </div>
  ),
)

FieldGroupRow.displayName = 'FieldGroup.Row'

// ============================================================================
// Compound Export
// ============================================================================

/** FieldGroup export. */
export const FieldGroup = Object.assign(FieldGroupRoot, {
  Section: FieldGroupSection,
  Row: FieldGroupRow,
})
