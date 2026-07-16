import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { CoupleNames } from '@/components/ui/CoupleNames'
import { LottiePlayer } from '@/components/ui/LottiePlayer'
import { assetUrl } from '@/lib/utils'

const STEM_BASE = '/assets/Landing/02%20Stems/landing%20stems%20json/'
const PLANT_BASE = '/assets/Landing/plants/'
const PLANT_FIELD_HEIGHT = 539 // px, native height of the full-frame plant layers
const PLANT_BOTTOM_BLEED = 40 // px the field hangs below the section's bottom edge
// Empty top margin above the tallest bud inside the composited flower layers
// (measured against the rendered frame): the frame's top ~87px is transparent,
// so the visible field starts this far down. We reserve only the band below it.
const FLOWER_FIELD_TOP_INSET = 87
// In-flow footprint of the VISIBLE flower band above the section's bottom edge:
// frame height − the part that bleeds below the section − the empty top margin.
// Reserving exactly this tucks the flowers right under the gap, with no tall
// empty strip above them (= 412px).
const PLANT_RESERVE = PLANT_FIELD_HEIGHT - PLANT_BOTTOM_BLEED - FLOWER_FIELD_TOP_INSET
// Offset from the date line to the top of the flower field, applied as the
// reserve block's margin (so a negative value works too). Rule of thumb: the
// tallest stem's tip sits LEVEL with the date — i.e. the field is pulled up
// until its top (FLOWER_FIELD_TOP_INSET) lands at the date's vertical centre, a
// touch above the date's bottom edge (the line box is ≈24px tall). Screen-
// independent: this offset equals stemTip − dateBottom on every viewport. It's
// negative, so the tall SIDE stems rise into the date's band — but they clear
// the centred date/parentage text horizontally, so nothing overlaps the text.
const TEXT_PLANT_GAP = -12

// Plant field layers, back → front. The static flower/grass/pulp fields are SVG
// (cut from the original plants-bg, now each its own full-frame 1512×540 layer)
// and the stems are looping Lottie. The interleaving — every stem sits behind
// its own flower row but in front of the row behind it — mirrors the Figma
// "landing flowers reference" layer stack exactly, so blossoms hide stem joints.
// Stem `height` = the Lottie's native canvas height; they're bottom-aligned and
// full-width like the static layers, so the whole field stays in register.
//
// `depth` groups the layers into parallax planes (0 = ground/pinned … 5 =
// nearest). Each plane bundles a stem row WITH the flower row it grows into, so
// a stem and its blossoms always move as one cluster — never floating apart.
// The `pulps` sprigs sit low and toward the front, so they ride a front-mid
// plane with the flowers around them instead of being left behind on the ground.
// grass is the only pinned layer (depth 0): it stays put so the base of the
// field stays glued to the (matching-green) section below it. On scroll, nearer
// planes travel a little farther than far ones — that gentle difference in speed
// is what reads as depth, while the magnitude stays small enough that no cluster
// strays far enough from the ground to look uprooted.
type PlantLayer =
  | { kind: 'svg'; src: string; depth: number }
  | { kind: 'stem'; src: string; height: number; depth: number }

const PLANT_LAYERS: PlantLayer[] = [
  { kind: 'svg',  src: 'grass.svg', depth: 0 },
  { kind: 'stem', src: 'stems_back.json', height: 594, depth: 1 },
  { kind: 'svg',  src: 'pulps.svg', depth: 4 },
  { kind: 'svg',  src: 'flowers-back.svg', depth: 1 },
  { kind: 'stem', src: 'stem_mid_3.json', height: 256, depth: 2 },
  { kind: 'svg',  src: 'flowers-mid-3.svg', depth: 2 },
  { kind: 'stem', src: 'stems_mid_2.json', height: 362, depth: 3 },
  { kind: 'svg',  src: 'flowers-mid-2.svg', depth: 3 },
  { kind: 'stem', src: 'stems_mid.json', height: 355, depth: 4 },
  { kind: 'svg',  src: 'flowers-mid.svg', depth: 4 },
  { kind: 'stem', src: 'stem_top.json', height: 169, depth: 5 },
  { kind: 'svg',  src: 'flowers-top.svg', depth: 5 },
]

