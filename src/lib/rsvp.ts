export interface RSVPPayload {
  name: string
  guestCount: string
  dietary: string
  message: string
  attending: 'yes' | 'no'
}

export async function submitRSVP(payload: RSVPPayload): Promise<void> {
  const url = import.meta.env.VITE_RSVP_URL
  if (!url) throw new Error('VITE_RSVP_URL is not set')

  const form = new URLSearchParams({
    name: payload.name,
    guestCount: payload.guestCount,
    dietary: payload.dietary,
    message: payload.message,
    attending: payload.attending,
  })

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })

  if (!res.ok) throw new Error(`RSVP submission failed: ${res.status}`)
}
