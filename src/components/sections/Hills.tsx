import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { CSSProperties } from 'react'

// Layered hills scene (Figma node 91:1784 / registry → "Hills").
// Layers run back → front; z-index follows array order. The hill silhouettes
// are static SVGs (default fills baked in); the stem layers are self-animating
// SMIL SVGs that sway on their own.
//
// Depth comes from scroll-driven parallax: as the banner travels through the
// viewport each layer shifts vertically by `range` px — back hills move most,
// the front hill stays anchored (it defines the bottom edge and merges into the
// section body). Their lower halves stay tucked behind the front hill, so the
// movement never reveals a gap.
type Layer = {
  key: string
  src: string
  /** Absolute-position box inside the stage (matches Figma insets for hills). */
  box: CSSProperties
  /** Parallax travel in px (half-range each direction). */
  range: number
}

const HILL = '/assets/Hills/hills_shapes'
const STEM = '/assets/Hills/hills_stems_smil'

// Native hills-frame aspect ratio (Figma frame 91:157 = 1512 × 412.895).
const SCENE_RATIO = 412.895 / 1512 // ≈ 0.2731 (height ÷ width)
const MIN_SCENE_H = 180 // px — floor for narrow screens (scene crops to centre)

const LAYERS: Layer[] = [
  // back stems sit behind everything; native 1512×431 → 104.4% of frame height
  { key: 'stems-back', src: `${STEM}/hills_stems_back.svg`, range: 48,
    box: { left: 0, right: 0, bottom: 0, height: '104.4%' } },
  { key: 'hill-back2', src: `${HILL}/hills_back2.svg`, range: 44,
    box: { top: '35.95%', right: '23.72%', bottom: 0, left: 0 } },
  { key: 'hill-back1', src: `${HILL}/hills_back1.svg`, range: 34,
    box: { top: '40.42%', right: '4.03%', bottom: 0, left: '13.88%' } },
  // mid stems; native 1512×281 → 68.06% of frame height
  { key: 'stems-mid', src: `${STEM}/hills_stems_mid.svg`, range: 24,
    box: { left: 0, right: 0, bottom: 0, height: '68.06%' } },
  { key: 'hill-mid', src: `${HILL}/hills_mid.svg`, range: 22,
    box: { top: '41.08%', right: 0, bottom: 0, left: '30.86%' } },
  // front stems; native 1512×308 → 74.6% of frame height
  { key: 'stems-front', src: `${STEM}/hills_stems_front.svg`, range: 12,
    box: { left: 0, right: 0, bottom: 0, height: '74.6%' } },
  // front hill is #909663 — same as the section body, so it merges seamlessly.
  // range 0: anchored, defines the bottom edge.
  { key: 'hill-front', src: `${HILL}/hills_front.svg`, range: 0,
    box: { top: '50.75%', right: '0.07%', bottom: 0, left: 0 } },
]

const ROWS_ACCOMMODATION = ['Shangri-La Sydney', 'Park Hyatt', 'Four Seasons Hotel']
const ROWS_GETTING_AROUND = ['Uber & rideshare', 'Taxi', 'Trains & buses']

function Row({ label }: { label: string }) {
  return (
    <div className="w-full flex items-center px-2.5 py-2 border-b border-wedding-cream/50">
      <p className="font-sans text-body text-wedding-cream whitespace-nowrap">{label}</p>
    </div>
  )
}

export function Hills() {
  const bannerRef = useRef<HTMLDivElement>(null)

  // Full range of parallax travel as the banner crosses the viewport.
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ['start end', 'end start'],
  })

  // One transform per layer (hooks can't run in a loop). Back layers travel
  // most, front hill stays put → depth.
  const y0 = useTransform(scrollYProgress, [0, 1], [LAYERS[0].range, -LAYERS[0].range])
  const y1 = useTransform(scrollYProgress, [0, 1], [LAYERS[1].range, -LAYERS[1].range])
  const y2 = useTransform(scrollYProgress, [0, 1], [LAYERS[2].range, -LAYERS[2].range])
  const y3 = useTransform(scrollYProgress, [0, 1], [LAYERS[3].range, -LAYERS[3].range])
  const y4 = useTransform(scrollYProgress, [0, 1], [LAYERS[4].range, -LAYERS[4].range])
  const y5 = useTransform(scrollYProgress, [0, 1], [LAYERS[5].range, -LAYERS[5].range])
  const y6 = useTransform(scrollYProgress, [0, 1], [LAYERS[6].range, -LAYERS[6].range])
  const layerY = [y0, y1, y2, y3, y4, y5, y6]

  // Scene height grows with viewport width (aspect-locked) so the hills bleed
  // edge-to-edge on desktop; floored at MIN_SCENE_H on narrow screens, where
  // the wider-than-viewport scene simply crops to its centre.
  const sceneH = `max(${MIN_SCENE_H}px, 100vw * ${SCENE_RATIO})`
  // Extra headroom at the top so tall back-stems are never clipped by
  // overflow-hidden. The bonus area is cream (sky), which is correct.
  const STEM_TOP_BUFFER = 80
  const containerH = `calc(${sceneH} + ${STEM_TOP_BUFFER}px)`

  return (
    <section className="bg-wedding-story-bg">
      {/* Hills banner — full-bleed, cream "sky" showing through gaps between
          ridges, the green front hill merging into the section body below. */}
      <div
        ref={bannerRef}
        className="relative w-full overflow-hidden bg-wedding-cream"
        style={{ height: containerH }}
      >
        {/* Stage keeps the native aspect ratio: width derives from height. */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{ height: sceneH, aspectRatio: '1512 / 412.895' }}
        >
          {LAYERS.map((layer, i) => (
            <motion.div
              key={layer.key}
              className="absolute pointer-events-none"
              style={{ ...layer.box, zIndex: i + 1, y: layerY[i] }}
            >
              <img src={layer.src} alt="" aria-hidden="true" className="block w-full h-full" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content: Accommodation + Getting around (Figma node 91:822) */}
      <motion.div
        className="w-full max-w-canvas mx-auto px-8 pt-12 pb-20 flex flex-col gap-20"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col gap-6 text-wedding-cream">
          <h2 className="font-serif text-heading">Accommodation</h2>
          <p className="font-sans text-body">
            For guests travelling into Sydney, here are convenient hotel options near our venues:
          </p>
          <div className="flex flex-col gap-2.5">
            {ROWS_ACCOMMODATION.map(label => (
              <Row key={label} label={label} />
            ))}
          </div>
          <p className="font-sans text-body">
            We recommend booking early as weekends fill up quickly.
          </p>
        </div>

        <div className="flex flex-col gap-6 text-wedding-cream">
          <h2 className="font-serif text-heading">Getting around</h2>
          <p className="font-sans text-body">
            Sydney is well-connected by Uber, taxis, and public transport.
          </p>
          <div className="flex flex-col gap-2.5">
            {ROWS_GETTING_AROUND.map(label => (
              <Row key={label} label={label} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
