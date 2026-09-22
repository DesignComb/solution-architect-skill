import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen, CircleCheck, CircleX, Clock, FerrisWheel, MessageCircleQuestionMark, ScanLine, Scissors, Smartphone, Ticket, Timer, TriangleAlert, Watch } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager, FlowArrow, FlowNode } from "@/components/site"
import { cn } from "@/lib/utils"

const GATE: { icon: typeof Ticket; t: string; chip?: string; d: string }[] = [
  { icon: Ticket, t: "入口驗票一次", d: "你在入口出示門票，工作人員仔細核對票是不是真的。這就是輸入密碼、證明你是你本人的那一刻。" },
  { icon: Watch, t: "換上一條手環", chip: "通行證 token", d: "驗票通過後，園方替你戴上一條印著期限的手環。這條手環的技術名，就叫通行證。" },
  { icon: ScanLine, t: "之後只看手環", d: "接下來玩每一項設施，把手環亮出來就能進場。沒有人會要求你走回入口，重新驗一次票。" },
]

const SEEN = [
  { t: "密碼只輸入一次", d: "使用者輸入密碼，或按下「用 Google 登入」。成功之後，通行證就存進他的瀏覽器或手機裡。" },
  { t: "之後都自動出示", d: "接下來的每一個動作，裝置都會自動出示這張通行證。所以逛到別的頁面，不必重新輸入密碼。" },
  { t: "有一天突然被請出場", d: "用一用突然跳回登入頁，多半是通行證到期了。重新登入一次，就會換到新的一張。" },
]

const FLOW = [
  { n: "驗票", say: "輸入密碼，或用 Google 帳號登入，向系統證明你是你本人。" },
  { n: "發手環", say: "系統發下一張有期限的通行證，存進你正在用的這台裝置。" },
  { n: "出示手環", say: "之後的每一個動作，裝置都自動出示通行證，不必再輸入密碼。" },
  { n: "手環過期", say: "期限一到，通行證就失效，系統從這一刻起當作不認識你。" },
  { n: "重新驗票", say: "回到登入頁再登入一次，換一條新的手環，一切照舊。" },
]

const RULES: { icon: typeof Clock; t: string; d: string }[] = [
  { icon: Clock, t: "為什麼要有期限", d: "手環要是永遠有效，撿到它的人就能一直冒充你。有了期限，撿到的人最多用到過期那一刻。" },
  { icon: Smartphone, t: "為什麼換裝置要重新登入", d: "手環戴在裝置上，不是戴在你本人身上。換一支新手機，等於空著手走到入口，自然要重新驗票。" },
  { icon: Scissors, t: "登出是什麼意思", d: "登出，等於親手把手環剪掉，當下立刻失效。裝置就算落在別人手上，剪掉的手環也進不了門。" },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "三十天登出一次",
    q: "使用者抱怨大概每三十天就得重新登入一次，問你系統是不是壞掉了。",
    options: [
      { label: "是壞掉了，要修到永遠不用重新登入", ok: false, why: "永遠有效的通行證，等於一條剪不斷的手環，撿到的人就能一直冒充本人。" },
      { label: "沒有壞，這是通行證到期的正常設計", ok: true, why: "通行證本來就有期限，到期換新是保護帳號的機制。跟使用者說明原因就好。" },
    ],
  },
  {
    tag: "通行證在哪",
    q: "登入成功之後，那張通行證存放在什麼地方？",
    options: [
      { label: "存在他登入時用的那台瀏覽器或手機裡", ok: true, why: "手環戴在裝置上。這也解釋了為什麼換一台裝置，就得重新登入一次。" },
      { label: "記在帳號上，之後換哪台裝置都自動通行", ok: false, why: "通行證不跟著帳號走。新裝置等於空著手走到入口，要重新驗票才拿得到。" },
    ],
  },
  {
    tag: "門禁認誰",
    q: "倉庫的門禁規則（RLS）寫著「每個人只能看到自己的訂單」，系統靠什麼認出誰是本人？",
    options: [
      { label: "靠使用者每次動作都重新輸入的密碼", ok: false, why: "密碼只在驗票那一刻用一次，之後的每一步都不再經過它。" },
      { label: "靠每個動作都一起出示的通行證", ok: true, why: "登入後的每個動作都帶著通行證，門禁規則看的就是它。" },
    ],
  },
]

