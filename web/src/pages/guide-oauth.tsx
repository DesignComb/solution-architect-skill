import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen, Building2, CircleCheck, CircleX, ClipboardList, Fingerprint, Handshake, IdCard, MessageCircleQuestionMark, MousePointerClick, Phone, ShieldCheck, Smartphone, TriangleAlert, UserCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager, FlowArrow, FlowNode } from "@/components/site"
import { cn } from "@/lib/utils"

const LOBBY: { icon: typeof IdCard; t: string; chip?: string; d: string }[] = [
  { icon: IdCard, t: "證件只給櫃台看", d: "你把證件交給一樓的櫃台核對。證件從頭到尾只有櫃台看過，樓上的公司連影本都拿不到。" },
  { icon: Phone, t: "櫃台打電話上樓", d: "核對完，櫃台打電話跟樓上說「這個人是誰」。樓上的公司相信的，是櫃台的這一通電話。" },
  { icon: UserCheck, t: "樓上發自己的通行證", chip: "借櫃台登入 OAuth", d: "樓上的公司聽完電話，發一張自己的通行證給你，就是上一課的那條手環。接下來在這層樓走動，看的就是這張通行證。" },
]

const SIDES: { icon: typeof Smartphone; t: string; d1: string; d2: string; chips: string[] }[] = [
  {
    icon: Smartphone,
    t: "客人這一邊：登入畫面",
    d1: "登入畫面上的「用 Google 登入」「用 LINE 登入」，就是借櫃台登入。按下去畫面會跳到 Google 的頁面，密碼是輸給 Google，不是輸給這個網站。",
    d2: "台灣的產品很常放 LINE 登入，LINE Login 本身免費。",
    chips: ["用 Google 登入", "用 LINE 登入"],
  },
  {
    icon: ClipboardList,
    t: "老闆這一邊：開發者後台",
    d1: "做登入功能時，AI 會請你先去 Google 或 LINE 的開發者後台登記你的網站。登記完會拿到一組識別碼和一把秘密金鑰，AI 會請你貼回專案裡。",
    d2: "這把秘密金鑰只能放伺服器，規則跟〈兩把鑰匙〉那一課相同。",
    chips: ["識別碼 client ID", "秘密金鑰 client secret"],
  },
]

const SEEN = [
  { t: "跳出去的那一頁", d: "按下按鈕後，畫面離開你的網站，跳到 Google 自己的頁面。使用者在那一頁輸入密碼，輸給的是 Google。" },
  { t: "問一句的畫面", d: "Google 會問使用者「要把你的名字和信箱交給這個網站嗎」。他按下同意，才會被送回你的網站。" },
  { t: "後台的登記表", d: "開發者後台裡除了識別碼和金鑰，還有一欄「允許跳回來的網址」。這一欄填錯或漏填，登入會失敗。" },
]

const FLOW = [
  { n: "按下按鈕", say: "使用者在你的登入頁按下「用 Google 登入」。畫面從這一刻離開你的網站。" },
  { n: "到櫃台輸密碼", say: "畫面跳到 Google 自己的頁面，使用者在那裡輸入密碼。密碼是輸給 Google，不是輸給你。" },
  { n: "櫃台問一句", say: "Google 問他「要把你的名字和信箱交給這個網站嗎」。他看清楚之後按下同意。" },
  { n: "帶著證明跳回", say: "使用者被送回你的網站，網站拿到一張由 Google 擔保的身分證明。你的網站從頭到尾拿不到他的 Google 密碼。" },
  { n: "網站發通行證", say: "網站認完證明，發下自己的通行證。從這裡開始，就接回上一課〈登入之後〉的手環。" },
]

const PREP = [
  { what: "去櫃台登記", where: "Google 或 LINE 的開發者後台", note: "先把你的網站登記上去，櫃台才知道樓上有這家公司。" },
  { what: "識別碼與秘密金鑰", where: "登記完，後台會發給你", note: "秘密金鑰只能放伺服器，規則跟〈兩把鑰匙〉那一課相同。識別碼是讓櫃台認出你的網站用的。" },
  { what: "允許跳回來的網址", where: "同一個後台的設定頁", note: "樣品屋和真店面的網址都要填。填錯或漏填，登入會失敗，跳出跟「redirect」有關的錯誤。" },
  { what: "授權範圍", where: "同一個後台，勾選要哪些資料", note: "只要名字和信箱就好。多要的權限使用者會怕，審核也更麻煩。" },
]

