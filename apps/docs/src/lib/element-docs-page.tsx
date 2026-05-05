'use client'

import { Heading } from '@incmix/ui/typography/heading/Heading'
import { Text } from '@incmix/ui/typography/text/Text'
import { LiveCodeBlock, ThemesPropsTable } from '@/editor/live'
import { DocsPageHeader } from '../components/DocsPageHeader'
import type { ElementDocsEntry } from './element-docs-types'

export function ElementDocsPage({ entry }: { entry: ElementDocsEntry }) {
  return (
    <>
      <DocsPageHeader title={entry.title} description={entry.description} sourcePath={entry.sourcePath} />

      <Heading as="h2" size="lg" id="overview" data-heading className="mt-8">
        Overview
      </Heading>
      <LiveCodeBlock initialCode={entry.overviewCode} scope={entry.runtimeScope ?? {}} />

      <Heading as="h2" size="lg" id="api-reference" data-heading className="mt-10">
        API Reference
      </Heading>
      {entry.apiSections?.length ? (
        entry.apiSections.map((section, index) => (
          <section key={section.id}>
            <Heading as="h3" size="md" id={section.id} data-heading className={index === 0 ? 'mt-6' : 'mt-10'}>
              {section.title}
            </Heading>
            <ThemesPropsTable defs={section.propDefs} />
          </section>
        ))
      ) : (
        <ThemesPropsTable defs={entry.propDefs} />
      )}

      <Heading as="h2" size="lg" id="examples" data-heading className="mt-10">
        Examples
      </Heading>

      {entry.sections.map((section, index) => (
        <section key={section.id}>
          <Heading as="h3" size="md" id={section.id} data-heading className={index === 0 ? 'mt-6' : 'mt-10'}>
            {section.title}
          </Heading>
          <Text size="md" className="mt-2 text-muted-foreground">
            {section.description}
          </Text>
          <LiveCodeBlock
            initialCode={section.code}
            scope={{ ...(entry.runtimeScope ?? {}), ...(section.scope ?? {}) }}
          />
        </section>
      ))}
    </>
  )
}
