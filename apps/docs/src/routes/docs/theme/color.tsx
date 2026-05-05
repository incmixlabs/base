import { createFileRoute } from '@tanstack/react-router'
import { ColorPalette } from '../../../components/ColorPalette'

export const Route = createFileRoute('/docs/theme/color')({
  component: ThemeColorPage,
})

function ThemeColorPage() {
  return <ColorPalette />
}
