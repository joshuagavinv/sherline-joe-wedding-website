import type { Meta, StoryObj } from '@storybook/react'
import { OurStory } from '@/components/sections/OurStory'

const meta: Meta<typeof OurStory> = {
  title: 'Sections/OurStory',
  component: OurStory,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof OurStory>

export const Default: Story = {}
export const Stacked: Story = { name: 'Photos Stacked (initial)' }
