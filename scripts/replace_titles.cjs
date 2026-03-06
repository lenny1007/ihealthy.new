const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'src', 'content', 'blog');

const replacements = {
    "accutane.mdx": "吃口服 A 酸能根治痘痘嗎？皮膚科醫生告訴你吃之前必須知道的事",
    "acupuncture_and_massage.mdx": "針灸與推拿有效嗎？中醫傳統療法全解盲",
    "air-quality-health.mdx": "你家空氣比戶外還髒？打造純淨居家呼吸空間的實用指南",
    "astaxanthin.mdx": "比維他命 C 強效千倍？揭開「抗氧化之王」蝦紅素的真實功效",
    "baby-should-not-drink-juice.mdx": "別再給 1 歲以下的寶寶喝果汁了！兒科醫師揭露超甜背後的健康陷阱",
    "bee-honey.mdx": "泡蜂蜜水千萬別用熱水！破解加熱蜂蜜產生毒素的迷思",
    "bleach.mdx": "稀釋比例怎麼抓？漂白水環境消毒安全指南，別讓消毒變投毒",
    "blue-ray-eye-protect.mdx": "藍光眼鏡真的能護眼嗎？專家破解 3C 眼疲勞的真實解方",
    "boil-water.mdx": "自來水煮沸會致癌？破解三鹵甲烷迷思，教你正確飲水煮沸法",
    "can-acne-wash-away.mdx": "拼命洗臉其實救不了痘痘！打破粉刺與洗臉的 3 個致命迷思",
    "children-nutrition-health.mdx": "挑食長不高怎麼辦？兒童各階段黃金期營養補給指南",
    "cold-weather-cause-cold.mdx": "「穿太少會感冒」是真的嗎？破解低溫與病毒感染的科學真相",
    "collagen.mdx": "吃豬腳補膠原蛋白沒用？破解抗老保養品的吸收率真相",
    "constipate.mdx": "經常便秘怎麼辦？除了吃青菜，你還缺少的順暢解方",
    "cranberry-juice-for-uti.mdx": "蔓越莓汁真的能預防尿道炎嗎？泌尿科醫師告訴你真相",
    "curcumin.mdx": "吃咖哩就能抗發炎？揭開「黃金香料」薑黃素吸收率極低的秘密",
    "diabetes-prevention-management.mdx": "糖尿病前期還能逆轉嗎？穩定血糖的飲食與生活超實用策略",
    "diet-loss-weight.mdx": "少吃多動為什麼不會瘦？打破減肥迷思的永續瘦身法則",
    "digital_health_tools.mdx": "Apple Watch 測量準嗎？打造專屬你的數位健康監測系統",
    "eat-oil.mdx": "橄欖油不能炒菜嗎？秒懂發煙點，挑選廚房最適合的那罐好油",
    "eczema-atopic-dermatitis.mdx": "狂擦乳液還是癢？異位性皮膚炎與濕疹的正確護理指南",
    "emergency_preparedness.mdx": "災難發生時你準備好了嗎？建立 72 小時黃金急救包與生存準則",
    "eye-contact-recycle.mdx": "用完的隱形眼鏡可以直接丟垃圾桶嗎？別讓你的美貌成為海洋微粒",
    "eye-cream.mdx": "眼霜只是比較貴的乳霜？破解眼周細紋保養品的真實效用",
    "eye-dark-circles.mdx": "狂睡覺也消不掉？3 種類型黑眼圈對症下藥的終極解析",
    "facial-clean.mdx": "你真的會洗臉嗎？避開破壞肌膚屏障的 4 個錯誤清潔習慣",
    "fix-vitamin-d.mdx": "你的維他命 D 可能都白吃了！揭開吸收率翻倍的正確吃法",
    "gastric-ulcer.mdx": "胃痛吃止痛藥反而更傷？破解胃潰瘍的成因與養胃秘訣",
    "gastroesophageal-reflux.mdx": "吃飽就火燒心？胃食道逆流的藥物治療與改變習慣全攻略",
    "gerd.mdx": "半夜常常被胃酸嗆醒？9 個不用吃藥就能舒緩胃食道逆流的招數",
    "ginger.mdx": "感冒喝薑茶真的有效？從止吐到抗發炎，帶你重新認識天然食材",
    "gut-health-fundamentals.mdx": "經常脹氣、便秘怎麼辦？3 招養好腸道好菌，告別小腹婆",
    "health_technology_applications.mdx": "智慧穿戴裝置真的能預防疾病嗎？解密 AI 健康數據背後的真相",
    "heart-disease-prevention.mdx": "心臟病不只看膽固醇！預防心血管疾病必知的 5 大隱藏指標",
    "hemorrhoid-bloody-stools.mdx": "上廁所大便有血怎麼辦？教你從顏色分辨痔瘡與大腸癌徵兆",
    "herbs_and_natural_remedies.mdx": "中西藥可以一起吃嗎？安全運用草藥療法的實用指南",
    "hotter-face-get-oiler.mdx": "為什麼夏天臉總是油到可以煎蛋？控油抗痘的科學護理秘訣",
    "how-to-brush-your-teeth.mdx": "用力刷牙反而讓牙齦萎縮？別讓錯誤的刷牙方式毀了你的牙齒",
    "how-to-choose-sunscreen.mdx": "SPF 越高越好？物理防曬跟化學防曬到底要怎麼挑？",
    "how-to-deal-stroke.mdx": "遇到中風怎麼辦？記住 BE-FAST 口訣，搶救大腦黃金 3 小時",
    "how-to-deal-with-acne.mdx": "痘痘一直長怎麼辦？從保養到就醫，看懂抗痘成分與時機",
    "how-to-eat-fish-safely.mdx": "想吃魚獲取 Omega-3 又怕重金屬？專家教你避開深海魚毒素",
    "how-to-prevent-or-soothe-wrinkles.mdx": "擦保養品就能撫平皺紋？從生活作息到醫美級護理的抗老真相",
    "how-to-prevent-osteoporosis.mdx": "別等跌倒骨折才後悔！從飲食到重訓，年輕人也該懂的存骨本策略",
    "hypertension_management.mdx": "不想一輩子吃降壓藥？圖解讓醫生都推薦的「DASH 飲食」與 722 法則",
    "index.mdx": "健康小辭典：常見疾病與症狀快速查詢指引",
    "indoor-air-pollute.mdx": "以為關窗就沒事？小心室內空氣比戶外還毒的日常陷阱",
    "intermittent-fasting.mdx": "間歇性斷食 16:8 怎麼餓肚子才有效？新手安全起步指南",
    "interpersonal_relationship_building.mdx": "孤單真的會致命？哈佛研究告訴你：人際關係決定你能活多久",
    "is-supplement-works.mdx": "吞了一堆保健食品真的有效嗎？破解生物利用率的行銷話術",
    "lactose-intolerance.mdx": "為什麼喝牛奶就拉肚子？9成亞洲人都有的乳糖不耐症解方",
    "lifestyle-immunity-factors.mdx": "狂吃維他命不如好好睡一覺？解開提升免疫力的日常作息密碼",
    "lips-sun-protection.mdx": "嘴唇也需要防曬？預防唇炎與唇紋加深的重點護理指南",
    "lutein-is-sufficiency.mdx": "狂吃葉黃素能抵抗 3C 藍光嗎？一次搞懂護眼保健品的挑選訣竅",
    "macronutrients-guide.mdx": "只看熱量減肥必敗？搞懂蛋白質、碳水與油脂的黃金代謝比例",
    "meal-planning-fundamentals.mdx": "不知從何開始吃得健康？教你算出專屬 TDEE 與無痛抓菜單",
    "mediterranean-diet.mdx": "連續七年被評為最健康飲食！在台灣也能輕鬆實踐的地中海好風格",
    "mental_health_maintenance.mdx": "壓力太大怎麼辦？重塑大腦神經可塑性的實用減壓法則",
    "micro-plastic.mdx": "我們每週吃下一張信用卡的塑膠？微塑膠對內分泌的隱形衝擊",
    "micronutrients-beyond-vitamins.mdx": "你缺乏微量元素了嗎？除了維他命，你還需要補充的隱形營養素",
    "natural-immune-support.mdx": "常感冒是因為免疫力太差？強化身體防護網的天然保健對策",
    "nitrate.mdx": "吃香腸配養樂多會致癌嗎？破解硝酸鹽與亞硝胺的飲食迷思",
    "nose-patch.mdx": "狂拔粉刺反而讓毛孔變黑洞？皮膚科醫師教你正確清理皮脂管絲",
    "otitis-media.mdx": "孩子反覆耳朵痛是中耳炎？教你分辨症狀與抗生素的正確使用時機",
    "pm2.5-air-pollute.mdx": "空污不只傷肺還傷腦？防禦 PM2.5 細懸浮微粒的終極指南",
    "pores-enlarge.mdx": "毛孔粗大沒救了嗎？從控油到膠原蛋白增生的縮毛孔科學",
    "pregnancy-maternal-health.mdx": "一人吃兩人補是真的嗎？孕期關鍵營養與胎兒發育黃金指南",
    "probiotics-prebiotics-guide.mdx": "吃錯益生菌等於白吃？搞懂益生菌與益生元的挑選與搭配秘訣",
    "ptfe-tooth-floss-toxic.mdx": "你用的牙線含有毒致癌物嗎？揭開 PTFE 牙線背後的 PFAS 危機",
    "quality-supplement-selection.mdx": "保健食品怎麼挑不踩雷？從成分表到認證標章的防坑指南",
    "reading-nutrition-labels.mdx": "無糖真的不含糖？教你破解營養標示上的文字遊戲與行銷陷阱",
    "rose-spots.mdx": "臉紅紅不是氣色好！酒糟肌退紅與抗蟎蟲實戰手冊",
    "royal-jelly.mdx": "蜂王乳真的能改善更年期不適嗎？解析女性保養聖品的真實功效",
    "senior-health-nutrition.mdx": "年紀大吃不下怎麼辦？長輩預防肌少症的黃金飲食對策",
    "stop-high-pressure-dash-diet.mdx": "高血壓患者的救星！跟著 DASH 得舒飲食，吃回降壓超能力",
    "supplement-safety-guide.mdx": "保健食品吃多也會中毒？注意藥物交互作用與累積劑量風險",
    "tea-coffee-cause-iron-insufficiency.mdx": "飯後喝茶、咖啡會導致貧血？破解單寧酸抑制鐵質吸收的迷思",
    "traditional_chinese_medicine_basics.mdx": "中醫養生到底在養什麼？氣血陰陽平衡的日常實踐指南",
    "urinary-tract-infection.mdx": "一直尿道炎復發怎麼辦？終結反覆感染的非抗生素預防法",
    "varicose-veins.mdx": "腿上浮出青筋是靜脈曲張嗎？小心第二心臟衰竭的危險訊號",
    "vegetable-label.mdx": "有機、產銷履歷怎麼看？教你一眼看懂蔬果標章，避開農藥",
    "vitamin-a.mdx": "維他命 A 補太多會中毒？從保護視力到養顏美容的安全劑量拿捏",
    "vitamin-c.mdx": "維他命 C 吃太多會結石？抗氧化聖品的正確劑量與吸收真相",
    "vitamin-e.mdx": "抗老神隊友維他命 E 怎麼吃？搞懂保護心血管跟抗凝血風險",
    "vommiting.mdx": "一直嘔吐怎麼辦？從止吐到補充電解質的居家舒緩急救法",
    "wash-vegetable.mdx": "用鹽水洗菜反而更毒？破解農藥殘留，蔬菜正確清洗 3 步驟",
    "water-quality-safety.mdx": "家裡的水真的能喝嗎？從鉛管危機到濾水器挑選的家庭防禦指南",
    "weight-gain-avoid-in-holidays.mdx": "連假過後胖一圈？節慶大餐後的代謝修復與不復胖策略",
    "weight-loss-drug.mdx": "打瘦瘦筆真的會變瘦嗎？瘦身藥副作用與停藥復胖大解密",
    "weight-loss-ketogenic-diet.mdx": "生酮飲食一定能秒瘦嗎？解析吃油減脂的背後代價與執行重點"
};

let filesChanged = 0;

for (const [filename, newTitle] of Object.entries(replacements)) {
    const filepath = path.join(targetDir, filename);
    if (fs.existsSync(filepath)) {
        let content = fs.readFileSync(filepath, 'utf-8');
        // Replace the title in frontmatter
        let modified = content.replace(/^title:\s*["']?([^"'\n]+?)["']?$/m, `title: "${newTitle}"`);
        if (content !== modified) {
            fs.writeFileSync(filepath, modified, 'utf-8');
            filesChanged++;
        }
    }
}

console.log(`Successfully updated labels for ${filesChanged} markdown files!`);
