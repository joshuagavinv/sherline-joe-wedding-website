import { motion } from 'framer-motion'
import { LottiePlayer } from '@/components/ui/LottiePlayer'

const LEAF_BASE = '/assets/Landing/01%20Falling%20leaves/leaves%20json/'

// Falling leaves that drift down over the whole hero and IN FRONT of the couple
// names. This is a full-viewport overlay rather than part of InvitedBanner so it
// can sit above the App-level names overlay (which lives at z-60); see App.tsx.
//
// `left` is viewport-relative; `mobile` flags the single leaf kept on small
// screens — every other leaf is `hidden sm:block`, so phones get one leaf and
// tablets/desktop get the full drift.
const LEAVES = [
  { src: 'landing_leaf_3.json', left: '48%', size: 80, duration: 8.0,  delay: 0.0, drift: 18,  mobile: true },
  { src: 'landing_leaf_1.json', left: '10%', size: 80, duration: 7.0,  delay: 1.4, drift: 22 },
  { src: 'landing_leaf_2.json', left: '28%', size: 80, duration: 9.0,  delay: 2.6, drift: -26 },
  { src: 'landing_leaf_4.json', left: '70%', size: 64, duration: 10.0, delay: 0.8, drift: -16 },
  { src: 'landing_leaf_5.json', left: '88%', size: 64, duration: 7.5,  delay: 3.2, drift: 24 },
]

export function FallingLeaves() {
  return (
    <div className="absolute inset-x-0 top-0 h-screen overflow-hidden pointer-events-none z-[65]">
      {LEAVES.map((leaf, i) => (
        <motion.div
          key={i}
          className={`absolute ${leaf.mobile ? '' : 'hidden sm:block'}`}
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
