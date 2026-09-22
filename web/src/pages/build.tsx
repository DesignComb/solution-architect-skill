import { Link } from "react-router-dom"
import { QSteps, Decide, Pager, FlowArrow, FlowNode } from "@/components/site"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const ROWS = [
  { need: "表單、報名", use: "Google 表單、Tally", when: "規則變得複雜，表單開始不夠用的時候。" },
  { need: "一頁式官網", use: "Canva 網站、Google Sites", when: "想要有自己的網址，外觀也想照自己的意思做的時候。" },
  { need: "預約", use: "Calendly、SimplyBook", when: "想把預約跟會員資料、收款流程綁在一起的時候。" },
  { need: "小量網拍", use: "蝦皮、SHOPLINE", when: "平台抽走的錢比自己做還貴的時候。" },
  { need: "內部追蹤表", use: "Notion、試算表", when: "很多人同時改同一份表，資料開始亂掉的時候。" },
  { need: "知識庫", use: "Notion 公開頁", when: "想讓內容搜尋得到，也想拿它當門面的時候。" },
]

export default function Build() {
  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <header className="pb-1 pt-11">
        <QSteps current={1} />
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">要寫程式嗎？</h1>
        <Decide q={["選項", "現成服務 ／ 自己做"]} a={["推薦", "先用現成的"]} />
      </header>

      {/* 判斷流程 */}
      <div className="mt-9 flex flex-wrap items-center gap-2.5" aria-label="判斷流程">
        <FlowNode>有需求</FlowNode>
        <FlowArrow />
        <FlowNode>找現成</FlowNode>
        <FlowArrow />
        <FlowNode>用三個月</FlowNode>
        <FlowArrow />
        <FlowNode ask>後悔了？</FlowNode>
        <FlowArrow />
        <span className="flex flex-col gap-1.5">
          <span className="rounded-lg border-[1.5px] border-current bg-card px-3 py-1.5 text-[0.8rem] font-semibold text-ok shadow-sm">沒有 → 繼續用</span>
          <span className="rounded-lg border-[1.5px] border-current bg-card px-3 py-1.5 text-[0.8rem] font-semibold text-primary shadow-sm">有 → 自己做 →</span>
        </span>
      </div>

      {/* 對照表 */}
      <Card className="mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">需求</th>
                <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">先用這個</th>
                <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">什麼時候換自己做</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => {
                const last = i === ROWS.length - 1
                const bd = last ? "border-b-0" : "border-b border-border"
                return (
                  <tr key={r.need}>
                    <td className={`${bd} whitespace-nowrap px-4 py-3 align-top font-semibold`}>{r.need}</td>
                    <td className={`${bd} px-4 py-3 align-top text-muted-foreground`}>{r.use}</td>
                    <td className={`${bd} px-4 py-3 align-top text-muted-foreground`}>{r.when}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 公式 */}
      <div className="mt-6 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-6 py-4 text-center font-mono text-[0.9rem]">
        如果它三個月幫你省下的時間，<b className="text-primary">還抵不過</b>你自己做一次的時間，就用現成的。
      </div>

      {/* 深入 */}
      <Accordion type="multiple" className="mt-4 space-y-2.5">
        <AccordionItem value="why-not-build">
          <AccordionTrigger>為什麼不直接自己做？</AccordionTrigger>
          <AccordionContent>
            <p>因為<b>需求會變</b>。現成服務用三個月，你才會知道自己真正缺什麼。先自己做，九成會做錯方向。先用現成的，一毛錢都不用花（US$0）。</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="recipes">
          <AccordionTrigger>想直接看跟你一樣的情境？</AccordionTrigger>
          <AccordionContent>
            <p>十二個常見情境的答案都先寫好了，連第一步該做什麼都有：<Link to="/guides/recipes"><b>情境配方 →</b></Link></p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Pager prev={["/", "首頁"]} next={["/app", "要 APP 嗎"]} />
    </main>
  )
}
