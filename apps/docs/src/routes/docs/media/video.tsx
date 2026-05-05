import { createFileRoute } from '@tanstack/react-router'
import { docsMdxComponents } from '../../../mdx-components'
import Content from './video.mdx'

export const Route = createFileRoute('/docs/media/video')({
  component: VideoPage,
})

function VideoPage() {
  return <Content components={docsMdxComponents} />
}
