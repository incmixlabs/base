'use client'

import { ChevronRight } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import {
  treeViewActions,
  treeViewBranchContent,
  treeViewBranchContentClosed,
  treeViewBranchContentInner,
  treeViewBranchContentOpen,
  treeViewChevron,
  treeViewChevronOpen,
  treeViewIcon,
  treeViewIconSizeVariants,
  treeViewIndentGuide,
  treeViewIndentGuideSizeVariants,
  treeViewItemBase,
  treeViewItemSizeVariants,
  treeViewLeafSpacer,
  treeViewRootBase,
} from './tree-view.class'
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
  onContextMenu?: (
    event: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
    item: TreeDataItem,
  ) => void
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
  activeItemId: string | undefined
  onActiveItem: (item: TreeDataItem | undefined) => void
  onSelectChange: (item: TreeDataItem | undefined) => void
  expandedItemIds: string[]
  showIndentGuides: boolean
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
  activeItemId: undefined,
  onActiveItem: () => {},
  onSelectChange: () => {},
  expandedItemIds: [],
  showIndentGuides: true,
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

function canContainTreeItems(item: TreeDataItem) {
  return item.droppable === true || !!item.children?.length
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
  showIndentGuides?: boolean
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
      showIndentGuides = true,
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
    const [activeItemId, setActiveItemId] = React.useState<string | undefined>(initialSelectedItemId)
    const draggedItemRef = React.useRef<TreeDataItem | null>(null)
    const selectedItemId = selectedItemIdProp ?? uncontrolledSelectedItemId

    React.useEffect(() => {
      setActiveItemId(selectedItemId)
    }, [selectedItemId])

    const expandedItemIds = React.useMemo(() => {
      if (expandAll) return collectExpandedIds(data, '', true)
      if (selectedItemId && autoExpandSelected) return collectExpandedIds(data, selectedItemId, false)
      return []
    }, [data, selectedItemId, expandAll, autoExpandSelected])

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem | undefined) => {
        setActiveItemId(item?.id)
        if (selectedItemIdProp === undefined) {
          setUncontrolledSelectedItemId(item?.id)
        }
        onSelectChangeProp?.(item)
      },
      [onSelectChangeProp, selectedItemIdProp],
    )

    const handleActiveItem = React.useCallback((item: TreeDataItem | undefined) => {
      setActiveItemId(item?.id)
    }, [])

    const handleDragStart = React.useCallback((item: TreeDataItem) => {
      draggedItemRef.current = item
      setActiveItemId(undefined)
    }, [])

    const handleDragEnd = React.useCallback(() => {
      draggedItemRef.current = null
      setActiveItemId(undefined)
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
        setActiveItemId(undefined)
      },
      [data, onItemDrag],
    )

    const contextValue = React.useMemo<TreeViewContextValue>(
      () => ({
        size: safeSize,
        selectedItemId,
        activeItemId,
        onActiveItem: handleActiveItem,
        onSelectChange: handleSelectChange,
        expandedItemIds,
        showIndentGuides,
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
        activeItemId,
        handleActiveItem,
        handleSelectChange,
        expandedItemIds,
        showIndentGuides,
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
          className={cn(treeViewRootBase, className)}
          style={{ overflow: scroll, ...style }}
          {...props}
        >
          {items.map(item =>
            canContainTreeItems(item) ? (
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
  const isActive = ctx.activeItemId === item.id
  const isVisuallySelected = isSelected && (!ctx.activeItemId || ctx.activeItemId === ctx.selectedItemId)
  const hasChildren = !!item.children?.length

  const shouldBeOpen = ctx.expandedItemIds.includes(item.id)
  const [isOpen, setIsOpen] = React.useState(shouldBeOpen)
  const [shouldRenderChildren, setShouldRenderChildren] = React.useState(shouldBeOpen)

  React.useEffect(() => {
    if (shouldBeOpen) setShouldRenderChildren(true)
    setIsOpen(shouldBeOpen)
  }, [shouldBeOpen])

  React.useEffect(() => {
    if (isOpen || !shouldRenderChildren) return

    const timeoutId = window.setTimeout(() => setShouldRenderChildren(false), 220)
    return () => window.clearTimeout(timeoutId)
  }, [isOpen, shouldRenderChildren])

  const openBranch = () => {
    setShouldRenderChildren(true)
    setIsOpen(true)
  }

  const closeBranch = () => setIsOpen(false)

  const toggleOpen = () => {
    if (!isOpen) {
      openBranch()
      return
    }
    closeBranch()
  }

  const handleBranchTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (!isOpen) setShouldRenderChildren(false)
  }

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
        className={cn(treeViewItemBase, treeViewItemSizeVariants[ctx.size], item.className)}
        style={{ paddingInlineStart: `calc(0.5rem + ${level} * 1rem)` }}
        data-selected={isVisuallySelected ? '' : undefined}
        data-active={isActive ? '' : undefined}
        data-disabled={item.disabled ? '' : undefined}
        data-drag-over={isDragOver ? '' : undefined}
        data-tree-item-id={item.id}
        onFocus={() => {
          if (item.disabled) return
          ctx.onActiveItem(item)
        }}
        onPointerDown={() => {
          if (item.disabled) return
          ctx.onActiveItem(item)
        }}
        onClick={() => {
          if (item.disabled) return
          ctx.onActiveItem(item)
          toggleOpen()
          ctx.onSelectChange(item)
          item.onClick?.()
        }}
        onContextMenu={e => {
          if (item.disabled) return
          ctx.onActiveItem(item)
          item.onContextMenu?.(e, item)
        }}
        onKeyDown={e => {
          if (item.disabled) return
          if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
            ctx.onActiveItem(item)
            item.onContextMenu?.(e, item)
          } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            ctx.onActiveItem(item)
            toggleOpen()
            ctx.onSelectChange(item)
            item.onClick?.()
          } else if (e.key === 'ArrowRight' && !isOpen) {
            e.preventDefault()
            openBranch()
          } else if (e.key === 'ArrowLeft' && isOpen) {
            e.preventDefault()
            closeBranch()
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
            <ChevronRight
              className={cn(treeViewChevron, treeViewIconSizeVariants[ctx.size], isOpen && treeViewChevronOpen)}
              aria-hidden="true"
            />
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
      {shouldRenderChildren && (
        <div
          role="group"
          aria-hidden={!isOpen}
          className={cn(treeViewBranchContent, isOpen ? treeViewBranchContentOpen : treeViewBranchContentClosed)}
          data-drag-over={isDragOver ? '' : undefined}
          data-state={isOpen ? 'open' : 'closed'}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onTransitionEnd={handleBranchTransitionEnd}
        >
          <div
            className={cn(
              treeViewBranchContentInner,
              ctx.showIndentGuides && treeViewIndentGuide,
              ctx.showIndentGuides && treeViewIndentGuideSizeVariants[ctx.size],
            )}
          >
            {item.children?.map(child =>
              canContainTreeItems(child) ? (
                <TreeViewBranch key={child.id} item={child} level={level + 1} />
              ) : (
                <TreeViewLeaf key={child.id} item={child} level={level + 1} />
              ),
            )}
          </div>
        </div>
      )}
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
  const isActive = ctx.activeItemId === item.id
  const isVisuallySelected = isSelected && (!ctx.activeItemId || ctx.activeItemId === ctx.selectedItemId)

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
      className={cn(treeViewItemBase, treeViewItemSizeVariants[ctx.size], item.className)}
      style={{ paddingInlineStart: `calc(0.5rem + ${level} * 1rem)` }}
      data-selected={isVisuallySelected ? '' : undefined}
      data-active={isActive ? '' : undefined}
      data-disabled={item.disabled ? '' : undefined}
      data-drag-over={isDragOver ? '' : undefined}
      data-tree-item-id={item.id}
      onFocus={() => {
        if (item.disabled) return
        ctx.onActiveItem(item)
      }}
      onPointerDown={() => {
        if (item.disabled) return
        ctx.onActiveItem(item)
      }}
      onClick={() => {
        if (item.disabled) return
        ctx.onActiveItem(item)
        ctx.onSelectChange(item)
        item.onClick?.()
      }}
      onContextMenu={e => {
        if (item.disabled) return
        ctx.onActiveItem(item)
        item.onContextMenu?.(e, item)
      }}
      onKeyDown={e => {
        if (item.disabled) return
        if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
          ctx.onActiveItem(item)
          item.onContextMenu?.(e, item)
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          ctx.onActiveItem(item)
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
          <span className={cn(treeViewLeafSpacer, treeViewIconSizeVariants[ctx.size])} />
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
  const ctx = React.useContext(TreeViewContext)
  let Icon: React.ComponentType<{ className?: string }> | undefined = defaultIcon
  if (isSelected && item.selectedIcon) {
    Icon = item.selectedIcon
  } else if (isOpen && item.openIcon) {
    Icon = item.openIcon
  } else if (item.icon) {
    Icon = item.icon
  }
  return Icon ? <Icon className={cn(treeViewIcon, treeViewIconSizeVariants[ctx.size])} /> : null
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
