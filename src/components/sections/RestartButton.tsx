import { motion } from 'framer-motion'

interface RestartButtonProps {
  onRestart: () => void
}

export function RestartButton({ onRestart }: RestartButtonProps) {
  return (
    <motion.div
      className="py-16 flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="w-px h-12 bg-wedding-dark-brown/20" />
      <button
        onClick={onRestart}
        className="font-sans text-body font-medium uppercase tracking-ui-label text-wedding-warm-brown hover:text-wedding-dark-brown transition-colors"
      >
        Restart
      </button>
    </motion.div>
  )
}
