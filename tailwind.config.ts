import type { Config } from 'tailwindcss'
import { weddingColors } from './src/design-tokens/colors'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      mobile: '402px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        wedding: weddingColors,
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        garamond: ['"EB Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        display: ['56px', { lineHeight: '1' }],
        heading: ['32px', { lineHeight: '1.2' }],
        connector: ['26px', { lineHeight: '1.2' }],
        subhead: ['16.19px', { lineHeight: '1.4' }],
        parentage: ['9.52px', { lineHeight: '1.5' }],
        body: ['12px', { lineHeight: '1.6' }],
        caption: ['10px', { lineHeight: '1.5' }],
      },
      lineHeight: {
        // Tight leading for short single/double-line micro-copy set in
        // text-body (event times, venue lines, parent names, UI tickers) —
        // the 1.6 body default reads too loose at that scale.
        label: '1.14',
        // Our Story's multi-line paragraph copy — tighter than the 1.6 body
        // default but more open than `label`, for long-form readability.
        prose: '1.32',
      },
      letterSpacing: {
        'ui-label': '0.48em',
      },
      maxWidth: {
        canvas: '402px',
      },
      borderWidth: {
        photo: '6px',
      },
      animation: {
        cloud: 'cloudDrift var(--cloud-duration, 30s) linear var(--cloud-delay, 0s) infinite',
      },
    },
  },
  plugins: [],
}

export default config
