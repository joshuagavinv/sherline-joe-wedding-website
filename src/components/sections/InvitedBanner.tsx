import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CoupleNames } from '@/components/ui/CoupleNames'
import { LottiePlayer } from '@/components/ui/LottiePlayer'

const LEAF_BASE = '/assets/Landing/01%20Falling%20leaves/leaves%20json/'

// Falling leaves: each drifts down from above the scene into the flower
// field, swaying sideways and fading in/out on its own looping cadence.
const LEAVES = [
  { src: 'landing_leaf_1.json', left: 100,  size: 80, duration: 7.0, delay: 0.0, drift: 22 },
  { src: 'landing_leaf_2.json', left: 420,  size: 80, duration: 9.0, delay: 1.6, drift: -26 },
  { src: 'landing_leaf_3.json', left: 760,  size: 80, duration: 8.0, delay: 3.2, drift: 18 },
  { src: 'landing_leaf_4.json', left: 1100, size: 64, duration: 10.0, delay: 0.8, drift: -16 },
  { src: 'landing_leaf_5.json', left: 1380, size: 64, duration: 7.5, delay: 2.4, drift: 24 },
]

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

      {/* Plant illustration — static flower field + animated stem/leaf overlays */}
      <motion.div
        className="absolute pointer-events-none overflow-hidden"
        style={{ left: '50%', translateX: '-50%', width: 1512, height: 539, bottom: -40 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
        transition={{ duration: 1.3, delay: 0.4, ease: 'easeOut' }}
      >
        {/* Base static flower field */}
        <img src="/assets/plants-bg.svg" alt="" className="absolute bottom-0 w-full" />

        {/* Animated stems — bottom-aligned, back to front */}
        <div className="absolute bottom-0 left-0 w-full" style={{ height: 594 }}>
          <LottiePlayer src="/assets/Landing/02%20Stems/landing%20stems%20json/stems_back.json" />
        </div>
        <div className="absolute bottom-0 left-0 w-full" style={{ height: 355 }}>
          <LottiePlayer src="/assets/Landing/02%20Stems/landing%20stems%20json/stems_mid.json" />
        </div>
        <div className="absolute bottom-0 left-0 w-full" style={{ height: 362 }}>
          <LottiePlayer src="/assets/Landing/02%20Stems/landing%20stems%20json/stems_mid_2.json" />
        </div>
        <div className="absolute bottom-0 left-0 w-full" style={{ height: 256 }}>
          <LottiePlayer src="/assets/Landing/02%20Stems/landing%20stems%20json/stem_mid_3.json" />
        </div>
        <div className="absolute bottom-0 left-0 w-full" style={{ height: 169 }}>
          <LottiePlayer src="/assets/Landing/02%20Stems/landing%20stems%20json/stem_top.json" />
        </div>

        {/* Falling leaves — drift down from above into the flower field, looping */}
        {LEAVES.map((leaf, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: leaf.left, top: 0, width: leaf.size, height: leaf.size }}
            initial={{ y: -120, x: 0, opacity: 0 }}
            animate={{
              y: [-120, 470],
              x: [0, leaf.drift, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              y: { duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: 'linear' },
              x: { duration: leaf.duration / 2, delay: leaf.delay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              opacity: { duration: leaf.duration, delay: leaf.delay, repeat: Infinity, times: [0, 0.12, 0.82, 1], ease: 'easeInOut' },
            }}
          >
            <LottiePlayer src={`${LEAF_BASE}${leaf.src}`} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
