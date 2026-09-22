# 服務目錄與價目表（stack catalog）

> **查證日期：2026-08-24**（平台預設網址一節為 2026-09-01）。以各服務官網與新聞來源逐項查證。
> **價格與額度會浮動**，所以每一列都附「官方頁」——本表只寫方向與陷阱（哪裡會撞牆、哪一條是條款不是額度），
> 要下決定前點官方頁看當天的內容。查不到的數字**不要硬掰一個**，直接把人帶到官方連結就好。
> 官方連結會爛掉，跑 `npm run links`（tools/check-links.mjs）定期檢查全站的外部連結。
> 費率原則：美元服務標 US$，台灣在地服務標 NT$（多為未稅價，結算另加 5% 營業稅）。

## 起步組合（預設拿這套，再按需求增減）

| 服務 | 角色 | 起步費用 |
|------|------|----------|
| Claude Pro | AI 開發助手 | US$20/月（整套裡唯一固定月費） |
| GitHub | 版本控制 | 免費 |
| Cloudflare Pages（或 Vercel） | 部署 | 免費 |
| Supabase | 資料庫＋登入＋檔案 | 免費 |
| 網域 .com | 你的網址 | ≈US$10–15/年 |
| Cloudflare | DNS／CDN／防護 | 免費 |
| Resend | 寄 Email | 免費 |
| PostHog | 分析 | 免費 |
| Sentry | 錯誤追蹤 | 免費 |

**固定月費合計 ≈ US$20**（就是 AI 助手的訂閱；不用 AI 就是 $0）＋網域一年 US$10–15。

---

## 全球服務目錄

### AI 開發助手
| 服務 | 免費額度 | 付費入門 | 什麼時候付 | 官方頁 |
|------|----------|----------|------------|--------|
| Claude Pro | 免費版跑不動 Claude Code | US$20/月（年繳約 $17/月） | 決定用 AI 寫程式的那天起；額度撞牆（每週被鎖好幾次）才升 Max US$100/月 | https://claude.com/pricing |

### 版本控制
| 服務 | 免費額度 | 付費入門 | 什麼時候付 | 官方頁 |
|------|----------|----------|------------|--------|
| GitHub | 公私 repo 無限；私有 repo CI 2,000 分鐘/月 | Team US$4/人/月 | 個人與小團隊幾乎永遠免費 | https://github.com/pricing |

### 部署
| 服務 | 免費額度 | 付費入門 | 什麼時候付／注意 | 官方頁 |
|------|----------|----------|------------------|--------|
| Cloudflare Pages＋Workers | Pages：500 build/月、**頻寬不限量、允許商用**；Workers：10 萬次請求/日 | Workers Paid US$5/月 | API 日請求破 10 萬、或單次運算超過 10ms CPU。免費層最大方的部署平台 | https://developers.cloudflare.com/pages/platform/limits/ |
| Vercel | Hobby：100GB 頻寬/月，**限個人非商業** | Pro US$20/席/月 | 產品商業化就必須升 Pro（條款，不是額度）——Next.js 體驗最好，但要把這條算進成本 | https://vercel.com/docs/limits/fair-use-guidelines |
| Netlify | 新帳號改點數制：每月一包點數，部署／流量／請求共用，很快見底 | US$9/月 | 2025/9 改制、2026/4 又調過費率，同樣點數撐得比以前短；新專案建議 Cloudflare Pages | https://www.netlify.com/pricing/ |

### 平台送的預設網址（查證 2026-09-01）
部署完就有、免費、可直接分享；**前半段自己取，後半段是平台的**。判準一條：**有第三個人會憑這個網址對你形成印象，就該換成自己的網域。**

