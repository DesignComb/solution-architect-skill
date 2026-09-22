import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Palette, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager, MiniUI } from "@/components/site"
import { cn } from "@/lib/utils"

type StyleKind = "clean" | "editorial" | "warm"

/* 灰色小 chip：給 AI 看的技術原名 */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-input bg-secondary px-1.5 py-0.5 font-mono text-[0.72rem] text-muted-foreground whitespace-nowrap">
      {children}
    </code>
  )
}

/* 通用反 AI 味清單：前五條頁面與複製共用，第六條各自收尾 */
const ANTI_COMMON = [
  "不要用紫色到藍色的漸層當主視覺。",
  "不要只寫英文字體（Inter、Roboto 這類）。中文內容一定要指定中文字體。",
  "首頁不要用置中大標、兩顆按鈕、三欄卡片的預設排法。至少換一種構圖，例如左右不對稱、雜誌式或清單式。",
  "圖示只用一套、只用單色，顏色跟著強調色走。",
  "空白頁、載入中和出錯的畫面，也要走同一套風格。",
]
const ANTI_PAGE = [...ANTI_COMMON, "把選好的整段規格連同需求一起交給 AI，並且明講要避免模板臉。"]
const ANTI_COPY = [...ANTI_COMMON, "規格沒寫到的畫面，照同一套風格的邏輯延伸，不要退回通用模板。"]

type StyleSpec = {
  name: string
  tab: string
  vibe: string
  fit: string
  rows: { k: string; v: React.ReactNode }[]
  copy: string[]
}

const ORDER: StyleKind[] = ["clean", "editorial", "warm"]

