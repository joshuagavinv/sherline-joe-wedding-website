import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Scattered layout matches Figma node 109:2383 (canvas 402px wide)
// Speeds vary dramatically per layer for Apple-style depth parallax
const PHOTOS = [
  // top-right: couple formal — fast (foreground feel)
  { src: '/assets/Gallery/gallery-2.png', alt: 'Joseph and Sherline', top: 0,   left: 257, width: 145, height: 171, speed: 80 },
  // left portrait — medium-fast
  { src: '/assets/Gallery/gallery-4.png', alt: 'Sherline',           top: 145, left: 33,  width: 134, height: 176, speed: 55 },
  // center large: couple dancing — slow (background / hero feel)
  { src: '/assets/Gallery/gallery-1.png', alt: 'Joseph and Sherline', top: 293, left: 56,  width: 290, height: 380, speed: 20 },
  // bottom-left: holding hands — fastest (foreground pop)
  { src: '/assets/Gallery/gallery-3.png', alt: 'Together',            top: 728, left: 0,   width: 145, height: 171, speed: 90 },
  // bottom-right: couple running — medium
  { src: '/assets/Gallery/gallery-5.png', alt: 'Us',                  top: 841, left: 217, width: 134, height: 176, speed: 40 },
] as const

function ParallaxPhoto({
  src, alt, top, left, width, height, speed,
}: {
  src: string; alt: string
  top: number; left: number; width: number; height: number; speed: number
}) {
  const ref = useRef<HTMLDivElement>(null!)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])

  return (
    <motion.div ref={ref} className="absolute overflow-hidden" style={{ top, left, width, height, y }}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
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
        // Green behind top half of first photo, then cream for the rest
        background: 'linear-gradient(to bottom, #909663 205px, #F3EEEE 205px)',
        paddingTop: 120,
        paddingBottom: 64,
      }}
    >
      {/* Scattered photo canvas, centred to 402px design width */}
      <div className="relative mx-auto" style={{ width: 402, height: SCENE_H }}>
        {PHOTOS.map((photo) => (
          <ParallaxPhoto key={photo.src} {...photo} />
        ))}
      </div>
    </section>
  )
}
