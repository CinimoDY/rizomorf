const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const frontMatter = require('front-matter');

const CONTENT_DIR = path.join(__dirname, '../src/content');
const OUTPUT_DIR = path.join(__dirname, '../dist');
const TEMPLATE_DIR = path.join(__dirname, '../src/layouts');
const BASE_PATH = process.env.NODE_ENV === 'production' 
  ? '/rizomorf'
  : '';

console.log('Building with BASE_PATH:', BASE_PATH);

// Custom renderer to transform links in production
const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
    if (process.env.NODE_ENV === 'production' && href.startsWith('/')) {
        href = `/rizomorf${href}`;
    }
    return title 
        ? `<a href="${href}" title="${title}">${text}</a>`
        : `<a href="${href}">${text}</a>`;
};

marked.setOptions({
    renderer: renderer
});

async function build() {
  // Clear previous build
  await fs.emptyDir(OUTPUT_DIR);
  
  // Copy static assets from src/public
  const publicDir = path.join(__dirname, '../src/public');
  await fs.copy(publicDir, OUTPUT_DIR);
  
  // Build pages
  await buildPages();
  
  // Build blog posts
  await buildBlog();
  
  // Build UX work
  await buildUXWork();
}

async function buildPages() {
  const pagesDir = path.join(CONTENT_DIR, 'pages');
  const pages = await fs.readdir(pagesDir);
  
  for (const page of pages) {
    if (page.endsWith('.md')) {
      const content = await fs.readFile(path.join(pagesDir, page), 'utf-8');
      const { attributes, body } = frontMatter(content);
      const html = marked(body);
      
      const outputPath = path.join(OUTPUT_DIR, page.replace('.md', '.html'));
      await fs.outputFile(
        outputPath, 
        applyTemplate(attributes.layout || 'base', { 
          content: html,
          ...attributes,
          baseUrl: BASE_PATH
        })
      );
    }
  }
}

async function buildBlog() {
  const blogDir = path.join(CONTENT_DIR, 'blog');
  const posts = await fs.readdir(blogDir);
  const blogPosts = [];
  
  // Create blog directory in output
  await fs.ensureDir(path.join(OUTPUT_DIR, 'blog'));
  
  // Process each blog post
  for (const post of posts) {
    if (post.endsWith('.md') && post !== 'index.md') {
      const content = await fs.readFile(path.join(blogDir, post), 'utf-8');
      const { attributes, body } = frontMatter(content);
      const html = marked(body);
      
      // Store post metadata for index
      blogPosts.push({
        title: attributes.title,
        date: attributes.date,
        tags: attributes.tags,
        filename: post.replace('.md', '.html')
      });
      
      const outputPath = path.join(OUTPUT_DIR, 'blog', post.replace('.md', '.html'));
      await fs.outputFile(
        outputPath, 
        applyTemplate(attributes.layout || 'base', {
          content: html,
          ...attributes,
          baseUrl: BASE_PATH
        })
      );
    }
  }
  
  // Sort posts by date, newest first
  blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Build blog index
  const indexContent = await fs.readFile(path.join(blogDir, 'index.md'), 'utf-8');
  const { attributes, body } = frontMatter(indexContent);
  let html = marked(body);
  
  // Update post links to include basePath
  const postsList = blogPosts.map(post => {
    const date = new Date(post.date).toLocaleDateString();
    return `- ${date} - [${post.title}](${BASE_PATH}/blog/${post.filename})${post.tags ? ` [${post.tags}]` : ''}`;
  }).join('\n');
  
  html = html.replace('{{blog_posts}}', marked(postsList));
  
  const indexPath = path.join(OUTPUT_DIR, 'blog', 'index.html');
  await fs.outputFile(
    indexPath, 
    applyTemplate(attributes.layout || 'base', {
      content: html,
      ...attributes,
      baseUrl: BASE_PATH
    })
  );
}

async function buildUXWork() {
  const uxDir = path.join(CONTENT_DIR, 'ux-work');
  const projects = await fs.readdir(uxDir);
  
  // Create ux-work directory in output
  await fs.ensureDir(path.join(OUTPUT_DIR, 'ux-work'));
  
  const uxProjects = [];
  
  // Process each project
  for (const project of projects) {
    if (project.endsWith('.md') && project !== 'index.md') {
      const content = await fs.readFile(path.join(uxDir, project), 'utf-8');
      const { attributes, body } = frontMatter(content);
      const html = marked(body);
      
      uxProjects.push({
        title: attributes.title,
        overview: attributes.overview,
        filename: project.replace('.md', '.html')
      });
      
      const outputPath = path.join(OUTPUT_DIR, 'ux-work', project.replace('.md', '.html'));
      await fs.outputFile(
        outputPath,
        applyTemplate(attributes.layout || 'ux-project', {
          content: html,
          ...attributes,
          baseUrl: BASE_PATH
        })
      );
    }
  }
  
  // Build UX work index
  const indexContent = await fs.readFile(path.join(uxDir, 'index.md'), 'utf-8');
  const { attributes, body } = frontMatter(indexContent);
  const html = marked(body);
  
  const indexPath = path.join(OUTPUT_DIR, 'ux-work', 'index.html');
  await fs.outputFile(
    indexPath,
    applyTemplate(attributes.layout || 'ux-index', {
      content: html,
      projects: uxProjects,
      ...attributes,
      baseUrl: BASE_PATH
    })
  );
}

function applyTemplate(templateName, data) {
  const templatePath = path.join(TEMPLATE_DIR, `${templateName}.njk`);
  const template = fs.readFileSync(templatePath, 'utf-8');
  
  // Helper function to replace template variables
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    key = key.trim();
    if (key === 'content') {
      return data.content || '';
    }
    if (key.startsWith('if ')) {
      const condition = key.slice(3);
      return data[condition] ? '' : '{% endif %}';
    }
    if (key === 'endif') {
      return '';
    }
    if (key === 'block content') {
      return data.content || '';
    }
    if (key === 'endblock') {
      return '';
    }
    return data[key] || '';
  });
}

build().catch(console.error); 