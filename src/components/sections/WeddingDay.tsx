import { motion } from 'framer-motion'

function WeddingDayArc() {
  return (
    <svg
      viewBox="0 0 240 65"
      width="240"
      height="65"
      aria-hidden="true"
      className="mx-auto overflow-visible"
    >
      <defs>
        <path id="weddingDayArc" d="M 5,55 Q 120,28 235,55" fill="none" />
      </defs>
      <text fontFamily="'EB Garamond', serif" fontSize="16.19" fill="currentColor" fontStyle="italic">
        <textPath href="#weddingDayArc" startOffset="50%" textAnchor="middle">
          The Wedding Day
        </textPath>
      </text>
    </svg>
  )
}

const events = [
  {
    title: 'Holy Matrimony',
    time: '11:30 AM',
    venueLines: ['Mary Immaculate Catholic Church,', 'Waverley NSW'],
  },
  {
    title: 'The Reception',
    time: '6:00 PM',
    venueLines: ['Grand Banquet Room', 'at Curzon Hall, Marsfield NSW'],
  },
]

export function WeddingDay() {
  return (
    <section className="bg-wedding-cream px-8 py-16 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <WeddingDayArc />
        <p className="mt-4 font-garamond text-subhead font-medium text-wedding-dark-brown">
          Friday, December 18th 2026
        </p>
      </motion.div>

      <div className="mt-16 flex flex-col gap-[72px]">
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
            <div className="flex flex-col items-center gap-2 font-sans text-body font-medium text-wedding-dark-brown tracking-[-0.24px]">
              <p className="leading-[1.14]">{event.time}</p>
              <div>
                {event.venueLines.map((line) => (
                  <p key={line} className="leading-[1.26]">{line}</p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
