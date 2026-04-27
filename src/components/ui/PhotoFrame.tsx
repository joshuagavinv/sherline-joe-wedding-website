import { cn } from '@/lib/utils'

interface PhotoFrameProps {
  src: string
  alt: string
  rotate?: string
  className?: string
  imgClassName?: string
}

export function PhotoFrame({ src, alt, rotate, className, imgClassName }: PhotoFrameProps) {
  return (
    <div
      className={cn('overflow-hidden border-photo border-wedding-photo-border', className)}
      style={rotate ? { rotate } : undefined}
    >
      <img
        src={src}
        alt={alt}
        className={cn('h-full w-full object-cover grayscale', imgClassName)}
      />
    </div>
  )
}
