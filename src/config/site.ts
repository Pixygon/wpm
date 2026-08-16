/**
 * Site identity — the ONE place the production domain lives.
 *
 * SITE_URL must be the real production origin (no trailing slash). It is used
 * for every canonical / og:url, and the prerender renders against it — so it
 * must NEVER be derived from window.location.origin (that ships localhost).
 * Default is the pixygon.io subdomain; change it here if this project uses a
 * custom domain (e.g. "https://hazechat.com").
 */
export const SITE_URL = 'https://wpm.pixygon.io';
export const SITE_NAME = 'wpm';
export const SITE_DESCRIPTION = 'wpm — the Weft package registry: verified, content-addressed packages for the Thread. Like npm, but packages cannot lie.';

/** Default share image — 1200×630. Replace with this project's own OG card. */
export const OG_IMAGE = `${SITE_URL}/og-image.png`;
