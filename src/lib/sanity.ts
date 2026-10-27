import {createClient} from '@sanity/client'
import {createImageUrlBuilder} from '@sanity/image-url'

// Reads CT's published content at build time. No token: published content is public.
export const client = createClient({
  projectId: 'gds6oj8v',
  dataset: 'production',
  apiVersion: '2025-10-01',
  useCdn: false, // builds always get the latest published content
  perspective: 'published',
})

const builder = createImageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source).auto('format')

export type SiteSettings = {
  businessName?: string
  logo?: any
  phone?: string
  email?: string
  whatsappNumber?: string
  studioTown?: string
  areasServed?: string[]
  hours?: string
  googleProfileUrl?: string
  socialLinks?: {platform: string; url: string}[]
}

// Fetched once per build and shared by every page.
// In dev it's fetched on every page load, so Studio edits show up straight away.
let settingsPromise: Promise<SiteSettings> | undefined
export function getSettings() {
  if (import.meta.env.DEV) settingsPromise = undefined
  settingsPromise ??= client
    .fetch<SiteSettings | null>(
      `*[_type == "siteSettings"][0]{businessName, logo, phone, email, whatsappNumber, studioTown, areasServed, hours, googleProfileUrl, socialLinks[]{platform, url}}`,
    )
    .then((s) => s ?? {})
  return settingsPromise
}

// "022 466 3080" -> "+64224663080" for tel: links
export const telHref = (phone?: string) => {
  if (!phone) return undefined
  const digits = phone.replace(/\D/g, '')
  return 'tel:+' + (digits.startsWith('0') ? '64' + digits.slice(1) : digits)
}

// ["Christchurch", "Canterbury"] -> "Christchurch and Canterbury"
export const joinAreas = (areas: string[] = []) =>
  areas.length <= 1 ? areas.join('') : areas.slice(0, -1).join(', ') + ' and ' + areas.at(-1)

export type Promotion = {
  _id: string
  message: string
  buttonText?: string
  buttonLink?: string
  style: 'banner' | 'popup' | 'card'
  showOn?: string[]
  startsAt?: string
  endsAt?: string
}

// Switched-on promotions that haven't ended yet. Start and end dates are checked again in
// the visitor's browser, so an offer appears and disappears on time without a rebuild.
let promotionsPromise: Promise<Promotion[]> | undefined
export function getPromotions() {
  if (import.meta.env.DEV) promotionsPromise = undefined
  promotionsPromise ??= client
    .fetch<Promotion[]>(
      `*[_type == "promotion" && enabled == true && defined(message) && (!defined(endsAt) || endsAt > now())]
        | order(_updatedAt desc){_id, message, buttonText, buttonLink, style, showOn, startsAt, endsAt}`,
    )
    .then((p) => p ?? [])
  return promotionsPromise
}

