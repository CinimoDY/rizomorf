const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const frontMatter = require('front-matter');

const CONTENT_DIR = path.join(__dirname, '../src/content');
const OUTPUT_DIR = path.join(__dirname, '../dist');
const TEMPLATE_DIR = path.join(__dirname, '../src/templates');
const BASE_PATH = process.env.NODE_ENV === 'production' 
  ? '/homepage'
  : '.';

async function build() {
  // Clear previous build
  await fs.emptyDir(OUTPUT_DIR);
  
  // Copy static assets
  await fs.copy(path.join(__dirname, '../src/public'), OUTPUT_DIR);
  
  // Build pages
  await buildPages();
  
  // Build blog posts
  await buildBlog();
}

async function buildPages() {
  const pagesDir = path.join(CONTENT_DIR, 'pages');
  const pages = await fs.readdir(pagesDir);
  
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
  
  for (const post of posts) {
    if (post.endsWith('.md')) {
      const content = await fs.readFile(path.join(blogDir, post), 'utf-8');
      const { attributes, body } = frontMatter(content);
      const html = marked(body);
      
      const outputPath = path.join(OUTPUT_DIR, 'blog', post.replace('.md', '.html'));
      await fs.outputFile(outputPath, applyTemplate('post', { content: html, ...attributes }));
    }
  }
}

function applyTemplate(templateName, data) {
  const template = fs.readFileSync(path.join(TEMPLATE_DIR, `${templateName}.html`), 'utf-8');
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key === 'cssPath') {
      return `${BASE_PATH}/css/style.css`;
    }
    return data[key] || '';
  });
}

build().catch(console.error); 