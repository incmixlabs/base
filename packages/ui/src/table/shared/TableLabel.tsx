'use client'

import type * as React from 'react'
import { Badge, type BadgeProps } from '@/elements/badge/Badge'
import type { TableSize } from '@/table/basic/Table'
import { Text } from '@/typography'

const tableLabelBadgeSizeByTableSize: Record<TableSize, NonNullable<BadgeProps['size']>> = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
}

const tableLabelTextSizeByTableSize: Record<TableSize, 'xs' | 'sm' | 'md'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
}

export interface TableLabelProps {
  color?: BadgeProps['color']
  variant?: BadgeProps['variant']
  size?: TableSize
  children: React.ReactNode
}

export function TableLabel({ color = 'slate', variant = 'solid', size = 'sm', children }: TableLabelProps) {
  return (
    <Badge
      color={color}
      variant={variant}
      size={tableLabelBadgeSizeByTableSize[size]}
      radius="none"
      hover={false}
      className="absolute inset-0 w-full items-center justify-center rounded-none"
      style={{ height: '100%', paddingBlock: 0 }}
    >
      <Text
        as="span"
        size={tableLabelTextSizeByTableSize[size]}
        weight="medium"
        align="center"
        wrap="nowrap"
        highContrast
      >
        {children}
      </Text>
    </Badge>
  )
}
