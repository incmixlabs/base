import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Avatar, Button, HoverCard, IconButton } from '@/elements'
import { Flex } from '@/layouts'
import { Text } from '@/typography'

const TEAM_MEMBERS = [
  { name: 'Howard Lloyd', role: 'Product Manager', completion: 90 },
  { name: 'Olivia Sparks', role: 'Software Engineer', completion: 60 },
  { name: 'Hallie Richards', role: 'UI/UX Designer', completion: 80 },
  { name: 'Jenny Wilson', role: 'Junior Developer', completion: 15 },
] as const

const meta: Meta<typeof HoverCard.Root> = {
  title: 'Elements/HoverCard',
  component: HoverCard.Root,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <HoverCard.Root>
      <HoverCard.Trigger render={<Button variant="outline" />}>Hover for details</HoverCard.Trigger>
      <HoverCard.Content>
        <Flex direction="column" gap="2">
          <Text size="sm" weight="medium">
            Project Status
          </Text>
          <Text size="xs" color="neutral">
            Last updated 2 hours ago. 3 tasks remaining before the deadline.
          </Text>
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  ),
}

export const Tasks: Story = {
  render: () => (
    <HoverCard.Root>
      <HoverCard.Trigger render={<Button variant="soft" color="primary" />}>Team Progress</HoverCard.Trigger>
      <HoverCard.Content size="lg" maxWidth="lg">
        <Flex direction="column" gap="4">
          <Text size="md" weight="bold">
            Today's task completion
          </Text>
          <Flex direction="column" gap="3">
            {TEAM_MEMBERS.map(person => (
              <Flex key={person.name} align="center" gap="3">
                <Avatar name={person.name} size="sm" />
                <Flex direction="column" className="flex-1">
                  <Text size="sm" weight="medium">
                    {person.name}
                  </Text>
                  <Text size="xs" color="neutral">
                    {person.role}
                  </Text>
                </Flex>
                <Text size="sm" weight="medium">
                  {person.completion}%
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  ),
}

export const Media: Story = {
  render: () => (
    <HoverCard.Root>
      <HoverCard.Trigger render={<Button variant="soft" />}>View Details</HoverCard.Trigger>
      <HoverCard.Content size="sm" maxWidth="md" className="p-0 overflow-hidden">
        <div
          aria-hidden="true"
          className="w-full h-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_28%),linear-gradient(180deg,#dbeafe_0%,#93c5fd_35%,#64748b_36%,#475569_56%,#1e293b_100%)]"
        />
        <Flex direction="column" gap="2" className="p-4">
          <Flex align="center" justify="between">
            <Text size="md" weight="bold">
              About Himalayas
            </Text>
            <Flex gap="1">
              <IconButton variant="ghost" size="xs" aria-label="Previous">
                <ChevronLeft className="h-4 w-4" />
              </IconButton>
              <IconButton variant="ghost" size="xs" aria-label="Next">
                <ChevronRight className="h-4 w-4" />
              </IconButton>
            </Flex>
          </Flex>
          <Text size="sm" color="neutral">
            The Great Himalayan mountain ranges in the Indian sub-continent region.
          </Text>
          <Button
            variant="ghost"
            size="xs"
            className="w-fit h-auto p-0 underline"
            aria-label="Read more about the Himalayas"
          >
            Read more
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  ),
}