const SPECS: Record<StyleKind, StyleSpec> = {
  clean: {
    name: "俐落",
    tab: "像好用的工具",
    vibe: "乾淨、專業，像一件好用的工具。",
    fit: "適合做後台、內部工具和管理系統。",
    rows: [
      { k: "字體", v: <>整站用乾淨的黑體字，標題只靠粗細和大小分層。中文字體要指定清楚，不能只寫英文字體名。 <Chip>Noto Sans TC</Chip> <Chip>PingFang TC</Chip></> },
      { k: "色彩", v: <>底色接近白、文字接近黑，中間都用灰階。再挑一個你喜歡的顏色當品牌色，全站只用這一個強調色。</> },
      { k: "形狀", v: <>圓角小小的就好（6–8px），邊框用細細的線（1px）。陰影要極輕，或乾脆不用。</> },
      { k: "密度", v: <>資訊可以排得密，但每一欄都要對得整整齊齊。表格和清單就是這套風格的主角。</> },
      { k: "元件庫", v: <>畫面用現成的元件庫來拼，不需要從零自己畫。 <Chip>shadcn/ui</Chip> <Chip>Tailwind CSS</Chip></> },
      { k: "禁止", v: <>不要漸層，不要五顏六色的圖示，也不要大片的彩色色塊。</> },
    ],
    copy: [
      "字體：無襯線系統字；中文必須指定 Noto Sans TC 或 PingFang TC；標題只靠字重與大小分層，不加花樣。",
      "色彩：中性灰階打底（近白底、近黑字）＋一個強調色（品牌色要用哪個顏色，先問我）。",
      "形狀：小圓角（6–8px）、1px 細邊框、陰影極輕或不用。",
      "密度：資訊可以密，但對齊要嚴格；表格、清單是主角。",
      "元件庫：shadcn/ui（React）或 shadcn-vue；搭配 Tailwind CSS。",
      "禁止：漸層、五顏六色的圖示、彩色大色塊。",
    ],
  },
  editorial: {
    name: "雜誌",
    tab: "像一本刊物",
    vibe: "有質感，像一本刊物或品牌型錄。",
    fit: "適合做官網、內容展示和作品集。",
    rows: [
      { k: "字體", v: <>標題用襯線字，就是報紙標題那種字；內文用黑體。標題大膽放大，行距放鬆。 <Chip>Noto Serif TC</Chip> <Chip>Georgia</Chip></> },
      { k: "色彩", v: <>底色用紙的顏色，暖白或米色都可以；文字用墨色。強調色挑一個有印刷感的顏色，像磚紅或深綠。</> },
      { k: "形狀", v: <>用直角，或小到幾乎看不出來的圓角。區隔靠細分隔線和留白，不要鋪滿一格一格的卡片。</> },
      { k: "密度", v: <>留白本身就是設計，不要捨不得空。一個畫面只講一件事。</> },
      { k: "元件庫", v: <>這一套通常不需要元件庫，請 AI 直接用樣式工具排版。 <Chip>Tailwind CSS</Chip></> },
      { k: "禁止", v: <>不要彩色漸層，不要圓角卡片牆，也不要置中的三欄功能區。</> },
    ],
    copy: [
      "字體：襯線標題（Noto Serif TC；英文用 Georgia 系）配無襯線內文；標題大膽放大、行距放鬆。",
      "色彩：紙感底色（暖白、米色）、墨色文字＋一個飽和強調色（磚紅、深綠這類印刷感的顏色）。",
      "形狀：直角或極小圓角；用細分隔線與留白做區隔，不要滿版卡片格。",
      "密度：留白就是設計；一屏只講一件事。",
      "元件庫：Tailwind CSS 自組（排長文可加 Typography 外掛）；通常不需要元件庫。",
      "禁止：彩色漸層、圓角卡片牆、置中三欄功能區。",
    ],
  },
  warm: {
    name: "溫暖",
    tab: "有生活感",
    vibe: "圓潤、親切，很有生活感。",
    fit: "適合做社群、親子、餐飲和生活服務。",
    rows: [
      { k: "字體", v: <>用黑體，但標題要粗，字重抓 700 以上。標題可以用圓圓的字型，看起來比較有精神。 <Chip>Noto Sans TC</Chip></> },
      { k: "色彩", v: <>底色用奶油色或暖白，再搭兩三個低飽和的暖色，像蜜桃、薄荷、奶茶。文字用深棕或深綠，不要用純黑。</> },
      { k: "形狀", v: <>圓角開大（14–20px），搭實色色塊和柔和的陰影。可愛但不要幼稚，表情符號不要貼滿整頁。</> },
      { k: "密度", v: <>排版放寬鬆，按鈕做大，點擊範圍也要大。要讓長輩和小孩都按得到。</> },
      { k: "元件庫", v: <>用現成的元件庫，或請 AI 用樣式工具自己組。 <Chip>DaisyUI</Chip> <Chip>Tailwind CSS</Chip></> },
      { k: "禁止", v: <>不要企業灰，不要細線框，也不要高冷的極簡風。</> },
    ],
    copy: [
      "字體：無襯線、標題字重 700 以上；中文用 Noto Sans TC，標題可用圓體感字型。",
      "色彩：奶油或暖白底＋2–3 個低飽和暖色（蜜桃、薄荷、奶茶）；文字用深棕或深綠，不用純黑。",
      "形狀：大圓角（14–20px）、實色塊、柔和陰影；可愛但不幼稚，不要貼滿表情符號。",
      "密度：寬鬆、大按鈕、大點擊區——長輩與小孩也好按。",
      "元件庫：DaisyUI 或 Tailwind CSS 自組。",
      "禁止：企業灰、細線框、高冷的極簡。",
    ],
  },
}

function buildCopyText(kind: StyleKind): string {
  const s = SPECS[kind]
  const lines: string[] = [
    "請照以下風格規格實作，避免通用 AI 模板臉：",
    "",
    `【風格：${s.name}】${s.vibe}${s.fit}`,
    ...s.copy.map((l) => `- ${l}`),
    "",
    "【通用反 AI 味清單】每一條都要遵守：",
    ...ANTI_COPY.map((a, i) => `${i + 1}. ${a}`),
  ]
  return lines.join("\n")
}

