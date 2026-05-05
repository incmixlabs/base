import { createFileRoute } from '@tanstack/react-router'
import { docsMdxComponents } from '../../../mdx-components'
import Content from './audit.mdx'

export const Route = createFileRoute('/docs/autoform/audit')({
  component: AuditPage,
})

function AuditPage() {
  return <Content components={docsMdxComponents} />
}
