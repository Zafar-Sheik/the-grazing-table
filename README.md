# The Grazing Table — Created to Serve

Website for The Grazing Table: charcuterie cups, grazing boxes, grazing tables and mini desserts.

Built with Next.js (App Router), Tailwind CSS v4, GSAP (ScrollTrigger, SplitText, DrawSVG) and
Aceternity-style components (spotlight, 3D cards, flip words, focus cards, moving-border buttons,
hover-effect cards, floating navbar) built on Motion.

## Features

- **Cup builder** — build a Signature Cup (R90, 9 items) or Sweet Treat Cup (R85, 8 items) and watch the
  cup fill layer by layer. Enforces the per-section picks, applies R5 upgrades and the 20-cup minimum.
- **Grazing boxes** — classic / vegetarian toggle, cheese & meat choices, Medium upgrades and the three
  extras (cheese R40, premium meat R50, dip R25).
- **Desserts by the dozen**, party packages (pick any 4 desserts, 50 or 100 cups) and acrylic upgrades.
- **Basket** persisted in the browser, with collection date/time checks (48–72h notice, Mon–Sat 08:00–17:00,
  Sunday by arrangement) and a 50% deposit estimate. Sends the full order as a pre-filled WhatsApp message.
- **Order policy** as a scroll-drawn timeline plus the full fine print.

All menu data (prices, items, policy) lives in `src/lib/menu.ts`.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Photos

The dessert photos in `public/images` are cropped from the printed price list, so they are low resolution.
Swap in the original photos (same filenames) for a sharper gallery.