export default function GuideStyle() {
  const [kind, setKind] = useState<StyleKind>("clean")
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const active = SPECS[kind]

  useEffect(() => () => {
    if (copiedTimer.current) clearTimeout(copiedTimer.current)
  }, [])

  function pick(k: StyleKind) {
    setKind(k)
    setCopied(false)
  }

  async function copySpec() {
    const text = buildCopyText(kind)
    try { await navigator.clipboard.writeText(text) } catch {
      const ta = document.createElement("textarea")
      ta.value = text; document.body.appendChild(ta); ta.select()
      try { document.execCommand("copy") } catch {}
      document.body.removeChild(ta)
    }
    setCopied(true)
    if (copiedTimer.current) clearTimeout(copiedTimer.current)
    copiedTimer.current = setTimeout(() => setCopied(false), 1600)
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 風格細節
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">風格細節</h1>
        <p className="reveal d2 mt-4 max-w-[46ch] text-lg text-muted-foreground">把「長什麼樣子」變成 AI 照著做的規格。</p>
        <p className="reveal d3 mt-3 max-w-[62ch] text-[0.95rem] text-muted-foreground">
          AI 沒被指定風格，就會長出同一張臉；把這一頁的規格整段複製給它，就能避開。
          還沒選好風格的話，先到<Link to="/look" className="text-primary"><b>長什麼樣子</b></Link>把三套都試穿一次。
        </p>
      </header>

      {/* ============ 三套風格的完整規格 ============ */}
      <section id="specs" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Palette className="size-7 text-primary" strokeWidth={1.6} /></span>三套風格的完整規格</SectionHead>
        <Decide q={["怎麼用", "點一套，看畫面和整套規格"]} a={["下一步", "按複製，整段貼給 AI"]} />
        <p className="mt-3 text-[0.78rem] text-faint">表格裡的灰色小字是給 AI 看的技術原名，看不懂可以直接跳過。</p>

        {/* 三套切換 */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 max-sm:grid-cols-1">
          {ORDER.map((k) => {
            const s = SPECS[k]
            const on = k === kind
            return (
              <button
                key={k}
                type="button"
                aria-pressed={on}
                onClick={() => pick(k)}
                className={cn(
                  "cursor-pointer rounded-lg border-[1.5px] border-input bg-card px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary",
                  on && "border-primary bg-primary/8"
                )}
              >
                <span className="font-serif text-[1.05rem] font-bold">{s.name}</span>
                <small className="ml-2 text-[0.78rem] text-muted-foreground">{s.tab}</small>
                {on && <span className="float-right font-extrabold text-primary">✓</span>}
              </button>
            )
          })}
        </div>

        {/* 迷你畫面＋規格表 */}
        <div key={kind} className="wizin mt-5 grid grid-cols-[300px_1fr] items-start gap-5 max-md:grid-cols-1">
          <div className="flex flex-col gap-3">
            <MiniUI kind={kind} />
            <p className="text-[0.82rem] text-muted-foreground">{active.vibe}{active.fit}</p>
            <Button onClick={copySpec}>{copied ? "已複製 ✓" : "複製這段規格"}</Button>
            <p className="text-[0.78rem] text-faint">按下去會連下面那份反 AI 味清單一起複製。開頭那句給 AI 的話也幫你寫好了。</p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">項目</th>
                    <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">這一套的做法</th>
                  </tr>
                </thead>
                <tbody>
                  {active.rows.map((r, i) => {
                    const last = i === active.rows.length - 1
                    return (
                      <tr key={r.k}>
                        <td className={cn("whitespace-nowrap border-border px-4 py-3 align-top font-semibold", !last && "border-b")}>{r.k}</td>
                        <td className={cn("border-border px-4 py-3 align-top text-muted-foreground", !last && "border-b")}>{r.v}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* ============ 通用反 AI 味清單 ============ */}
      <section id="anti" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Ban className="size-7 text-primary" strokeWidth={1.6} /></span>通用反 AI 味清單</SectionHead>
        <Decide q={["原則", "不管選哪一套，六條都要遵守"]} a={["省事", "上面的複製按鈕已經附上這份清單"]} />

        <Card className="mt-6 overflow-hidden">
          {ANTI_PAGE.map((a, i) => (
            <div key={i} className="flex items-start gap-3.5 border-b border-border px-5 py-3.5 last:border-b-0">
              <span className="w-5 shrink-0 text-right font-serif text-[1.05rem] font-extrabold leading-[1.6] text-primary">{i + 1}</span>
              <span className="text-[0.95rem]">{a}</span>
            </div>
          ))}
        </Card>

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          <AccordionItem value="other-vibe">
            <AccordionTrigger>想要別的感覺怎麼辦？（像精品、像遊戲）</AccordionTrigger>
            <AccordionContent>
              <p>先把你心裡的形容詞記下來，例如「像精品」或「像遊戲」。</p>
              <p className="mt-1.5">然後從三套裡挑最接近的一套當基底。像精品可以拿雜誌當底，像遊戲可以拿溫暖當底。</p>
              <p className="mt-1.5">複製那套規格給 AI 之後，把你的形容詞補在後面，請它照著調整。</p>
              <p className="mt-1.5">從一套穩的基底出發去調，會比讓 AI 從零自由發揮好得多。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Pager prev={["/guides/integrations", "串接指南"]} next={["/guides/payments", "金流指南"]} />
    </main>
  )
}
