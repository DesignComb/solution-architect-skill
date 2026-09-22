import { Link } from "react-router-dom"
import { Palette, Layers, Package, Rocket } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { QSteps, Decide, Pager } from "@/components/site"

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <code className="mt-2 inline-block rounded-md border border-input bg-secondary px-2 py-0.5 font-mono text-[0.68rem] text-muted-foreground">
      {children}
    </code>
  )
}

type Alt = { dt: string; main: string; why?: string; chip: string }

const PICKERS: {
  icon: typeof Palette
  title: string
  main: string
  why: string
  chip: string
  alts: Alt[]
}[] = [
  {
    icon: Palette,
    title: "畫面（前端）",
    main: "用最主流的全能工具組",
    why: "網路上範例最多，AI 也最會寫",
    chip: "Next.js（React）或 Nuxt（Vue）",
    alts: [
      { dt: "只是要做個展示頁", main: "做成純頁面就好", why: "— 沒有機器要顧", chip: "Astro／純 HTML" },
      { dt: "文章多、要被 Google 找到", main: "用內容優先的架站工具", chip: "Astro" },
    ],
  },
  {
    icon: Layers,
    title: "資料與規則（後端）",
    main: "不自己蓋，租現成的",
    why: "資料庫、登入、檔案一次給齊",
    chip: "Supabase",
    alts: [
      { dt: "有計價、排程等自訂規則", main: "規則寫在框架裡，資料照租", chip: "Next/Nuxt ＋ Supabase" },
      { dt: "要即時同步、重度使用 Google 服務", main: "也可以用 Firebase", why: "— 帳單沒有上限，之後搬家也難", chip: "Firebase" },
      { dt: "要跑 AI、大量運算", main: "另租一台小機器", chip: "Python ＋ Railway／Render" },
      { dt: "被要求資料放自己家", main: "自己租主機自己顧", why: "— 記得把維護時間算進成本", chip: "VPS ＋ Docker" },
    ],
  },
  {
    icon: Package,
    title: "資料庫",
    main: "用業界標準的資料庫，一顆全包",
    why: "一般資料、搜尋、AI 記憶都裝得下",
    chip: "PostgreSQL（Supabase 內建）",
    alts: [
      { dt: "AI 搜尋要另外買嗎？", main: "內建的就夠", chip: "pgvector" },
      { dt: "圖片和檔案要放哪裡？", main: "租一個雲端櫃子", why: "— 被大量下載也不收流量費", chip: "Cloudflare R2／Supabase" },
    ],
  },
  {
    icon: Rocket,
    title: "上線（部署）",
    main: "存檔就自動上線",
    why: "Vercel 免費版不能商用，要商用就選 Cloudflare",
    chip: "Cloudflare 或 Vercel",
    alts: [
      { dt: "另外租的小機器要放哪裡？", main: "交給代管服務，不用自己顧機器", why: "— US$5–7/月", chip: "Railway／Render" },
      { dt: "想要自己的網址", main: "這是少數一定要花的錢", why: "— 一年約 US$10–15，比價時要看續約價", chip: "Cloudflare／Namecheap" },
    ],
  },
]

export default function Stack() {
  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <header className="pb-1 pt-11">
        <QSteps current={3} />
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">
          用什麼做？
        </h1>
        <Decide q={["原則", "你會的工具，贏過最潮的工具 ・ 零件越少越好"]} a={["推薦", "照預設組合"]} />
      </header>

      {/* 名詞小抄 */}
      <div className="mt-5 rounded-r-lg border-l-[3px] border-input bg-secondary/60 px-4 py-2.5 text-[0.82rem] text-muted-foreground [&_b]:text-foreground">
        小抄：<b>前端</b>＝畫面 ・ <b>後端</b>＝資料與規則 ・ <b>部署</b>＝放上網路 ・ <b>框架</b>＝現成骨架。灰色標籤是給 AI 看的，可以跳過。
      </div>

      {/* 四張選型卡 */}
      <div className="mt-6 grid grid-cols-2 gap-4 max-md:grid-cols-1">
        {PICKERS.map((p) => (
          <Card key={p.title} className="overflow-hidden">
            <CardHeader className="flex-row items-center gap-2.5">
              <p.icon className="size-[18px] text-draft" strokeWidth={1.6} />
              <CardTitle className="font-serif text-[1.05rem]">{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-[0.58rem] tracking-widest text-ok">推薦</div>
              <b className="mt-1 block text-[1.02rem]">{p.main}</b>
              <span className="mt-0.5 block text-[0.82rem] text-muted-foreground">{p.why}</span>
              <Chip>{p.chip}</Chip>

              <Accordion type="multiple" className="mt-4">
                <AccordionItem value="alt" className="rounded-none border-0 border-t border-dashed bg-transparent shadow-none">
                  <AccordionTrigger className="px-0 py-2.5 text-[0.85rem]">特殊情況</AccordionTrigger>
                  <AccordionContent className="border-0 px-0 pb-0">
                    <dl className="space-y-3">
                      {p.alts.map((alt) => (
                        <div key={alt.dt}>
                          <dt className="text-[0.78rem] font-semibold text-foreground">{alt.dt}</dt>
                          <dd className="mt-0.5">
                            <b>{alt.main}</b>
                            {alt.why && <span className="text-faint"> {alt.why}</span>}
                            <br />
                            <Chip>{alt.chip}</Chip>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 公式條 */}
      <div className="mt-6 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-6 py-4 text-center font-mono text-[0.9rem]">
        不到一萬人用，就想上「大公司那套」，一律<b className="text-primary">打回，用最簡單的做法</b>
      </div>

      {/* 延伸閱讀 */}
      <Accordion type="multiple" className="mt-4 space-y-2.5">
        <AccordionItem value="supabase-firebase">
          <AccordionTrigger>Supabase 和 Firebase 怎麼選？</AccordionTrigger>
          <AccordionContent>
            <p>
              <b>資料像表格（訂單屬於會員），選 Supabase</b>：它是標準資料庫，之後要搬家，一個指令就帶得走。<br />
              <b>要做即時聊天協作、重度使用 Google，選 Firebase</b>：整個生態用起來順，但帳單沒有上限，資料格式之後搬家會很痛。<br />
              更多二選一的比較（含例子）都在<Link to="/guides/toolbox"><b>工具索引 →</b></Link>；
              每一項服務收不收錢，查<Link to="/guides/services"><b>服務價目總表 →</b></Link>
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="how-it-works">
          <AccordionTrigger>前端後端這些詞還是霧霧的？</AccordionTrigger>
          <AccordionContent>
            <p>沒關係，很多人都是。書架上有一本用開店比喻講完的入門書：<Link to="/guides/how-it-works"><b>軟體怎麼運作 →</b></Link></p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Pager prev={["/app", "要 APP 嗎"]} next={["/look", "長什麼樣子"]} />
    </main>
  )
}
