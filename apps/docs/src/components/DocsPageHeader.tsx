import { Link } from '@bwalkt/ui/typography'
import { Heading } from '@bwalkt/ui/typography/heading/Heading'
import { Text } from '@bwalkt/ui/typography/text/Text'

const REPO_BLOB_BASE_URL = 'https://github.com/bwalkt/autoform/blob/main/'

function toRepoUrl(path: string): string {
  return `${REPO_BLOB_BASE_URL}${path}`
}

export interface DocsPageHeaderProps {
  title: string
  description: string
  sourcePath?: string
  markdownPath?: string
  playgroundUrl?: string
}

export function DocsPageHeader({ title, description, sourcePath, markdownPath, playgroundUrl }: DocsPageHeaderProps) {
  const links = [
    sourcePath ? { label: 'View source', href: toRepoUrl(sourcePath) } : null,
    markdownPath ? { label: 'View as Markdown', href: toRepoUrl(markdownPath) } : null,
    playgroundUrl ? { label: 'View in Playground', href: playgroundUrl } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>

  return (
    <div>
      <Heading as="h1" size="2x" className="font-serif tracking-[-0.02em]">
        {title}
      </Heading>
      <Text size="sm" className="mt-3 text-muted-foreground">
        {description}
      </Text>
      {links.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          {links.map(link => (
            <Link key={link.label} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}
