import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { Bot, CircleCheck, CircleX, Columns3, Files, HardHat, ListChecks, MessageCircleQuestionMark, Scale, Table2, TriangleAlert, Type } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager, FlowArrow, FlowNode } from "@/components/site"
import { cn } from "@/lib/utils"

const CHANGES: { icon: typeof Columns3; name: string; tech: string; d: string }[] = [
  {
    icon: Columns3,
    name: "多加一排架子",
    tech: "加欄位",
    d: "會員表原本只記名字，現在要多記電話，就是多加一個欄位。",
  },
  {
    icon: Type,
    name: "換架子的規格",
    tech: "改欄位的型別",
    d: "原本放文字的格子要改成放數字，格子的型別跟著換。",
  },
  {
    icon: Table2,
    name: "隔出新的區域",
    tech: "加新的表",
    d: "開始賣東西了，倉庫要多隔一區放訂單，就是加一張新的表。",
  },
]

const ORDERS = [
  { no: "01", what: "隔出會員區", tech: "建會員表" },
  { no: "02", what: "會員區多加一排電話架", tech: "加電話欄位" },
  { no: "03", what: "隔出訂單區", tech: "建訂單表" },
]

const MEET: { icon: typeof Bot; t: string; d: string[] }[] = [
  {
    icon: Bot,
    t: "跟 AI 對話的時候",
    d: [
      "你請 AI 加一個功能，它常會說一句：我來跑一個 migration。",
      "有時它會先問：要不要我幫你加一個欄位。這兩句講的是同一件事，它要開一張施工單改倉庫。",
    ],
  },
  {
    icon: Files,
    t: "專案資料夾裡的一排檔案",
    d: [
      "打開專案的程式碼保險箱（repo），會看到一排檔案，每一個名字的開頭都有編號。",
      "那一排就是施工紀錄，一張單子一個檔案，照編號順序執行。",
    ],
  },
]

const RULES = [
  {
    rule: "不手動進倉庫後台改結構",
    why: "手改沒有紀錄，樣品屋和真店面就會長得不一樣，之後出的問題很難查。",
    how: "想改什麼，都請 AI 開一張施工單，再照單執行。",
  },
  {
    rule: "改結構前先備份",
    why: "刪欄位、改型別會動到現有的資料，刪掉的欄位，資料就跟著沒了。",
    how: "先把資料多存一份在別的地方，再動工。",
  },
  {
    rule: "驗收時問兩句",
    why: "AI 產了施工單又自己執行，你不問，就不知道它動了什麼。",
    how: "問它「這次改了什麼」「會不會動到現有的資料」，答得清楚再放行。",
  },
]

const FLOW = [
  { n: "開施工單", say: "想改什麼，先寫成一張有編號的單子，不直接動倉庫。" },
  { n: "樣品屋先施工", say: "先在只有你看得到的樣品屋照單施工，資料跟正式的分開。" },
  { n: "驗收", say: "問那兩句：這次改了什麼，會不會動到現有的資料。會動到的，先備份。" },
  { n: "真店面照單施工", say: "驗收過了，真店面照同一張單子施工，兩邊的倉庫就長得一模一樣。" },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "AI 想抄捷徑",
    q: "AI 說：直接在倉庫後台幫你加這個欄位比較快，要不要？",
    options: [
      { label: "好，快就好，加完再說", ok: false, why: "手改沒有紀錄，這一筆只存在你點過的那個倉庫。樣品屋和真店面從此長得不一樣。" },
      { label: "不要，請它開一張施工單再執行", ok: true, why: "多花一分鐘留單，每一邊的倉庫才能照單重演得一模一樣，改錯了也退得回上一張。" },
    ],
  },
  {
    tag: "刪欄位之前",
    q: "AI 建議把一個沒在用的欄位刪掉。按下去之前，該先做什麼？",
    options: [
      { label: "直接刪，反正沒在用", ok: false, why: "刪掉的欄位，資料就跟著沒了。沒在用是 AI 的判斷，資料不見卻是你的損失。" },
      { label: "先備份，再問它會不會動到現有的資料", ok: true, why: "會動到現有資料的改動，先備份再動工。這一句問下去，AI 就得把影響講清楚。" },
    ],
  },
  {
    tag: "只有真店面壞掉",
    q: "真店面一片錯誤，樣品屋卻好好的。該先懷疑什麼？",
    options: [
      { label: "真店面的機器比較差", ok: false, why: "先別怪機器。同一套畫面只在一邊壞掉，先懷疑兩邊的倉庫長得不一樣。" },
      { label: "有一張施工單只在樣品屋跑過，真店面沒跟上", ok: true, why: "兩邊的施工紀錄不一樣長，倉庫就長得不一樣。照單把真店面補施工，兩邊就會回到一模一樣。" },
    ],
  },
]

