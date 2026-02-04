const fs = require('fs-extra');
const path = require('path');
const MarkdownIt = require('markdown-it');
const matter = require('gray-matter');

// Configuration
const SOURCE_DIR = path.join(__dirname, '..', 'obs-site');
const DIST_DIR = path.join(__dirname, 'dist');
const OBSIDIAN_DIR = path.join(SOURCE_DIR, '.obsidian');

// Initialize markdown parser with wiki link support
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// Custom wiki link plugin
md.use((md) => {
  const defaultRender = md.renderer.rules.text || ((tokens, idx) => tokens[idx].content);

  md.renderer.rules.text = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const content = token.content;

    // Replace [[wiki links]] with proper HTML links
    const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
    const replaced = content.replace(wikiLinkRegex, (match, linkText) => {
      // Handle links with display text: [[link|display]]
      const parts = linkText.split('|');
      const link = parts[0].trim();
      const display = parts[1] ? parts[1].trim() : link;

      // Convert to URL-safe path
      const href = `/${slugify(link)}.html`;
      return `<a href="${href}" class="wiki-link">${display}</a>`;
    });

    return replaced;
  };
});

// Helper function to create URL-safe slugs
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// File tree structure
const fileTree = {
  files: [],
  directories: {}
};

// Scan directory and build file tree
function scanDirectory(dir, baseDir = SOURCE_DIR, tree = fileTree) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.relative(SOURCE_DIR, fullPath);
    const stat = fs.statSync(fullPath);

    // Skip .obsidian, node_modules, and hidden files
    if (item.startsWith('.') || item === 'node_modules') continue;

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
    }
  }

  return tree;
}

// Generate HTML for a markdown file
function generatePage(fileInfo, allFiles, graphData) {
  const content = fs.readFileSync(fileInfo.fullPath, 'utf-8');
  const { data: frontmatter, content: markdown } = matter(content);
  const html = md.render(markdown);

  const title = frontmatter.title || fileInfo.name.replace('.md', '');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/styles.css">
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
    </aside>
    <main class="content">
      <article class="markdown-body">
        ${html}
      </article>
    </main>
    <button class="sidebar-toggle" id="sidebar-toggle">☰</button>
  </div>
  <script>
    window.__FILE_TREE__ = ${JSON.stringify(fileTree)};
    window.__GRAPH_DATA__ = ${JSON.stringify(graphData)};
    window.__CURRENT_PAGE__ = "${fileInfo.slug}";
  </script>
  <script src="/app.js"></script>
</body>
</html>
  `.trim();
}

// Generate index page
function generateIndex(tree, graphData) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home</title>
  <link rel="stylesheet" href="/styles.css">
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
    </aside>
    <main class="content">
      <div class="welcome">
        <h1>Welcome</h1>
        <p>Select a file from the sidebar to begin.</p>
        <div id="graph-container" class="graph-container">
          <canvas id="graph-canvas"></canvas>
        </div>
      </div>
    </main>
    <button class="sidebar-toggle" id="sidebar-toggle">☰</button>
  </div>
  <script>
    window.__FILE_TREE__ = ${JSON.stringify(tree)};
    window.__GRAPH_DATA__ = ${JSON.stringify(graphData)};
    window.__CURRENT_PAGE__ = "index";
  </script>
  <script src="/app.js"></script>
</body>
</html>
  `.trim();
}

// Build the site
async function build() {
  console.log('🏗️  Building static site...');

  // Clean dist directory
  await fs.emptyDir(DIST_DIR);

  // Scan files
  console.log('📂 Scanning files...');
  const tree = scanDirectory(SOURCE_DIR);

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
      const html = generatePage(file, tree.files, graphData);
      const outputPath = path.join(DIST_DIR, `${file.slug}.html`);
      fs.outputFileSync(outputPath, html);
      console.log(`  ✓ Generated ${file.slug}.html`);

      // Track hello.md file for index page
      if (file.slug === 'hello' || file.slug === 'hello' || file.name.includes('hello')) {
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
    indexHtml = generatePage(helloFile, tree.files, graphData);
    console.log('  ✓ Generated index.html from hello.md');
  } else {
    indexHtml = generateIndex(tree, graphData);
    console.log('  ✓ Generated index.html (default)');
  }
  fs.outputFileSync(path.join(DIST_DIR, 'index.html'), indexHtml);

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
  console.log('  ✓ Copied app.js and styles.css');

  console.log('✨ Build complete!');
  console.log(`📁 Output directory: ${DIST_DIR}`);
}

// Run build
build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
