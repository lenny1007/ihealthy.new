#!/usr/bin/env python3
"""
Batch Blog Illustration Script
─────────────────────────────────────────────────────────────────
This script finds all .mdx files in the src/content/blog directory
and runs both the Hero Image and Body Image illustration scripts on them.

Usage: 
  python scripts/batch_illustrate.py [limit]
  
Example:
  python scripts/batch_illustrate.py 5    # Process only 5 articles
  python scripts/batch_illustrate.py      # Process all articles
"""

import os
import sys
import subprocess
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
BLOG_DIR = os.path.join(PROJECT_ROOT, "src", "content", "blog")

HERO_SCRIPT = os.path.join(SCRIPT_DIR, "auto_illustrate_hero.py")
BODY_SCRIPT = os.path.join(SCRIPT_DIR, "auto_illustrate.py")

def get_mdx_files():
    files = []
    for f in os.listdir(BLOG_DIR):
        if f.endswith(".mdx") and not f.endswith("index.mdx"):
            filepath = os.path.join(BLOG_DIR, f)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
                # Skip articles that already have generated blog images
                if "](/images/blog/" not in content:
                    files.append(filepath)
    return files

def main():
    if not os.path.exists(BLOG_DIR):
        print(f"❌ Blog directory not found: {BLOG_DIR}")
        sys.exit(1)
        
    limit = None
    if len(sys.argv) > 1:
        try:
            limit = int(sys.argv[1])
        except ValueError:
            print("❌ Invalid limit. Please provide a number.")
            sys.exit(1)
            
    files = get_mdx_files()
    if not files:
        print("🎉 Awesome! All articles have already been illustrated.")
        sys.exit(0)
        
    print(f"📂 Found {len(files)} un-illustrated articles.")
    
    if limit:
        files = files[:limit]
        print(f"🛑 Limiting execution to {limit} articles.")
        
    for i, filepath in enumerate(files, 1):
        filename = os.path.basename(filepath)
        print("\n" + "="*60)
        print(f"🚀 Processing [{i}/{len(files)}]: {filename}")
        print("="*60)
        
        # 1. Generate Hero Image
        print(f"\n📸 Step 1: Generating Hero Image for {filename}...")
        subprocess.run(["python", HERO_SCRIPT, filepath])
        
        # 2. Generate Body Images
        print(f"\n🖼️  Step 2: Generating Body Images for {filename}...")
        subprocess.run(["python", BODY_SCRIPT, filepath])
        
        if i < len(files):
            print("\n⏳ Resting for 10 seconds to respect API rate limits...")
            time.sleep(10)
            
    print("\n✅ Batch Processing Complete!")

if __name__ == "__main__":
    main()
