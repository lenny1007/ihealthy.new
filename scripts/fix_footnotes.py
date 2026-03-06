#!/usr/bin/env python3
"""
Fix Footnotes Script
─────────────────────────────────────────────────────────────────
This script finds all .mdx files in the src/content/blog directory
and converts Markdown footnote syntax (e.g. `[^1]: ` or `[1]:`) 
into standard numbered lists (`1. `) so they render correctly on the website.
"""

import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
BLOG_DIR = os.path.join(PROJECT_ROOT, "src", "content", "blog")

def fix_footnotes_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Check if there are any footnotes to replace
    # Matches [^1]: or [^1] : or [1]: or [1] :
    pattern = r'^\[\^?(\d+)\]\s*:\s*'
    
    if re.search(pattern, content, flags=re.MULTILINE):
        # Perform the replacement
        # Replace `[^1]: ` with `1. `
        new_content = re.sub(pattern, r'\1. ', content, flags=re.MULTILINE)
        
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        return True
        
    return False

def main():
    if not os.path.exists(BLOG_DIR):
        print(f"❌ Blog directory not found: {BLOG_DIR}")
        return
        
    files = [f for f in os.listdir(BLOG_DIR) if f.endswith(".mdx")]
    print(f"📂 Scanning {len(files)} articles for hidden footnotes...")
    
    fixed_count = 0
    for filename in files:
        filepath = os.path.join(BLOG_DIR, filename)
        if fix_footnotes_in_file(filepath):
            print(f"  🔧 Fixed footnotes in: {filename}")
            fixed_count += 1
            
    print(f"\n✅ Scan complete! Fixed footnotes in {fixed_count} articles.")

if __name__ == "__main__":
    main()
