import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { Map, Send, Signpost, HelpCircle, Store, ChefHat, Warehouse, ClipboardList, MapPin, Cloud, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager, FlowArrow, FlowNode } from "@/components/site"
import { cn } from "@/lib/utils"

const MAP = [
  {
    icon: Store,
    name: "店面",
    role: "你看到的畫面",
    chip: "前端 frontend",
    what: "打開網站後看到的每一個畫面、每一顆按鈕，都屬於店面。",
    broken: "畫面跑版、按鈕按了沒反應，多半是店面這一層出了問題。",
  },
  {
    icon: ChefHat,
    name: "廚房",
    role: "處理事情的邏輯",
    chip: "後端 backend",
    what: "客人看不到的後場，負責算錢、檢查資格、處理每一筆訂單。",
    broken: "按下去轉圈很久，最後跳出錯誤訊息，通常是廚房忙不過來。",
  },
  {
    icon: Warehouse,
    name: "倉庫",
    role: "存資料的地方",
    chip: "資料庫 database",
    what: "會員、訂單、商品這些資料，全部都收在倉庫裡留底。",
    broken: "資料不見了、或畫面一直顯示舊資料，就要回頭查倉庫。",
  },
  {
    icon: ClipboardList,
    name: "點餐單",
    role: "前後場溝通的格式",
    chip: "API",
    what: "店面和廚房講話要照固定格式，就像點餐單有固定的欄位。",
    broken: "畫面開得起來，但一按送出就報錯，常是單子的格式對不上。",
  },
  {
    icon: MapPin,
    name: "店址",
    role: "你的網址",
    chip: "網域 domain",
    what: "客人靠這串網址找到你。網址是用租的，要記得續約。",
    broken: "瀏覽器說找不到這個網站，多半是網址過期或設定跑掉了。",
  },
  {
    icon: Cloud,
    name: "開在哪",
    role: "租來的別人家電腦",
    chip: "雲端主機 ・ 部署 deploy",
    what: "整間店開在租來的機器上，機器壞了由房東負責修。把做好的店搬上去營業，行話叫部署。",
    broken: "所有人同時都連不上整個網站，通常就是這一層在出狀況。",
  },
]

const FLOW = [
  { n: "店面", say: "客人在店面選好要的東西，填完資料，按下送出。" },
  { n: "點餐單", say: "瀏覽器把客人填的內容，照固定格式寫成一張單子，送進後場。" },
  { n: "廚房", say: "後場收到單子，先檢查內容合不合理，再照規則處理這筆訂單。" },
  { n: "倉庫", say: "處理完的結果存進倉庫留底，之後隨時可以再查出來。" },
  { n: "回到店面", say: "後場回一張「完成了」的單子，畫面跟著更新，客人看到訂單成立。" },
]

