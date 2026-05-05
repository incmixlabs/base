import { Callout } from '@bwalkt/ui/elements'
import { Heading } from '@bwalkt/ui/typography/heading/Heading'
import { Text } from '@bwalkt/ui/typography/text/Text'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/docs/theming')({
  component: ThemingPage,
})

function ThemingPage() {
  return (
    <div className="docs-prose">
      <Heading as="h1" size="2x">
        Theming
      </Heading>
      <Text size="sm" className="mt-3 text-muted-foreground">
        Themes are configured through a small set of controls: <code className="text-foreground">accentColor</code>,{' '}
        <code className="text-foreground">grayColor</code>, <code className="text-foreground">radius</code>,{' '}
        <code className="text-foreground">scaling</code>, <code className="text-foreground">panelBackground</code>, and
        typography settings for font stacks, responsive profile, and optional font sources.
      </Text>

      <Callout.Root variant="surface" color="warning" className="mt-4">
        <Callout.Text>
          Use themes sparingly. Favor tokens for semantic control, then provide component-level overrides only when
          absolutely necessary.
        </Callout.Text>
      </Callout.Root>

      <Heading as="h2" size="lg" className="mt-10">
        Theme Wrapper
      </Heading>
      <pre className="mt-4 overflow-x-auto rounded-xl border border-border/70 bg-muted/40 p-4 text-sm">
        <code>{`import { Theme } from '@bwalkt/ui'

export default function Themed() {
  return (
    <Theme
      accentColor="teal"
      grayColor="sage"
      radius="lg"
      scaling="105%"
      typography={{
        fontSans: '"Sora", ui-sans-serif, system-ui, sans-serif',
        fontSerif: '"Newsreader Variable", "Newsreader", ui-serif, Georgia, serif',
        responsiveProfile: 'balanced',
        fontSources: {
          sans: { kind: 'css-url', url: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap' },
        },
      }}
    >
      {/* UI */}
    </Theme>
  )
}
`}</code>
      </pre>

      <Heading as="h2" size="lg" className="mt-10">
        Typography Strategy
      </Heading>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-muted-foreground">
        <li>
          Keep docs and product UI body copy in sans by default; reserve serif for display emphasis and editorial
          moments.
        </li>
        <li>Keep code and diagnostics on mono so spacing and scanning stay predictable.</li>
        <li>Use the responsive profile for rhythm and density changes, not as a substitute for font hierarchy.</li>
      </ul>

      <Heading as="h2" size="lg" className="mt-10">
        Font Sources
      </Heading>
      <Text size="sm" className="mt-3 text-muted-foreground">
        ThemePanel now supports three font workflows: preset stacks, external stylesheet URLs, and direct font file URLs
        or uploads for self-hosted previews.
      </Text>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-muted-foreground">
        <li>Use presets when package-owned or system stacks are enough.</li>
        <li>Use stylesheet URLs for hosted providers like Google Fonts or an internal CSS endpoint.</li>
        <li>
          Use file URLs or uploads when previewing self-hosted assets and validating naming, weight, or fallback
          behavior.
        </li>
      </ul>

      <Callout.Root variant="surface" color="info" className="mt-4">
        <Callout.Text>
          Uploaded fonts are useful for editor previews, but large embedded data URLs are a poor production boundary.
          For shipped themes, prefer app-owned hosted font files or versioned external CSS references.
        </Callout.Text>
      </Callout.Root>

      <Heading as="h2" size="lg" className="mt-10">
        Strategy
      </Heading>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-muted-foreground">
        <li>Define one primary theme and one dense theme.</li>
        <li>Keep radius and scaling aligned with product density targets.</li>
        <li>Store overrides in CSS variables for auditability.</li>
        <li>
          Persist typography family stacks with optional font source metadata so runtime can load the referenced assets.
        </li>
      </ul>

      <Heading as="h2" size="lg" className="mt-10">
        Persisted Theme Versioning
      </Heading>
      <Text size="sm" className="mt-3 text-muted-foreground">
        Versioning belongs in the persisted payload, not in the TypeScript type name. Use an unversioned code type like{' '}
        <code className="text-foreground">ThemeContract</code> and put the compatibility marker in{' '}
        <code className="text-foreground">metadata.schemaVersion</code>.
      </Text>
      <Text size="sm" className="mt-3 text-muted-foreground">
        For example, <code className="text-foreground">metadata.schemaVersion = '1.0.0'</code> means schema major
        version <code className="text-foreground">1</code>. Backward-compatible changes can stay in the{' '}
        <code className="text-foreground">1.x.x</code> family. Only incompatible persisted-schema changes should move to
        something like <code className="text-foreground">2.0.0</code>.
      </Text>
      <Text size="sm" className="mt-3 text-muted-foreground">
        Migration logic should read <code className="text-foreground">metadata.schemaVersion</code>, validate that
        payload, and migrate old payloads forward before normal runtime use.
      </Text>
    </div>
  )
}
