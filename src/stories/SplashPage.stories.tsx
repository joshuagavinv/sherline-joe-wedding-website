import type { Meta, StoryObj } from '@storybook/react'
import { SplashPage } from '@/components/splash/SplashPage'

const meta: Meta<typeof SplashPage> = {
  title: 'Splash/SplashPage',
  component: SplashPage,
  parameters: { layout: 'fullscreen' },
  args: { onTap: () => {} },
}
export default meta

type Story = StoryObj<typeof SplashPage>

export const Default: Story = {}
