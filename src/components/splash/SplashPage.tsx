import { motion } from 'framer-motion'

interface SplashPageProps {
  onTap: () => void
}

export function SplashPage({ onTap }: SplashPageProps) {
  return (
    <motion.div
      className="flex h-screen w-full flex-col items-center justify-center bg-white select-none cursor-pointer"
      onClick={onTap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center gap-2">
        <motion.p
          className="font-serif text-display text-wedding-dark-brown"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Joseph
        </motion.p>
        <motion.p
          className="font-serif text-connector text-wedding-warm-brown"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          and
        </motion.p>
        <motion.p
          className="font-serif text-display text-wedding-dark-brown"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Sherline
        </motion.p>
      </div>

      <motion.p
        className="absolute bottom-16 font-sans text-body font-medium uppercase tracking-ui-label text-wedding-warm-brown"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.6, 1] }}
        transition={{ delay: 1.2, duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
      >
        Tap to start
      </motion.p>
    </motion.div>
  )
}
