import { createFileRoute } from '@tanstack/react-router'
import { docsMdxComponents } from '../../../mdx-components'
import Content from './overview.mdx'

export const Route = createFileRoute('/docs/views/overview')({
  component: ViewsOverviewPage,
})

function ViewsOverviewPage() {
  return <Content components={docsMdxComponents} />
}
