import { createFileRoute } from '@tanstack/react-router'
import { docsMdxComponents } from '../../../mdx-components'
import Content from './schema-ast.mdx'

export const Route = createFileRoute('/docs/autoform/schema-ast')({
  component: SchemaAstPage,
})

function SchemaAstPage() {
  return <Content components={docsMdxComponents} />
}
