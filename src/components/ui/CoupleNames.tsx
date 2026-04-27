import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CoupleNamesProps {
  className?: string
}

export function CoupleNames({ className }: CoupleNamesProps) {
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <motion.p
        layoutId="couple-joseph"
        className="font-serif text-display text-wedding-dark-brown leading-none"
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
        Joseph
      </motion.p>
      <motion.p
        layoutId="couple-and"
        className="font-serif text-connector text-wedding-dark-brown/50 my-1"
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
        and
      </motion.p>
      <motion.p
        layoutId="couple-sherline"
        className="font-serif text-display text-wedding-dark-brown leading-none"
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
        Sherline
      </motion.p>
    </div>
  )
}
