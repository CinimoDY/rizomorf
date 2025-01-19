const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
    // Get the base path from environment or default to ''
    const baseUrl = process.env.NODE_ENV === 'production' ? '/rizomorf' : '';

    // Add baseUrl as a global data object
    eleventyConfig.addGlobalData("baseUrl", baseUrl);

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

    // Add blog collection with file dates
    eleventyConfig.addCollection("blog", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/content/blog/**/*.md")
            .filter(post => post.data.title !== "Blog" && post.data.title !== "feed")
            .map(post => {
                // Use frontmatter date if available, otherwise use file creation date
                if (!post.data.date) {
                    const stats = fs.statSync(post.inputPath);
                    post.data.date = stats.birthtime;
                }
                return post;
            })
            .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
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