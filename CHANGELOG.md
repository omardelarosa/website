# Changelog

## 2026-02-12

### obs-static-site: CC-29 theme redesign (lospec-inspired)

- Replaced Catppuccin color scheme with the [CC-29 pixel art palette](https://lospec.com/palette-list/cc-29) for both light and dark modes
  - Light: warm parchment base (`#f2f0e5`), navy/indigo headings, blue accents, cream-tinted inline code
  - Dark: near-black base (`#212123`), plum sidebar (`#2a2535`), cream headings, cyan/mint accents, lime tags
- Switched typography to Bricolage Grotesque (display/headings) and Instrument Sans (body) via Google Fonts, replacing Catppuccin's system font stack
- Narrowed content max-width to 720px, reduced sidebar to 260px, refined heading type scale and spacing
- Thinned all borders from 2px to 1px and replaced heavy box-shadows with subtler variants
- Improved dark-mode `.social-title` contrast using CC-29 linen (`#e5ceb4`) instead of muted gray
- Added Google Fonts `<link>` preconnect and stylesheet tags to the HTML `<head>` in `build.js`

## 2026-02-11

### obs-site: Add missing frontmatter to markdown files

- Added default `created` frontmatter (file birth timestamp) to 39 markdown files that had no frontmatter at all
- Added `lastTouched` field (file modification timestamp) to 107 markdown files that were missing it
- Affected files include section indexes, decklists, top-level pages, daily entries, and programming/gamedev posts

### obs-static-site: Fix incorrect post dates in build output

- Fixed `generatePage()` in `build.js` to use the pre-computed `fileInfo.postDate` (from `resolvePostDate()`) instead of reading raw frontmatter values directly
- Root cause: raw `frontmatter.created` values (Unix seconds) were passed to `new Date()` which interprets numbers as milliseconds, producing dates in January 1970

### File Explorer: Reverse chronological ordering for daily section

- Updated `buildTreeHTML` in `app.js` to accept a `reverseSort` flag that activates for the `daily` directory and propagates to all its children
- Files and subdirectories within `daily/` now render in reverse alphabetical order (e.g. `2026` before `2025`, `06` before `05`)

## 2026-02-09

### File Explorer: Preserve Folder Structure

- Replaced `sortDailyFiles` with `sortAllFilesByDate` to sort files in **all** directories by date (reverse chronological), not just `daily/`
- Added `pruneEmptyDirectories` to recursively remove directories containing no markdown files from the file tree
- Removed the client-side `daily/` directory flattening in `app.js` so the sidebar now renders the actual folder hierarchy (e.g. `daily/2026/02/`)

### Lately Page: Recent Posts

- Added a "Recent Posts" section to the `⏱️ lately.md` output page showing links to the 5 most recent posts with their dates
- Added `collectAllPosts` and `generateRecentPostsHtml` helpers in `build.js` to support this
