import type { Meta, StoryObj } from '@storybook/react-vite'
import { selectArgType } from '@/theme/props/storybook'
import { AccordionWrapper } from './AccordionWrapper'
import { accordionRootPropDefs } from './accordion.props'

const meta = {
  title: 'Elements/AccordionWrapper',
  component: AccordionWrapper,
  parameters: { layout: 'centered' },
  argTypes: {
    size: selectArgType(accordionRootPropDefs.size),
    border: { control: 'boolean' },
    triggerPadding: { control: 'boolean' },
    contentPadding: { control: 'boolean' },
    multiple: { control: 'boolean' },
    triggerIconPosition: selectArgType(accordionRootPropDefs.triggerIconPosition),
  },
} satisfies Meta<typeof AccordionWrapper>

export default meta

type Story = StoryObj<typeof AccordionWrapper>

const items = [
  {
    value: 'what-is-autoform-ui',
    title: 'What is Autoform UI?',
    content: 'Autoform UI is a token-first component library focused on dense workflow interfaces.',
    open: true,
  },
  {
    value: 'default-open-state',
    title: 'Does wrapper support default open state?',
    content: 'Yes. Set open: true per item and the wrapper derives defaultValue automatically.',
  },
  {
    value: 'controlled-root',
    title: 'Can I still control the root?',
    content: 'Yes. Pass value/defaultValue/onValueChange directly to AccordionWrapper root props.',
  },
]

export const Default: Story = {
  args: {
    className: 'w-[560px]',
    size: accordionRootPropDefs.size.default,
    border: accordionRootPropDefs.border.default,
    triggerPadding: accordionRootPropDefs.triggerPadding.default,
    contentPadding: accordionRootPropDefs.contentPadding.default,
    triggerIconPosition: accordionRootPropDefs.triggerIconPosition.default,
    data: items,
  },
}

export const Multiple: Story = {
  args: {
    className: 'w-[560px]',
    multiple: true,
    size: accordionRootPropDefs.size.values[1],
    border: accordionRootPropDefs.border.default,
    triggerPadding: accordionRootPropDefs.triggerPadding.default,
    contentPadding: accordionRootPropDefs.contentPadding.default,
    triggerIconPosition: accordionRootPropDefs.triggerIconPosition.default,
    data: [
      { value: 'performance', title: 'Performance', content: 'Small and composable primitives.', open: true },
      {
        value: 'accessibility',
        title: 'Accessibility',
        content: 'Semantic, keyboard-friendly foundation.',
        open: false,
      },
      {
        value: 'customization',
        title: 'Customization',
        content: 'Root size/radius and trigger icon options.',
        open: true,
      },
    ],
  },
}
