import { createFileRoute } from '@tanstack/react-router'
import { docsMdxComponents } from '../../../mdx-components'
import Content from './renderer.mdx'

export const Route = createFileRoute('/docs/autoform/renderer')({
  component: RendererPage,
})

function RendererPage() {
  return <Content components={docsMdxComponents} />
}
