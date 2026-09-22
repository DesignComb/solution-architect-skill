import { Link } from "react-router-dom"
import { QSteps, Decide, Pager, MiniUI } from "@/components/site"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const STYLES: { kind: "clean" | "editorial" | "warm"; name: string; fit: string; desc: string }[] = [
  { kind: "clean", name: "俐落", fit: "適合：後台、內部工具", desc: "看起來安靜又專業，像一件好用的工具。" },
  { kind: "editorial", name: "雜誌", fit: "適合：官網、內容站", desc: "用襯線字加上大量留白，看起來像一本刊物。" },
  { kind: "warm", name: "溫暖", fit: "適合：社群、生活服務", desc: "線條圓潤、語氣親切，看起來很有生活感。" },
]

export default function Look() {
  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <header className="pb-1 pt-11">
        <QSteps current={4} />
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">長什麼樣子？</h1>
        <Decide q={["選項", "俐落 ／ 雜誌 ／ 溫暖"]} a={["推薦", "一定要選一種，因為你不選，AI 就會給每個網站同一張臉"]} />
      </header>

      {/* 風格試衣間：三選一 */}
      <div className="mt-8 grid grid-cols-3 gap-4 max-md:grid-cols-1">
        {STYLES.map((s) => (
          <div key={s.kind} className="flex flex-col rounded-lg border-[1.5px] border-input bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <MiniUI kind={s.kind} />
            <h3 className="mt-3.5 font-serif text-[1.15rem] font-bold">
              {s.name} <span className="ml-1 align-middle font-sans text-[0.72rem] font-normal text-muted-foreground">{s.fit}</span>
            </h3>
            <p className="mt-1 text-[0.82rem] text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>

      <Accordion type="multiple" className="mt-4 space-y-2.5">
        <AccordionItem value="same-face">
          <AccordionTrigger>為什麼 AI 網站都長一樣？</AccordionTrigger>
          <AccordionContent>
            <p>只要沒有人指定風格，AI 就會回到最常見的樣板：紫藍漸層、白底圓角卡片、置中大標題。解法就是自己先把風格決定好：</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>選好一種風格之後，把風格的規格和需求一起交給 AI，並且明說「不要模板臉」。</li>
              <li>中文內容要指定合適的中文字體，也不要用紫藍漸層。</li>
              <li>空白頁、載入中和出錯的畫面，也要用同一種風格。</li>
            </ul>
            <p className="mt-2">三套風格的完整規格都整理好了，可以整段複製給 AI：<Link to="/guides/style"><b>風格細節 →</b></Link></p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Pager prev={["/stack", "用什麼做"]} next={["/cost", "花多少錢"]} />
    </main>
  )
}
