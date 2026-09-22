import { useMemo, useState } from "react"
import {
  Image, Wrench, Banknote, ClipboardList, Smartphone, Monitor, TabletSmartphone,
  BellOff, MessageSquare, Bell, MapPin, Bluetooth, Watch, ShoppingBag, Download,
  CheckCircle2, User, Users, UsersRound, Globe, Coins, Building2, HelpCircle, Terminal,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Decide, MiniUI } from "@/components/site"
import { cn } from "@/lib/utils"

type Opt = { v: string; label: string; sub?: string; icon?: LucideIcon; mini?: "clean" | "editorial" | "warm" }
type Step =
  | { id: string; type: "text"; q: string; hint?: string; ph?: string }
  | { id: string; type: "single" | "multi"; q: string; hint?: string; wide?: boolean; opts: Opt[] }

const STEPS: Step[] = [
  { id: "what", type: "text", q: "這是在幫誰、解決什麼事？", hint: "用一句話講就好", ph: "例：幫社區管委會收管理費，現在都用紙本" },
  { id: "kind", type: "single", q: "它比較像哪一種？", opts: [
    { v: "content", label: "展示", sub: "像官網、作品集這類", icon: Image },
    { v: "tool", label: "工具", sub: "像查詢、計算的小工具", icon: Wrench },
    { v: "commerce", label: "交易／預約", sub: "會收錢或收報名的", icon: Banknote },
    { v: "admin", label: "管理系統", sub: "像管名單、管庫存的系統", icon: ClipboardList },
  ] },
  { id: "device", type: "single", q: "大家主要用什麼開它？", opts: [
    { v: "mobile", label: "手機為主", icon: Smartphone },
    { v: "desktop", label: "電腦為主", icon: Monitor },
    { v: "both", label: "都有", icon: TabletSmartphone },
  ] },
  { id: "notify", type: "single", q: "要主動通知使用者嗎？", opts: [
    { v: "none", label: "不用", icon: BellOff },
    { v: "soft", label: "Email 或 LINE 就好", icon: MessageSquare },
    { v: "push", label: "一定要手機推播", icon: Bell },
  ] },
  { id: "caps", type: "multi", q: "需要哪些特殊能力？", hint: "可以複選；都沒有的話就選最後一個", opts: [
    { v: "bgloc", label: "螢幕關了也要記位置", sub: "像跑步軌跡、外送追蹤這類", icon: MapPin },
    { v: "ble", label: "連藍牙、嗶卡感應", sub: "像手環、感應卡這類裝置", icon: Bluetooth },
    { v: "native", label: "桌面小工具、手錶、健康資料", icon: Watch },
    { v: "store", label: "一定要上架商店", icon: ShoppingBag },
    { v: "offline", label: "離線能看", sub: "沒有網路時也能讀", icon: Download },
    { v: "no", label: "都不需要", icon: CheckCircle2 },
  ] },
  { id: "scale", type: "single", q: "預計多少人用？", hint: "抓個大概", opts: [
    { v: "s", label: "100 以內", sub: "多半是自己人在用", icon: User },
    { v: "m", label: "100–1,000", icon: Users },
    { v: "l", label: "1,000–10,000", icon: UsersRound },
    { v: "xl", label: "更多", sub: "要說得出人從哪裡來", icon: UsersRound },
  ] },
  { id: "pay", type: "single", q: "要收錢嗎？", opts: [
    { v: "none", label: "不收", icon: CheckCircle2 },
    { v: "tw", label: "收台灣的錢", icon: Banknote },
    { v: "global", label: "收海外的錢", icon: Globe },
    { v: "both", label: "都收", icon: Coins },
  ] },
  { id: "entity", type: "single", q: "你會用什麼身分收錢？", opts: [
    { v: "person", label: "個人", icon: User },
    { v: "company", label: "公司行號", sub: "有統編", icon: Building2 },
    { v: "tbd", label: "還沒想", sub: "先照個人來規劃", icon: HelpCircle },
  ] },
  { id: "who", type: "single", q: "誰來做？", opts: [
    { v: "ai", label: "我自己＋AI", sub: "不太會寫程式也行", icon: Terminal },
    { v: "dev", label: "我自己", sub: "會寫程式", icon: User },
    { v: "hire", label: "找別人做", icon: Users },
  ] },
  { id: "budget", type: "single", q: "每個月固定的花費，你能接受多少？", opts: [
    { v: "zero", label: "0 元" }, { v: "low", label: "台幣幾百" }, { v: "mid", label: "台幣一兩千以上" },
  ] },
  { id: "when", type: "single", q: "多快要能用？", opts: [
    { v: "rush", label: "這週末", sub: "範圍會砍到最小" }, { v: "month", label: "一個月內" }, { v: "quarter", label: "一季內" },
  ] },
  { id: "style", type: "single", wide: true, q: "你希望它給人什麼感覺？", hint: "同一個畫面做成三種長相，點你喜歡的那張", opts: [
    { v: "clean", label: "俐落", sub: "安靜、專業，像好用的工具", mini: "clean" },
    { v: "editorial", label: "雜誌", sub: "襯線字配大量留白，像一本刊物", mini: "editorial" },
    { v: "warm", label: "溫暖", sub: "圓潤、親切、有生活感", mini: "warm" },
  ] },
  { id: "metric", type: "text", q: "三個月後，怎樣算成功？", hint: "要訂可以數的指標；想不到就先留空", ph: "例：每週 30 筆訂單" },
]

