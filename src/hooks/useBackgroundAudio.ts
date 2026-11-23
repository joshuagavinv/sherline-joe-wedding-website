import { useCallback, useEffect, useRef } from 'react'

/**
 * Looping background track.
 *
 * Browsers (iOS Safari especially) only let audio start inside a user gesture,
 * but we want the music to begin *after* the splash expansion — ~1.8s after the
 * tap. So `unlock()` runs inside the tap handler: a muted play()/pause() that
 * marks the element as user-activated. `play()` can then start it for real later.
 */
export function useBackgroundAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const wantsPlayRef = useRef(false)

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audio.preload = 'auto'
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [src])

  const unlock = useCallback(() => {
    const audio = audioRef.current
    // Already playing (e.g. on restart) — leave it alone.
    if (!audio || !audio.paused) return
    audio.muted = true
    audio
      .play()
      .then(() => {
        // If play() was requested while unlocking, keep going instead of pausing.
        if (wantsPlayRef.current) {
          audio.muted = false
          return
        }
        audio.pause()
        audio.currentTime = 0
        audio.muted = false
      })
      .catch(() => {
        audio.muted = false
      })
  }, [])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    wantsPlayRef.current = true
    audio.muted = false
    if (!audio.paused) return
    // Autoplay can still be refused (no gesture, e.g. Storybook autoExpand) — fail silently.
    audio.play().catch(() => {})
  }, [])

  return { unlock, play }
}
