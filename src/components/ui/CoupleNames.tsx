import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

function YoureInvitedArc() {
  return (
    <svg
      viewBox="0 0 240 65"
      width="240"
      height="65"
      aria-hidden="true"
      className="mx-auto overflow-visible"
    >
      <defs>
        <path id="invitedArc" d="M 5,55 Q 120,28 235,55" fill="none" />
      </defs>
      <text fontFamily="'EB Garamond', serif" fontSize="16.19" fill="currentColor">
        <textPath href="#invitedArc" startOffset="50%" textAnchor="middle">
          You&apos;re invited to the wedding of
        </textPath>
      </text>
    </svg>
  )
}

interface CoupleNamesProps {
  className?: string
  /**
   * When provided, each element fades in individually — names first, arc + parents after.
   * Omit (SplashPage) to render with no internal animation; parent controls the fade.
   */
  inView?: boolean
  /** visibility:hidden on arc + parent lines, preserving layout (used on SplashPage). */
  hideSecondary?: boolean
}

export function CoupleNames({ className, inView, hideSecondary = false }: CoupleNamesProps) {
  const controlled = inView !== undefined

  const fade = (delay: number) =>
    controlled
      ? {
          initial: { opacity: 0 },
          animate: { opacity: inView ? 1 : 0 },
          transition: { duration: 0.65, delay, ease: 'easeOut' as const },
        }
      : {}

  return (
    <div className={cn('flex flex-col items-center text-center text-wedding-dark-brown', className)}>

      <motion.div className={hideSecondary ? 'invisible' : undefined} {...fade(0.55)}>
        <YoureInvitedArc />
      </motion.div>

      <motion.p className="mt-1 font-serif text-display leading-none" {...fade(0.1)}>
        Joseph
      </motion.p>

      <motion.p
        className={cn('mt-[13px] font-garamond text-parentage font-bold uppercase tracking-ui-label', hideSecondary && 'invisible')}
        {...fade(0.7)}
      >
        Son of Tjan Soen Eng &amp; Mirjam Nugraha
      </motion.p>

      <motion.p className="mt-[18px] font-serif text-connector text-wedding-dark-brown/50" {...fade(0.2)}>
        and
      </motion.p>

      <motion.p className="mt-[15px] font-serif text-display leading-none" {...fade(0.15)}>
        Sherline
      </motion.p>

      <motion.p
        className={cn('mt-1 font-garamond text-parentage font-bold uppercase tracking-ui-label', hideSecondary && 'invisible')}
        {...fade(0.8)}
      >
        Daughter of Alouisius Maseimilian &amp; Venny Martadinata
      </motion.p>

    </div>
  )
}
