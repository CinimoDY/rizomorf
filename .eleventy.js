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

    // Add blog collection
    eleventyConfig.addCollection("blog", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/content/blog/**/*.md")
            .filter(post => post.data.title !== "Blog")
            .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
    });

    // Pass through copy for static assets
    eleventyConfig.addPassthroughCopy({
        "src/public/css": "css",
        "src/public/js": "js"
    });

    // Watch targets
    eleventyConfig.addWatchTarget("src/public/css/");
    eleventyConfig.addWatchTarget("src/public/js/");

    // Add filter for formatting dates
    eleventyConfig.addFilter("formatDate", function(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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