import type { Meta, StoryObj } from '@storybook/react-vite'
import { MediaPlayer } from './MediaPlayer'

const meta: Meta<typeof MediaPlayer.Root> = {
  title: 'Elements/MediaPlayer',
  component: MediaPlayer.Root,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A compound video/audio player with seek, volume, captions, playback speed, fullscreen, PiP, and settings controls. Built on media-chrome for state management.',
      },
    },
  },
  decorators: [
    (Story, context) => (
      <div
        className={[
          'box-border flex w-full justify-center bg-light-soft dark:bg-dark-soft',
          context.viewMode === 'docs' ? 'p-4' : 'min-h-screen items-start p-8',
        ].join(' ')}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Default — video with full controls
// ============================================================================

const VIDEO_SRC = 'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4'

export const Default: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <MediaPlayer.Root>
        <MediaPlayer.Video src={VIDEO_SRC} playsInline preload="metadata" />
        <MediaPlayer.Loading />
        <MediaPlayer.Error />
        <MediaPlayer.ControlsOverlay />
        <MediaPlayer.Controls>
          <MediaPlayer.Play />
          <MediaPlayer.SeekBackward />
          <MediaPlayer.SeekForward />
          <MediaPlayer.Time />
          <MediaPlayer.Seek className="flex-1" />
          <MediaPlayer.Volume />
          <MediaPlayer.Fullscreen />
        </MediaPlayer.Controls>
      </MediaPlayer.Root>
    </div>
  ),
}

// ============================================================================
// Minimal — play + seek only
// ============================================================================

export const Minimal: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <MediaPlayer.Root>
        <MediaPlayer.Video src={VIDEO_SRC} playsInline preload="metadata" />
        <MediaPlayer.ControlsOverlay />
        <MediaPlayer.Controls>
          <MediaPlayer.Play />
          <MediaPlayer.Seek withTime className="flex-1" />
        </MediaPlayer.Controls>
      </MediaPlayer.Root>
    </div>
  ),
}

export const DockedControls: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <MediaPlayer.Root>
        <MediaPlayer.Video src={VIDEO_SRC} playsInline preload="metadata" />
        <MediaPlayer.Loading />
        <MediaPlayer.Error />
        <MediaPlayer.Controls placement="docked" showPlaybackSpeed />
      </MediaPlayer.Root>
    </div>
  ),
}

// ============================================================================
// With Settings
// ============================================================================

export const WithSettings: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <MediaPlayer.Root>
        <MediaPlayer.Video src={VIDEO_SRC} playsInline preload="metadata" />
        <MediaPlayer.Loading />
        <MediaPlayer.Error />
        <MediaPlayer.ControlsOverlay />
        <MediaPlayer.Controls>
          <MediaPlayer.Play />
          <MediaPlayer.Time />
          <MediaPlayer.Seek className="flex-1" />
          <MediaPlayer.Volume expandable />
          <MediaPlayer.PlaybackSpeed />
          <MediaPlayer.Loop />
          <MediaPlayer.PiP />
          <MediaPlayer.Fullscreen />
          <MediaPlayer.Settings />
        </MediaPlayer.Controls>
      </MediaPlayer.Root>
    </div>
  ),
}

// ============================================================================
// Auto-hide controls
// ============================================================================

export const AutoHide: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <MediaPlayer.Root autoHide>
        <MediaPlayer.Video src={VIDEO_SRC} playsInline preload="metadata" />
        <MediaPlayer.Loading />
        <MediaPlayer.ControlsOverlay />
        <MediaPlayer.Controls>
          <MediaPlayer.Play />
          <MediaPlayer.Time />
          <MediaPlayer.Seek className="flex-1" />
          <MediaPlayer.Volume />
          <MediaPlayer.Fullscreen />
        </MediaPlayer.Controls>
      </MediaPlayer.Root>
    </div>
  ),
}
