import { createFileRoute } from '@tanstack/react-router'
import { docsMdxComponents } from '../../mdx-components'
import Content from './container-queries.mdx'

export const Route = createFileRoute('/docs/container-queries')({
  component: ContainerQueriesPage,
})

function ContainerQueriesPage() {
  return <Content components={docsMdxComponents} />
}
