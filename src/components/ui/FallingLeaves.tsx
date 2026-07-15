import { motion } from 'framer-motion'
import { LottiePlayer } from '@/components/ui/LottiePlayer'

const LEAF_BASE = '/assets/Landing/01%20Falling%20leaves/leaves%20json/'

// Falling leaves that drift down over the whole hero and IN FRONT of the couple
// names. Full-viewport overlay (not part of InvitedBanner) so it can sit above
// the App-level names overlay (which lives at z-60); see App.tsx.
//
// Leaf count scales with the viewport via `tier` (pure CSS breakpoints — no JS
// resize listener), so phones get several leaves instead of just one:
//   'base' → always visible (mobile)
//   'sm'   → added from 640px up (small tablets)
//   'lg'   → added again from 1024px up (desktop)
// `left` is viewport-relative; `drift` is the horizontal sway in px.
const TIER_CLASS = {
  base: '',
  sm: 'hidden sm:block',
  lg: 'hidden lg:block',
} as const

const LEAVES = [
  // base — visible on mobile
  { src: 'landing_leaf_3.json', left: '14%', size: 72, duration: 8.5,  delay: 0.0, drift: 20,  tier: 'base' },
  { src: 'landing_leaf_1.json', left: '42%', size: 76, duration: 7.4,  delay: 1.6, drift: -24, tier: 'base' },
  { src: 'landing_leaf_2.json', left: '68%', size: 64, duration: 9.6,  delay: 0.8, drift: 18,  tier: 'base' },
  { src: 'landing_leaf_5.json', left: '88%', size: 58, duration: 8.2,  delay: 3.0, drift: -16, tier: 'base' },
  // sm — added on small tablets and up
  { src: 'landing_leaf_4.json', left: '4%',  size: 68, duration: 9.0,  delay: 1.2, drift: 24,  tier: 'sm' },
  { src: 'landing_leaf_2.json', left: '30%', size: 56, duration: 10.2, delay: 3.6, drift: 22,  tier: 'sm' },
  { src: 'landing_leaf_3.json', left: '55%', size: 60, duration: 7.0,  delay: 2.4, drift: -20, tier: 'sm' },
  // lg — added on desktop
  { src: 'landing_leaf_1.json', left: '22%', size: 62, duration: 8.8,  delay: 0.5, drift: -22, tier: 'lg' },
  { src: 'landing_leaf_5.json', left: '78%', size: 74, duration: 10.5, delay: 1.9, drift: 16,  tier: 'lg' },
  { src: 'landing_leaf_4.json', left: '95%', size: 54, duration: 9.2,  delay: 2.8, drift: 20,  tier: 'lg' },
] as const

export function FallingLeaves() {
  return (
    <div className="absolute inset-x-0 top-0 h-screen overflow-hidden pointer-events-none z-[65]">
      {LEAVES.map((leaf, i) => (
        <motion.div
          key={i}
          className={`absolute ${TIER_CLASS[leaf.tier]}`}
          style={{ left: leaf.left, top: 0, width: leaf.size, height: leaf.size }}
          initial={{ y: '-15vh', x: 0, opacity: 0 }}
          animate={{ y: '110vh', x: [0, leaf.drift, 0], opacity: [0, 1, 1, 0] }}
          transition={{
            y: { duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: 'linear' },
            x: { duration: leaf.duration / 2, delay: leaf.delay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
            opacity: { duration: leaf.duration, delay: leaf.delay, repeat: Infinity, times: [0, 0.1, 0.9, 1], ease: 'easeInOut' },
          }}
        >
          <LottiePlayer src={`${LEAF_BASE}${leaf.src}`} />
        </motion.div>
      ))}
    </div>
  )
}
