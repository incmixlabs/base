import type { TreeDataItem } from './TreeView'

function removeTreeItem(items: TreeDataItem[], itemId: string): [TreeDataItem | null, TreeDataItem[]] {
  const nextItems: TreeDataItem[] = []
  let removed: TreeDataItem | null = null

  for (const item of items) {
    if (item.id === itemId) {
      removed = item
      continue
    }

    if (item.children?.length) {
      const [childRemoved, nextChildren] = removeTreeItem(item.children, itemId)
      if (childRemoved) {
        removed = childRemoved
        nextItems.push({ ...item, children: nextChildren })
        continue
      }
    }

    nextItems.push(item)
  }

  return [removed, nextItems]
}

function findParentId(items: TreeDataItem[], childId: string, parentId: string | null = null): string | null {
  for (const item of items) {
    if (item.id === childId) return parentId
    if (item.children?.length) {
      const found = findParentId(item.children, childId, item.id)
      if (found !== null || item.children.some(child => child.id === childId)) {
        return found
      }
    }
  }
  return null
}

function insertTreeItem(items: TreeDataItem[], targetId: string, itemToInsert: TreeDataItem): TreeDataItem[] {
  return items.map(item => {
    if (item.id === targetId) {
      return { ...item, children: [...(item.children ?? []), itemToInsert] }
    }
    if (item.children?.length) {
      return { ...item, children: insertTreeItem(item.children, targetId, itemToInsert) }
    }
    return item
  })
}

function isDescendant(items: TreeDataItem[], sourceId: string, targetId: string): boolean {
  function findNode(nodes: TreeDataItem[], nodeId: string): TreeDataItem | null {
    for (const node of nodes) {
      if (node.id === nodeId) return node
      if (node.children?.length) {
        const found = findNode(node.children, nodeId)
        if (found) return found
      }
    }
    return null
  }

  function containsNode(node: TreeDataItem, nodeId: string): boolean {
    if (!node.children?.length) return false
    for (const child of node.children) {
      if (child.id === nodeId) return true
      if (containsNode(child, nodeId)) return true
    }
    return false
  }

  const sourceNode = findNode(items, sourceId)
  return sourceNode ? containsNode(sourceNode, targetId) : false
}

function reorderWithinParent(
  items: TreeDataItem[],
  parentId: string | null,
  sourceId: string,
  targetId: string,
): TreeDataItem[] {
  const reorder = (siblings: TreeDataItem[]) => {
    const sourceIndex = siblings.findIndex(item => item.id === sourceId)
    const targetIndex = siblings.findIndex(item => item.id === targetId)

    if (sourceIndex === -1 || targetIndex === -1) return siblings

    const next = [...siblings]
    const [moved] = next.splice(sourceIndex, 1)
    if (!moved) return siblings
    const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex : targetIndex
    next.splice(adjustedTargetIndex, 0, moved)
    return next
  }

  if (parentId === null) return reorder(items)

  return items.map(item => {
    if (item.id === parentId) {
      return { ...item, children: reorder(item.children ?? []) }
    }
    if (item.children?.length) {
      return { ...item, children: reorderWithinParent(item.children, parentId, sourceId, targetId) }
    }
    return item
  })
}

export function moveTreeItem(items: TreeDataItem[], sourceId: string, targetId: string): TreeDataItem[] {
  if (sourceId === targetId) return items
  if (isDescendant(items, sourceId, targetId)) return items

  const sourceParentId = findParentId(items, sourceId)
  const targetParentId = findParentId(items, targetId)

  if (sourceParentId === targetParentId) {
    return reorderWithinParent(items, sourceParentId, sourceId, targetId)
  }

  const [removedItem, withoutSource] = removeTreeItem(items, sourceId)
  if (!removedItem) return items

  return insertTreeItem(withoutSource, targetId, removedItem)
}
