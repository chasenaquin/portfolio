document.addEventListener('DOMContentLoaded', () => {
    const owner = 'chasenaquin'; // Replace with your GitHub username
    const repo = 'portfolio'; // Replace with your GitHub repository name
    const branch = 'main'; // Change if your GitHub Pages branch is different

    let index; // Lunr index
    let documents = {}; // Store {path: {title, content}}
    let navTree; // Store the nav UL for filtering

    // Theme toggle logic
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';

    themeToggle.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    });

    // Fetch repo tree
    fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`)
        .then(response => response.json())
        .then(data => {
            if (data.tree) {
                // Filter items in 'docs/' folder
                const docsItems = data.tree.filter(item => item.path.startsWith('docs/') && item.type === 'blob' && item.path.endsWith('.md'));

                // Build nested structure
                const root = { children: {}, type: 'tree' };
                docsItems.forEach(item => {
                    const parts = item.path.split('/').slice(1); // Remove 'docs/'
                    let current = root;
                    parts.forEach((part, index) => {
                        if (!current.children[part]) {
                            current.children[part] = {
                                type: index === parts.length - 1 ? 'blob' : 'tree',
                                path: item.path,
                                children: {}
                            };
                        }
                        current = current.children[part];
                    });
                });

                // Build nested UL
                function buildUL(node, level = 0, parentPath = '') {
                    const ul = document.createElement('ul');
                    const keys = Object.keys(node.children).sort();
                    keys.forEach(key => {
                        const child = node.children[key];
                        const currentPath = parentPath ? `${parentPath}/${key}` : key;
                        const li = document.createElement('li');
                        li.dataset.fullPath = currentPath;

                        if (child.type === 'tree') {
                            li.classList.add('category');
                            const title = key.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                            li.innerHTML = title;
                            li.dataset.isCategory = 'true';

                            const subUL = buildUL(child, level + 1, currentPath);
                            li.appendChild(subUL);

                            li.addEventListener('click', (e) => {
                                if (e.target === li || e.target.tagName !== 'A') {
                                    e.stopPropagation();
                                    subUL.style.display = subUL.style.display === 'none' || subUL.style.display === '' ? 'block' : 'none';
                                }
                            });

                            if (level > 0) {
                                subUL.style.display = 'none';
                            }
                        } else if (child.type === 'blob') {
                            const a = document.createElement('a');
                            a.classList.add('doc-link');
                            const name = key.replace('.md', '').replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                            a.innerText = name;
                            a.href = '#';
                            a.dataset.path = child.path;
                            li.appendChild(a);
                            li.dataset.isDoc = 'true';
                            documents[child.path] = { title: name, content: '' };
                        }

                        if (li.hasChildNodes()) {
                            ul.appendChild(li);
                        }
                    });
                    return ul;
                }

                const docList = document.getElementById('docList');
                navTree = buildUL(root, 0);
                docList.appendChild(navTree);

                // Fetch document contents for Lunr index
                const fetchPromises = docsItems.map(item => {
                    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${item.path}`;
                    return fetch(rawUrl)
                        .then(res => res.text())
                        .then(content => {
                            const relativePath = item.path.slice(5);
                            const title = relativePath.replace('.md', '').split('/').pop().replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                            documents[item.path] = { title, content };
                        });
                });

                Promise.all(fetchPromises).then(() => {
                    index = lunr(function () {
                        this.ref('path');
                        this.field('title', { boost: 10 });
                        this.field('content');
                        this.metadataWhitelist = ['position'];

                        Object.keys(documents).forEach(path => {
                            this.add({
                                path,
                                title: documents[path].title,
                                content: documents[path].content
                            });
                        });
                    });
                }).catch(error => console.error('Error fetching documents:', error));
            }
        })
        .catch(error => console.error('Error fetching repo tree:', error));

    // Handle document link clicks
    let currentSearchTerm = '';
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('doc-link')) {
            e.preventDefault();
            const path = e.target.dataset.path;
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
            fetch(rawUrl)
                .then(response => response.text())
                .then(md => {
                    let html = marked.parse(md);
                    if (currentSearchTerm) {
                        const terms = currentSearchTerm.split(/\s+/).filter(t => t);
                        terms.forEach(term => {
                            const regex = new RegExp(`(${term})`, 'gi');
                            html = html.replace(regex, '<mark>$1</mark>');
                        });
                    }
                    document.getElementById('docContent').innerHTML = html;
                })
                .catch(error => console.error('Error loading document:', error));
        }
    });

    // Handle search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim().toLowerCase();
        if (!index) return;

        if (!currentSearchTerm) {
            const allLis = document.querySelectorAll('#docList li');
            allLis.forEach(li => {
                li.style.display = '';
                if (li.querySelector('ul')) {
                    li.querySelector('ul').style.display = li.dataset.level > 0 ? 'none' : 'block';
                }
            });
            return;
        }

        const results = index.search(currentSearchTerm + '*');
        const matchingPaths = new Set(results.map(res => res.ref));

        function filterNode(ul) {
            let hasVisible = false;
            Array.from(ul.children).forEach(li => {
                const isCategory = li.classList.contains('category');
                const subUL = li.querySelector('ul');
                if (isCategory && subUL) {
                    const subVisible = filterNode(subUL);
                    li.style.display = subVisible ? '' : 'none';
                    if (subVisible) {
                        subUL.style.display = 'block';
                        hasVisible = true;
                    }
                } else {
                    const path = li.querySelector('a')?.dataset.path;
                    const visible = matchingPaths.has(path);
                    li.style.display = visible ? '' : 'none';
                    if (visible) hasVisible = true;
                }
            });
            return hasVisible;
        }

        filterNode(navTree);
    });
});
