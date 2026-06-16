import { motion } from 'framer-motion'

interface StickyRSVPButtonProps {
  /** Id of the element to smooth-scroll to on tap. Defaults to the RSVP section anchor. */
  targetId?: string
  /** Overrides the default scroll-to-target behaviour when provided. */
  onClick?: () => void
}

/**
 * Semi-transparent "RSVP" navigation tab — a floating pill anchored near the
 * bottom of the page. Frosted glass over the content (Figma node 91:1419): a
 * 16%-opacity ink fill with a backdrop blur and cream label. Floats with side
 * margins and a gap above the bottom edge (plus the iOS safe-area inset) so it
 * never sits flush against the screen. Spans the page canvas width, centered on
 * wider screens so it tracks the 402px layout. Tapping smooth-scrolls to the RSVP
 * section (falls back to the bottom of the page if that anchor isn't mounted yet).
 */
export function StickyRSVPButton({ targetId = 'rsvp', onClick }: StickyRSVPButtonProps) {
  function handleClick() {
    if (onClick) {
      onClick()
      return
    }
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }
  }

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-[70] flex justify-center pointer-events-none"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
    >
      <div
        className="flex w-full max-w-canvas justify-center"
        // Lift the tab off the bottom edge, and keep clear of the iOS home indicator.
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={handleClick}
          // Snug, content-sized pill (Figma px 10px / py 8px) — not a full-width bar.
          className="pointer-events-auto rounded bg-wedding-ink/[0.16] px-2.5 py-2 backdrop-blur-md font-sans text-body tracking-tight text-wedding-cream text-center transition-transform active:scale-[0.98]"
        >
          RSVP
        </button>
      </div>
    </motion.div>
  )
}
