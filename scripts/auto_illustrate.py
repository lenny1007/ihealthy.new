#!/usr/bin/env python3
"""
Blog Auto-Illustration Script (Gemini Flash Image Edition)
────────────────────────────────────────────────────────────

This script automatically reads a specified MDX file in the Astro blog,
uses Anthropic Claude to determine an appropriate image prompt for each `##` heading,
generates a 16:9 minimalist image via Google Gemini Image API,
saves the output to `public/images/blog/`, and safely injects the Markdown image tags into the MDX file.

Usage: 
  python scripts/auto_illustrate.py src/content/blog/article_name.mdx
  
Requirements:
  - ANTHROPIC_API_KEY
  - GOOGLE_API_KEY
  - pip install anthropic google-genai Pillow
"""

import os
import sys
import json
import re
import random
import string
import time
import threading

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

# Models
ANTHROPIC_MODEL = "claude-3-haiku-20240307"
GOOGLE_IMAGEN_MODEL = "gemini-3.1-flash-image-preview"

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
PUBLIC_IMG_DIR = os.path.join(PROJECT_ROOT, "public", "images", "blog")
os.makedirs(PUBLIC_IMG_DIR, exist_ok=True)


def extract_headings(content: str) -> list:
    """Extract `##` (H2) headings from MDX file."""
    headings = []
    lines = content.split('\n')
    for line in lines:
        match = re.match(r"^##\s+(.+)$", line)
        if match:
            heading = match.group(1).strip()
            # Ignore SEO/Default tags
            if '常見問題' not in heading and '參考文獻' not in heading and '相關文章' not in heading and '給你的最後建議' not in heading and '精華重點' not in heading:
                headings.append(heading)
    return headings


def generate_image_prompts(title: str, headings: list, api_key: str) -> dict:
    """Ask Claude to generate English prompts for each heading."""
    print("🤖 Analyzing headings to create image prompts (via Claude)...")
    client = anthropic.Anthropic(api_key=api_key)
    
    headings_text = "\n".join(f"- {h}" for h in headings)
    prompt = f"""You are an elite art director. You are designing illustrations for a medical & health blog post.
    
    Article Title: {title}
    
    I need you to generate a High-Quality Image Generation Prompt (in English) for each of these article sections.
    
    Subheadings:
    {headings_text}
    
    AUDIENCE & TONE:
    - Target audience: Middle-aged adults (40-65 years old) in TAIWAN.
    - Tone: Professional, highly direct, uncluttered, and getting straight to the core concept.
    
    STYLE & COMPOSITION REQUIREMENTS:
    - Minimalist, flat vector illustration.
    - DO NOT clutter the image with too many concepts. Focus exclusively on ONE clear, simple visual metaphor per image.
    - Health and wellness focused, warm and inviting pastel colors.
    - Critical Typography Rule: The image MUST feature simple, extremely clear **TRADITIONAL CHINESE** (繁體中文, zh-TW) typography to convey the core topic. DO NOT USE SIMPLIFIED CHINESE under any circumstances.
    - Please invent 1 to 4 highly impactful Traditional Chinese characters that summarize the section. Provide the exact text to render in quotes within your prompt (using single quotes, e.g., '防護'). Keep the text minimal.
    - Each prompt must end specifically with: `, minimalist flat vector illustration, colorful health theme, extremely high quality, features clear TRADITIONAL CHINESE text typography, 16:9 aspect ratio`
    
    CRITICAL JSON FORMATTING: Do NOT use any double quotes (\") inside the value strings. If you need to quote something, use single quotes ('). Using double quotes inside the string will break the JSON parser.
    
    Return a strictly valid JSON object inside a ```json block where the keys are the EXACT subheadings provided above, and the value is the English image prompt. Do not output anything else.
    """
    
    try:
        msg = client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=1500,
            messages=[
                {"role": "user", "content": prompt},
                {"role": "assistant", "content": "```json\n{"}
            ]
        )
        # Reconstruct the forced starting bracket
        text = "{" + msg.content[0].text
        
        # Strip trailing backticks if Claude included them
        if text.endswith("```"):
            text = text[:-3].strip()
            
        return json.loads(text)
    except Exception as e:
        print(f"❌ Error communicating with Anthropic: {e}")
        # Print the problematic string for easier debugging
        if 'text' in locals():
            print(f"Raw output was:\n{text}")
        return {}


