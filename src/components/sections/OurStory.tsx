import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const photos = [
  { src: '/assets/photo-1.png', alt: 'Joseph and Sherline', rotate: '-3deg' },
  { src: '/assets/photo-2.png', alt: 'Our story', rotate: '2deg' },
  { src: '/assets/photo-3.png', alt: 'Together', rotate: '-1.5deg' },
  { src: '/assets/photo-4.png', alt: 'Us', rotate: '3.5deg' },
]

export function OurStory() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="px-8 py-16">
      <motion.h2
        className="font-serif text-display text-wedding-dark-brown"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Our Story
      </motion.h2>

      <motion.p
        className="mt-6 font-sans text-body text-wedding-dark-brown/70"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        We started off as two little kids who grew into the best version of
        ourselves — together. Through every adventure, every quiet moment, and
        every laugh shared, we found in each other a home.
      </motion.p>

      {/* Photo stack */}
      <div
        className="relative mt-10 h-64 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
        role="button"
        aria-label={expanded ? 'Collapse photos' : 'Expand photos'}
      >
        <AnimatePresence initial={false}>
          {!expanded ? (
            photos.map((photo, i) => (
              <motion.div
                key={photo.src}
                className="absolute inset-0 border-photo border-wedding-photo-border overflow-hidden"
                style={{ rotate: photo.rotate }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 - i * 0.02, zIndex: photos.length - i }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover grayscale"
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.src}
                  className="overflow-hidden border-photo border-wedding-photo-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-40 w-full object-cover grayscale"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 text-center font-sans text-caption text-wedding-warm-brown uppercase tracking-ui-label">
        {expanded ? 'Tap to stack' : 'Tap to explore'}
      </p>
    </section>
  )
}
