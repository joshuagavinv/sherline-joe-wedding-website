import type { Meta, StoryObj } from '@storybook/react'
import { SplashReveal } from '@/components/splash/SplashReveal'

const meta: Meta<typeof SplashReveal> = {
  title: 'Splash/SplashReveal',
  component: SplashReveal,
  parameters: { layout: 'fullscreen' },
  args: { onComplete: () => {} },
}
export default meta

type Story = StoryObj<typeof SplashReveal>

export const Default: Story = {}
