import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
BLOG_DIR = os.path.join(PROJECT_ROOT, "src", "content", "blog")

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update heroImage frontmatter: `heroImage: "/med_images/xxx"` -> `heroImage: "../../assets/med_images/xxx"`
    # Or if they are in `/images/...` -> `../../assets/images/...`
    new_content = re.sub(
        r'^heroImage:\s*["\']/med_images/(.*?)["\']',
        r'heroImage: "../../assets/med_images/\1"',
        content,
        flags=re.MULTILINE
    )
    
    new_content = re.sub(
        r'^heroImage:\s*["\']/images/(.*?)["\']',
        r'heroImage: "../../assets/images/\1"',
        new_content,
        flags=re.MULTILINE
    )

    # 2. Update markdown body images: `](/images/blog/xxx)` -> `](../../assets/images/blog/xxx)`
    new_content = re.sub(
        r'\]\(/images/([^)]+)\)',
        r'](../../assets/images/\1)',
        new_content
    )
    
    # Update markdown body images: `](/med_images/xxx)` -> `](../../assets/med_images/xxx)`
    new_content = re.sub(
        r'\]\(/med_images/([^)]+)\)',
        r'](../../assets/med_images/\1)',
        new_content
    )

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    files = [f for f in os.listdir(BLOG_DIR) if f.endswith(".mdx")]
    count = 0
    for file in files:
        if process_file(os.path.join(BLOG_DIR, file)):
            count += 1
            print(f"✅ Updated paths in {file}")
            
    print(f"Complete! Updated {count} files.")

if __name__ == "__main__":
    main()
