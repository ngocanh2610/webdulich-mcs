import os
import re

src_dir = os.path.join(os.path.dirname(__file__), 'src')

replacements = [
    (re.compile(r"background:\s*['\"]rgba\(0,\s*0,\s*0,\s*0\.\d+['\"]"), "background: 'var(--bg-card)'"),
    (re.compile(r"background:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.\d+['\"]"), "background: 'var(--bg-card)'"),
    (re.compile(r"background:\s*['\"]rgba\(10,\s*10,\s*15,\s*0\.\d+['\"]"), "background: 'var(--bg-card)'"),
    (re.compile(r"backgroundColor:\s*['\"]rgba\(0,\s*0,\s*0,\s*0\.\d+['\"]"), "backgroundColor: 'var(--bg-card)'"),
    (re.compile(r"backgroundColor:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.\d+['\"]"), "backgroundColor: 'var(--bg-card)'"),
    (re.compile(r"border:\s*['\"]1px solid rgba\(255,255,255,0\.\d+['\"]"), "border: '1px solid var(--border-light)'"),
    (re.compile(r"color:\s*['\"]white['\"]", re.IGNORECASE), "color: 'var(--text-primary)'"),
    (re.compile(r"color:\s*['\"]#fff['\"]", re.IGNORECASE), "color: 'var(--text-primary)'"),
    (re.compile(r"color:\s*['\"]#ffffff['\"]", re.IGNORECASE), "color: 'var(--text-primary)'"),
    (re.compile(r"boxShadow:\s*['\"]0 2px 10px rgba\(0,0,0,0\.\d+['\"]"), "boxShadow: 'var(--glass-shadow)'"),
]

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            original = content
            
            for regex, rep in replacements:
                content = regex.sub(rep, content)
                
            content = re.sub(r"background:\s*'var\(--accent-primary\)',\s*color:\s*'var\(--text-primary\)'", "background: 'var(--accent-primary)', color: 'white'", content)
            content = re.sub(r"background:\s*'var\(--accent-secondary\)',\s*color:\s*'var\(--text-primary\)'", "background: 'var(--accent-secondary)', color: 'white'", content)
            
            if content != original:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)

print("Refactoring complete.")
