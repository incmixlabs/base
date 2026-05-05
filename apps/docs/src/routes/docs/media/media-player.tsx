import { createFileRoute } from '@tanstack/react-router'
import { docsMdxComponents } from '../../../mdx-components'
import Content from './media-player.mdx'

export const Route = createFileRoute('/docs/media/media-player')({
  component: MediaPlayerPage,
})

function MediaPlayerPage() {
  return <Content components={docsMdxComponents} />
}
