# TECHNOVA — React Frontend

A React + Vite conversion of the TECHNOVA premium electronics storefront.

## Project Structure

```
src/
├── components/
│   ├── BottomNav.jsx      # Mobile bottom navigation (Home, Catalog, Saved, Profile)
│   ├── CategoryFilter.jsx # Scrollable category pills + Filter button
│   ├── Header.jsx         # Fixed top nav with scroll-shrink effect + cart badge
│   ├── ProductCard.jsx    # Individual product card (image, badge, rating, price)
│   ├── ProductGrid.jsx    # 2-column responsive grid wrapper
│   └── Toast.jsx          # "Added to cart" toast notification
├── data/
│   └── products.js        # Product data array (id, name, price, image, category…)
├── App.jsx                # Root: state + layout composition
├── App.css                # Minimal app-level overrides
├── index.css              # Global styles (Inter font, Material Symbols, scrollbar)
└── main.jsx               # React DOM entry point
index.html                 # Tailwind CDN config + Google Fonts
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Key Features

- **Scroll-shrink header** — shrinks from `h-20` to `h-16` on scroll
- **Category filtering** — pills filter the product grid reactively
- **Cart counter** — badge on the cart icon updates on add
- **Toast notification** — auto-dismisses after 2 seconds
- **Bottom nav** — mobile-only, active tab highlighted with fill icon
- **Styled exactly from the original HTML** — same Tailwind token config, same fonts, same colours

## Tailwind Config

The full custom colour/spacing/font tokens from the original design are embedded in `index.html` via the `tailwind.config` script tag (CDN approach). If you switch to a local Tailwind install, move those tokens into `tailwind.config.js`.
