# CT Studio NZ website

Website for CT Studio NZ, photography and videography across Christchurch and Canterbury: https://ctstudionz.com

## How it's built

- [Astro](https://astro.build) static site: `src/layouts/Base.astro` holds the shared head, header, footer and booking panel; each page is in `src/pages/`
- Static files (CSS, JS, logo, robots.txt, sitemap) are in `public/` and are copied to the site as they are
- Content is being moved to Sanity (Studio: `studio-ct-studio-website-nz`, project `gds6oj8v`)
- Hosted on Netlify, which runs `npm run build` and publishes `dist/` (settings in `netlify.toml`)
- Photos and videos are hosted on Cloudinary; the contact form is handled by Formspree; domain and DNS are at GoDaddy

## Working on it

```
npm install
npm run dev       # http://localhost:4321
npm run build     # builds the site into dist/
npm run preview   # serves the built site to check it
```

Pages keep the same addresses as before (`/photo` is built as `photo.html`).

Every push to `main` triggers a Netlify deploy, which uses build credits, so batch changes and push rarely.

Built by SheDecodes (shedecodes.dev)
