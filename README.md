# CT Studio NZ

Professional photography and videography website.

## Local Preview

Open any .html file in a browser, or for video support:

```bash
npx serve .
```

Then open http://localhost:3000

## Deploy to Vercel

```bash
npm i -g vercel
vercel
vercel --prod
```

## Connect Domain (ctstudionz.com on GoDaddy)

1. Vercel dashboard → Project Settings → Domains → Add `ctstudionz.com` and `www.ctstudionz.com`
2. GoDaddy DNS → Change nameservers to:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
3. SSL auto-provisions. Wait 10-30 min for DNS.

## Contact Form

Currently static (shows thank-you message, no data sent).

To connect: use Formspree, add `action="https://formspree.io/f/YOUR_ID"` to the form in `contact.html` and remove the `preventDefault` in `js/main.js`.

## Updating Content

- Swap images in `assets/` folders
- Edit text in the HTML files
- Redeploy: `vercel --prod`

## Project Structure

```
ct-studio-nz/
├── index.html          # Home page
├── photo.html          # Photo portfolio page
├── video.html          # Video portfolio page
├── about.html          # About + Services + Equipment + FAQ
├── contact.html        # Contact page
├── css/
│   └── style.css       # Shared stylesheet
├── js/
│   └── main.js         # Shared JavaScript
├── vercel.json         # Vercel config
├── package.json        # Package info
├── README.md           # This file
└── assets/
    ├── logo/
    │   └── logo.png
    ├── photos/
    │   ├── studio/
    │   ├── outdoor/
    │   ├── events/
    │   └── business/
    ├── videos/
    │   └── hero/
    │       └── hero-reel.mp4
    └── home-carousel/
```

## Tech Stack

- HTML5, CSS3, vanilla JavaScript
- Google Fonts (Cormorant Garamond, DM Sans)
- No external dependencies
- Responsive design (Desktop, Tablet, Mobile)
