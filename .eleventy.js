module.exports = function(eleventyConfig) {
    // Collections
    eleventyConfig.addCollection("uxWork", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/content/ux-work/**/*.md");
    });

    // Pass through copy for static assets
    eleventyConfig.addPassthroughCopy("src/public/");

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "templates",
            layouts: "templates",
            data: "_data"
        },
        templateFormats: ["md", "njk", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk"
    };
}; 