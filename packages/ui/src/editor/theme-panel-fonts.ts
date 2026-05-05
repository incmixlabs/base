import type { ThemeTypographySlot } from '@/theme/font-sources'
import { TYPOGRAPHY_DEFAULTS } from '@/theme/token-constants'

export const THEME_FONT_GENERIC_FALLBACKS: Record<ThemeTypographySlot, string> = {
  sans: 'ui-sans-serif, system-ui, sans-serif',
  serif: 'ui-serif, Georgia, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
}

export const THEME_FONT_PRESETS: Record<
  ThemeTypographySlot,
  Array<{ id: string; label: string; fontFamily: string; description: string }>
> = {
  sans: [
    {
      id: 'package-sans',
      label: 'Package Sans',
      fontFamily: TYPOGRAPHY_DEFAULTS.fontSans,
      description: 'Geist-backed product sans stack.',
    },
    {
      id: 'system-sans',
      label: 'System Sans',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Helvetica, Arial, ui-sans-serif, system-ui, sans-serif',
      description: 'Platform-native UI sans fallback stack.',
    },
  ],
  serif: [
    {
      id: 'package-serif',
      label: 'Package Serif',
      fontFamily: TYPOGRAPHY_DEFAULTS.fontSerif,
      description: 'Newsreader-backed editorial serif stack.',
    },
    {
      id: 'system-serif',
      label: 'System Serif',
      fontFamily: 'Iowan Old Style, Palatino, "Book Antiqua", Georgia, "Times New Roman", ui-serif, serif',
      description: 'Editorial serif stack without package assets.',
    },
  ],
  mono: [
    {
      id: 'package-mono',
      label: 'Package Mono',
      fontFamily: TYPOGRAPHY_DEFAULTS.fontMono,
      description: 'Default code and diagnostic monospace stack.',
    },
    {
      id: 'system-mono',
      label: 'System Mono',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      description: 'Platform-native monospace stack.',
    },
  ],
}
