const assert = require('assert');
const {
  slugify,
  tagSlug,
  resolvePostDate,
  generateMetaTags,
  renderPage,
  generateBottomMeta,
  isTimestampValue,
  generatePageFromData,
  linkifyTags
} = require('./build.js');

// Test utilities
function runTest(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(`  ${err.message}`);
    if (err.stack) {
      console.error(err.stack.split('\n').slice(1, 4).join('\n'));
    }
    return false;
  }
}

function assertIncludes(actual, expected, message) {
  assert.ok(
    actual.includes(expected),
    message || `Expected "${actual}" to include "${expected}"`
  );
}

function assertNotIncludes(actual, notExpected, message) {
  assert.ok(
    !actual.includes(notExpected),
    message || `Expected "${actual}" to not include "${notExpected}"`
  );
}

// Test suite
const tests = [];

// slugify tests
tests.push(() => runTest('slugify: converts simple text to slug', () => {
  assert.strictEqual(slugify('Hello World'), 'hello-world');
}));

tests.push(() => runTest('slugify: handles emojis with percent encoding', () => {
  const result = slugify('👋 hello');
  assert.ok(result.includes('%'));
  assert.ok(result.includes('hello'));
}));

tests.push(() => runTest('slugify: handles CJK characters', () => {
  const result = slugify('日本語');
  assert.ok(result.includes('%'));
}));

tests.push(() => runTest('slugify: removes punctuation', () => {
  assert.strictEqual(slugify('hello, world!'), 'hello-world');
}));

tests.push(() => runTest('slugify: handles multiple spaces', () => {
  assert.strictEqual(slugify('hello   world'), 'hello-world');
}));

tests.push(() => runTest('slugify: removes leading/trailing hyphens', () => {
  // Hyphens are punctuation and get removed, leaving just the text
  assert.strictEqual(slugify('-hello-world-'), 'helloworld');
}));

// tagSlug tests
tests.push(() => runTest('tagSlug: converts tag to slug', () => {
  assert.strictEqual(tagSlug('MyTag'), 'mytag');
}));

tests.push(() => runTest('tagSlug: preserves hyphens in tags', () => {
  assert.strictEqual(tagSlug('my-tag'), 'my-tag');
}));

tests.push(() => runTest('tagSlug: replaces non-alphanumeric with hyphens', () => {
  // Trailing hyphens are removed
  assert.strictEqual(tagSlug('my tag!'), 'my-tag');
}));

// resolvePostDate tests
tests.push(() => runTest('resolvePostDate: handles Date objects', () => {
  const testDate = new Date('2025-10-20');
  const fileInfo = { fullPath: '/fake/path.md' };
  const frontmatter = { created: testDate };
  const result = resolvePostDate(fileInfo, frontmatter);
  assert.ok(result instanceof Date);
  assert.strictEqual(result.toISOString(), testDate.toISOString());
}));

tests.push(() => runTest('resolvePostDate: converts Unix seconds to milliseconds', () => {
  const unixSeconds = 1770645012; // 2026-02-09 in seconds
  const fileInfo = { fullPath: '/fake/path.md' };
  const frontmatter = { created: unixSeconds };
  const result = resolvePostDate(fileInfo, frontmatter);
  assert.ok(result instanceof Date);
  // Should be 2026, not 1970
  assert.ok(result.getFullYear() > 2020);
}));

tests.push(() => runTest('resolvePostDate: handles Unix milliseconds', () => {
  const unixMillis = 1666562513166; // 2022-10-23 in milliseconds
  const fileInfo = { fullPath: '/fake/path.md' };
  const frontmatter = { date: unixMillis };
  const result = resolvePostDate(fileInfo, frontmatter);
  assert.ok(result instanceof Date);
  assert.strictEqual(result.getFullYear(), 2022);
}));

tests.push(() => runTest('resolvePostDate: tries multiple frontmatter fields', () => {
  const fileInfo = { fullPath: '/fake/path.md' };
  const frontmatter = { publishedAt: '2025-10-20' };
  const result = resolvePostDate(fileInfo, frontmatter);
  assert.ok(result instanceof Date);
}));

