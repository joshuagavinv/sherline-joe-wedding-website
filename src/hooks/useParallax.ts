import { useRef } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'

export function useParallax(speed = 0.3): {
  ref: React.RefObject<HTMLDivElement>
  y: MotionValue<string>
} {
  const ref = useRef<HTMLDivElement>(null!)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', `${speed * 100}%`])
  return { ref, y }
}
