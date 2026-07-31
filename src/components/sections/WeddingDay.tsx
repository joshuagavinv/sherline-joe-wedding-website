import { motion } from 'framer-motion'
import { assetUrl } from '@/lib/utils'

// "The Wedding Day" arc — the exact Figma export (node 175:1576) as an outlined
// SVG, so the curve, letter rotation, weight and monogram-ink colour all match
// the design 1:1 (no hand-built textPath to keep in sync). Rendered at its
// native 120×26 so it reads at the same size as the Figma artwork.
function WeddingDayArc() {
  return (
    <img
      src={assetUrl('/assets/the-wedding-day.svg')}
      alt="The Wedding Day"
      width={120}
      height={26}
      className="mx-auto block"
    />
  )
}

const events = [
  {
    title: 'Holy Matrimony',
    time: '11:30 AM',
    venueLines: ['Mary Immaculate Catholic Church,', 'Waverley NSW, Australia'],
  },
  {
    title: 'The Reception',
    time: '6:00 PM',
    venueLines: ['Grand Banquet Room at Curzon Hall,', 'Marsfield NSW, Australia'],
  },
]

export function WeddingDay() {
  return (
    // `relative z-10` lifts this section above the VenueScene cream MASK (z-3),
    // which extends ~140px past the castle scene and would otherwise paint over
    // the "The Wedding Day" arc that sits at the top of this section.
    <section className="relative z-10 bg-wedding-monogram-bg px-8 py-16 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <WeddingDayArc />
      </motion.div>

      <div className="mt-9 flex flex-col gap-[72px]">
        {events.map((event, i) => (
          <motion.div
            key={event.title}
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
          >
            <h3 className="font-serif text-heading text-wedding-dark-brown">
              {event.title}
            </h3>
            <div className="flex flex-col items-center gap-2 font-sans text-body font-medium leading-label text-wedding-dark-brown tracking-[-0.24px]">
              <p>{event.time}</p>
              <div>
                {event.venueLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
