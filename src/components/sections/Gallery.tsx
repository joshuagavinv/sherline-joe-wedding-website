import { motion } from 'framer-motion'
import { useParallax } from '@/hooks/useParallax'
import { PhotoFrame } from '@/components/ui/PhotoFrame'

const galleryPhotos = [
  { src: '/assets/photo-1.png', alt: 'Joseph and Sherline' },
  { src: '/assets/photo-2.png', alt: 'Our story' },
  { src: '/assets/photo-3.png', alt: 'Together' },
  { src: '/assets/photo-4.png', alt: 'Us' },
]

function ParallaxPhoto({ src, alt, speed }: { src: string; alt: string; speed: number }) {
  const { ref, y } = useParallax(speed)
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={{ y }}>
        <PhotoFrame src={src} alt={alt} imgClassName="w-full" />
      </motion.div>
    </div>
  )
}

export function Gallery() {
  return (
    <section className="py-16 overflow-hidden">
      <motion.p
        className="px-8 mb-8 font-sans text-caption uppercase tracking-ui-label text-wedding-warm-brown"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Gallery
      </motion.p>

      <div className="grid grid-cols-2 gap-px bg-wedding-cream">
        {galleryPhotos.map((photo, i) => (
          <ParallaxPhoto
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            speed={i % 2 === 0 ? 0.15 : 0.3}
          />
        ))}
      </div>
    </section>
  )
}
