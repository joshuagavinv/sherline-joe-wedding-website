# CLAUDE.md — Sherline & Joe Wedding Website

## Project overview

Mobile-first wedding website for **Joseph & Sherline**, wedding date **Friday 18 December 2026**, Sydney Australia. Built from scratch as a single-page React app with a cinematic splash-to-scroll experience.

---

## Wedding content (hardcoded)

| Field | Value |
|-------|-------|
| Groom | Joseph |
| Bride | Sherline |
| Date | Friday, December 18th 2026 |
| Location | Sydney, Australia |
| Ceremony | Holy Matrimony · 11:30 AM · Mary Immaculate Catholic Church, Waverley NSW |
| Reception | The Reception · 5:30 PM · Grand Banquet Room at Curzon Hall, Marsfield NSW |
| Groom's parents | Son of Tjan Soen Eng & Mirjam Nugraha |
| Bride's parents | Daughter of Alouisius Maseimilian & Venny Martadinata |
| Dress code (men) | Black tie |
| Dress code (women) | Pastel earth tones — no red, no pink, no white |
| Hotels | Shangri-La Sydney, Park Hyatt, Four Seasons Hotel |
| RSVP endpoint | `VITE_RSVP_URL` env var → Google Apps Script Web App → Google Sheets |

---

## Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Vite 8 + React 19 + TypeScript 6 | `npm run dev` → port 5173 |
| Styling | Tailwind CSS **v3** (not v4) | v3 chosen for shadcn/ui compatibility |
| Animation | Framer Motion 12 | All page transitions and scroll effects |
| UI primitives | shadcn/ui pattern (manual, no CLI) | Radix UI under the hood |
| Component explorer | Storybook 10 | `npm run storybook` → port 6006 |
| RSVP backend | Google Apps Script Web App | POST to `VITE_RSVP_URL` |
| Path alias | `@/` → `src/` | Configured in both `vite.config.ts` and `tsconfig.app.json` |

---

## Design system rules — CRITICAL

**Never hardcode any color, font size, breakpoint, or spacing value in component files.**
All values are design tokens defined in one place and consumed via Tailwind utility classes.

### Single source of truth

```
src/design-tokens/colors.ts   ← all hex values live here
tailwind.config.ts            ← imports colors.ts; defines all tokens
src/index.css                 ← exposes tokens as CSS custom properties
```

### Color tokens (`bg-wedding-*`, `text-wedding-*`, `border-wedding-*`)

| Token | Hex | Usage |
|-------|-----|-------|
| `wedding-warm-brown` | `#B08D68` | Primary fill, buttons, accents |
| `wedding-cream` | `#F3EEEE` | Backgrounds, text on dark |
| `wedding-dark-brown` | `#614D47` | Body text, borders |
| `wedding-sage` | `#E4E6B9` | Accent, photo frame backgrounds |
| `wedding-sage-muted` | `#83887F` | Muted sage variant |
| `wedding-sage-light` | `#B2BE83` | Light sage variant |
| `wedding-photo-border` | `#E4E3C3` | 6px frame border on photos |

### Typography tokens

| Token | Size | Font | Usage |
|-------|------|------|-------|
| `text-display` | 56px | `font-serif` (Instrument Serif) | Names, "Our Story" |
| `text-heading` | 32px | `font-serif` | Section headings |
| `text-connector` | 26px | `font-serif` | "and" connector |
| `text-subhead` | 16.19px | `font-garamond` (EB Garamond) | "You're invited", "The Wedding Day" |
| `text-parentage` | 9.52px | `font-garamond` | Parent names |
| `text-body` | 12px | `font-sans` (Inter) | Body copy, times, locations |
| `text-caption` | 10px | `font-sans` | Captions, labels |

UI labels: `uppercase tracking-ui-label` (0.48em letter-spacing)

### Breakpoints

| Token | Width | Purpose |
|-------|-------|---------|
| `mobile` | 402px | Figma design canvas width |
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |

### Layout

- Page canvas: `max-w-canvas` (402px), centered via `PageShell`
- Photo border width: `border-photo` (6px)

---

## Project structure

