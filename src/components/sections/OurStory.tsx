import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { VenueScene } from '@/components/sections/VenueScene'
import { assetUrl } from '@/lib/utils'

const photos = [
  { src: assetUrl('/assets/ourstory-1.png'), alt: 'Joseph and Sherline' },
  { src: assetUrl('/assets/ourstory-2.png'), alt: 'Our story' },
  { src: assetUrl('/assets/ourstory-3.png'), alt: 'Together' },
  { src: assetUrl('/assets/ourstory-4.png'), alt: 'Us' },
]

export function OurStory() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })
  const [covered, setCovered] = useState(true)
  const [topIdx, setTopIdx] = useState(0)
  const [generation, setGeneration] = useState(0)

  const remaining = photos.length - topIdx
  const stackPhotos = photos.slice(topIdx).map((p, stackPos) => ({ ...p, stackPos }))

  function handleTap() {
    if (covered) {
      setCovered(false)
    } else if (topIdx < photos.length) {
      setTopIdx(i => i + 1)
    } else {
      setTopIdx(0)
      setGeneration(g => g + 1)
    }
  }

  return (
    <section ref={ref} className="bg-wedding-story-bg pt-16 pb-0">
      <div className="w-full max-w-canvas mx-auto">
      {/* Photo stack */}
      <div className="flex flex-col items-center">
        <motion.div
          className="relative cursor-pointer"
          style={{ width: 230, height: 270 }}
          onClick={handleTap}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <AnimatePresence initial={false}>
            {/* Cover card — photo-0 with starfish illustration */}
            {covered && (
              <motion.div
                key="cover"
                className="absolute"
                style={{ width: 190, height: 225, top: 'calc(50% - 112px)', left: 'calc(50% - 95px)', zIndex: 30, rotate: '2.5deg' }}
                exit={{ y: -380, opacity: 0, transition: { duration: 0.38, ease: 'easeIn' } }}
              >
                <div className="border-photo border-wedding-photo-border bg-wedding-cream w-full h-full overflow-hidden flex flex-col items-center justify-center gap-3">
                  <div style={{ rotate: '-2.5deg' }}>
                    <img
                      src={assetUrl('/assets/ourstory-stars.svg')}
                      alt=""
                      className="w-[130px] h-[100px] object-contain"
                    />
                  </div>
                  {/* Pulsing "Tap" label */}
                  <motion.span
                    className="font-sans text-caption text-wedding-dark-brown uppercase tracking-ui-label"
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  >
                    Tap
                  </motion.span>
                </div>
              </motion.div>
            )}

            {/* Photo stack — revealed after cover is dismissed */}
            {!covered && (
              remaining > 0 ? (
                stackPhotos.map(photo => {
                  const depth = Math.min(photo.stackPos, 2)
                  return (
                    <motion.div
                      key={`${generation}-${photo.src}`}
                      className="absolute inset-0"
                      style={{ zIndex: stackPhotos.length - photo.stackPos }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, y: depth * 10, scale: 1 - depth * 0.03 }}
                      exit={{ y: -380, opacity: 0, transition: { duration: 0.38, ease: 'easeIn' } }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <div className="overflow-hidden w-full h-full">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          className="w-full h-full object-contain grayscale"
                        />
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <motion.div
                  key="done"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="font-garamond text-subhead text-wedding-cream/60 italic">
                    That's us ♡
                  </p>
                  <motion.span
                    className="font-sans text-caption text-wedding-cream/40 uppercase tracking-ui-label"
                    animate={{ opacity: [0.3, 0.9, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  >
                    Tap to replay
                  </motion.span>
                </motion.div>
              )
            )}
          </AnimatePresence>

        </motion.div>
      </div>

      {/* Heading + body */}
      <div className="px-8 mt-10 text-center text-wedding-cream">
        <motion.h2
          className="font-serif text-display"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 10 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Our Story
        </motion.h2>

        <motion.div
          className="mt-6 mx-auto w-full max-w-52 font-sans text-body space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <p>
            We bonded over curiosity, good conversation, and an impressive ability to turn "What should we eat?" into a full discussion. Banter quickly became our love language, equal parts dry humor, cynicism, and saying things that would sound mildly concerning out of context.
          </p>
          <p>
            We keep the spark alive through creativity, curiosity, and conversations that bounce between life's biggest questions and completely unserious gossip.
          </p>
          <p>
            Beneath all of that, though, we love deeply, feel deeply, and somehow make each other feel at home. So here we are, choosing each other forever (though Joe might argue padel is a very close second), even if dinner still takes a while to decide.
          </p>
        </motion.div>
      </div>
      </div>

      <div className="h-16" />

      {/* Venue building + clouds — anchored to bottom of the green section */}
      <VenueScene />
    </section>
  )
}
