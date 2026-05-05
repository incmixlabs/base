import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { Avatar } from './Avatar'
import { getAvatarListEntry } from './avatar-list-hover-card.shared'

describe('getAvatarListEntry', () => {
  it('returns null for elements without avatar or hover-card entry data', () => {
    const entry = getAvatarListEntry(<React.Fragment />, 0, 'sm', 'full')

    expect(entry).toBeNull()
  })

  it('preserves an explicit child radius when building avatar entries', () => {
    const entry = getAvatarListEntry(<Avatar name="John Doe" radius="lg" />, 0, 'sm', 'full')

    expect(entry).not.toBeNull()
    expect(entry?.avatar?.radius).toBe('lg')
  })
})
