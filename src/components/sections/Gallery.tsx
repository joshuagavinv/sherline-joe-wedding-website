import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { assetUrl } from '@/lib/utils'

// Scattered layout matches Figma node 155:3644 (canvas 402px wide)
// Each photo's inner image is offset/sized to reproduce Figma's exact crop framing —
// several are off-center focal points, not a plain centered object-cover
// Speeds vary dramatically per layer for Apple-style depth parallax
const PHOTOS = [
  // top-right: couple on the street — fast (foreground feel)
  {
    src: assetUrl('/assets/Gallery/gallery-2.jpg'), alt: 'Joseph and Sherline',
    top: 0, left: 250, width: 153, height: 171,
    innerTop: -14, innerLeft: -72, innerWidth: 299, innerHeight: 199,
    speed: 80,
  },
  // left: holding hands — medium-fast
  {
    src: assetUrl('/assets/Gallery/gallery-4.jpg'), alt: 'Joseph and Sherline holding hands',
    top: 145, left: 33, width: 134, height: 176,
    innerTop: 0, innerLeft: -75, innerWidth: 265, innerHeight: 176,
    speed: 55,
  },
  // bottom-left: leaning against the wall — fastest (foreground pop)
  {
    src: assetUrl('/assets/Gallery/gallery-3.jpg'), alt: 'Joseph and Sherline',
    top: 728, left: 0, width: 228, height: 171,
    innerTop: -115, innerLeft: -124, innerWidth: 451, innerHeight: 300,
    speed: 90,
  },
  // bottom-right: Joseph portrait — medium
  {
    src: assetUrl('/assets/Gallery/gallery-5.jpg'), alt: 'Joseph',
    top: 841, left: 217, width: 134, height: 176,
    innerTop: -79, innerLeft: -50, innerWidth: 252, innerHeight: 378,
    speed: 40,
  },
] as const

// Center hero slot (Figma node 155:3644 "main photo" 1-4, all 290x380) — auto-plays
// through all 4 shots on a loop instead of a fixed photo
const MAIN_PHOTO = { top: 293, left: 56, width: 290, height: 380, speed: 20 }
const MAIN_SLIDES = [
  {
    src: assetUrl('/assets/Gallery/gallery-1.jpg'), alt: 'Joseph and Sherline leaning on the railing',
    innerTop: -65, innerLeft: 0, innerWidth: 307, innerHeight: 461,
  },
  {
    src: assetUrl('/assets/Gallery/gallery-main-2.jpg'), alt: 'Joseph and Sherline laughing by the wall',
    innerTop: -57, innerLeft: -287, innerWidth: 655, innerHeight: 437,
  },
  {
    src: assetUrl('/assets/Gallery/gallery-main-3.jpg'), alt: 'Joseph and Sherline under the lamppost',
    innerTop: -111, innerLeft: -63, innerWidth: 364, innerHeight: 544,
  },
  {
    src: assetUrl('/assets/Gallery/gallery-main-4.jpg'), alt: 'Joseph and Sherline in the laneway',
    innerTop: -55, innerLeft: -160, innerWidth: 653, innerHeight: 435,
  },
] as const

const SLIDE_INTERVAL_MS = 3200
const SLIDE_TRANSITION = { duration: 0.8, ease: 'easeInOut' } as const

function MainPhotoSlideshow() {
  const ref = useRef<HTMLDivElement>(null!)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [MAIN_PHOTO.speed, -MAIN_PHOTO.speed])

  // Autoplay only starts once the hero photo has actually scrolled into view (not the instant
  // it peeks in from below), then loops through all 4 shots on a timer forever.
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MAIN_SLIDES.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [isInView])

  const slide = MAIN_SLIDES[index]
  const W = MAIN_PHOTO.width

  return (
    <motion.div
      ref={ref}
      className="absolute overflow-hidden"
      style={{ top: MAIN_PHOTO.top, left: MAIN_PHOTO.left, width: MAIN_PHOTO.width, height: MAIN_PHOTO.height, y }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.src}
          className="absolute inset-0 overflow-hidden"
          initial={{ x: -W }}
          animate={{ x: 0 }}
          exit={{ x: W }}
          transition={SLIDE_TRANSITION}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="absolute max-w-none object-cover pointer-events-none"
            style={{ top: slide.innerTop, left: slide.innerLeft, width: slide.innerWidth, height: slide.innerHeight }}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

function ParallaxPhoto({
  src, alt, top, left, width, height, innerTop, innerLeft, innerWidth, innerHeight, speed,
}: {
  src: string; alt: string
  top: number; left: number; width: number; height: number
  innerTop: number; innerLeft: number; innerWidth: number; innerHeight: number
  speed: number
}) {
  const ref = useRef<HTMLDivElement>(null!)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])

  return (
    <motion.div ref={ref} className="absolute overflow-hidden" style={{ top, left, width, height, y }}>
      <img
        src={src}
        alt={alt}
        className="absolute max-w-none object-cover pointer-events-none"
        style={{ top: innerTop, left: innerLeft, width: innerWidth, height: innerHeight }}
      />
    </motion.div>
  )
}

export function Gallery() {
  // Total scene height: last photo bottom (841+176=1017) + 60px buffer for parallax overflow
  const SCENE_H = 1077

  return (
    <section
      className="relative overflow-hidden"
      style={{
        // Green (wedding-story-bg) behind top half of first photo, then cream
        // (wedding-monogram-bg — same cream the rest of the page sits on, e.g. Attire) for the rest
        background: 'linear-gradient(to bottom, #909663 205px, #F3EEE4 205px)',
        paddingTop: 120,
        paddingBottom: 64,
      }}
    >
      {/* Scattered photo canvas, centred to 402px design width */}
      <div className="relative mx-auto" style={{ width: 402, height: SCENE_H }}>
        {PHOTOS.map((photo) => (
          <ParallaxPhoto key={photo.src} {...photo} />
        ))}
        <MainPhotoSlideshow />
      </div>
    </section>
  )
}
