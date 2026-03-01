# Vercel 專案設定說明

本專案為 Astro 靜態站，已可在 Vercel 一鍵部署。此文件說明建議的後台設定與選項。

## 一、專案設定檔（已納入 repo）

- **`vercel.json`**（專案根目錄）：指定 framework 為 Astro、build 指令與輸出目錄，其餘使用 Vercel 預設即可。

## 二、Vercel Dashboard 建議設定

### 已完成 ✓
- **Connect Git Repository**：已連接，推送到 `main` 會自動部署
- **Add Custom Domain**：已設定（例如 `healthy.com.tw`），請確認 DNS 與 SSL 正常

### 建議在 Dashboard 啟用

1. **Preview Deployment（預覽部署）**  
   - 非 `main` 的分支或 PR 會產生預覽網址，方便在合併前檢查。

2. **Enable Web Analytics（網站分析）**  
   - 路徑：Overview → Analytics 區塊 → 「Track visitors and page views」→ **Enable**  
   - 可統計造訪與頁面瀏覽（需在專案中已使用 `@vercel/analytics` 或於 Dashboard 啟用後由 Vercel 注入）。

3. **Enable Speed Insights（速度洞察）**  
   - 專案已在 `Layout.astro` 加入 `@vercel/speed-insights`，部署後即可在 Dashboard 的 **Speed Insights** 查看真實用戶效能數據。  
   - 若 Dashboard 有「Enable Speed Insights」按鈕，建議一併開啟。

### 環境變數（若有需要）

- 目前為純靜態內容，一般不需環境變數。
- 若日後加入 API Key 或私密設定，請在：**Settings → Environment Variables** 新增，並選擇套用環境（Production / Preview / Development）。

### 建置與輸出

- **Build Command**：`npm run build`（與 `vercel.json` 一致即可）
- **Output Directory**：`dist`（Astro 預設）
- **Install Command**：`npm install`（預設）

## 三、網域與 Astro 設定

- `astro.config.mjs` 中已設定 `site: 'https://ihealthy.com.tw'`，用於 sitemap 等絕對網址。
- 若實際對外網域不同（例如僅用 `healthy.com.tw`），請在 `astro.config.mjs` 的 `site` 改為實際網域，然後重新部署。

## 四、部署流程簡述

1. 將程式推送到 GitHub 的 `main` 分支。
2. Vercel 會自動觸發 Production 部署。
3. 部署完成後可從 **Deployments** 點進該次部署，用 **Visit** 開啟線上網址或自訂網域。

若需進階設定（redirects、headers、crons），可再於 `vercel.json` 或 Dashboard 的 **Settings** 中調整。

---

## 五、效能優化（PageSpeed / Core Web Vitals）

專案已針對 FCP、LCP 做以下調整：

- **字型**：Google Fonts 改為非阻塞載入（`media="print"` + `onload`），並只載入常用字重（400、600、700），減少首次繪製延遲。
- **首頁 LCP 圖片**：首屏第一張文章卡圖會透過 Layout 的 `lcpImage` 傳入並在 `<head>` 預載（`<link rel="preload" as="image">`）；前兩張圖設為 `fetchpriority="high"`、`loading="eager"`，其餘 `loading="lazy"`。
- **文章頁**：內文 hero 圖設為 `fetchpriority="high"`、`loading="eager"`，有利 LCP。
- **列表頁**（所有文章、分類）：前兩張圖高優先、其餘 lazy，並加上 `width`/`height` 與 `decoding="async"`。
- **快取**：`vercel.json` 對 `/med_images/*`、`/_astro/*` 設定長期快取（1 年），再次造訪會更快。

部署後建議用 [PageSpeed Insights](https://pagespeed.web.dev/) 再測一次（尤其是行動裝置）；若主機在亞洲，可考慮 Vercel 的 Edge Network 或自訂 region。
