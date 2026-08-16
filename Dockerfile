# ── Build stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies (legacy-peer-deps: some @pixygon packages still declare
# React 18 as a peer while we're on 19).
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Build the app
COPY . .
RUN npm run build

# ── Prerender stage ──────────────────────────────────────────────────────────
# Full-page prerender so search crawlers AND AI answer engines (GPTBot,
# ClaudeBot, PerplexityBot, CCBot, Googlebot's no-JS pass) get REAL rendered
# content, not an empty SPA shell. @pixygon/seo renders each route with headless
# Chromium and writes dist/<route>.html (deduping the head as it goes).
#
# ⚠ This stage MUST be the Debian **jammy** Playwright image. On Alpine,
# Playwright's Chromium can't run and the prerender SILENTLY degrades to
# head-only (empty body) — the #1 way this breaks. Keep the tag in lock-step
# with the `playwright` devDependency version in package.json.
FROM mcr.microsoft.com/playwright:v1.60.0-jammy AS prerender
WORKDIR /app
COPY --from=build /app ./
# Non-fatal: if prerendering can't run, keep the un-prerendered dist (nginx
# serves the SPA shell) rather than breaking the build.
RUN node node_modules/@pixygon/seo/prerender.mjs || true

# ── Production stage ─────────────────────────────────────────────────────────
FROM nginx:alpine
# Serve the PRERENDERED dist (real per-route HTML for bots + the SPA for users).
COPY --from=prerender /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
