import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, 'content_ihealthy');
const OUTPUT_DIR = path.join(__dirname, 'src', 'content', 'blog');
const OPTIMIZED_IMG_DIR = path.join(__dirname, 'optimized_image');
const PUBLIC_IMG_DIR = path.join(__dirname, 'public', 'images');

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const turndownService = new TurndownService();

// Copy all images to public
function copyImages() {
    if (!fs.existsSync(PUBLIC_IMG_DIR)) {
        fs.mkdirSync(PUBLIC_IMG_DIR, { recursive: true });
    }
    const files = fs.readdirSync(OPTIMIZED_IMG_DIR);
    let count = 0;
    for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
            fs.copyFileSync(
                path.join(OPTIMIZED_IMG_DIR, file),
                path.join(PUBLIC_IMG_DIR, file)
            );
            count++;
        }
    }
    console.log(`Copied ${count} images to ${PUBLIC_IMG_DIR}`);
}

async function optimizeContent(content, title) {
    const prompt = `
You are an expert medical and health editor. Rewrite the following markdown article to fit a modern, premium "knowledge base" tone.
Make it sound professional, engaging, and easy to read.
Also, perform the following structural optimizations:
1. Replace standard notice/alert boxes or generic tips with specific emojis at the start of paragraphs if appropriate (💡 for tips, 💰 for saving money, ⚠️ for warnings, 🛑 for medical alerts, 🔬 for clinical data).
2. Ensure markdown formatting is pristine.
3. Keep the original image links unmodified, just output them as they are in markdown form.
4. Do NOT output a markdown code block containing the article. Just output the raw markdown text.

Article Title: ${title}

Original Content:
${content}
`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                temperature: 0.3
            }
        });
        return response.text;
    } catch (e) {
        console.error("Failed to optimize AI content:", e);
        return content; // Fallback to original
    }
}

function processContent(rawText) {
    // Convert basic HTML to JSX/MDX friendly structure based on walkthrough
    let content = rawText;

    // 1. Blue Info (Alert Success/Info -> 💡)
    content = content.replace(/<div[^>]*class="[^"]*alert-[success|info][^"]*"[^>]*>([\s\S]*?)<\/div>/g,
        "<div style={{ background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '1.5rem', borderRadius: '0 8px 8px 0', margin: '2rem 0', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>\n  <div style={{ fontSize: '1.5rem', lineHeight: '1' }}>💡</div>\n  <div style={{ color: '#1e3a8a', fontSize: '1.05rem', lineHeight: '1.6', fontWeight: '500' }}>\n    $1\n  </div>\n</div>"
    );

    // 2. Yellow Warning (Alert Warning -> ⚠️)
    content = content.replace(/<div[^>]*class="[^"]*alert-warning[^"]*"[^>]*>([\s\S]*?)<\/div>/g,
        "<div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '1.5rem', borderRadius: '12px', margin: '2rem 0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>\n  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>\n    <span style={{ fontSize: '1.5rem' }}>⚠️</span>\n    <h4 style={{ margin: 0, color: '#854d0e', fontSize: '1.1rem', fontWeight: '700' }}>注意</h4>\n  </div>\n  <p style={{ margin: 0, color: '#713f12', lineHeight: '1.6' }}>\n    $1\n  </p>\n</div>"
    );

    // 3. Red Warning (Alert Danger -> 🛑)
    content = content.replace(/<div[^>]*class="[^"]*alert-danger[^"]*"[^>]*>([\s\S]*?)<\/div>/g,
        "<div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '1.5rem', borderRadius: '0 8px 8px 0', margin: '3rem 0', display: 'flex', gap: '1rem', alignItems: 'flex-start', boxShadow: '0 4px 6px -1px rgba(239,68,68,0.05)' }}>\n  <div style={{ fontSize: '1.5rem', lineHeight: '1' }}>🛑</div>\n  <div style={{ color: '#7f1d1d' }}>\n    <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.5rem', color: '#991b1b' }}>關鍵提醒</strong>\n    $1\n  </div>\n</div>"
    );

    // General image path replacement from ../optimized_image/ or similar relative paths
    content = content.replace(/!\[(.*?)\]\(.*?(optimized_image[^)]+)\)/g, (match, alt, p2) => {
        // Extract filename
        const filename = path.basename(p2);
        return `![${alt}](/images/${filename})`;
    });

    // Replace direct img tags as well
    content = content.replace(/<img[^>]+src="([^"]+)"[^>]*>/g, (match, src) => {
        const filename = path.basename(src);
        return `<img src="/images/${filename}" />`;
    });

    return content;
}

async function migrate() {
    console.log("Starting Migration...");
    copyImages();

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const categories = fs.readdirSync(CONTENT_DIR).filter(f => fs.statSync(path.join(CONTENT_DIR, f)).isDirectory());
    console.log(`Found ${categories.length} categories`);

    for (const category of categories) {
        const catPath = path.join(CONTENT_DIR, category);
        const files = fs.readdirSync(catPath).filter(f => f.endsWith('.md'));

        for (const file of files) {
            const filePath = path.join(catPath, file);
            const rawContent = fs.readFileSync(filePath, 'utf-8');

            // Simple frontmatter parser
            const fmMatch = rawContent.match(/^---\n([\s\S]*?)\n---/);
            let frontmatterStr = '';
            let body = rawContent;
            let title = file.replace('.md', '');

            if (fmMatch) {
                frontmatterStr = fmMatch[1];
                body = rawContent.slice(fmMatch[0].length).trim();
                // Try to extract title from frontmatter
                const titleMatch = frontmatterStr.match(/title:\s*["']?([^"'\n]+)/);
                if (titleMatch) title = titleMatch[1];
            }

            console.log(`Processing: ${category}/${file} -> ${title}`);

            // Replace HTML alerts and image paths
            let updatedBody = processContent(body);

            // Optionally optimize with AI
            if (process.env.GEMINI_API_KEY) {
                console.log(`Optimizing content via AI...`);
                updatedBody = await optimizeContent(updatedBody, title);
            } else {
                console.log('Skipping AI optimization (No API key found)');
            }

            const newFm = `---
title: "${title}"
description: "探索${title}的相關知識與實證醫療數據"
pubDate: new Date()
category: "${category.replace(/^\d+\./, '')}"
heroImage: "/images/med_files_${Math.floor(Math.random() * 100)}.webp"
---
`;
            const finalContent = newFm + '\n\n' + updatedBody;

            // Flattened output
            const slug = file.replace('.md', '');
            const outPath = path.join(OUTPUT_DIR, `${slug}.mdx`);

            fs.writeFileSync(outPath, finalContent);
            console.log(`Saved structured MDX to ${outPath}`);
        }
    }
    console.log("Migration Complete!");
}

migrate().catch(console.error);
