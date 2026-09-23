# Solution Architect — 先想清楚，再動手做

[![CI](https://github.com/DesignComb/solution-architect-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/DesignComb/solution-architect-skill/actions/workflows/ci.yml)
[![Deploy](https://github.com/DesignComb/solution-architect-skill/actions/workflows/deploy.yml/badge.svg)](https://github.com/DesignComb/solution-architect-skill/actions/workflows/deploy.yml)
[![教學網站](https://img.shields.io/badge/教學網站-線上版-2ea44f)](https://sas.dco.tw/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 🌐 **線上教學網站:<https://sas.dco.tw/>**

一個通用的 Claude Code plugin：在你動手做任何網站、系統或 APP **之前**，
用一步一步的業務語言訪談，幫你走完——

**問出需求 → 盤點資源 → 產出架構建議書**

它會誠實回答四個問題：

1. **需不需要寫程式？**（很多需求用現成服務就解決了）
2. **需不需要 APP？**（預設答案是 Web，除非證據指向必要）
3. **前後端怎麼選？**（熟的贏過潮的、零件越少越好）
4. **每個月花多少錢？**（給數字，不說「很便宜」）

適合任何人：非工程師、剛入行的開發者、想做 side project 的上班族。
不是創業框架——目標只是讓每個人都站在最合理、最正確的產品線上。

**定位：我們是目錄、是引導、是 index。** 實作不自己重做——金流有綠界的
SDK 與 Stripe 官方工具、資料庫有 Supabase 官方整合、各領域都有成熟的
skill／MCP。這個 plugin 負責問對問題、做對決定，然後把你帶到對的門口
（見 `references/skill-index.md` 與教學網站的「工具與 skill 索引」）。

## 安裝

**方式一：從 GitHub 安裝**（repo 內建 marketplace 定義）——在 Claude Code 裡：

```
/plugin marketplace add DesignComb/solution-architect-skill
/plugin install solution-architect@solution-architect-skill
```

**方式二：本地開發／試用**——把 repo clone 下來，啟動時掛上：

```bash
claude --plugin-dir /path/to/solution-architect-skill
```

## 使用

| 指令 | 做什麼 |
|------|--------|
| `/solution-architect:welcome` | 打開教學網頁（本地離線可用），一段話說明怎麼開始 |
| `/solution-architect:architect` | 主流程：需求訪談 → 資源盤點 → 架構建議書 |

`/architect` 的產出是三份文件，存在你目前資料夾的 `solution/` 底下：

```
solution/
├── 01-requirements.md   # 需求摘要（給誰用、什麼形態、要不要推播/硬體/金流）
├── 02-resources.md      # 資源盤點（人、錢、時間、已有的東西、維運底線）
└── 03-blueprint.md      # 架構建議書（選型＋理由、服務清單、成本表、刻意不做清單、路線圖）
```

三份文件就是存檔點——中途離開，下次再跑 `/architect` 會從斷點接續。
建議書寫好後，可以直接拿去給 Claude Code 開工，或拿去跟外包、工程師溝通。

## 教學網頁

**線上版：<https://sas.dco.tw/>**——推上 `main` 由 GitHub Actions 用 wrangler 自動部署到 Cloudflare。也能完全離線用：`/welcome` 會用 `file://` 直接開
打包好的 `site/index.html`，不必裝 Node.js。

教學網站用 **React＋Tailwind＋shadcn/ui** 打造——它本身就是這個 skill
「俐落風格」建議組合的活範例。原始碼在 `web/`，建置產物輸出到 `site/`
（打開 `site/index.html` 即可離線瀏覽，`/welcome` 會幫你開）。

```bash
cd web
npm install     # 第一次（Node.js ≥ 20.19）
npm run dev     # 開發（熱更新）
npm run check   # TypeScript 型別檢查（strict）
npm run build   # 建置 → 輸出到 ../site
```

> `site/index.html` 是**刻意提交的建置產物**——`/welcome` 直接開它，使用者
> 不需要裝 Node.js。改了 `web/` 之後必須重新 `npm run build`，讓兩者保持同步。

- **首頁**：五個問題的入口＋三步驟方法＋兩條路。
- **五個問題各一頁**：要寫程式嗎／要 APP 嗎（互動測驗）／用什麼做／長什麼樣子（風格試衣間）／花多少錢（成本試算機）。
- **心法**：上線節奏、八個觀念、六條紅線。
- **書架二十七本，分五排**：先看懂（軟體怎麼運作、跟 AI 一起做、資安基本功）、
  小教室（十二堂開工後會卡住的概念課：兩把鑰匙、倉庫的門禁、倉庫的施工紀錄、登入之後、
  借別人的櫃台、誰在敲門、樣品屋與真店面、改了怎麼沒變、網址是誰給的、地圖還沒更新、網站塞車的時候、AI 為什麼會忘記）、
  做出來（工具索引、串接、風格細節）、開門做生意（金流、APP 上架、上線與維護、賣出去）、
  隨手查（服務價目總表、情境配方、指令範本、名詞小抄、網址後綴對照表——查表用的工具書）。
- **開始規劃（/plan）**：表單精靈，一次一題，填完當場產出需求單 Markdown——
  **不裝 skill 也能用**，複製貼給任何 AI（不限 Claude）就能開工。

## 設計原則

- **業務語言訪談**：一次一兩題，不把技術名詞丟給使用者裁決。
- **Web 優先**：APP 要有證據（背景定位、藍牙/NFC、商店上架…）才成立。
- **風格三選一**：俐落／雜誌／溫暖三套外觀預設集，讓每個產品不要長出同一張「AI 臉」。
- **誠實**：該用現成服務就說、過度設計就打回、不確定的價格標「以官網為準」。
- **台灣在地**：金流（綠界/藍新 vs Stripe）、LINE 通知、電子發票都在目錄裡。
- **價格會過期**：`stack-catalog.md` 標注查證日期；skill 產建議書時會抽查付費項目的最新價格。

## 專案結構

```
.claude-plugin/
├── plugin.json                   # plugin 定義
└── marketplace.json              # marketplace 定義（讓人直接從 GitHub 安裝）
skills/
├── welcome/SKILL.md              # 打開教學網頁＋導覽
└── architect/
    ├── SKILL.md                  # 主流程（三階段）
    └── references/
        ├── interview.md          # 階段 1 題庫：需求訪談
        ├── inventory.md          # 階段 2 題庫：資源盤點
        ├── decision-guide.md     # 階段 3 判斷流程（第 0/1/2 關）
        ├── glossary.md           # 白話對照表（技術名詞怎麼講給非工程師聽）
        ├── style-presets.md      # 外觀風格預設集（俐落/雜誌/溫暖＋反 AI 味清單）
        ├── stack-catalog.md      # 服務目錄與價目（全球＋台灣＋海外路線）
        ├── skill-index.md        # 生態資源索引＋AI 代勞分工（我們是目錄）
        └── blueprint-template.md # 架構建議書模板
web/                              # 網站原始碼（React＋Tailwind＋shadcn/ui＋Vite）
├── src/pages/                    # 首頁、五個問題、心法、書架、規劃精靈、二十七本指南
├── src/components/               # 共用元件與 shadcn ui
└── vite.config.ts                # build 輸出到 ../site
site/                             # 單檔離線建置產物（刻意提交；/welcome 用 file:// 開這裡）
dist/                             # SSG 多頁建置產物（刻意提交；部署用，乾淨路由＋每頁 SEO）
```

## 會發佈什麼、哪些留在本機

這個 repo 有兩種東西容易被誤會成雜訊，先講清楚——它們是**刻意提交的產品的一部分**：

- `site/index.html` — 單檔離線版，`/welcome` 用 `file://` 直接開，使用者不用裝 Node.js。
- `dist/` — SSG 多頁版，部署用（乾淨路由、每頁獨立 SEO）。

兩者都由 `web/` 建置而來。改了 `web/` 就要重跑 `npm run build` 與 `npm run build:ssg`
再一起提交，讓原始碼與產物同步（見 [CONTRIBUTING.md](CONTRIBUTING.md)）。

**只留本機、不進 repo（已由 `.gitignore` 擋掉）：**

- `node_modules/`（約 157 MB）、`.idea/`（WebStorm 專案檔）、`*.tsbuildinfo`
- `.env` / `.env.*`（金鑰絕不進 repo）
- `.claude/settings.local.json`（本機的 Claude Code 權限設定，含本機路徑）
- `Screenshot_*.jpg`（本地參考素材）

## 貢獻

改動前請看 [CONTRIBUTING.md](CONTRIBUTING.md)——特別是「`site/` 是提交的建置產物」
與「價格資料三處連動」這兩條慣例。改完用 `claude plugin validate . --strict` 驗證。

互動請遵守[行為準則](CODE_OF_CONDUCT.md)；回報安全問題請走 [SECURITY.md](SECURITY.md)
的私密通報，不要開公開 issue。

## 第三方授權

`site/` 與 `dist/` 是打包好的建置產物，內含 React、React Router、Radix UI、
lucide-react 等 MIT／ISC／Apache-2.0 套件的程式碼；`web/src/components/ui/`
的元件改寫自 [shadcn/ui](https://ui.shadcn.com)（MIT）。完整清單與授權聲明見
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。

## 授權

[MIT](LICENSE) © DesignComb
