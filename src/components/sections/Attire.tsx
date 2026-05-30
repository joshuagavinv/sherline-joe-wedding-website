import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const COLORS = [
  { src: '/assets/Attire/color1.svg', w: 25, h: 31 },
  { src: '/assets/Attire/color2.svg', w: 31, h: 28 },
  { src: '/assets/Attire/color4.svg', w: 31, h: 28 },
  { src: '/assets/Attire/color5.svg', w: 26, h: 32 },
  { src: '/assets/Attire/color6.svg', w: 24, h: 32 },
  { src: '/assets/Attire/color7.svg', w: 29, h: 30 },
]

const ATTIRE_HEIGHT = 240
const GHOST = 0.12 // opacity of the off-centre "shadow" look

const LOOKS = [
  { src: '/assets/Attire/suit.svg', label: 'Black tie', sub: 'Gentlemen' },
  { src: '/assets/Attire/dress.svg', label: 'Evening dress', sub: 'Ladies' },
]

function Platform() {
  return (
    <img
      src="/assets/Attire/platform.svg"
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

    requestAnimationFrame(paint)
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
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
          className="attire-scroll flex overflow-x-auto snap-x snap-mandatory"
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

      <motion.div
        className="mt-[100px] mb-[70px] flex justify-center"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        <a
          href={import.meta.env.VITE_RSVP_URL ?? '#'}
          className="font-serif text-heading text-wedding-dark-brown uppercase"
        >
          RSVP
        </a>
      </motion.div>
    </section>
  )
}
