import { motion } from 'framer-motion'

export function Farewell() {
  return (
    <section className="px-8 pb-[200px] text-center">
      <motion.h2
        className="font-serif text-heading text-wedding-dark-brown"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        See you in December
      </motion.h2>

      <motion.p
        className="mt-4 font-sans text-body font-medium text-wedding-dark-brown"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        We can’t wait to celebrate with you.
        <br />
        ♡ Joseph &amp; Sherline
      </motion.p>
    </section>
  )
}
