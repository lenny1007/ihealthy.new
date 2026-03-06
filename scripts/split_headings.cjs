const headingsFull = require('./headings.json');
const fs = require('fs');
const path = require('path');

// Extract unique headings that are not the H1 (since H1 will be replaced by the frontmatter title)
// Also exclude the extremely common ones that we can just hardcode
const common = new Set(["常見問題（FAQ）", "相關文章", "結論", "參考文獻"]);

const uniqueHeadings = new Set();
for (const file in headingsFull) {
    for (const h of headingsFull[file]) {
        if (h.level >= 2 && !common.has(h.text.trim())) {
            uniqueHeadings.add(h.text.trim());
        }
    }
}

const lines = Array.from(uniqueHeadings);
console.log(`Total unique subheadings to process: ${lines.length}`);

const chunkSize = Math.ceil(lines.length / 4);
for (let i = 0; i < 4; i++) {
    const chunk = lines.slice(i * chunkSize, (i + 1) * chunkSize);
    fs.writeFileSync(path.join(__dirname, `headings_chunk_${i + 1}.json`), JSON.stringify(chunk, null, 2));
}

console.log('Chunks written.');
