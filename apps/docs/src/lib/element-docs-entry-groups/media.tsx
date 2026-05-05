'use client'

import { Image } from '@incmix/ui/elements'
import { AspectRatio, Flex, Grid } from '@incmix/ui/layouts'
import { Text } from '@incmix/ui/typography'
import { imageCatalogEntry } from '@/editor/catalog'
import type { ElementDocsEntry } from '../element-docs-types'

export const mediaEntries = {
  image: {
    ...imageCatalogEntry,
    runtimeScope: { AspectRatio, Flex, Grid, Image, Text },
    sections: [
      {
        id: 'fallback-source',
        title: 'Fallback Source',
        description: 'Provide fallbackSrc to recover gracefully when the primary image fails.',
        code: `export default function Example() {
  return (
    <AspectRatio ratio="4/3" className="w-[360px] overflow-hidden rounded-xl border">
      <Image
        src="https://example.com/does-not-exist.jpg"
        fallbackSrc="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
        alt="Fallback source demo"
        className="h-full w-full"
      />
    </AspectRatio>
  )
}`,
      },
      {
        id: 'responsive-sources',
        title: 'Responsive Sources',
        description: 'Use srcSet and sizes together when the image should adapt to different surface widths.',
        code: `export default function Example() {
  const src = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop'
  return (
    <AspectRatio ratio="21/9" className="w-[520px] overflow-hidden rounded-xl border">
      <Image
        src={src + '&w=960&q=80'}
        srcSet={\`\${src}&w=480&q=80 480w, \${src}&w=768&q=80 768w, \${src}&w=960&q=80 960w, \${src}&w=1440&q=80 1440w\`}
        sizes="(min-width: 1280px) 720px, (min-width: 768px) 60vw, 100vw"
        alt="Responsive sample"
        className="h-full w-full"
      />
    </AspectRatio>
  )
}`,
      },
      {
        id: 'object-fit',
        title: 'Object Fit',
        description: 'Use objectFit to decide whether the image crops, contains, or scales down within the frame.',
        code: `export default function Example() {
  const fits = ['cover', 'contain', 'fill', 'none', 'scale-down'] as const
  const src = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'

  return (
    <Grid columns="2" gap="4" style={{ width: 720 }}>
      {fits.map(objectFit => (
        <Flex key={objectFit} direction="column" gap="2">
          <Text size="xs" className="text-muted-foreground">objectFit=&quot;{objectFit}&quot;</Text>
          <AspectRatio ratio="3/2" className="overflow-hidden rounded-xl border bg-muted/30">
            <Image src={src} alt={objectFit + ' sample'} objectFit={objectFit} className="h-full w-full" />
          </AspectRatio>
        </Flex>
      ))}
    </Grid>
  )
}`,
      },
    ],
  },
} as const satisfies Record<string, ElementDocsEntry>
