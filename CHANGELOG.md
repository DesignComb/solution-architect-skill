# Changelog

格式依 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)，版本號依 [SemVer](https://semver.org/lang/zh-TW/)。

## [0.1.0] - 2026-08-24

首個公開版本。

### Added

- `/architect`：三階段訪談（需求 → 資源 → 架構建議書），產出 `solution/` 三份文件，
  檔案即存檔點，中斷可續。
- `/welcome`：打開離線教學網站（單一 HTML 檔，零相依）。
- 知識庫：訪談題庫、資源盤點、判斷流程（要不要寫程式／Web-PWA-APP／選型）、
  服務價目表（全球＋台灣在地＋海外收款路線，2026-08-24 查證；平台預設網址一節 2026-09-01 查證）、
  風格預設集（俐落／雜誌／溫暖＋反 AI 味清單）、生態資源索引與預裝包、
  白話對照表（技術名詞怎麼講給非工程師聽）、建議書模板。
- 教學網站（React＋Tailwind v4＋shadcn/ui）：首頁、五個問題各一頁、心法、
  「開始規劃」表單精靈（不裝 skill 也能產需求單）、書架二十七本指南分五排——
  先看懂（軟體怎麼運作、跟 AI 一起做、資安基本功）、做出來（工具索引、
  串接、風格細節）、開門做生意（金流、APP 上架、上線與維護、賣出去）、
  小教室（十二堂含小測驗的概念課：兩把鑰匙、倉庫的門禁、倉庫的施工紀錄、登入之後、
  借別人的櫃台、誰在敲門、樣品屋與真店面、改了怎麼沒變、網址是誰給的、地圖還沒更新、
  網站塞車的時候、AI 為什麼會忘記；金鑰命名以 2026-08-25 的 Supabase 官方文件查證，
  平台預設網址的行為與條款以 2026-09-01 的各家官方定價與說明頁查證）、
  隨手查（服務價目總表、情境配方、指令範本、名詞小抄、網址後綴對照表）。
- 資料原則：免費額度會浮動，所以不寫死數字——只寫方向與陷阱，實際數字附官方連結，
  官方沒公布的直接把人帶到官方頁，不硬掰也不寫「查不到」。價目表每張表都有「官方頁」欄。
- `tools/check-links.mjs`（`npm run links`）：掃全 repo 的外部連結逐一連連看，
  分成正常／已轉址／被擋／死連結／連不上五類並指出出現在哪個檔案，死連結會讓指令回傳非零。
- 網站有兩個建置目標，共用同一份原始碼與同一份路由表（`web/src/routes.tsx`）：
  `npm run build` 出 `site/index.html`（單檔、HashRouter、`file://` 可開，維持 /welcome 的離線契約）；
  `npm run build:ssg` 出 `dist/`（每個路由一個預先產生的 HTML、BrowserRouter、乾淨路由），
  每頁帶自己的 `<title>`、description、canonical 與 OG 標籤，設了 `SITE_URL` 再加產 sitemap.xml 與 robots.txt。
- `web/scripts/serve-ssg.mjs`（`npm run preview:ssg`）：照真正靜態主機的規則預覽 SSG 產物——
  `vite preview` 是 SPA 模式，會把首頁 HTML 回給每一條路由，導致誤判成 hydration bug。
- 全站文字標準：每一行敘述都是完整的一句話，一句一個念頭，唸得順才算過。
