# CT Studio NZ website

Website for CT Studio NZ, photography and videography across Christchurch and Canterbury: https://ctstudionz.com

## How it's built

- Plain HTML, CSS and JavaScript, with no build step
- Hosted on Netlify (settings in `netlify.toml`); every push to `main` goes live
- Photos and videos are hosted on Cloudinary
- The contact form is handled by Formspree
- Domain and DNS are at GoDaddy

## Making changes

Edit locally, commit, and push to `main`. Netlify publishes in about a minute.

## Scripts (optional, need a local `.env`)

- `npm run generate-config` writes `js/config.js` (booking calendar settings) from `.env`
- `npm run rebuild-gallery` rebuilds the photo gallery from Cloudinary

Built by SheDecodes (shedecodes.dev)