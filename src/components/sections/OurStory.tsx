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

// Per-photo crop matching the Figma reveal states (nodes 149:1631–1652). Figma
// places each image in a fixed box inside the 154×188 frame with object-fit: fill,
// so we reproduce it as a background image with independent horizontal/vertical
// background-size (sx/sy, % of frame) and background-position (x/y, %).
const CROP = [
  { sx: 107, sy: 117, x: 50, y: 50 }, // raised hand (4c0b793b)
  { sx: 160, sy: 138, x: 44, y: 55 }, // striped hat (IMG_0613)
  { sx: 244, sy: 150, x: 35, y: 87 }, // couple + flowers (IMG_7771)
  { sx: 108, sy: 118, x: 60, y: 55 }, // selfie (IMG_7668)
]

export function OurStory() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })
  const [covered, setCovered] = useState(true)
  const [topIdx, setTopIdx] = useState(0)
  const [generation, setGeneration] = useState(0)
  // True while the front card is flying away — guards against a second tap landing
  // mid-flight and desyncing the stack. Cleared when the exit finishes.
  const [advancing, setAdvancing] = useState(false)

  const remaining = photos.length - topIdx
  const stackPhotos = photos
    .slice(topIdx)
    .map((p, stackPos) => ({ ...p, stackPos, index: topIdx + stackPos }))

  function handleTap() {
    if (covered) {
      setCovered(false)
    } else if (advancing) {
      // Ignore taps while a card is still leaving.
      return
    } else if (topIdx < photos.length) {
      setAdvancing(true)
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
          <AnimatePresence initial={false} onExitComplete={() => setAdvancing(false)}>
            {/* Fanned photo stack — the real photos, visible behind the star
                cover and after it lifts (Figma node 149:1613). */}
            {stackPhotos.map(photo => {
              const rot = ROT[photo.index] ?? 0
              const crop = CROP[photo.index] ?? { sx: 100, sy: 100, x: 50, y: 50 }
              // Cards further back sit a little lower so the whole stack peeks —
              // you always see a glimpse of the photos behind the front one.
              const depth = photo.stackPos
              return (
                <motion.div
                  key={`${generation}-${photo.index}`}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: photos.length - photo.stackPos }}
                  initial={false}
                  // The whole stack stays visible the entire time — nothing vanishes.
                  // When the front card flies off, the cards behind hold their place
                  // and then step forward one notch (via the transition delay), so the
                  // leaving photo clears before the next settles into the front spot.
                  animate={{ opacity: 1, rotate: rot, y: depth * 7 }}
                  exit={{ y: -440, rotate: rot - 14, opacity: 0, transition: { duration: 0.42, ease: 'easeIn' } }}
                  transition={{ duration: 0.45, ease: [0.34, 1.2, 0.64, 1], delay: 0.32 }}
                >
                  <div style={{ width: CARD_W, height: CARD_H }}>
                    {/* Outer owns the frame border; inner owns the overflow clip
                        (border-photo written directly — routing it through cn()
                        drops the width utility). See PhotoFrame gotcha in CLAUDE.md. */}
                    <div className="border-photo border-wedding-photo-border bg-wedding-photo-border w-full h-full">
                      {/* Crop tuned to the Figma reveal state (nodes 149:1631–1652). */}
                      <div
                        role="img"
                        aria-label={photo.alt}
                        className="w-full h-full bg-no-repeat grayscale"
                        style={{
                          backgroundImage: `url(${photo.src})`,
                          backgroundSize: `${crop.sx}% ${crop.sy}%`,
                          backgroundPosition: `${crop.x}% ${crop.y}%`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Replay hint once every photo has been tapped through */}
            {!covered && remaining === 0 && (
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
            )}

            {/* Star cover card — sits on top of the fanned stack until tapped */}
            {covered && (
              <motion.div
                key="cover"
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 30 }}
                initial={false}
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
