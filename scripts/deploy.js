const { execSync } = require('child_process');
const path = require('path');

// Helper to run commands
function run(command) {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
}

async function deploy() {
    try {
        // Ensure we're on main branch
        run('git checkout main');
        
        // Build the site
        console.log('\nBuilding site...');
        run('cross-env NODE_ENV=production npm run build');
        
        // Save the current git hash
        const currentHash = execSync('git rev-parse HEAD').toString().trim();
        
        // Switch to gh-pages branch (create if it doesn't exist)
        try {
            run('git checkout gh-pages');
        } catch (e) {
            run('git checkout -b gh-pages');
        }
        
        // Clean the working directory (except .git and dist)
        run('git rm -rf .');
        
        // Copy the built files
        run('cp -r dist/* .');
        
        // Add and commit
        run('git add .');
        run(`git commit -m "Deploy: ${currentHash}"`);
        
        // Push to gh-pages
        run('git push -f origin gh-pages');
        
        // Switch back to main
        run('git checkout main');
        
        console.log('\nDeployment successful!');
        
    } catch (error) {
        console.error('\nDeployment failed:', error);
        // Always try to get back to main branch
        try {
            run('git checkout main');
        } catch (e) {
            console.error('Failed to switch back to main branch:', e);
        }
    }
}

deploy().catch(console.error); 