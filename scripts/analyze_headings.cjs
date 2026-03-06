const headings = require('./headings.json');
const fs = require('fs');
const path = require('path');

const freq = {};
for (const file in headings) {
    for (const h of headings[file]) {
        const text = h.text.trim();
        if (h.level >= 2) {
            freq[text] = (freq[text] || 0) + 1;
        }
    }
}

const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
fs.writeFileSync(path.join(__dirname, 'heading_freq.json'), JSON.stringify(sorted, null, 2));
console.log(`Saved frequencies for ${sorted.length} unique subheadings.`);
