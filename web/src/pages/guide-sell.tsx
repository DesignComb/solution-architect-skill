import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Calculator, Coins, Store, Sprout, Scale,
  MessageCircle, Users, MapPin, ShoppingBag, Search,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

const MODELS = [
  {
    name: "一次買斷",
    fit: "工具型的產品最適合，買回去就能一直用，之後也不太需要更新。",
    risk: "錢只收一次，維護卻是長期的事，更新久了會撐不下去。",
  },
  {
    name: "月訂閱",
    fit: "每個月都持續產生新價值的產品才收得動，例如一直有新資料進來。",
    risk: "價值一旦停了，下個月就是退訂潮。",
  },
  {
    name: "免費＋贊助",
    fit: "社群小工具走這條路，目的是幫到人、累積口碑。",
    risk: "用的人變多，帳單也跟著變大，所以一定要設用量上限。",
  },
]

const CHANNELS: { icon: LucideIcon; name: string; badge?: { text: string; ok?: boolean }; desc: string }[] = [
  {
    icon: MessageCircle,
    name: "LINE 官方帳號",
    badge: { text: "輕用量 0 元", ok: true },
    desc: "開帳號不用錢，每個月附 200 則主動推播。最適合經營已經跟你買過的老客人。",
  },
  {
    icon: Users,
    name: "Facebook 社團",
    desc: "你的客人早就聚在某幾個社團裡了。進去老實幫人解決問題，比下廣告更能找到第一批用戶。",
  },
  {
    icon: MapPin,
    name: "Google 商家檔案",
    desc: "有實體店面就一定要辦，客人搜地圖第一眼看到的就是它。登錄不用錢。",
  },
  {
    icon: ShoppingBag,
    name: "蝦皮或現成開店平台",
    desc: "賣實體商品就先上蝦皮這類平台，客人本來就在上面逛。平台抽成當作租金，租的是現成的人流。",
  },
  {
    icon: Search,
    name: "把網站標題寫成人話",
    badge: { text: "SEO・術語可跳過" },
    desc: "把網站標題從產品名，改成客人會搜的那句話，例如「台中 場地租借」。這是讓搜尋引擎找到你的基本盤。",
  },
]

const COLD = [
  { t: "找到 10 個會跟你說真話的真人用戶", d: "親友的「不錯啊」不算數，要找真的有這個困擾的人。" },
  { t: "當面看他用過一次，不要發問卷", d: "他在哪裡卡住、在哪裡皺眉，問卷上永遠看不到。" },
  { t: "開口請他付一杯手搖飲的錢", d: "他不肯付，代表價值或定價有一個錯了，回頭重想。" },
]

function num(s: string): number {
  const x = parseFloat(s)
  return Number.isFinite(x) && x > 0 ? x : 0
}
function fmt(x: number): string {
  return x.toLocaleString("zh-TW", { maximumFractionDigits: 2 })
}