| 服務 | 預設網址 | 免費層能綁自訂網域 | 免費層能不能商用 | 官方頁 |
|------|----------|--------------------|------------------|--------|
| Cloudflare Pages | 專案.pages.dev | 可以，每專案數十組 | 條款沒有明文禁止 | https://developers.cloudflare.com/pages/platform/limits/ |
| Cloudflare Workers | 名稱.帳號.workers.dev | 可以 | 條款沒有明文禁止，但官方明說「不適合關乎商務營運」 | https://developers.cloudflare.com/workers/platform/pricing/ |
| Vercel | 專案.vercel.app | 可以，數十組 | **條款禁止**（限個人非商業；綁自訂網域也不解禁） | https://vercel.com/docs/limits/fair-use-guidelines |
| Netlify | 站名.netlify.app | 可以，含免費 SSL | 可以（官方明講免費層可放商業專案） | https://www.netlify.com/pricing/ |
| GitHub Pages | 帳號.github.io | 可以，附免費 HTTPS | **條款禁止**（不可經營線上生意、不可處理密碼與信用卡號） | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits |
| Firebase Hosting | 專案.web.app／.firebaseapp.com | 可以，自動配 SSL | 可以 | https://firebase.google.com/pricing |
| Railway | 服務.up.railway.app | 可以 | 可以 | https://railway.com/pricing |
| Render | 服務.onrender.com | 可以，免費就含幾組 | 官方自己勸別拿免費層跑正式服務 | https://render.com/docs/free |
| Fly.io | 應用.fly.dev | 可以 | 可以（但已無免費層） | https://fly.io/docs/about/pricing/ |
| Zeabur | 專案.zeabur.app | **不行**，要升級 | 條款沒有明文禁止，但會自動休眠 | https://zeabur.com/pricing |
| Supabase | 亂碼.supabase.co | **不行**，要另外加購 | 條款沒有明文禁止 | https://supabase.com/pricing |
| Hetzner VPS | 無，自己買網域 | — | — | https://www.hetzner.com/cloud |

**四個要講給使用者聽的重點**：
- **額度夠用 ≠ 可以商用**。Vercel Hobby 與 GitHub Pages 是條款層面禁止，換網域不解禁，要商業化只能升級付費。
- **預設網域收不了信**。netlify.app／vercel.app／github.io／pages.dev 都沒有 MX 紀錄，`hello@你的名字.netlify.app` 這種信箱不存在，也加不了 SPF／DKIM。
- **搬家等於全部歸零**。換平台舊網址整串作廢：既有連結、印好的 QR Code、搜尋排名一次沒了。
- **它是借的不是你的**。Netlify 使用條款寫明違規「可能導致未經通知即終止並移除你的網站專案」。

完整的 67 條後綴對照（含 AI 建站、開店平台、臨時分享、已停用的舊後綴，每列都附官方頁），見教學網站 /guides/suffixes；概念課見 /guides/domains。

### 後端／資料庫（BaaS）
| 服務 | 免費額度 | 付費入門 | 什麼時候付／注意 | 官方頁 |
|------|----------|----------|------------------|--------|
| Supabase | 500MB DB、1GB 檔案、50,000 MAU、限 2 專案；**閒置 7 天會暫停** | Pro US$25/月（8GB DB、日備份、不暫停） | DB 逼近 500MB、不能容忍閒置暫停、要每日備份——任一出現就付。閒置暫停是 demo 當機的常見雷 | https://supabase.com/pricing |
| Neon | 0.5GB、100 CU-hours/月；閒置 5 分鐘休眠 | 純用量計費，無月費下限 | 只要資料庫不要整套 BaaS 時的選擇；branch 功能適合「每個 PR 一個測試庫」 | https://neon.com/pricing |
| Firebase | Firestore 1GiB、5 萬讀/日；Auth 約 50K MAU | Blaze 純用量 | Blaze 無支出上限、寫壞查詢會爆帳單；NoSQL 資料模型的供應商鎖定是長期成本。預設仍推 Supabase（標準 Postgres 好搬家） | https://firebase.google.com/pricing |

### 伺服器託管（有長駐後端／Python 服務才需要）
| 服務 | 免費額度 | 付費入門 | 什麼時候付／注意 | 官方頁 |
|------|----------|----------|------------------|--------|
| Railway | 30 天試用（一次性 US$5 額度）後轉 Free 方案：每月僅 US$1 額度，只夠極小服務 | Hobby US$5/月（含 $5 用量） | 體驗最好的「第一台正式後端」；正式產品實質上要付 $5/月起，用量制、流量大會超過 | https://railway.com/pricing |
| Render | 免費 web service 會休眠（閒置十幾分鐘，喚醒約 1 分鐘）；2026/4 大砍免費層流量 | Starter US$7/月（不休眠） | 免費層做 demo 可以；正式產品幾乎一定要 $7。2025 年以前的流量數字已全部過期 | https://render.com/docs/free |
| Fly.io | **無免費層**（2024/10 起） | 最小機約 US$2/月起，實際常 $5–25 | 選它的理由是多區域低延遲，不是省錢 | https://fly.io/docs/about/pricing/ |
| Hetzner VPS | 無 | CX22 €3.79/月（2vCPU/4GB/20TB 流量） | 性價比之王，但維運全自己來；只推薦給「被要求自管」或熟 Linux 的人，搭 Coolify/Dokploy 可接近 PaaS 體驗 | https://www.hetzner.com/cloud |

