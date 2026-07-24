import { motion } from 'framer-motion'
import { MonogramOval } from '@/components/ui/MonogramOval'

interface RestartButtonProps {
  onRestart: () => void
}

export function RestartButton({ onRestart }: RestartButtonProps) {
  return (
    <motion.section
      className="w-full min-h-screen bg-wedding-splash-bg flex flex-col items-center justify-center py-24 select-none"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <button
        onClick={onRestart}
        aria-label="Restart"
        className="group flex flex-col items-center gap-3 cursor-pointer"
      >
        <MonogramOval />

        <motion.span
          className="text-center font-sans text-body font-medium uppercase leading-[1.14] tracking-[0.48px] text-wedding-monogram-ink/50"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1],
            transition: { delay: 0.9, duration: 1.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
          }}
        >
          Restart
        </motion.span>
      </button>
    </motion.section>
  )
}
