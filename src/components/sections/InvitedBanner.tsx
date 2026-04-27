import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const VISIBLE = { opacity: 1, y: 0 }
const HIDDEN_Y = (y = 12) => ({ opacity: 0, y })

function t(delay: number) {
  return { duration: 0.7, delay, ease: 'easeOut' } as const
}

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

export function InvitedBanner() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-wedding-cream px-8 pt-16 text-center text-wedding-dark-brown"
    >
      <div className="relative z-10 pb-96">

        {/* Names — carry over from splash, appear immediately */}
        <motion.div
          initial={HIDDEN_Y(0)}
          animate={inView ? VISIBLE : HIDDEN_Y(0)}
          transition={t(0)}
        >
          <p className="font-serif text-display leading-none">Joseph</p>
          <p className="font-serif text-connector text-wedding-dark-brown/50 my-1">and</p>
          <p className="font-serif text-display leading-none">Sherline</p>
        </motion.div>

        {/* "You're invited" curved text — appears after names */}
        <motion.div
          className="mt-6"
          initial={HIDDEN_Y()}
          animate={inView ? VISIBLE : HIDDEN_Y()}
          transition={t(0.45)}
        >
          <YoureInvitedArc />
        </motion.div>

        {/* Parent names */}
        <motion.div
          className="mt-4 space-y-1"
          initial={HIDDEN_Y()}
          animate={inView ? VISIBLE : HIDDEN_Y()}
          transition={t(0.65)}
        >
          <p className="font-garamond text-parentage font-bold uppercase tracking-ui-label">
            Son of Tjan Soen Eng &amp; Mirjam Nugraha
          </p>
          <p className="font-garamond text-parentage font-bold uppercase tracking-ui-label">
            Daughter of Alouisius Maseimilian &amp; Venny Martadinata
          </p>
        </motion.div>

        {/* Date — ink colour matches Figma #241000 */}
        <motion.p
          className="mt-6 font-sans text-body text-wedding-ink"
          initial={HIDDEN_Y()}
          animate={inView ? VISIBLE : HIDDEN_Y()}
          transition={t(0.85)}
        >
          Friday, December 18th 2026
          <span className="mx-2">·</span>
          Sydney, Australia
        </motion.p>
      </div>

      {/* Plant — fades and slides up */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1512px] pointer-events-none"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
      >
        <img src="/assets/plants-bg.svg" alt="" className="w-full" />
      </motion.div>
    </section>
  )
}
