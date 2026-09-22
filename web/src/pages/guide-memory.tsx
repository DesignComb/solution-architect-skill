import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { CircleCheck, CircleX, ClipboardList, Eraser, Layers, MessageCircleQuestionMark, MessageSquare, NotebookPen, Repeat, Shuffle, Table2, TriangleAlert, UserRound } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager, FlowArrow, FlowNode } from "@/components/site"
import { cn } from "@/lib/utils"

const SYMPTOMS: { icon: typeof Shuffle; name: string; see: string; why: string }[] = [
  {
    icon: Shuffle,
    name: "前後矛盾",
    see: "上一輪才說好用藍色，這一輪做出來卻變成綠色。",
    why: "你沒有改主意，是它已經看不到你講藍色的那張紙。",
  },
  {
    icon: Repeat,
    name: "重複做過的事",
    see: "明明做好的功能，它又重做一遍，或把改好的地方改回去。",
    why: "做過的紀錄已經被推到地上，它以為那件事還沒做。",
  },
  {
    icon: Eraser,
    name: "忘記你最早講的限制",
    see: "你一開始說過先不做付款，做到後來它自己把付款做進去。",
    why: "最早放上桌的那張紙，最先被推掉或被忽略。",
  },
]

const RULES = [
  {
    q: "文件才是記憶",
    how: "需求單、藍圖、交接筆記都寫成文件，每個新對話一開始先貼。",
    why: "桌上的紙會被推掉，文件不會。寫下來的東西，換幾位助理都還在。",
  },
  {
    q: "一次只交辦一件事",
    how: "一次只講一件事，驗收完再講下一件。",
    why: "桌上的紙越少，它看得越清楚，也越不容易前後矛盾。",
  },
  {
    q: "卡住就換桌子",
    how: "開一個全新的對話，重貼需求單與目前的狀況。",
    why: "新桌子是空的，之前繞進去的死胡同不會跟過來。",
  },
]

const FLOW = [
  { n: "貼需求單", say: "新對話的第一句話，先把需求單整份貼上去。" },
  { n: "做一件", say: "只交辦一件事，需求單以外的先不做。" },
  { n: "驗收", say: "做完自己確認一次，對了才算完成。" },
  { n: "寫交接筆記", say: "請它寫下目前做到哪、下一步是什麼。" },
  { n: "新對話", say: "開一個全新的對話，貼上需求單和交接筆記，回到第一步。" },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "開始前後矛盾",
    q: "對話講到第四十輪，AI 突然把你早就定案的藍色改成綠色。第一個動作是？",
    options: [
      { label: "再講一次要用藍色，多講幾次它就記得了", ok: false, why: "每補一句，桌上又多一張紙，它只會更看不清楚。這是桌子滿了，不是它沒聽懂。" },
      { label: "請它寫交接筆記，開新對話重貼需求單", ok: true, why: "新桌子是空的，需求單一貼，藍色這個決定就回到桌上最顯眼的位置。" },
    ],
  },
  {
    tag: "新對話的第一句",
    q: "你開了一個全新的對話，準備接著做昨天沒做完的功能。第一件事先貼什麼？",
    options: [
      { label: "直接說「接著昨天的做」", ok: false, why: "新對話是從零開始，它不記得昨天有過任何對話。這句話對它來說沒有任何意思。" },
      { label: "先貼需求單，再貼昨天的交接筆記", ok: true, why: "需求單告訴它整體要做什麼，交接筆記告訴它做到哪裡。兩張紙一貼，新助理就能接手。" },
    ],
  },
  {
    tag: "決定要記在哪",
    q: "剛剛跟 AI 討論後，決定會員只分兩種身分。這個決定要記在哪裡才不會不見？",
    options: [
      { label: "留在對話裡就好，它剛剛才答應過", ok: false, why: "對話會被推掉，也可能被工具壓縮成摘要，細節就不見了。答應過的事，下個對話它不會記得。" },
      { label: "馬上寫進需求單或藍圖", ok: true, why: "文件才是記憶。寫下來的決定，換幾個對話都還在，每次開新對話先貼就好。" },
    ],
  },
]

