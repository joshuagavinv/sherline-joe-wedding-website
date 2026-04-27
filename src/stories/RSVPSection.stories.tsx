import type { Meta, StoryObj } from '@storybook/react'
import { RSVPSection } from '@/components/sections/RSVPSection'

const meta: Meta<typeof RSVPSection> = {
  title: 'Sections/RSVPSection',
  component: RSVPSection,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof RSVPSection>

export const Default: Story = {}
