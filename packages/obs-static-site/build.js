const fs = require('fs-extra');
const path = require('path');
const MarkdownIt = require('markdown-it');
const matter = require('gray-matter');
const hljs = require('highlight.js');

// Configuration
const SOURCE_DIR = path.join(__dirname, '..', 'obs-site');
const DIST_DIR = path.join(__dirname, 'dist');
const OBSIDIAN_DIR = path.join(SOURCE_DIR, '.obsidian');
const NAV_CONFIG_PATH = path.join(__dirname, 'nav.json');

// Initialize markdown parser with wiki link support and syntax highlighting
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="language-${lang}">${hljs.highlight(code, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch (_) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
  }
});

// Custom plugin: handle Obsidian [[wikilinks]] and ![[embeds]]
md.use((md) => {
  md.renderer.rules.text = (tokens, idx) => {
    const content = tokens[idx].content;

    // Handle ![[embed]] before [[wikilink]] to avoid double-matching
    let result = content.replace(/!\[\[([^\]]+)\]\]/g, (match, ref) => {
      const parts = ref.split('|');
      const filename = parts[0].trim();
      const alt = parts[1] ? parts[1].trim() : filename;
      const ext = path.extname(filename).toLowerCase();

      if (IMAGE_EXTS.has(ext)) {
        const fullPath = imageIndex.get(filename);
        if (fullPath) {
          return `<img src="${registerImage(fullPath)}" alt="${alt}" class="obsidian-embed">`;
        }
        return `<img src="/images/${filename}" alt="${alt}" class="obsidian-embed">`;
      }

      // Non-image embed: render as wiki-link
      return `<a href="/${slugify(filename)}.html" class="wiki-link">${alt}</a>`;
    });

    // Replace [[wiki links]] with proper HTML links
    result = result.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
      const parts = linkText.split('|');
      const link = parts[0].trim();
      const display = parts[1] ? parts[1].trim() : link;
      const slug = slugify(link);
      return `<a href="/${slug}.html" class="wiki-link">${display}</a>`;
    });

    return result;
  };
});

// Rewrite standard markdown image paths to dist/images/ and track for copying
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  let src = token.attrGet('src') || '';
  const alt = self.renderInlineAsText(token.children, options, env);
  const title = token.attrGet('title');

  if (!/^https?:\/\//.test(src)) {
    const resolved = resolveImagePath(src, env && env.filePath);
    if (resolved) src = registerImage(resolved);
  }

  let html = `<img src="${src}" alt="${alt}"`;
  if (title) html += ` title="${md.utils.escapeHtml(title)}"`;
  html += '>';
  return html;
};

// Helper function to create URL-safe slugs with percent-encoded non-ASCII characters
function slugify(text) {
  const base = text
    .toLowerCase()
    // Remove only specific punctuation, keep unicode letters and numbers
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');

  // Percent-encode non-ASCII characters (emoji, CJK, etc.) for filesystem/URL safety.
  // Array.from splits by Unicode code point so surrogate pairs (emoji) are handled correctly.
  return Array.from(base)
    .map(char => char.codePointAt(0) > 127 ? encodeURIComponent(char) : char)
    .join('');
}

// Slug for tag names: lowercase, hyphens preserved, non-alphanumeric replaced with hyphens
function tagSlug(tag) {
  return tag.toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// File tree structure
const fileTree = {
  files: [],
  directories: {}
};

// Tag index: tag slug -> array of fileInfo objects
const tagIndex = new Map();

// Supported image extensions for Obsidian embed resolution
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif', '.bmp', '.ico']);

// Image index: basename -> fullPath (built during directory scan)
const imageIndex = new Map();

// Images pending copy to dist/images/: fullPath -> basename
const pendingImages = new Map();

// Post navigation map: slug -> { prev, next } (populated after buildTagIndex)
let postNav = null;

// Resolve the best available date for a post, falling back to file mtime
function resolvePostDate(fileInfo, frontmatter) {
  const candidates = [
    frontmatter.created,
    frontmatter.publishedAt,
    frontmatter.date,
    frontmatter.timestamp
  ];
  for (const raw of candidates) {
    if (raw) {
      const d = raw instanceof Date ? raw : new Date(raw);
      if (!isNaN(d.getTime())) return d;
    }
  }
  try {
    return fs.statSync(fileInfo.fullPath).mtime;
  } catch (e) {
    return new Date(0);
  }
}

// Scan directory and build file tree
function scanDirectory(dir, baseDir = SOURCE_DIR, tree = fileTree) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.relative(SOURCE_DIR, fullPath);
    const stat = fs.statSync(fullPath);

    // Skip .obsidian, node_modules, templates, and hidden files
    if (item.startsWith('.') || item === 'node_modules' || item === 'templates') continue;

    if (stat.isDirectory()) {
      if (!tree.directories[item]) {
        tree.directories[item] = { files: [], directories: {} };
      }
      scanDirectory(fullPath, baseDir, tree.directories[item]);
    } else if (item.endsWith('.md')) {
      const fileInfo = {
        name: item,
        path: relativePath,
        fullPath: fullPath,
        slug: slugify(item.replace('.md', ''))
      };
      tree.files.push(fileInfo);
    } else {
      // Collect image files for Obsidian embed resolution
      const ext = path.extname(item).toLowerCase();
      if (IMAGE_EXTS.has(ext)) {
        imageIndex.set(item, fullPath);
      }
    }
  }

  return tree;
}

