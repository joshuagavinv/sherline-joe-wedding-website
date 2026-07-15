import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SplashPage } from '@/components/splash/SplashPage'
import { PageShell } from '@/components/layout/PageShell'
import { InvitedBanner } from '@/components/sections/InvitedBanner'
import { OurStory } from '@/components/sections/OurStory'
import { WeddingDay } from '@/components/sections/WeddingDay'
import { Attire } from '@/components/sections/Attire'
import { Hills } from '@/components/sections/Hills'
import { Gallery } from '@/components/sections/Gallery'
import { Farewell } from '@/components/sections/Farewell'
import { RestartButton } from '@/components/sections/RestartButton'
import { CoupleNames } from '@/components/ui/CoupleNames'
import { FallingLeaves } from '@/components/ui/FallingLeaves'

type AppState = 'splash' | 'main'

export default function App() {
  const [state, setState] = useState<AppState>('splash')
  const [autoExpand, setAutoExpand] = useState(false)
  const [showNames, setShowNames] = useState(false)
  // Bumped on every restart to force the names overlay to remount, so it
  // reliably re-runs its `initial: opacity 0` → fade-in. The key only changes
  // on restart, never during the splash → main handoff, so the names still
  // never remount (and never shift) on that transition.
  const [namesKey, setNamesKey] = useState(0)

  const handleSplashComplete = useCallback(() => {
    setState('main')
    setAutoExpand(false)
  }, [])

  const handleExpandStart = useCallback(() => setShowNames(true), [])

  const handleRestart = useCallback(() => {
    window.scrollTo({ top: 0 })
    // Remount the names overlay (new key) so it starts fresh at opacity 0 and
    // fades back in over the expansion — exactly like the first-visit tap.
    // showNames stays true (the new mount animates initial 0 → animate 1).
    setNamesKey((k) => k + 1)
    setShowNames(true)
    setAutoExpand(true)
    setState('splash')
  }, [])

  return (
    <div className="relative">
      <AnimatePresence>
        {state === 'splash' ? (
          <SplashPage
            key="splash"
            onComplete={handleSplashComplete}
            onExpandStart={handleExpandStart}
            autoExpand={autoExpand}
          />
        ) : (
          <motion.div
            key="main"
            className="min-h-screen w-full overflow-x-clip bg-wedding-monogram-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <PageShell>
              <InvitedBanner />
            </PageShell>
            <OurStory />
            <PageShell>
              <WeddingDay />
              <Attire />
            </PageShell>
            <Hills />
            <Gallery />
            <Farewell />
            <RestartButton onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero text — names, "You're invited" arc, parent lines AND the date,
           mounted once as a SINGLE shared overlay across splash → main. Each line
           cascades in (fade + gentle rise) in a natural order as `showNames` flips,
           so the block blooms as one connected, organic reveal that bridges the
           oval expansion and the banner — not a flat simultaneous fade. Because it
           never remounts across the transition, the text can't shift. Positioned
           `absolute top-[14vh]` to match InvitedBanner's invisible spacer, so it
           scrolls away naturally with the page once you're on the main view.
           `key={namesKey}` remounts the block on restart so the cascade replays. ── */}
      <div
        key={namesKey}
        className="absolute inset-x-0 top-[14vh] z-[60] flex flex-col items-center pointer-events-none"
      >
        <CoupleNames reveal={showNames} />
        <motion.p
          className="mt-[47px] font-garamond text-subhead font-medium text-wedding-dark-brown"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showNames ? 1 : 0, y: showNames ? 0 : 10 }}
          // Tail of the cascade — the date settles just after the parent lines.
          // Opacity lingers a little longer than the rise, matching CoupleNames.
          transition={{
            y: { duration: 0.8, delay: showNames ? 1.02 : 0, ease: [0.22, 1, 0.36, 1] as const },
            opacity: { duration: 1.2, delay: showNames ? 1.02 : 0, ease: 'easeInOut' as const },
          }}
        >
          on Friday, 18 December 2026
        </motion.p>
      </div>

      {/* Falling leaves — overlay above the names (z-65 > the names' z-60) but
          below the sticky RSVP pill (z-70), so they drift in front of
          "Joseph & Sherline" without covering the CTA. Only on the main view. */}
      {state === 'main' && <FallingLeaves />}
    </div>
  )
}
