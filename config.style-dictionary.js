module.exports = {
  source: ["src/design-system/tokens/**/*.json"],
  parsers: [{
    pattern: /\.json$/,
    parse: ({ contents }) => {
      const tokens = JSON.parse(contents);
      // Extract tokens from W3C DTCG format
      const extractTokens = (obj, prefix = '') => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
          if (value.value !== undefined) {
            return {
              ...acc,
              [`${prefix}${key}`]: {
                value: value.value,
                type: value.type
              }
            };
          }
          return {
            ...acc,
            ...extractTokens(value, `${prefix}${key}.`)
          };
        }, {});
      };
      
      return {
        ...extractTokens(tokens.global),
        ...extractTokens(tokens.component)
      };
    }
  }],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "src/public/css/",
      files: [{
        destination: "variables.css",
        format: "css/variables",
        options: {
          showFileHeader: false
        }
      }]
    },
    scss: {
      transformGroup: "scss",
      buildPath: "src/public/scss/",
      files: [{
        destination: "_variables.scss",
        format: "scss/variables"
      }]
    },
    js: {
      transformGroup: "js",
      buildPath: "src/public/js/",
      files: [{
        destination: "tokens.js",
        format: "javascript/es6"
      }]
    }
  },
  transform: {
    "size/px": {
      type: "value",
      matcher: function(prop) {
        return prop.type === "dimension" || 
               prop.type === "spacing";
      },
      transformer: function(prop) {
        return prop.value;
      }
    }
  }
}; 