export default function GuideLogin() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 登入之後
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">登入之後</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">系統怎麼記得你是誰，為什麼有一天會突然要你重新登入。</p>
      </header>

      {/* ============ 入口的手環 ============ */}
      <section id="wristband" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><FerrisWheel className="size-7 text-primary" strokeWidth={1.6} /></span>入口的手環</SectionHead>
        <Decide q={["比喻", "把登入想成遊樂園入口的驗票"]} a={["關鍵", "驗完票，換到一條有期限的手環"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">前幾課把軟體拆成店面、廚房、倉庫，這一課走到入口。要看懂登入這件事，最好的畫面是遊樂園的驗票口。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {GATE.map((g) => (
            <Card key={g.t} className="p-5">
              <div className="flex items-center gap-2.5">
                <g.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{g.t}</b>
              </div>
              <p className="mt-2 text-[0.88rem] text-muted-foreground">{g.d}</p>
              {g.chip && <span className="mt-2.5 block"><Badge>技術名：{g.chip}</Badge></span>}
            </Card>
          ))}
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">卡片裡的灰色標籤是行話原名，記不住可以先跳過。</p>
      </section>

      {/* ============ 你會在哪裡遇到它 ============ */}
      <section id="where" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Smartphone className="size-7 text-primary" strokeWidth={1.6} /></span>你會在哪裡遇到它</SectionHead>
        <Decide q={["時機", "按下登入而且成功的那一秒"]} a={["位置", "通行證存進使用者的裝置裡"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">這條手環不是比喻裡才有的東西，你天天都戴著它。回想任何一個網站或 APP，對照下面三個畫面。</p>

        <Card className="mt-5 overflow-hidden">
          {SEEN.map((s) => (
            <div key={s.t} className="flex items-start gap-3.5 border-b border-border px-5 py-3.5 last:border-b-0">
              <b className="w-[9.5em] shrink-0 text-[0.9rem]">{s.t}</b>
              <span className="text-sm text-muted-foreground">{s.d}</span>
            </div>
          ))}
        </Card>
      </section>

      {/* ============ 手環的規則 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Timer className="size-7 text-primary" strokeWidth={1.6} /></span>手環的規則</SectionHead>
        <Decide q={["流程", "從驗票到過期，一條線走完"]} a={["原則", "期限不是刁難，是保護"]} />

        <div className="mt-7 flex flex-wrap items-center gap-2.5" aria-label="通行證的一生">
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

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {RULES.map((r) => (
            <Card key={r.t} className="p-5">
              <div className="flex items-center gap-2.5">
                <r.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[0.95rem]">{r.t}</b>
              </div>
              <p className="mt-2 text-[0.88rem] text-muted-foreground">{r.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ============ 常見錯誤 ============ */}
      <section id="mistakes" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><TriangleAlert className="size-7 text-primary" strokeWidth={1.6} /></span>常見錯誤</SectionHead>
        <Decide q={["現象", "多數登入客訴不是被駭"]} a={["根源", "是把手環的期限想錯了"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">下面三個情境，都是真實世界會收到的回報。點開看看，每一個都繞著手環的期限打轉。</p>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="forever">
            <AccordionTrigger>把「記住我」做成永遠不過期</AccordionTrigger>
            <AccordionContent>
              <p>有人嫌重新登入麻煩，要求把通行證改成永遠有效。聽起來貼心，其實是把手環的期限整條拆掉。</p>
              <p className="mt-2">裝置一旦借人、遺失或被偷，拿到的人就能一直冒充本人。沒有過期的一天，也就沒有自動止血的一天。</p>
              <p className="mt-2">「記住我」可以把期限放寬一點，但不該放到永遠。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="expired">
            <AccordionTrigger>用一用突然被登出，被當成系統壞掉</AccordionTrigger>
            <AccordionContent>
              <p>使用者回報用到一半被踢回登入頁，聽起來像是故障。多數時候只是通行證到期，是設計好的正常行為。</p>
              <p className="mt-2">這時候要做的不是修程式，是好好說明：重新登入就好，這一道是在保護你的帳號。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shared">
            <AccordionTrigger>在共用電腦登入，走的時候沒登出</AccordionTrigger>
            <AccordionContent>
              <p>在店裡或圖書館的電腦登入之後，起身直接離開。手環還戴在那台電腦上，沒有人剪掉它。</p>
              <p className="mt-2">下一個坐下來的人打開網站，看到的就是你的帳號。共用的裝置用完，一定要親手按下登出。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼答"]} a={["提示", "答案全在手環的規則裡"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">這三題都是做產品時真的會被問到的問題。先在這裡想清楚，之後被問就答得出來。</p>

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
                      <b className={chosen.ok ? "text-ok" : "text-warn"}>{chosen.ok ? "答對了" : "不是這樣"}</b>
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
          密碼只在門口用一次，之後認得你的，是那條手環。
        </p>

        <p className="mt-6 text-center text-[0.92rem] text-muted-foreground">
          到這裡，你的系統已經會認人了。下一課把方向反過來：別的服務來敲你系統的門時，怎麼認出對方是誰。
        </p>

        <div className="mt-10 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <BookOpen className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          通行證（token）的發放、期限與失效行為，出自 Supabase 官方文件，2026-08-25 查證。
        </div>
      </section>

      <Pager prev={["/guides/migrations", "倉庫的施工紀錄"]} next={["/guides/oauth", "借別人的櫃台"]} />
    </main>
  )
}