def generate_google_image(prompt: str, filepath: str, client, max_retries: int = 3) -> bool:
    """Generate image using Gemini."""
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=GOOGLE_IMAGEN_MODEL,
                contents=[prompt],
            )
            for part in response.parts:
                if part.inline_data is not None:
                    import base64
                    import io
                    from PIL import Image
                    raw_data = part.inline_data.data
                    if isinstance(raw_data, str):
                        raw_data = raw_data.encode('utf-8')
                    try:
                        decoded = base64.b64decode(raw_data)
                        img = Image.open(io.BytesIO(decoded))
                    except Exception:
                        # Fallback if not base64 encoded
                        img = Image.open(io.BytesIO(raw_data))
                    img.save(filepath, format="WEBP")
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

def generate_random_id(length=6):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))


def process_images_parallel(heading_prompts: dict, google_api_key: str, article_prefix: str) -> dict:
    client = genai.Client(api_key=google_api_key)
    result_map = {}
    threads = []
    lock = threading.Lock()

    def _dl(heading, prompt):
        print(f"  🖼  Generating image for: [{heading}]...")
        filename = f"{article_prefix}_{generate_random_id()}.webp"
        filepath = os.path.join(PUBLIC_IMG_DIR, filename)
        
        ok = generate_google_image(prompt, filepath, client)
        if ok:
            print(f"      ✅ Saved: {filename}")
            # The markdown public path
            md_path = f"/images/blog/{filename}"
            with lock:
                result_map[heading] = md_path

    for heading, prompt in heading_prompts.items():
        t = threading.Thread(target=_dl, args=(heading, prompt))
        threads.append(t)
        
    for t in threads:
        t.start()
    for t in threads:
        t.join()
        
    return result_map


def inject_images_to_mdx(filepath: str, section_map: dict):
    """Insert markdown image syntax below each matching H2 header, wiping old ones to prevent duplicates."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # First, strip out all existing standalone ![heading name](/images/blog/...) images 
    # that immediately follow a ## heading so we don't stack duplicates.
    # We do this broadly by removing any image tag that points to our blog image directory.
    content = re.sub(r'\n+!\[.*?\]\(/images/blog/.*?\)', '', content)
    
    lines = content.split('\n')
    new_lines = []
    
    for line in lines:
        new_lines.append(line)
        match = re.match(r"^##\s+(.+)$", line)
        if match:
            heading = match.group(1).strip()
            if heading in section_map:
                img_path = section_map[heading]
                new_lines.append(f"\n![{heading}]({img_path})\n")
                
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/auto_illustrate.py <path-to-mdx-file>")
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

    print(f"📖 Processing: {os.path.basename(filepath)}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract Article Title
    title_match = re.search(r"^title:\s*[\"']?(.*?)[\"']?$", content, re.MULTILINE)
    title = title_match.group(1) if title_match else "Unknown Article"
    
    # Prefix for saving 
    prefix = os.path.basename(filepath).split('.')[0][:15]
    
    headings = extract_headings(content)
    if not headings:
        print("ℹ️ No relevant H2 headings found to illustrate. Exiting.")
        sys.exit(0)
        
    print(f"🎯 Found {len(headings)} viable headings. Generating prompts...")
    heading_prompts = generate_image_prompts(title, headings, anthropic_key)
    
    if not heading_prompts:
        print("❌ Failed to parse prompts from Claude.")
        sys.exit(1)
        
    print(f"\n🎨 Firing up Gemini Imagen 3.1 Flash. Generating {len(heading_prompts)} images parallelly...")
    section_map = process_images_parallel(heading_prompts, google_key, prefix)
    
    print(f"\n💾 Injecting {len(section_map)} images into MDX file...")
    inject_images_to_mdx(filepath, section_map)
    print("✅ Process Complete!")

if __name__ == "__main__":
    main()
