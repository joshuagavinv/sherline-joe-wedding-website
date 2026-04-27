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
      className={cn('border-photo border-wedding-photo-border', className)}
      style={rotate ? { rotate } : undefined}
    >
      <div className="overflow-hidden h-full w-full">
        <img
          src={src}
          alt={alt}
          className={cn('h-full w-full object-cover grayscale', imgClassName)}
        />
      </div>
    </div>
  )
}
