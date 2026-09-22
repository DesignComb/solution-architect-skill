import { useState } from "react"
import { Link } from "react-router-dom"
import { Banknote, MessageSquare, ReceiptText, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, QSteps, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

/* 價目資料（2026-08 查證參考價） */
type Service = {
  id: string
  g: string
  name: string
  role: string
  price: string
  usd: number
  yearlyUsd?: number
  onceUsd?: number
  pct?: boolean
  onceNote?: string
  on: string[]
  note: string
}

const SERVICES: Service[] = [
  { id: "ai",      g: "核心", name: "AI 幫手訂閱",      role: "你教它，它做給你",       price: "約 US$20/月", usd: 20,  on: ["static", "webapp", "shop", "app"], note: "這是整套裡唯一的固定月費" },
  { id: "git",     g: "核心", name: "GitHub",            role: "程式碼的保險箱",   price: "免費",     usd: 0,   on: ["static", "webapp", "shop", "app"], note: "" },
  { id: "deploy",  g: "核心", name: "Cloudflare／Vercel", role: "把網站放上網",   price: "免費",     usd: 0,   on: ["static", "webapp", "shop", "app"], note: "Vercel 免費版不能拿來做生意，Cloudflare 可以" },
  { id: "baas",    g: "核心", name: "Supabase",          role: "資料庫、登入、檔案都包辦", price: "免費",   usd: 0,   on: ["webapp", "shop", "app"], note: "免費版太久沒用會被暫停；正式營運要升級到 US$25/月" },
  { id: "domain",  g: "核心", name: "網域",              role: "你自己的網址",     price: "約 US$10–15/年", usd: 0, yearlyUsd: 12, on: ["static", "webapp", "shop", "app"], note: "比價的時候要看續約價，不是只看第一年" },
  { id: "dns",     g: "核心", name: "Cloudflare",        role: "幫網址指路，順便加速和防護", price: "免費",   usd: 0,   on: ["static", "webapp", "shop", "app"], note: "" },
  { id: "email",   g: "常用", name: "Resend",            role: "寄信（驗證碼、收據）", price: "免費", usd: 0,   on: ["webapp", "shop", "app"], note: "免費版每天最多寄 100 封" },
  { id: "analytics", g: "常用", name: "PostHog／GA4",   role: "看誰在用",         price: "免費",    usd: 0,   on: ["webapp", "shop", "app"], note: "" },
  { id: "sentry",  g: "常用", name: "Sentry",            role: "出錯時通知你",     price: "免費",     usd: 0,   on: ["webapp", "shop", "app"], note: "" },
  { id: "r2",      g: "常用", name: "Cloudflare R2",     role: "放圖片與檔案",     price: "免費",     usd: 0,   on: [], note: "被大量下載也不收流量費" },
  { id: "vector",  g: "常用", name: "pgvector",          role: "AI 搜尋的記憶",    price: "免費",     usd: 0,   on: [], note: "資料庫本來就內建，不用另外裝" },
  { id: "pay-tw",  g: "台灣在地", name: "綠界／藍新",     role: "收台灣的錢",      price: "約 2.8%/筆", usd: 0, pct: true, on: ["shop"], note: "不用付月費；Stripe 在台灣還不能用" },
  { id: "line",    g: "台灣在地", name: "LINE 官方帳號", role: "通知使用者",       price: "免費起",   usd: 0,   on: ["shop"], note: "每個月可以免費主動發 200 則訊息" },
  { id: "invoice", g: "台灣在地", name: "電子發票",      role: "自動開發票",       price: "設定費 NT$3,600 起", usd: 0, onceNote: "電子發票設定費 NT$3,600 起", on: [], note: "有統編才需要" },
  { id: "sms",     g: "台灣在地", name: "簡訊",          role: "發驗證碼、通知",   price: "約 NT$1/封", usd: 0, pct: true, on: [], note: "能用 LINE 就別花這筆錢" },
  { id: "apple",   g: "做 APP 才有", name: "Apple Developer", role: "上架 App Store", price: "US$99/年", usd: 0, yearlyUsd: 99, on: ["app"], note: "" },
  { id: "play",    g: "做 APP 才有", name: "Google Play",     role: "上架 Play 商店", price: "US$25 一次", usd: 0, onceUsd: 25, on: ["app"], note: "" },
]

const GROUPS = ["核心", "常用", "台灣在地", "做 APP 才有"]

const PRESETS: [string, string][] = [
  ["static", "展示型官網"],
  ["webapp", "一般網站"],
  ["shop", "台灣收款"],
  ["app", "要上架 APP"],
]

const TW_ROWS = [
  {
    v: "pay",
    icon: Banknote,
    title: "收錢",
    one: "用綠界或藍新，因為 Stripe 在台灣還不能用",
    inner: (
      <>不用月費，個人也能申請；刷卡每筆約 <b>2.75–2.8%</b>。想收海外的錢有兩條路，請看<Link to="/guides/payments"><b>金流指南 →</b></Link></>
    ),
  },
  {
    v: "notify",
    icon: MessageSquare,
    title: "通知",
    one: "先想 LINE，不是做 APP",
    inner: (
      <>台灣人都黏在 LINE 上。每個月 <b>200 則主動訊息免費</b>，回覆訊息不限量；用量大了才需要 NT$800/月起的方案。</>
    ),
  },
  {
    v: "invoice",
    icon: ReceiptText,
    title: "發票",
    one: "有統編才需要",
    inner: (
      <>公司行號可以用<b>綠界／ezPay</b> 自動開發票（設定費 NT$3,600 起）。該不該開，問會計師。</>
    ),
  },
  {
    v: "sms",
    icon: Mail,
    title: "簡訊",
    one: "一封約 NT$1，能用 LINE 就別花這個錢",
    inner: (
      <>驗證碼、到貨通知就用台灣的簡訊商（<b>三竹、every8d</b>）；國際服務要貴上 3 倍。</>
    ),
  },
]

export default function Cost() {
  const [preset, setPreset] = useState<string | null>("webapp")
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(SERVICES.filter((s) => s.on.includes("webapp")).map((s) => s.id))
  )

  function applyPreset(p: string) {
    setPreset(p)
    setChecked(new Set(SERVICES.filter((s) => s.on.includes(p)).map((s) => s.id)))
  }

  function toggle(id: string, v: boolean) {
    setPreset(null)
    setChecked((prev) => {
      const next = new Set(prev)
      if (v) next.add(id)
      else next.delete(id)
      return next
    })
  }

  let usd = 0
  let yearly = 0
  let once = 0
  const pctNotes: string[] = []
  const onceNotes: string[] = []
  for (const s of SERVICES) {
    if (!checked.has(s.id)) continue
    usd += s.usd || 0
    yearly += s.yearlyUsd || 0
    once += s.onceUsd || 0
    if (s.pct) pctNotes.push(s.role + " " + s.price)
    if (s.onceNote) onceNotes.push(s.onceNote)
  }
  const extra: string[] = []
  if (yearly) extra.push("年繳 US$" + yearly)
  if (once) extra.push("一次性 US$" + once)
  if (onceNotes.length) extra.push("一次性：" + onceNotes.join("、"))
  if (pctNotes.length) extra.push("另有按量計費：" + pctNotes.join("、"))
  const extraText = extra.length ? "＋ " + extra.join(" ・ ") : "沒有其他固定支出"

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <header className="pb-1 pt-11">
        <QSteps current={5} />
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">花多少錢？</h1>
        <Decide q={["行情", "一整套每月大約一杯下午茶的錢"]} a={["推薦", "從 US$20/月 起步，往下試算你自己的 ↓"]} />
      </header>

      {/* 成本試算機 */}
      <Card className="mt-8 overflow-hidden">
        <div className="border-b border-dashed border-input px-5 py-4">
          <b className="font-serif text-[1.15rem] font-bold">成本試算機</b>
          <p className="mt-0.5 text-[0.84rem] text-muted-foreground">挑一個像你的情境，再自己勾。價格是 2026-08 查證的參考價。</p>
        </div>

        <div className="flex flex-wrap gap-2 px-5 pt-4">
          {PRESETS.map(([p, label]) => (
            <Button
              key={p}
              size="sm"
              variant={preset === p ? "default" : "outline"}
              onClick={() => applyPreset(p)}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="px-5 pb-3">
          {GROUPS.map((g) => (
            <div key={g}>
              <div className="mt-5 border-b-2 border-input pb-1.5 font-mono text-[0.68rem] tracking-wider text-muted-foreground">{g}</div>
              {SERVICES.filter((s) => s.g === g).map((s) => {
                const money = s.usd > 0 || !!s.yearlyUsd || !!s.onceUsd || !!s.pct || !!s.onceNote
                return (
                  <label key={s.id} className="flex cursor-pointer items-start gap-3 border-b border-dashed border-input py-2.5 last:border-b-0">
                    <Checkbox
                      className="mt-0.5"
                      checked={checked.has(s.id)}
                      onCheckedChange={(v) => toggle(s.id, v === true)}
                    />
                    <span className="flex-1 text-sm leading-snug">
                      <b>{s.name}</b> · {s.role}
                      {s.note ? <span className="block text-[0.76rem] text-muted-foreground">{s.note}</span> : null}
                    </span>
                    <span className={cn("whitespace-nowrap font-mono text-[0.78rem]", money ? "font-semibold text-primary" : "text-faint")}>
                      {s.price}
                    </span>
                  </label>
                )
              })}
            </div>
          ))}
        </div>

        <div className="border-t-2 border-input bg-secondary/60 px-6 py-5 text-center">
          <div className="font-serif text-[1.9rem] font-extrabold">
            US${usd} <small className="text-[0.95rem] font-semibold text-muted-foreground">/月固定</small>
          </div>
          <div className="mt-1 font-mono text-[0.78rem] text-muted-foreground">{extraText}</div>
        </div>
      </Card>

      {/* 在台灣，四件事不一樣 */}
      <section className="pt-16">
        <SectionHead>在台灣，四件事不一樣</SectionHead>
        <Accordion type="multiple" className="mt-4 space-y-2.5">
          {TW_ROWS.map((r) => (
            <AccordionItem key={r.v} value={r.v}>
              <AccordionTrigger>
                <r.icon className="size-[18px] shrink-0 text-draft" strokeWidth={1.6} />
                <b>{r.title}</b>
                <span className="text-[0.82rem] font-normal text-muted-foreground">{r.one}</span>
              </AccordionTrigger>
              <AccordionContent>{r.inner}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-4 text-[0.78rem] text-faint">價格以各官網為準。</p>
        <p className="mt-2 text-[0.84rem] text-muted-foreground">這一頁算的是你要花的錢。要跟使用者收多少錢，看<Link to="/guides/sell"><b>賣出去 →</b></Link>；每一項服務的細目，查<Link to="/guides/services"><b>服務價目總表 →</b></Link></p>
      </section>

      <Pager prev={["/look", "長什麼樣子"]} next={["/mindset", "心法"]} />
    </main>
  )
}
