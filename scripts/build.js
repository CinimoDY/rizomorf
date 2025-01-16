const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const frontMatter = require('front-matter');

const CONTENT_DIR = path.join(__dirname, '../src/content');
const OUTPUT_DIR = path.join(__dirname, '../dist');
const TEMPLATE_DIR = path.join(__dirname, '../src/templates');
const BASE_PATH = process.env.NODE_ENV === 'production' 
  ? '/rizomorf'
  : '.';

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
  
  // Build pages (including index.html) first
  await buildPages();
  
  // Copy static assets from src/public EXCEPT index.html
  const publicDir = path.join(__dirname, '../src/public');
  const files = await fs.readdir(publicDir);
  for (const file of files) {
    if (file !== 'index.html') {
      await fs.copy(path.join(publicDir, file), path.join(OUTPUT_DIR, file));
    }
  }
  
  // Build blog posts
  await buildBlog();
}

async function buildPages() {
  const pagesDir = path.join(CONTENT_DIR, 'pages');
  const pages = await fs.readdir(pagesDir);
  
  // Process index.html through template engine
  const indexContent = await fs.readFile(path.join(__dirname, '../src/public/index.html'), 'utf-8');
  await fs.outputFile(
    path.join(OUTPUT_DIR, 'index.html'), 
    applyTemplate('raw', { content: indexContent })
  );
  
  for (const page of pages) {
    // Skip index.md since we're using a direct HTML file
    if (page.endsWith('.md') && page !== 'index.md') {
      const content = await fs.readFile(path.join(pagesDir, page), 'utf-8');
      const { attributes, body } = frontMatter(content);
      const html = marked(body);
      
      const outputPath = path.join(OUTPUT_DIR, page.replace('.md', '.html'));
      await fs.outputFile(outputPath, applyTemplate('page', { content: html, ...attributes }));
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
      await fs.outputFile(outputPath, applyTemplate('post', { 
        content: html,
        title: attributes.title,
        date: new Date(attributes.date).toLocaleDateString(),
        tags: attributes.tags,
        basePath: BASE_PATH,
        isInSubfolder: true,
        cssPath: '../css/style.css'
      }));
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
    return `- ${date} - [${post.title}](${BASE_PATH}/${post.filename})${post.tags ? ` [${post.tags}]` : ''}`;
  }).join('\n');
  
  html = html.replace('{{blog_posts}}', marked(postsList));
  
  const indexPath = path.join(OUTPUT_DIR, 'blog', 'index.html');
  await fs.outputFile(indexPath, applyTemplate('page', { 
    content: html, 
    ...attributes,
    title: attributes.title || 'Blog',
    isInSubfolder: true
  }));
}

function applyTemplate(templateName, data) {
  const template = fs.readFileSync(path.join(TEMPLATE_DIR, `${templateName}.html`), 'utf-8');
  
  // Helper function to replace template variables
  const replaceVariables = (text, isInSubfolder = false) => {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      if (key === 'cssPath') {
        // Add ../ prefix if in a subfolder
        return isInSubfolder ? '../css/style.css' : './css/style.css';
      }
      if (key === 'basePath') {
        // Add ../ prefix if in a subfolder
        return isInSubfolder ? '..' : '.';
      }
      return data[key] || '';
    });
  };

  // First replace variables in the content
  if (data.content) {
    data.content = replaceVariables(data.content, data.isInSubfolder);
  }

  // Then process the template
  return replaceVariables(template, data.isInSubfolder);
}

build().catch(console.error); 