### 網域
| 服務 | 價格 | 注意 | 官方頁 |
|------|------|------|--------|
| Cloudflare Registrar | .com ≈US$10.44/年，**註冊價＝續約價** | 成本價無加價；須用 Cloudflare DNS | https://www.cloudflare.com/products/registrar/ |
| Namecheap | .com 首年 ≈US$11（促銷 $7 內），**續約 $14.78** | 首年便宜續約貴是註冊商常態；比價要看續約價 | https://www.namecheap.com/domains/ |

### DNS／CDN
| 服務 | 免費額度 | 什麼時候付 | 官方頁 |
|------|----------|------------|--------|
| Cloudflare Free | DNS、CDN 頻寬不計量、DDoS 防護、SSL | 多數產品永遠不用付（Pro US$20/月是進階 WAF/圖片最佳化） | https://www.cloudflare.com/plans/ |

### 身份驗證
| 服務 | 免費額度 | 付費入門 | 選擇邏輯 | 官方頁 |
|------|----------|----------|----------|--------|
| Supabase Auth | 隨 Supabase 免費 50K MAU | 隨 Pro US$25/月 | **已用 Supabase 就用它**，零邊際成本；UI 要自己組 | https://supabase.com/pricing |
| Clerk | 50,000 MRU（2026/2 改制，比舊的 10K MAU 大方；網路舊文章數字已過時） | Pro US$25/月 | 要開箱即用的漂亮登入 UI、React/Next 生態才另加 Clerk | https://clerk.com/pricing |
| Auth0 | 25K MAU | Essentials US$35/月起，**付費斷崖陡** | 企業 SSO/SAML 需求才碰；預算敏感勿選 | https://auth0.com/pricing |

### Email（交易信：驗證碼、收據、通知）
| 服務 | 免費額度 | 付費入門 | 注意 | 官方頁 |
|------|----------|----------|------|--------|
| Resend | 3,000 封/月、**每日上限 100 封**、1 網域 | Pro US$20/月（5 萬封） | 每日 100 封比月額度更早撞到；行銷群發不適用 | https://resend.com/pricing |
| Brevo | 每日 300 封（約 9,000/月），帶 Brevo 標誌 | US$9/月起 | 要發電子報（行銷信）時的免費層選擇 | https://www.brevo.com/pricing/ |

### 金流（全球；台灣收款見台灣區段）
| 服務 | 費率 | 注意 | 官方頁 |
|------|------|------|--------|
| Stripe | 無月費；美國線上刷卡 2.9%＋US$0.30/筆 | **台灣尚未開放本地商家收款**。繞道＝美國公司＋Stripe：Atlas 一次性 US$500（Delaware 公司＋EIN＋首年代理人），每年另有代理人 $100＋州稅（LLC $300／C-Corp $175 起＋年報 $50）＋報稅代辦 $300–2,000；月營收穩定 US$3,000–5,000 再認真評估。替代開司：doola、Firstbase。資源與細節見 skill-index.md | https://stripe.com/pricing ／ https://stripe.com/atlas |
| Paddle / Lemon Squeezy | 5%＋US$0.50/筆（LS 另有跨國卡、訂閱加成） | MoR（代收）模式：不用開公司，平台代處理全球銷售稅；限 SaaS/數位商品、需過審，台灣可申請。海外收款的**推薦起步路線**。注意 LS 已被 Stripe 收購、屬過渡期產品 | https://www.paddle.com/pricing ／ https://www.lemonsqueezy.com/pricing |

### 分析
| 服務 | 免費額度 | 注意 | 官方頁 |
|------|----------|------|--------|
| PostHog | 100 萬事件/月＋5K session replay＋feature flags | 官方稱 97% 公司停在免費額度內；identified event 較貴是帳單暴衝主因 | https://posthog.com/pricing |
| GA4 | 免費 | 代價是資料歸 Google＋介面複雜；跟廣告投放深度綁定才必要 | https://marketingplatform.google.com/about/analytics/ |
| Plausible | 無免費層（30 天試用） | US$9/月起；隱私友善、不用 cookie 橫幅。預算零就自架或用 PostHog | https://plausible.io/ |

