const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'content', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

const originalHeadings = require('./headings.json');

const directMaps = {
    '快速摘要': '3分鐘速讀：本篇精華重點',
    '結論': '給你的最後建議',
    '參考文獻': '這裡有科學根據：參考文獻',
    '相關文章': '推薦閱讀：你可能也會喜歡',
    '原理': '背後的科學原理大解密',
    '適應症': '這項療法適合哪些人？',
    '禁忌': '注意！這幾種人千萬別碰',
    '安全使用建議': '這樣用才安全！必備防雷指南',
    '自我保健': '不求人！日常自我保健秘訣',
    '主要功效': '吃對才有效！你不可不知的主要功效',
    '使用建議': '專家私藏的正確使用攻略',
    '治療過程': '真實療程揭秘：治療時會發生什麼事？',
    '安全提醒': '安全第一：你必須知道的防雷重點',
    '正確使用流程': '一步一步教你：正確使用流程全圖解'
};

const prefixMaster = {
    what: ['到底', '白話文解釋：', '秒懂！', '一分鐘看懂：', '新手必知：'],
    why: ['揭秘！', '原來是這樣！', '驚人真相：', '背後原因大公開：', '你可能不知道的'],
    who: ['必看指南！', '這樣做就對了：', '千萬別搞錯：', '避坑指南：', '到底適不適合你？'],
    myth: ['破解迷思：', '打破成見！', '原來一直都誤會了：', '事實真相：', '真的假的？'],
    general: ['深度解析：', '全面盤點：', '實用拆解：', '關鍵看點：', '重點解析：', '進階討論：', '專業視角：', '核心觀念：']
};

function shuffle(array) {
    let arr = [...array];
    let currentIndex = arr.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr;
}

let modifiedCount = 0;

for (const file of files) {
    const filepath = path.join(dir, file);
    if (!fs.existsSync(filepath)) continue;

    const originalFileHeadings = originalHeadings[file];
    if (!originalFileHeadings) continue;

    let content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split(/\r?\n/);

    let prefixesUsed = {
        what: shuffle(prefixMaster.what),
        why: shuffle(prefixMaster.why),
        who: shuffle(prefixMaster.who),
        myth: shuffle(prefixMaster.myth),
        general: shuffle(prefixMaster.general)
    };

    function getPrefix(type) {
        if (prefixesUsed[type].length === 0) {
            prefixesUsed[type] = shuffle(prefixMaster[type]);
        }
        return prefixesUsed[type].pop();
    }

    let newLines = [];
    let h1Title = '';
    const titleMatch = content.match(/^title:\s*["']?([^"'\n]+?)["']?$/m);
    if (titleMatch) {
        h1Title = titleMatch[1];
    }

    let fileModified = false;
    let currentOriginalIndex = 1; // 0 is exactly the H1 heading

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (!match) {
            newLines.push(line);
            continue;
        }

        const level = match[1].length;

        if (level === 1) {
            newLines.push(`${match[1]} ${h1Title}`);
            fileModified = true;
            continue;
        }

        let orig = originalFileHeadings[currentOriginalIndex];
        if (!orig) {
            newLines.push(line);
            continue;
        }

        currentOriginalIndex++;

        let origText = orig.text.trim();
        let newText = origText;

        if (origText.includes('常見問題') || origText.includes('FAQ')) {
            newText = '常見問題（FAQ）';
        } else if (directMaps[origText]) {
            newText = directMaps[origText];
        } else if (origText.startsWith('什麼是')) {
            newText = getPrefix('what') + origText.replace(/[？?]?$/, '？');
        } else if (origText.endsWith('是什麼') || origText.endsWith('是什麼？')) {
            newText = getPrefix('what') + origText.replace(/[？?]?$/, '？');
        } else if (origText.startsWith('為什麼')) {
            newText = getPrefix('why') + origText.replace(/[？?]?$/, '？');
        } else if (origText.startsWith('誰不適合') || origText.startsWith('誰需要') || origText.startsWith('誰會')) {
            newText = getPrefix('who') + origText.replace(/[？?]?$/, '？');
        } else {
            let numMatch = origText.match(/^(\d+)[.、]\s*(.+)$/);
            if (numMatch) {
                if (numMatch[2].length < 12 && !/(重點|真相|攻略|風險|原則)/.test(numMatch[2])) {
                    newText = `${numMatch[1]}. 👉 ${numMatch[2]}`;
                }
            } else if (origText.includes('副作用')) {
                newText = `${getPrefix('general')}${origText}`;
            } else if (origText.includes('迷思')) {
                newText = `${getPrefix('myth')}${origText}`;
            } else if (origText.length <= 15) {
                newText = `${getPrefix('general')}${origText}`;
            }
        }

        newLines.push(`${match[1]} ${newText}`);
        fileModified = true;
    }

    if (fileModified) {
        fs.writeFileSync(filepath, newLines.join('\n'), 'utf-8');
        modifiedCount++;
    }
}

console.log(`Successfully fixed undefined and FAQ across ${modifiedCount} files!`);
