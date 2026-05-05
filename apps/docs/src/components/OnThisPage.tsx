'use client'

import { Heading } from '@bwalkt/ui/typography/heading/Heading'
import { Text } from '@bwalkt/ui/typography/text/Text'
import { useLocation } from '@tanstack/react-router'
import * as React from 'react'

type TocItem = {
  id: string
  label: string
  level: 'h2' | 'h3'
}

export function OnThisPage() {
  const location = useLocation()
  const [items, setItems] = React.useState<TocItem[]>([])

  React.useEffect(() => {
    let frame = 0

    const collect = () => {
      const root = document.querySelector('[data-docs-content]')
      if (!root) {
        setItems([])
        return
      }

      const headings = Array.from(root.querySelectorAll<HTMLElement>('[data-heading]'))
      setItems(
        headings
          .map(heading => {
            const level = heading.tagName.toLowerCase()
            if ((level !== 'h2' && level !== 'h3') || !heading.id) return null
            return {
              id: heading.id,
              label: heading.textContent?.trim() ?? heading.id,
              level: level as 'h2' | 'h3',
            }
          })
          .filter((item): item is TocItem => item !== null),
      )
    }

    collect()
    const root = document.querySelector('[data-docs-content]')
    const rootElement = root instanceof HTMLElement ? root : null
    const observer = rootElement
      ? new MutationObserver(() => {
          window.cancelAnimationFrame(frame)
          frame = window.requestAnimationFrame(collect)
        })
      : null

    if (observer && rootElement) {
      observer.observe(rootElement, {
        childList: true,
        subtree: true,
        characterData: true,
      })
    }

    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [location.pathname])

  if (items.length === 0) return null

  return (
    <div className="rounded-2xl border border-border/60 bg-[color:var(--surface-default)] p-4">
      <Heading as="h2" size="md">
        On this page
      </Heading>
      <nav className="mt-3">
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className={item.level === 'h3' ? 'pl-4' : undefined}>
              <a
                href={`#${item.id}`}
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Text size="xs" className="mt-3 text-muted-foreground">
        Jump within the current page.
      </Text>
    </div>
  )
}
