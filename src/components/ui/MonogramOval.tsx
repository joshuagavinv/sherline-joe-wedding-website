import { LottiePlayer } from '@/components/ui/LottiePlayer'

/** Cream oval badge with halo ring and monogram — matches the SplashPage idle state. */
export function MonogramOval() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 157, height: 205 }}>
      {/* Halo ring — 157×205, 1px cream outline */}
      <div
        className="absolute inset-0 pointer-events-none border border-wedding-cream"
        style={{ borderRadius: '50%' }}
      />
      {/* Cream fill oval */}
      <div
        className="absolute bg-wedding-cream"
        style={{ width: 144, height: 191, borderRadius: '50%' }}
      />
      {/* Monogram Lottie — larger than oval so botanicals overlap the edge */}
      <div
        className="absolute pointer-events-none"
        style={{ width: 205, height: 250, zIndex: 10, clipPath: 'ellipse(72px 95.5px at 50% 50%)' }}
      >
        <LottiePlayer src="/assets/Monogram/monogram.json" />
      </div>
    </div>
  )
}