// Resolve an image src to its full path on disk
function resolveImagePath(src, markdownFilePath) {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return null; // external URL

  // Absolute path from vault root
  if (src.startsWith('/')) {
    const full = path.join(SOURCE_DIR, src);
    return fs.existsSync(full) ? full : null;
  }

  // Try relative to markdown file's directory
  if (markdownFilePath) {
    const full = path.resolve(path.dirname(markdownFilePath), src);
    if (fs.existsSync(full)) return full;
  }

  // Fallback: search by basename in image index
  return imageIndex.get(path.basename(src)) || null;
}

// Register an image for copying and return its dist path
function registerImage(fullPath) {
  const basename = path.basename(fullPath);
  pendingImages.set(fullPath, basename);
  return `/images/${basename}`;
}

// Extract tags from parsed markdown content and frontmatter
function extractTagsFromContent(markdown, frontmatter) {
  const tags = new Set();

  // From frontmatter tags array
  if (Array.isArray(frontmatter.tags)) {
    frontmatter.tags.forEach(t => {
      if (typeof t === 'string' && t.trim()) tags.add(tagSlug(t.trim()));
    });
  }

  // Strip code blocks before matching inline #tags to avoid false matches
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '');

  const tagRegex = /#([a-zA-Z][a-zA-Z0-9_-]*)/g;
  let m;
  while ((m = tagRegex.exec(stripped)) !== null) {
    tags.add(tagSlug(m[1]));
  }

  return Array.from(tags).filter(t => t.length > 0);
}

// First pass: read all files to populate tagIndex and attach tags, date, and title to fileInfo
function buildTagIndex(tree) {
  for (const file of tree.files) {
    const content = fs.readFileSync(file.fullPath, 'utf-8');
    const { data: frontmatter, content: markdown } = matter(content);
    const tags = extractTagsFromContent(markdown, frontmatter);
    file.tags = tags;
    file.postDate = resolvePostDate(file, frontmatter);
    const h1Match = markdown.match(/^#\s+(.+?)$/m);
    file.postTitle = frontmatter.title || (h1Match ? h1Match[1] : file.name.replace('.md', ''));
    for (const tag of tags) {
      if (!tagIndex.has(tag)) tagIndex.set(tag, []);
      tagIndex.get(tag).push(file);
    }
  }
  for (const subTree of Object.values(tree.directories)) {
    buildTagIndex(subTree);
  }
}

// Apply nav.json ordering to the root file tree.
// Matched markdown files are sorted to the top; unmatched entries become synthetic items.
function applyNavOrder(navConfig, tree) {
  const rootFiles = tree.files;
  const ordered = [];
  const usedSlugs = new Set();

  for (const entry of navConfig) {
    const key = slugify(entry.replace(/\.md$/i, ''));
    const match = rootFiles.find(f => f.slug === key || f.slug.endsWith(key));
    if (match) {
      ordered.push(match);
      usedSlugs.add(match.slug);
    } else {
      // Synthetic entry — no backing .md file, links to /<slug>.html
      ordered.push({ name: entry, slug: key, path: entry, synthetic: true });
      usedSlugs.add(key);
    }
  }

  // Append remaining root files that were not pinned by nav.json
  for (const f of rootFiles) {
    if (!usedSlugs.has(f.slug)) ordered.push(f);
  }

  tree.files.length = 0;
  tree.files.push(...ordered);
}

// Build chronological prev/next navigation map across all posts
function buildPostNav(tree) {
  const allPosts = [];
  function collect(t) {
    for (const f of t.files) {
      if (!f.synthetic && f.postDate) allPosts.push(f);
    }
    for (const sub of Object.values(t.directories)) collect(sub);
  }
  collect(tree);

  allPosts.sort((a, b) => a.postDate - b.postDate);

  const nav = new Map();
  for (let i = 0; i < allPosts.length; i++) {
    nav.set(allPosts[i].slug, {
      prev: i > 0 ? allPosts[i - 1] : null,
      next: i < allPosts.length - 1 ? allPosts[i + 1] : null
    });
  }
  return nav;
}

// Replace #tags in rendered HTML with links, skipping code blocks
function linkifyTags(html) {
  // Split on <pre> and <code> blocks so their content is left untouched
  const parts = html.split(/(<pre[\s\S]*?<\/pre>|<code[^>]*>[\s\S]*?<\/code>)/);
  return parts.map((part, i) => {
    if (i % 2 === 1) return part; // odd indices are code blocks — skip
    return part.replace(/(<[^>]+>)|#([a-zA-Z][a-zA-Z0-9_-]*)/g, (match, htmlTag, tagName) => {
      if (htmlTag) return htmlTag;
      const slug = tagSlug(tagName);
      if (tagIndex.has(slug)) {
        return `<a href="/tags/${slug}.html" class="tag-link">#${tagName}</a>`;
      }
      return match;
    });
  }).join('');
}

