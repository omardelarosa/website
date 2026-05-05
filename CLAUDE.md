# website (monorepo)

Hosts the static sites at `omardelarosa.com`. **Not** an npm/yarn/pnpm workspace — there is no root `package.json`. Each package has its own lockfile and Netlify site, and they're loosely coordinated by the root `Makefile`.

Node version: **18.20.8** (`.node-version`).

## Packages

| Package | URL | Status | Tech |
| :-- | :-- | :-- | :-- |
| `packages/obs-static-site` | www.omardelarosa.com | **Active — primary** | Custom Node SSG (markdown-it, gray-matter, highlight.js) |
| `packages/obs-site` | (content source) | Active — content only | Obsidian vault (markdown + assets, no build) |
| `packages/gatsby-website` | classic.omardelarosa.com | Legacy archive | Gatsby 5 + React 18 |

`obs-site` is the Obsidian vault; `obs-static-site` is the generator that consumes it. They are tightly coupled — `build.js` hardcodes `SOURCE_DIR = ../obs-site`.

## Root Makefile (operates on `obs-static-site` only)

| Target | Action |
| :-- | :-- |
| `make build` | `cd packages/obs-static-site && npm install && npm run build` → output to `dist/` |
| `make serve` | build, then `npm run serve` (Node HTTP server on :8080) |
| `make watch` | nodemon watches `../obs-site/**/*.md`, `templates/`, `nav.json` → rebuild + serve |
| `make test` | `node build.test.js` — unit tests for slugify, date parsing, meta tags, wiki-link rendering |

Default to these from the repo root for the active site. Use the per-package commands directly only when working inside `gatsby-website`.

## obs-static-site build pipeline

`packages/obs-static-site/build.js`:

1. Recursively scans `../obs-site` for `.md`.
2. Parses YAML frontmatter (`gray-matter`) — expects `created`, `lastTouched`, `tags`.
3. Renders markdown → HTML (`markdown-it` + `highlight.js`).
4. Rewrites Obsidian `[[wikilinks]]` and `![[embeds]]` to real links / image paths.
5. Sorts via `sortAllFilesByDate` (preserves folder structure), prunes empty dirs, applies `nav.json` ordering.
6. Builds tag index from frontmatter `tags:` **and** inline `#hashtags` (skips code blocks).
7. Emits HTML + bundled JS/CSS to `dist/`.

Key functions are exported for testing: `slugify`, `tagSlug`, `resolvePostDate`, `generateMetaTags`, `renderPage`.

## Things to know

- **`nav.json`** is hand-maintained — new top-level pages in `obs-site` won't appear in the sidebar unless added here.
- **Frontmatter is load-bearing.** A Feb 2026 incident (`CHANGELOG.md`) was caused by a Unix-seconds-vs-ms bug in `resolvePostDate` plus 146 files missing `created`/`lastTouched`. When adding markdown to `obs-site`, include both fields.
- **Images** in obs-site are resolved through a custom `imageIndex` and copied to `dist/images/`. Renaming an image file means re-running the build, not just updating the link.
- **Daily notes** under `obs-site/daily/` render in reverse-chronological order — that's intentional, don't "fix" the sort.
- **Watch mode** triggers from filesystem changes in `obs-site`, not git. So edits made in Obsidian will live-rebuild while `make watch` is running.
- **Deployment** is per-package via separate Netlify sites:
  - `packages/obs-site/netlify.toml` publishes `packages/obs-static-site/dist`.
  - `packages/gatsby-website/netlify.toml` publishes `packages/gatsby-website/public` and 301s legacy `omardelarosa.com/tags/*` and `/posts/*` to `classic.`.
  - No root CI; pushes to `main` deploy each site independently.
- **gatsby-website is archive-only.** Don't add features there unless explicitly asked — its purpose is to keep old `/posts` and `/tags` URLs alive at `classic.`.
- The root has no workspace tooling; if a future task wants to share deps or tooling across packages, that's a real change worth flagging, not something to assume.
