import { motion } from 'framer-motion'

const events = [
  {
    title: 'Holy Matrimony',
    time: '11:30 AM',
    venue: 'Mary Immaculate Catholic Church',
    address: 'Waverley NSW',
  },
  {
    title: 'The Reception',
    time: '5:30 PM',
    venue: 'Grand Banquet Room at Curzon Hall',
    address: 'Marsfield NSW',
  },
]

export function WeddingDay() {
  return (
    <section className="bg-wedding-cream px-8 py-16">
      <motion.p
        className="font-garamond text-subhead font-medium text-wedding-warm-brown uppercase tracking-ui-label"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        The Wedding Day
      </motion.p>

      <div className="mt-8 space-y-6">
        {events.map((event, i) => (
          <motion.div
            key={event.title}
            className="border border-wedding-dark-brown/20 bg-white p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
          >
            <h3 className="font-serif text-heading text-wedding-dark-brown">
              {event.title}
            </h3>
            <p className="mt-3 font-sans text-body font-medium text-wedding-warm-brown">
              {event.time}
            </p>
            <p className="mt-1 font-sans text-body text-wedding-dark-brown/70">
              {event.venue}
            </p>
            <p className="font-sans text-caption text-wedding-dark-brown/50">
              {event.address}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
