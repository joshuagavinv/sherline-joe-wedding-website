import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { assetUrl } from '@/lib/utils'

// Palette swatches — six uniform 28×28 circles (Figma nodes 169:1576–169:1581).
const SWATCH = 28
const COLORS = [
  assetUrl('/assets/Attire/swatch1.svg'), // #B8B886
  assetUrl('/assets/Attire/swatch2.svg'), // #DEBE95
  assetUrl('/assets/Attire/swatch3.svg'), // #A48471
  assetUrl('/assets/Attire/swatch4.svg'), // #FEE5AF
  assetUrl('/assets/Attire/swatch5.svg'), // #798964
  assetUrl('/assets/Attire/swatch6.svg'), // #A3B9BC
]

const GHOST = 0.12 // opacity of the off-centre "shadow" look

// Platform sits flush at the bottom of the stage; every garment's hem sinks
// the same SINK px into it, so the two platforms line up regardless of how
// tall the garment above them is (see Figma node 149:1497 / 149:1548).
const PLATFORM_WIDTH = 136
const PLATFORM_HEIGHT = 34
const SINK = 12
const SUIT_HEIGHT = 240
const DRESS_HEIGHT = 215
const STAGE_HEIGHT = SUIT_HEIGHT + PLATFORM_HEIGHT - SINK

// suit.svg / dress.svg declare width="100%" height="100%" on their root
// <svg> (Figma's default export), so a browser loading them via <img> can't
// resolve an intrinsic ratio from that and falls back to 300x150 — an
// explicit height alone then auto-computes the wrong width and the artwork
// renders squashed. Width is set explicitly from each SVG's own viewBox
// (149:1504 → 72.1869x209.629, 149:1555 → 68.7286x187.753) to keep it correct.
const LOOKS = [
  {
    src: assetUrl('/assets/Attire/suit.svg'),
    alt: 'Black tie suit',
    sub: 'Gentlemen',
    height: SUIT_HEIGHT,
    width: SUIT_HEIGHT * (72.1869 / 209.629),
  },
  {
    src: assetUrl('/assets/Attire/dress.svg'),
    alt: 'Evening dress',
    sub: 'Ladies',
    height: DRESS_HEIGHT,
    width: DRESS_HEIGHT * (68.7286 / 187.753),
  },
]

export function Attire() {
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const raf = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const paint = () => {
      const tRect = track.getBoundingClientRect()
      const tCenter = tRect.left + tRect.width / 2
      slideRefs.current.forEach((el) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const norm = Math.min(1, Math.abs(r.left + r.width / 2 - tCenter) / r.width)
        const t = 1 - norm
        el.style.opacity = (GHOST + (1 - GHOST) * t).toFixed(3)
        el.style.transform = `scale(${(0.9 + 0.1 * t).toFixed(3)})`
      })
    }
    const onScroll = () => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(paint)
    }

    // scrollLeft needed to centre a slide — measured via bounding rects so it
    // doesn't depend on the track being a positioned offsetParent.
    const centerOf = (el: HTMLDivElement) => {
      const tRect = track.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      const delta = (r.left + r.width / 2) - (tRect.left + tRect.width / 2)
      return track.scrollLeft + delta
    }

    const currentIndex = () => {
      const tRect = track.getBoundingClientRect()
      const tCenter = tRect.left + tRect.width / 2
      let best = 0
      let bestDist = Infinity
      slideRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const dist = Math.abs(r.left + r.width / 2 - tCenter)
        if (dist < bestDist) { bestDist = dist; best = i }
      })
      return best
    }

    let wheelLock = false
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      // While hovering the carousel the wheel only moves slides — never the page.
      e.preventDefault()
      if (wheelLock) return
      const dir = e.deltaY > 0 ? 1 : -1
      const cur = currentIndex()
      const next = Math.max(0, Math.min(slideRefs.current.length - 1, cur + dir))
      if (next === cur) return // at an edge: stay put (page stays blocked)
      const el = slideRefs.current[next]
      if (!el) return
      wheelLock = true
      track.scrollTo({ left: centerOf(el), behavior: 'smooth' })
      // release the lock once the smooth scroll settles so one tick = one slide
      let done = false
      const unlock = () => {
        if (done) return
        done = true
        wheelLock = false
        track.removeEventListener('scrollend', unlock)
      }
      track.addEventListener('scrollend', unlock)
      setTimeout(unlock, 600) // fallback if scrollend never fires (already at edge)
    }

    requestAnimationFrame(paint)
    track.addEventListener('scroll', onScroll, { passive: true })
    track.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      track.removeEventListener('scroll', onScroll)
      track.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <section className="py-16">
      <motion.h2
        className="font-serif text-heading text-wedding-dark-brown text-center px-8"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Attire
      </motion.h2>

      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <p className="font-sans text-body font-medium text-center text-wedding-dark-brown px-8">
          Formal (no <em className="italic">Batik</em>)
        </p>
        <p className="mt-2 font-sans text-body font-medium text-center text-wedding-dark-brown max-w-[279px] mx-auto">
          Please join us in creating an elegant atmosphere by dressing in your finest formal attire.
        </p>
      </motion.div>

      {/* Horizontal carousel: the centred look is solid, the other sits close beside it
          as a faint shadow. Scrolling slides between the two. */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div
          ref={trackRef}
          className="attire-scroll flex overflow-x-auto snap-x snap-mandatory cursor-ew-resize"
        >
          {/* leading spacer centres the first slide */}
          <div className="shrink-0 w-[31%]" aria-hidden="true" />

          {LOOKS.map((look, i) => (
            <div
              key={look.sub}
              ref={(el) => {
                slideRefs.current[i] = el
              }}
              className="snap-center shrink-0 w-[38%] flex flex-col items-center"
              style={{ willChange: 'opacity, transform' }}
            >
              <div className="relative w-full" style={{ height: STAGE_HEIGHT }}>
                <img
                  src={look.src}
                  alt={look.alt}
                  className="absolute left-1/2 -translate-x-1/2 select-none"
                  style={{
                    height: look.height,
                    width: look.width,
                    bottom: PLATFORM_HEIGHT - SINK,
                    display: 'block',
                    zIndex: 1,
                  }}
                />
                <img
                  src={assetUrl('/assets/Attire/platform.svg')}
                  alt=""
                  aria-hidden="true"
                  className="absolute left-1/2 -translate-x-1/2 bottom-0"
                  style={{ width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT }}
                />
              </div>
              <p className="mt-4 font-sans text-body font-medium text-wedding-dark-brown">{look.sub}</p>
            </div>
          ))}

          {/* trailing spacer centres the last slide */}
          <div className="shrink-0 w-[31%]" aria-hidden="true" />
        </div>
      </motion.div>

      <motion.p
        className="mt-8 font-sans text-body font-medium text-center text-wedding-dark-brown max-w-[279px] mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        Please wear colors from the palette below and avoid all shades of pink, red, and white.
      </motion.p>

      {/* Colour swatches — pastel earth-tone palette (Figma node 169:1575) */}
      <motion.div
        className="mt-6 flex justify-center items-center gap-[21px] px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {COLORS.map((src, i) => (
          <img key={i} src={src} alt="" style={{ width: SWATCH, height: SWATCH, flexShrink: 0 }} />
        ))}
      </motion.div>

      <motion.p
        className="mt-6 font-sans text-body font-medium text-center text-wedding-dark-brown max-w-[243px] mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25, duration: 0.6 }}
      >
        December in Sydney is warm and sunny (20–30°C), with mild evenings. We recommend a light layer, plus
        sunscreen and sunglasses for outdoor moments.
      </motion.p>
    </section>
  )
}
