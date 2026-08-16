import { PixygonSEO } from '@pixygon/seo/react'
import { SITE_URL, SITE_NAME, OG_IMAGE } from '../config/site'

interface SEOProps {
  title?: string
  description?: string
  /** Absolute OG image (1200×630). Defaults to the site's OG card. */
  image?: string
  /** Canonical PATH for this route, e.g. "/pricing". Defaults to the live path. */
  path?: string
  type?: string
  noIndex?: boolean
  /** Extra per-route JSON-LD (VideoGame, Article, FAQPage, …). */
  schema?: object
  /** Set false on inner routes if the site-wide Organization graph is already
   *  emitted elsewhere on the page (default: emit it). */
  siteSchema?: false
}

/**
 * SEO — this project's head, on top of the estate-standard @pixygon/seo.
 *
 * Canonicals come from SITE_URL (see config/site.ts), NEVER
 * window.location.origin. The Organization + sameAs identity graph is baked in
 * by @pixygon/seo, so every Pixygon site reads as one entity to Google. The
 * react-helmet-over-index.html duplicate-tag problem is handled at prerender
 * time — you don't deal with it here.
 */
export default function SEO({
  title = SITE_NAME,
  description = 'wpm — the Weft package registry: verified, content-addressed packages for the Thread. Like npm, but packages cannot lie.',
  image = OG_IMAGE,
  path,
  type = 'website',
  noIndex,
  schema,
  siteSchema,
}: SEOProps) {
  return (
    <PixygonSEO
      domain={SITE_URL}
      siteName={SITE_NAME}
      title={title}
      description={description}
      image={image}
      path={path}
      type={type}
      noindex={noIndex}
      schema={schema}
      siteSchema={siteSchema}
    />
  )
}