### 錯誤追蹤
| 服務 | 免費額度 | 什麼時候付 | 官方頁 |
|------|----------|------------|--------|
| Sentry | 5,000 errors/月、**只有 1 個席次** | 第二個工程師要看錯誤、或一次事故燒完額度時（Team US$26/月）。上線前設好 rate limit，一個迴圈錯誤可能一天噴掉整月額度 | https://sentry.io/pricing/ |

### 快取
| 服務 | 免費額度 | 注意 | 官方頁 |
|------|----------|------|--------|
| Upstash Redis | 50 萬指令/月、256MB | 多數專案根本用不到 Redis；先確認 Postgres 不夠再加 | https://upstash.com/pricing |

### 向量資料庫（AI／語意搜尋）
| 服務 | 免費額度 | 選擇邏輯 | 官方頁 |
|------|----------|----------|--------|
| pgvector | 隨 Supabase 免費內建 | **預設答案**：零新增零件、可跟業務資料 join；千萬級向量以下都夠 | https://supabase.com/docs/guides/database/extensions/pgvector |
| Pinecone | 2GB、5 indexes | 付費直接跳 US$50/月最低承諾，斷崖陡；真的超大規模才考慮 | https://www.pinecone.io/pricing/ |

### 檔案儲存
| 服務 | 免費額度 | 注意 | 官方頁 |
|------|----------|------|--------|
| Cloudflare R2 | 10GB；**對外流量永遠 $0** | 「檔案會被大量下載」的場景碾壓 S3（S3 出站約 $0.09/GB）；S3 新帳號已無傳統免費層 | https://developers.cloudflare.com/r2/pricing/ |
| Supabase Storage | 隨免費層 1GB | 小量附件直接用它，少一個零件 | https://supabase.com/pricing |
| Cloudinary | 25 credits/月（轉換/儲存/頻寬三合一共用池） | 付費跳 US$99/月斷崖陡；先確認 R2＋Cloudflare 圖片轉換不能替代再付 | https://cloudinary.com/pricing |

---

## 台灣在地補充包

### 金流（收台灣消費者的錢）
| 服務 | 固定成本 | 費率 | 注意 | 官方頁 |
|------|----------|------|------|--------|
| 綠界 ECPay（一般賣家） | **無月費/年費**，申請免費 | 國內刷卡 2.75%（每筆最低 NT$5＋訂單處理費 NT$1）；ATM 1%；超商代碼 NT$31/筆 | 個人賣家可申請（30 天收款上限 NT$20 萬）；撥款約 T+10；費率未稅。台灣起步預設選項 | https://www.ecpay.com.tw/ |
| 綠界（特約賣家） | 設定費 NT$5,000＋年費 NT$13,000/年起 | 刷卡可議至 ≈1.85% | 月營收穩定 20–30 萬以上再升，省的手續費才蓋得過年費 | https://www.ecpay.com.tw/ |
| 藍新 NewebPay | 無月費/年費 | 刷卡 ≈2.8%/筆；提領 NT$10/筆（月前 5 次免費） | 綠界的主要替代；同集團 ezPay 發票整合順 | https://www.newebpay.com/website/Page/content/rate |
| TapPay | 年費 ≈NT$5,900 起（業務報價制） | 刷卡 ≈2.5–3.1% | 要原生 Apple Pay/Google Pay 體驗或量大簽特店才選；個人不適合 | https://www.tappaysdk.com/ |
| LINE Pay | 無申請費/年費 | 一律 3%（未稅） | 客群是 LINE 重度使用者時提高轉換率用 | https://pay.line.me/portal/tw/main |

### 電子發票
| 重點 | 內容 | 官方頁 |
|------|------|--------|
| 誰需要 | **只有營業人（有統編）需要也才能開**。個人賣家（無統編）不能也不需要開統一發票——個人 vs 公司的關鍵差別 | https://www.einvoice.nat.gov.tw/ |
| 綠界發票 | 設定費 NT$3,600（未稅）；年費 5,000 張/年 NT$3,600 起（新戶限時優惠首年服務費 0 元，設定費照收） | https://www.ecpay.com.tw/ |
| ezPay（藍新） | 設定費約 NT$3,000（合作通路常免收）；服務費約 NT$6,000/年起 | https://www.ezpay.com.tw/ |
| 紅線 | 發票義務、營業登記門檻——建議書一律寫「請洽會計師確認」，不要用猜的 | https://www.etax.nat.gov.tw/ |

