import { cn } from '@/lib/utils'

interface CoupleNamesProps {
  className?: string
  groomParent?: string
  brideParent?: string
}

export function CoupleNames({ className, groomParent, brideParent }: CoupleNamesProps) {
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <p className="font-serif text-display text-wedding-dark-brown leading-none">
        Joseph
      </p>

      {groomParent && (
        <p className="mt-1 font-garamond text-parentage font-bold uppercase tracking-ui-label text-wedding-dark-brown">
          {groomParent}
        </p>
      )}

      <p className="font-serif text-connector text-wedding-dark-brown/50 my-1">
        and
      </p>

      <p className="font-serif text-display text-wedding-dark-brown leading-none">
        Sherline
      </p>

      {brideParent && (
        <p className="mt-1 font-garamond text-parentage font-bold uppercase tracking-ui-label text-wedding-dark-brown">
          {brideParent}
        </p>
      )}
    </div>
  )
}
