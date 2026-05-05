'use client'

import { Renderer, type TimelineSpec } from '@json-render/remotion'
import { Player } from '@remotion/player'

export function VideoPlayer({ spec }: { spec: TimelineSpec }) {
  const composition = spec.composition

  if (!composition) {
    return <p>Invalid timeline spec: missing composition metadata.</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Player
        component={Renderer}
        inputProps={{ spec }}
        durationInFrames={composition.durationInFrames}
        fps={composition.fps}
        compositionWidth={composition.width}
        compositionHeight={composition.height}
        controls
        style={{ width: '100%', maxWidth: composition.width, borderRadius: 8, overflow: 'hidden' }}
      />
      <details style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
        <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>Timeline Spec (JSON)</summary>
        <pre
          style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '1rem',
            borderRadius: 8,
            overflow: 'auto',
            maxHeight: 400,
          }}
        >
          {JSON.stringify(spec, null, 2)}
        </pre>
      </details>
    </div>
  )
}
