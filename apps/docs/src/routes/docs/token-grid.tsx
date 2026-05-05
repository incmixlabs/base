import { createFileRoute } from '@tanstack/react-router'
import { TokenGrid } from '../../components/TokenGrid'

export const Route = createFileRoute('/docs/token-grid')({
  component: TokenGridPage,
})

function TokenGridPage() {
  return <TokenGrid />
}
