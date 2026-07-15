import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { CoupleNames } from '@/components/ui/CoupleNames'
import { LottiePlayer } from '@/components/ui/LottiePlayer'
import { assetUrl } from '@/lib/utils'

const STEM_BASE = '/assets/Landing/02%20Stems/landing%20stems%20json/'
const PLANT_BASE = '/assets/Landing/plants/'

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

  // Scroll parallax for the whole plant field. Anchored to 0 while the hero is
  // in its loaded position (offset start/start), then the field lags downward as
  // the section scrolls away — moving slower than the page (and the names), which
  // reads as depth. The field moves as ONE unit so stems stay joined to blossoms.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const plantY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])

  return (
    <section
      ref={ref}
      className="relative bg-wedding-monogram-bg min-h-screen flex flex-col items-center px-8 text-center text-wedding-dark-brown"
    >
      {/* Text content — shifted up from center, sits above the plant */}
      <div className="relative z-10 pt-[14vh] pb-12 w-full">

        {/* Invisible layout spacer — reserves the names' footprint so the date below
            sits correctly. The visible names are the shared overlay rendered in App,
            positioned to land exactly here, so they never shift on the transition. */}
        <CoupleNames className="invisible" />
      </div>

      {/* Plant illustration — static flower field + animated stems. Outer div
          carries the scroll parallax; inner div the one-time entrance fade/slide.
          (Falling leaves now live in App's FallingLeaves overlay so they can sit
          in front of the names.) */}
      <motion.div
        className="absolute pointer-events-none overflow-hidden"
        style={{ left: '50%', translateX: '-50%', width: 1512, height: 539, bottom: -40, y: plantY }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 1.3, delay: 0.4, ease: 'easeOut' }}
        >
          {/* Static flower/grass/pulp SVG layers interleaved with animated Lottie
              stems, back to front (see PLANT_LAYERS). */}
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
        </motion.div>
      </motion.div>
    </section>
  )
}
