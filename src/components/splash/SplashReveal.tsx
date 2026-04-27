import { motion } from 'framer-motion'

interface SplashRevealProps {
  onComplete: () => void
}

export function SplashReveal({ onComplete }: SplashRevealProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-wedding-warm-brown flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.8, duration: 0.7 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-garamond text-subhead text-wedding-cream uppercase tracking-ui-label">
          You&apos;re invited
        </p>
        <p className="font-serif text-heading text-wedding-cream mt-2">
          Joseph & Sherline
        </p>
        <p className="font-sans text-body text-wedding-cream/70 mt-2">
          18 · 12 · 2026
        </p>
      </motion.div>
    </motion.div>
  )
}
