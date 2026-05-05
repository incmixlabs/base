import { createFileRoute } from '@tanstack/react-router'
import { docsMdxComponents } from '../../../mdx-components'
import Content from './schema-contract.mdx'

export const Route = createFileRoute('/docs/autoform/schema-contract')({
  component: SchemaContractPage,
})

function SchemaContractPage() {
  return <Content components={docsMdxComponents} />
}