tests.push(() => runTest('resolvePostDate: handles ISO date strings', () => {
  const fileInfo = { fullPath: '/fake/path.md' };
  const frontmatter = { date: '2025-10-20T12:00:00Z' };
  const result = resolvePostDate(fileInfo, frontmatter);
  assert.ok(result instanceof Date);
  assert.strictEqual(result.getFullYear(), 2025);
}));

// isTimestampValue tests
tests.push(() => runTest('isTimestampValue: recognizes Date objects', () => {
  assert.strictEqual(isTimestampValue(new Date()), true);
}));

tests.push(() => runTest('isTimestampValue: recognizes ISO date strings', () => {
  assert.strictEqual(isTimestampValue('2025-10-20'), true);
}));

tests.push(() => runTest('isTimestampValue: rejects non-date strings', () => {
  assert.strictEqual(isTimestampValue('hello world'), false);
}));

tests.push(() => runTest('isTimestampValue: rejects numbers', () => {
  assert.strictEqual(isTimestampValue(12345), false);
}));

// generateMetaTags tests
tests.push(() => runTest('generateMetaTags: includes basic meta tags', () => {
  const pageData = {
    title: 'Test Page',
    description: 'Test description',
    url: '/test.html'
  };
  const result = generateMetaTags(pageData);
  assertIncludes(result, '<meta property="og:title" content="Test Page">');
  assertIncludes(result, '<meta property="og:description" content="Test description">');
  assertIncludes(result, '<meta name="description" content="Test description">');
}));

tests.push(() => runTest('generateMetaTags: includes image meta tags', () => {
  const pageData = {
    title: 'Test Page',
    image: '/assets/image.png',
    url: '/test.html'
  };
  const result = generateMetaTags(pageData);
  assertIncludes(result, '<meta property="og:image"');
  assertIncludes(result, '/assets/image.png');
}));

tests.push(() => runTest('generateMetaTags: includes Twitter Card tags', () => {
  const pageData = {
    title: 'Test Page',
    url: '/test.html'
  };
  const result = generateMetaTags(pageData);
  assertIncludes(result, '<meta name="twitter:card" content="summary_large_image">');
  assertIncludes(result, '<meta name="twitter:title" content="Test Page">');
}));

tests.push(() => runTest('generateMetaTags: handles external image URLs', () => {
  const pageData = {
    title: 'Test Page',
    image: 'https://example.com/image.png',
    url: '/test.html'
  };
  const result = generateMetaTags(pageData);
  assertIncludes(result, 'https://example.com/image.png');
  assertNotIncludes(result, 'https://omardelarosa.comhttps://');
}));

// generateBottomMeta tests
tests.push(() => runTest('generateBottomMeta: generates empty string for excluded fields', () => {
  const frontmatter = { title: 'Test', date: '2025-10-20' };
  const result = generateBottomMeta(frontmatter);
  assert.strictEqual(result, '');
}));

tests.push(() => runTest('generateBottomMeta: includes custom fields', () => {
  const frontmatter = { author: 'John Doe', category: 'Tech' };
  const result = generateBottomMeta(frontmatter);
  assertIncludes(result, 'author');
  assertIncludes(result, 'John Doe');
  assertIncludes(result, 'category');
  assertIncludes(result, 'Tech');
}));

tests.push(() => runTest('generateBottomMeta: renders tags as links', () => {
  const frontmatter = { tags: ['javascript', 'nodejs'] };
  const result = generateBottomMeta(frontmatter);
  assertIncludes(result, '/tags/javascript.html');
  assertIncludes(result, '/tags/nodejs.html');
  assertIncludes(result, '#javascript');
  assertIncludes(result, '#nodejs');
}));

tests.push(() => runTest('generateBottomMeta: formats timestamp fields', () => {
  const frontmatter = { publishedAt: '2025-10-20T12:00:00Z' };
  const result = generateBottomMeta(frontmatter);
  assertIncludes(result, '<time datetime=');
  assertIncludes(result, 'publishedAt');
}));