type Answers = Record<string, string | string[]>

function hasCap(A: Answers, k: string) { return ((A.caps as string[]) || []).includes(k) }
function isApp(A: Answers) { return ["bgloc", "ble", "native", "store"].some((k) => hasCap(A, k)) }
function isPwa(A: Answers) { return !isApp(A) && (A.device === "mobile" || A.notify === "push" || hasCap(A, "offline")) }

/* ---------- 產生 Markdown ---------- */
function buildMd(A: Answers): string {
  const L: string[] = []
  const caps = (A.caps as string[]) || ["no"]
  const app = isApp(A), pwa = isPwa(A)
  const form = app ? "APP（跨平台）" : pwa ? "網頁＋（可加到手機主畫面的網頁）" : "網頁"
  const isStatic = A.kind === "content" && (A.pay === "none" || !A.pay)
  const payTw = A.pay === "tw" || A.pay === "both"
  const payGl = A.pay === "global" || A.pay === "both"
  const isCompany = A.entity === "company"
  const M: Record<string, Record<string, string>> = {
    kind: { content: "內容展示", tool: "工具", commerce: "交易／預約", admin: "管理系統" },
    device: { mobile: "手機為主", desktop: "電腦為主", both: "手機＋電腦" },
    notify: { none: "不需要", soft: "Email 或 LINE 即可", push: "需要手機推播" },
    scale: { s: "100 人以內", m: "100–1,000 人", l: "1,000–10,000 人", xl: "10,000 人以上（請先確認來源）" },
    who: { ai: "本人＋AI（非工程師）", dev: "本人（會寫程式）", hire: "外包／他人" },
    budget: { zero: "每月 0 元", low: "每月台幣幾百元", mid: "每月台幣一兩千元以上" },
    when: { rush: "這週末就要（範圍砍到最小）", month: "一個月內", quarter: "一季內" },
  }
  const CAPT: Record<string, string> = { bgloc: "背景持續定位", ble: "藍牙／NFC 感應", native: "桌面小工具／手錶／健康資料", store: "上架商店", offline: "離線瀏覽" }
  const capList = caps.filter((c) => c !== "no").map((c) => CAPT[c]).join("、") || "無"

  L.push(`# 產品需求單：${A.what || "（未命名專案）"}`)
  L.push("")
  L.push("> 這份文件由「解決方案架構師」規劃精靈產生（2026-08-24 版）。")
  L.push("> 請 AI 整份讀完，照「開工指示」動工；不確定的地方先問我，不要自己猜。")
  L.push("")
  L.push("## 一句話")
  L.push((A.what as string) || "（尚未填寫——請先問清楚：幫誰、解決什麼事）")
  L.push("")
  L.push("## 需求")
  L.push(`- 類型：${M.kind[A.kind as string] || "未定"}`)
  L.push(`- 裝置：${M.device[A.device as string] || "未定"}　通知：${M.notify[A.notify as string] || "未定"}`)
  L.push(`- 特殊能力：${capList}`)
  L.push(`- 規模：${M.scale[A.scale as string] || "未定"}`)
  L.push(`- 收款：${A.pay === "none" || !A.pay ? "不收錢" : `${payTw ? "台灣" : ""}${payTw && payGl ? "＋" : ""}${payGl ? "海外" : ""}；身分：${isCompany ? "公司行號（有統編）" : "個人"}`}`)
  L.push("")
  L.push(`## 形態判定：${form}`)
  if (app) {
    L.push(`- 理由：需要「${capList}」——這些只有 APP 做得到。`)
    L.push("- 做法：已經有網頁的話，用 Capacitor 包成殼；想要接近原生的體驗，用 Expo（React Native）。帳號後台和介紹頁留在網頁就好。")
    L.push("- 固定成本：Apple 每年 US$99，Google Play 一次性 US$25；每次更新都要送商店審查。")
  } else if (pwa) {
    L.push("- 理由：你的情境是手機為主、要推播或要離線，網頁加上主畫面安裝和推播就夠了。")
    if (payTw || A.notify !== "none") L.push("- 台灣情境：推播先評估 LINE 官方帳號（每月 200 則主動訊息免費、回覆不限量）。")
  } else {
    L.push("- 理由：沒有任何「只有 APP 做得到」的需求。一個網址成本最低、改版最快。")
  }
  L.push("")
  L.push("## 建議組合")
  if (isStatic) {
    L.push("- 畫面：純靜態頁（Astro 或純 HTML）——沒有伺服器要顧")
    L.push("- 上線：Cloudflare Pages（免費、可商用、流量不限）")
  } else {
    L.push(`- 畫面：Next.js（React）或 Nuxt（Vue）——用${A.who === "dev" ? "你熟的那個" : "主流的，AI 最會寫"}`)
    L.push("- 資料與登入：Supabase（免費層；資料庫、登入、檔案一次給齊）")
    L.push("- 上線：Cloudflare（免費、可以商用）或 Vercel（免費版不能商用）")
    L.push(`- 樣式：Tailwind CSS${A.style === "clean" ? "＋shadcn/ui" : A.style === "warm" ? "＋DaisyUI 或自組" : "，自組排版"}`)
  }
  if (payTw) {
    L.push("- 金流（台灣）：綠界或藍新——免月費、個人可申請、刷卡約 2.8%/筆；要串接時，先裝綠界官方的 ECPay-API-Skill")
    L.push(isCompany
      ? "- 發票：用綠界或 ezPay 自動開立電子發票（設定費 NT$3,600 起）；相關義務的細節請問會計師"
      : "- 發票：個人賣家不能開，也不需要開；等營業額變大，再去問會計師")
  }
  if (payGl) {
    L.push("- 金流（海外）：先用 Paddle 這類代收平台（抽 5%＋US$0.50，個人可以申請，只限數位商品）；等月營收穩定超過 US$3,000，再評估開美國公司加上 Stripe（Atlas US$500 起）")
  }
  L.push("")
  L.push("## 每月成本（起步）")
  L.push(`- 固定：US$${A.who === "hire" ? "0（服務費）；外包的費用另外算" : "0–20（AI 幫手的訂閱費；其餘服務都用免費層）"}`)
  L.push(`- 一次性／年繳：網域約 US$10–15/年${app ? "；Apple 每年 US$99，Google 一次性 US$25" : ""}`)
  if (payTw || payGl) L.push("- 按量：每筆交易的抽成，費率照上面寫的")
  L.push("- 升級訊號：免費額度快滿了再付費就好（例：Supabase 用爆了，才升級 US$25/月）")
  L.push("")
  const SPEC: Record<string, string[]> = {
    clean: ["風格：俐落（工具感）",
      "- 字體：系統無襯線；中文指定 Noto Sans TC 或 PingFang TC",
      "- 色彩：中性灰階加一個強調色（問我要哪個顏色）；底色近白，文字近黑",
      "- 形狀：小圓角 6–8px、1px 細邊框、陰影極輕；對齊嚴格",
      "- 元件庫：shadcn/ui（React）或 shadcn-vue",
      "- 禁：漸層、彩色圖示滿天飛"],
    editorial: ["風格：雜誌（編輯排版）",
      "- 字體：標題用襯線（Noto Serif TC），內文用無襯線；標題要大，留白要多",
      "- 色彩：紙感底色（暖白）配墨色文字，再加一個飽和強調色（磚紅、深綠這類）",
      "- 形狀：直角或極小圓角；用細分隔線與留白，不用卡片牆",
      "- 元件庫：Tailwind 自組",
      "- 禁：彩色漸層、置中三欄卡片"],
    warm: ["風格：溫暖（生活感）",
      "- 字體：無襯線、標題字重 700+；中文用 Noto Sans TC",
      "- 色彩：奶油底配 2–3 個低飽和暖色；文字用深棕，不用純黑",
      "- 形狀：大圓角 14–20px、實色塊、柔和陰影；按鈕要大、要好按",
      "- 元件庫：DaisyUI 或 Tailwind 自組",
      "- 禁：企業灰、細線框"],
  }
  const spec = SPEC[A.style as string] || SPEC.clean
  L.push(`## ${spec[0]}`)
  spec.slice(1).forEach((s) => L.push(s))
  L.push("- 通用：不用紫藍漸層當主視覺；空狀態、載入、錯誤畫面走同一風格；避免通用 AI 模板臉")
  L.push("")
  L.push("## 資源與時程")
  L.push(`- 誰來做：${M.who[A.who as string] || "未定"}　預算：${M.budget[A.budget as string] || "未定"}　時程：${M.when[A.when as string] || "未定"}`)
  L.push("")
  L.push("## 三個月成功指標")
  L.push((A.metric as string) || "（未填——動工前請幫我訂一個可以數的指標）")
  L.push("")
  L.push("## 給 AI 的開工指示")
  L.push("0. 這份需求單就是規格：照它做；要改需求，先改這份文件再動工。")
  L.push("1. 先做最小可用版：一週內能自己用的核心功能，其他先不做。")
  L.push("2. 每次改動都用 git 存檔；一次只改一件事。")
  L.push("3. 金鑰只放 .env（加入 .gitignore）或平台 secret，絕不寫進程式碼；萬一外洩，立刻作廢重發。")
  let n = 4
  if (payTw || payGl) L.push(`${n++}. 收款先用測試模式（假卡）整套跑通，再上真錢。`)
  L.push(`${n++}. 照上面的風格規格做畫面，不要通用模板臉。`)
  L.push(`${n}. 需要的工具（git、部署、資料庫的指令列工具）自己裝好；只在辦帳號、產金鑰、按同意時找我。`)
  const res = ["- GitHub（存檔）＋官方 MCP：github.com/github/github-mcp-server"]
  if (!isStatic) res.push("- Supabase 官方 MCP：github.com/supabase/mcp")
  if (A.style === "clean" && !isStatic) res.push("- shadcn 官方 MCP：ui.shadcn.com/docs/mcp")
  if (payTw) res.push("- 綠界官方 AI Skill：github.com/ECPay/ECPay-API-Skill")
  if (payGl) res.push("- Stripe 官方 MCP：docs.stripe.com/mcp")
  if (payTw || A.notify === "soft" || A.notify === "push") res.push("- LINE 官方 MCP：github.com/line/line-bot-mcp-server")
  if (app) res.push("- Expo：docs.expo.dev ／ Capacitor：capacitorjs.com/docs")
  L.push("")
  L.push("## 開工資源（成熟的現成工具，不要重造）")
  res.forEach((r) => L.push(r))
  L.push("")
  L.push("## 上線前檢查（全勾才叫可以上線）")
  const chk = [
    "全站走 HTTPS，憑證會自動續期",
    "每天自動備份，且親手還原成功過一次",
    "錯誤追蹤已接上，出錯會通知我",
    "金鑰不在程式裡，上線前換過一輪",
    ...(payTw || payGl ? ["金流走完成功、被拒、退款三條測試路，再用真卡小額測一筆"] : []),
    "回滾方法寫成一頁並演練過",
    "有一位叫得出名字的負責人",
    "隱私權政策已上線，也有安全回報信箱",
    "掛站監測已裝好，網站掛了會通知到手機",
    "帳單已設好預算警示或上限",
  ]
  chk.forEach((c) => L.push("- [ ] " + c))
  L.push("")
  L.push("---")
  L.push("以上價格是 2026-08-24 查證的參考價，實際以各官網為準。")
  return L.join("\n")
}