export default function GuideMemory() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › AI 為什麼會忘記
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">AI 為什麼會忘記</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">不是它壞了，是桌子滿了。</p>
      </header>

      {/* ============ 一張工作桌的助理 ============ */}
      <section id="metaphor" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Table2 className="size-7 text-primary" strokeWidth={1.6} /></span>一張工作桌的助理</SectionHead>
        <Decide q={["比喻", "AI 是只有一張工作桌的助理"]} a={["重點", "桌子有多大，它就記得多少"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">想像你請了一位很能幹的助理，但他只能在一張工作桌上作業。你講的每一句話、貼的每一份資料，都是一張紙放到桌上。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <Layers className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">桌子放滿了</b>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">桌子就那麼大，紙越放越多，最早放上去的那幾張就被推到地上。掉到地上的東西助理看不到，回答就開始漏東漏西。</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <UserRound className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">換一位助理</b>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">開一個新對話，等於換一位新助理。他的桌子是空的，之前那位聽過的事，他一件都不知道。</p>
          </Card>
        </div>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-[0.78rem] text-faint">
          <span>這張桌子有多大，就是 AI 一次能記住的對話量。</span>
          <Badge>技術名：context</Badge>
        </p>
      </section>

      {/* ============ 你會在哪裡遇到它 ============ */}
      <section id="where" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageSquare className="size-7 text-primary" strokeWidth={1.6} /></span>你會在哪裡遇到它</SectionHead>
        <Decide q={["場景", "同一個對話講了幾十輪之後"]} a={["判讀", "三種症狀，都是桌子滿了"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">症狀不會在第一句就出現，通常是同一個對話講了幾十輪之後。對話視窗裡會看到下面三種狀況。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {SYMPTOMS.map((s) => (
            <Card key={s.name} className="p-5">
              <div className="flex items-center gap-2.5">
                <s.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{s.name}</b>
              </div>
              <p className="mt-2.5 text-[0.88rem] text-muted-foreground">{s.see}</p>
              <p className="mt-1.5 text-[0.88rem] text-muted-foreground"><b className="text-warn">原因：</b>{s.why}</p>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">這三種症狀出現時，先不要罵它。這不是它壞掉，是桌子滿了，再往桌上加指令只會更滿。</p>
      </section>

      {/* ============ 三條規則 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ClipboardList className="size-7 text-primary" strokeWidth={1.6} /></span>三條規則</SectionHead>
        <Decide q={["原則", "文件才是記憶，對話不是"]} a={["節奏", "一次一件，卡住就換桌子"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">對策只有三條，每一條都在做同一件事：把記憶從桌子上，搬到桌子外面。</p>

        <Card className="mt-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">規則</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">怎麼做</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">為什麼有效</th>
                </tr>
              </thead>
              <tbody>
                {RULES.map((r, i) => (
                  <tr key={r.q}>
                    <td className={cn("whitespace-nowrap px-4 py-3 align-top font-semibold", i < RULES.length - 1 && "border-b border-border")}>{r.q}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < RULES.length - 1 && "border-b border-border")}>{r.how}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < RULES.length - 1 && "border-b border-border")}>{r.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="mt-8 text-[0.92rem] text-muted-foreground">三條規則串起來，就是一個不斷重複的小循環。每繞一圈，桌子都是乾淨的。</p>

        <div className="mt-4 flex flex-wrap items-center gap-2.5" aria-label="一件事的交辦循環">
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
              <b className="w-[5.6em] shrink-0 text-[0.9rem]">{f.n}</b>
              <span className="text-sm text-muted-foreground">{f.say}</span>
            </div>
          ))}
        </Card>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="compress">
            <AccordionTrigger>有些工具會自己整理桌子，那還需要寫文件嗎？</AccordionTrigger>
            <AccordionContent>
              <p>有些 AI 工具會自動把舊對話壓縮成摘要，替桌子騰出空間。壓縮之後細節會不見，只剩下大意。</p>
              <p className="mt-2">所以重要的決定還是要寫進文件，不要只留在對話裡。摘要留得住大方向，留不住你講過的那句限制。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cost">
            <AccordionTrigger>對話拖很長，除了忘東西還有什麼代價？</AccordionTrigger>
            <AccordionContent>
              <p>對話越長也越貴。因為 AI 每一次回答，都要把整張桌子上的東西重讀一遍。</p>
              <p className="mt-2">桌子越滿，每一次回答要重讀的東西就越多。換一張乾淨的桌子，不只是救品質，也是在看緊錢。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 常見錯誤 ============ */}
      <section id="mistakes" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><TriangleAlert className="size-7 text-primary" strokeWidth={1.6} /></span>常見錯誤</SectionHead>
        <Decide q={["現實", "出事的不是技術，是捨不得換桌子"]} a={["補救", "現在就寫交接筆記，開新對話"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">下面三個錯誤，都是從「再撐一下」開始的。每一個都把後果和正確做法講清楚。</p>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="one-chat">
            <AccordionTrigger>同一個對話從開工用到上線</AccordionTrigger>
            <AccordionContent>
              <p>從第一天畫藍圖，到最後一天上線，全部擠在同一個對話裡。前幾週講的事，早就被推到地上了。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>越到後期越前後矛盾，做好的功能被改回去，你一開始講的限制它全忘了。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>一件事一個對話。每做完一件就驗收，請它寫交接筆記，下一件從新對話開始。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="not-written">
            <AccordionTrigger>重要決定只講在對話裡，沒寫進文件</AccordionTrigger>
            <AccordionContent>
              <p>「付款先不做」「會員只分兩種身分」，這些決定你只在對話裡講過一次。桌子一滿，或是工具把舊對話壓縮成摘要，這些細節就不見了。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>下一個對話完全不知道有這些決定，做出來的東西跟你想的不一樣，還得重做一次。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>每做一個決定，就寫進需求單或藍圖。文件才是記憶，對話只是討論的地方。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="pile-on">
            <AccordionTrigger>越卡越在同一個對話裡加指令</AccordionTrigger>
            <AccordionContent>
              <p>它做錯了，你補一句；還是錯，你再補一句。每補一句，桌上又多一張紙，它反而更看不清楚。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>對話越長越貴，越貴越捨不得放棄，最後陷在同一個死胡同裡打轉。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>卡住就換桌子。開新對話，重貼需求單和目前狀況，讓它忘掉死胡同。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼做"]} a={["提示", "答案全在上面那張表裡"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">桌子滿了的時候，第一個反應決定你會不會陷進去。三題都做完，這一課才算上完。</p>

        <div className="mt-5 grid gap-2.5">
          {QUIZ.map((qz, qi) => {
            const sel = picked[qi]
            const chosen = sel === null || sel === undefined ? undefined : qz.options[sel]
            return (
              <Card key={qz.tag} className="p-5">
                <Badge variant="draft">{qz.tag}</Badge>
                <p className="mt-2.5 font-semibold">{qz.q}</p>
                <div className="mt-3.5 flex flex-wrap gap-2.5">
                  {qz.options.map((o, oi) => (
                    <Button
                      key={o.label}
                      variant="outline"
                      size="sm"
                      aria-pressed={sel === oi}
                      onClick={() => pick(qi, oi)}
                      className={cn(
                        "h-auto whitespace-normal py-2 text-left",
                        sel === oi && (o.ok ? "border-ok text-ok hover:border-ok hover:text-ok" : "border-warn text-warn hover:border-warn hover:text-warn")
                      )}
                    >
                      {o.label}
                    </Button>
                  ))}
                </div>
                {chosen && (
                  <div className={cn("wizin mt-4 flex items-start gap-2.5 rounded-lg border-[1.5px] px-4 py-3 text-sm", chosen.ok ? "border-ok/50 bg-ok/8" : "border-warn/50 bg-warn/8")}>
                    {chosen.ok
                      ? <CircleCheck className="mt-0.5 size-4 shrink-0 text-ok" strokeWidth={2} />
                      : <CircleX className="mt-0.5 size-4 shrink-0 text-warn" strokeWidth={2} />}
                    <span>
                      <b className={chosen.ok ? "text-ok" : "text-warn"}>{chosen.ok ? "這樣做對了" : "先停下來"}</b>
                      <span className="block text-muted-foreground">{chosen.why}</span>
                    </span>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* ============ 收尾 ============ */}
      <section className="pt-14">
        <p className="mx-auto max-w-[30ch] text-center font-serif text-[1.35rem] font-extrabold leading-relaxed tracking-wide">
          AI 不會替你記住，文件會。桌子滿了就換一張，需求單帶著走。
        </p>

        <div className="mt-10 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.85rem] text-muted-foreground">
          <NotebookPen className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          卡住時怎麼換講法、縮一半、重開，<Link to="/guides/ai" className="text-primary"><b>跟 AI 一起做</b></Link>的卡住三步有完整做法。開新對話的第一段話怎麼寫，<Link to="/guides/prompts" className="text-primary"><b>指令範本</b></Link>裡有現成的可以直接貼。
        </div>
      </section>

      <Pager prev={["/guides/traffic", "網站塞車的時候"]} next={["/guides/toolbox", "工具與 skill 索引"]} />
    </main>
  )
}
