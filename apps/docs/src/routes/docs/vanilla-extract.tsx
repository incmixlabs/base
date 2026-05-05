import { createFileRoute } from '@tanstack/react-router'
import { docsMdxComponents } from '../../mdx-components'
import Content from './vanilla-extract.mdx'

export const Route = createFileRoute('/docs/vanilla-extract')({
  component: VanillaExtractPage,
})

function VanillaExtractPage() {
  return <Content components={docsMdxComponents} />
}
