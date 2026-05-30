import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LottiePlayer } from '@/components/ui/LottiePlayer'
import { CoupleNames } from '@/components/ui/CoupleNames'

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
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1.0] }}
        onAnimationComplete={() => {
          if (expanding) onComplete()
        }}
      />

      {/* ── Two white oval rings — ripple outward on tap ── */}
      <AnimatePresence>
        {expanding && [
          { strokeWidth: 1, delay: 0 },
          { strokeWidth: 2, delay: 0.15 },
        ].map(({ strokeWidth, delay }, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{ width: 144, height: 191, borderRadius: '50%', border: `${strokeWidth}px solid white` }}
            initial={{ scale: 1, opacity: 0.85 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{
              scale: { duration: 1.3, ease: [0.0, 0.0, 0.2, 1.0], delay },
              opacity: { duration: 1.1, ease: 'easeOut', delay: delay + 0.1 },
            }}
          />
        ))}
      </AnimatePresence>

      {/* ── Monogram Lottie animation — intentionally larger than the oval so botanicals overlap the edge ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: 185, height: 226, zIndex: 10, clipPath: 'ellipse(72px 95.5px at 50% 50%)' }}
        animate={expanding ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <LottiePlayer src="/assets/Monogram/monogram.json" />
      </motion.div>

      {/* ── Names — rendered outside the fading wrapper so layoutId source
           stays visible while the splash background exits ── */}
      <AnimatePresence>
        {expanding && (
          <motion.div
            className="absolute z-20"
            style={{ marginTop: -80 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <CoupleNames hideSecondary />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tap to start ── */}
      <AnimatePresence>
        {!expanding && (
          <motion.p
            className="absolute bottom-16 font-sans text-body font-medium uppercase tracking-ui-label text-wedding-cream/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1] }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.9, duration: 1.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          >
            Tap to start
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
