# 首圖對照：content_ihealthy 備份 → src/content/blog

依備份 `content_ihealthy/**/*.md` 的 `image` 欄位更新 blog 的 `heroImage`。
路徑以備份為準（如 `/med_images/optimized/med_files_XX.webp`）。

## 有備份 image 的對照（已/將套用）

| blog slug | 備份 image |
|-----------|------------|
| accutane | /med_images/optimized/med_files_110.webp |
| astaxanthin | /med_images/optimized/med_files_31.webp |
| baby-should-not-drink-juice | /med_images/optimized/med_files_138.webp |
| bee-honey | /med_images/optimized/med_files_37.webp |
| bleach | /med_images/optimized/med_files_11.webp |
| blue-ray-eye-protect | /med_images/optimized/med_files_96.webp |
| boil-water | /med_images/optimized/med_files_7.webp |
| can-acne-wash-away | /med_images/optimized/med_files_13.webp |
| cold-weather-cause-cold | /med_images/optimized/med_files_33.webp |
| collagen | /med_images/optimized/med_files_177.webp |
| constipate | /med_images/optimized/med_files_57.webp |
| cranberry-juice-for-uti | /med_images/cranberry.jpg |
| curcumin | /med_images/optimized/med_files_132.webp |
| diet-loss-weight | /med_images/optimized/med_files_58.webp |
| eat-oil | /med_images/optimized/med_files_87.webp |
| eye-contact-recycle | /med_images/optimized/med_files_17.webp |
| eye-cream | /med_images/optimized/med_files_43.webp |
| eye-dark-circles | /med_images/optimized/med_files_51.webp |
| fix-vitamin-d | /med_images/vitamin-D.webp |
| gastroesophageal-reflux | /med_images/optimized/med_files_35.webp |
| gerd | /med_images/optimized/med_files_95.webp |
| ginger | /med_images/optimized/med_files_29.webp |
| gut-health-fundamentals | /med_images/gut-health-fundamentals.webp |
| hemorrhoid-bloody-stools | /med_images/optimized/med_files_44.webp |
| how-to-brush-your-teeth | /med_images/optimized/med_files_5.webp |
| how-to-choose-sunscreen | /med_images/optimized/med_files_62.webp |
| how-to-deal-stroke | /med_images/optimized/med_files_32.webp |
| how-to-deal-with-acne | /med_images/optimized/med_files_184.webp |
| how-to-eat-fish-safely | /med_images/optimized/med_files_109.webp |
| how-to-prevent-osteoporosis | /med_images/optimized/med_files_89.webp |
| how-to-prevent-or-soothe-wrinkles | /med_images/optimized/med_files_163.webp |
| indoor-air-pollute | /med_images/optimized/med_files_2.webp |
| intermittent-fasting | /med_images/intermittent-fasting-schedule.webp |
| is-supplement-works | /med_images/optimized/med_files_19.webp |
| lactose-intolerance | /med_images/optimized/med_files_40.webp |
| lutein-is-sufficiency | /med_images/optimized/med_files_42.webp |
| macronutrients-guide | /med_images/calorie-calculation.png |
| meal-planning-fundamentals | /med_images/healthy-plate.webp |
| mediterranean-diet | /med_images/optimized/med_files_103.webp |
| micro-plastic | /med_images/optimized/med_files_47.webp |
| micronutrients-beyond-vitamins | /med_images/micronutrients-guide.png |
| natural-immune-support | /med_images/optimized/med_files_60.webp |
| nitrate | /med_images/optimized/med_files_9.webp |
| nose-patch | /med_images/optimized/med_files_59.webp |
| otitis-media | /med_images/optimized/med_files_46.webp |
| pm2.5-air-pollute | /med_images/optimized/med_files_14.webp |
| pores-enlarge | /med_images/optimized/med_files_12.webp |
| probiotics-prebiotics-guide | /med_images/probiotics-prebiotics-guide.webp |
| ptfe-tooth-floss-toxic | /med_images/optimized/med_files_25.webp |
| reading-nutrition-labels | /med_images/nutrition-labels-guide.png |
| rose-spots | /med_images/optimized/med_files_8.webp |
| royal-jelly | /med_images/optimized/med_files_60.webp |
| stop-high-pressure-dash-diet | /med_images/optimized/med_files_99.webp |
| tea-coffee-cause-iron-insufficiency | /med_images/optimized/med_files_15.webp |
| urinary-tract-infection | /med_images/optimized/med_files_55.webp |
| vegetable-label | /med_images/optimized/med_files_26.webp |
| varicose-veins | /med_images/optimized/med_files_74.webp |
| vitamin-a | /med_images/optimized/med_files_78.webp |
| vitamin-c | /med_images/optimized/med_files_69.webp |
| vitamin-e | /med_images/optimized/med_files_73.webp |
| wash-vegetable | /med_images/optimized/med_files_28.webp |
| weight-gain-avoid-in-holidays | /med_images/optimized/med_files_24.webp |
| weight-loss-drug | /med_images/optimized/med_files_0.webp |
| weight-loss-ketogenic-diet | /med_images/optimized/med_files_127.webp |

## 備份中無 image 欄位的文章（維持目前 heroImage）

acupuncture_and_massage, children-nutrition-health, diabetes-prevention-management, digital_health_tools, emergency_preparedness, health_technology_applications, heart-disease-prevention, herbs_and_natural_remedies, hypertension_management, interpersonal_relationship_building, mental_health_maintenance, pregnancy-maternal-health, senior-health-nutrition, traditional_chinese_medicine_basics

## 備份檔名與 blog 差異

- how-to-prevent-or-sooth-wrinkles.md → blog: how-to-prevent-or-soothe-wrinkles.mdx
- lutein-is-suffieciency.md → blog: lutein-is-sufficiency.mdx

## 圖檔位置

- 首圖實際檔案：`public/med_images/`（根層）與 `public/med_images/optimized/`（med_files_*.webp）
- 由 `public/images/` 複製而來，複製腳本：`scripts/copy-hero-images.mjs`（執行 `node scripts/copy-hero-images.mjs` 可重新同步）
- 若專案中沒有對應原圖（如 gut-health-fundamentals、micronutrients-guide 等），腳本會以 healthy-plate.webp / calorie-calculation.png 作為替身
- 另已將 `public/images/` 內主題圖（supplement-safety、age-specific-health、chronic-disease、healthy-mind、environmental-safety、beauty-category）複製至 `public/med_images/`，並用於無備份 image 之文章首圖
