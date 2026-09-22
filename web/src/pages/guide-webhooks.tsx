import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen, CircleCheck, CircleX, CreditCard, ListChecks, MessageCircleQuestionMark, Store, TriangleAlert, Truck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager, FlowArrow, FlowNode } from "@/components/site"
import { cn } from "@/lib/utils"

const FLOW = [
  { n: "買家付款", say: "買家停在金流服務的頁面上，把這一筆錢付完。" },
  { n: "金流服務確認", say: "金流服務（綠界這類）確認錢真的進來了。" },
  { n: "主動敲門", say: "它往你事先留下的收信網址送一封信，說這筆付好了。" },
  { n: "標成已付款", say: "你的網站收到信，把訂單標成已付款，再寄通知給買家。" },
]

const RULES = [
  {
    t: "出貨看通知，不看畫面上的付款成功",
    d: "買家可能付到一半就把頁面關掉，畫面來不及更新。金流服務送來的通知，才是這筆錢的可靠依據。",
  },
  {
    t: "收到信，先驗證簽章再相信內容",
    d: "收信的網址是公開的，任何人都能往裡面寄假信。驗證簽章就是核對寄件人，確認真的是金流服務。",
  },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "出貨判斷",
    q: "買家傳來截圖，畫面寫著付款成功，問你能不能直接出貨。",
    options: [
      { label: "可以，畫面都寫成功了", ok: false, why: "截圖和畫面都可能造假，也可能來不及更新。出貨要等金流服務的通知進來才算數。" },
      { label: "等通知進來、標成已付款再出", ok: true, why: "通知才是金流服務親自確認的依據。照這個順序出貨，就不會把貨送給沒付錢的人。" },
    ],
  },
  {
    tag: "假通知",
    q: "有人往你的收信網址寄了一封假的付款通知，你靠什麼擋下它。",
    options: [
      { label: "把收信網址藏得夠隱密", ok: false, why: "收信的網址本來就是公開的，遲早會被找到。光靠藏網址，擋不住存心寄假信的人。" },
      { label: "驗證簽章，核對寄件人身分", ok: true, why: "簽章驗不過的信，一律當假信丟掉就好。擋下假通知，靠的就是這一道檢查。" },
    ],
  },
  {
    tag: "驗收清單",
    q: "你請 AI 幫忙串金流，驗收清單上最該補哪一條。",
    options: [
      { label: "畫面看得到付款成功就過關", ok: false, why: "這只驗了買家那一端，沒驗到敲門這一段。假通知照樣騙得過你的網站。" },
      { label: "收到通知時，有先驗證簽章", ok: true, why: "這一條沒寫進清單，就沒有人替你把關。驗收時親口問一句有沒有做，最保險。" },
    ],
  },
]