export function InvitedBanner() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  // Depth-plane parallax. Anchored to 0 while the hero is in its loaded position
  // (offset start/start), then each plane rises as the section scrolls away —
  // nearer planes travelling farther than far ones, so the field fans open into
  // layered depth instead of sliding as one flat sheet. Pixel-based (not %) so a
  // stem and its flower shift by the exact same amount and never separate.
  // One transform per plane (hooks can't run in a loop); index by layer.depth.
  //
  // The parallax is only driven over the FIRST half of the section's scroll
  // (progress 0 → PARALLAX_END). Past that you've committed to the next section,
  // so every plane holds its last offset (useTransform clamps) and the whole
  // field scrolls out rigidly with the page — no more drift across the boundary.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const PARALLAX_END = 0.5
  const STEP = -PLANT_FIELD_HEIGHT * 0.016 // per-plane travel; plane 5 ≈ -0.08 of the field
  const y1 = useTransform(scrollYProgress, [0, PARALLAX_END], [0, STEP * 1])
  const y2 = useTransform(scrollYProgress, [0, PARALLAX_END], [0, STEP * 2])
  const y3 = useTransform(scrollYProgress, [0, PARALLAX_END], [0, STEP * 3])
  const y4 = useTransform(scrollYProgress, [0, PARALLAX_END], [0, STEP * 4])
  const y5 = useTransform(scrollYProgress, [0, PARALLAX_END], [0, STEP * 5])
  // Index by depth: plane 0 (ground) has no transform → stays pinned.
  const depthY = [undefined, y1, y2, y3, y4, y5]

  return (
    <section
      ref={ref}
      className="relative bg-wedding-monogram-bg flex flex-col items-center px-8 text-center text-wedding-dark-brown"
    >
      {/* Text content — pinned near the top, sits above the plant */}
      <div className="relative z-10 pt-[14vh] w-full shrink-0">

        {/* Invisible layout spacers — reserve the footprint of the hero text
            (names + date) so the section keeps its height and scroll position.
            The VISIBLE names and date are the shared overlay rendered in App,
            positioned to land exactly here, so they never shift on the transition. */}
        <CoupleNames className="invisible" />

        <p className="mt-[47px] font-garamond text-subhead font-medium text-wedding-dark-brown invisible">
          on Friday, 18 December 2026
        </p>
      </div>

      {/* In-flow footprint reserving the plant's visible flower band so the flex
          column accounts for it, sizing the section to its content (no
          min-h-screen) — its bottom edge lands at the flower base, where the
          grass meets OurStory's matching green. TEXT_PLANT_GAP (a margin, here
          negative) seats the top stem level with the date on every screen. The
          actual illustration is the absolutely positioned, full-bleed layer
          below, which overlays exactly here. */}
      <div
        className="w-full shrink-0"
        style={{ height: PLANT_RESERVE, marginTop: TEXT_PLANT_GAP }}
        aria-hidden
      />

      {/* Plant illustration — flower field + animated stems, grouped into
          parallax depth planes. Outer div is the fixed footprint; inner div is
          the one-time entrance fade/slide; each stem then carries its plane's
          scroll offset (grass, pulps, and the flower rows all stay pinned).
          (Falling leaves now live in App's FallingLeaves overlay so they can
          sit in front of the names.) */}
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{ left: '50%', transform: 'translateX(-50%)', width: 1512, height: PLANT_FIELD_HEIGHT, bottom: -PLANT_BOTTOM_BLEED }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 1.3, delay: 0.4, ease: 'easeOut' }}
        >
          {/* SVG flower/grass/pulp layers interleaved with animated Lottie stems,
              back to front (see PLANT_LAYERS). Each layer gets its depth plane's
              y offset; plane 0 (grass) has none, so it stays pinned. */}
          {PLANT_LAYERS.map((layer, i) => {
            const y = depthY[layer.depth]
            return layer.kind === 'svg' ? (
              <motion.img
                key={i}
                src={assetUrl(`${PLANT_BASE}${layer.src}`)}
                alt=""
                className="absolute bottom-0 w-full"
                style={{ y }}
              />
            ) : (
              <motion.div
                key={i}
                className="absolute bottom-0 left-0 w-full"
                style={{ height: layer.height, y }}
              >
                <LottiePlayer src={`${STEM_BASE}${layer.src}`} />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
