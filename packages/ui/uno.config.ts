import { baseUnoConfig } from '@incmix/config/uno.config'
import { defineConfig } from 'unocss'
import {
  avatarGroupOverflowStackMarginBySize,
  avatarGroupSpreadBySize,
  avatarGroupStackBySize,
  avatarListItemBase,
  avatarListItemBySize,
  avatarPresenceBusyLineBySize,
  avatarPresenceBySize,
  avatarSizeBySize,
} from './src/elements/avatar/avatar.class'

const splitClasses = (values: string[]) => values.flatMap(value => value.split(/\s+/))

export default defineConfig({
  ...baseUnoConfig,
  content: {
    filesystem: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './docs/**/*.{js,ts,jsx,tsx,mdx}'],
  },
  theme: {
    ...baseUnoConfig.theme,
  },
  safelist: [
    ...(baseUnoConfig.safelist ?? []),
    ...splitClasses([
      ...Object.values(avatarSizeBySize),
      ...Object.values(avatarPresenceBySize),
      ...Object.values(avatarPresenceBusyLineBySize),
      ...Object.values(avatarGroupStackBySize),
      ...Object.values(avatarGroupSpreadBySize),
      ...Object.values(avatarGroupOverflowStackMarginBySize),
      avatarListItemBase,
      ...Object.values(avatarListItemBySize),
    ]),
  ],
})