const TRADE: { icon: typeof ShieldCheck; t: string; tone: "ok" | "warn"; d: string }[] = [
  { icon: ShieldCheck, t: "好處", tone: "ok", d: "使用者不用多記一組密碼，你也不用替他保管密碼。這兩件事，都是借櫃台換來的。" },
  { icon: Fingerprint, t: "代價", tone: "warn", d: "他的 Google 帳號被盜，你這邊的帳號也一起被盜。所以你自己的帳號，一定要開兩步驟驗證。" },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "密碼去哪了",
    q: "使用者用「用 Google 登入」進了你的網站。你的網站拿得到他的 Google 密碼嗎？",
    options: [
      { label: "拿得到，登入的時候他有輸入密碼", ok: false, why: "密碼是輸在 Google 的頁面，交給的是 Google 的櫃台。你的網站從頭到尾拿不到他的 Google 密碼。" },
      { label: "拿不到，網站只拿到 Google 擔保的身分證明", ok: true, why: "櫃台只打電話上樓說「這個人是誰」，證件留在櫃台。這正是借櫃台登入的好處。" },
    ],
  },
  {
    tag: "redirect 錯誤",
    q: "網站上線後，客人按下登入，畫面跳出跟「redirect」有關的錯誤。先檢查什麼？",
    options: [
      { label: "先請 AI 把登入的程式重寫一遍", ok: false, why: "這個錯誤多半不是程式壞掉，是後台的登記表少填了網址。先對後台，再談改程式。" },
      { label: "先回開發者後台，看真店面的網址有沒有填進「允許跳回來的網址」", ok: true, why: "這是最常見的卡點。樣品屋和真店面的網址都要填，漏了哪一個，那一個就登不進去。" },
    ],
  },
  {
    tag: "哪一把不能放網頁",
    q: "登記完拿到一組識別碼和一把秘密金鑰。哪一把絕對不能出現在網頁裡？",
    options: [
      { label: "秘密金鑰，只能放你控制的伺服器", ok: true, why: "規則跟〈兩把鑰匙〉那一課一樣，秘密金鑰只能放你控制的伺服器。登入是 Google 在管沒錯，這把鑰匙卻要由你自己收好。" },
      { label: "兩把都可以放，反正登入是 Google 在管", ok: false, why: "秘密金鑰只能放伺服器。它一出現在網頁裡，任何人打開原始碼都看得到，就要當作已經外洩。" },
    ],
  },
]

