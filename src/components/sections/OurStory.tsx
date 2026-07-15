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

// Polaroid-fan geometry — from Figma node 149:179 ("photo 0").
// Every card shares the same center; only its rotation differs.
const CARD_W = 166
const CARD_H = 200
const STACK_W = 273
const STACK_H = 282
// Resting rotation (deg) per photo, front-of-stack first — matches the Figma fan.
const ROT = [9.29, 2.54, -5.88, 0.76]
const COVER_ROT = 2.5

export function OurStory() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })
  const [covered, setCovered] = useState(true)
  const [topIdx, setTopIdx] = useState(0)
  const [generation, setGeneration] = useState(0)

  const remaining = photos.length - topIdx
  const stackPhotos = photos
    .slice(topIdx)
    .map((p, stackPos) => ({ ...p, stackPos, index: topIdx + stackPos }))

  function handleTap() {
    if (covered) {
      setCovered(false)
    } else if (topIdx < photos.length) {
      setTopIdx(i => i + 1)
    } else {
      setTopIdx(0)
      setGeneration(g => g + 1)
      setCovered(true)
    }
  }

  return (
    <section ref={ref} className="bg-wedding-story-bg pt-36 pb-0">
      <div className="w-full max-w-canvas mx-auto">
      {/* Photo stack — polaroid fan (Figma node 149:179) */}
      <div className="flex flex-col items-center">
        <motion.div
          className="relative cursor-pointer select-none"
          style={{ width: STACK_W, height: STACK_H }}
          onClick={handleTap}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <AnimatePresence initial={false}>
            {/* Ghost polaroids fanned behind the cover — hint at the stack */}
            {covered && (
              <motion.div
                key="cover-ghosts"
                className="absolute inset-0"
                style={{ zIndex: 27 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
              >
                {[ROT[0], ROT[2]].map((r, i) => (
                  <div key={i} className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="border-photo border-wedding-photo-border bg-wedding-photo-border"
                      style={{ width: CARD_W, height: CARD_H, rotate: `${r}deg` }}
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {/* Cover card — starfish illustration */}
            {covered && (
              <motion.div
                key="cover"
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 30 }}
                initial={{ opacity: 0, y: 24, rotate: COVER_ROT, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, rotate: COVER_ROT, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.34, 1.4, 0.64, 1] }}
                exit={{ y: -440, rotate: COVER_ROT - 14, opacity: 0, transition: { duration: 0.42, ease: 'easeIn' } }}
              >
                <div
                  className="border-photo border-wedding-photo-border bg-wedding-monogram-bg overflow-hidden flex flex-col items-center justify-center gap-3"
                  style={{ width: CARD_W, height: CARD_H }}
                >
                  <img
                    src={assetUrl('/assets/ourstory-stars.svg')}
                    alt=""
                    className="w-[108px] h-[84px] object-contain"
                  />
                  <motion.span
                    className="font-sans text-caption text-wedding-ink/25 uppercase tracking-ui-label"
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  >
                    Tap
                  </motion.span>
                </div>
              </motion.div>
            )}

            {/* Photo polaroids — revealed after the cover is dismissed */}
            {!covered && (
              remaining > 0 ? (
                stackPhotos.map(photo => {
                  const rot = ROT[photo.index] ?? 0
                  return (
                    <motion.div
                      key={`${generation}-${photo.index}`}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ zIndex: photos.length - photo.stackPos }}
                      initial={{ opacity: 0.5, rotate: rot, scale: 0.96 }}
                      animate={{ opacity: 1, rotate: rot, scale: 1 }}
                      exit={{ y: -440, rotate: rot - 14, opacity: 0, transition: { duration: 0.42, ease: 'easeIn' } }}
                      transition={{ duration: 0.4, ease: [0.34, 1.2, 0.64, 1], delay: photo.stackPos * 0.05 }}
                    >
                      <div style={{ width: CARD_W, height: CARD_H }}>
                        {/* Outer owns the frame border; inner owns the overflow clip
                            (border-photo written directly — routing it through cn()
                            drops the width utility). See PhotoFrame gotcha in CLAUDE.md. */}
                        <div className="border-photo border-wedding-photo-border bg-wedding-photo-border w-full h-full">
                          <div className="overflow-hidden w-full h-full">
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              className="w-full h-full object-cover grayscale"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <motion.div
                  key="done"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.22 } }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
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
