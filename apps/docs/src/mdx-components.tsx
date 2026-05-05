'use client'

import { Badge, Callout } from '@incmix/ui/elements'
import { Code } from '@incmix/ui/typography'
import { Heading } from '@incmix/ui/typography/heading/Heading'
import { Text } from '@incmix/ui/typography/text/Text'
import type * as React from 'react'
import { LiveCodeBlock, ThemesPropsTable } from '@/editor/live'
import { ViewportPreview } from '@/editor/live/ViewportPreview'

function mergeClassName(base: string, extra?: string) {
  return extra ? `${base} ${extra}` : base
}

type MDXComponents = Record<string, React.ComponentType<any>>

export const docsMdxComponents: MDXComponents = {
  h1: props => <Heading as="h1" size="2x" {...props} />,
  h2: props => <Heading as="h2" size="lg" className={mergeClassName('mt-10', props.className)} {...props} />,
  h3: props => <Heading as="h3" size="md" className={mergeClassName('mt-6', props.className)} {...props} />,
  p: props => <Text size="sm" className={mergeClassName('mt-3 text-muted-foreground', props.className)} {...props} />,
  a: props => <a {...props} className={mergeClassName('font-inherit text-inherit underline', props.className)} />,
  code: props => <Code {...props} />,
  pre: props => (
    <pre
      {...props}
      className={mergeClassName(
        'mt-4 overflow-x-auto rounded-xl border border-border/70 bg-muted/40 p-4 text-sm',
        props.className,
      )}
    />
  ),
  Callout: Callout.Root,
  Badge,
  LiveCodeBlock,
  ThemesPropsTable,
  ViewportPreview,
}
