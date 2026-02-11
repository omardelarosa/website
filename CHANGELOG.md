# Changelog

## 2026-02-11

### obs-site: Add missing frontmatter to markdown files

- Added default `created` frontmatter (file birth timestamp) to 39 markdown files that had no frontmatter at all
- Added `lastTouched` field (file modification timestamp) to 107 markdown files that were missing it
- Affected files include section indexes, decklists, top-level pages, daily entries, and programming/gamedev posts

### obs-static-site: Fix incorrect post dates in build output

- Fixed `generatePage()` in `build.js` to use the pre-computed `fileInfo.postDate` (from `resolvePostDate()`) instead of reading raw frontmatter values directly
- Root cause: raw `frontmatter.created` values (Unix seconds) were passed to `new Date()` which interprets numbers as milliseconds, producing dates in January 1970

## 2026-02-09

### File Explorer: Preserve Folder Structure

- Replaced `sortDailyFiles` with `sortAllFilesByDate` to sort files in **all** directories by date (reverse chronological), not just `daily/`
- Added `pruneEmptyDirectories` to recursively remove directories containing no markdown files from the file tree
- Removed the client-side `daily/` directory flattening in `app.js` so the sidebar now renders the actual folder hierarchy (e.g. `daily/2026/02/`)

### Lately Page: Recent Posts

- Added a "Recent Posts" section to the `⏱️ lately.md` output page showing links to the 5 most recent posts with their dates
- Added `collectAllPosts` and `generateRecentPostsHtml` helpers in `build.js` to support this
