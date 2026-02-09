# Changelog

## 2026-02-09

### File Explorer: Preserve Folder Structure

- Replaced `sortDailyFiles` with `sortAllFilesByDate` to sort files in **all** directories by date (reverse chronological), not just `daily/`
- Added `pruneEmptyDirectories` to recursively remove directories containing no markdown files from the file tree
- Removed the client-side `daily/` directory flattening in `app.js` so the sidebar now renders the actual folder hierarchy (e.g. `daily/2026/02/`)

### Lately Page: Recent Posts

- Added a "Recent Posts" section to the `⏱️ lately.md` output page showing links to the 5 most recent posts with their dates
- Added `collectAllPosts` and `generateRecentPostsHtml` helpers in `build.js` to support this
