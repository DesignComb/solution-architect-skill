# 生態資源索引（我們是目錄，不重造輪子）

> 查證日期 2026-08-24。用途：階段 3 寫建議書時，從這裡挑出**跟專案相關**的資源填入「開工資源」節；
> 建議書交付後的「下一步選單」也從這裡取材。原則：**官方的先用**；連結供人點閱，AI 引用前不需重新驗證，
> 但重大依賴（金流、開司）建議提醒使用者確認最新狀態。

## 分工原則（寫進建議書、也用來引導使用者）

**使用者只做三種事：辦帳號、產一次金鑰、跳出視窗時按同意。其餘全部由 AI 用 CLI／MCP 代勞**——
建表、設定、部署、串接，不要叫使用者去後台摸索。核心原則就一句：「一次憑證、其餘全自動」。

| 裝這個 CLI | AI 就能代勞（舉例） |
|------------|---------------------|
| `gh`（GitHub） | 開 repo、每日存檔、設 repo secrets、發版本 |
| `wrangler`（Cloudflare） | 部署 Pages/Workers、綁網域、設環境變數 |
| `supabase` | 建表、跑 migration、設 RLS 權限——使用者不用開後台 |
| `stripe` | 建商品價格、本機模擬 webhook 測付款流程 |
| `vercel` | 部署預覽、綁網域、設環境變數 |
| `aws` / `gcloud` | 僅在公司已用該雲時；一般專案不建議引入 |

金鑰安全（不可妥協）：**金鑰只進 `.env`（並確認在 `.gitignore` 裡）或平台的 secret 設定，絕不進 repo**；
一旦外洩（推上公開 repo）立即作廢重發（rotate），不是刪掉 commit 就沒事。

## 資源目錄

### Skill 生態
| 資源 | 是什麼 | 連結 |
|------|--------|------|
| anthropics/skills | 官方 skill 儲存庫：規範、範本、現成技能 | github.com/anthropics/skills |
| 官方 plugin 目錄 | Claude Code 內建 marketplace（`/plugin`） | github.com/anthropics/claude-plugins-official |

### 金流
| 資源 | 是什麼 | 連結 |
|------|--------|------|
| **ECPay-API-Skill**（綠界官方） | AI 照官方範例寫金流/發票/物流串接，含測試帳號、134 個驗證範例；台灣收款必列 | github.com/ECPay/ECPay-API-Skill |
| 綠界官方 SDK | 各語言官方 SDK；Node 用社群 simenkid/node-ecpay-aio | github.com/ECPay |
| paid-tw/skills | 社群台灣金流 skills：藍新可用、綠界/PAYUNi 開發中 | github.com/paid-tw/skills |
| Stripe MCP＋stripe/ai（官方） | `claude mcp add` 一行接上；建商品、退款、查文件 | docs.stripe.com/mcp ・ github.com/stripe/ai |
| LINE Pay Online API | 直接串的官方文件（多數專案透過綠界/藍新間接串即可） | developers-pay.line.me/online-api-v3 |

### 海外收款路線（費用 2026-08 查證）
- **代收平台（推薦起步）**：Paddle 5%＋US$0.50 全包（含全球銷售稅；台灣可申請、限 SaaS/數位、需過審）；
  Lemon Squeezy 同價另有加成，已被 Stripe 收購、屬過渡期產品。
- **美國公司＋Stripe（量大再走）**：Stripe Atlas 一次性 US$500（Delaware 公司＋EIN＋首年代理人＋US$2,500 Stripe 抵用）；
  每年約 US$400–2,300（代理人 $100＋Delaware 州稅：LLC $300／C-Corp $175 起＋年報 $50＋報稅代辦 $300–2,000）；
  交易 2.9%＋$0.30。替代開司：doola（$297/年起＋州費，含報稅套餐 $1,999/年）、Firstbase（設立 $99 起，代理人 $299/年）。
  **評估門檻：月營收穩定 US$3,000–5,000 再認真算**；稅務一律建議找懂美台兩地的會計師。

### 基礎設施
| 資源 | 是什麼 | 連結 |
|------|--------|------|
| Supabase MCP（官方） | AI 管資料表、查詢、日誌；有雲端端點 | github.com/supabase/mcp |
| Cloudflare MCP（官方） | 部署/DNS/防護，16 個領域 server | github.com/cloudflare/mcp-server-cloudflare |
| GitHub MCP（官方） | repo/issue/PR/Actions | github.com/github/github-mcp-server |
| Sentry MCP（官方） | AI 直接拉錯誤報告、根因分析 | github.com/getsentry/sentry-mcp |

