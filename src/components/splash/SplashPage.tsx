import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logoSvg from '@/assets/logo.svg'

type Phase = 'idle' | 'expanding'

interface SplashPageProps {
  onComplete: () => void
}

export function SplashPage({ onComplete }: SplashPageProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const expanding = phase === 'expanding'

  function handleTap() {
    if (!expanding) setPhase('expanding')
  }

  return (
    <motion.div
      className="fixed inset-0 bg-wedding-warm-brown flex items-center justify-center overflow-hidden cursor-pointer select-none"
      onClick={handleTap}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Cream oval — expands to fill the screen ── */}
      <motion.div
        className="absolute bg-wedding-cream"
        style={{ width: 144, height: 191, borderRadius: '50%' }}
        animate={expanding ? { scale: 8 } : { scale: 1 }}
        transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
        onAnimationComplete={() => {
          if (expanding) onComplete()
        }}
      />

      {/* ── Logo (warm-brown ellipse + cream oval + monogram + botanical, all-in-one Figma export) ── */}
      <motion.img
        src={logoSvg}
        alt="Joseph & Sherline"
        className="absolute pointer-events-none"
        style={{ width: 157, height: 205, zIndex: 10 }}
        animate={expanding ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      />

      {/* ── Names — fade in over the expanding cream oval ── */}
      <AnimatePresence>
        {expanding && (
          <motion.div
            className="absolute z-20 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.55 }}
          >
            <p className="font-serif text-display text-wedding-dark-brown leading-none">
              Joseph
            </p>
            <p className="font-serif text-connector text-wedding-dark-brown/50 my-1">
              and
            </p>
            <p className="font-serif text-display text-wedding-dark-brown leading-none">
              Sherline
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tap to start ── */}
      <AnimatePresence>
        {!expanding && (
          <motion.p
            className="absolute bottom-16 font-sans text-body font-medium uppercase tracking-ui-label text-wedding-cream/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.55, 1] }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.9, duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
          >
            Tap to start
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
