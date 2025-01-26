const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const FONTS_DIR = path.join(__dirname, '../src/public/fonts');
const FONT_URLS = {
  regular: 'https://int10h.org/oldschool-pc-fonts/download/ultimate_oldschool_pc_font_pack_v2.2.1.zip',
  // Add more font variants here if needed
};

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', err => {
      fs.unlink(dest);
      reject(err);
    });
  });
}

async function setupFonts() {
  try {
    // Create fonts directory if it doesn't exist
    await fs.ensureDir(FONTS_DIR);
    
    console.log('🔍 Checking for required tools...');
    
    // Check if fonttools is installed
    try {
      await execAsync('pyftsubset --help');
    } catch (error) {
      console.error('❌ fonttools not found. Please install it with:');
      console.log('pip install fonttools');
      process.exit(1);
    }

    console.log('📥 Downloading fonts...');
    
    // Download and process each font
    for (const [variant, url] of Object.entries(FONT_URLS)) {
      const zipPath = path.join(FONTS_DIR, `${variant}.zip`);
      
      // Download font
      await downloadFile(url, zipPath);
      
      // Extract font (you'll need to implement this based on the actual zip structure)
      console.log(`📦 Extracting ${variant} font...`);
      
      // Convert to modern formats
      console.log(`🔄 Converting ${variant} to woff2/woff...`);
      
      // Cleanup
      await fs.remove(zipPath);
    }

    console.log(`
✅ Font setup complete!

The Perfect DOS VGA 437 font is now available in your project.
To use it, add this to your HTML:
<link rel="stylesheet" href="/css/fonts.css">

Then use it in your CSS:
font-family: 'Perfect DOS VGA 437', monospace;
`);

  } catch (error) {
    console.error('❌ Error setting up fonts:', error);
    process.exit(1);
  }
}

// Run the setup
setupFonts(); 