# 文章內文排版進階美化 - 自訂 MDX 元件擴充計畫

為達成使用者所提供的高級版面標準（如：疾病警告情境卡片、生物學機制步驟、深色總結面板），我們規劃在 Astro 專案中導入**「標準化 MDX 元件庫」**。這些元件可以直接在 [.mdx](file:///c:/Users/USER/Desktop/ihealthy.new/src/content/blog/gerd.mdx) 文章中使用，大幅提升視覺豐富度與重點標示能力。

## Proposed Changes

### [NEW] 目錄結構擴充
在 `src/components/mdx/` 下新增一系列專為文章內文打造的 Astro 元件：

#### 1. `CardGroup.astro` & `Card.astro` (並排資訊卡/情境警告卡)
*   **用途**：對應圖片一的「心臟病誤判」、「甲狀腺誤診」這類需要並排對比，且帶有不同背景色與圖示的卡片。
*   **設計**：
    *   `CardGroup`: 提供 CSS Grid 容器（如在桌機 `grid-cols-2` 均分）。
    *   `Card`: 支援 `type` 屬性（如 `danger`, `warning`, `info`）自動切換背景色（例如紅粉色背景、黃色背景），並包含標題與內文插槽。
    *   `Simulation`: 內建的情境模擬小區塊（如 💀 情境模擬）。

#### 2. `StepPanel.astro` (流程與機制步驟版)
*   **用途**：對應圖片二的「Step 1 / 2 / 3」生物機制解說區塊。
*   **設計**：
    *   支援傳入 `step="1"`, `title="正常情況"`, `theme="blue|orange|red"` 等屬性。
    *   左側帶有顏色飾條，外框帶有微圓角與極淡的背景色，讓專業機制的解說更生動易懂。

#### 3. `Takeaway.astro` (深色總結面板)
*   **用途**：對應圖片三的「RK 的生物素總結 (Takeaway)」。
*   **設計**：
    *   深色背景 (`bg-slate-900`)，文字反白。
    *   內部使用 Grid 佈局，可傳入多個重點項目（如：效果、風險、副作用、購買建議）。
    *   每個重點項目標題帶有特定顏色（紅、橘、綠），強化視覺衝擊力。

#### 4. 排版層次與表格美化 (Typography & Table Enhancements) - **新需求**
*   **標題層次 (Typography Hierarchy)**：
    *   使用者反應目前標題、副標題與段落分得不夠明顯。
    *   **對策**：我們將在 `.prose` 中進一步增強 `h2` 與 `h3` 的視覺重量。例如給 `h2` 加上顯眼的底部邊框或背景色塊，增加上下 `margin`，使其成為章節間明確的視覺斷點。`h3` 則可以使用左側飾條或特定的輔助色。
*   **表格美化 (Advanced Table Styling)**：
    *   圖片中的表格有強烈對比的彩色標頭（如藍色、紫色底色白字），以及圓角外框、隔行斑馬紋設計。
    *   **對策**：實作一個 `<DataTable>` Astro 元件，允許傳入主題色（如 `theme="blue" | "purple" | "red"`），它會渲染出帶有圓角外框、彩色表頭、隔行換色的高級資料表格。
*   **結論與論點強調 (Callout/Highlight)**：
    *   圖片中還有類似「工程師的省錢策略」的軟色系說明區塊。
    *   **對策**：實作 `<Callout>` 元件，帶有極淡的背景色（如淡綠色）與圖示，專門用於論點強調、提示或訣竅分享。

## Verification Plan

### Implementation & Demonstration
1.  **實作元件**：建立上述所有 Astro MDX 元件。 ✅ 已完成（`CardGroup`、`Card`、`Simulation`、`StepPanel`、`Takeaway`、`TakeawayItem`、`Callout`、`DataTable` 均已實作並在 `src/pages/[...slug].astro` 註冊。）
2.  **套用範例**：挑選一篇合適的文章（例如 `weight-loss-ketogenic-diet.mdx` 或 `weight-loss-drug.mdx`），將部分純文字的警告或總結，替換為這套新的 MDX 元件。 ✅ 已套用於 `weight-loss-ketogenic-diet.mdx`（DataTable、StepPanel、Callout、CardGroup/Card/Simulation、Takeaway/TakeawayItem）。
3.  **視覺確認**：透過 Browser Subagent 開啟修改後的文章，截圖確認元件是否完美還原參考圖片的高級感，並適應手機版與電腦版（RWD）。

---

## Layout Optimize 執行紀錄

- **Typography（標題層次）**：在 `src/pages/[...slug].astro` 的 `.prose` 中已增強 **h2**（背景色塊 `bg-slate-100/80`、圓角、左右邊框、上下 margin 加大）與 **h3**（左側飾條 `before:w-1`、`before:bg-indigo-500`、min-height、pl/margin 調整），章節視覺斷點更明顯。
- **StepPanel**：左側改為獨立 **顏色飾條**（`w-1.5` 的 div 使用 theme 色），取代單一邊框，並加上圓角與陰影，符合「左側帶有顏色飾條」的設計。
- **其餘元件**（Card、Takeaway、Callout、DataTable）已符合計畫描述，無需變更。

### 第一批文章與 plan 對齊（2025-02）

以下調整已套用於第一批文章（accutane、acupuncture_and_massage、air-quality-health、astaxanthin、bee-honey、bleach、boil-water），使版面符合 plan 要求：

- **Takeaway / TakeawayItem**：每項改為具 **title** 與 **type**（`danger`|`warning`|`success`|`info`），讓重點項目標題有紅／橘／綠等顏色，內文放 slot。
- **CardGroup + Card**：在並排對比或情境分類處加入（例：針灸 vs 推拿、顆粒物 vs 氣態、日常 100 倍 vs 強悍病毒 50 倍、食物 vs 補充品、替代治療三類）。
- **Simulation**：在易誤解或情境說明處加入（例：爆痘期、蜂蜜結晶、漂白水混酸、千滾水迷思）。
- **Callout**：維持用於安全提醒、禁止事項；**DataTable** 與 **StepPanel** 用法不變。

### 第二批文章與 plan 對齊（同標準）

第二批（blue-ray-eye-protect、can-acne-wash-away、collagen、constipate、cranberry-juice-for-uti、curcumin、diet-loss-weight、eat-oil）已依同一標準更新：

- **Takeaway / TakeawayItem**：每項具 **title** 與 **type**，標題上色、內文在 slot。
- **CardGroup + Card**：藍光迷思 vs 真相、洗臉能做的 vs 做不到的、口服 vs 外用膠原、便秘成因、蔓越莓預防 vs 治療、薑黃香料 vs 補充品、減重生活型態、高溫用油 vs 涼拌用油。
- **Simulation**：藍光眼鏡仍累、猛洗臉更油、膠原乳霜真相、便秘以為腸無力、急性 UTI 只喝蔓越莓、薑黃奶沒感覺、極端節食反彈、亞麻仁油炒菜。
- **DataTable**：diet-loss-weight 之「流行飲食法實證分析」改為 DataTable（purple）。

### 第三批文章與 plan 對齊（續）

以下文章已依同一標準加入 DataTable、CardGroup/Card、Callout、StepPanel、Simulation：

- **diabetes-prevention-management**：管理核心 DataTable、類型 CardGroup、早期徵兆 Simulation。
- **digital_health_tools**：三大層級 DataTable、生活 vs 醫療級 Card、量化焦慮 Simulation + Callout。
- **eczema-atopic-dermatitis**：管理核心 DataTable、洗/補 Card、類固醇迷思 Simulation。
- **emergency_preparedness**：生存邏輯 DataTable、三三三 Card、S.T.O.P. Callout。
- **facial-clean**：黃金準則 DataTable、膚質 Card、過度清潔 Simulation。
- **fix-vitamin-d**：三要素 DataTable、K2/鎂 Card、先檢測 Callout。
- **gastric-ulcer**：核心知識 DataTable、兩大元兇 Card、危險徵兆 Callout。
- **gerd**：9 策略改為 StepPanel + 何時就醫 Callout。
- **ginger**：科學實力 DataTable、禁忌 Callout。
- **gut-health-fundamentals**：關鍵指標 DataTable、益生元/發酵 Card、益生菌情境 Simulation。
- **heart-disease-prevention**：四大防線 DataTable、篩檢/生活 Card、急救 Callout。
- **how-to-deal-with-acne**：抗痘勝經 DataTable、BHA/杜鵑花酸 Card、禁擠 Callout + Simulation。
- **how-to-choose-sunscreen**：係數 DataTable、物理/化學 Card、塗抹指南 Callout。
- **how-to-deal-stroke**：急救三部曲 DataTable、錯誤急救 Callout。
- **how-to-eat-fish-safely**：紅綠燈 DataTable、大小魚 Card、大目鮪 Simulation。
- **how-to-prevent-or-soothe-wrinkles**：皺紋分類 DataTable、防曬/A 醇 Card。
- **how-to-brush-your-teeth**：潔牙核心 DataTable、兩大真相 Callout。
- **how-to-prevent-osteoporosis**：三大支柱 DataTable、運動/營養 Card。
- **hypertension_management**：血壓分類 DataTable、722 原則 Callout。
- **indoor-air-pollute**：三支柱 DataTable、甲醛 TVOC/清淨機 Card。

### 第四批（依字母順序）：其餘全數文章版面更新完成

以下文章已依字母順序完成 DataTable、CardGroup/Card、Callout、Takeaway/TakeawayItem、Simulation 等元件套用：

- **baby-should-not-drink-juice**：快速摘要 DataTable、各階段果汁量 DataTable、專家建議 Callout。
- **children-nutrition-health**：發展階段 DataTable、骨骼/大腦 CardGroup。
- **cold-weather-cause-cold**：關鍵因素 DataTable、病毒/人體 CardGroup、預防 Takeaway。
- **eye-contact-recycle**：處置指南 DataTable、禁止沖馬桶 Callout。
- **eye-cream**：能與不能 DataTable、浮腫/乾紋 CardGroup。
- **eye-dark-circles**：三類型 DataTable、色素型/血管型 CardGroup。
- **gastroesophageal-reflux**：胃藥比較 DataTable、長期 PPI 風險 Callout。
- **health_technology_applications**：三大支柱 DataTable、數位陷阱 Callout。
- **hemorrhoid-bloody-stools**：三種血便 DataTable、鮮紅/暗紅 CardGroup。
- **herbs_and_natural_remedies**：核心原則 DataTable、安全警告 Callout。
- **hotter-face-get-oiler**：控油三招 DataTable、迷思 Callout。
- **intermittent-fasting**：斷食法 DataTable、禁忌 Callout、進食窗口 Takeaway。
- **is-supplement-works**：挑選準則 DataTable、食物 vs 藥丸 CardGroup。
- **lactose-intolerance**：全球視野 DataTable、優格/無乳糖 CardGroup。
- **lifestyle-immunity-factors**：四大因子 DataTable、睡眠壓力/營養 CardGroup。
- **lips-sun-protection**：唇部特徵 DataTable、光化性唇炎 Callout。
- **lutein-is-sufficiency**：生理定位 DataTable、誰該補充/挑選 CardGroup。
- **macronutrients-guide**：三大營養素 DataTable、蛋白質/醣脂 CardGroup。
- **meal-planning-fundamentals**：TDEE 策略 DataTable。
- **mediterranean-diet**：核心支柱 DataTable、PREDIMED/台灣實踐 CardGroup。
- **mental_health_maintenance**：心理韌性 DataTable、慢性壓力/實戰 CardGroup。
- **micro-plastic**：威脅與防護 DataTable、來源 Callout。
- **micronutrients-beyond-vitamins**：礦物質 DataTable、拮抗協同/精準 CardGroup。
- **natural-immune-support**：四大防線 DataTable、天然調節 Takeaway。
- **nitrate**：來源風險 DataTable、規避對策 Callout。
- **nose-patch**：皮脂管絲 vs 黑頭 DataTable、妙鼻貼風險 Callout。
- **otitis-media**：中耳炎分類 DataTable、兒童易發/治療 CardGroup。
- **pm2.5-air-pollute**：多系統 DataTable、防護 Takeaway。
- **pores-enlarge**：毛孔類型 DataTable、疏通支撐/成因 CardGroup。
- **pregnancy-maternal-health**：孕期營養 DataTable、三大支柱 Callout。
- **probiotics-prebiotics-guide**：金三角 DataTable、SCFAs/優化 CardGroup。
- **ptfe-tooth-floss-toxic**：PFAS 風險 DataTable（red）、替代方案 Callout。
- **quality-supplement-selection**：黃金識別 DataTable、採購 Takeaway。
- **reading-nutrition-labels**：5/20 法則 DataTable、陷阱 Callout。
- **rose-spots**：玫瑰斑亞型 DataTable、規避與醫學 CardGroup。
- **royal-jelly**：生理價值 DataTable、致敏與激素 Callout。
- **senior-health-nutrition**：四大支柱 DataTable、蛋白質時間 Callout。
- **stop-high-pressure-dash-diet**：DASH 機制 DataTable、鈉鉀與實踐 Callout。
- **supplement-safety-guide**：安全隱患 DataTable（red）、審計 Takeaway。
- **tea-coffee-cause-iron-insufficiency**：飲品影響 DataTable、一小時規則 Callout。
- **traditional_chinese_medicine_basics**：中醫概念 DataTable、臟腑/子午 CardGroup。
- **urinary-tract-infection**：UTI 徵兆 DataTable、三維防護 Takeaway。
- **vegetable-label**：標章對比 DataTable、採購 Callout。
- **varicose-veins**：CEAP 分級 DataTable、三層級防禦 Takeaway。
- **vitamin-a**：來源 RAE DataTable、孕期與 UL Callout。
- **vitamin-c**：劑量吸收 DataTable、分次與腎結石 Callout。
- **vitamin-e**：天然 vs 合成 DataTable、維 K 拮抗與術前 Callout。
- **vommiting**：危險徵兆 DataTable（red）、分階段復原 Takeaway。
- **wash-vegetable**：清洗實證 DataTable、三段式 Callout。
- **water-quality-safety**：水質風險 DataTable、審計 Callout。
- **weight-gain-avoid-in-holidays**：假期增重 DataTable、代謝審計 Takeaway。
- **weight-loss-drug**：減重藥物 DataTable、肌肉與停藥 Callout。
- **interpersonal_relationship_building**：關係生理價值 DataTable、連結與實戰 CardGroup。
