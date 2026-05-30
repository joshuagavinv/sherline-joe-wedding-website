import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Prepend Vite's base URL to a public asset path. */
export function assetUrl(path: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${path.startsWith('/') ? path.slice(1) : path}`
}
