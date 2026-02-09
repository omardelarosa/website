# Obsidian Static Site Generator

A static site generator that transforms Obsidian vault markdown files into a fully functional website with interactive features.

## Features

- **Markdown Rendering**: Full markdown support with code highlighting
- **Wiki Links**: Automatic parsing and linking of `[[wiki-style]]` links
- **File Explorer**: Hierarchical sidebar showing your vault structure
- **Search**: Client-side full-text search across all content
- **Graph View**: Visual representation of note connections
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Mobile-friendly design with collapsible sidebar

## Usage

### Development

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Serve locally (after building)
npm run serve
```

### Build Output

The static site is generated in the `dist/` directory and includes:

- HTML files for each markdown file in your vault
- CSS and JavaScript for styling and interactivity
- Copied assets and media from your Obsidian vault

### Project Structure

```
obs-static-site/
├── build.js           # Main build script
├── templates/
│   ├── app.js        # Client-side JavaScript
│   └── styles.css    # Styling
├── dist/             # Generated static site (gitignored)
└── package.json
```

## How It Works

1. **Scan**: The build script scans the `obs-site` package for all markdown files
2. **Parse**: Each file is parsed using `gray-matter` (for frontmatter) and `markdown-it` (for content)
3. **Transform**: Wiki links (`[[link]]`) are converted to proper HTML links
4. **Generate**: HTML pages are created using templates with embedded file tree and graph data
5. **Copy**: Static assets (CSS, JS, images) are copied to the dist directory

## Configuration

The source directory is hardcoded to `../obs-site`. To change this, edit the `SOURCE_DIR` constant in `build.js`.

## Deployment

This package is configured to deploy via Netlify. The build command is specified in the root `netlify.toml`:

```toml
[build]
publish = "packages/obs-static-site/dist"
command = "cd packages/obs-static-site && npm install && npm run build"
```

## Technologies

- **markdown-it**: Markdown parsing
- **gray-matter**: Frontmatter extraction
- **fs-extra**: File system operations
- Vanilla JavaScript for client-side features (no framework)
