import { motion } from 'framer-motion'

interface AudioToggleProps {
  muted: boolean
  onToggle: () => void
}

/**
 * Sticky volume / mute toggle for the background music, pinned to the
 * bottom-left of the viewport (Figma nodes 195:24 "on" / 195:26 "mute").
 *
 * The visible tile is the Figma 24×24 frosted square; a `before:` pseudo-element
 * pads the tap target out to 44×44 without changing the visual.
 */
export function AudioToggle({ muted, onToggle }: AudioToggleProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={muted ? 'Unmute music' : 'Mute music'}
      aria-pressed={muted}
      className="fixed left-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[70] size-6 cursor-pointer rounded bg-white/[0.24] backdrop-blur-[2px] before:absolute before:-inset-2.5 before:content-['']"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <img
        src={muted ? '/assets/icons/volume-off.svg' : '/assets/icons/volume-on.svg'}
        alt=""
        width={24}
        height={24}
        className="block size-6"
      />
    </motion.button>
  )
}
