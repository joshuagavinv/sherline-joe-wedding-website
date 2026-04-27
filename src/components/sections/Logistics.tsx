import { motion } from 'framer-motion'

const hotels = ['Shangri-La Sydney', 'Park Hyatt', 'Four Seasons Hotel']

export function Logistics() {
  return (
    <section className="bg-wedding-cream px-8 py-16 space-y-12">
      {/* Accommodation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-serif text-heading text-wedding-dark-brown">
          Accommodation
        </h2>
        <p className="mt-4 font-sans text-caption text-wedding-dark-brown/70">
          For guests travelling into Sydney, here are convenient hotel options
          near our venues:
        </p>
        <ul className="mt-4 space-y-2">
          {hotels.map((hotel) => (
            <li
              key={hotel}
              className="font-sans text-body text-wedding-dark-brown border-b border-wedding-dark-brown/10 pb-2"
            >
              {hotel}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-sans text-caption text-wedding-dark-brown/50">
          We recommend booking early as weekends fill up quickly.
        </p>
      </motion.div>

      {/* Getting around */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <h2 className="font-serif text-heading text-wedding-dark-brown">
          Getting Around
        </h2>
        <p className="mt-4 font-sans text-caption text-wedding-dark-brown/70">
          Sydney is well-connected by Uber, taxis, and public transport.
        </p>
      </motion.div>
    </section>
  )
}
