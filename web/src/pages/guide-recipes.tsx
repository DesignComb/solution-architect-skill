import { useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen, Search, Scale } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

const TAGS = ["要收錢", "預約報名", "內部管理", "內容展示", "通知"] as const
type Tag = (typeof TAGS)[number]
const CHIPS = ["全部", ...TAGS] as const

type Recipe = {
  id: string
  name: string
  desc: string
  tags: Tag[]
  verdict: string
  combo: string
  monthly: string
  first: React.ReactNode
}

const RECIPES: Recipe[] = [
  {
    id: "fee",
    name: "社區收管理費",
    desc: "管委會收錢老是對不起來，催繳全靠人工。",
    tags: ["要收錢", "內部管理"],
    verdict: "收費紀錄本質是一份追蹤表，先用 Google 試算表管就好。想讓住戶自己上網查繳費狀態，才值得做網站。",
    combo: "Google 試算表記帳，搭配 LINE 官方帳號發繳費提醒。",
    monthly: "幾乎免費。LINE 官方帳號輕用量每月 NT$0，含 200 則主動推播。",
    first: <>先開一份試算表，把住戶和月份列成表格。想讓住戶自己查繳費，就帶著情境去<Link to="/plan" className="text-primary"><b>開始規劃</b></Link>。</>,
  },
  {
    id: "booking",
    name: "場地或教室預約",
    desc: "檔期用訊息一個一個喬，還常常撞在一起。",
    tags: ["預約報名"],
    verdict: "先用 Calendly 或 SimplyBook 這類現成預約服務。要跟自家會員或金流深度整合，才值得自己做。",
    combo: "Calendly 或 SimplyBook 開放時段，把預約連結貼給客人。",
    monthly: "幾乎免費，喬時間這件事不值得花錢。",
    first: "去 Calendly 開帳號，把可以被預約的時段設定好。",
  },
  {
    id: "shop",
    name: "小量網拍",
    desc: "想賣幾十樣東西，還不想自己搞一個網站。",
    tags: ["要收錢"],
    verdict: "先上蝦皮或 SHOPLINE 這類現成開店平台。抽成和月費高過自建成本，或想完全掌控體驗與資料，再自己做。",
    combo: "蝦皮賣場當店面，再用 LINE 官方帳號經營回頭客。",
    monthly: "固定月費幾乎是零，平台的抽成就當作店面租金。",
    first: "去蝦皮開一個賣場，先上十樣商品試水溫。",
  },
  {
    id: "menu",
    name: "餐廳菜單與線上點餐",
    desc: "客人整天打電話問菜單，還想先點餐再來拿。",
    tags: ["內容展示", "通知"],
    verdict: "不用寫程式，更不用做 APP。菜單放一頁式網頁就夠，點餐先用 LINE 官方帳號收單。",
    combo: "Canva 做一頁菜單網頁，LINE 官方帳號接點餐訊息。",
    monthly: "幾乎免費。客人先開口的 LINE 回覆訊息不計費、也不限量。",
    first: "先用 Canva 把菜單排成一頁網頁，連結放進 LINE 官方帳號。",
  },
  {
    id: "course",
    name: "開課報名與收費",
    desc: "開課要收報名資料，還要一個一個跟人收錢。",
    tags: ["預約報名", "要收錢"],
    verdict: "報名收資料先用 Google 表單或 Tally。要線上刷卡再申請金流，個人身分也能申請綠界。",
    combo: "Google 表單收報名資料，學費用綠界的刷卡服務收。",
    monthly: "綠界無月費，國內刷卡 2.75%，每筆最低 NT$5，另加訂單處理費 NT$1。",
    first: "先開表單把報名欄位列好，要刷卡再去綠界申請一般賣家。",
  },
  {
    id: "members",
    name: "社團會員名單",
    desc: "會員資料散在好幾個人的手機和筆記裡。",
    tags: ["內部管理"],
    verdict: "先用 Notion 或 Google 試算表建一份共用名單。多人同時改到資料亂掉、需要權限控管，才值得自建。",
    combo: "一份共用的 Notion 資料庫或試算表，全社團看同一份。",
    monthly: "幾乎免費，一份名單用不到任何付費方案。",
    first: "把名單搬進共用文件，指定一個人負責管欄位。",
  },
  {
    id: "portfolio",
    name: "個人作品集",
    desc: "想要一個放作品的網址，可以直接傳給客戶。",
    tags: ["內容展示"],
    verdict: "先用 Canva 網站或 Google Sites 這類現成服務。想掛自己的網域、要自訂互動，再做靜態網頁，門檻本來就低。",
    combo: "之後自建時，靜態網頁放 Cloudflare Pages 或 GitHub Pages，掛上自己的網域。",
    monthly: "自建後部署免費。想要自己的網址，.com 網域一年約 US$10–15。",
    first: "先挑三件代表作，用 Canva 網站排成一頁放上網。",
  },
  {
    id: "company",
    name: "公司形象官網",
    desc: "公司需要一個像樣的官網，但內容不常更新。",
    tags: ["內容展示"],
    verdict: "內容幾乎不改，先用現成的一頁式網站服務。要掛公司網域、要看流量分析，就做便宜的靜態網頁。",
    combo: "靜態網站放 Cloudflare Pages，配上公司自己的網域。",
    monthly: "部署免費。.com 網域一年約 US$10–15，.tw 行情一年 NT$550–800。",
    first: <>把公司簡介和照片整理好，帶著這個情境去<Link to="/plan" className="text-primary"><b>開始規劃</b></Link>。</>,
  },
  {
    id: "event",
    name: "一次性活動報名頁",
    desc: "辦一場活動，需要一頁介紹加上報名表。",
    tags: ["預約報名", "內容展示"],
    verdict: "完全不用寫程式。活動頁用 Canva 網站，報名用 Google 表單，辦完就收。",
    combo: "Canva 一頁活動網站，報名按鈕連到 Google 表單。",
    monthly: "幾乎免費，辦完活動也沒有後續的固定支出。",
    first: "先把活動資訊排成一頁，報名連結放在最顯眼的位置。",
  },
  {
    id: "inventory",
    name: "小公司進銷存",
    desc: "進出貨靠紙本和記憶在管，月底盤點很痛苦。",
    tags: ["內部管理"],
    verdict: "先用 Google 試算表或 Airtable 撐著，把欄位磨清楚。多人同時改會亂、要權限控管時，再自建網頁系統。",
    combo: "主流網頁框架（Next.js 或 Nuxt）做畫面，資料和登入交給 Supabase。",
    monthly: "自建後固定月費約 US$20，就是 AI 開發助手的訂閱，網域另計。",
    first: <>先用試算表管一個月，確定欄位。撞到多人同改的牆，再帶著情境去<Link to="/plan" className="text-primary"><b>開始規劃</b></Link>。</>,
  },
  {
    id: "wiki",
    name: "讀書會知識庫",
    desc: "讀書會的筆記四散各處，想集中放在一個地方。",
    tags: ["內容展示"],
    verdict: "用 Notion 公開頁就夠，不用寫程式。要全文搜尋、多語或自訂樣式，才值得做成文件網站。",
    combo: "一個設成公開的 Notion 頁面，筆記全部收在裡面。",
    monthly: "幾乎免費，筆記這種量級用不到付費方案。",
    first: "開一個 Notion 公開頁，先把最近三次的筆記貼上去。",
  },
  {
    id: "line-notify",
    name: "用 LINE 自動通知客人",
    desc: "想在出貨或預約前一天，自動傳訊息提醒客人。",
    tags: ["通知"],
    verdict: "不用做 APP。台灣使用者黏在 LINE 上，正確答案是 LINE 官方帳號加訊息串接。",
    combo: "LINE 官方帳號加上訊息串接（Messaging API），串接本體完全免費。",
    monthly: "輕用量每月 NT$0，含 200 則主動推播；不夠再升中用量每月 NT$800，含 3,000 則。",
    first: "先開 LINE 官方帳號，估每月要主動傳幾則，200 則內就免費。",
  },
]

