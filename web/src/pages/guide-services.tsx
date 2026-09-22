import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { Layers, Table2, Search, Scale, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHead, Decide, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

const CATS = [
  "全部", "AI 助手", "部署與主機", "資料庫與後端", "網域與信件",
  "金流", "分析與追蹤", "儲存與快取", "台灣在地", "APP 成本",
] as const
type Cat = Exclude<(typeof CATS)[number], "全部">

type Svc = {
  name: string
  cat: Cat
  role: string
  free: string
  pay: string
  payOk?: boolean
  note?: string
}

/* 價格與額度以價目表逐字轉錄，新增或修改請連動更新 */
const SERVICES: Svc[] = [
  {
    name: "Claude Pro", cat: "AI 助手",
    role: "幫你寫程式的 AI 開發助手。",
    free: "免費版跑不動 Claude Code。",
    pay: "US$20/月（年繳約 $17/月），決定用 AI 寫程式的那天起就要付。",
    note: "額度撞牆、每週被鎖好幾次的時候，才升級 Max US$100/月。",
  },
  {
    name: "GitHub", cat: "部署與主機",
    role: "保管程式碼，記住每一次修改。",
    free: "公開與私人專案都不限量；私人專案每月附 2,000 分鐘自動化額度。",
    pay: "個人與小團隊幾乎永遠免費；要多人進階協作才付 Team US$4/人/月。",
    payOk: true,
    note: "用它的 GitHub Pages 發佈網站，預設網址是「你的帳號.github.io」，免費附 HTTPS。但條款寫明不可經營線上生意、不可處理密碼與信用卡號。",
  },
  {
    name: "Cloudflare Pages＋Workers", cat: "部署與主機",
    role: "把做好的網站放上網路。",
    free: "Pages 每月 500 次建置、頻寬不限量、允許商用；Workers 每日 10 萬次請求。",
    pay: "API 日請求破 10 萬、或單次運算超過 10ms CPU，才付 Workers Paid US$5/月。",
    note: "免費層最大方的部署平台，新專案的預設選擇。預設網址是「專案.pages.dev」，Workers 則是「名稱.帳號.workers.dev」；自訂網域每專案 100 組。",
  },
  {
    name: "Vercel", cat: "部署與主機",
    role: "部署平台，Next.js 體驗最好的一家。",
    free: "Hobby 方案每月 100GB 頻寬，限個人非商業使用。",
    pay: "Pro US$20/席/月；產品一商業化就必須升級，這是條款規定，不是額度問題。",
    note: "選它之前，把 Pro 的月費先算進成本。預設網址是「專案.vercel.app」。注意：免費層綁自己的網域也不解禁商用，條款管的是用途不是網址。",
  },
  {
    name: "Netlify", cat: "部署與主機",
    role: "部署平台，免費額度已經縮水。",
    free: "新帳號改成點數制：每月 300 credits，約可換 15GB 頻寬或 20 次部署混用，很快見底。",
    pay: "US$9/月。",
    note: "2025 年 9 月改制後對免費用戶明顯變小氣，新專案建議改用 Cloudflare Pages。預設網址是「站名.netlify.app」，免費層可綁自訂網域、也允許商用；點數扣完所有網站會直接暫停。",
  },
  {
    name: "Railway", cat: "部署與主機",
    role: "放長駐後端程式的主機，上手體驗最好。",
    free: "30 天試用（一次性 US$5 額度）後轉免費方案：每月僅 US$1 額度，只夠極小的服務。",
    pay: "Hobby US$5/月，內含 $5 用量；正式產品實質上要從 $5/月起。",
    note: "用量制，流量大會超過方案內含的額度。預設網址是「服務.up.railway.app」。",
  },
  {
    name: "Render", cat: "部署與主機",
    role: "主機服務，免費層會睡著。",
    free: "免費的網頁服務會休眠：15 分鐘沒流量就睡，喚醒要等約 1 分鐘。",
    pay: "Starter US$7/月就不會休眠；正式產品幾乎一定要付。",
    note: "免費層拿來做展示可以，正式上線不行。預設網址是「服務.onrender.com」，免費含 2 組自訂網域。",
  },
  {
    name: "Fly.io", cat: "部署與主機",
    role: "主打多地區、低延遲的主機。",
    free: "無免費層（2024/10 起）。",
    pay: "最小機器約 US$2/月起，實際常落在 $5–25。",
    note: "選它的理由是多區域低延遲，不是省錢。預設網址是「應用.fly.dev」。",
  },
  {
    name: "Hetzner VPS", cat: "部署與主機",
    role: "整台租給你的虛擬主機，什麼都自己管。",
    free: "無。",
    pay: "CX22 機型 €3.79/月，配 2vCPU、4GB 記憶體、20TB 流量。",
    note: "性價比之王，但維運全部自己來，只推薦給被要求自管或熟 Linux 的人。搭 Coolify 或 Dokploy，可以接近全代管的體驗。它不送預設網址，網域和憑證都要自己準備。",
  },
  {
    name: "Supabase", cat: "資料庫與後端",
    role: "資料庫、登入、檔案空間一次包辦。",
    free: "500MB 資料庫、1GB 檔案、50,000 位月活躍用戶，限 2 個專案。",
    pay: "Pro US$25/月，換到 8GB 資料庫、每日備份、不會被暫停。",
    note: "免費專案閒置 7 天會被暫停，是展示時當機的常見地雷。資料庫逼近 500MB、不能容忍暫停、需要每日備份，任何一項出現就該付費。",
  },
  {
    name: "Neon", cat: "資料庫與後端",
    role: "只要資料庫、不要整套後端時的選擇。",
    free: "0.5GB 儲存、每月 100 CU-hours；閒置 5 分鐘會休眠。",
    pay: "純用量計費，沒有月費下限。",
    note: "分支功能可以幫每一份修改草稿開一個測試資料庫，很適合開發流程。",
  },
  {
    name: "Firebase", cat: "資料庫與後端",
    role: "Google 家的一整套後端服務。",
    free: "Firestore 資料庫 1GiB、每日 5 萬次讀取；登入（Auth）約 50,000 位月活躍用戶。",
    pay: "Blaze 方案純用量計費。",
    note: "Blaze 沒有支出上限，寫壞查詢會爆帳單；資料格式綁定 Google，日後搬家是長期成本。預設仍然推 Supabase，標準資料庫比較好搬家。",
  },
  {
    name: "Supabase Auth", cat: "資料庫與後端",
    role: "會員登入功能，跟著 Supabase 一起附。",
    free: "隨 Supabase 免費層，50,000 位月活躍用戶。",
    pay: "隨 Pro US$25/月一起升級。",
    note: "已經用 Supabase 就用它，多用不花錢；登入畫面要自己組。",
  },
  {
    name: "Clerk", cat: "資料庫與後端",
    role: "開箱即用的漂亮登入畫面。",
    free: "每月 50,000 位活躍用戶（Clerk 的計法叫 MRU）；2026/2 改制後比舊制的 1 萬人大方，網路舊文章的數字已過時。",
    pay: "Pro US$25/月。",
    note: "要現成好看的登入介面、走 React 或 Next 生態，才另外加它。",
  },
  {
    name: "Auth0", cat: "資料庫與後端",
    role: "企業級的登入服務。",
    free: "25,000 位月活躍用戶。",
    pay: "Essentials US$35/月起，付費斷崖陡。",
    note: "有企業單一登入需求才碰；預算敏感就不要選。",
  },
  {
    name: "pgvector", cat: "資料庫與後端",
    role: "AI 語意搜尋用的向量功能，內建在資料庫裡。",
    free: "隨 Supabase 免費內建。",
    pay: "免費，跟著 Supabase 的方案走。",
    payOk: true,
    note: "預設答案：不用多加零件，還能跟業務資料一起查詢；千萬級向量以下都夠用。",
  },
  {
    name: "Pinecone", cat: "資料庫與後端",
    role: "專門存放向量的資料庫。",
    free: "2GB、5 個索引。",
    pay: "付費直接跳 US$50/月的最低承諾，斷崖陡。",
    note: "真的超大規模才需要考慮。",
  },
  {
    name: "Cloudflare Registrar", cat: "網域與信件",
    role: "買網址的地方，成本價不加價。",
    free: "—",
    pay: ".com 約 US$10.44/年，註冊價就是續約價。",
    note: "須搭配 Cloudflare 的網址解析服務使用。",
  },
  {
    name: "Namecheap", cat: "網域與信件",
    role: "買網址的老牌註冊商。",
    free: "—",
    pay: ".com 首年約 US$11，促銷可到 $7 內；續約 $14.78。",
    note: "首年便宜、續約變貴是註冊商常態，比價要看續約價。",
  },
  {
    name: "Cloudflare", cat: "網域與信件",
    role: "網址設定、加速與防護，一次包辦。",
    free: "網址解析（DNS）與加速（CDN）頻寬不計量，附攻擊防護和加密憑證。",
    pay: "多數產品永遠不用付；進階防護與圖片最佳化才需要 Pro US$20/月。",
    payOk: true,
  },
  {
    name: "Resend", cat: "網域與信件",
    role: "讓網站寄出驗證碼、收據這類信件。",
    free: "每月 3,000 封、每日上限 100 封、限 1 個網域。",
    pay: "Pro US$20/月，額度 5 萬封。",
    note: "每日 100 封的上限，通常比月額度更早撞到；行銷群發不適用。",
  },
  {
    name: "Brevo", cat: "網域與信件",
    role: "要發電子報時的免費層選擇。",
    free: "每日 300 封，約 9,000 封/月，信裡帶 Brevo 標誌。",
    pay: "US$9/月起。",
  },
  {
    name: "Stripe", cat: "金流",
    role: "全球最通用的線上收款服務。",
    free: "無月費。",
    pay: "美國線上刷卡 2.9%＋US$0.30/筆。",
    note: "台灣尚未開放本地商家收款。繞道走法是開一間美國公司再接：Atlas 一次性 US$500，包含 Delaware 公司、稅籍編號（EIN）與首年代理人。每年另有代理人 $100 與報稅代辦 $300–2,000；州稅依公司型態不同：有限公司（LLC）$300、股份公司（C-Corp）$175 起，另加年報 $50。月營收穩定 US$3,000–5,000 再認真評估；替代的開公司服務有 doola、Firstbase。",
  },
  {
    name: "Paddle／Lemon Squeezy", cat: "金流",
    role: "平台代收全球款項，不用自己開公司。",
    free: "無月費。",
    pay: "5%＋US$0.50/筆；Lemon Squeezy 另有跨國卡與訂閱加成。",
    note: "平台代收（MoR）模式會代處理全球銷售稅；限軟體訂閱與數位商品、需要過審，台灣可以申請，是海外收款的推薦起步路線。Lemon Squeezy 已被 Stripe 收購，屬過渡期產品。",
  },
  {
    name: "PostHog", cat: "分析與追蹤",
    role: "看有多少人用、怎麼用你的網站。",
    free: "每月 100 萬筆事件，加 5K 次操作錄影與功能開關。",
    pay: "多數用不到付費；官方稱 97% 公司停在免費額度內。",
    payOk: true,
    note: "標記身分的事件（identified event）計價較貴，是帳單暴衝的主因。",
  },
  {
    name: "GA4", cat: "分析與追蹤",
    role: "Google 的流量分析工具。",
    free: "免費。",
    pay: "免費。",
    payOk: true,
    note: "代價是資料歸 Google、介面複雜；要跟廣告投放深度整合才有必要。",
  },
  {
    name: "Plausible", cat: "分析與追蹤",
    role: "隱私友善的簡潔流量分析。",
    free: "無免費層，只有 30 天試用。",
    pay: "US$9/月起。",
    note: "不用掛「同意 cookie」的橫幅；預算是零就改用 PostHog 或自己架。",
  },
  {
    name: "Sentry", cat: "分析與追蹤",
    role: "網站出錯時，第一個通知你的服務。",
    free: "每月 5,000 筆錯誤，只有 1 個席次。",
    pay: "Team US$26/月：第二位工程師要看錯誤、或一次事故燒完額度時再升。",
    note: "上線前設好回報頻率上限，一個迴圈錯誤可能一天噴掉整月額度。",
  },
  {
    name: "Upstash Redis", cat: "儲存與快取",
    role: "加速用的快取資料庫。",
    free: "每月 50 萬次指令、256MB。",
    pay: "超過免費額度才開始計費。",
    note: "多數專案根本用不到 Redis；先確認一般資料庫不夠用，再加它。",
  },
  {
    name: "Cloudflare R2", cat: "儲存與快取",
    role: "放檔案的倉庫，下載流量不用錢。",
    free: "10GB；對外流量永遠 $0。",
    pay: "超過免費儲存量才開始計費。",
    note: "檔案會被大量下載的場景碾壓 S3（S3 出站約 $0.09/GB）；S3 新帳號已無傳統免費層。",
  },
  {
    name: "Supabase Storage", cat: "儲存與快取",
    role: "跟著 Supabase 附的檔案空間。",
    free: "隨免費層 1GB。",
    pay: "隨 Supabase 的方案一起升級。",
    note: "小量附件直接用它，少管一個零件。",
  },
  {
    name: "Cloudinary", cat: "儲存與快取",
    role: "圖片轉檔與加速的專門服務。",
    free: "每月 25 credits，轉換、儲存、頻寬三合一共用。",
    pay: "付費直接跳 US$99/月，斷崖陡。",
    note: "先確認 R2 加 Cloudflare 的圖片轉換不能替代，再付這筆錢。",
  },
  {
    name: "綠界 ECPay（一般賣家）", cat: "台灣在地",
    role: "收台灣消費者的錢，起步的預設選項。",
    free: "無月費、無年費，申請免費。",
    pay: "國內刷卡 2.75%，每筆最低 NT$5，另收訂單處理費 NT$1；ATM 轉帳 1%；超商代碼 NT$31/筆。",
    note: "個人賣家可申請，30 天收款上限 NT$20 萬；大約在交易後 10 天撥款（T+10）；費率為未稅價。",
  },
  {
    name: "綠界（特約賣家）", cat: "台灣在地",
    role: "交易量大之後的升級方案。",
    free: "—",
    pay: "設定費 NT$5,000，年費 NT$13,000/年起；刷卡費率可議到約 1.85%。",
    note: "月營收穩定 20–30 萬以上再升，省下的手續費才蓋得過年費。",
  },
  {
    name: "藍新 NewebPay", cat: "台灣在地",
    role: "綠界的主要替代方案。",
    free: "無月費、無年費。",
    pay: "刷卡約 2.8%/筆；提領 NT$10/筆，每月前 5 次免費。",
    note: "同集團的 ezPay 發票整合起來很順。",
  },
  {
    name: "TapPay", cat: "台灣在地",
    role: "要原生 Apple Pay、Google Pay 體驗才選的金流。",
    free: "—",
    pay: "年費約 NT$5,900 起，走業務報價制；刷卡約 2.5–3.1%。",
    note: "交易量大、簽特約商店才選；個人不適合。",
  },
  {
    name: "LINE Pay", cat: "台灣在地",
    role: "給 LINE 重度使用者的付款方式。",
    free: "無申請費、無年費。",
    pay: "一律 3%，未稅。",
    note: "客群是 LINE 重度使用者時，拿來提高付款轉換率。",
  },
  {
    name: "綠界電子發票", cat: "台灣在地",
    role: "幫有統編的賣家自動開發票。",
    free: "—",
    pay: "設定費 NT$3,600（未稅）；年費 5,000 張/年 NT$3,600 起。",
    note: "新戶限時優惠首年服務費 0 元，設定費照收。只有營業人（有統編）需要也才能開統一發票，個人賣家不能也不需要開。發票義務與營業登記門檻，請洽會計師確認。",
  },
  {
    name: "ezPay 電子發票", cat: "台灣在地",
    role: "藍新集團的發票服務。",
    free: "—",
    pay: "設定費約 NT$3,000，合作通路常免收；服務費約 NT$6,000/年起。",
  },
  {
    name: "三竹 Mitake／every8d", cat: "台灣在地",
    role: "發簡訊用，驗證碼與到貨通知。",
    free: "—",
    pay: "NT$0.7–1.3/封，儲值制、量大有級距。",
    note: "台灣市場的預設選項，送達才計費。省錢原則：能用 LINE 或 Email 通知，就不要用簡訊。",
  },
  {
    name: "Twilio", cat: "台灣在地",
    role: "國際簡訊服務。",
    free: "—",
    pay: "發台灣約 US$0.084/封，約 NT$2.6，貴 3 倍。",
    note: "只有做多國產品才選它。",
  },
  {
    name: "LINE Login／LIFF／Messaging API", cat: "台灣在地",
    role: "用 LINE 當登入與訊息的入口。",
    free: "完全免費。",
    pay: "免費。",
    payOk: true,
    note: "台灣產品「以 LINE 為入口」的標配。",
  },
  {
    name: "LINE 官方帳號", cat: "台灣在地",
    role: "對客人主動推播通知的官方管道。",
    free: "輕用量 NT$0/月，含每月 200 則主動推播；回覆型訊息與自動回應不計費、不限量。",
    pay: "中用量 NT$800/月含 3,000 則；高用量 NT$1,200/月含 6,000 則，超額約 NT$0.2/則起。",
    note: "輕用量與中用量超額不能加購，只能等下個月；把流程設計成「使用者先開口」可大幅省錢。方案 2026 已改版，網路舊文的 4,000 元/25,000 則已過時。要推播通知的台灣產品，第一選項是官方帳號加訊息服務，不是做 APP。",
  },
  {
    name: ".tw／.com.tw 網域", cat: "台灣在地",
    role: "台灣結尾的網址。",
    free: "—",
    pay: "行情 NT$550–800/年：戰國策 550、捕夢網 600、遠振 630、PChome 800。",
    note: "比價要看續約價，例如 Gandi 首年 709、續約 1,260。",
  },
  {
    name: "綠界物流", cat: "台灣在地",
    role: "超商取貨出貨，跟金流一站串好。",
    free: "—",
    pay: "店到店：7-11 與全家 NT$65/件、萊爾富 NT$55/件；取貨付款代收 0.75%，最低 NT$3。",
    note: "金流、發票、物流一站做完最省事；寄倉出貨 NT$55/件，需要驗標。",
  },
  {
    name: "ezShip", cat: "台灣在地",
    role: "超商店到店的另一個選擇。",
    free: "—",
    pay: "店到店約 NT$60/件；取貨付款需商務會員 NT$1,200/年。",
    note: "常被開店平台整合。",
  },
  {
    name: "Apple Developer Program", cat: "APP 成本",
    role: "上架 iPhone 商店的入場券。",
    free: "—",
    pay: "US$99/年；不繳，App 就會下架。",
    note: "隱形成本：審查 24–48 小時起、被拒要重送、每次更新都要重新上架。「純網頁包殼」會被商店指南 4.2 拒收。",
  },
  {
    name: "Google Play", cat: "APP 成本",
    role: "上架 Android 商店的入場券。",
    free: "—",
    pay: "US$25 一次性。",
    note: "新個人帳號須先通過封閉測試：12 名測試者、14 天，才能上正式版。",
  },
  {
    name: "商店抽成", cat: "APP 成本",
    role: "在商店裡收錢，平台抽的成數。",
    free: "—",
    pay: "Apple 小型企業計畫 15%（前一年實收不超過 US$100 萬），否則 30%，訂閱滿一年降 15%；Google Play 年收前 100 萬抽 15%。",
  },
]

const STARTER: { name: string; role: string; fee: string; free?: boolean }[] = [
  { name: "Claude Pro", role: "AI 開發助手", fee: "US$20/月（整套裡唯一固定月費）" },
  { name: "GitHub", role: "版本控制", fee: "免費", free: true },
  { name: "Cloudflare Pages（或 Vercel）", role: "部署", fee: "免費", free: true },
  { name: "Supabase", role: "資料庫＋登入＋檔案", fee: "免費", free: true },
  { name: "網域 .com", role: "你的網址", fee: "≈US$10–15/年" },
  { name: "Cloudflare", role: "網址設定與防護", fee: "免費", free: true },
  { name: "Resend", role: "寄 Email", fee: "免費", free: true },
  { name: "PostHog", role: "分析", fee: "免費", free: true },
  { name: "Sentry", role: "錯誤追蹤", fee: "免費", free: true },
]

const th = "border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground"

export default function GuideServices() {
  const [q, setQ] = useState("")
  const [cat, setCat] = useState<(typeof CATS)[number]>("全部")
  const [open, setOpen] = useState<Set<string>>(new Set())

  const kw = q.trim().toLowerCase()
  const filtered = SERVICES.filter(
    (s) => (cat === "全部" || s.cat === cat) && (kw === "" || (s.name + s.role).toLowerCase().includes(kw))
  )

  function toggle(name: string) {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 服務價目總表
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">服務價目總表</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">每一項服務收不收錢、什麼時候開始收，一頁查完。</p>
      </header>

      {/* ============ 預設起步組合 ============ */}
      <section id="starter" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Layers className="size-7 text-primary" strokeWidth={1.6} /></span>預設起步組合</SectionHead>
        <Decide q={["預設", "先拿這一套，再按需求增減"]} a={["固定月費", "合計約 US$20，就是 AI 助手的訂閱"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className={cn(th, "whitespace-nowrap")}>服務</th>
                  <th className={th}>角色</th>
                  <th className={th}>起步費用</th>
                </tr>
              </thead>
              <tbody>
                {STARTER.map((s, i) => {
                  const last = i === STARTER.length - 1
                  return (
                    <tr key={s.name}>
                      <td className={cn("whitespace-nowrap border-border px-4 py-2.5 font-semibold", !last && "border-b")}>{s.name}</td>
                      <td className={cn("border-border px-4 py-2.5 text-muted-foreground", !last && "border-b")}>{s.role}</td>
                      <td className={cn("border-border px-4 py-2.5", !last && "border-b", s.free ? "font-semibold text-ok" : "text-muted-foreground")}>{s.fee}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t-2 border-input bg-secondary/60 px-5 py-3.5 text-[0.85rem] text-muted-foreground">
            固定月費合計約 US$20，就是 AI 助手的訂閱，不用 AI 就是 $0；網域另計，一年 US$10–15。
          </div>
        </Card>
      </section>

      {/* ============ 全部服務查價 ============ */}
      <section id="all" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Table2 className="size-7 text-primary" strokeWidth={1.6} /></span>全部服務查價</SectionHead>
        <Decide q={["怎麼查", "打關鍵字，或點一個分類"]} a={["提醒", "名稱旁有箭頭的列，點一下看備註"]} />

        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" strokeWidth={1.8} />
          <input
            type="search"
            placeholder="輸入服務名稱或用途，例如：資料庫、簡訊"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-input bg-card py-3 pl-11 pr-4 text-[0.95rem] outline-none focus:border-primary"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {CATS.map((c) => {
            const on = c === cat
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setCat(c)}
                className={cn(
                  "cursor-pointer rounded-full border-[1.5px] border-input bg-card px-3.5 py-1.5 text-[0.82rem] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground",
                  on && "border-primary bg-primary/8 text-primary hover:text-primary"
                )}
              >
                {c}
              </button>
            )
          })}
        </div>

        <p className="mt-3 font-mono text-[0.72rem] text-muted-foreground">顯示 {filtered.length} / {SERVICES.length} 項</p>

        <Card className="mt-3 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr>
                  <th className={cn(th, "whitespace-nowrap")}>服務</th>
                  <th className={cn(th, "min-w-[150px]")}>角色</th>
                  <th className={cn(th, "min-w-[190px]")}>免費額度</th>
                  <th className={cn(th, "min-w-[220px]")}>什麼時候開始付錢</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">沒有符合的服務，換個關鍵字或分類試試。</td>
                  </tr>
                )}
                {filtered.map((s) => {
                  const isOpen = open.has(s.name)
                  return (
                    <Fragment key={s.name}>
                      <tr
                        className={cn(s.note && "cursor-pointer hover:bg-secondary/40")}
                        onClick={s.note ? () => toggle(s.name) : undefined}
                      >
                        <td className="border-b border-border px-4 py-3 align-top">
                          {s.note ? (
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              onClick={(e) => { e.stopPropagation(); toggle(s.name) }}
                              className="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-left font-sans"
                            >
                              <b className="text-[0.92rem]">{s.name}</b>
                              <ChevronDown className={cn("size-3.5 shrink-0 text-faint transition-transform", isOpen && "rotate-180")} strokeWidth={2} />
                            </button>
                          ) : (
                            <b className="text-[0.92rem]">{s.name}</b>
                          )}
                          {cat === "全部" && <Badge className="mt-1.5">{s.cat}</Badge>}
                        </td>
                        <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">{s.role}</td>
                        <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">{s.free}</td>
                        <td className={cn("border-b border-border px-4 py-3 align-top", s.payOk ? "font-semibold text-ok" : "text-muted-foreground")}>{s.pay}</td>
                      </tr>
                      {s.note && isOpen && (
                        <tr>
                          <td colSpan={4} className="border-b border-border bg-secondary/40 px-4 py-3 text-[0.82rem] text-muted-foreground">{s.note}</td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* ============ 交叉連結＋查證說明 ============ */}
      <section className="pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-[1.5px] border-dashed border-input bg-card px-5 py-4 shadow-sm">
          <p className="text-[0.9rem] text-muted-foreground">想試算自己那套組合每個月要花多少，到「花多少錢」按一按就有答案。</p>
          <Button asChild variant="outline"><Link to="/cost" className="no-underline">去試算 →</Link></Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-lg border-[1.5px] border-dashed border-input bg-card px-5 py-4 shadow-sm">
          <p className="text-[0.9rem] text-muted-foreground">還不知道該挑哪幾項的話，先回「用什麼做」，照推薦選就好。</p>
          <Button asChild variant="outline"><Link to="/stack" className="no-underline">看怎麼挑 →</Link></Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-lg border-[1.5px] border-dashed border-input bg-card px-5 py-4 shadow-sm">
          <p className="text-[0.9rem] text-muted-foreground">收到一串沒見過的網址，想知道它是哪一家、免不免費，翻網址後綴對照表。</p>
          <Button asChild variant="outline"><Link to="/guides/suffixes" className="no-underline">去查後綴 →</Link></Button>
        </div>

        <div className="mt-4 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <Scale className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          2026-08-24 逐項查證，價格會變，付錢前以官網為準。美元服務標 US$；台灣在地服務標 NT$、多為未稅價，結算另加 5% 營業稅。
        </div>
      </section>

      <Pager prev={["/guides/sell", "賣出去"]} next={["/guides/recipes", "情境配方"]} />
    </main>
  )
}
