import type { Meta, StoryObj } from '@storybook/react'
import { PhotoFrame } from '@/components/ui/PhotoFrame'

const meta: Meta<typeof PhotoFrame> = {
  title: 'UI/PhotoFrame',
  component: PhotoFrame,
  parameters: { layout: 'centered' },
  args: {
    src: '/assets/photo-1.png',
    alt: 'Joseph and Sherline',
  },
}
export default meta

type Story = StoryObj<typeof PhotoFrame>

export const Default: Story = {}

export const Tilted: Story = {
  args: { rotate: '-3deg' },
}

export const AllPhotos: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      {[1, 2, 3, 4].map((n) => (
        <PhotoFrame
          key={n}
          src={`/assets/photo-${n}.png`}
          alt={`Photo ${n}`}
          imgClassName="h-48"
        />
      ))}
    </div>
  ),
}
