import { useState } from "react"
import { Link } from "react-router-dom"
import { CircleCheck, CircleX, ClipboardList, CreditCard, Globe, KeyRound, Lock, MessageCircleQuestionMark, Scale, Store, TriangleAlert } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

const KEYS: { icon: typeof Globe; name: string; en: string; prefix: string; old: string; d1: string; d2: string }[] = [
  {
    icon: Globe,
    name: "公開金鑰",
    en: "publishable key",
    prefix: "sb_publishable_ 開頭",
    old: "舊名 anon key",
    d1: "權限很低，設計成可以出現在網頁與 APP 裡。",
    d2: "它安全的前提，是倉庫有開門禁規則。",
  },
  {
    icon: Lock,
    name: "秘密金鑰",
    en: "secret key",
    prefix: "sb_secret_ 開頭",
    old: "舊名 service_role key",
    d1: "會繞過所有門禁規則，等於倉庫的萬能鑰匙。",
    d2: "只能放在你控制的伺服器上，絕不能進網頁、APP 或聊天對話。",
  },
]

const RULES = [
  {
    q: "能放哪裡",
    pub: "網頁與 APP 都可以，它本來就是設計給大家看的。",
    sec: "只有你控制的伺服器，收在環境變數這種放秘密的抽屜裡。",
  },
  {
    q: "權限",
    pub: "很低，能看到什麼全靠門禁規則把關。",
    sec: "繞過所有門禁規則，每一扇門都開得了。",
  },
  {
    q: "外洩了會怎樣",
    pub: "風險有限，因為有門禁擋著，前提是門禁真的有開。",
    sec: "整個資料庫任人讀寫，必須立刻作廢重發。",
  },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "AI 開口要鑰匙",
    q: "AI 說：把你的 service_role key 貼給我，我幫你把設定弄好。",
    options: [
      { label: "貼給它，設定完就好", ok: false, why: "秘密金鑰絕不能進聊天對話。貼出去過一次，就要當作已經外洩，得作廢重發。" },
      { label: "不貼，請它列步驟，我自己在後台操作", ok: true, why: "秘密金鑰留在你控制的地方，AI 一樣幫得上忙，這才是正確的分工。" },
    ],
  },
  {
    tag: "原始碼裡的金鑰",
    q: "你在網頁的原始碼裡，看到一串 sb_publishable_ 開頭的金鑰。",
    options: [
      { label: "完了，立刻把它作廢", ok: false, why: "這是公開金鑰，權限很低，本來就設計成可以出現在網頁裡，不用急著作廢。" },
      { label: "不緊張，但去確認倉庫的門禁規則有開", ok: true, why: "公開金鑰敢公開，靠的是門禁規則把關。門禁沒開，任何人都能讀走整張表。" },
    ],
  },
  {
    tag: "外洩通報",
    q: "服務寄來通報，說你的秘密金鑰已經外洩。第一步該做什麼？",
    options: [
      { label: "先查是從哪裡洩漏的", ok: false, why: "查原因是第二步。鑰匙還有效的每一分鐘，整個倉庫都任人讀寫。" },
      { label: "立刻回後台把金鑰作廢，重發一把新的", ok: true, why: "先止血，再查原因。只刪掉外流的紀錄沒有用，別人早就複製走了。" },
    ],
  },
]