export default function GuideMigrations() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 倉庫的施工紀錄
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">倉庫的施工紀錄</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">倉庫改架子可以，但每一次都要留單。</p>
      </header>

      {/* ============ 倉庫換架子要開單 ============ */}
      <section id="metaphor" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><HardHat className="size-7 text-primary" strokeWidth={1.6} /></span>倉庫換架子要開單</SectionHead>
        <Decide q={["比喻", "倉庫每次改裝，都開一張有編號的施工單"]} a={["重點", "每一邊的倉庫照單施工，就長得一模一樣"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          〈軟體怎麼運作〉那一課說過，所有資料都收在倉庫裡。倉庫不是蓋好就不動了，生意一變，架子就得跟著改。
        </p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {CHANGES.map((c) => (
            <Card key={c.name} className="p-4">
              <div className="flex items-center gap-2.5">
                <c.icon className="size-4 shrink-0 text-primary" strokeWidth={1.8} />
                <b className="text-[0.92rem]">{c.name}</b>
              </div>
              <p className="mt-2"><Badge>{c.tech}</Badge></p>
              <p className="mt-2 text-[0.82rem] text-muted-foreground">{c.d}</p>
            </Card>
          ))}
        </div>

        <p className="mt-5 text-[0.92rem] text-muted-foreground">
          這三種改動有一個共同的名字，叫改結構。改的是架子怎麼排，不是架子上放了什麼。
        </p>
        <p className="mt-2.5 text-[0.92rem] text-muted-foreground">
          每一次改結構，都寫成一張有編號的施工單，照編號順序執行。這一整疊單子，就是倉庫的施工紀錄。
        </p>

        <Card className="mt-5 overflow-hidden">
          {ORDERS.map((o) => (
            <div key={o.no} className="flex items-center gap-3.5 border-b border-border px-5 py-3 last:border-b-0">
              <span className="font-mono text-[0.72rem] tracking-widest text-primary">施工單 {o.no}</span>
              <b className="text-[0.9rem]">{o.what}</b>
              <span className="ml-auto rounded-full border border-input bg-secondary px-2 py-0.5 font-mono text-[0.62rem] text-faint">{o.tech}</span>
            </div>
          ))}
        </Card>
        <p className="mt-2.5"><Badge>技術名：migration</Badge></p>

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          留單的好處有兩個，第一個是每一邊的倉庫都不會走樣。樣品屋、測試用的倉庫、真店面，都能照單從頭重演出來。從第一張做到最後一張，每一邊就長得一模一樣。
        </p>
        <p className="mt-2.5 text-[0.92rem] text-muted-foreground">
          第二個好處是退得回去，哪一張做錯了，照單退回上一張就好。不過退回退的是架子，架子上已經丟掉的東西回不來，所以刪東西前還是要備份。
        </p>
        <p className="mt-3 text-[0.78rem] text-faint">灰色標籤是技術原名，記不住可以直接跳過。之後聽到 AI 講 migration，知道它在講這疊施工單就夠了。</p>
      </section>

      {/* ============ 你會在哪裡遇到它 ============ */}
      <section id="meet" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Bot className="size-7 text-primary" strokeWidth={1.6} /></span>你會在哪裡遇到它</SectionHead>
        <Decide q={["場景", "AI 說要跑一個 migration 的時候"]} a={["提醒", "它在說的，就是要開一張施工單"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          施工紀錄不用你自己發明，它會主動出現在兩個地方。認得出來，對話就不會卡住。
        </p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {MEET.map((m) => (
            <Card key={m.t} className="p-5">
              <div className="flex items-center gap-2.5">
                <m.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{m.t}</b>
              </div>
              {m.d.map((line) => (
                <p key={line} className="mt-2 text-[0.88rem] text-muted-foreground">{line}</p>
              ))}
            </Card>
          ))}
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">Supabase 這類倉庫服務的指令工具，本身就支援施工紀錄。AI 可以直接用它開單施工。</p>
      </section>

      {/* ============ 三條規則、一條流程 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ListChecks className="size-7 text-primary" strokeWidth={1.6} /></span>三條規則、一條流程</SectionHead>
        <Decide q={["原則", "倉庫可以改，但每一次都要留單"]} a={["驗收", "問兩句：改了什麼，動不動到現有資料"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          規則只有三條，一條守開單，一條守備份，一條守驗收。拿不準的時候，回來對這張表就好。
        </p>

        <Card className="mt-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">規則</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">為什麼</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">怎麼做</th>
                </tr>
              </thead>
              <tbody>
                {RULES.map((r, i) => {
                  const last = i === RULES.length - 1
                  return (
                    <tr key={r.rule}>
                      <td className={cn("whitespace-nowrap px-4 py-3 align-top font-semibold", !last && "border-b border-border")}>{r.rule}</td>
                      <td className={cn("px-4 py-3 align-top text-muted-foreground", !last && "border-b border-border")}>{r.why}</td>
                      <td className={cn("px-4 py-3 align-top text-muted-foreground", !last && "border-b border-border")}>{r.how}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="mt-6 text-[0.92rem] text-muted-foreground">
          三條規則串起來，就是一條固定的流程。每一次改倉庫，都照這四步走一遍。
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2.5" aria-label="改結構的流程">
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
              <b className="w-[8em] shrink-0 text-[0.9rem]">{f.n}</b>
              <span className="text-sm text-muted-foreground">{f.say}</span>
            </div>
          ))}
        </Card>

        <div className="mt-5 rounded-lg border-[1.5px] border-primary/40 bg-primary/8 px-5 py-4">
          <p className="text-[0.92rem] font-semibold">三條規則合起來就一句話：倉庫可以改，但要照單、要備份、要驗收。</p>
          <p className="mt-2 text-[0.88rem] text-muted-foreground">
            照單施工，樣品屋和真店面才長得一模一樣。先備份，刪錯了才有東西可以還原。問過那兩句，才知道 AI 到底動了什麼。
          </p>
        </div>
      </section>

      {/* ============ 常見錯誤 ============ */}
      <section id="mistakes" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><TriangleAlert className="size-7 text-primary" strokeWidth={1.6} /></span>常見錯誤</SectionHead>
        <Decide q={["共同點", "三個錯誤都是圖快，各少走了流程裡的一步"]} a={["下場", "兩邊倉庫長不一樣，或是資料一去不回"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          下面三種災難都真實發生過，而且每一種都可以避免。點開來看事情是怎麼發生的。
        </p>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="hand-edit">
            <AccordionTrigger>圖快，手動進倉庫後台直接改欄位</AccordionTrigger>
            <AccordionContent>
              <p>倉庫後台的畫面點幾下就能加欄位，看起來比開一張施工單快得多。可是手改沒有紀錄，這一筆改動只存在你點過的那個倉庫裡。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>樣品屋和真店面從此長得不一樣。之後某個功能只在其中一邊壞掉，你會很難查出原因。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>想改什麼，都請 AI 開一張施工單，再照單執行。已經手改過的，跟 AI 說清楚你改了什麼，請它把紀錄補齊。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="drop-no-backup">
            <AccordionTrigger>刪欄位之前沒有備份</AccordionTrigger>
            <AccordionContent>
              <p>AI 說某個欄位用不到了，建議刪掉，你說好。單子跑完，那個欄位連同裡面的資料一起消失。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>刪掉的欄位，資料就跟著沒了。沒有備份，就沒有東西可以還原。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>會動到現有資料的改動，先備份再動工。驗收時多問一句：會不會動到現有的資料。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="forgot-prod">
            <AccordionTrigger>樣品屋改好了，忘記真店面也要施工</AccordionTrigger>
            <AccordionContent>
              <p>新功能在樣品屋測得好好的，你很滿意，直接把新畫面搬上真店面。可是真店面的倉庫，還沒照那張單子施工。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>新畫面向倉庫要一個還不存在的欄位，真店面一片錯誤，樣品屋卻一切正常。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>照流程走到最後一步，真店面照同一張單子施工。兩邊的施工紀錄一樣長，倉庫才會一模一樣。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼做"]} a={["提示", "答案全在那三條規則裡"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          三題都從真實情境改寫。答錯沒有關係，重點是下次 AI 開口時，能想起這一課。
        </p>

        <div className="mt-5 grid gap-2.5">
          {QUIZ.map((qz, qi) => {
            const sel = picked[qi]
            const chosen = sel === null ? undefined : qz.options[sel]
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
                      <b className={chosen.ok ? "text-ok" : "text-warn"}>{chosen.ok ? "這樣做對了" : "危險，先停下來"}</b>
                      <span className="block text-muted-foreground">{chosen.why}</span>
                    </span>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* ============ 收尾與來源 ============ */}
      <section className="pt-14">
        <p className="mx-auto max-w-[30ch] text-center font-serif text-[1.35rem] font-extrabold leading-relaxed tracking-wide">
          倉庫可以改，單子不能少；樣品屋和真店面長得一模一樣，靠的就是這疊紀錄。
        </p>

        <p className="mx-auto mt-8 max-w-[620px] text-[0.92rem] text-muted-foreground">
          上一課〈<Link to="/guides/rls" className="text-primary"><b>倉庫的門禁</b></Link>〉管的是誰能開哪個櫃子；這一課管的是架子怎麼排、怎麼改。
          倉庫的事講到這裡告一段落，<Link to="/guides/login" className="text-primary"><b>下一課</b></Link>回到客人身上：登入之後，系統怎麼記得你是誰。
        </p>

        <div className="mt-10 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <Scale className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          指令工具支援施工紀錄這一點，出自 Supabase 官方文件（2026-08-27 查證）。
        </div>
      </section>

      <Pager prev={["/guides/rls", "倉庫的門禁"]} next={["/guides/login", "登入之後"]} />
    </main>
  )
}