export default function GuideOauth() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 借別人的櫃台
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">借別人的櫃台</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">驗身分交給 Google 的櫃台，網站連你的密碼都碰不到。</p>
      </header>

      {/* ============ 一樓的櫃台 ============ */}
      <section id="lobby" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Building2 className="size-7 text-primary" strokeWidth={1.6} /></span>一樓的櫃台</SectionHead>
        <Decide q={["比喻", "進大樓先在一樓櫃台驗證件"]} a={["重點", "樓上的公司拿不到你的證件"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">想像你要去一棟大樓拜訪某家公司。你不必跟每家公司各登記一次，只要在一樓櫃台驗過證件就好。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {LOBBY.map((l) => (
            <Card key={l.t} className="p-5">
              <div className="flex items-center gap-2.5">
                <l.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{l.t}</b>
              </div>
              <p className="mt-2 text-[0.88rem] text-muted-foreground">{l.d}</p>
              {l.chip && <span className="mt-2.5 block"><Badge>技術名：{l.chip}</Badge></span>}
            </Card>
          ))}
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">「用 Google 登入」就是這一套。Google 是一樓的櫃台，你的網站是樓上那家公司。</p>
      </section>

      {/* ============ 你會在哪裡遇到它 ============ */}
      <section id="where" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MousePointerClick className="size-7 text-primary" strokeWidth={1.6} /></span>你會在哪裡遇到它</SectionHead>
        <Decide q={["畫面上", "登入頁那顆「用 Google 登入」"]} a={["後台裡", "登記完貼回識別碼和金鑰"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">這個櫃台你天天都在用，只是一直站在客人那一邊。做自己的產品時你會換到老闆這一邊，看到的東西也不一樣。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {SIDES.map((s) => (
            <Card key={s.t} className="p-5">
              <div className="flex items-center gap-2.5">
                <s.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{s.t}</b>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {s.chips.map((c) => <Badge key={c}>{c}</Badge>)}
              </div>
              <p className="mt-2.5 text-[0.88rem] text-muted-foreground">{s.d1}</p>
              <p className="mt-1.5 text-[0.88rem] text-muted-foreground">{s.d2}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-5 overflow-hidden">
          {SEEN.map((s) => (
            <div key={s.t} className="flex items-start gap-3.5 border-b border-border px-5 py-3.5 last:border-b-0">
              <b className="w-[8.5em] shrink-0 text-[0.9rem]">{s.t}</b>
              <span className="text-sm text-muted-foreground">{s.d}</span>
            </div>
          ))}
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">卡片裡的灰色標籤是行話原名，AI 對話裡看到就認得出來。</p>
      </section>

      {/* ============ 櫃台的流程 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Handshake className="size-7 text-primary" strokeWidth={1.6} /></span>櫃台的流程</SectionHead>
        <Decide q={["流程", "從按下按鈕到拿到通行證，五步"]} a={["原則", "密碼只給櫃台，網站只拿證明"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">上一課的手環，是從驗票那一刻開始講。這一課把驗票這一步拆開，看密碼到底交到了誰手上。</p>

        <div className="mt-7 flex flex-wrap items-center gap-2.5" aria-label="借櫃台登入的流程">
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
              <b className="w-[7em] shrink-0 text-[0.9rem]">{f.n}</b>
              <span className="text-sm text-muted-foreground">{f.say}</span>
            </div>
          ))}
        </Card>

        <p className="mt-8 text-[0.92rem] text-muted-foreground">流程要跑得起來，櫃台得先認得你的網站。動工前，這四樣東西要先準備好。</p>

        <Card className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">準備什麼</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">在哪裡弄</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">要注意</th>
                </tr>
              </thead>
              <tbody>
                {PREP.map((p, i) => (
                  <tr key={p.what}>
                    <td className={cn("whitespace-nowrap px-4 py-3 align-top font-semibold", i < PREP.length - 1 && "border-b border-border")}>{p.what}</td>
                    <td className={cn("whitespace-nowrap px-4 py-3 align-top text-muted-foreground", i < PREP.length - 1 && "border-b border-border")}>{p.where}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < PREP.length - 1 && "border-b border-border")}>{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {TRADE.map((t) => (
            <Card key={t.t} className="p-5">
              <div className="flex items-center gap-2.5">
                <t.icon className={cn("size-5 shrink-0", t.tone === "ok" ? "text-ok" : "text-warn")} strokeWidth={1.6} />
                <b className={cn("text-[1.02rem]", t.tone === "ok" ? "text-ok" : "text-warn")}>{t.t}</b>
              </div>
              <p className="mt-2 text-[0.88rem] text-muted-foreground">{t.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ============ 常見錯誤 ============ */}
      <section id="mistakes" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><TriangleAlert className="size-7 text-primary" strokeWidth={1.6} /></span>常見錯誤</SectionHead>
        <Decide q={["現實", "卡住的多半是設定，不是程式"]} a={["第一步", "先回後台對一遍登記表"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">下面三個錯誤，第一個幾乎每個人都會撞到一次。每一個都把後果和正確做法講清楚。</p>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="redirect">
            <AccordionTrigger>允許跳回來的網址，只填了樣品屋</AccordionTrigger>
            <AccordionContent>
              <p>在自己電腦上的樣品屋，登入一直都好好的。正式上線到真店面，客人一按登入就失敗，畫面跳出跟「redirect」有關的錯誤。</p>
              <p className="mt-2">這是借櫃台登入最常見的卡點。櫃台只認登記表上寫過的網址，真店面的網址沒填，客人一按登入就被擋下來。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>客人在真店面按了登入，只看到一頁錯誤，你還以為是程式壞了。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>回開發者後台，把樣品屋和真店面的網址都填進「允許跳回來的網址」。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="secret-in-web">
            <AccordionTrigger>把秘密金鑰貼到網頁裡</AccordionTrigger>
            <AccordionContent>
              <p>登記拿到的那把秘密金鑰，被順手寫進網頁的程式裡。網頁的原始碼，任何人打開都看得到。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>它一離開你控制的伺服器，就要當作已經外洩，必須回後台作廢重發。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>秘密金鑰收在伺服器上放秘密的抽屜裡，也就是環境變數。規矩跟〈兩把鑰匙〉那一課同一套。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="scope">
            <AccordionTrigger>授權範圍能勾的全勾了</AccordionTrigger>
            <AccordionContent>
              <p>登記時看到可以勾的資料很多，想說多要一點以後方便，把能勾的全都勾了。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>使用者在同意畫面看到一長串權限會怕，審核也更麻煩。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>只要名字和信箱就好。登入需要的就這兩樣，其他的等真的用到再說。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼答"]} a={["提示", "答案全在櫃台的流程裡"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">這三題，都是做登入功能時真的會碰到的狀況。先在這裡想清楚，之後遇到就不慌。</p>

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
          密碼留在櫃台，樓上只收到一通電話。這就是借別人的櫃台。
        </p>

        <p className="mt-6 text-center text-[0.92rem] text-muted-foreground">
          到這裡，你的網站已經會借櫃台認人了。下一課換個方向：不是你去別人的櫃台，是別的服務來敲你的門。
        </p>

        <div className="mt-10 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <BookOpen className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          借櫃台登入的流程與後台設定項目，出自 Google 與 LINE 的官方開發者文件；LINE Login 免費的說法出自 LINE 官網，2026-08-24 查證。
        </div>
      </section>

      <Pager prev={["/guides/login", "登入之後"]} next={["/guides/webhooks", "誰在敲門"]} />
    </main>
  )
}
