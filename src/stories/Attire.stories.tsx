import type { Meta, StoryObj } from '@storybook/react'
import { Attire } from '@/components/sections/Attire'

const meta: Meta<typeof Attire> = {
  title: 'Sections/Attire',
  component: Attire,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof Attire>

export const Default: Story = {}
