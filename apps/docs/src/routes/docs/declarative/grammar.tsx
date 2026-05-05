import { Callout } from '@incmix/ui/elements'
import { Heading } from '@incmix/ui/typography/heading/Heading'
import { Text } from '@incmix/ui/typography/text/Text'
import { createFileRoute } from '@tanstack/react-router'
import { GrammarPreview } from '../../../components/declarative/GrammarPreview'

export const Route = createFileRoute('/docs/declarative/grammar')({
  component: DeclarativeGrammarPage,
})

function DeclarativeGrammarPage() {
  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="2x">
          Declarative Grammar Pressure
        </Heading>
        <Text size="sm" className="mt-2 text-muted-foreground">
          Phase 5 starts by broadening the page grammar before any persistence work. This page shows the concrete shapes
          now covered by the new examples and tests.
        </Text>
      </div>

      <Callout.Root variant="surface" color="info">
        <Callout.Text>
          The goal here is not polished product UI. The goal is to pressure-test authoring and normalized page shapes:
          tabs, view variants, read-only pages, shared shells, slots, and mixed app composition.
        </Callout.Text>
      </Callout.Root>

      <Heading as="h2" size="lg" id="live-examples" data-heading>
        Live Examples
      </Heading>
      <Text size="sm" className="text-muted-foreground">
        These examples are intentionally narrow and utilitarian. The goal is to validate grammar shapes and runtime
        behavior, not present polished product UI.
      </Text>

      <GrammarPreview />
    </div>
  )
}