export default function GuideWebhooks() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 誰在敲門
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">誰在敲門</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">付款成功是誰通知你的，怎麼確認那一聲不是假冒的。</p>
      </header>

      {/* ============ 快遞員來敲門 ============ */}
      <section id="metaphor" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Truck className="size-7 text-primary" strokeWidth={1.6} /></span>快遞員來敲門</SectionHead>
        <Decide q={["比喻", "網站平常是店員，客人上門才服務"]} a={["新角色", "有些消息是別人主動送上門的"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">前面幾堂課裡，你的網站都像店員，客人開口它才動。這一堂要認識另一種角色，消息是主動送上門來的。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <Store className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">店員</b>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">客人走進店裡開口點餐，店員才開始服務他。你的網站平常就是這樣，有人打開頁面才工作。</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <Truck className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">快遞員</b>
              <span className="ml-auto rounded-full border border-input bg-secondary px-2 py-0.5 font-mono text-[0.62rem] text-faint">webhook</span>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">事情一發生，別家服務就主動來敲你家的門送信。這種主動送上門的通知，行話原名就放在角落。</p>
          </Card>
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">卡片角落的灰色英文是行話原名，看不懂可以直接跳過。</p>
      </section>

      {/* ============ 你會在哪裡遇到它 ============ */}
      <section id="where" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><CreditCard className="size-7 text-primary" strokeWidth={1.6} /></span>你會在哪裡遇到它</SectionHead>
        <Decide q={["場景", "最常見的一封信就是收錢通知"]} a={["設定", "你要先給對方一個收信的網址"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">最常遇到它的地方是收錢。買家付完款，通知你的不是買家本人，是金流服務。</p>

        <div className="mt-6 flex flex-wrap items-center gap-2.5" aria-label="一筆付款通知的流程">
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
              <b className="w-[6.2em] shrink-0 text-[0.9rem]">{f.n}</b>
              <span className="text-sm text-muted-foreground">{f.say}</span>
            </div>
          ))}
        </Card>
        <p className="mt-3 text-[0.84rem] text-muted-foreground">設定串接的時候，你會給金流服務一個收信的網址。之後每一筆付款的消息，都會送進這個網址。</p>
      </section>

      {/* ============ 只有兩條規則 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ListChecks className="size-7 text-primary" strokeWidth={1.6} /></span>只有兩條規則</SectionHead>
        <Decide q={["原則", "畫面會騙人，通知才算數"]} a={["底線", "沒驗過簽章的信，一律當假信"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">這一層的規則不多，真正要背的只有兩條。兩條講的都是同一件事，該信誰。</p>

        <Card className="mt-5 overflow-hidden">
          {RULES.map((r, i) => (
            <div key={r.t} className="flex items-start gap-3.5 border-b border-border px-5 py-4 last:border-b-0">
              <i className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border-[1.5px] border-primary/50 font-serif text-[0.9rem] font-extrabold not-italic text-primary">{i + 1}</i>
              <span>
                <b className="block text-[0.95rem]">{r.t}</b>
                <span className="text-[0.84rem] text-muted-foreground">{r.d}</span>
              </span>
            </div>
          ))}
        </Card>
      </section>

      {/* ============ 三個常見災難 ============ */}
      <section id="mistakes" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><TriangleAlert className="size-7 text-primary" strokeWidth={1.6} /></span>三個常見災難</SectionHead>
        <Decide q={["提醒", "出事的多半不是技術難，是沒想到"]} a={["對策", "三個坑都有現成的躲法"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">下面三個災難都真實上演過，而且一再重演。點開來看它怎麼發生，又怎麼躲。</p>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="no-verify">
            <AccordionTrigger>沒驗簽章，一封假信就能免費拿貨</AccordionTrigger>
            <AccordionContent>
              <p>收信的網址是公開的，存心搗亂的人找得到它。他只要手動寄一封假通知，內容寫著這筆已付款。</p>
              <p className="mt-2">你的網站信以為真，沒付錢的訂單就這樣放行了。守住的方法只有一條，收到信先驗過簽章再處理。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="dead-url">
            <AccordionTrigger>收信的網址壞了，訂單全停在未付款</AccordionTrigger>
            <AccordionContent>
              <p>收信的網址哪天壞掉了，金流服務就敲不到你的門。買家明明付了錢，訂單卻一直停在未付款。</p>
              <p className="mt-2">這種故障要靠掛站監測提早發現，做法收在<Link to="/guides/launch" className="text-primary"><b>上線與維護</b></Link>那一堂。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="local-test">
            <AccordionTrigger>在自己電腦上測試，等再久都沒信</AccordionTrigger>
            <AccordionContent>
              <p>你自己的電腦沒有公開的地址，金流服務敲不到門。所以在自己電腦上測試時，通知永遠不會送進來。</p>
              <p className="mt-2">這不代表你做壞了，改用金流服務提供的測試工具就好。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 三題小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼做"]} a={["提示", "答案全在上面那兩條規則裡"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">串金流最貴的學費，就是把假通知當真。先在這裡演練一次，之後就不會踩。</p>

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
          四堂課到這裡上完了，接下來換你動手做。
        </p>
        <p className="mt-5 text-center text-[0.92rem] text-muted-foreground">
          先到<Link to="/guides/toolbox" className="text-primary"><b>工具與 skill 索引</b></Link>挑趁手的工具，再拿<Link to="/guides/prompts" className="text-primary"><b>指令範本</b></Link>整段複製開工。
        </p>

        <div className="mt-10 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <BookOpen className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          付款通知與驗證簽章的流程，出自綠界這類金流服務的官方文件，2026-08-25 查證。
        </div>
      </section>

      <Pager prev={["/guides/oauth", "借別人的櫃台"]} next={["/guides/staging", "樣品屋與真店面"]} />
    </main>
  )
}
