'use client'

import { ChevronRight } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import {
  treeViewActions,
  treeViewBranchTransition,
  treeViewBranchVariants,
  treeViewChevron,
  treeViewChevronOpen,
  treeViewIcon,
  treeViewIndentGuide,
  treeViewItemBase,
  treeViewLeafSpacer,
  treeViewRootBase,
  treeViewSizeVars,
} from './TreeView.css'
import { treeViewRootPropDefs } from './tree-view.props'

// ── Types ──

type TreeViewSize = (typeof treeViewRootPropDefs.size.values)[number]

export interface TreeDataItem {
  id: string
  name: string
  icon?: React.ComponentType<{ className?: string }>
  selectedIcon?: React.ComponentType<{ className?: string }>
  openIcon?: React.ComponentType<{ className?: string }>
  children?: TreeDataItem[]
  actions?: React.ReactNode
  onClick?: () => void
  draggable?: boolean
  droppable?: boolean
  disabled?: boolean
  className?: string
}

export interface TreeRenderItemParams {
  item: TreeDataItem
  level: number
  isLeaf: boolean
  isSelected: boolean
  isOpen?: boolean
  hasChildren: boolean
}

// ── Context ──

interface TreeViewContextValue {
  size: TreeViewSize
  selectedItemId: string | undefined
  onSelectChange: (item: TreeDataItem | undefined) => void
  expandedItemIds: string[]
  draggedItemRef: React.RefObject<TreeDataItem | null>
  onDragStart: (item: TreeDataItem) => void
  onDragEnd: () => void
  canDropOnItem: (targetItem: TreeDataItem, draggedItemId?: string | null) => boolean
  onDrop: (targetItem: TreeDataItem, draggedItemId?: string | null) => void
  defaultNodeIcon?: React.ComponentType<{ className?: string }>
  defaultLeafIcon?: React.ComponentType<{ className?: string }>
  renderItem?: (params: TreeRenderItemParams) => React.ReactNode
}

const TreeViewContext = React.createContext<TreeViewContextValue>({
  size: treeViewRootPropDefs.size.default,
  selectedItemId: undefined,
  onSelectChange: () => {},
  expandedItemIds: [],
  draggedItemRef: { current: null },
  onDragStart: () => {},
  onDragEnd: () => {},
  canDropOnItem: () => false,
  onDrop: () => {},
})

// ── Helpers ──

function collectExpandedIds(items: TreeDataItem[] | TreeDataItem, targetId: string, expandAll: boolean): string[] {
  const ids: string[] = []

  function walk(nodes: TreeDataItem[] | TreeDataItem): boolean {
    const list = Array.isArray(nodes) ? nodes : [nodes]
    for (const node of list) {
      ids.push(node.id)
      if (!expandAll && node.id === targetId) return true
      if (node.children && walk(node.children)) {
        if (!expandAll) return true
      }
      if (!expandAll) ids.pop()
    }
    return false
  }

  walk(items)
  return ids
}

function findTreeItemById(items: TreeDataItem[] | TreeDataItem, id: string): TreeDataItem | undefined {
  const list = Array.isArray(items) ? items : [items]
  for (const item of list) {
    if (item.id === id) return item
    if (item.children) {
      const match = findTreeItemById(item.children, id)
      if (match) return match
    }
  }
  return undefined
}

// ── Root ──

export interface TreeViewRootProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TreeDataItem[] | TreeDataItem
  size?: TreeViewSize
  scroll?: 'auto' | 'hidden' | 'visible'
  initialSelectedItemId?: string
  selectedItemId?: string
  onSelectChange?: (item: TreeDataItem | undefined) => void
  expandAll?: boolean
  autoExpandSelected?: boolean
  defaultNodeIcon?: React.ComponentType<{ className?: string }>
  defaultLeafIcon?: React.ComponentType<{ className?: string }>
  onItemDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void
  renderItem?: (params: TreeRenderItemParams) => React.ReactNode
}

