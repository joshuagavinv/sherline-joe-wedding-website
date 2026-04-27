import { cn } from '@/lib/utils'

interface CoupleNamesProps {
  className?: string
}

export function CoupleNames({ className }: CoupleNamesProps) {
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <p className="font-serif text-display text-wedding-dark-brown leading-none">
        Joseph
      </p>
      <p className="font-serif text-connector text-wedding-dark-brown/50 my-1">
        and
      </p>
      <p className="font-serif text-display text-wedding-dark-brown leading-none">
        Sherline
      </p>
    </div>
  )
}
