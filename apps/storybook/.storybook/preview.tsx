import type { Preview } from '@storybook/react-vite'
import { OutlineWrapper } from '../../../packages/ui/src/editor/OutlineWrapper'
import { Theme } from '../../../packages/ui/src/theme/ThemeProvider'
import './preview.css'
import '../../../packages/ui/src/theme/chart-tokens.css'
import '../../../packages/ui/src/theme/typography-tokens.css'

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global color mode for stories',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    outline: {
      name: 'Outline',
      description: 'Show component outlines in stories',
      defaultValue: false,
      toolbar: {
        icon: 'outline',
        items: [
          { value: 'off', title: 'Outline Off' },
          { value: 'on', title: 'Outline On' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === 'dark'
      const hasOutline = context.globals.outline === 'on'
      const disableGlobalTheme = context.parameters?.disableGlobalTheme === true
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark)
        document.body.classList.toggle('dark', isDark)
        document.body.classList.toggle('sb-outline', hasOutline)
      }

      const content = hasOutline ? (
        <OutlineWrapper enabled className="min-h-screen w-full">
          <Story />
        </OutlineWrapper>
      ) : (
        <Story />
      )

      if (disableGlobalTheme) {
        return content
      }

      return (
        <Theme appearance={isDark ? 'dark' : 'light'} className="min-h-screen w-full">
          {content}
        </Theme>
      )
    },
  ],
  parameters: {
    layout: 'centered',
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Typography', 'Layouts', 'Elements', 'Form', '*'],
      },
    },
  },
}

export default preview
