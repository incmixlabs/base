'use client'

import * as React from 'react'
import { type TreeDataItem, TreeView, type TreeViewRootProps } from './TreeView'

export interface TreeViewWrapperProps extends Omit<TreeViewRootProps, 'data'> {
  data: TreeDataItem[]
}

export function TreeViewWrapper({ data, ...rootProps }: TreeViewWrapperProps) {
  const duplicateId = React.useMemo(() => {
    const seen = new Set<string>()
    function walk(items: TreeDataItem[]): string | null {
      for (const item of items) {
        if (seen.has(item.id)) return item.id
        seen.add(item.id)
        if (item.children) {
          const dup = walk(item.children)
          if (dup) return dup
        }
      }
      return null
    }
    return walk(data)
  }, [data])

  if (duplicateId) {
    throw new Error(`TreeViewWrapper data ids must be unique. Duplicate id: "${duplicateId}"`)
  }

  return <TreeView.Root data={data} {...rootProps} />
}

TreeViewWrapper.displayName = 'TreeViewWrapper'
