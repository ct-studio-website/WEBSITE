import {defineConfig} from 'astro/config'

export default defineConfig({
  site: 'https://ctstudionz.com',
  // Keep the same addresses as the old site: /photo is served from photo.html
  trailingSlash: 'never',
  build: {format: 'file'},
})
