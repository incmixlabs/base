import { createFileRoute } from '@tanstack/react-router'
import { docsMdxComponents } from '../../../mdx-components'
import Content from './runtime.mdx'

export const Route = createFileRoute('/docs/autoform/runtime')({
  component: RuntimePage,
})

function RuntimePage() {
  return <Content components={docsMdxComponents} />
}
