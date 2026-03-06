const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'content', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

// Get original headings back by looking at headings.json so we can re-apply changes
const originalHeadings = require('./headings.json');

const directMaps = {
    '快速摘要': '3分鐘速讀：本篇精華重點',
    '結論': '給你的最後建議',
    '參考文獻': '這裡有科學根據：參考文獻',
    '相關文章': '推薦閱讀：你可能也會喜歡',
    '常見問題': '網友最常問的 5 個問題',
    '常見問題（FAQ）': '網友最常問的 5 個問題',
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

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

for (const file of files) {
    const filepath = path.join(dir, file);
    if (!fs.existsSync(filepath)) continue;

    const originalFileHeadings = originalHeadings[file];
    if (!originalFileHeadings) continue;

    let content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split(/\r?\n/);

    // We need state per file to rotate through prefixes, ensuring no repetition
    let prefixesUsed = {
        what: shuffle(['到底', '白話文解釋：', '秒懂！', '一分鐘看懂：', '新手必知：']),
        why: shuffle(['揭秘！', '原來是這樣！', '驚人真相：', '背後原因大公開：', '你可能不知道的']),
        who: shuffle(['必看指南！', '這樣做就對了：', '千萬別搞錯：', '避坑指南：', '到底適不適合你？']),
        myth: shuffle(['破解迷思：', '打破成見！', '原來一直都誤會了：', '事實真相：', '真的假的？']),
        general: shuffle(['深度解析：', '全面盤點：', '實用拆解：', '關鍵看點：', '重點解析：', '進階討論：', '專業視角：', '核心觀念：'])
    };

    function getPrefix(type) {
        let list = prefixesUsed[type];
        if (list.length === 0) list = shuffle([...prefixesUsed[type]]); // Replenish if empty
        return list.pop();
    }

    // Create a mapping from current line header matching to new text
    // However, because we already ran `update_headings.js`, the files NOW contain the prefixed headings!
    // We need to revert them or apply regex to replace the CURRENT text.
    // Actually, we can just look at the line, strip out any prefix from our old script, and then apply a new one.
    const oldPrefixesToRemove = ['到底', '？一次搞懂核心觀念', '？白話文解釋給你聽', '揭秘！', '？背後的真實原因', '必看指南！', '？千萬別搞錯', '破解迷思：', '的真相到底是什麼？', '新手必看：', '懶人包', '超實用！', '，教你對症下藥', '原來這才是背後的', '！', '別等發生才後悔！', '實用絕招', '吃對才健康：', '這樣挑', '深度解析：', '大解密', '關鍵重點：'];

    function stripOldPrefixes(txt) {
        let clean = txt;
        for (const p of oldPrefixesToRemove) {
            clean = clean.replace(p, '');
        }
        // Also strip "1. 關鍵重點：" or things like that
        clean = clean.replace(/^\d+[.、]\s*關鍵重點：/, '');
        return clean;
    }

    // To be perfectly safe, since we know what the ORIGINAL headings were, let's just 
    // find the corresponding H2/H3 by matching content.
    // A simpler way: just iterate over `originalFileHeadings`, and replace the *current* 
    // heading in the file with a newly freshly styled one based on the original string.

    let newLines = [];
    let h1Title = '';
    const titleMatch = content.match(/^title:\s*["']?([^"'\n]+?)["']?$/m);
    if (titleMatch) {
        h1Title = titleMatch[1];
    }

    let fileModified = false;
    let currentOriginalIndex = 1; // 0 is H1

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (!match) {
            newLines.push(line);
            continue;
        }

        const level = match[1].length;
        let oldText = match[2];

        if (level === 1) {
            newLines.push(`${match[1]} ${h1Title}`);
            fileModified = true;
            continue;
        }

        // Attempt to match this line with the original heading from `headings.json`
        // We can assume they appear in the same order.
        let orig = originalFileHeadings[currentOriginalIndex];
        if (!orig) {
            newLines.push(line);
            continue;
        }

        // Increment the pointer
        currentOriginalIndex++;

        let origText = orig.text;
        let newText = origText; // Start with base

        if (directMaps[origText]) {
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
                newText = origText.replace(/副作用/, '副作用大全');
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
    }
}

console.log('Successfully diversified subheadings across all files.');
