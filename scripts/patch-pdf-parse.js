const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'node_modules', 'pdf-parse', 'index.js');

if (fs.existsSync(targetPath)) {
    console.log('Applying surgical patch to pdf-parse/index.js...');
    let content = fs.readFileSync(targetPath, 'utf8');
    const buggyLine = 'let isDebugMode = !module.parent;';
    const fixedLine = 'let isDebugMode = false;';
    
    if (content.includes(buggyLine)) {
        content = content.replace(buggyLine, fixedLine);
        fs.writeFileSync(targetPath, content);
        console.log('✅ pdf-parse debug mode disabled successfully.');
    } else if (content.includes(fixedLine)) {
        console.log('ℹ️ pdf-parse already patched.');
    } else {
        console.warn('⚠️ Could not find the debug mode line in pdf-parse/index.js. It might have changed.');
    }
} else {
    console.warn('⚠️ node_modules/pdf-parse/index.js not found. Skipping patch.');
}