// Common page shell renderer
function renderPage(title, mainContent, pageSlug, graphData) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/highlight.css">
</head>
<body>
  <div class="app" data-theme="light">
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <a href="/" class="home-link">
          <img src="/assets/pixelpic.gif" alt="Home" class="site-logo" />
        </a>
        <button id="theme-toggle" aria-label="Toggle theme">🌙</button>
      </div>
      <div class="search-box">
        <input type="text" id="search" placeholder="Search..." />
      </div>
      <nav class="file-tree" id="file-tree">
        <!-- File tree will be injected by client-side JS -->
      </nav>
      <footer class="sidebar-footer">
        <span class="sidebar-copyright">&copy; ${new Date().getFullYear()} omar delarosa</span>
        <script type='text/javascript' src='https://storage.ko-fi.com/cdn/widget/Widget_2.js'></script><script type='text/javascript'>kofiwidget2.init('Support me on Ko-fi', '#72a4f2', 'K3K51SJIVR');kofiwidget2.draw();</script>
      </footer>
    </aside>
    <main class="content">
      ${mainContent}
    </main>
    <button class="sidebar-toggle" id="sidebar-toggle">☰</button>
  </div>
  <script>
    window.__FILE_TREE__ = ${JSON.stringify(fileTree)};
    window.__GRAPH_DATA__ = ${JSON.stringify(graphData)};
    window.__CURRENT_PAGE__ = "${pageSlug}";
  </script>
  <script src="/app.js"></script>
</body>
</html>`.trim();
}

// Return true if a value looks like a timestamp (Date object or date-like string)
function isTimestampValue(value) {
  if (value instanceof Date) return !isNaN(value.getTime());
  if (typeof value !== 'string') return false;
  // Must contain a 4-digit year followed by a separator to avoid false positives
  if (!/\d{4}[-/]\d{1,2}/.test(value)) return false;
  return !isNaN(new Date(value).getTime());
}

// Build bottom metadata HTML from remaining frontmatter fields
function generateBottomMeta(frontmatter) {
  const excluded = new Set(['title', 'date', 'created', 'timestamp']);
  const timestampKeyPattern = /at$|date|time|publish|creat|modif|updat/i;
  const entries = Object.entries(frontmatter).filter(([key]) => !excluded.has(key));

  if (entries.length === 0) return '';

  const items = entries.map(([key, value]) => {
    let displayValue;
    if (key === 'tags' && Array.isArray(value)) {
      displayValue = value.map(t => {
        const slug = tagSlug(t);
        return `<a href="/tags/${slug}.html" class="tag-link">#${t}</a>`;
      }).join(' ');
    } else if (Array.isArray(value)) {
      displayValue = value.join(', ');
    } else if (timestampKeyPattern.test(key) || isTimestampValue(value)) {
      const iso = new Date(value).toISOString();
      displayValue = `<time datetime="${iso}">${String(value)}</time>`;
    } else {
      displayValue = String(value);
    }
    return `<dt>${key}</dt><dd>${displayValue}</dd>`;
  }).join('\n        ');

  return `<footer class="post-footer">
        <details class="post-meta-details">
          <summary class="post-meta-toggle">?</summary>
          <dl class="post-meta-list">
            ${items}
          </dl>
        </details>
      </footer>`;
}

