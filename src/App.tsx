import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SplashPage } from '@/components/splash/SplashPage'
import { PageShell } from '@/components/layout/PageShell'
import { InvitedBanner } from '@/components/sections/InvitedBanner'
import { OurStory } from '@/components/sections/OurStory'
import { WeddingDay } from '@/components/sections/WeddingDay'
import { Attire } from '@/components/sections/Attire'
import { Logistics } from '@/components/sections/Logistics'
import { RSVPSection } from '@/components/sections/RSVPSection'
import { Gallery } from '@/components/sections/Gallery'
import { RestartButton } from '@/components/sections/RestartButton'

type AppState = 'splash' | 'main'

export default function App() {
  const [state, setState] = useState<AppState>('splash')

  const handleSplashComplete = useCallback(() => setState('main'), [])
  const handleRestart = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setState('splash'), 400)
  }, [])

  return (
    <AnimatePresence>
      {state === 'splash' ? (
        <SplashPage key="splash" onComplete={handleSplashComplete} />
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PageShell>
            <InvitedBanner />
            <OurStory />
            <WeddingDay />
            <Attire />
            <Logistics />
            <RSVPSection />
            <Gallery />
            <RestartButton onRestart={handleRestart} />
          </PageShell>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
