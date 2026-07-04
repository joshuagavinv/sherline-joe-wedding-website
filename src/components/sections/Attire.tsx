import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { assetUrl } from '@/lib/utils'

const COLORS = [
  { src: assetUrl('/assets/Attire/color1.svg'), w: 25, h: 31 },
  { src: assetUrl('/assets/Attire/color2.svg'), w: 31, h: 28 },
  { src: assetUrl('/assets/Attire/color4.svg'), w: 31, h: 28 },
  { src: assetUrl('/assets/Attire/color5.svg'), w: 26, h: 32 },
  { src: assetUrl('/assets/Attire/color6.svg'), w: 24, h: 32 },
  { src: assetUrl('/assets/Attire/color7.svg'), w: 29, h: 30 },
]

const ATTIRE_HEIGHT = 240
const GHOST = 0.12 // opacity of the off-centre "shadow" look

const LOOKS = [
  { src: assetUrl('/assets/Attire/suit.svg'), label: 'Black tie', sub: 'Gentlemen' },
  { src: assetUrl('/assets/Attire/dress.svg'), label: 'Evening dress', sub: 'Ladies' },
]

function Platform() {
  return (
    <img
      src={assetUrl('/assets/Attire/platform.svg')}
      alt=""
      aria-hidden="true"
      className="mx-auto block"
      style={{ width: 136, height: 34.5, marginTop: -12 }}
    />
  )
}

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
              <div className="flex items-end justify-center" style={{ height: ATTIRE_HEIGHT }}>
                <img
                  src={look.src}
                  alt={`${look.label} — ${look.sub}`}
                  className="select-none"
                  style={{ height: ATTIRE_HEIGHT, display: 'block' }}
                />
              </div>
              <Platform />
              <p className="mt-4 font-sans text-body font-medium text-wedding-dark-brown">{look.label}</p>
              <p className="mt-1 font-sans text-caption font-medium uppercase tracking-ui-label text-wedding-warm-brown">
                {look.sub}
              </p>
            </div>
          ))}

          {/* trailing spacer centres the last slide */}
          <div className="shrink-0 w-[31%]" aria-hidden="true" />
        </div>
      </motion.div>

      {/* Colour swatches — pastel earth-tone palette */}
      <motion.div
        className="mt-10 flex justify-center items-center gap-5 px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {COLORS.map(({ src, w, h }, i) => (
          <img key={i} src={src} alt="" style={{ width: w, height: h, flexShrink: 0 }} />
        ))}
      </motion.div>

      <motion.p
        className="mt-6 font-sans text-body text-center text-wedding-dark-brown px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25, duration: 0.6 }}
      >
        Pastel earth tones. No red, no pink, no white
      </motion.p>

      <motion.p
        className="mt-6 font-sans text-caption text-center text-wedding-dark-brown/60 max-w-[269px] mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        December is peak summer in Sydney, with warm, sunny days around 20–30°C and mild
        evenings. We suggest bringing a light layer, plus sunscreen and sunglasses for any
        outdoor moments.
      </motion.p>
    </section>
  )
}
