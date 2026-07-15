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
   * When provided, each line cascades in (fade + gentle rise) as `reveal` flips
   * true — one connected reveal shared with the date rendered in App's overlay.
   * Omit (the InvitedBanner spacer) to render static markup for layout only.
   */
  reveal?: boolean
}

// Soft easeOut (≈ easeOutCubic) so each line decelerates into place — an organic
// settle rather than a linear pop.
const EASE = [0.22, 1, 0.36, 1] as const

export function CoupleNames({ className, reveal }: CoupleNamesProps) {
  const controlled = reveal !== undefined

  // Every line rises 10px and fades. Joseph / and / Sherline share one delay so
  // the couple's names bloom TOGETHER as a unit; the arc, parent lines and date
  // then settle around them a beat later — a natural cascade, not a flat fade.
  // The fade (opacity) lingers a little longer than the rise for a softer bloom.
  // Tuned to land as the oval completes (~1.8s), bridging the splash → banner
  // hand-off. Uncontrolled (the invisible spacer) = no animation.
  const line = (delay: number) =>
    controlled
      ? {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: reveal ? 1 : 0, y: reveal ? 0 : 10 },
          transition: {
            y: { duration: 0.8, delay, ease: EASE },
            opacity: { duration: 1.2, delay, ease: 'easeInOut' as const },
          },
        }
      : {}

  return (
    <div className={cn('flex flex-col items-center text-center text-wedding-dark-brown', className)}>

      <motion.div {...line(0.8)}>
        <YoureInvitedArc />
      </motion.div>

      <motion.p className="mt-1 font-serif text-display leading-none" {...line(0.5)}>
        Joseph
      </motion.p>

      <motion.p className="mt-[13px] font-sans text-body font-medium leading-[1.14]" {...line(0.88)}>
        Son of Tjan Soen Eng <br /> and Mirjam Nugraha
      </motion.p>

      <motion.p className="mt-[18px] font-serif text-connector text-wedding-dark-brown" {...line(0.5)}>
        and
      </motion.p>

      <motion.p className="mt-[15px] font-serif text-display leading-none" {...line(0.5)}>
        Sherline
      </motion.p>

      <motion.p className="mt-1 font-sans text-body font-medium leading-[1.14]" {...line(0.94)}>
        Daughter of Alouisius Maseimilian <br /> and Venny Martadinata
      </motion.p>

    </div>
  )
}
