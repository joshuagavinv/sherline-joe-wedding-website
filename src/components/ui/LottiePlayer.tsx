import { useEffect, useState } from 'react'
import Lottie, { type LottieRef } from 'lottie-react'
import { cn } from '@/lib/utils'

interface LottiePlayerProps {
  /** Inline Lottie JSON (from a direct import). Mutually exclusive with `src`. */
  animationData?: unknown
  /** Path to a JSON file under `public/` (e.g. `/assets/confetti.json`). Fetched lazily. */
  src?: string
  loop?: boolean
  autoplay?: boolean
  className?: string
  lottieRef?: LottieRef
}

export function LottiePlayer({
  animationData: dataProp,
  src,
  loop = true,
  autoplay = true,
  className,
  lottieRef,
}: LottiePlayerProps) {
  const [data, setData] = useState<unknown>(dataProp ?? null)

  useEffect(() => {
    if (!src) return
    let cancelled = false
    fetch(src)
      .then(r => r.json())
      .then(json => { if (!cancelled) setData(json) })
    return () => { cancelled = true }
  }, [src])

  if (!data) return null

  return (
    <Lottie
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      lottieRef={lottieRef}
      className={cn('w-full h-full', className)}
    />
  )
}
