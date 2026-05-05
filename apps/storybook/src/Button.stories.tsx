import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@incmix/ui";

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    label: "Save changes",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
