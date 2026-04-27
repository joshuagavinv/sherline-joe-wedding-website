import { motion } from 'framer-motion'

export function InvitedBanner() {
  return (
    <motion.section
      className="bg-wedding-warm-brown px-8 py-16 text-center text-wedding-cream"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <p className="font-garamond text-subhead font-medium">
        You&apos;re invited to the wedding of
      </p>

      <div className="mt-6">
        <p className="font-serif text-display leading-none">Joseph</p>
        <p className="font-serif text-connector text-wedding-cream/70 my-1">and</p>
        <p className="font-serif text-display leading-none">Sherline</p>
      </div>

      <div className="mt-8 space-y-1">
        <p className="font-garamond text-parentage font-bold uppercase tracking-widest">
          Son of Tjan Soen Eng &amp; Mirjam Nugraha
        </p>
        <p className="font-garamond text-parentage font-bold uppercase tracking-widest">
          Daughter of Alouisius Maseimilian &amp; Venny Martadinata
        </p>
      </div>

      <p className="mt-8 font-sans text-body text-wedding-cream/80">
        Friday, December 18th 2026
        <span className="mx-2">·</span>
        Sydney, Australia
      </p>
    </motion.section>
  )
}
