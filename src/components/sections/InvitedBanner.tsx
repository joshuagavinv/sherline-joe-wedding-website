import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CoupleNames } from '@/components/ui/CoupleNames'

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
      className="relative bg-wedding-cream min-h-screen flex flex-col items-center px-8 text-center text-wedding-dark-brown"
    >
      {/* Text content — shifted up from center, sits above the plant */}
      <div className="relative z-10 pt-[14vh] pb-12 w-full">

        {/* Names + arc + parent lines — per-element stagger via inView */}
        <CoupleNames inView={inView} />

        {/* Date */}
        <motion.p
          className="mt-32 mb-16 font-sans text-body text-wedding-ink"
          {...show(0.85)}
        >
          Friday, December 18th 2026
          <br/>
          Sydney, Australia
        </motion.p>
      </div>

      {/* Plant — full 539px height, pushed slightly below bottom edge */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ left: '50%', translateX: '-50%', width: 1512, height: 539, bottom: -40 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
        transition={{ duration: 1.3, delay: 0.4, ease: 'easeOut' }}
      >
        <img src="/assets/plants-bg.svg" alt="" className="absolute bottom-0 w-full" />
      </motion.div>
    </section>
  )
}
