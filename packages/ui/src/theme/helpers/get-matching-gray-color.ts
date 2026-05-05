import type { accentColors } from '@/theme/props/color.prop'

type ThemeAccentColor = (typeof accentColors)[number]

export function getMatchingGrayColor(accentColor: ThemeAccentColor) {
  switch (accentColor) {
    case 'tomato':
    case 'red':
    case 'ruby':
    case 'crimson':
    case 'pink':
    case 'plum':
    case 'purple':
    case 'violet':
      return 'mauve'
    case 'iris':
    case 'indigo':
    case 'blue':
    case 'sky':
    case 'cyan':
      return 'slate'
    case 'teal':
    case 'mint':
    case 'green':
      return 'sage'
    case 'lime':
      return 'olive'
    case 'yellow':
    case 'amber':
    case 'orange':
    case 'brown':
    case 'gold':
    case 'bronze':
      return 'sand'
    case 'gray':
      return 'gray'
  }
}
