import { useState } from "react"
import { Link } from "react-router-dom"
import { Bot, CircleCheck, CircleX, ListChecks, Lock, MessageCircleQuestionMark, Scale, ToggleRight, TriangleAlert, Warehouse } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

const LOCKERS = [
  { name: "小明的櫃子", rule: "只有小明本人能開" },
  { name: "小美的櫃子", rule: "只有小美本人能開" },
  { name: "你的櫃子", rule: "只有你本人能開" },
]

const MEET: { icon: typeof Bot; t: string; d: string[] }[] = [
  {
    icon: Bot,
    t: "跟 AI 對話的時候",
    d: [
      "你請 AI 幫你建一張資料表，它常會問一句：要不要設定 RLS。",
      "有時它不問，直接告訴你已經把 RLS 開好了。現在你知道，它講的就是櫃子上的門禁規則。",
    ],
  },
  {
    icon: ToggleRight,
    t: "服務後台的資料表設定",
    d: [
      "資料庫服務的後台裡，每張資料表的設定都有門禁的開關。",
      "一時找不到的話，把那張表的設定打開來翻一翻就有。",
    ],
  },
]

const ORDER_RULES = [
  { rule: "每個人只能看到自己的訂單", plain: "客人來查訂單，倉庫只交出屬於他的那幾列。" },
  { rule: "只有店家能改訂單狀態", plain: "客人不能自己動手，把未付款改成已付款。" },
  { rule: "沒登入的人什麼都看不到", plain: "沒表明身分的人來開口，倉庫一列也不交出去。" },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "規則放哪裡",
    q: "你要做會員專區，每個人只能看自己的資料。這條規則該寫在哪裡？",
    options: [
      { label: "寫在畫面上，把別人的資料藏起來", ok: false, why: "畫面藏得住按鈕，藏不住資料。繞過畫面直接向倉庫開口，別人的資料照樣拿得走。" },
      { label: "寫在資料庫身上，讓倉庫自己把關", ok: true, why: "規則寫在資料庫身上，不管誰從哪裡來要資料，倉庫都用同一套規則擋。" },
    ],
  },
  {
    tag: "危險組合",
    q: "公開金鑰放在網頁裡，但資料表的門禁沒開。會發生什麼事？",
    options: [
      { label: "沒事，公開金鑰本來就是設計給人看的", ok: false, why: "公開金鑰敢公開，前提是門禁有開。前提不成立，它就成了誰都能用的倉庫鑰匙。" },
      { label: "任何人打開瀏覽器，就能讀走整張表", ok: true, why: "公開金鑰的安全全靠門禁規則把關，門禁沒開就等於倉庫大門敞開。" },
    ],
  },
  {
    tag: "AI 的建議",
    q: "AI 幫你建表時說：先把 RLS 關掉比較好測試。上線前該做什麼？",
    options: [
      { label: "測試都正常，就直接上線", ok: false, why: "門禁關著上線，等於整排置物櫃都沒上鎖。測試方便是暫時的，不能當成安全。" },
      { label: "請 AI 把每張表的門禁重新打開，再檢查規則", ok: true, why: "關掉是為了測試方便，上線前要一張一張開回來，並確認規則還掛在櫃子上。" },
    ],
  },
]

