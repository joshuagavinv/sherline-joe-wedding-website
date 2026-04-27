import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SplashPage } from '@/components/splash/SplashPage'
import { SplashReveal } from '@/components/splash/SplashReveal'
import { PageShell } from '@/components/layout/PageShell'
import { InvitedBanner } from '@/components/sections/InvitedBanner'
import { OurStory } from '@/components/sections/OurStory'
import { WeddingDay } from '@/components/sections/WeddingDay'
import { Attire } from '@/components/sections/Attire'
import { Logistics } from '@/components/sections/Logistics'
import { RSVPSection } from '@/components/sections/RSVPSection'
import { Gallery } from '@/components/sections/Gallery'
import { RestartButton } from '@/components/sections/RestartButton'

type AppState = 'splash' | 'reveal' | 'main'

export default function App() {
  const [state, setState] = useState<AppState>('splash')

  const handleTap = useCallback(() => setState('reveal'), [])
  const handleRevealDone = useCallback(() => setState('main'), [])
  const handleRestart = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setState('splash'), 400)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {state === 'splash' && (
          <SplashPage key="splash" onTap={handleTap} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state === 'reveal' && (
          <SplashReveal key="reveal" onComplete={handleRevealDone} />
        )}
      </AnimatePresence>

      {state === 'main' && (
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
      )}
    </>
  )
}
