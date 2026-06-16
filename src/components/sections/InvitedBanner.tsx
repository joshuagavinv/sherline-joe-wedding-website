import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CoupleNames } from '@/components/ui/CoupleNames'
import { LottiePlayer } from '@/components/ui/LottiePlayer'
import { assetUrl } from '@/lib/utils'

const LEAF_BASE = '/assets/Landing/01%20Falling%20leaves/leaves%20json/'
const STEM_BASE = '/assets/Landing/02%20Stems/landing%20stems%20json/'
const PLANT_BASE = '/assets/Landing/plants/'

// Falling leaves: each drifts down from above the scene into the flower
// field, swaying sideways and fading in/out on its own looping cadence.
const LEAVES = [
  { src: 'landing_leaf_1.json', left: 100,  size: 80, duration: 7.0, delay: 0.0, drift: 22 },
  { src: 'landing_leaf_2.json', left: 420,  size: 80, duration: 9.0, delay: 1.6, drift: -26 },
  { src: 'landing_leaf_3.json', left: 760,  size: 80, duration: 8.0, delay: 3.2, drift: 18 },
  { src: 'landing_leaf_4.json', left: 1100, size: 64, duration: 10.0, delay: 0.8, drift: -16 },
  { src: 'landing_leaf_5.json', left: 1380, size: 64, duration: 7.5, delay: 2.4, drift: 24 },
]

// Plant field layers, back → front. The static flower/grass/pulp fields are SVG
// (cut from the original plants-bg, now each its own full-frame 1512×540 layer)
// and the stems are looping Lottie. The interleaving — every stem sits behind
// its own flower row but in front of the row behind it — mirrors the Figma
// "landing flowers reference" layer stack exactly, so blossoms hide stem joints.
// Stem `height` = the Lottie's native canvas height; they're bottom-aligned and
// full-width like the static layers, so the whole field stays in register.
const PLANT_LAYERS = [
  { kind: 'svg',  src: 'grass.svg' },
  { kind: 'stem', src: 'stems_back.json', height: 594 },
  { kind: 'svg',  src: 'pulps.svg' },
  { kind: 'svg',  src: 'flowers-back.svg' },
  { kind: 'stem', src: 'stem_mid_3.json', height: 256 },
  { kind: 'svg',  src: 'flowers-mid-3.svg' },
  { kind: 'stem', src: 'stems_mid_2.json', height: 362 },
  { kind: 'svg',  src: 'flowers-mid-2.svg' },
  { kind: 'stem', src: 'stems_mid.json', height: 355 },
  { kind: 'svg',  src: 'flowers-mid.svg' },
  { kind: 'stem', src: 'stem_top.json', height: 169 },
  { kind: 'svg',  src: 'flowers-top.svg' },
] as const

export function InvitedBanner() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  return (
    <section
      ref={ref}
      className="relative bg-wedding-cream min-h-screen flex flex-col items-center px-8 text-center text-wedding-dark-brown"
    >
      {/* Text content — shifted up from center, sits above the plant */}
      <div className="relative z-10 pt-[14vh] pb-12 w-full">

        {/* Invisible layout spacer — reserves the names' footprint so the date below
            sits correctly. The visible names are the shared overlay rendered in App,
            positioned to land exactly here, so they never shift on the transition. */}
        <CoupleNames className="invisible" />
      </div>

      {/* Plant illustration — static flower field + animated stem/leaf overlays */}
      <motion.div
        className="absolute pointer-events-none overflow-hidden"
        style={{ left: '50%', translateX: '-50%', width: 1512, height: 539, bottom: -40 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
        transition={{ duration: 1.3, delay: 0.4, ease: 'easeOut' }}
      >
        {/* Plant field — static flower/grass/pulp SVG layers interleaved with
            animated Lottie stems, back to front (see PLANT_LAYERS). */}
        {PLANT_LAYERS.map((layer, i) =>
          layer.kind === 'svg' ? (
            <img
              key={i}
              src={assetUrl(`${PLANT_BASE}${layer.src}`)}
              alt=""
              className="absolute bottom-0 w-full"
            />
          ) : (
            <div
              key={i}
              className="absolute bottom-0 left-0 w-full"
              style={{ height: layer.height }}
            >
              <LottiePlayer src={`${STEM_BASE}${layer.src}`} />
            </div>
          )
        )}

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
