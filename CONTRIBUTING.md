# 貢獻指南

謝謝你願意讓這個工具更好。這個 repo 不大，但有幾條**不明顯的慣例**，動手前先讀完這一頁。

## 開發環境

- Node.js ≥ 20.19（網站建置用；只改 skill 文件不需要）
- [Claude Code](https://claude.com/product/claude-code)（本地測試 plugin 用）

```bash
# 本地載入 plugin 測試
claude --plugin-dir /path/to/solution-architect-skill

# 網站開發
cd web
npm install
npm run dev          # 熱更新
npm run check        # TypeScript 型別檢查（strict，必須零錯誤）
npm run build        # 離線單檔版 → ../site
npm run build:ssg    # SSG 多頁版 → ../dist
npm run preview:ssg  # 預覽 SSG 產物（照靜態主機規則）
npm run links        # 官方連結檢查（全 repo 的外部連結連連看）
```

## 四條核心慣例

### 1. 一份原始碼，兩個建置目標，兩個都要提交

同一份 `web/` 出兩種東西，用途完全不同，**兩個都是刻意提交的建置產物**：

| 指令 | 輸出 | 路由 | 為什麼要它 |
|------|------|------|------------|
| `npm run build` | `site/index.html`（單一檔） | HashRouter | `/welcome` 用 `file://` 直接開，完全離線、零相依。**這是產品契約** |
| `npm run build:ssg` | `dist/`（每頁一個 HTML） | BrowserRouter | 部署用：乾淨路由、每頁獨立 SEO、爬蟲不用跑 JS 就看得到全文 |

**為什麼不能只留一個**：乾淨路由（`/guides/domains`）在 `file://` 底下會被解析到檔案系統根目錄，
一定壞；所以離線版只能用 hash 路由。反過來，hash 路由的網址搜尋引擎不會當成獨立頁面。
兩個需求互斥，只能出兩份。切換靠 `vite.ssg.config.ts` 裡的 `define`，`src/main.tsx` 據此決定
用哪個 Router、以及要 hydrate 還是重畫。

改了 `web/` 任何東西，**兩個都要重跑再一起提交**。

**新增或修改頁面**：路由、`<title>`、description 全部集中在 `src/routes.tsx` 一個陣列裡。
加一頁就加一列，`<Routes>`、SSG 預先產生、換頁時更新標題三邊會自己跟上，不用改三個地方。

**SSG 的規矩**（違反了會 hydration 失敗）：

- **render 期間不要碰 `document`、`window`、`localStorage`**——伺服器端沒有這些東西。
  要用就放進 `useEffect` 或事件處理器。像亮暗色切換就是用 CSS 的 `dark:` 變體做，不用 React state。
- **不要用 `Math.random()`、`new Date()` 決定畫面**，伺服器和瀏覽器算出來會不一樣。

**預覽 SSG 一定要用 `npm run preview:ssg`，不要用 `vite preview`**。後者是 SPA 模式，
找不到檔案就一律回首頁的 `index.html`，於是 `/guides/domains` 會拿到首頁的 HTML，
然後在瀏覽器 hydrate 失敗——看起來像程式的 bug，其實是預覽方式不對。
`scripts/serve-ssg.mjs` 照真正靜態主機的規則走（目錄找 `index.html`、找不到才回 404）。

**部署設定**（Cloudflare Pages、Netlify 這類）：

```
build command:      cd web && npm ci && npm run build:ssg
build output:       dist
環境變數 SITE_URL:  https://your-domain.tw   ← 設了才會產 sitemap.xml 與絕對網址的 canonical／og:url
```

沒設 `SITE_URL` 也能用，只是 canonical 走相對路徑、不產 `sitemap.xml`。買了網域再補設就好，
程式碼不用改。

### 2. 價格資料三處連動

服務價格有查證日期，改任何一處都要同步另外兩處：

| 位置 | 內容 |
|------|------|
| `skills/architect/references/stack-catalog.md` | 價目表本體＋頁首查證日期 |
| `web/src/pages/`（cost.tsx 的價目陣列、各指南頁的費用段落） | 網頁上的同一批數字 |
| 各頁標注的「查證日期」字樣 | 查證當天的日期 |

### 3. 數字浮動就交給官方連結

免費額度一年改好幾次，**寫死的數字很快就變成錯的**。所以資料頁的寫法是：

- 我們寫**方向與陷阱**——哪裡會撞牆、哪一條是條款不是額度、哪個坑最多人踩。
- **實際數字交給官方連結**，每一列都要附官方定價或說明頁。
- 官方沒公布、或查不到的，**不要硬掰一個數字，也不用寫「查不到」**，直接把人帶到官方連結。

`stack-catalog.md` 的每張表都有「官方頁」欄，`guide-suffixes.tsx` 的每一列都有 `official` 欄位。
新增資料一定要一起補，然後跑 `npm run links` 確認連結是活的。

連結檢查工具在 `tools/check-links.mjs`，它會掃 `web/src`、`skills/` 與根目錄的 md，
把結果分成五類：

| 分類 | 意思 | 要不要處理 |
|------|------|------------|
| 正常 | 直接通 | 不用 |
| 已轉址 | 通了但網址變了 | 看一下——只是語系參數就不用改，真的搬家就換掉 |
| 被擋 | 對方擋機器人（403） | 人工用瀏覽器開一次確認 |
| 死連結 | 404／410 | **要修**，換成官方現行的頁面 |
| 連不上 | 逾時或 DNS 失敗 | **要修**，或整條拿掉 |

死連結和連不上會讓指令回傳非零，可以直接接進 CI。

### 4. 語言與文風

- 全部**正體中文、業務語言**：讀者預設是非工程師。技術名詞第一次出現要有一行白話，
  或收進摺疊區。
- 文字越少越好：導語兩句內、說明能收就收。
- 反 AI 味：不用紫藍漸層、不用置中大標三欄卡模板、不堆詞藻。skill 產出的建議書
  和這個網站本身都適用。

## 提交前檢查

```bash
claude plugin validate . --strict                        # marketplace 定義
claude plugin validate .claude-plugin/plugin.json --strict
claude plugin validate skills --strict                   # skills 結構
cd web && npm run check                                  # 型別檢查（strict，零錯誤）
npm run build && npm run build:ssg                       # 兩個建置目標，site/ 與 dist/ 都要一起提交
npm run links                                            # 官方連結：死連結和連不上要是 0
```

## 回報問題

開 issue 時請附：你想做什麼、實際發生什麼、`claude --version`。
價格過期也算 bug——附上官網連結一起回報最好。
