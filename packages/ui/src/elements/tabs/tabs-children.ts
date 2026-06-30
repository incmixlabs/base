import * as React from 'react'

type StackablePanelProps = {
  __stacked?: boolean
}

export function partitionStackedPanels(children: React.ReactNode, panelType: React.ElementType) {
  const panels: React.ReactNode[] = []
  const nonPanels: React.ReactNode[] = []

  function visit(nodes: React.ReactNode, keyPath = '') {
    React.Children.toArray(nodes).forEach((child, index) => {
      if (!React.isValidElement(child)) {
        nonPanels.push(child)
        return
      }

      const childKey = child.key == null ? String(index) : String(child.key)
      const scopedKey = keyPath ? `${keyPath}/${childKey}` : childKey

      if (child.type === React.Fragment) {
        visit((child.props as { children?: React.ReactNode }).children, scopedKey)
        return
      }

      if (child.type === panelType) {
        panels.push(
          React.cloneElement(child as React.ReactElement<StackablePanelProps>, { __stacked: true, key: scopedKey }),
        )
        return
      }

      nonPanels.push(child)
    })
  }

  visit(children)

  return { panels, nonPanels }
}
