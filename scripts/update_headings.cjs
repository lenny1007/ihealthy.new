const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'content', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

function upgradeHeading(text) {
    let h = text.trim();

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
    if (directMaps[h]) return directMaps[h];

    if (h.startsWith('什麼是')) {
        return '到底' + h.replace(/[？?]?$/, '？一次搞懂核心觀念');
    }
    if (h.endsWith('是什麼') || h.endsWith('是什麼？')) {
        return '到底' + h.replace(/[？?]?$/, '？白話文解釋給你聽');
    }
    if (h.startsWith('為什麼')) {
        return '揭秘！' + h.replace(/[？?]?$/, '？背後的真實原因');
    }
    if (h.startsWith('誰不適合') || h.startsWith('誰需要') || h.startsWith('誰會')) {
        return '必看指南！' + h.replace(/[？?]?$/, '？千萬別搞錯');
    }

    let match = h.match(/^(\d+)[.、]\s*(.+)$/);
    if (match) {
        if (match[2].length < 12 && !/(重點|真相|攻略|風險|原則)/.test(match[2])) {
            return `${match[1]}. 關鍵重點：${match[2]}`;
        }
        return h;
    }

    if (h.includes('副作用') && !h.includes('解密')) return h.replace(/副作用/, '副作用大解密');
    if (h.includes('迷思') && !/(破解|真相)/.test(h)) return `破解迷思：${h}的真相到底是什麼？`;

    if (h.length <= 12 && !/[！？\?!\:\-「」]/.test(h)) {
        if (h.includes('基礎')) return `新手必看：${h}懶人包`;
        if (h.includes('指南')) return `超實用！${h}`;
        if (h.includes('治療') || h.includes('護理')) return `${h}，教你對症下藥`;
        if (h.includes('原因') || h.includes('成因')) return `原來這才是背後的${h}！`;
        if (h.includes('預防') || h.includes('對策')) return `別等發生才後悔！${h}實用絕招`;
        if (h.includes('飲食') || h.includes('營養') || h.includes('怎麼吃')) return `吃對才健康：${h}這樣挑`;
        if (h.includes('機制') || h.includes('生理') || h.includes('系統') || h.includes('階段')) return `深度解析：${h}`;
        return `深度解析：${h}`;
    }

    return h;
}

let modifiedCount = 0;

for (const file of files) {
    const filepath = path.join(dir, file);
    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split(/\r?\n/);

    let newLines = [];
    let title = '';

    // Extract title from frontmatter
    const titleMatch = content.match(/^title:\s*["']?([^"'\n]+?)["']?$/m);
    if (titleMatch) {
        title = titleMatch[1];
    }

    let fileModified = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
            const level = match[1].length;
            const oldText = match[2];

            let newText = oldText;
            if (level === 1 && title) {
                newText = title; // Sync H1 with title
            } else if (level >= 2) {
                newText = upgradeHeading(oldText);
            }

            if (oldText !== newText) {
                newLines.push(`${match[1]} ${newText}`);
                fileModified = true;
            } else {
                newLines.push(line);
            }
        } else {
            newLines.push(line);
        }
    }

    if (fileModified) {
        fs.writeFileSync(filepath, newLines.join('\n'), 'utf-8');
        modifiedCount++;
        console.log(`Updated headings in ${file}`);
    }
}

console.log(`\nSuccessfully updated subheadings in ${modifiedCount} files.`);
