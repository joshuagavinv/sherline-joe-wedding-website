import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { assetUrl } from '@/lib/utils'

// Building layers: width × height derived from each SVG's viewBox
// parallaxRange: back layers move more (deeper), front layers move less
const BUILDING_LAYERS = [
  { src: assetUrl('/assets/Venue/venue_back_rooms.svg'),  w: 1734, h: 118, z: 1, range: 90 },
  { src: assetUrl('/assets/Venue/venue_main_tower.svg'),  w: 174,  h: 320, z: 2, range: 55 },
  { src: assetUrl('/assets/Venue/venue_front_gates.svg'), w: 1670, h: 41,  z: 3, range: 25 },
  { src: assetUrl('/assets/Venue/venue_balcony.svg'),     w: 175,  h: 76,  z: 4, range: 12 },
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
  const y0 = useTransform(scrollYProgress, [0, 1], [BUILDING_LAYERS[0].range, -BUILDING_LAYERS[0].range])
  const y1 = useTransform(scrollYProgress, [0, 1], [BUILDING_LAYERS[1].range, -BUILDING_LAYERS[1].range])
  const y2 = useTransform(scrollYProgress, [0, 1], [BUILDING_LAYERS[2].range, -BUILDING_LAYERS[2].range])
  const y3 = useTransform(scrollYProgress, [0, 1], [BUILDING_LAYERS[3].range, -BUILDING_LAYERS[3].range])
  const layerY = [y0, y1, y2, y3]

  return (
    <div ref={containerRef} className="relative overflow-hidden" style={{ height: 320 }}>
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

      {CLOUDS.map((cloud, i) => (
        <div
          key={i}
          className={`absolute pointer-events-none animate-cloud ${cloud.className}`}
          style={{
            top: cloud.top,
            left: 0,
            zIndex: 10,
            '--cloud-duration': cloud.duration,
            '--cloud-delay': cloud.delay,
          } as React.CSSProperties}
        >
          <img src={cloud.src} width={cloud.vw} height={cloud.vh} alt="" className="w-full h-auto" />
        </div>
      ))}
    </div>
  )
}
