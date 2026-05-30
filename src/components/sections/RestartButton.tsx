import { motion } from 'framer-motion'
import { LottiePlayer } from '@/components/ui/LottiePlayer'

interface RestartButtonProps {
  onRestart: () => void
}

export function RestartButton({ onRestart }: RestartButtonProps) {
  return (
    <motion.section
      className="w-full min-h-screen bg-wedding-warm-brown flex flex-col items-center justify-center py-24 select-none"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <button
        onClick={onRestart}
        aria-label="Restart"
        className="group flex flex-col items-center gap-8 cursor-pointer"
      >
        {/* ── Cream oval + monogram — mirrors the splash idle state ── */}
        <div className="relative flex items-center justify-center" style={{ width: 144, height: 191 }}>
          <div className="absolute inset-0 bg-wedding-cream" style={{ borderRadius: '50%' }} />
          <div
            className="absolute pointer-events-none"
            style={{ width: 185, height: 226, zIndex: 10, clipPath: 'ellipse(72px 95.5px at 50% 50%)' }}
          >
            <LottiePlayer src="/assets/Monogram/monogram.json" />
          </div>
        </div>

        <span className="font-sans text-body font-medium uppercase tracking-ui-label text-wedding-cream/50 transition-colors group-hover:text-wedding-cream">
          Restart
        </span>
      </button>
    </motion.section>
  )
}
