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
// Resting vertical offset (px from the stack's center) per photo, front-first — from the
// Figma fan (node 175:1197). The three back cards share one center (~+6) and only the
// front card lifts (~-3), so the fan's spread comes from rotation, not a vertical
// stair-step. (Previously depth * 7 = 0/7/14/21, which cascaded too far.)
const OFFSET_Y = [-3, 6, 6, 6]
const COVER_ROT = 2.5

// Replay restack timing — cards fly back into the fan one at a time (RESTACK_STEP
// apart), each dropping in over RESTACK_DUR. Back card returns first, front card last,
// and the cover drops on top last of all.
const RESTACK_STEP = 0.1
const RESTACK_DUR = 0.55

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
  // True during the replay restack — the cards fly back into the fan (reverse of how
  // they left) and the cover drops on top last. Cleared once the cover finishes landing.
  const [restacking, setRestacking] = useState(false)

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
      // Replay: refill the stack and drop the cover back on. `restacking` makes the
      // cards fly back in (reverse order) instead of snapping straight into the fan.
      setRestacking(true)
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
              // Resting offset keyed to the fixed original index (not stackPos), so a
              // card's spot never changes across its lifetime — when the front card exits,
              // the ones behind hold still instead of visibly shifting.
              const offsetY = OFFSET_Y[photo.index] ?? 0
              return (
                <motion.div
                  key={`${generation}-${photo.index}`}
                  className="absolute inset-0 flex items-center justify-center"
                  // z-index is keyed to the ABSOLUTE photo index, not stackPos, so it
                  // never changes for a card's lifetime. Photos leave front-first
                  // (0→1→2→3), so a lower index is always higher in the stack — the
                  // departing card stays above everything behind it the whole flight.
                  // (Using stackPos re-tied the promoted card to the leaver's z-index,
                  // making it pop in front mid-flight.)
                  style={{ zIndex: photos.length - photo.index }}
                  // Resting fan matches Figma (node 175:1197): rotation + OFFSET_Y. Static —
                  // identical whether the cover is on or lifted; tapping the cover just flies
                  // it away to reveal the fan already sitting there.
                  animate={{ opacity: 1, rotate: rot, y: offsetY }}
                  // On replay the cards fly back and restack in reverse of how they left:
                  // each drops in from where it exited (y:-440, under-rotated), back card
                  // first and front card last (see the transition delay). Every other time
                  // initial={false}, so the fan just shows in place — no drop-in on first
                  // load, on reveal, or as cards advance.
                  initial={restacking ? { opacity: 0, y: -440, rotate: rot - 14 } : false}
                  // Slide accelerates (easeIn); opacity fades linearly across the full
                  // flight, so a departing card lingers visible and melts away as it lifts.
                  exit={{ y: -440, rotate: rot - 14, opacity: 0, transition: { duration: 0.55, ease: 'easeIn', opacity: { duration: 0.55, ease: 'linear' } } }}
                  // Restack: reverse-order stagger (back card at delay 0, front card last)
                  // with a soft overshoot landing. Idle otherwise (animate never changes).
                  transition={
                    restacking
                      ? { duration: RESTACK_DUR, ease: [0.34, 1.4, 0.64, 1], delay: (photos.length - 1 - photo.index) * RESTACK_STEP }
                      : { duration: 0.45, ease: [0.34, 1.4, 0.64, 1] }
                  }
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
                  className="font-sans text-caption text-wedding-cream/40 uppercase tracking-[0.48px]"
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
                // On replay the cover drops back on top last — after every photo has
                // restacked (delay = photos.length * step) — like the final card returning
                // to the pile. Otherwise initial={false}: it's simply there.
                initial={restacking ? { opacity: 0, y: -440, rotate: COVER_ROT - 14 } : false}
                // Rests at +6 (Figma node 175:1197, cy≈147) — level with the back photos,
                // so the lifted front photo (-3) pokes above the cover's top edge.
                animate={{ opacity: 1, y: 6, rotate: COVER_ROT, scale: 1 }}
                transition={
                  restacking
                    ? { duration: RESTACK_DUR, ease: [0.34, 1.4, 0.64, 1], delay: photos.length * RESTACK_STEP }
                    : { duration: 0.45, ease: [0.34, 1.4, 0.64, 1] }
                }
                // The cover lands last, so its completion ends the restack.
                onAnimationComplete={() => { if (restacking) setRestacking(false) }}
                exit={{ y: -440, rotate: COVER_ROT - 14, opacity: 0, transition: { duration: 0.55, ease: 'easeIn', opacity: { duration: 0.55, ease: 'linear' } } }}
              >
                <div
                  className="border-photo border-wedding-splash-bg bg-wedding-monogram-bg overflow-hidden flex flex-col items-center justify-center gap-3"
                  style={{ width: CARD_W, height: CARD_H }}
                >
                  <img
                    src={assetUrl('/assets/ourstory-stars.svg')}
                    alt=""
                    className="w-[108px] h-[84px] object-contain"
                  />
                  <motion.span
                    className="font-sans text-caption text-wedding-ink/25 uppercase tracking-[0.48px]"
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
      <div className="px-8 mt-10 text-center text-wedding-cream-warm">
        <motion.h2
          className="font-serif text-display"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 10 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Our Story
        </motion.h2>

        <motion.div
          className="mt-4 mx-auto w-full max-w-52 font-sans text-body space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <p>
            We bonded over curiosity, good conversation, and an impressive ability to turn “What should we eat?” into a full discussion. Banter quickly became our love language, equal parts dry humor, cynicism, and saying things that would sound mildly concerning out of context.
          </p>
          <p>
            We keep the spark alive through creativity, curiosity, and conversations that bounce between life’s biggest questions and completely unserious gossip.
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