```
src/
  design-tokens/
    colors.ts                 ← single source for all hex values
  components/
    layout/
      PageShell.tsx           ← max-w-canvas centering wrapper
    splash/
      SplashPage.tsx          ← full-screen tap-to-start (AppState: 'splash')
      SplashReveal.tsx        ← warm-brown overlay transition (AppState: 'reveal')
    sections/
      InvitedBanner.tsx       ← warm-brown bg, couple names + parent lines
      OurStory.tsx            ← story text + 4-photo tap-to-fan/collapse
      WeddingDay.tsx          ← ceremony + reception event cards
      Attire.tsx              ← dress code, 2-column, weather note
      Logistics.tsx           ← accommodation (3 hotels) + getting around
      RSVPSection.tsx         ← attending toggle + form → Google Sheets
      Gallery.tsx             ← 2-column parallax photo grid
      RestartButton.tsx       ← resets AppState back to 'splash'
    ui/
      PhotoFrame.tsx          ← reusable framed photo (border + grayscale)
      button.tsx              ← shadcn Button with wedding variants
      input.tsx               ← shadcn Input
      textarea.tsx            ← shadcn Textarea
      label.tsx               ← shadcn Label
  hooks/
    useParallax.ts            ← Framer Motion scroll-based parallax
  lib/
    utils.ts                  ← cn() helper (clsx + tailwind-merge)
    rsvp.ts                   ← submitRSVP() → POST to VITE_RSVP_URL
  stories/                    ← one .stories.tsx per component
  App.tsx                     ← state machine: 'splash' → 'reveal' → 'main'
  main.tsx
  index.css                   ← @tailwind directives + CSS custom properties

public/
  assets/
    photo-1.png               ← IMG_7771 (Figma node 45:2299, imageRef d0b0ca1c...)
    photo-2.png               ← 4c0b793b (Figma node 45:2317, imageRef 23fad861...)
    photo-3.png               ← IMG_0613 (Figma node 45:2322, imageRef 0c6d2539...)
    photo-4.png               ← IMG_7668 (Figma node 45:2301, imageRef cb5318b7...)
    splash.png                ← Figma node 45:1533 (reference only)
```

---

## App state machine

```
AppState: 'splash' | 'reveal' | 'main'

splash  →(tap)→  reveal  →(animation done)→  main
main    →(RestartButton)→  splash
```

- `SplashPage` and `SplashReveal` use Framer Motion `AnimatePresence`
- Restart: `scrollTo(0)` then `setState('splash')` after 400ms

---

## PhotoFrame component — known gotcha

`src/components/ui/PhotoFrame.tsx` renders two nested divs:

```tsx
<div className="border-photo border-wedding-photo-border" style={{ rotate }}>
  <div className="overflow-hidden h-full w-full">
    <img className="h-full w-full object-cover grayscale" />
  </div>
</div>
```

**Why the nesting:** putting `overflow-hidden` on the **same** element as `border-photo` causes the border to be visually clipped in certain rendering contexts (particularly with CSS `rotate` and stacking contexts). The outer div owns the border; the inner div owns the overflow clip. Do not merge these back onto one element.

---

## Figma source

- **File key:** `imxMtzwJldfF2EVn1mZuQQ`
- **Token:** stored locally — generate a new one at figma.com → Settings → Security → Personal Access Tokens
- **Key node IDs:**
  - `45:1533` — Splash screen
  - `45:2338` — After-tap reveal screen
  - `45:1557` — Main scrollable page
  - `45:2299`, `45:2317`, `45:2322`, `45:2301` — Photo frame nodes

### How photos were downloaded

Photos are **image fills** (not frame exports). The correct API flow:

```bash
# 1. Get all image fill refs and their S3 URLs
curl -H "X-Figma-Token: <token>" \
  "https://api.figma.com/v1/files/imxMtzwJldfF2EVn1mZuQQ/images"

# 2. Find which imageRef belongs to each node
curl -H "X-Figma-Token: <token>" \
  "https://api.figma.com/v1/files/imxMtzwJldfF2EVn1mZuQQ/nodes?ids=45:2299,45:2317,45:2322,45:2301"
# → look for fills[].type === "IMAGE" → fills[].imageRef

# 3. Match ref to URL from step 1 and curl -o the file
```

Do NOT use `/v1/images/{file_key}?ids=...` for this — that renders the frame as a PNG export (includes frame borders, rotation, filters baked in), not the raw photo.

---

## RSVP setup (still needed)

1. Create a Google Sheet with columns: `name`, `guestCount`, `dietary`, `message`, `attending`, `timestamp`
2. In Apps Script: deploy a Web App that writes POST body fields as a new row
3. Add `VITE_RSVP_URL=<web-app-url>` to a `.env` file (gitignored)
4. The form in `RSVPSection.tsx` calls `submitRSVP()` from `src/lib/rsvp.ts`

---

## Commands

```bash
npm run dev          # dev server → http://localhost:5173
npm run build        # type-check + production build
npm run storybook    # component explorer → http://localhost:6006
npm run preview      # preview production build locally
```

---

## Commit convention

This project uses **Conventional Commits**:
- `feat:` new feature or component
- `feat(scope):` scoped feature
- `fix(scope):` bug fix
- `chore:` tooling, deps, config

All commits include `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`.