tests.push(() => runTest('generateBottomMeta: includes details/summary structure', () => {
  const frontmatter = { author: 'John Doe' };
  const result = generateBottomMeta(frontmatter);
  assertIncludes(result, '<details class="post-meta-details">');
  assertIncludes(result, '<summary class="post-meta-toggle">?</summary>');
  assertIncludes(result, '<dl class="post-meta-list">');
}));

// renderPage tests
tests.push(() => runTest('renderPage: generates valid HTML structure', () => {
  const result = renderPage('Test Title', '<p>Test content</p>', 'test-slug', null);
  assertIncludes(result, '<!DOCTYPE html>');
  assertIncludes(result, '<html lang="en">');
  assertIncludes(result, '<title>Test Title</title>');
  assertIncludes(result, '<p>Test content</p>');
}));

tests.push(() => runTest('renderPage: includes meta tags', () => {
  const metadata = { description: 'Test description' };
  const result = renderPage('Test Title', '<p>Content</p>', 'test-slug', null, metadata);
  assertIncludes(result, '<meta name="description" content="Test description">');
}));

tests.push(() => runTest('renderPage: includes favicon links', () => {
  const result = renderPage('Test Title', '<p>Content</p>', 'test-slug', null);
  assertIncludes(result, '<link rel="icon" type="image/x-icon" href="/favicon.ico">');
  assertIncludes(result, '<link rel="apple-touch-icon"');
}));

tests.push(() => runTest('renderPage: includes stylesheets', () => {
  const result = renderPage('Test Title', '<p>Content</p>', 'test-slug', null);
  assertIncludes(result, '<link rel="stylesheet" href="/styles.css">');
  assertIncludes(result, '<link rel="stylesheet" href="/highlight.css">');
}));

tests.push(() => runTest('renderPage: includes Ko-fi widget', () => {
  const result = renderPage('Test Title', '<p>Content</p>', 'test-slug', null);
  assertIncludes(result, 'kofiwidget2.init');
  assertIncludes(result, 'omar delarosa');
}));

tests.push(() => runTest('renderPage: includes file tree script', () => {
  const result = renderPage('Test Title', '<p>Content</p>', 'test-slug', null);
  assertIncludes(result, 'window.__FILE_TREE__');
  assertIncludes(result, 'window.__CURRENT_PAGE__');
  assertIncludes(result, '<script src="/app.js"></script>');
}));

tests.push(() => runTest('renderPage: includes current year in copyright', () => {
  const result = renderPage('Test Title', '<p>Content</p>', 'test-slug', null);
  const currentYear = new Date().getFullYear();
  assertIncludes(result, `&copy; ${currentYear} omar delarosa`);
}));

// linkifyTags tests
tests.push(() => runTest('linkifyTags: converts #hashtags to links', () => {
  const html = '<p>Check out #javascript and #nodejs</p>';
  // Create mock tagIndex
  const mockTagIndex = new Map([
    ['javascript', []],
    ['nodejs', []]
  ]);
  const result = linkifyTags(html, mockTagIndex);
  assertIncludes(result, '<a href="/tags/javascript.html" class="tag-link">#javascript</a>');
  assertIncludes(result, '<a href="/tags/nodejs.html" class="tag-link">#nodejs</a>');
}));

tests.push(() => runTest('linkifyTags: preserves tags in code blocks', () => {
  const html = '<pre><code>#notATag</code></pre><p>#realTag</p>';
  const mockTagIndex = new Map([
    ['notatag', []],
    ['realtag', []]
  ]);
  const result = linkifyTags(html, mockTagIndex);
  assertIncludes(result, '<pre><code>#notATag</code></pre>');
  assertIncludes(result, '<a href="/tags/realtag.html" class="tag-link">#realTag</a>');
}));

tests.push(() => runTest('linkifyTags: handles tags with hyphens', () => {
  const html = '<p>#my-tag</p>';
  const mockTagIndex = new Map([['my-tag', []]]);
  const result = linkifyTags(html, mockTagIndex);
  assertIncludes(result, '<a href="/tags/my-tag.html" class="tag-link">#my-tag</a>');
}));