function Row({ k, accent, children }: { k: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className={cn("w-[64px] shrink-0 pt-[3px] font-mono text-[0.66rem] tracking-wider", accent ? "text-primary" : "text-faint")}>{k}</span>
      <span className="text-[0.88rem] leading-relaxed">{children}</span>
    </div>
  )
}

export default function GuideRecipes() {
  const [tag, setTag] = useState<(typeof CHIPS)[number]>("全部")
  const [q, setQ] = useState("")

  const query = q.trim().toLowerCase()
  const shown = RECIPES.filter((r) => {
    if (tag !== "全部" && !r.tags.includes(tag)) return false
    if (query === "") return true
    return (r.name + r.desc + r.verdict + r.combo + r.monthly + r.tags.join("")).toLowerCase().includes(query)
  })

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 情境配方
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">情境配方</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">先找像你的情境，答案通常已經寫好了。</p>
      </header>

      {/* ============ 十二個情境 ============ */}
      <section id="recipes" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><BookOpen className="size-7 text-primary" strokeWidth={1.6} /></span>十二個情境</SectionHead>
        <Decide q={["用法", "點分類或直接搜，找最像你的那一張"]} a={["提醒", "很多情境的誠實答案是現成服務"]} />

        {/* 篩選 chip */}
        <div className="mt-5 flex flex-wrap gap-2">
          {CHIPS.map((c) => {
            const on = c === tag
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setTag(c)}
                className={cn(
                  "cursor-pointer rounded-full border-[1.5px] border-input bg-card px-3.5 py-1.5 text-[0.82rem] font-medium transition-colors hover:border-primary",
                  on && "border-primary bg-primary/8 text-primary"
                )}
              >
                {c}
              </button>
            )
          })}
        </div>

        {/* 搜尋 */}
        <div className="mt-3 flex items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" strokeWidth={1.6} />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜情境，例如收錢、預約、菜單"
              className="w-full rounded-lg border-[1.5px] border-input bg-card py-3 pl-10 pr-4 text-[0.95rem] outline-none focus:border-primary"
            />
          </div>
          <span className="whitespace-nowrap font-mono text-[0.72rem] text-faint">符合 {shown.length}/{RECIPES.length}</span>
        </div>

        {shown.length === 0 ? (
          <p className="mt-5 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-4 text-[0.9rem] text-muted-foreground">
            沒有找到符合的情境。換個講法再搜一次，或帶著你的情境去<Link to="/plan" className="text-primary"><b>開始規劃</b></Link>。
          </p>
        ) : (
          <Accordion type="multiple" className="mt-5 space-y-2.5">
            {shown.map((r) => (
              <AccordionItem key={r.id} value={r.id}>
                <AccordionTrigger>
                  <span className="min-w-0 flex-1">
                    <b className="block text-[0.95rem]">{r.name}</b>
                    <span className="text-[0.8rem] font-normal text-muted-foreground">{r.desc}</span>
                  </span>
                  <span className="ml-3 hidden shrink-0 gap-1.5 md:flex">
                    {r.tags.map((t) => <Badge key={t}>{t}</Badge>)}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <Row k="判定">{r.verdict}</Row>
                    <Row k="組合">{r.combo}</Row>
                    <Row k="每月大約">{r.monthly}</Row>
                    <Row k="第一步" accent>{r.first}</Row>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>

      {/* ============ 來源 ============ */}
      <section className="pt-12">
        <div className="rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <Scale className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          價格與費率為 2026-08-24 查證，多為未稅價，實際以各服務官網公告為準。
        </div>
      </section>

      <Pager prev={["/guides/services", "服務價目總表"]} next={["/guides/prompts", "指令範本"]} />
    </main>
  )
}
