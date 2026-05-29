---
name: lottie
description: Add, play, and troubleshoot Lottie JSON animations in this wedding website. Use when working with Lottie files, animation assets, or the LottiePlayer component.
---

# Lottie Animations

This project uses [`lottie-react@2.4.1`](https://www.npmjs.com/package/lottie-react) to play Lottie JSON animations. A reusable `LottiePlayer` component lives at `src/components/ui/LottiePlayer.tsx`.

---

## Setup (already done)

```bash
npm install lottie-react
```

TypeScript types are included — no `@types/` package needed. Verified with:

```bash
npx tsc --noEmit   # exits 0, no errors
```

---

## Adding a new animation

1. Place the `.json` file in `public/assets/` (e.g. `public/assets/confetti.json`).
2. Use the component with `src` prop (lazy-fetched, keeps bundle size small):

```tsx
import { LottiePlayer } from '@/components/ui/LottiePlayer'

// Fetched from public/ at runtime — zero bundle cost
<LottiePlayer src="/assets/confetti.json" className="w-32 h-32" />
```

Or import inline for small animations where instant paint matters:

```tsx
import confettiData from '/public/assets/confetti.json'
import { LottiePlayer } from '@/components/ui/LottiePlayer'

<LottiePlayer animationData={confettiData} loop={false} />
```

---

## LottiePlayer props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `src` | `string` | — | Path under `public/` (e.g. `/assets/x.json`) |
| `animationData` | `unknown` | — | Inline JSON object (direct import) |
| `loop` | `boolean` | `true` | Set `false` for one-shot animations |
| `autoplay` | `boolean` | `true` | Set `false` to start paused |
| `className` | `string` | — | Tailwind classes; component renders at `w-full h-full` by default — size the parent or pass a class |
| `lottieRef` | `LottieRef` | — | For programmatic control (play/pause/seek) |

Use exactly one of `src` or `animationData` — not both.

---

## Programmatic control

```tsx
import { useRef } from 'react'
import { type LottieRef } from 'lottie-react'
import { LottiePlayer } from '@/components/ui/LottiePlayer'

const ref = useRef<LottieRef['current']>(null)

<LottiePlayer
  src="/assets/confetti.json"
  autoplay={false}
  lottieRef={ref as LottieRef}
  className="w-40 h-40"
/>

// Later:
ref.current?.play()
ref.current?.pause()
ref.current?.goToAndStop(0, true)   // reset to frame 0
```

---

## Sizing gotcha

The `Lottie` component renders an SVG that fills its container. If the animation appears invisible, the container has `height: 0`. Always give the `LottiePlayer` a concrete size:

```tsx
// ✅ explicit size via className
<LottiePlayer src="/assets/x.json" className="w-48 h-48" />

// ✅ sized parent
<div className="w-full aspect-square">
  <LottiePlayer src="/assets/x.json" />
</div>

// ❌ this renders but is invisible — no height
<LottiePlayer src="/assets/x.json" />
```

---

## JSON asset conventions for this project

- Store all Lottie JSON files in `public/assets/` alongside photos
- Reference via `/assets/<name>.json` (rooted at `public/`)
- Prefer `src` prop over inline import for anything > ~10 KB
- Name files descriptively: `confetti.json`, `loading-ring.json`, `heart-pulse.json`

---

## Verifying a new animation works

```bash
# Type-check after adding a new usage
npx tsc --noEmit

# Start dev server
npm run dev
# Open http://localhost:5173 and confirm the animation plays
```
