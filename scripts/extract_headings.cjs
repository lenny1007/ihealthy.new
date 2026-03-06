const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'content', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

const headings = {};

for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    const lines = content.split('\n');
    const fileHeadings = [];
    for (const line of lines) {
        const match = line.match(/^(#{1,3})\s+(.+)$/);
        if (match) {
            fileHeadings.push({
                level: match[1].length,
                text: match[2].trim()
            });
        }
    }
    if (fileHeadings.length > 0) {
        headings[file] = fileHeadings;
    }
}

fs.writeFileSync(path.join(__dirname, 'headings.json'), JSON.stringify(headings, null, 2));
console.log(`Extracted headings for ${Object.keys(headings).length} files.`);
