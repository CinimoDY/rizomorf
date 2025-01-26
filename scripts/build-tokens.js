const StyleDictionary = require('style-dictionary');
const { transformTokens } = require('@tokens-studio/sd-transforms');

// Configure Style Dictionary with Tokens Studio transforms
StyleDictionary.registerTransform({
  name: 'size/px',
  type: 'value',
  matcher: function(prop) {
    return prop.type === 'dimension' || 
           prop.type === 'spacing' ||
           prop.type === 'borderRadius' ||
           prop.type === 'borderWidth';
  },
  transformer: function(prop) {
    return `${prop.value}px`;
  }
});

// Load and transform tokens
async function buildTokens() {
  try {
    // Transform tokens using Tokens Studio transforms
    const transformed = await transformTokens({
      tokens: require('../src/design-system/figma/tokens.json'),
      sets: ['global', 'component'],
      expandComposites: true,
      expandTypography: true,
      preserveRawValue: false,
    });

    // Configure Style Dictionary
    const StyleDictionaryExtended = StyleDictionary.extend({
      tokens: transformed,
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath: 'src/public/css/',
          files: [{
            destination: 'tokens.css',
            format: 'css/variables',
            options: {
              selector: ':root',
              outputReferences: true
            }
          }]
        },
        scss: {
          transformGroup: 'scss',
          buildPath: 'src/public/scss/',
          files: [{
            destination: '_tokens.scss',
            format: 'scss/variables'
          }]
        },
        js: {
          transformGroup: 'js',
          buildPath: 'src/public/js/',
          files: [{
            destination: 'tokens.js',
            format: 'javascript/es6'
          }]
        }
      }
    });

    // Build all platforms
    StyleDictionaryExtended.buildAllPlatforms();
    console.log('\n✅ Tokens built successfully');
  } catch (error) {
    console.error('\n❌ Error building tokens:', error);
    process.exit(1);
  }
}

buildTokens(); 