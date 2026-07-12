require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const THUMB = 'w_600,f_auto,q_auto';
const FULL  = 'w_1920,f_auto,q_auto';

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('Missing Cloudinary credentials — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
  process.exit(1);
}

function searchFolder(folder) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ expression: `folder="${folder}"`, max_results: 500 });
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
    const req = https.request({
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${CLOUD_NAME}/resources/search`,
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data).resources || []); }
        catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function buildSection(resources, category, label) {
  return resources.map(r => {
    const base = r.secure_url.replace('/upload/', `/upload/${THUMB}/`);
    const full = r.secure_url.replace('/upload/', `/upload/${FULL}/`);
    return `                    <div class="photo-grid__item" data-category="${category}"><img src="${base}" data-full="${full}" alt="${label} photography" loading="lazy"></div>`;
  }).join('\n');
}

async function main() {
  console.log('Fetching images from Cloudinary...');
  const [studio, outdoor, events, business] = await Promise.all([
    searchFolder('Photo-Studio'),
    searchFolder('Photo-Outdoor'),
    searchFolder('Photo-Events'),
    searchFolder('Photo-Business'),
  ]);
  console.log(`  Studio:${studio.length} | Outdoor:${outdoor.length} | Events:${events.length} | Business:${business.length}`);

  const filePath = path.join(__dirname, 'photo.html');
  const existing = fs.readFileSync(filePath, 'utf8');

  let gridStart = existing.indexOf('<div class="photo-grid fade-in">');
  if (gridStart === -1) gridStart = existing.indexOf('<div class="photo-grid">');
  if (gridStart === -1) { console.error('Cannot find photo-grid div'); process.exit(1); }

  // Strip fade-in — grid starting invisible breaks everything
  const header = existing.slice(0, gridStart) + '<div class="photo-grid">';

  const sections = [
    '\n                    <!-- Studio Photos -->\n' + buildSection(studio, 'studio', 'Studio'),
    '\n                    <!-- Outdoor Photos -->\n' + buildSection(outdoor, 'outdoor', 'Outdoor'),
    '\n                    <!-- Events Photos -->\n' + buildSection(events, 'events', 'Events'),
    '\n                    <!-- Business Photos -->\n' + buildSection(business, 'business', 'Business'),
  ].join('\n');

  const footer = `
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer__content">
                <p class="footer__copyright">&copy; 2025 CT Studio NZ. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <div id="lightbox" class="lightbox">
        <button class="lightbox__close" aria-label="Close lightbox">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <img class="lightbox__image" src="" alt="">
    </div>
    <script src="js/main.js"></script>
</body>
</html>`;

  fs.writeFileSync(filePath, header + sections + footer, 'utf8');
  const total = studio.length + outdoor.length + events.length + business.length;
  console.log(`✅ photo.html rebuilt (${total} images)`);
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
