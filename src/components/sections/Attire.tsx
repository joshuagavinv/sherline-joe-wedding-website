import { motion } from 'framer-motion'

export function Attire() {
  return (
    <section className="px-8 py-16">
      <motion.h2
        className="font-serif text-heading text-wedding-dark-brown"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Attire
      </motion.h2>

      <div className="mt-8 grid grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <p className="font-sans text-caption font-medium uppercase tracking-ui-label text-wedding-warm-brown">
            Gentlemen
          </p>
          <p className="mt-2 font-sans text-body text-wedding-dark-brown">
            Black tie
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="font-sans text-caption font-medium uppercase tracking-ui-label text-wedding-warm-brown">
            Ladies
          </p>
          <p className="mt-2 font-sans text-body text-wedding-dark-brown">
            Pastel earth tones.
          </p>
          <p className="mt-1 font-sans text-caption text-wedding-dark-brown/60">
            No red, no pink, no white
          </p>
        </motion.div>
      </div>

      <motion.p
        className="mt-8 font-sans text-caption text-wedding-dark-brown/60 border-t border-wedding-dark-brown/10 pt-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        December is peak summer in Sydney, with warm sunny days around 20–30°C
        and mild evenings. We suggest bringing a light layer, plus sunscreen and
        sunglasses for any outdoor moments.
      </motion.p>
    </section>
  )
}
