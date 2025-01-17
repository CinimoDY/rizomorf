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

    // Pass through copy for static assets
    eleventyConfig.addPassthroughCopy({
        "src/public/css": "css",
        "src/public/js": "js"
    });

    // Watch targets
    eleventyConfig.addWatchTarget("src/public/css/");
    eleventyConfig.addWatchTarget("src/public/js/");

    // Configure directory output
    eleventyConfig.addGlobalData("permalink", function(data) {
        // Handle index pages
        if (data.page.fileSlug === 'index') {
            return `/${data.page.filePathStem.split('/').slice(-2)[0]}/index.html`;
        }
        // Handle regular pages
        return `/${data.page.filePathStem.split('/').slice(-2)[0]}/${data.page.fileSlug}.html`;
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