import { baseUnoConfig } from '@incmix/config/uno.config'
import { defineConfig } from 'unocss'

export default defineConfig({
  ...baseUnoConfig,
  content: {
    filesystem: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './docs/**/*.{js,ts,jsx,tsx,mdx}'],
  },
  theme: {
    ...baseUnoConfig.theme,
  },
})
