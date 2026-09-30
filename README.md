# Mimo Pet Care & Grooming

Demo website for a premium pet grooming studio in Montrose, Houston.

**Stack:** React + Vite · Tailwind CSS · Framer Motion · Lenis · lucide-react

## Run locally

```bash
npm install
npm run dev
```

## Edit content

Everything editable (business info, hours, services, prices, images, team, testimonials, FAQs, packages, social links) lives in **`src/data/siteConfig.js`**.

## Owner edit mode

Open the site with `?edit=true` (e.g. `https://yoursite.com/?edit=true`):

- **Change image** on every hero tile and service image — upload a photo, paste a URL, or pick from the built-in library
- Changes are saved in this browser (localStorage)
- **Export config** downloads the current configuration as JSON
- **Reset images** restores the defaults

The public site never shows these controls.

## Deploy

- **Vercel:** import the repo — build command `npm run build`, output `dist` (preconfigured in `vercel.json`)
- **Netlify:** build command `npm run build`, publish directory `dist` (preconfigured in `netlify.toml`)

Photos are free Unsplash images used as placeholders.
