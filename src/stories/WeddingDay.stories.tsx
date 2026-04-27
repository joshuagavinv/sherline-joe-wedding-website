import type { Meta, StoryObj } from '@storybook/react'
import { WeddingDay } from '@/components/sections/WeddingDay'

const meta: Meta<typeof WeddingDay> = {
  title: 'Sections/WeddingDay',
  component: WeddingDay,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof WeddingDay>

export const Default: Story = {}
