#!/usr/bin/env python3
"""
Blog Hero Image Auto-Illustration Script (Gemini Flash Image Edition)
───────────────────────────────────────────────────────────────────────

Generates a HIGH-QUALITY REALISTIC PHOTOGRAPHIC "heroImage" for an Astro blog post.
The style is meant to match modern, well-lit, soothing real-world photography (e.g. Unsplash style)
rather than the minimalist vector illustrations used in the body content.

Usage: 
  python scripts/auto_illustrate_hero.py src/content/blog/article_name.mdx
  
Requirements:
  - ANTHROPIC_API_KEY
  - GOOGLE_API_KEY
  - pip install anthropic google-genai Pillow
"""

import os
import sys
import re
import time
import base64
import io

def install_if_missing(package):
    try:
        __import__(package)
    except ImportError:
        os.system(f"pip install {package} --break-system-packages -q")

install_if_missing("anthropic")
install_if_missing("google-genai")
install_if_missing("Pillow")

import anthropic
from google import genai
from PIL import Image

# Models
ANTHROPIC_MODEL = "claude-3-haiku-20240307"
GOOGLE_IMAGEN_MODEL = "gemini-3.1-flash-image-preview"

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
HERO_IMG_DIR = os.path.join(PROJECT_ROOT, "src", "assets", "med_images")
os.makedirs(HERO_IMG_DIR, exist_ok=True)


def generate_hero_prompt(title: str, description: str, api_key: str) -> str:
    """Ask Claude to generate an English prompt for a realistic photographic hero image."""
    print("🤖 Analyzing Article Title & Description to create Hero Image prompt (via Claude)...")
    client = anthropic.Anthropic(api_key=api_key)
    
    prompt = f"""You are an elite art director and photographer. You need to design the MAIN Cover Photo (Hero Image) for a medical & health blog post.
    
    Article Title: {title}
    Article Description: {description}
    
    STYLE & COMPOSITION REQUIREMENTS:
    - Extremely high-quality, realistic lifestyle photography (like a modern Unsplash or Getty Images premium photo).
    - Soothing, clean, well-lit aesthetic (soft natural lighting, perhaps a bright modern home, clinic, or natural environment).
    - Health, wellness, and lifestyle focused. Do not make it look scary or strictly clinical/surgical.
    - NO TEXT or WORDS in the image.
    - The prompt must end specifically with: `, hyper-realistic photography, high resolution 8k, soft natural lighting, elegant composition, cinematic, soothing color palette, 16:9 aspect ratio`
    
    Return ONLY the English image generation prompt text. Do not output anything else. No XML, no quotes, just the prompt string.
    """
    
    try:
        msg = client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )
        return msg.content[0].text.strip()
    except Exception as e:
        print(f"❌ Error communicating with Anthropic: {e}")
        return ""


def generate_google_hero_image(prompt: str, filepath: str, client, max_retries: int = 3) -> bool:
    """Generate image using Gemini."""
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=GOOGLE_IMAGEN_MODEL,
                contents=[prompt],
            )
            for part in response.parts:
                if part.inline_data is not None:
                    raw_data = part.inline_data.data
                    if isinstance(raw_data, str):
                        raw_data = raw_data.encode('utf-8')
                    try:
                        decoded = base64.b64decode(raw_data)
                        img = Image.open(io.BytesIO(decoded))
                    except Exception:
                        img = Image.open(io.BytesIO(raw_data))
                    
                    # Ensure PNG format for hero images as requested
                    img.save(filepath, format="PNG")
                    return True
            print(f"    ⚠️  No image returned in response (Attempt {attempt+1})")
        except Exception as e:
            err = str(e)
            if "429" in err or "RESOURCE_EXHAUSTED" in err:
                wait = 15
                print(f"    ⏳ Rate Limit Reached. Waiting {wait}s... (Attempt {attempt+1})")
                time.sleep(wait)
            elif "403" in err or "API_KEY" in err:
                print("    ❌ Invalid GOOGLE_API_KEY or missing access to Imagen model.")
                return False
            else:
                print(f"    ⚠️  Generation failed: {err[:150]} (Attempt {attempt+1})")
                time.sleep(5)
    return False


def inject_hero_image_to_mdx(filepath: str, new_hero_path: str):
    """Replace the heroImage frontmatter field in the MDX file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace heroImage: "..." with the new path
    new_content = re.sub(
        r'^heroImage:\s*["\'].*?["\']', 
        f'heroImage: "{new_hero_path}"', 
        content, 
        flags=re.MULTILINE
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/auto_illustrate_hero.py <path-to-mdx-file>")
        sys.exit(1)
        
    filepath = sys.argv[1]
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        sys.exit(1)
        
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    google_key = os.environ.get("GOOGLE_API_KEY", "").strip()
    
    if not anthropic_key or not google_key:
        print("❌ Error: Both ANTHROPIC_API_KEY and GOOGLE_API_KEY environment variables must be set.")
        sys.exit(1)

    print(f"📖 Processing Hero Image for: {os.path.basename(filepath)}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract Article Title and Description
    title_match = re.search(r"^title:\s*[\"']?(.*?)[\"']?$", content, re.MULTILINE)
    title = title_match.group(1) if title_match else "Unknown Article"
    
    desc_match = re.search(r"^description:\s*[\"']?(.*?)[\"']?$", content, re.MULTILINE)
    desc = desc_match.group(1) if desc_match else ""
    
    # Generate filename based on slug
    slug = os.path.basename(filepath).replace(".mdx", "").replace(".md", "")
    filename = f"{slug}-hero.png"
    save_path = os.path.join(HERO_IMG_DIR, filename)
    mdx_inject_path = f"../../assets/med_images/{filename}"
    
    hero_prompt = generate_hero_prompt(title, desc, anthropic_key)
    
    if not hero_prompt:
        print("❌ Failed to parse prompt from Claude.")
        sys.exit(1)
        
    print(f"🎯 Generated Prompt: {hero_prompt}")
    print(f"\n🎨 Firing up Gemini Imagen 3.1 Flash. Generating realistic hero image...")
    
    client = genai.Client(api_key=google_key)
    ok = generate_google_hero_image(hero_prompt, save_path, client)
    
    if ok:
        print(f"      ✅ Saved: {filename}")
        print(f"💾 Updating heroImage frontmatter in MDX file...")
        inject_hero_image_to_mdx(filepath, mdx_inject_path)
        print("✅ Process Complete!")
    else:
        print("❌ Failed to generate Hero Image.")

if __name__ == "__main__":
    main()
