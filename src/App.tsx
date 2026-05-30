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

type AppState = 'splash' | 'main'

export default function App() {
  const [state, setState] = useState<AppState>('splash')

  const handleSplashComplete = useCallback(() => setState('main'), [])
  const handleRestart = useCallback(() => {
    setState('splash')
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <AnimatePresence mode="wait">
      {state === 'splash' ? (
        <SplashPage key="splash" onComplete={handleSplashComplete} />
      ) : (
        <motion.div
          key="main"
          className="min-h-screen w-full overflow-x-clip bg-wedding-cream"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
