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
import { RestartButton } from '@/components/sections/RestartButton'
import { CoupleNames } from '@/components/ui/CoupleNames'
import { StickyRSVPButton } from '@/components/ui/StickyRSVPButton'

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
            className="min-h-screen w-full overflow-x-clip bg-wedding-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.5 }}
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
            <RestartButton onRestart={handleRestart} />
            <StickyRSVPButton />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Couple names — a SINGLE element mounted once, shared across splash → main.
           Fades in during the oval expansion and stays put; because it never remounts,
           "Joseph & Sherline" cannot shift on the transition. Positioned with
           `absolute top-[14vh]` to match InvitedBanner's in-flow layout, so it scrolls
           away naturally with the page once you're on the main view. ── */}
      <motion.div
        key={namesKey}
        className="absolute inset-x-0 top-[14vh] z-[60] flex flex-col items-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: showNames ? 1 : 0 }}
        // Slow fade-in (delay 0.5 / duration 1.5), shared by both paths: the
        // first-visit tap flips showNames false → true; restart bumps namesKey to
        // remount this overlay so it re-runs initial 0 → animate 1 deterministically.
        transition={{ delay: showNames ? 0.5 : 0, duration: 1.5 }}
      >
        <CoupleNames hideSecondary={state === 'splash'} />
      </motion.div>
    </div>
  )
}
