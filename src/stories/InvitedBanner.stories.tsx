import type { Meta, StoryObj } from '@storybook/react'
import { InvitedBanner } from '@/components/sections/InvitedBanner'

const meta: Meta<typeof InvitedBanner> = {
  title: 'Sections/InvitedBanner',
  component: InvitedBanner,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof InvitedBanner>

export const Default: Story = {}
