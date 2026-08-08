# Halftone Studio — Home Page Scaffold

Next.js 14 (App Router) + TypeScript + Tailwind, with a React Three Fiber
hero and Framer Motion scroll/reveal animations. This is phase 1 of the
full studio site brief: project scaffold + Home page only.

## What's included

- `app/layout.tsx` — root layout, loads Space Grotesk / Inter / IBM Plex Mono
  via `next/font/google`
- `app/page.tsx` — assembles the home page sections
- `components/Hero.tsx` — R3F canvas with a cursor-reactive distorted
  icosahedron inside a bracketed "viewport" frame, plus a word-by-word
  headline reveal
- `components/ServicesStrip.tsx` — 4-up hover-lift service cards
- `components/WorkPreview.tsx` — selected-work grid with scroll fade-in
  and image-zoom-on-hover
- `components/TestimonialsCarousel.tsx` — simple prev/next testimonial
  carousel
- `components/CTASection.tsx` — closing "book a consultation" CTA
- `components/Nav.tsx`, `components/Footer.tsx`

Design tokens (colors, type, spacing) live in `tailwind.config.ts`.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. This was network-verified with
`next build` in a sandboxed environment (Google Fonts blocked there only
because of sandbox network rules — it will fetch normally on your machine
or on Vercel).

## Routes referenced but not yet built

The nav and CTAs link to `/work`, `/services`, `/about`, `/contact`, and
`/booking` — these are the next phases from the original brief (Work grid,
Case Study pages, Services page, Booking flow + Supabase, About, Contact).
Say the word and I'll build any of these next, the same way: real files,
verified with a build.

## Notes on the design

- Palette: ink navy background, amber (signal/workshop accent) + violet
  (used only in the 3D object and interactive glows) — deliberately not
  the cream/terracotta or near-black/acid-green defaults.
- Hero signature element: the 3D shape sits inside a bracketed
  render-viewport frame with live mono coordinate readout, reinforcing
  "a studio that builds interactive 3D tools" rather than decorative 3D.
