import { Link } from "react-router-dom"
import { Store, Bot, Shield, Package, Cable, Palette, Banknote, Smartphone, Rocket, Megaphone, Coins, NotebookText, ClipboardCopy, BookA, KeyRound, DoorClosed, TicketCheck, BellRing, ClipboardPen, Building2, Layers2, Map, Route, Brain, Gauge, Tag, Link2 } from "lucide-react"
import { Decide, Pager } from "@/components/site"
import type { LucideIcon } from "lucide-react"

type Book = { to: string; icon: LucideIcon; title: string; desc: string }

const SHELVES: { name: string; lead: string; books: Book[] }[] = [
  {
    name: "先看懂",
    lead: "動手之前，先看懂你要買的東西。",
    books: [
      { to: "/guides/how-it-works", icon: Store, title: "軟體怎麼運作", desc: "前端、後端、資料庫在做什麼，用一間店講給你聽。" },
      { to: "/guides/ai", icon: Bot, title: "跟 AI 一起做", desc: "你不用會寫程式，但要會交辦事情、會驗收。" },
      { to: "/guides/security", icon: Shield, title: "資安基本功", desc: "對手不是電影裡的駭客，是不挑對象的掃描機器人。" },
    ],
  },
  {
    name: "小教室",
    lead: "開工之後卡住的概念，一堂一堂補。",
    books: [
      { to: "/guides/keys", icon: KeyRound, title: "兩把鑰匙", desc: "一把可以給大家看，一把絕對不能。" },
      { to: "/guides/rls", icon: DoorClosed, title: "倉庫的門禁", desc: "公開金鑰敢公開，靠的全是這一層。" },
      { to: "/guides/migrations", icon: ClipboardPen, title: "倉庫的施工紀錄", desc: "倉庫改架子可以，但每一次都要留單。" },
      { to: "/guides/login", icon: TicketCheck, title: "登入之後", desc: "系統怎麼記得你是誰，為什麼會突然要你重登。" },
      { to: "/guides/oauth", icon: Building2, title: "借別人的櫃台", desc: "用 Google 登入時，網站連你的密碼都碰不到。" },
      { to: "/guides/webhooks", icon: BellRing, title: "誰在敲門", desc: "付款成功是誰通知你的，怎麼確認不是假冒。" },
      { to: "/guides/staging", icon: Layers2, title: "樣品屋與真店面", desc: "AI 給你看的樣本，不等於客人用得到的東西。" },
      { to: "/guides/cache", icon: Route, title: "改了怎麼沒變", desc: "不是沒改到，是你還在看影本。" },
      { to: "/guides/domains", icon: Tag, title: "網址是誰給的", desc: "平台先借你一個門牌，什麼時候該去換自己的。" },
      { to: "/guides/dns", icon: Map, title: "地圖還沒更新", desc: "剛綁的網址連不上，多半是各家地圖還沒更新。" },
      { to: "/guides/traffic", icon: Gauge, title: "網站塞車的時候", desc: "紅了不一定會倒，但要知道錢會從哪裡流。" },
      { to: "/guides/memory", icon: Brain, title: "AI 為什麼會忘記", desc: "不是它壞了，是工作桌滿了。" },
    ],
  },
  {
    name: "做出來",
    lead: "開工的時候，這三本放在手邊查。",
    books: [
      { to: "/guides/toolbox", icon: Package, title: "工具與 skill 索引", desc: "AI 能代勞什麼、現成資源去哪找，一次列好。" },
      { to: "/guides/integrations", icon: Cable, title: "串接指南", desc: "讓你的網站跟 Google 試算表、表單和 AI 接上線。" },
      { to: "/guides/style", icon: Palette, title: "風格細節", desc: "三套風格的完整規格，整段複製給 AI 就能動工。" },
    ],
  },
  {
    name: "開門做生意",
    lead: "要收錢、要上架、想經營得長久，讀這一排。",
    books: [
      { to: "/guides/payments", icon: Banknote, title: "金流指南", desc: "收台灣的錢、收海外的錢，發票和稅都在這裡。" },
      { to: "/guides/app-store", icon: Smartphone, title: "APP 上架", desc: "確定要做 APP 之後，攤開錢、時間和審查地雷。" },
      { to: "/guides/launch", icon: Rocket, title: "上線與維護", desc: "十項清單全勾才叫可以上線，之後照節奏保養。" },
      { to: "/guides/sell", icon: Megaphone, title: "賣出去", desc: "先算成本再定價，再用台灣的通路找到客人。" },
    ],
  },
  {
    name: "隨手查",
    lead: "這一排不用讀完，要用的時候翻。",
    books: [
      { to: "/guides/services", icon: Coins, title: "服務價目總表", desc: "四十多項服務收不收錢、什麼時候開始收，一頁查完。" },
      { to: "/guides/recipes", icon: NotebookText, title: "情境配方", desc: "十二個常見情境，答案和第一步都先寫好了。" },
      { to: "/guides/prompts", icon: ClipboardCopy, title: "指令範本", desc: "跟 AI 開工不用想台詞，整段複製就能用。" },
      { to: "/guides/glossary", icon: BookA, title: "名詞小抄", desc: "聽到聽不懂的詞，回來查一下就好。" },
      { to: "/guides/suffixes", icon: Link2, title: "網址後綴對照表", desc: "看到一串沒見過的網址，查它是哪一家、免不免費。" },
    ],
  },
]

export default function Shelf() {
  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <header className="pb-1 pt-11">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">書架</h1>
        <Decide q={["順序", "先看懂，再做出來，然後開門做生意"]} a={["原則", "成熟工具不重做，我們帶路"]} />
      </header>

      {SHELVES.map((s) => (
        <section key={s.name} className="pt-10">
          <div className="flex flex-wrap items-baseline gap-3 border-b-2 border-foreground pb-2.5">
            <h2 className="font-serif text-[1.5rem] font-extrabold tracking-wide">{s.name}</h2>
            <p className="text-[0.84rem] text-muted-foreground">{s.lead}</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 max-md:grid-cols-1">
            {s.books.map((b) => (
              <Link
                key={b.to}
                to={b.to}
                className="group relative rounded-lg border-[1.5px] border-input bg-card p-5 no-underline shadow-sm transition-all hover:-translate-y-1 hover:border-primary"
              >
                <b.icon className="size-6 text-draft transition-colors group-hover:text-primary" strokeWidth={1.6} />
                <b className="mt-2.5 block font-serif text-[1.15rem] font-bold">{b.title}</b>
                <p className="mt-1 text-[0.84rem] text-muted-foreground">{b.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <Pager prev={["/mindset", "心法"]} next={["/plan", "開始規劃"]} />
    </main>
  )
}
