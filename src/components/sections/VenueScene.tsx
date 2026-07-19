import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { assetUrl } from '@/lib/utils'

// Building layers: width × height derived from each SVG's viewBox
// parallaxRange: back layers move more (deeper), front layers move less
//
// z-stack (back → front):  back_rooms(1) · main_tower(2) · [cream mask · 3] ·
// front_gates(4) · balcony(5). The cream MASK_Z sits between the two tall back
// towers and the two front "base" layers. During the parallax entry every layer
// is pushed down past the ground line; the back towers slide behind the cream
// mask so their moving bottoms are hidden, while the front base layers stay in
// front of the cream so the castle still reads as grounded on it.
const MASK_Z = 3
const BUILDING_LAYERS = [
  { src: assetUrl('/assets/Venue/venue_back_rooms.svg'),  w: 1734, h: 118, z: 1, range: 90 },
  { src: assetUrl('/assets/Venue/venue_main_tower.svg'),  w: 174,  h: 320, z: 2, range: 55 },
  { src: assetUrl('/assets/Venue/venue_front_gates.svg'), w: 1670, h: 41,  z: 4, range: 25 },
  { src: assetUrl('/assets/Venue/venue_balcony.svg'),     w: 175,  h: 76,  z: 5, range: 12 },
]

const CLOUDS = [
  { src: assetUrl('/assets/Venue/cloud_1.svg'), className: 'w-40', top: '28%', duration: '30s', delay: '-5s',  vw: 224, vh: 25 },
  { src: assetUrl('/assets/Venue/cloud_2.svg'), className: 'w-72', top: '15%', duration: '45s', delay: '-20s', vw: 501, vh: 80 },
  { src: assetUrl('/assets/Venue/cloud_3.svg'), className: 'w-24', top: '35%', duration: '35s', delay: '-12s', vw: 139, vh: 24 },
  { src: assetUrl('/assets/Venue/cloud_4.svg'), className: 'w-12', top: '22%', duration: '22s', delay: '-8s',  vw: 55,  vh: 17 },
]

export function VenueScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress from when the section enters the bottom of the
  // viewport to when it leaves the top — full travel range for parallax.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Four explicit useTransform calls (hooks can't run in loops).
  // Back layer moves most, front layer moves least → 3D depth illusion.
  // Parallax only during entry (0→0.5); layers settle to rest once fully in view.
  const y0 = useTransform(scrollYProgress, [0, 0.5, 1], [BUILDING_LAYERS[0].range, 0, 0])
  const y1 = useTransform(scrollYProgress, [0, 0.5, 1], [BUILDING_LAYERS[1].range, 0, 0])
  const y2 = useTransform(scrollYProgress, [0, 0.5, 1], [BUILDING_LAYERS[2].range, 0, 0])
  const y3 = useTransform(scrollYProgress, [0, 0.5, 1], [BUILDING_LAYERS[3].range, 0, 0])
  const layerY = [y0, y1, y2, y3]

  return (
    // NOTE: the container itself is NOT `overflow-hidden`. Clipping at the box
    // edge cut the layers off hard at the cream section below — making the castle
    // look like it sank *behind* the cream. Instead, the parallax overshoot is
    // hidden selectively by the cream MASK below: back towers slide behind it,
    // front base layers stay in front so the castle reads as grounded ON the cream.
    // Horizontal overflow from the oversized layers is still clipped by the
    // page-level `overflow-x-clip` ancestor. Only the drifting clouds need
    // clipping, so they get their own overflow-hidden sky box below.
    <div ref={containerRef} className="relative" style={{ height: 320 }}>
      {/* Cream mask — a cream panel starting at the ground line and extending
          down into the cream section. It sits ABOVE the back towers (z 1–2) but
          BELOW the front base layers (z 4–5), so the towers' parallax bottoms are
          hidden as they slide over the cream while the base stays visible on it.
          Full-width (100vw); anything wider is clipped by `overflow-x-clip`. */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-full w-screen bg-wedding-monogram-bg pointer-events-none"
        style={{ height: 140, zIndex: MASK_Z }}
      />

      {/* Sky / clouds — clipped to the scene box so they never spill past its edges */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 10 }}>
        {CLOUDS.map((cloud, i) => (
          <div
            key={i}
            className={`absolute pointer-events-none animate-cloud ${cloud.className}`}
            style={{
              top: cloud.top,
              left: 0,
              '--cloud-duration': cloud.duration,
              '--cloud-delay': cloud.delay,
            } as React.CSSProperties}
          >
            <img src={cloud.src} width={cloud.vw} height={cloud.vh} alt="" className="w-full h-auto" />
          </div>
        ))}
      </div>

      {BUILDING_LAYERS.map((layer, i) => (
        <motion.div
          key={layer.src}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: layer.w,
            height: layer.h,
            left: '50%',
            x: '-50%',
            y: layerY[i],
            backgroundImage: `url(${layer.src})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            zIndex: layer.z,
          }}
        />
      ))}
    </div>
  )
}
