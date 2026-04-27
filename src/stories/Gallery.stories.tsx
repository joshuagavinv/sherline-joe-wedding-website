import type { Meta, StoryObj } from '@storybook/react'
import { Gallery } from '@/components/sections/Gallery'

const meta: Meta<typeof Gallery> = {
  title: 'Sections/Gallery',
  component: Gallery,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof Gallery>

export const Default: Story = {}
