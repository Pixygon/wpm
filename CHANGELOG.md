# Changelog

All notable changes to **wpm**. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this file is
materialized from the Pixygon Changelog API — edit there, not here.

## [0.7.0] — 2026-10-23

_The site now serves a favicon for browser tabs and bookmarks._

### Added
- Added a favicon, so the site now shows an icon in browser tabs and bookmarks instead of a broken image or blank placeholder.


## [0.5.0] — 2026-09-10

### Added
- wpm now serves a human-readable website in addition to its JSON API. Visiting the registry in a browser shows a styled homepage listing every package, and each package now has its own page at /p/<name> with its exports, definition count, and install instructions.
- Added robots.txt and a sitemap.xml so search engines can discover and index packages on the registry.

### Improved
- The existing JSON API at GET / is unchanged for tools like curl — HTML is only served when a browser or crawler explicitly requests text/html, so nothing that relies on the JSON response breaks.