/* ---------- Markdown → HTML（僅本檔自產的受控格式） ---------- */
function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") }
function mdToHtml(md: string): string {
  const out: string[] = []
  let inUl = false, inOl = false
  const close = () => {
    if (inUl) { out.push("</ul>"); inUl = false }
    if (inOl) { out.push("</ol>"); inOl = false }
  }
  md.split("\n").forEach((ln) => {
    if (/^# /.test(ln)) { close(); out.push(`<h1>${esc(ln.slice(2))}</h1>`) }
    else if (/^## /.test(ln)) { close(); out.push(`<h2>${esc(ln.slice(3))}</h2>`) }
    else if (/^> /.test(ln)) { close(); out.push(`<blockquote>${esc(ln.slice(2))}</blockquote>`) }
    else if (/^- /.test(ln)) { if (inOl) { out.push("</ol>"); inOl = false } if (!inUl) { out.push("<ul>"); inUl = true } out.push(`<li>${esc(ln.slice(2))}</li>`) }
    else if (/^\d+\. /.test(ln)) { if (inUl) { out.push("</ul>"); inUl = false } if (!inOl) { out.push("<ol>"); inOl = true } out.push(`<li>${esc(ln.replace(/^\d+\. /, ""))}</li>`) }
    else if (/^---/.test(ln)) { close(); out.push("<hr>") }
    else if (ln.trim() === "") { close() }
    else { close(); out.push(`<p>${esc(ln)}</p>`) }
  })
  close()
  return out.join("")
}

/* ---------- 精靈 ---------- */
export default function Plan() {
  const [A, setA] = useState<Answers>({})
  const [cur, setCur] = useState(0)
  const [text, setText] = useState("")
  const [copied, setCopied] = useState(false)
  const done = cur >= STEPS.length
  const step = STEPS[Math.min(cur, STEPS.length - 1)]

  const md = useMemo(() => (done ? buildMd(A) : ""), [done, A])

  function go(delta: number, fresh?: Answers) {
    const AA = fresh ?? (step.type === "text" ? { ...A, [step.id]: text.trim() } : A)
    if (step.type === "text") setA(AA)
    let next = cur + delta
    // 不收錢 → 跳過「收款身分」
    while (STEPS[next] && STEPS[next].id === "entity" && (AA.pay === "none" || !AA.pay)) next += delta
    setCur(next)
    const t = STEPS[next]
    setText(t && t.type === "text" ? ((AA[t.id] as string) || "") : "")
  }

  function pickSingle(v: string) {
    const fresh = { ...A, [step.id]: v }
    setA(fresh)
    setTimeout(() => go(1, fresh), 180)
  }

  function toggleMulti(v: string) {
    setA((a) => {
      let arr = [...((a[step.id] as string[]) || [])]
      if (v === "no") arr = ["no"]
      else {
        arr = arr.filter((x) => x !== "no")
        arr.includes(v) ? (arr = arr.filter((x) => x !== v)) : arr.push(v)
      }
      return { ...a, [step.id]: arr }
    })
  }

  async function copy() {
    try { await navigator.clipboard.writeText(md) } catch {
      const ta = document.createElement("textarea")
      ta.value = md; document.body.appendChild(ta); ta.select()
      try { document.execCommand("copy") } catch {}
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  function download() {
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "需求單.md"
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  }

  /* 即時判定 */
  const chips: { text: string; hot?: boolean }[] = []
  if (A.caps || A.device || A.notify) chips.push({ text: `判定：${isApp(A) ? "APP" : isPwa(A) ? "網頁＋" : "網頁"}`, hot: true })
  else chips.push({ text: "判定：…" })
  if (A.who) chips.push({ text: `每月約 ${A.who === "hire" ? "外包另計" : "US$0–20"}` })
  if (A.pay && A.pay !== "none") chips.push({ text: "＋交易抽成" })
  if (isApp(A)) chips.push({ text: "＋商店費 US$99/年" })
  if (A.style) chips.push({ text: `風格：${{ clean: "俐落", editorial: "雜誌", warm: "溫暖" }[A.style as string]}` })

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <header className="pb-1 pt-11">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">開始規劃</h1>
        <div className="reveal d2">
          <Decide q={["怎麼玩", "一次答一題，大約 3 分鐘"]} a={["產出", "一份需求單，丟給任何 AI 就能開工"]} />
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-[720px]">
        {/* 分段進度 */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-1">
            {STEPS.map((_, i) => (
              <i key={i} className={cn("h-[5px] flex-1 rounded-full bg-secondary", (done || i < cur + 1) && "bg-primary")} />
            ))}
          </div>
          <span className="font-mono text-[0.72rem] text-muted-foreground">{done ? "完成" : `${cur + 1}/${STEPS.length}`}</span>
        </div>

        {/* 即時判定 */}
        <div className="mt-3 flex flex-wrap gap-2" aria-live="polite">
          {chips.map((c, i) => (
            <span key={i} className={cn(
              "rounded-full border-[1.5px] border-input bg-card px-3 py-1 font-mono text-[0.7rem] text-muted-foreground",
              c.hot && "border-primary/45 bg-primary/10 text-primary"
            )}>{c.text}</span>
          ))}
        </div>
        <div className="mt-2 text-[0.72rem] text-faint">資料只留在你的瀏覽器</div>

        {/* 題卡 */}
        <Card key={done ? "done" : cur} className="wizin mt-3.5 p-7">
          {!done ? (
            <>
              <h2 className="font-serif text-[1.6rem] font-extrabold">{step.q}</h2>
              {"hint" in step && step.hint && <p className="mt-1.5 text-sm text-muted-foreground">{step.hint}</p>}

              {step.type === "text" ? (
                <input
                  autoFocus
                  className="mt-4 w-full rounded-lg border-[1.5px] border-input bg-card px-4 py-3 text-[0.95rem] outline-none focus:border-primary"
                  placeholder={step.ph}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing || e.keyCode === 229) return
                    if (e.key === "Enter") go(1)
                  }}
                />
              ) : (
                <div className={cn(
                  "mt-4 grid gap-2.5",
                  step.type === "single" && !("wide" in step && step.wide) && step.opts.some((o) => o.icon) && "grid-cols-[repeat(auto-fit,minmax(140px,1fr))]",
                  "wide" in step && step.wide && "grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"
                )}>
                  {step.opts.map((o) => {
                    const on = step.type === "multi"
                      ? ((A[step.id] as string[]) || []).includes(o.v)
                      : A[step.id] === o.v
                    const visual = step.type === "single" && (o.icon || o.mini)
                    return (
                      <button
                        key={o.v}
                        type="button"
                        onClick={() => (step.type === "multi" ? toggleMulti(o.v) : pickSingle(o.v))}
                        className={cn(
                          "relative rounded-lg border-[1.5px] border-input bg-card px-4 py-3 text-left text-[0.95rem] font-semibold transition-all hover:-translate-y-0.5 hover:border-primary cursor-pointer",
                          visual && "px-3 pb-3.5 pt-4 text-center",
                          on && "border-primary bg-primary/8"
                        )}
                      >
                        {on && <span className="absolute right-2.5 top-1.5 font-extrabold text-primary">✓</span>}
                        {o.mini ? (
                          <span className="mb-2.5 block text-left text-[0.62rem] leading-normal"><MiniUI kind={o.mini} /></span>
                        ) : o.icon ? (
                          step.type === "multi"
                            ? <o.icon className={cn("mr-2.5 -mt-0.5 inline size-5 text-draft", on && "text-primary")} strokeWidth={1.6} />
                            : <o.icon className={cn("mx-auto mb-2 block size-8 text-draft", on && "text-primary")} strokeWidth={1.5} />
                        ) : null}
                        {o.label}
                        {o.sub && <small className="block text-[0.78rem] font-normal text-muted-foreground">{o.sub}</small>}
                      </button>
                    )
                  })}
                </div>
              )}

              <div className="mt-6 flex justify-between">
                {cur > 0 ? <Button variant="outline" onClick={() => go(-1)}>← 上一題</Button> : <span />}
                {(step.type === "multi" || step.type === "text") && (
                  <Button onClick={() => {
                    if (step.type === "multi" && !((A[step.id] as string[]) || []).length) setA((a) => ({ ...a, [step.id]: ["no"] }))
                    go(1)
                  }}>
                    {cur === STEPS.length - 1 ? "產生需求單" : "下一題 →"}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="font-serif text-[1.6rem] font-extrabold">需求單完成</h2>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                <Button onClick={copy}>{copied ? "已複製 ✓" : "複製需求單"}</Button>
                <Button variant="outline" onClick={download}>下載</Button>
                <Button variant="outline" onClick={() => { setA({}); setCur(0); setText("") }}>重來</Button>
              </div>
              <div
                className="docview mt-3.5 rounded-xl border-[1.5px] border-input bg-card p-7 shadow-md max-sm:p-5"
                dangerouslySetInnerHTML={{ __html: mdToHtml(md) }}
              />
              <p className="mt-3.5 text-sm text-muted-foreground">
                貼給你的 AI，說「照這份做」。想讓 AI 直接訪談、直接開工，就在 Claude Code 輸入 <code className="font-mono text-primary">/architect</code>。
              </p>
            </>
          )}
        </Card>
      </div>
    </main>
  )
}
