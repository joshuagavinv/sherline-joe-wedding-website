import type { Meta, StoryObj } from '@storybook/react'
import { Logistics } from '@/components/sections/Logistics'

const meta: Meta<typeof Logistics> = {
  title: 'Sections/Logistics',
  component: Logistics,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof Logistics>

export const Default: Story = {}
