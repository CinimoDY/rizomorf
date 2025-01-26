const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
    // Get the base path from environment or default to ''
    const baseUrl = process.env.NODE_ENV === 'production' ? '/rizomorf' : '';

    // Add baseUrl as a global data object
    eleventyConfig.addGlobalData("baseUrl", baseUrl);

    // Add pathPrefix as a global data object to ensure it's available in templates
    eleventyConfig.addGlobalData("pathPrefix", baseUrl);

    // Collections
    eleventyConfig.addCollection("uxWork", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/content/ux-work/**/*.md")
            .sort((a, b) => {
                if (a.data.order && b.data.order) {
                    return a.data.order - b.data.order;
                }
                return 0;
            });
    });

    // Add blog collection with file last modified dates
    eleventyConfig.addCollection("blog", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/content/blog/**/*.md")
            .filter(post => post.data.title !== "Blog" && post.data.title !== "feed")
            .map(post => {
                // Use frontmatter date if available, otherwise use file's modified date
                if (!post.data.date) {
                    const stats = fs.statSync(post.inputPath);
                    post.data.date = stats.mtime;
                }
                return post;
            })
            .sort((a, b) => b.data.date - a.data.date); // Sort by date in descending order
    });

    // Generate search index
    eleventyConfig.addCollection("searchIndex", async function(collectionApi) {
        const searchIndex = [];
        
        // Add blog posts
        const blogPosts = collectionApi.getFilteredByGlob("src/content/blog/**/*.md");
        for (const post of blogPosts) {
            if (post.data.title !== "Blog" && post.data.title !== "feed") {
                const content = await fs.promises.readFile(post.inputPath, 'utf8');
                searchIndex.push({
                    title: post.data.title,
                    content: content,
                    url: `${baseUrl}/blog/${post.fileSlug}.html`,
                    type: 'blog'
                });
            }
        }

        // Add UX work
        const uxWork = collectionApi.getFilteredByGlob("src/content/ux-work/**/*.md");
        for (const work of uxWork) {
            const content = await fs.promises.readFile(work.inputPath, 'utf8');
            searchIndex.push({
                title: work.data.title,
                content: content,
                url: `${baseUrl}/ux-work/${work.fileSlug}.html`,
                type: 'ux-work'
            });
        }

        // Add pages
        const pages = collectionApi.getFilteredByGlob("src/content/pages/**/*.md");
        for (const page of pages) {
            const content = await fs.promises.readFile(page.inputPath, 'utf8');
            searchIndex.push({
                title: page.data.title,
                content: content,
                url: `${baseUrl}/${page.fileSlug}.html`,
                type: 'page'
            });
        }

        // Write search index to JSON file
        const outputPath = path.join(__dirname, 'dist', 'search-index.json');
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(searchIndex));

        return searchIndex;
    });

    // Pass through copy for static assets
    eleventyConfig.addPassthroughCopy({
        "src/public/css": "css",
        "src/public/js": "js",
        "src/public/games": "games"
    });

    // Watch targets
    eleventyConfig.addWatchTarget("src/public/css/");
    eleventyConfig.addWatchTarget("src/public/js/");
    eleventyConfig.addWatchTarget("src/public/games/");

    // Add filter for formatting dates in DOS style
    eleventyConfig.addFilter("formatDate", function(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    });

    return {
        dir: {
            input: "src",
            output: "dist",
            includes: "layouts",
            layouts: "layouts",
            data: "_data"
        },
        templateFormats: ["md", "njk", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        pathPrefix: baseUrl
    };
}; 