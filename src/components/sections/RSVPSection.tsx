import { motion } from 'framer-motion'

export function RSVPSection() {
  return (
    <section id="rsvp" className="px-8 pt-16 pb-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-serif text-heading uppercase text-wedding-dark-brown">RSVP</h2>
        <p className="mt-2 font-sans text-body font-medium tracking-[-0.24px] text-wedding-dark-brown">
          RSVP via Pentamoo
        </p>
      </motion.div>
    </section>
  )
}