const TreeViewRoot = React.forwardRef<HTMLDivElement, TreeViewRootProps>(
  (
    {
      data,
      size = treeViewRootPropDefs.size.default,
      scroll = 'auto',
      initialSelectedItemId,
      selectedItemId: selectedItemIdProp,
      onSelectChange: onSelectChangeProp,
      expandAll = false,
      autoExpandSelected = true,
      defaultNodeIcon,
      defaultLeafIcon,
      onItemDrag,
      renderItem,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const safeSize = (normalizeEnumPropValue(treeViewRootPropDefs.size, size) ??
      treeViewRootPropDefs.size.default) as TreeViewSize

    const [uncontrolledSelectedItemId, setUncontrolledSelectedItemId] = React.useState<string | undefined>(
      initialSelectedItemId,
    )
    const draggedItemRef = React.useRef<TreeDataItem | null>(null)
    const selectedItemId = selectedItemIdProp ?? uncontrolledSelectedItemId

    const expandedItemIds = React.useMemo(() => {
      if (expandAll) return collectExpandedIds(data, '', true)
      if (selectedItemId && autoExpandSelected) return collectExpandedIds(data, selectedItemId, false)
      return []
    }, [data, selectedItemId, expandAll, autoExpandSelected])

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem | undefined) => {
        if (selectedItemIdProp === undefined) {
          setUncontrolledSelectedItemId(item?.id)
        }
        onSelectChangeProp?.(item)
      },
      [onSelectChangeProp, selectedItemIdProp],
    )

    const handleDragStart = React.useCallback((item: TreeDataItem) => {
      draggedItemRef.current = item
    }, [])

    const handleDragEnd = React.useCallback(() => {
      draggedItemRef.current = null
    }, [])

    const canDropOnItem = React.useCallback((targetItem: TreeDataItem, draggedItemId?: string | null) => {
      if (targetItem.disabled || targetItem.droppable === false) return false
      const sourceId = draggedItemId ?? draggedItemRef.current?.id
      return !!sourceId && sourceId !== targetItem.id
    }, [])

    const handleDrop = React.useCallback(
      (targetItem: TreeDataItem, draggedItemId?: string | null) => {
        const source = draggedItemId ? findTreeItemById(data, draggedItemId) : draggedItemRef.current
        if (source && onItemDrag && source.id !== targetItem.id) {
          onItemDrag(source, targetItem)
        }
        draggedItemRef.current = null
      },
      [data, onItemDrag],
    )

    const contextValue = React.useMemo<TreeViewContextValue>(
      () => ({
        size: safeSize,
        selectedItemId,
        onSelectChange: handleSelectChange,
        expandedItemIds,
        draggedItemRef,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        canDropOnItem,
        onDrop: handleDrop,
        defaultNodeIcon,
        defaultLeafIcon,
        renderItem,
      }),
      [
        safeSize,
        selectedItemId,
        handleSelectChange,
        expandedItemIds,
        handleDragStart,
        handleDragEnd,
        canDropOnItem,
        handleDrop,
        defaultNodeIcon,
        defaultLeafIcon,
        renderItem,
      ],
    )

    const items = Array.isArray(data) ? data : [data]

    return (
      <TreeViewContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="tree"
          className={cn(treeViewRootBase, treeViewSizeVars[safeSize], className)}
          style={{ overflow: scroll, ...style }}
          {...props}
        >
          {items.map(item =>
            item.children?.length ? (
              <TreeViewBranch key={item.id} item={item} level={0} />
            ) : (
              <TreeViewLeaf key={item.id} item={item} level={0} />
            ),
          )}
        </div>
      </TreeViewContext.Provider>
    )
  },
)

TreeViewRoot.displayName = 'TreeView.Root'

// ── Branch (node with children) ──

interface TreeViewBranchProps {
  item: TreeDataItem
  level: number
}

