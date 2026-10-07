const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  // Backgrounds:
  { regex: /background:\s*['"]rgba\(0,\s*0,\s*0,\s*0\.\d+['"]/g, replace: "background: 'var(--bg-card)'" },
  { regex: /background:\s*['"]rgba\(255,\s*255,\s*255,\s*0\.\d+['"]/g, replace: "background: 'var(--bg-card)'" },
  { regex: /background:\s*['"]rgba\(10,\s*10,\s*15,\s*0\.\d+['"]/g, replace: "background: 'var(--bg-card)'" },
  { regex: /backgroundColor:\s*['"]rgba\(0,\s*0,\s*0,\s*0\.\d+['"]/g, replace: "backgroundColor: 'var(--bg-card)'" },
  { regex: /backgroundColor:\s*['"]rgba\(255,\s*255,\s*255,\s*0\.\d+['"]/g, replace: "backgroundColor: 'var(--bg-card)'" },
  
  // Borders:
  { regex: /border:\s*['"]1px solid rgba\(255,255,255,0\.\d+['"]/g, replace: "border: '1px solid var(--border-light)'" },
  
  // Colors (Text):
  { regex: /color:\s*['"]white['"]/gi, replace: "color: 'var(--text-primary)'" },
  { regex: /color:\s*['"]#fff['"]/gi, replace: "color: 'var(--text-primary)'" },
  { regex: /color:\s*['"]#ffffff['"]/gi, replace: "color: 'var(--text-primary)'" },
  
  // Box shadows
  { regex: /boxShadow:\s*['"]0 2px 10px rgba\(0,0,0,0\.\d+['"]/g, replace: "boxShadow: 'var(--glass-shadow)'" },
];

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    replacements.forEach(r => {
      content = content.replace(r.regex, r.replace);
    });
    
    // Fix buttons
    content = content.replace(/background:\s*'var\(--accent-primary\)',\s*color:\s*'var\(--text-primary\)'/g, "background: 'var(--accent-primary)', color: 'white'");
    content = content.replace(/background:\s*'var\(--accent-secondary\)',\s*color:\s*'var\(--text-primary\)'/g, "background: 'var(--accent-secondary)', color: 'white'");
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});

console.log("Refactoring complete.");
