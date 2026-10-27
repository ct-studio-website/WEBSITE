// Helpers for video links hosted on Cloudinary
const isCloudinary = (url: string) => url.includes('res.cloudinary.com') && url.includes('/video/upload/')

/** A smaller version of the video, so visitors don't download the full original. */
export const videoSrc = (url: string, width = 1280) =>
  isCloudinary(url) ? url.replace('/video/upload/', `/video/upload/w_${width},c_limit/q_auto/f_auto/`) : url

/** A still frame from the video, cropped to the given size. Cloudinary uses the middle frame,
 * which avoids black frames from fade-ins. CT can set his own thumbnail in the Studio instead. */
export const videoFrame = (url: string, width: number, height: number) =>
  isCloudinary(url)
    ? url.replace('/video/upload/', `/video/upload/w_${width},h_${height},c_fill/q_auto/`).replace(/\.[a-z0-9]+$/i, '.jpg')
    : undefined

/** Cloudinary links carry the upload time (v + Unix seconds), which Google wants as uploadDate. */
export const uploadDate = (url: string) => {
  const m = url.match(/\/v(\d{10})\//)
  return m ? new Date(Number(m[1]) * 1000).toISOString() : undefined
}

/** "Business & Corporate" -> "business-corporate", for filter buttons */
export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'other'