### 前端／測試／文件
| 資源 | 是什麼 | 連結 |
|------|--------|------|
| shadcn/ui＋官方 MCP | 「俐落」風格元件庫；AI 一句話裝元件 | ui.shadcn.com/docs/mcp |
| Playwright MCP（Microsoft 官方） | AI 操作瀏覽器做端對端測試 | github.com/microsoft/playwright-mcp |
| Context7 | 即時餵最新官方文件給 AI，防過時記憶 | github.com/upstash/context7 |

### 通知／APP
| 資源 | 是什麼 | 連結 |
|------|--------|------|
| LINE 官方 MCP | AI 操作 LINE 官方帳號：推播、查用戶、Rich Menu | github.com/line/line-bot-mcp-server |
| LINE Messaging API 文件 | LINE bot 的權威入口 | developers.line.biz/en/docs/messaging-api/overview/ |
| Expo／Capacitor 文件 | 跨平台 APP 兩條路的官方入口 | docs.expo.dev ・ capacitorjs.com/docs |

## 預裝包（藍圖確定後，主動提議幫使用者裝；2026-08-24 實查星數）

| 包 | 內容 | 給誰 |
|----|------|------|
| **基本包（全部專案）** | anthropics/skills（官方文件產出：Word/簡報/Excel/PDF，171k★）＋ obra/superpowers（紀律化開發方法：計畫、除錯、TDD，277k★） | 所有專案 |
| **規格包** | github/spec-kit（規格驅動流程指令，131k★）；更重型的 BMAD-METHOD（52k★）只推給中大型專案 | 會長期迭代的產品 |
| **測試包** | lackeyjb/playwright-skill（AI 開瀏覽器實測，3k★）＋ microsoft/playwright-mcp | 有前端頁面的 |
| **安全包** | anthropics/claude-code-security-review（官方安全掃描，6k★）；Claude Code 內建 /security-review | 收個資或金流的一律必裝 |
| **台灣收款包** | ECPay-API-Skill＋LINE 官方 MCP（見上） | 台灣收款 |
| **行銷包** | coreyhaines31/marketingskills（49 個行銷技能：文案/SEO/CRO，45k★） | 電商、內容站 |
| **補盲區** | wshobson/agents（領域專家子代理市集，39k★）、davila7/claude-code-templates（模板瀏覽入口，30k★） | 需要時再裝 |

## 方法論（訪談與建議書的預設立場）

- **SDD 規格驅動＝必做**：藍圖/需求單就是規格；開工時明說「照這份做，改規格先改文件」。
- **TDD＝核心功能選做**：錢、權限、關鍵計算——先叫 AI 寫測試（確認會失敗）再實作，防 AI 自我作弊。
- **DDD＝只取兩招**：統一業務命名、規則集中一處。完整 DDD 對小產品是過度設計，不要推。

## 上線與維護（寫進建議書）

- **上線定義＝10 項清單全勾**（HTTPS 自動續期／備份且還原過／錯誤追蹤／金鑰輪換／金流三路測試／回滾一頁／具名負責人／隱私頁＋安全回報信箱／掛站監測／帳單上限）。來源：Google SRE、Stripe go-live、OWASP、Backblaze。
- **維護節奏**：週 15 分（錯誤/掛站/用量）、月 1 小時（帳單/安全更新/備份確認）、季半天（還原演練/金鑰輪換/權限清理）。
- **退場條款**：上線時就寫「連續 N 月低於 X 人或年維護成本超過 Y → 90 天內退場」；收法：提前通知、資料匯出、退款、刪個資、關金鑰。
- **個資法**：收個資要告知（第 8 條）、外洩要通報（第 12 條，朝 72 小時制）——一律註明請洽法律專業。
- What'Sub 教訓：一人維運要誠實寫進藍圖、資料流向要交代、留安全回報信箱、AI 類產品先算單位成本再定價。

## 建議書交付後的「下一步選單」（skill 行為）

藍圖寫完、給完三句話摘要後，**主動列出 3 個現在就能幫使用者做的事**（依專案挑），例如：

1. 「要不要我現在就把需要的工具裝好？（gh、supabase、wrangler…）」
2. 「要不要我現在就把專案骨架開起來、接上資料庫？」——走分工原則：他辦帳號產金鑰，其餘你做
3. 「要收台灣的錢的話，我可以先幫你裝綠界官方的 ECPay-API-Skill」

讓使用者知道：**規劃不是終點，下一步他只要說「好」**。
