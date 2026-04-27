import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CoupleNames } from '@/components/ui/CoupleNames'

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

  const show = (delay: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: inView ? 1 : 0 },
    transition: { duration: 0.65, delay, ease: 'easeOut' as const },
  })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-wedding-cream px-8 pt-16 text-center text-wedding-dark-brown"
    >
      <div className="relative z-10 pb-[500px]">

        {/* "You're invited" arc — fades in after names */}
        <motion.div {...show(0.5)}>
          <YoureInvitedArc />
        </motion.div>

        {/* Names — invisible at first, fade in as a unit with short delay */}
        <motion.div className="mt-4" {...show(0.15)}>
          <CoupleNames />
        </motion.div>

        {/* Parent lines */}
        <motion.p
          className="mt-3 font-garamond text-parentage font-bold uppercase tracking-ui-label"
          {...show(0.6)}
        >
          Son of Tjan Soen Eng &amp; Mirjam Nugraha
        </motion.p>
        <motion.p
          className="mt-1 font-garamond text-parentage font-bold uppercase tracking-ui-label"
          {...show(0.7)}
        >
          Daughter of Alouisius Maseimilian &amp; Venny Martadinata
        </motion.p>

        {/* Date */}
        <motion.p
          className="mt-8 font-sans text-body text-wedding-ink"
          {...show(0.85)}
        >
          Friday, December 18th 2026
          <span className="mx-2">·</span>
          Sydney, Australia
        </motion.p>
      </div>

      {/* Plant — slides up and fades in behind the text */}
      <motion.div
        className="absolute bottom-0 w-[1512px] pointer-events-none"
        style={{ left: '50%', translateX: '-50%' }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
        transition={{ duration: 1.3, delay: 0.4, ease: 'easeOut' }}
      >
        <img src="/assets/plants-bg.svg" alt="" className="w-full" />
      </motion.div>
    </section>
  )
}
