'use client'

import { Heading } from '@incmix/ui/typography/heading/Heading'
import { Text } from '@incmix/ui/typography/text/Text'
import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { ElementDocsPage } from '../../../lib/element-docs-page'
import { loadElementDocsEntry } from '../../../lib/element-docs-registry'
import type { ElementDocsEntry } from '../../../lib/element-docs-types'

export const Route = createFileRoute('/docs/elements/$slug')({
  component: ElementDocsPageRoute,
})

function ElementDocsPageRoute() {
  const { slug } = Route.useParams()
  const [entry, setEntry] = React.useState<ElementDocsEntry | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let active = true

    setIsLoading(true)
    setEntry(null)

    void (async () => {
      try {
        const loadedEntry = await loadElementDocsEntry(slug)
        if (active) {
          setEntry(loadedEntry)
        }
      } catch {
        if (active) {
          setEntry(null)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Heading as="h1" size="2x">
          Loading Element Docs
        </Heading>
        <Text size="md" className="text-muted-foreground">
          Loading documentation for <code>{slug}</code>.
        </Text>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="space-y-3">
        <Heading as="h1" size="2x">
          Element Not Found
        </Heading>
        <Text size="md" className="text-muted-foreground">
          No docs entry exists for <code>{slug}</code>.
        </Text>
      </div>
    )
  }

  return <ElementDocsPage entry={entry} />
}