export default function GuideKeys() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 兩把鑰匙
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">兩把鑰匙</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">一把可以給大家看，一把絕對不能。</p>
      </header>

      {/* ============ 店裡的兩種鑰匙 ============ */}
      <section id="metaphor" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Store className="size-7 text-primary" strokeWidth={1.6} /></span>店裡的兩種鑰匙</SectionHead>
        <Decide q={["比喻", "店裡的鑰匙分兩種"]} a={["重點", "差別不在長相，在權限"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">想像你開了一間店，店裡的鑰匙有兩種。一種印在名片上發給客人，一種收在老闆的口袋裡。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <CreditCard className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">名片上的會員卡</b>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">誰都拿得到，拿到也只能做很少的事。它敢印在名片上，是因為店裡每一扇門都另外有門禁管著。</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <KeyRound className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">倉庫的萬能鑰匙</b>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">只有老闆有，店裡所有的門它都開得了。它一旦落到別人手上，整間店等於拱手送人。</p>
          </Card>
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">軟體世界的金鑰，就是這兩種鑰匙。下面一把一把認清楚。</p>
      </section>

      {/* ============ 你會在哪裡遇到它 ============ */}
      <section id="where" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><KeyRound className="size-7 text-primary" strokeWidth={1.6} /></span>你會在哪裡遇到它</SectionHead>
        <Decide q={["場景", "後台的金鑰頁面"]} a={["提醒", "舊名新名都要認得"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">開好倉庫服務之後，後台會發給你兩把金鑰，Supabase 這類服務都是這樣。這兩把的長相和名字，現在就認熟。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {KEYS.map((k) => (
            <Card key={k.name} className="p-5">
              <div className="flex items-center gap-2.5">
                <k.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{k.name}</b>
                <span className="ml-auto rounded-full border border-input bg-secondary px-2 py-0.5 font-mono text-[0.62rem] text-faint">{k.old}</span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Badge>{k.en}</Badge>
                <Badge>{k.prefix}</Badge>
              </div>
              <p className="mt-2.5 text-[0.88rem] text-muted-foreground">{k.d1}</p>
              <p className="mt-1.5 text-[0.88rem] text-muted-foreground">{k.d2}</p>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">角落灰色的舊名要一起記住，因為舊教學和 AI 到現在都還常講舊名。新舊兩套目前同時可用，舊金鑰預計 2026 年底淘汰。</p>
      </section>

      {/* ============ 一張表分清楚 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ClipboardList className="size-7 text-primary" strokeWidth={1.6} /></span>一張表分清楚</SectionHead>
        <Decide q={["原則", "放哪裡，看權限決定"]} a={["通則", "各家服務都是同一套分法"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">兩把鑰匙的差別，整理成一張表。拿不準的時候，回來對這張表就好。</p>

        <Card className="mt-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">對照</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">公開金鑰</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">秘密金鑰</th>
                </tr>
              </thead>
              <tbody>
                {RULES.map((r, i) => (
                  <tr key={r.q}>
                    <td className={cn("whitespace-nowrap px-4 py-3 align-top font-semibold", i < RULES.length - 1 && "border-b border-border")}>{r.q}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < RULES.length - 1 && "border-b border-border")}>{r.pub}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < RULES.length - 1 && "border-b border-border")}>{r.sec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">收錢用的 Stripe 也是同一種分法：publishable key 放店面那一層，secret key 只放伺服器。這是業界通則，不是哪一家獨有。</p>
      </section>

      {/* ============ 常見錯誤 ============ */}
      <section id="mistakes" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><TriangleAlert className="size-7 text-primary" strokeWidth={1.6} /></span>常見錯誤</SectionHead>
        <Decide q={["現實", "出事的通常不是技術，是順手"]} a={["補救", "貼出去過，就當作已經外洩"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">下面三個錯誤，每天都在真實世界發生。每一個都把後果和正確做法講清楚。</p>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="paste-ai">
            <AccordionTrigger>把秘密金鑰貼進聊天對話，請 AI 幫忙設定</AccordionTrigger>
            <AccordionContent>
              <p>秘密金鑰絕不能進聊天對話，這一條沒有例外。它只要離開你控制的地方一次，就要當作已經外洩。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>拿到它的人可以繞過所有門禁，整個倉庫任人讀寫。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>請 AI 告訴你步驟，你自己在後台操作。已經貼過的話，立刻回後台把那把金鑰作廢重發。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="in-webpage">
            <AccordionTrigger>把秘密金鑰寫進網頁的程式裡</AccordionTrigger>
            <AccordionContent>
              <p>網頁的原始碼，任何人打開都看得到。秘密金鑰寫進去，等於把萬能鑰匙掛在店門口。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>撿到的人每一扇門都開得了，你的資料庫從此任人讀寫。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>網頁裡只放公開金鑰，秘密金鑰收在伺服器的環境變數裡。已經寫進去過，同樣立刻作廢重發。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="old-name">
            <AccordionTrigger>看到舊教學寫 anon key，以為是另一把鑰匙</AccordionTrigger>
            <AccordionContent>
              <p>這不是兩把不同的鑰匙，是同一把的新舊名字。公開金鑰以前叫 anon key，秘密金鑰以前叫 service_role key。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>白白花時間找一把不存在的鑰匙，或是照著舊教學亂設一通。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>看到舊名，在心裡換成新名就好。新舊兩套目前同時可用，舊金鑰預計 2026 年底淘汰。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼做"]} a={["提示", "答案全在上面那張表裡"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">臨場的反應，要先演練過才會有。三題都做完，這一課才算上完。</p>

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
          公開金鑰敢公開，靠的不是運氣，是倉庫的門禁。下一課，就來看這道門禁怎麼設。
        </p>

        <div className="mt-10 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <Scale className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          金鑰的命名與行為，出自 Supabase 與 Stripe 官方文件（2026-08-25 查證）。
        </div>
      </section>

      <Pager prev={["/guides/security", "資安基本功"]} next={["/guides/rls", "倉庫的門禁"]} />
    </main>
  )
}
