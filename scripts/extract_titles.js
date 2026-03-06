const fs = require('fs');
const path = require('path');
const dir = process.argv[2];

const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
const result = [];
for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    const match = content.match(/^title:\s*["']?(.*?)["']?$/m);
    if (match) {
        result.push({ file, title: match[1] });
    }
}

console.log(JSON.stringify(result, null, 2));