function TreeViewBranch({ item, level }: TreeViewBranchProps) {
  const ctx = React.useContext(TreeViewContext)
  const [isDragOver, setIsDragOver] = React.useState(false)
  const isSelected = ctx.selectedItemId === item.id
  const hasChildren = !!item.children?.length

  const shouldBeOpen = ctx.expandedItemIds.includes(item.id)
  const [isOpen, setIsOpen] = React.useState(shouldBeOpen)

  React.useEffect(() => {
    setIsOpen(shouldBeOpen)
  }, [shouldBeOpen])

  const toggleOpen = () => setIsOpen(prev => !prev)

  const handleDragStart = (e: React.DragEvent) => {
    if (!item.draggable || item.disabled) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('text/plain', item.id)
    e.dataTransfer.effectAllowed = 'move'
    ctx.onDragStart(item)
  }

  const activateDropTarget = (e: React.DragEvent) => {
    const draggedItemId = e.dataTransfer.getData('text/plain') || ctx.draggedItemRef.current?.id
    if (ctx.canDropOnItem(item, draggedItemId)) {
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = 'move'
      setIsDragOver(true)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => activateDropTarget(e)

  const handleDragOver = (e: React.DragEvent) => activateDropTarget(e)

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (item.disabled) return
    const draggedItemId = e.dataTransfer.getData('text/plain') || ctx.draggedItemRef.current?.id
    if (!ctx.canDropOnItem(item, draggedItemId)) {
      setIsDragOver(false)
      return
    }
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    ctx.onDrop(item, draggedItemId)
  }

  return (
    <div>
      <div
        role="treeitem"
        aria-expanded={isOpen}
        aria-selected={isSelected}
        tabIndex={isSelected ? 0 : -1}
        className={cn(treeViewItemBase, item.className)}
        style={{ paddingInlineStart: `calc(0.5rem + ${level} * 1rem)` }}
        data-selected={isSelected ? '' : undefined}
        data-disabled={item.disabled ? '' : undefined}
        data-drag-over={isDragOver ? '' : undefined}
        data-tree-item-id={item.id}
        onClick={() => {
          if (item.disabled) return
          toggleOpen()
          ctx.onSelectChange(item)
          item.onClick?.()
        }}
        onKeyDown={e => {
          if (item.disabled) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleOpen()
            ctx.onSelectChange(item)
            item.onClick?.()
          } else if (e.key === 'ArrowRight' && !isOpen) {
            e.preventDefault()
            setIsOpen(true)
          } else if (e.key === 'ArrowLeft' && isOpen) {
            e.preventDefault()
            setIsOpen(false)
          }
        }}
        draggable={!!item.draggable && !item.disabled}
        onDragStart={handleDragStart}
        onDragEnd={ctx.onDragEnd}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {ctx.renderItem ? (
          ctx.renderItem({ item, level, isLeaf: false, isSelected, isOpen, hasChildren })
        ) : (
          <>
            <ChevronRight className={cn(treeViewChevron, isOpen && treeViewChevronOpen)} aria-hidden="true" />
            <TreeViewIcon item={item} isSelected={isSelected} isOpen={isOpen} defaultIcon={ctx.defaultNodeIcon} />
            <span className="truncate flex-1">{item.name}</span>
          </>
        )}
        {item.actions && (
          <span
            role="toolbar"
            className={treeViewActions}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}
          >
            {item.actions}
          </span>
        )}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            key="tree-branch-content"
            role="group"
            variants={treeViewBranchVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={treeViewBranchTransition}
            style={{ overflow: 'hidden' }}
            data-drag-over={isDragOver ? '' : undefined}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={treeViewIndentGuide}>
              {item.children?.map(child =>
                child.children?.length ? (
                  <TreeViewBranch key={child.id} item={child} level={level + 1} />
                ) : (
                  <TreeViewLeaf key={child.id} item={child} level={level + 1} />
                ),
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Leaf (no children) ──

interface TreeViewLeafProps {
  item: TreeDataItem
  level: number
}

function TreeViewLeaf({ item, level }: TreeViewLeafProps) {
  const ctx = React.useContext(TreeViewContext)
  const [isDragOver, setIsDragOver] = React.useState(false)
  const isSelected = ctx.selectedItemId === item.id

  const handleDragStart = (e: React.DragEvent) => {
    if (!item.draggable || item.disabled) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('text/plain', item.id)
    e.dataTransfer.effectAllowed = 'move'
    ctx.onDragStart(item)
  }

  const activateDropTarget = (e: React.DragEvent) => {
    const draggedItemId = e.dataTransfer.getData('text/plain') || ctx.draggedItemRef.current?.id
    if (ctx.canDropOnItem(item, draggedItemId)) {
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = 'move'
      setIsDragOver(true)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => activateDropTarget(e)

  const handleDragOver = (e: React.DragEvent) => activateDropTarget(e)

  const handleDragLeave = () => setIsDragOver(false)

  const handleDrop = (e: React.DragEvent) => {
    if (item.disabled) return
    const draggedItemId = e.dataTransfer.getData('text/plain') || ctx.draggedItemRef.current?.id
    if (!ctx.canDropOnItem(item, draggedItemId)) {
      setIsDragOver(false)
      return
    }
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    ctx.onDrop(item, draggedItemId)
  }

  return (
    <div
      role="treeitem"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      className={cn(treeViewItemBase, item.className)}
      style={{ paddingInlineStart: `calc(0.5rem + ${level} * 1rem)` }}
      data-selected={isSelected ? '' : undefined}
      data-disabled={item.disabled ? '' : undefined}
      data-drag-over={isDragOver ? '' : undefined}
      data-tree-item-id={item.id}
      onClick={() => {
        if (item.disabled) return
        ctx.onSelectChange(item)
        item.onClick?.()
      }}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && !item.disabled) {
          e.preventDefault()
          ctx.onSelectChange(item)
          item.onClick?.()
        }
      }}
      draggable={!!item.draggable && !item.disabled}
      onDragStart={handleDragStart}
      onDragEnd={ctx.onDragEnd}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {ctx.renderItem ? (
        ctx.renderItem({ item, level, isLeaf: true, isSelected: isSelected, hasChildren: false })
      ) : (
        <>
          <span className={treeViewLeafSpacer} />
          <TreeViewIcon item={item} isSelected={isSelected} defaultIcon={ctx.defaultLeafIcon} />
          <span className="truncate flex-1">{item.name}</span>
        </>
      )}
      {item.actions && (
        <span
          role="toolbar"
          className={treeViewActions}
          onClick={e => e.stopPropagation()}
          onKeyDown={e => e.stopPropagation()}
        >
          {item.actions}
        </span>
      )}
    </div>
  )
}

// ── Icon helper ──

function TreeViewIcon({
  item,
  isOpen,
  isSelected,
  defaultIcon,
}: {
  item: TreeDataItem
  isOpen?: boolean
  isSelected?: boolean
  defaultIcon?: React.ComponentType<{ className?: string }>
}) {
  let Icon: React.ComponentType<{ className?: string }> | undefined = defaultIcon
  if (isSelected && item.selectedIcon) {
    Icon = item.selectedIcon
  } else if (isOpen && item.openIcon) {
    Icon = item.openIcon
  } else if (item.icon) {
    Icon = item.icon
  }
  return Icon ? <Icon className={treeViewIcon} /> : null
}

// ── Compound export ──

export const TreeView = {
  Root: TreeViewRoot,
}

export namespace TreeViewProps {
  export type Root = TreeViewRootProps
  export type Size = TreeViewSize
}

export type { TreeViewSize }