export default function GuideSell() {
  const [fixed, setFixed] = useState("")
  const [unit, setUnit] = useState("")
  const [uses, setUses] = useState("")
  const [done, setDone] = useState<Set<number>>(new Set())

  const F = num(fixed)
  const perUser = num(unit) * num(uses)
  const hasCost = perUser > 0
  const floor = Math.ceil(perUser * 3)
  const margin = floor - perUser
  const breakEven = hasCost && F > 0 ? Math.ceil(F / margin) : 0
  const all = done.size === COLD.length

  function toggle(i: number, v: boolean) {
    setDone((prev) => {
      const next = new Set(prev)
      if (v) next.add(i); else next.delete(i)
      return next
    })
  }

  const fields = [
    { label: "每月固定支出（元）", hint: "主機、網域、工具訂閱這些每個月固定要繳的錢。", val: fixed, set: setFixed },
    { label: "每次使用的變動成本（元）", hint: "AI 功能每叫一次都是錢。沒有這種功能就填 0。", val: unit, set: setUnit },
    { label: "每位用戶每月使用次數", hint: "抓個大概就好，上線之後再回來修。", val: uses, set: setUses },
  ]

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 賣出去
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">賣出去</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">做出來只是一半，賣出去才是真的。</p>
      </header>

      {/* ============ 定價從成本算起 ============ */}
      <section id="pricing" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Calculator className="size-7 text-primary" strokeWidth={1.6} /></span>定價從成本算起</SectionHead>
        <Decide q={["順序", "先算成本，再談定價"]} a={["下限", "每位用戶的成本，抓三倍起跳"]} />

        <Card className="mt-6 p-6 max-sm:p-5">
          <div className="grid gap-4 md:grid-cols-3">
            {fields.map((f) => (
              <label key={f.label} className="block">
                <b className="text-[0.88rem]">{f.label}</b>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  className="mt-2 w-full rounded-lg border-[1.5px] border-input bg-card px-4 py-3 text-[0.95rem] outline-none focus:border-primary"
                />
                <span className="mt-1.5 block text-[0.76rem] text-muted-foreground">{f.hint}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border-[1.5px] border-input bg-secondary/60 px-5 py-4">
              <span className="font-mono text-[0.68rem] tracking-wider text-muted-foreground">每位用戶每月成本</span>
              <b className="mt-1 block font-serif text-[1.7rem] leading-tight">
                {fmt(perUser)} <small className="text-[0.9rem] font-normal text-muted-foreground">元</small>
              </b>
            </div>
            <div className="rounded-lg border-[1.5px] border-primary/40 bg-primary/8 px-5 py-4">
              <span className="font-mono text-[0.68rem] tracking-wider text-primary">建議定價下限</span>
              <b className="mt-1 block font-serif text-[1.7rem] leading-tight text-primary">
                {hasCost ? <>{fmt(floor)} <small className="text-[0.9rem] font-normal">元／月 起</small></> : "—"}
              </b>
            </div>
          </div>

          <div className="mt-4 space-y-1.5 text-[0.85rem] text-muted-foreground">
            {hasCost && F > 0 && (
              <p>照這個定價，每收一位用戶會留下 {fmt(margin)} 元。大約收滿 {breakEven.toLocaleString("zh-TW")} 位付費用戶，才蓋得過每月固定支出。</p>
            )}
            {hasCost && F === 0 && (
              <p>照這個定價，每收一位用戶會留下 {fmt(margin)} 元。固定支出是 0，從第一位付費用戶開始就是賺的。</p>
            )}
            {!hasCost && num(unit) > 0 && (
              <p>再填上每位用戶每月的使用次數，就能算出每位用戶的成本。</p>
            )}
            {!hasCost && num(unit) === 0 && (
              <p>還算不出每位用戶的成本時，先看固定支出。定價自己訂，再用固定支出除以定價，就能算出要幾位付費用戶才打平。</p>
            )}
            <p>抓三倍不是貪心。刷卡手續費、免費方案被用掉的量、你自己花的時間，都要從這段差額裡出。</p>
          </div>
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">先算成本再定價，順序不能反。反過來的人常常在賠本賣，自己還不知道。</p>
      </section>

      {/* ============ 收費方式三選一 ============ */}
      <section id="models" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Coins className="size-7 text-primary" strokeWidth={1.6} /></span>收費方式三選一</SectionHead>
        <Decide q={["方法", "看你的產品像哪一種"]} a={["鐵則", "免費方案一定要設用量上限"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">收費方式</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">適合的產品</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">要小心的風險</th>
                </tr>
              </thead>
              <tbody>
                {MODELS.map((m, i) => {
                  const last = i === MODELS.length - 1
                  return (
                    <tr key={m.name}>
                      <td className={cn("whitespace-nowrap border-border px-4 py-3 align-top font-semibold", !last && "border-b")}>{m.name}</td>
                      <td className={cn("border-border px-4 py-3 align-top text-muted-foreground", !last && "border-b")}>{m.fit}</td>
                      <td className={cn("border-border px-4 py-3 align-top text-muted-foreground", !last && "border-b")}>{m.risk}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">不管選哪一種，免費方案都要設用量上限。最熱情的免費用戶，往往就是燒掉最多成本的人。</p>
      </section>

      {/* ============ 台灣的通路 ============ */}
      <section id="channels" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Store className="size-7 text-primary" strokeWidth={1.6} /></span>台灣的通路</SectionHead>
        <Decide q={["原則", "去客人已經在的地方"]} a={["起手", "不用錢的通路先用滿"]} />

        <div className="mt-5 grid gap-2.5">
          {CHANNELS.map((c) => (
            <div key={c.name} className="flex items-start gap-3.5 rounded-[10px] border-[1.5px] border-input bg-card px-4 py-3.5 shadow-sm">
              <c.icon className="mt-1 size-5 shrink-0 text-draft" strokeWidth={1.6} />
              <div>
                <span className="flex flex-wrap items-center gap-2">
                  <b className="text-[0.95rem]">{c.name}</b>
                  {c.badge && <Badge variant={c.badge.ok ? "ok" : "default"}>{c.badge.text}</Badge>}
                </span>
                <p className="mt-0.5 text-[0.85rem] text-muted-foreground">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 找第一批客人 ============ */}
      <section id="coldstart" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Sprout className="size-7 text-primary" strokeWidth={1.6} /></span>找第一批客人<Badge className="ml-3 align-middle">冷啟動・術語可跳過</Badge></SectionHead>
        <Decide q={["目標", "先找 10 個會說真話的人"]} a={["方法", "當面看他用，不要發問卷"]} />

        <Card className="mt-6 overflow-hidden">
          <div>
            {COLD.map((c, i) => (
              <label key={i} className={cn("flex cursor-pointer items-start gap-3.5 border-b border-border px-5 py-3.5 last:border-b-0 hover:bg-secondary/40", done.has(i) && "opacity-70")}>
                <Checkbox className="mt-1" checked={done.has(i)} onCheckedChange={(v) => toggle(i, v === true)} />
                <span>
                  <b className={cn("block text-[0.95rem]", done.has(i) && "line-through decoration-ok/60")}>{i + 1}. {c.t}</b>
                  <span className="text-[0.78rem] text-muted-foreground">{c.d}</span>
                </span>
              </label>
            ))}
          </div>
          <div className={cn(
            "border-t-2 px-5 py-4 text-center font-serif text-[1.15rem] font-extrabold tracking-widest transition-colors",
            all ? "border-ok bg-ok/10 text-ok" : "border-input bg-secondary/60 text-faint"
          )}>
            {all ? "三件都做過 ✓ 可以開始想放大了" : "先做完這三件事，再談廣告"}
          </div>
        </Card>

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          <AccordionItem value="ads">
            <AccordionTrigger>什麼時候才輪到打廣告？</AccordionTrigger>
            <AccordionContent>
              <p>留住率還沒站穩之前，打廣告就是往漏水的桶子倒水。錢會把人帶進來，桶子照樣把人漏光。</p>
              <p className="mt-2">先確認兩件事：有人留下來，而且有人自己回頭用。這兩件事成立之後，廣告才是放大器。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 收尾連結＋來源 ============ */}
      <section className="pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-[1.5px] border-dashed border-input bg-card px-5 py-4 shadow-sm">
          <p className="text-[0.9rem] text-muted-foreground">這一頁講的是怎麼賣。真的要開始收錢的時候，刷卡、轉帳、發票的技術細節都在金流指南裡。</p>
          <Button asChild variant="outline"><Link to="/guides/payments" className="no-underline">看金流指南 →</Link></Button>
        </div>

        <div className="mt-4 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <Scale className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          LINE 官方帳號方案價格 2026-08-24 實查，以官網公告為準。「成本抓三倍」是給起步者的經驗法則，不是市場公定價。
        </div>
      </section>

      <Pager prev={["/guides/launch", "上線與維護"]} next={["/guides/services", "服務價目總表"]} />
    </main>
  )
}