### 簡訊（OTP、到貨通知）
| 服務 | 價格 | 注意 | 官方頁 |
|------|------|------|--------|
| 三竹 Mitake（或 every8d） | NT$0.7–1.3/封（儲值制、量大級距） | 台灣市場預設選項；送達才計費。every8d 官網近期連不上，優先用三竹 | https://www.mitake.com.tw/ |
| Twilio | 發台灣 ≈US$0.084/封（≈NT$2.6，貴 3 倍） | 只有多國產品才選 | https://www.twilio.com/en-us/sms/pricing/tw |
| 省錢原則 | 能用 LINE 或 Email 通知就不要用簡訊 | | |

### LINE 生態（台灣的通知／登入基礎設施）
| 項目 | 費用 | 重點 | 官方頁 |
|------|------|------|--------|
| LINE Login / LIFF / Messaging API 本體 | **完全免費** | 台灣產品「以 LINE 為入口」的標配 | https://developers.line.biz/en/docs/liff/overview/ |
| LINE 官方帳號：輕用量 | NT$0/月，含 200 則**主動推播**/月 | **回覆型訊息、自動回應不計費、不限量**——設計成「使用者先開口」可大幅省錢 | https://tw.linebiz.com/service/account-solutions/line-official-account/ |
| 中用量 | NT$800/月，含 3,000 則 | 輕/中用量超額**不能加購**，只能等下個月 | https://tw.linebiz.com/service/account-solutions/line-official-account/ |
| 高用量 | NT$1,200/月，含 6,000 則；超額 ≈NT$0.2/則起 | 方案 2026 已改版，網路舊文數字（4,000 元/25,000 則）已過時 | https://tw.linebiz.com/service/account-solutions/line-official-account/ |
| 架構含義 | 「要推播通知」的台灣產品，第一選項是 LINE OA＋Messaging API，**不是做 APP** | 常直接改變 Web/PWA/APP 判定，記得回頭檢查 | |

### 網域 .tw
| 項目 | 價格 | 官方頁 |
|------|------|--------|
| .tw / .com.tw | 行情 NT$550–800/年（戰國策 550、捕夢網 600、遠振 630、PChome 800）；比價看**續約價**（Gandi 首年 709、續約 1,260） | https://rs.twnic.tw/ |

### 物流（實體商品超商取貨）
| 服務 | 價格 | 注意 | 官方頁 |
|------|------|------|--------|
| 綠界物流 | C2C 店到店：7-11/全家 NT$65/件、萊爾富 NT$55/件；取貨付款代收 0.75%（最低 NT$3） | 金流＋發票＋物流一站式做完最省事；B2C 寄倉 NT$55/件需驗標 | https://www.ecpay.com.tw/ |
| ezShip | 店到店 ≈NT$60/件；取貨付款需商務會員 NT$1,200/年 | 常被開店平台整合 | https://www.ezship.com.tw/ |

---

## 做 APP 才有的固定成本

| 項目 | 費用 | 官方頁 |
|------|------|--------|
| Apple Developer Program | US$99/年（不繳 App 就下架） | https://developer.apple.com/support/compare-memberships/ |
| Google Play | US$25 一次性；**新個人帳號須先通過封閉測試（12 名測試者、14 天）才能上正式版** | https://support.google.com/googleplay/android-developer/answer/6112435 |
| 商店抽成 | Apple：小型企業計畫 15%（前一年實收 ≤US$100 萬），否則 30%（訂閱滿一年降 15%）；Google Play：年收前 100 萬 15% | https://developer.apple.com/app-store/small-business-program/ |
| 隱形成本 | 審查 24–48 小時起、被拒重送、每次更新重新上架；App Store 指南 4.2 拒收「純網頁包殼」 | https://developer.apple.com/app-store/review/guidelines/ |

## 成本速查（起步期每月固定支出）

| 情境 | 固定月費 | 另計 |
|------|----------|------|
| 靜態官網 | US$0（不用 AI 助手）～20 | 網域 US$10–15/年 |
| 標準 Web 應用（表單/清單/登入） | US$20（=Claude Pro） | 網域 |
| 台灣收款的網站 | US$20 | 網域＋交易抽成 2.75–3%＋（公司行號）發票服務 NT$3,600 起/年 |
| 加一台 Python 後端 | US$25–27（＋Railway $5 或 Render $7） | 網域 |
| 要上架的 APP | US$20＋Apple US$99/年 | Play US$25 一次；商店抽成 15% |