// Generate HTML for a markdown file
function generatePage(fileInfo, graphData) {
  const content = fs.readFileSync(fileInfo.fullPath, 'utf-8');
  const { data: frontmatter, content: markdown } = matter(content);

  // Check if markdown starts with an h1
  const h1Match = markdown.match(/^#\s+(.+?)$/m);
  let markdownToRender = markdown;
  let title = frontmatter.title || fileInfo.name.replace('.md', '');

  // If there's an h1 in the markdown, use it as title and remove it from content
  if (h1Match) {
    title = h1Match[1];
    markdownToRender = markdown.replace(/^#\s+.+?$/m, '').trim();
  }

  const html = linkifyTags(md.render(markdownToRender, { filePath: fileInfo.fullPath }));
  const date = frontmatter.date || frontmatter.created || frontmatter.timestamp || null;

  // Format date if available
  let dateHtml = '';
  if (date) {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    dateHtml = `<div class="post-meta"><time class="post-date" datetime="${dateObj.toISOString()}">${formattedDate}</time></div>`;
  }

  // Only show post header if we have frontmatter data (date) or a custom title
  const hasFrontmatter = date || frontmatter.title;
  const headerClass = hasFrontmatter ? 'post-header' : 'post-header no-meta';

  const bottomMeta = generateBottomMeta(frontmatter);

  // Build prev/next navigation links
  let postNavHtml = '';
  const navEntry = postNav ? postNav.get(fileInfo.slug) : null;
  if (navEntry && (navEntry.prev || navEntry.next)) {
    const prevLink = navEntry.prev
      ? `<a href="/${navEntry.prev.slug}.html" class="post-nav-link">Previous Post - ${navEntry.prev.postTitle}</a>`
      : '';
    const nextLink = navEntry.next
      ? `<a href="/${navEntry.next.slug}.html" class="post-nav-link">Next Post - ${navEntry.next.postTitle}</a>`
      : '';
    postNavHtml = `<nav class="post-nav">${prevLink}${nextLink}</nav>`;
  }

  const mainContent = `
      <article class="markdown-body">
        <header class="${headerClass}">
          <h1 class="post-title">${title}</h1>
          ${dateHtml}
        </header>
        ${html}
        ${postNavHtml}
        ${bottomMeta}
      </article>`;

  return renderPage(title, mainContent, fileInfo.slug, graphData);
}

// Generate index page
function generateIndex(graphData) {
  const mainContent = `
      <div class="welcome">
        <h1>Welcome</h1>
        <p>Select a file from the sidebar to begin.</p>
        <div id="graph-container" class="graph-container">
          <canvas id="graph-canvas"></canvas>
        </div>
      </div>`;

  return renderPage('Home', mainContent, 'index', graphData);
}

// Generate a tag page listing all posts for a given tag
function generateTagPage(tag, files, graphData) {
  const postItems = files
    .map(f => `<li><a href="/${f.slug}.html">${f.name.replace('.md', '')}</a></li>`)
    .join('\n          ');

  const mainContent = `
      <article class="markdown-body">
        <header class="post-header no-meta">
          <h1 class="post-title">#${tag}</h1>
        </header>
        <p>${files.length} post${files.length !== 1 ? 's' : ''}</p>
        <ul class="tag-post-list">
          ${postItems}
        </ul>
      </article>`;

  return renderPage(`#${tag}`, mainContent, `tags/${tag}`, graphData);
}

// Generate /tags.html listing all tags sorted by post count descending
function generateTagsIndex(graphData) {
  const sortedTags = [...tagIndex.entries()]
    .sort((a, b) => b[1].length - a[1].length);

  const tagItems = sortedTags
    .map(([tag, files]) =>
      `<li><a href="/tags/${tag}.html" class="tag-link">#${tag}</a> <span class="tag-count">${files.length}</span></li>`
    )
    .join('\n          ');

  const mainContent = `
      <article class="markdown-body">
        <header class="post-header no-meta">
          <h1 class="post-title">Tags</h1>
        </header>
        <ul class="tags-list">
          ${tagItems}
        </ul>
      </article>`;

  return renderPage('Tags', mainContent, 'tags', graphData);
}

// Build the site
async function build() {
  console.log('🏗️  Building static site...');

  // Clean dist directory
  await fs.emptyDir(DIST_DIR);

  // Scan files
  console.log('📂 Scanning files...');
  const tree = scanDirectory(SOURCE_DIR);

  // Build tag index (first pass through all files)
  console.log('🏷️  Building tag index...');
  buildTagIndex(tree);
  console.log(`  ✓ Found ${tagIndex.size} unique tags`);

  // Apply nav.json ordering to the file tree
  console.log('🧭 Applying nav order...');
  try {
    if (fs.existsSync(NAV_CONFIG_PATH)) {
      const navConfig = JSON.parse(fs.readFileSync(NAV_CONFIG_PATH, 'utf-8'));
      applyNavOrder(navConfig, tree);
      console.log(`  ✓ Applied nav order (${navConfig.length} entries)`);
    }
  } catch (err) {
    console.warn('⚠️  Could not load nav.json:', err.message);
  }

  // Build chronological post navigation
  postNav = buildPostNav(tree);
  console.log(`  ✓ Built post nav (${postNav.size} posts)`);

  // Load graph data
  let graphData = null;
  try {
    const graphPath = path.join(OBSIDIAN_DIR, 'graph.json');
    if (fs.existsSync(graphPath)) {
      graphData = JSON.parse(fs.readFileSync(graphPath, 'utf-8'));
    }
  } catch (err) {
    console.warn('⚠️  Could not load graph.json');
  }

  // Generate pages
  console.log('📝 Generating pages...');
  let helloFile = null;

  function processTree(tree, currentPath = '') {
    // Process files in current directory
    for (const file of tree.files) {
      if (file.synthetic) continue; // synthetic entries have no backing .md file
      const html = generatePage(file, graphData);
      // Use the slug directly as the filename (UTF-8 safe)
      const outputPath = path.join(DIST_DIR, `${file.slug}.html`);
      fs.outputFileSync(outputPath, html);
      console.log(`  ✓ Generated ${file.slug}.html`);

      // Track hello.md file for index page
      if (file.slug === 'hello' || file.name.includes('hello')) {
        helloFile = file;
      }
    }

    // Recursively process subdirectories
    for (const [dirName, subTree] of Object.entries(tree.directories)) {
      processTree(subTree, path.join(currentPath, dirName));
    }
  }

  processTree(tree);

  // Generate index from hello.md if available, otherwise use default
  let indexHtml;
  if (helloFile) {
    indexHtml = generatePage(helloFile, graphData);
    console.log('  ✓ Generated index.html from hello.md');
  } else {
    indexHtml = generateIndex(graphData);
    console.log('  ✓ Generated index.html (default)');
  }
  fs.outputFileSync(path.join(DIST_DIR, 'index.html'), indexHtml);

  // Generate tag pages
  console.log('🏷️  Generating tag pages...');
  for (const [tag, files] of tagIndex.entries()) {
    const html = generateTagPage(tag, files, graphData);
    fs.outputFileSync(path.join(DIST_DIR, 'tags', `${tag}.html`), html);
    console.log(`  ✓ Generated tags/${tag}.html`);
  }

  // Generate tags index
  const tagsIndexHtml = generateTagsIndex(graphData);
  fs.outputFileSync(path.join(DIST_DIR, 'tags.html'), tagsIndexHtml);
  console.log('  ✓ Generated tags.html');

  // Copy images discovered during rendering
  if (pendingImages.size > 0) {
    console.log('🖼️  Copying images...');
    for (const [srcPath, basename] of pendingImages.entries()) {
      fs.copySync(srcPath, path.join(DIST_DIR, 'images', basename));
    }
    console.log(`  ✓ Copied ${pendingImages.size} image(s)`);
  }

  // Copy static assets
  console.log('📦 Copying assets...');
  const assetsDir = path.join(SOURCE_DIR, 'assets');
  if (fs.existsSync(assetsDir)) {
    fs.copySync(assetsDir, path.join(DIST_DIR, 'assets'));
    console.log('  ✓ Copied assets');
  }

  // Copy media
  const mediaDir = path.join(SOURCE_DIR, 'media');
  if (fs.existsSync(mediaDir)) {
    fs.copySync(mediaDir, path.join(DIST_DIR, 'media'));
    console.log('  ✓ Copied media');
  }

  // Copy template files (CSS and JS)
  console.log('📦 Copying template files...');
  const templatesDir = path.join(__dirname, 'templates');
  fs.copySync(path.join(templatesDir, 'app.js'), path.join(DIST_DIR, 'app.js'));
  fs.copySync(path.join(templatesDir, 'styles.css'), path.join(DIST_DIR, 'styles.css'));
  const hljsCssPath = path.join(__dirname, 'node_modules', 'highlight.js', 'styles', 'github-dark.min.css');
  fs.copySync(hljsCssPath, path.join(DIST_DIR, 'highlight.css'));
  console.log('  ✓ Copied app.js, styles.css, and highlight.css');

  console.log('✨ Build complete!');
  console.log(`📁 Output directory: ${DIST_DIR}`);
}

// Run build
build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
