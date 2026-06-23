import { baseUnoConfig } from '@incmix/config/uno.config'
import { defineConfig } from 'unocss'

export default defineConfig({
  ...baseUnoConfig,
  content: {
    filesystem: [
      './.storybook/**/*.{ts,tsx}',
      '../../packages/ui/src/**/*.{ts,tsx,mdx}',
      '../../packages/ajv/stories/**/*.{ts,tsx}',
    ],
  },
  theme: {
    ...baseUnoConfig.theme,
  },
})
