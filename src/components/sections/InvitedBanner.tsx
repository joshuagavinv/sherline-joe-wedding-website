import { motion } from 'framer-motion'

export function InvitedBanner() {
  return (
    <motion.section
      className="relative overflow-hidden bg-wedding-cream px-8 pt-16 text-center text-wedding-dark-brown"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative z-10 pb-64">
        <p className="font-garamond text-subhead font-medium">
          You&apos;re invited to the wedding of
        </p>

        <div className="mt-6">
          <p className="font-serif text-display leading-none">Joseph</p>
          <p className="font-serif text-connector text-wedding-dark-brown/50 my-1">and</p>
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

        <p className="mt-8 font-sans text-body text-wedding-dark-brown/70">
          Friday, December 18th 2026
          <span className="mx-2">·</span>
          Sydney, Australia
        </p>
      </div>

      {/* Plant illustration — 1512px wide, centered, sits at the bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1512px] pointer-events-none">
        <img src="/assets/plants-bg.svg" alt="" className="w-full" />
      </div>
    </motion.section>
  )
}
