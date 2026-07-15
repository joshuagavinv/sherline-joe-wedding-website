import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LottiePlayer } from '@/components/ui/LottiePlayer'

type Phase = 'idle' | 'expanding'

interface SplashPageProps {
  onComplete: () => void
  /** Fires the moment the oval starts expanding — lets the parent reveal the shared names overlay in sync. */
  onExpandStart?: () => void
  autoExpand?: boolean
}

export function SplashPage({ onComplete, onExpandStart, autoExpand = false }: SplashPageProps) {
  const [phase, setPhase] = useState<Phase>(autoExpand ? 'expanding' : 'idle')
  const expanding = phase === 'expanding'

  // Auto-expand path (e.g. Storybook): announce expansion on mount.
  useEffect(() => {
    if (autoExpand) onExpandStart?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleTap() {
    if (!expanding) {
      setPhase('expanding')
      onExpandStart?.()
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-wedding-splash-bg flex items-center justify-center overflow-hidden cursor-pointer select-none"
      onClick={handleTap}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Cream oval — expands to fill the screen ── */}
      <motion.div
        className="absolute bg-wedding-monogram-bg"
        style={{ width: 144, height: 191, borderRadius: '50%' }}
        // Explicit initial scale: on the restart path the page mounts already in
        // 'expanding', so without this Framer Motion would treat scale:8 as the
        // mount value and skip the animation — firing onComplete instantly and
        // snapping straight to the InvitedBanner. Starting at scale:1 forces the
        // full 1→8 expansion to play whether we arrive via tap or via restart.
        initial={{ scale: 1 }}
        animate={expanding ? { scale: 8 } : { scale: 1 }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1.0] }}
        onAnimationComplete={() => {
          if (expanding) onComplete()
        }}
      />

      {/* ── Static halo ring — single thin cream outline hugging the oval (Figma 91:99,
           157×205, 1px #F3EEE4); fades out as expansion begins ── */}
      <motion.div
        className="absolute pointer-events-none border border-wedding-monogram-bg"
        style={{ width: 157, height: 205, borderRadius: '50%' }}
        animate={expanding ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* ── Two cream oval rings — ripple outward on tap (monogram-bg, matching the
           halo ring and oval fill, so the ripple stays in the warm cream tone
           instead of a stark white) ── */}
      <AnimatePresence>
        {expanding && [
          { strokeWidth: 1, delay: 0 },
          { strokeWidth: 2, delay: 0.15 },
        ].map(({ strokeWidth, delay }, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none border-wedding-monogram-bg"
            style={{ width: 144, height: 191, borderRadius: '50%', borderStyle: 'solid', borderWidth: strokeWidth }}
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
        style={{ width: 205, height: 250, zIndex: 10, clipPath: 'ellipse(72px 95.5px at 50% 50%)' }}
        animate={expanding ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <LottiePlayer src="/assets/Monogram/monogram.json" />
      </motion.div>

      {/* Names live in App as a single persistent overlay (shared across splash → main),
          so they never remount or shift during the transition. */}

      {/* ── Tap to start ── */}
      <AnimatePresence>
        {!expanding && (
          <motion.p
            className="absolute top-[calc(50%+115px)] text-center font-sans text-body font-medium uppercase leading-[1.14] tracking-[0.48px] text-wedding-monogram-ink/50"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1],
              transition: { delay: 0.9, duration: 1.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
            }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            Tap to start
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