export default function GuideRls() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 倉庫的門禁
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">倉庫的門禁</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">公開金鑰敢公開，靠的全是這一層。</p>
      </header>

      {/* ============ 一排上鎖的置物櫃 ============ */}
      <section id="metaphor" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Warehouse className="size-7 text-primary" strokeWidth={1.6} /></span>一排上鎖的置物櫃</SectionHead>
        <Decide q={["比喻", "倉庫是一排置物櫃，不是一個大房間"]} a={["主角", "櫃子上寫的規則，叫門禁規則"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          〈軟體怎麼運作〉那一課說過，所有資料都收在倉庫裡。很多人把倉庫想成一個大房間，門一開就全部看光。
        </p>
        <p className="mt-2.5 text-[0.92rem] text-muted-foreground">
          更貼近實際的想像，是一整排上了鎖的置物櫃。每個客人有自己的一格，櫃子上寫著規則：只有本人能開自己的櫃子。
        </p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {LOCKERS.map((l) => (
            <Card key={l.name} className="p-4">
              <div className="flex items-center gap-2.5">
                <Lock className="size-4 shrink-0 text-primary" strokeWidth={1.8} />
                <b className="text-[0.92rem]">{l.name}</b>
              </div>
              <p className="mt-1.5 text-[0.82rem] text-muted-foreground">{l.rule}</p>
            </Card>
          ))}
        </div>

        <p className="mt-5 text-[0.92rem] text-muted-foreground">
          這種寫在櫃子上的規則，就是這一課的主角：門禁規則。它對資料表一列一列設規則，一筆訂單就是一列。
        </p>
        <p className="mt-2.5"><Badge>技術名：RLS ・ Row Level Security</Badge></p>
        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          上一課說過，公開金鑰權限很低，可以放心出現在網頁和 APP 裡。它敢這麼做的前提只有一個：倉庫的門禁規則有開。
        </p>
        <p className="mt-3 text-[0.78rem] text-faint">灰色標籤是技術原名，記不住可以直接跳過，認得出縮寫就夠用了。</p>
      </section>

      {/* ============ 你會在哪裡遇到它 ============ */}
      <section id="meet" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Bot className="size-7 text-primary" strokeWidth={1.6} /></span>你會在哪裡遇到它</SectionHead>
        <Decide q={["場景", "叫 AI 建資料表的時候就會遇到"]} a={["提醒", "聽到 RLS 三個字母，就是在講它"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          門禁規則不用你自己發明，它會主動出現在兩個地方。遇到的時候認得出來，對話就不會卡住。
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
      </section>

      {/* ============ 三條白話規則 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ListChecks className="size-7 text-primary" strokeWidth={1.6} /></span>三條白話規則</SectionHead>
        <Decide q={["例子", "一張訂單表，三條規則就夠"]} a={["原則", "規則寫在資料庫，不是寫在畫面"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          抽象的規則，用一張訂單表想就清楚了。假設你開了網路商店，倉庫裡有一張表，存著所有客人的訂單。
        </p>

        <Card className="mt-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">寫在櫃子上的規則</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">倉庫實際的做法</th>
                </tr>
              </thead>
              <tbody>
                {ORDER_RULES.map((r, i) => {
                  const last = i === ORDER_RULES.length - 1
                  return (
                    <tr key={r.rule}>
                      <td className={cn("whitespace-nowrap px-4 py-3 align-top font-semibold", !last && "border-b border-border")}>{r.rule}</td>
                      <td className={cn("px-4 py-3 align-top text-muted-foreground", !last && "border-b border-border")}>{r.plain}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-5 rounded-lg border-[1.5px] border-primary/40 bg-primary/8 px-5 py-4">
          <p className="text-[0.92rem] font-semibold">這三條有一個共同點：它們寫在資料庫身上，不是寫在畫面上。</p>
          <p className="mt-2 text-[0.88rem] text-muted-foreground">
            畫面藏得住按鈕，藏不住資料。就算畫面上看不到別人的訂單，資料仍然躺在倉庫裡。
            只要有人繞過畫面直接向倉庫開口，把關的就只剩櫃子上的門禁規則了。
          </p>
        </div>
      </section>

      {/* ============ 常見錯誤 ============ */}
      <section id="mistakes" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><TriangleAlert className="size-7 text-primary" strokeWidth={1.6} /></span>常見錯誤</SectionHead>
        <Decide q={["共同點", "三個錯誤都是把方便當成安全"]} a={["下場", "整張表被別人讀走"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          下面三種災難都真實發生過，而且每一種都可以完全避免。點開來看事情是怎麼發生的。
        </p>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="no-rls">
            <AccordionTrigger>沒開門禁，就把公開金鑰放上網頁</AccordionTrigger>
            <AccordionContent>
              <p>公開金鑰本來就會跟著網頁，送進每一位訪客的瀏覽器。它安全的前提，是倉庫的門禁規則有開。</p>
              <p className="mt-2">門禁沒開的那一刻，任何人打開瀏覽器，就能直接讀走整張表。會員名單、訂單、電話，一次全部外流。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="hide-in-ui">
            <AccordionTrigger>只在畫面上隱藏別人的資料，以為這樣就安全</AccordionTrigger>
            <AccordionContent>
              <p>把別人的資料從畫面上藏起來，只是把按鈕拿掉而已。資料一列都沒有少，全部還躺在倉庫裡。</p>
              <p className="mt-2">懂門路的人可以繞過畫面，直接向倉庫開口要資料。把關的工作要交給倉庫自己，不能靠畫面幫忙遮。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="secret-shortcut">
            <AccordionTrigger>用秘密金鑰圖方便，繞過自己設的門禁</AccordionTrigger>
            <AccordionContent>
              <p>秘密金鑰會繞過所有門禁規則，等於倉庫的萬能鑰匙。拿它來做一般功能，等於親手把門禁全部拆掉。</p>
              <p className="mt-2">它只能放在你控制的伺服器上，收進環境變數這種專門放秘密的抽屜。網頁、APP、跟 AI 的聊天對話，一律不准出現。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼做"]} a={["提示", "答案全部藏在剛剛的段落裡"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          三題都從真實情境改寫。答錯沒有關係，重點是上線前能想起這一課。
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
          畫面藏得住按鈕，藏不住資料；把關的事，交給倉庫自己來。
        </p>

        <p className="mx-auto mt-8 max-w-[620px] text-[0.92rem] text-muted-foreground">
          上一課的<Link to="/guides/keys" className="text-primary"><b>兩把鑰匙</b></Link>，跟這一課的門禁是一組的：公開金鑰敢見人，是因為門禁在後面擋著。
          剩下最後一個問題：門禁怎麼知道現在開櫃子的是不是本人？答案叫登入，<Link to="/guides/login" className="text-primary"><b>下一課</b></Link>就講它。
        </p>

        <div className="mt-10 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <Scale className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          門禁規則的名稱與行為出自 Supabase 官方文件（2026-08-25 查證）。
        </div>
      </section>

      <Pager prev={["/guides/keys", "兩把鑰匙"]} next={["/guides/migrations", "倉庫的施工紀錄"]} />
    </main>
  )
}
