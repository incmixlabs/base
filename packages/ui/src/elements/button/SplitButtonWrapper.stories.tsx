import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Box } from '@/layouts/box/Box'
import { SemanticColor } from '@/theme/props/color.prop'
import { DropdownMenu } from '../menu/DropdownMenu'
import { SplitButtonWrapper } from './SplitButtonWrapper'
import type { SplitButtonWrapperData, SplitButtonWrapperProps } from './split-button-wrapper.types'

/** Reusable controlled wrapper for stories that need selection state. */
function ControlledSplitButtonWrapper(props: SplitButtonWrapperProps) {
  const [value, setValue] = useState(props.defaultValue ?? props.data.items[0]?.id)
  return <SplitButtonWrapper {...props} value={value} onValueChange={setValue} />
}

const issueCloseData: SplitButtonWrapperData = {
  items: [
    {
      id: 'completed',
      label: 'Close as completed',
      description: 'Done, closed, fixed, resolved',
      icon: 'circle-check-big',
    },
    {
      id: 'not-planned',
      label: 'Close as not planned',
      description: "Won't fix, can't repro, stale",
      icon: 'circle-slash',
    },
    {
      id: 'duplicate',
      label: 'Close as duplicate',
      description: 'Duplicate of another issue',
      icon: 'circle-slash',
      children: (
        <>
          <DropdownMenu.Label>Select duplicate issue</DropdownMenu.Label>
          <DropdownMenu.Item onClick={() => console.log('Issue #101')}>Issue #101 - Login bug</DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => console.log('Issue #203')}>Issue #203 - Auth failure</DropdownMenu.Item>
        </>
      ),
    },
  ],
}

const mergeData: SplitButtonWrapperData = {
  items: [
    { id: 'merge', label: 'Merge' },
    { id: 'squash', label: 'Squash and merge' },
    { id: 'rebase', label: 'Rebase and merge' },
  ],
  iconStart: 'git-merge',
}

const saveData: SplitButtonWrapperData = {
  items: [
    { id: 'save', label: 'Save' },
    { id: 'save-draft', label: 'Save as draft' },
    { id: 'save-publish', label: 'Save and publish' },
  ],
  iconStart: 'save',
}

const meta: Meta<typeof SplitButtonWrapper> = {
  title: 'Elements/SplitButtonWrapper',
  component: SplitButtonWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ControlledSplitButtonWrapper
      data={issueCloseData}
      defaultValue="completed"
      onAction={item => console.log('Action:', item.id)}
      variant="soft"
      color={SemanticColor.slate}
    />
  ),
}

export const MergeStrategy: Story = {
  render: () => (
    <ControlledSplitButtonWrapper
      data={mergeData}
      defaultValue="merge"
      onAction={item => console.log('Merge:', item.id)}
      variant="solid"
      color={SemanticColor.success}
    />
  ),
}

export const WithIconOverride: Story = {
  render: () => (
    <ControlledSplitButtonWrapper
      data={saveData}
      defaultValue="save"
      onAction={item => console.log('Save:', item.id)}
      variant="solid"
      color={SemanticColor.primary}
    />
  ),
}

export const AllVariants: Story = {
  render: () => (
    <Box display="flex" className="gap-4 flex-wrap">
      <SplitButtonWrapper data={mergeData} variant="solid" />
      <SplitButtonWrapper data={mergeData} variant="soft" />
      <SplitButtonWrapper data={mergeData} variant="outline" />
      <SplitButtonWrapper data={mergeData} variant="ghost" />
    </Box>
  ),
}