export default function GuideHowItWorks() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 軟體怎麼運作
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">軟體怎麼運作</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">看懂你要買的東西，才不會被唬。</p>
      </header>

      {/* ============ 一間店的地圖 ============ */}
      <section id="map" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Map className="size-7 text-primary" strokeWidth={1.6} /></span>一間店的地圖</SectionHead>
        <Decide q={["讀法", "把一套軟體當成一間店來拆"]} a={["用途", "報價單上的名詞都對得回這張圖"]} />

        <p className="mt-5 text-sm text-muted-foreground">
          找人做軟體、跟 AI 講需求，其實都是在開一間店。點下面的部位，看每一層管什麼、壞掉時長什麼樣。
        </p>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {MAP.map((m, i) => {
            const Icon = m.icon
            const isOpen = open === i
            return (
              <button
                key={m.name}
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  "cursor-pointer self-start rounded-[10px] border-[1.5px] border-input bg-card px-4 py-3.5 text-left font-sans text-base shadow-sm transition-colors hover:border-draft",
                  isOpen && "border-primary hover:border-primary"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                  <b className="text-[0.95rem]">{m.name}</b>
                  <span className="text-[0.78rem] text-muted-foreground">{m.role}</span>
                  <ChevronDown className={cn("ml-auto size-4 shrink-0 text-faint transition-transform duration-200", isOpen && "rotate-180")} />
                </span>
                {isOpen && (
                  <span className="mt-3 block border-t border-dashed border-input pt-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="block">{m.what}</span>
                    <span className="mt-2.5 block"><Badge>技術名：{m.chip}</Badge></span>
                    <span className="mt-2.5 block"><b className="text-warn">壞掉時：</b>{m.broken}</span>
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">卡片裡的灰色標籤是技術原名，記不住可以直接跳過——之後聽到聽不懂的詞，去<Link to="/guides/glossary" className="text-draft">名詞小抄</Link>查就好。</p>
      </section>

      {/* ============ 按下送出之後 ============ */}
      <section id="flow" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Send className="size-7 text-primary" strokeWidth={1.6} /></span>按下送出之後</SectionHead>
        <Decide q={["場景", "客人送出一筆訂單"]} a={["看點", "資料繞完一圈才回到畫面"]} />

        <div className="mt-7 flex flex-wrap items-center gap-2.5" aria-label="一筆訂單的流程">
          {FLOW.map((f, i) => (
            <Fragment key={f.n}>
              {i > 0 && <FlowArrow />}
              <FlowNode>{f.n}</FlowNode>
            </Fragment>
          ))}
        </div>

        <Card className="mt-5 overflow-hidden">
          {FLOW.map((f) => (
            <div key={f.n} className="flex items-start gap-3.5 border-b border-border px-5 py-3.5 last:border-b-0">
              <b className="w-[4.8em] shrink-0 text-[0.9rem]">{f.n}</b>
              <span className="text-sm text-muted-foreground">{f.say}</span>
            </div>
          ))}
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">哪一步卡住，畫面上的症狀就不一樣。對照上面地圖裡每一層的「壞掉時」，大致就能猜到該找誰。</p>
      </section>

      {/* ============ 地圖與五個問題 ============ */}
      <section id="questions" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Signpost className="size-7 text-primary" strokeWidth={1.6} /></span>地圖與五個問題</SectionHead>
        <Decide q={["對應", "五個問題就是開店會遇到的決定"]} a={["提醒", "倉庫最難搬家，相關決定多想一步"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">那一題</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">用店來說</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">為什麼有關</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top"><Link to="/build" className="font-semibold text-primary">要寫程式嗎</Link></td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold">要不要自己開店</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">很多生意租現成的店面就夠了，不必真的自己蓋一間。</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top"><Link to="/app" className="font-semibold text-primary">要 APP 嗎</Link></td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold">路邊店還是進商場</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">網站像路邊店，客人路過就能走進來。APP 像進駐商場，上架要照商場的規矩。</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top"><Link to="/stack" className="font-semibold text-primary">用什麼做</Link></td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold">廚房裝備怎麼挑</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">挑的是廚房裝備和倉庫。倉庫最難搬家，要多想一步。</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top"><Link to="/look" className="font-semibold text-primary">長什麼樣子</Link></td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold">裝潢風格怎麼定</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">裝潢全在店面這一層，之後改風格不必動到廚房和倉庫。</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-4 py-3 align-top"><Link to="/cost" className="font-semibold text-primary">花多少錢</Link></td>
                  <td className="whitespace-nowrap px-4 py-3 align-top font-semibold">房租水電怎麼算</td>
                  <td className="px-4 py-3 align-top text-muted-foreground">開店要付房租水電，軟體每個月也有類似的固定開銷。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* ============ 常見誤會 ============ */}
      <section id="myths" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><HelpCircle className="size-7 text-primary" strokeWidth={1.6} /></span>常見誤會</SectionHead>
        <Decide q={["原則", "聽不懂的詞，請對方換成店的講法"]} a={["底線", "換不出來的人，可能自己也沒懂"]} />

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="web-vs-app">
            <AccordionTrigger>網站跟 APP 差在哪？</AccordionTrigger>
            <AccordionContent>
              <p>網站是客人路過就能走進來的店，用瀏覽器打開就好。APP 是要先裝進手機的店，客人得先去商店下載安裝。</p>
              <p className="mt-2">中間還有一條路，叫「裝在手機上的網頁」：用起來像 APP，本質還是網站，不用經過商店。</p>
              <p className="mt-2">大部分的生意，網站就夠了。什麼情況才真的需要 APP，<Link to="/app" className="text-primary"><b>要 APP 嗎</b></Link>那一頁有完整的判斷。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cloud">
            <AccordionTrigger>雲端到底是什麼？</AccordionTrigger>
            <AccordionContent>
              <p>雲端就是租來的別人家電腦。你不用買機器、不用顧機房，機器壞了由房東負責修。</p>
              <p className="mt-2">對小店來說，租用幾乎永遠是對的選擇。會自己養機器，通常只有一個理由：公司規定資料要放在自己家。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ai-code">
            <AccordionTrigger>AI 寫的程式放在哪、算誰的？</AccordionTrigger>
            <AccordionContent>
              <p>請 AI 動工前，先開好你自己帳號底下的程式碼保險箱，叫 AI 把程式存進去。保管的責任在你，不要假設 AI 公司會替你留一份。</p>
              <p className="mt-2">一般來說，AI 工具的條款會把寫出來的程式交給你使用。動工前掃一眼你用的那家的條款，最安心。</p>
              <p className="mt-2">真正要看好的是金鑰和客人的資料。這兩樣一旦外流，比程式碼被看走嚴重得多。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Pager prev={["/shelf", "書架"]} next={["/guides/ai", "跟 AI 一起做"]} />
    </main>
  )
}
