---
title: "測試分類頁面"
description: "測試 CategoryPage 組件的功能，包括搜尋、篩選、響應式設計和無障礙功能"
navigation: false
layout: page
image: "/med_images/healthy-plate.png"
main:
  fluid: false
sitemap:
  lastmod: "2024-01-02"
  changefreq: "monthly"
  priority: 0.8
articles:
  - _path: '/diet/macronutrients-guide/'
    title: '巨量營養素指南'
    description: '了解碳水化合物、蛋白質、脂肪三大營養素的作用、攝取建議和健康選擇'
    image: '/med_images/optimized/weightgain.webp'
    tags: ['營養', '基礎知識', '健康飲食']
    date: '2024-01-15'
  - _path: '/diet/mediterranean-diet/'
    title: '地中海飲食'
    description: '被譽為最健康飲食方式的地中海飲食，完整指南與實踐方法'
    image: '/med_images/optimized/weightgain.webp'
    tags: ['飲食方法', '健康', '地中海']
    date: '2024-01-10'
  - _path: '/diet/intermittent-fasting/'
    title: '間歇性斷食'
    description: '間歇性斷食的科學原理、方法和注意事項'
    image: '/med_images/optimized/weightgain.webp'
    tags: ['減重', '飲食方法', '健康']
    date: '2024-01-05'
  - _path: '/diet/gut-health-fundamentals/'
    title: '腸道健康基礎'
    description: '腸道健康的重要性、腸道菌群的作用和維護方法'
    image: '/med_images/optimized/weightgain.webp'
    tags: ['腸道健康', '消化', '基礎知識']
    date: '2024-01-01'
  - _path: '/diet/weight-loss-ketogenic-diet/'
    title: '生酮飲食減重'
    description: '生酮飲食的原理、實施方法和注意事項'
    image: '/med_images/optimized/weightgain.webp'
    tags: ['減重', '飲食方法', '生酮']
    date: '2023-12-28'
  - _path: '/diet/probiotics-prebiotics-guide/'
    title: '益生菌與益生元指南'
    description: '益生菌和益生元的作用、選擇方法和使用建議'
    image: '/med_images/optimized/weightgain.webp'
    tags: ['腸道健康', '益生菌', '營養補充']
    date: '2023-12-25'
relatedCategories:
  - path: '/personal-health/'
    title: '個人健康管理'
    description: '運動、壓力管理、睡眠衛生等個人健康議題'
    icon: 'arcticons:my-health'
  - path: '/food-supplement/'
    title: '營養補充品'
    description: '維生素、礦物質、保健食品的使用指南'
    icon: 'material-symbols:health-and-safety-outline'
  - path: '/safety-eat/'
    title: '食品安全'
    description: '食品安全指南，包括如何安全食用各種食物'
    icon: 'icon-park-twotone:medicine-bottle-one'
---

<CategoryPage 
  :category-path="'/test-category'"
  :category-info="{
    title: '測試分類頁面',
    description: '這是一個測試分類頁面，用於驗證 CategoryPage 組件的所有功能，包括搜尋、標籤篩選、響應式設計和無障礙功能。',
    image: '/med_images/healthy-plate.png',
    icon: 'mdi:test-tube'
  }"
  :articles="articles"
  :related-categories="relatedCategories"
/> 