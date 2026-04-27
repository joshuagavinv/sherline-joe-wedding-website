import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { submitRSVP, type RSVPPayload } from '@/lib/rsvp'

type Attending = 'yes' | 'no' | null

export function RSVPSection() {
  const [attending, setAttending] = useState<Attending>(null)
  const [name, setName] = useState('')
  const [guestCount, setGuestCount] = useState('1')
  const [dietary, setDietary] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!attending) return
    setStatus('loading')
    try {
      await submitRSVP({ name, guestCount, dietary, message, attending } as RSVPPayload)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="px-8 py-16">
      <motion.h2
        className="font-serif text-heading text-wedding-dark-brown"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        RSVP
      </motion.h2>

      {status === 'success' ? (
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="font-serif text-heading text-wedding-warm-brown">
            {attending === 'yes' ? "We can't wait to see you!" : 'Thank you for letting us know.'}
          </p>
          <p className="mt-3 font-sans text-body text-wedding-dark-brown/60">
            We&apos;ll be in touch with more details soon.
          </p>
        </motion.div>
      ) : (
        <motion.form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          {/* Attending toggle */}
          <div>
            <Label className="mb-3 block">Will you be attending?</Label>
            <div className="flex gap-3">
              {(['yes', 'no'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAttending(v)}
                  className={`flex-1 py-2 font-sans text-body uppercase tracking-ui-label border transition-colors ${
                    attending === v
                      ? 'bg-wedding-warm-brown text-wedding-cream border-wedding-warm-brown'
                      : 'border-wedding-dark-brown/30 text-wedding-dark-brown hover:border-wedding-warm-brown'
                  }`}
                >
                  {v === 'yes' ? 'Joyfully accepts' : 'Regretfully declines'}
                </button>
              ))}
            </div>
          </div>

          {attending === 'yes' && (
            <>
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="guestCount">Number of Guests</Label>
                <Input
                  id="guestCount"
                  type="number"
                  min="1"
                  max="10"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="dietary">Dietary Requirements</Label>
                <Input
                  id="dietary"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="Any allergies or preferences"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="message">Message to the couple</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a message..."
                  rows={4}
                />
              </div>
            </>
          )}

          {attending === 'no' && (
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
          )}

          {attending && (
            <Button
              type="submit"
              className="w-full"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending…' : 'Send RSVP'}
            </Button>
          )}

          {status === 'error' && (
            <p className="text-center font-sans text-caption text-red-500">
              Something went wrong. Please try again.
            </p>
          )}
        </motion.form>
      )}
    </section>
  )
}
