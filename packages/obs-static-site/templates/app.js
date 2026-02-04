// Client-side JavaScript for interactive features

(function() {
  'use strict';

  // State
  let currentTheme = localStorage.getItem('theme') || 'light';
  let searchIndex = [];

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupTheme();
    renderFileTree();
    setupSearch();
    setupSidebar();
    setupGraphView();
  }

  // Theme management
  function setupTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const app = document.querySelector('.app');

    // Apply saved theme
    app.setAttribute('data-theme', currentTheme);
    updateThemeIcon(themeToggle, currentTheme);

    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      app.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
      updateThemeIcon(themeToggle, currentTheme);
    });
  }

  function updateThemeIcon(button, theme) {
    button.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  // File tree rendering
  function renderFileTree() {
    const container = document.getElementById('file-tree');
    const tree = window.__FILE_TREE__;

    if (!tree) return;

    const html = buildTreeHTML(tree);
    container.innerHTML = html;

    // Build search index
    buildSearchIndex(tree);
  }

  function buildTreeHTML(tree, level = 0) {
    let html = '<ul class="tree-list">';

    // Render files
    for (const file of tree.files) {
      const isActive = window.__CURRENT_PAGE__ === file.slug;
      const activeClass = isActive ? ' active' : '';
      const displayName = file.name.replace('.md', '');
      html += `
        <li class="tree-item${activeClass}">
          <a href="/${file.slug}.html" class="tree-link">
            📄 ${displayName}
          </a>
        </li>
      `;
    }

    // Render directories
    for (const [dirName, subTree] of Object.entries(tree.directories)) {
      const hasFiles = subTree.files.length > 0 || Object.keys(subTree.directories).length > 0;
      if (!hasFiles) continue;

      html += `
        <li class="tree-item tree-folder">
          <details ${level === 0 ? 'open' : ''}>
            <summary class="tree-folder-summary">
              📁 ${dirName}
            </summary>
            ${buildTreeHTML(subTree, level + 1)}
          </details>
        </li>
      `;
    }

    html += '</ul>';
    return html;
  }

  // Search functionality
  function buildSearchIndex(tree) {
    function traverse(tree) {
      for (const file of tree.files) {
        searchIndex.push({
          name: file.name.replace('.md', ''),
          slug: file.slug,
          path: file.path
        });
      }

      for (const subTree of Object.values(tree.directories)) {
        traverse(subTree);
      }
    }

    traverse(tree);
  }

  function setupSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(e.target.value);
      }, 300);
    });
  }

  function performSearch(query) {
    const container = document.getElementById('file-tree');
    if (!query.trim()) {
      renderFileTree();
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = searchIndex.filter(item =>
      item.name.toLowerCase().includes(lowerQuery)
    );

    if (results.length === 0) {
      container.innerHTML = '<div class="search-empty">No results found</div>';
      return;
    }

    let html = '<ul class="tree-list search-results">';
    for (const result of results) {
      const isActive = window.__CURRENT_PAGE__ === result.slug;
      const activeClass = isActive ? ' active' : '';
      html += `
        <li class="tree-item${activeClass}">
          <a href="/${result.slug}.html" class="tree-link">
            🔍 ${result.name}
          </a>
          <div class="search-path">${result.path}</div>
        </li>
      `;
    }
    html += '</ul>';

    container.innerHTML = html;
  }

  // Sidebar toggle for mobile
  function setupSidebar() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      }
    });
  }

  // Graph view
  function setupGraphView() {
    const canvas = document.getElementById('graph-canvas');
    if (!canvas) return;

    const graphData = window.__GRAPH_DATA__;
    if (!graphData) return;

    // Simple graph visualization
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height || 400;

    // Create nodes from file tree
    const nodes = [];
    const tree = window.__FILE_TREE__;

    function collectNodes(tree, nodes) {
      for (const file of tree.files) {
        nodes.push({
          id: file.slug,
          label: file.name.replace('.md', ''),
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: 0
        });
      }

      for (const subTree of Object.values(tree.directories)) {
        collectNodes(subTree, nodes);
      }
    }

    collectNodes(tree, nodes);

    // Simple force-directed layout
    let animationId;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply forces
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Repulsion
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 100 / (dist * dist);

          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }

        // Center attraction
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        node.vx += (centerX - node.x) * 0.001;
        node.vy += (centerY - node.y) * 0.001;

        // Damping
        node.vx *= 0.8;
        node.vy *= 0.8;

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Keep in bounds
        node.x = Math.max(20, Math.min(canvas.width - 20, node.x));
        node.y = Math.max(20, Math.min(canvas.height - 20, node.y));
      }

      // Draw nodes
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--node-color') || '#4f46e5';

      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw label on hover (simplified - always show for now)
        if (nodes.length < 50) {
          ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--text-color') || '#000';
          ctx.font = '10px sans-serif';
          ctx.fillText(node.label, node.x + 8, node.y + 3);
          ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--node-color') || '#4f46e5';
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Stop animation when navigating away
    window.addEventListener('beforeunload', () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });
  }
})();
