'use client'

import type { TabIconsConfig } from '@/elements/tabs/tab-icons'

export const viewportIcons = {
  position: 'only',
  icons: [
    { value: 'desktop', icon: 'monitor' },
    { value: 'tablet', icon: 'tablet' },
    { value: 'phone', icon: 'smartphone' },
  ],
} satisfies TabIconsConfig