tests.push(() => runTest('linkifyTags: ignores tags starting with numbers', () => {
  const html = '<p>#123notValid but #valid123</p>';
  const mockTagIndex = new Map([['valid123', []]]);
  const result = linkifyTags(html, mockTagIndex);
  assertIncludes(result, '#123notValid');
  assertNotIncludes(result, '/tags/123notvalid.html');
  assertIncludes(result, '<a href="/tags/valid123.html"');
}));

// generatePageFromData tests
tests.push(() => runTest('generatePageFromData: generates page from markdown', () => {
  const markdown = `---
title: Test Post
date: 2025-10-20
---

# Test Post

This is a test post with some **bold** text.`;

  const result = generatePageFromData(markdown, 'test.md', 'test-post');
  assertIncludes(result, '<title>Test Post</title>');
  assertIncludes(result, '<h1 class="post-title">Test Post</h1>');
  assertIncludes(result, '<strong>bold</strong>');
}));

tests.push(() => runTest('generatePageFromData: extracts title from h1', () => {
  const markdown = `# My Custom Title

Content here.`;

  const result = generatePageFromData(markdown, 'test.md', 'test-post');
  assertIncludes(result, '<title>My Custom Title</title>');
  assertIncludes(result, '<h1 class="post-title">My Custom Title</h1>');
  // H1 should be removed from content
  assertNotIncludes(result, 'markdown-body">\\s*<h1>My Custom Title</h1>');
}));

tests.push(() => runTest('generatePageFromData: includes date if provided', () => {
  const markdown = `---
date: 2025-10-20T12:00:00Z
---

# Test Post

Content.`;

  const result = generatePageFromData(markdown, 'test.md', 'test-post');
  assertIncludes(result, '<time class="post-date" datetime="');
  assertIncludes(result, '2025');
}));

tests.push(() => runTest('generatePageFromData: includes bottom metadata', () => {
  const markdown = `---
title: Test
author: John Doe
category: Tech
---

Content.`;

  const result = generatePageFromData(markdown, 'test.md', 'test-post');
  assertIncludes(result, 'author');
  assertIncludes(result, 'John Doe');
}));

tests.push(() => runTest('generatePageFromData: uses frontmatter for meta tags', () => {
  const markdown = `---
title: Test Post
description: This is a test description
---

Content.`;

  const result = generatePageFromData(markdown, 'test.md', 'test-post');
  assertIncludes(result, '<meta name="description" content="This is a test description">');
  assertIncludes(result, '<meta property="og:description" content="This is a test description">');
}));

tests.push(() => runTest('generatePageFromData: handles posts without frontmatter', () => {
  const markdown = `# Simple Post

Just some content.`;

  const result = generatePageFromData(markdown, 'test.md', 'test-post');
  assertIncludes(result, '<title>Simple Post</title>');
  assertIncludes(result, 'Just some content.');
}));

tests.push(() => runTest('generatePageFromData: renders markdown lists', () => {
  const markdown = `# Test

- Item 1
- Item 2
- Item 3`;

  const result = generatePageFromData(markdown, 'test.md', 'test-post');
  assertIncludes(result, '<ul>');
  assertIncludes(result, '<li>Item 1');
  assertIncludes(result, '<li>Item 2');
}));

tests.push(() => runTest('generatePageFromData: renders markdown code blocks', () => {
  const markdown = `# Test

\`\`\`javascript
const x = 42;
\`\`\``;

  const result = generatePageFromData(markdown, 'test.md', 'test-post');
  assertIncludes(result, '<pre class="hljs">');
  // Code is syntax highlighted, so check for parts of it
  assertIncludes(result, 'const');
  assertIncludes(result, '42');
  assertIncludes(result, 'language-javascript');
}));

tests.push(() => runTest('generatePageFromData: renders inline code', () => {
  const markdown = `# Test

Use \`const\` for constants.`;

  const result = generatePageFromData(markdown, 'test.md', 'test-post');
  assertIncludes(result, '<code>const</code>');
}));

// Run all tests
console.log('\n🧪 Running build.js tests...\n');
let passed = 0;
let failed = 0;

tests.forEach(test => {
  if (test()) {
    passed++;
  } else {
    failed++;
  }
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed, ${passed + failed} total\n`);

process.exit(failed > 0 ? 1 : 0);
