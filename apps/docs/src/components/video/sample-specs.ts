import type { TimelineSpec } from '@json-render/remotion'

const FPS = 30

export const minimalSpec: TimelineSpec = {
  composition: {
    id: 'minimal',
    fps: FPS,
    width: 1280,
    height: 720,
    durationInFrames: FPS * 10,
  },
  tracks: [{ id: 'main', name: 'Main', type: 'video', enabled: true }],
  clips: [
    {
      id: 'hello',
      trackId: 'main',
      component: 'TitleCard',
      props: {
        title: 'Hello from Remotion',
        subtitle: 'JSON → Video',
        backgroundColor: '#0f172a',
        textColor: '#f8fafc',
      },
      from: 0,
      durationInFrames: FPS * 5,
      transitionIn: { type: 'fade', durationInFrames: FPS },
      transitionOut: { type: 'fade', durationInFrames: FPS },
    },
    {
      id: 'stat',
      trackId: 'main',
      component: 'StatCard',
      props: { value: 42, label: 'The Answer', backgroundColor: '#1e293b' },
      from: FPS * 5,
      durationInFrames: FPS * 5,
      transitionIn: { type: 'slideLeft', durationInFrames: 15 },
    },
  ],
  audio: { tracks: [] },
}

export const dashboardSpec: TimelineSpec = (() => {
  const clipDuration = FPS * 4
  const transitionFrames = FPS / 2

  const clips = [
    {
      id: 'title',
      trackId: 'main',
      component: 'TitleCard',
      props: {
        title: 'Q1 Performance Report',
        subtitle: 'March 2026',
        backgroundColor: '#0f172a',
        textColor: '#f8fafc',
      },
      from: 0,
      durationInFrames: clipDuration,
      transitionIn: { type: 'fade', durationInFrames: transitionFrames },
      transitionOut: { type: 'fade', durationInFrames: transitionFrames },
    },
    {
      id: 'stat-revenue',
      trackId: 'main',
      component: 'StatCard',
      props: {
        value: 2400000,
        label: 'Revenue',
        prefix: '$',
        backgroundColor: '#1e293b',
      },
      from: clipDuration,
      durationInFrames: clipDuration,
      transitionIn: { type: 'slideLeft', durationInFrames: transitionFrames },
      transitionOut: { type: 'fade', durationInFrames: transitionFrames },
    },
    {
      id: 'stat-users',
      trackId: 'main',
      component: 'StatCard',
      props: {
        value: 18500,
        label: 'Active Users',
        backgroundColor: '#172554',
      },
      from: clipDuration * 2,
      durationInFrames: clipDuration,
      transitionIn: { type: 'slideLeft', durationInFrames: transitionFrames },
      transitionOut: { type: 'fade', durationInFrames: transitionFrames },
    },
    {
      id: 'stat-uptime',
      trackId: 'main',
      component: 'StatCard',
      props: {
        value: 99.97,
        label: 'Uptime',
        suffix: '%',
        backgroundColor: '#052e16',
      },
      from: clipDuration * 3,
      durationInFrames: clipDuration,
      transitionIn: { type: 'slideUp', durationInFrames: transitionFrames },
      transitionOut: { type: 'fade', durationInFrames: transitionFrames },
    },
    {
      id: 'split',
      trackId: 'main',
      component: 'SplitScreen',
      props: {
        leftTitle: 'Before',
        rightTitle: 'After',
        leftColor: '#7f1d1d',
        rightColor: '#14532d',
      },
      from: clipDuration * 4,
      durationInFrames: clipDuration,
      transitionIn: { type: 'zoom', durationInFrames: transitionFrames },
      transitionOut: { type: 'fade', durationInFrames: transitionFrames },
    },
    {
      id: 'quote',
      trackId: 'main',
      component: 'QuoteCard',
      props: {
        quote: 'Ship it.',
        author: 'Engineering',
        backgroundColor: '#1e293b',
      },
      from: clipDuration * 5,
      durationInFrames: clipDuration,
      transitionIn: { type: 'fade', durationInFrames: transitionFrames },
      transitionOut: { type: 'fade', durationInFrames: transitionFrames },
    },
    {
      id: 'closing',
      trackId: 'main',
      component: 'TypingText',
      props: {
        text: 'Q1 complete.\n$2.4M revenue | 18.5K users | 99.97% uptime',
        charsPerSecond: 25,
        backgroundColor: '#0f172a',
        textColor: '#22d3ee',
        fontSize: 36,
      },
      from: clipDuration * 6,
      durationInFrames: clipDuration + FPS * 2,
      transitionIn: { type: 'fade', durationInFrames: transitionFrames },
    },
  ]

  const totalFrames = clips.reduce((max, clip) => Math.max(max, clip.from + clip.durationInFrames), 0)

  return {
    composition: {
      id: 'dashboard-report',
      fps: FPS,
      width: 1280,
      height: 720,
      durationInFrames: totalFrames,
    },
    tracks: [
      { id: 'main', name: 'Main', type: 'video', enabled: true },
      { id: 'overlay', name: 'Overlays', type: 'overlay', enabled: true },
    ],
    clips,
    audio: { tracks: [] },
  }
})()
