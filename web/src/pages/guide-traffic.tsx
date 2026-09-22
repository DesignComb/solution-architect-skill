import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { ChefHat, CircleCheck, CircleX, ClipboardList, Gauge, Mail, MessageCircleQuestionMark, Receipt, Scale, ShoppingBasket, Store, TriangleAlert } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager, FlowArrow, FlowNode } from "@/components/site"
import { cn } from "@/lib/utils"

const SIGNALS: { icon: typeof Gauge; name: string; d1: string; d2: string }[] = [
  {
    icon: Gauge,
    name: "平台的用量面板",
    d1: "服務的後台有一頁用量面板，每一項用了多少都列在上面。",
    d2: "請求次數、傳輸的資料量、資料庫大小，一條一條看得到。",
  },
  {
    icon: Mail,
    name: "額度快用完的通知信",
    d1: "用量接近上限的時候，信箱會收到一封提醒信。",
    d2: "收到這封信的時候，事情都還來得及處理。",
  },
  {
    icon: Receipt,
    name: "帳單突然變高",
    d1: "有些服務額度用完會自動開始收費，網站照常運作。",
    d2: "帳單是最後一道警報，等它響的時候往往已經晚了。",
  },
]

const QUOTAS = [
  { svc: "Cloudflare Pages", free: "頻寬不限量", unit: "傳輸的資料量" },
  { svc: "Cloudflare Workers", free: "10 萬次請求/日", unit: "請求次數" },
  { svc: "Supabase", free: "500MB 資料庫、50,000 MAU", unit: "資料庫大小、活躍用戶數" },
  { svc: "Vercel Hobby", free: "100GB 頻寬/月、限個人非商業", unit: "傳輸的資料量" },
]

const REACTIONS = [
  {
    t: "直接擋下",
    what: "額度用完之後，多出來的請求直接被回絕，客人看到錯誤訊息。",
    prep: "平時就看用量面板，知道哪一項最接近上限。",
  },
  {
    t: "自動開始收費",
    what: "網站照常運作，多出來的用量會算進月底的帳單。",
    prep: "先設帳單上限或預算警示，不確定的服務一律當作這一種。",
  },
  {
    t: "變慢",
    what: "沒有擋下，也沒有收錢，但每一個動作都要等更久。",
    prep: "讓中繼站多存影本，或限制單一使用者的請求次數。",
  },
]

const STEPS = [
  { n: "看錯誤追蹤", say: "先打開錯誤追蹤，看有沒有一堆錯誤同時冒出來。" },
  { n: "看用量面板", say: "再看平台的用量面板，找出哪一項在飆。飆的那一項，就是塞住的零件。" },
  { n: "短期止血", say: "讓中繼站多存影本。常被點的餐先做好一份放在架上，不必每次回廚房現做。再限制單一使用者的請求次數。" },
  { n: "長期升級", say: "只升級那一個吃緊的零件，例如資料庫升付費方案。整個重寫不是選項。" },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "用量暴衝",
    q: "用量面板顯示請求次數一夜之間暴衝，但登入的人數幾乎沒變。先懷疑什麼？",
    options: [
      { label: "爆紅了，趕快升級方案", ok: false, why: "人沒變多，用量卻暴衝，比較像有人故意灌流量。先花錢升級，等於替攻擊的人付帳。" },
      { label: "可能是帳單攻擊，先確認帳單上限有沒有設", ok: true, why: "用量和人數對不上，就往資安方向查。帳單上限就是為這種時候準備的。" },
    ],
  },
  {
    tag: "客人說很卡",
    q: "客人回報網站按下去轉圈很久，偶爾還跳出錯誤。第一步該做什麼？",
    options: [
      { label: "先請人把網站整個重寫", ok: false, why: "塞的通常只是一個零件。整個重寫花大錢大時間，塞車的可能還是同一個地方。" },
      { label: "先看錯誤追蹤，再看用量面板哪一項在飆", ok: true, why: "錯誤追蹤看有沒有一堆錯誤，用量面板看哪一項在飆。找到那一個零件，再決定怎麼處理。" },
    ],
  },
  {
    tag: "額度用完",
    q: "免費額度用完了，網站會發生什麼事？",
    options: [
      { label: "一定會直接掛掉", ok: false, why: "反應分三種：直接擋下、自動開始收費、變慢。哪一種要看那家服務，價目表有寫。" },
      { label: "一定會自動開始收費", ok: false, why: "有些服務會擋下，有些會變慢，不是每一家都收費。不確定的時候，才把它當作會收費。" },
      { label: "看那家服務，不確定就先設帳單上限", ok: true, why: "價目表會寫清楚是哪一種。看不出來就當作會收費，先設帳單上限或預算警示。" },
    ],
  },
]

export default function GuideTraffic() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 網站塞車的時候
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">網站塞車的時候</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">紅了不一定會倒，但要知道錢會從哪裡開始流。</p>
      </header>

      {/* ============ 店門口的排隊 ============ */}
      <section id="metaphor" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Store className="size-7 text-primary" strokeWidth={1.6} /></span>店門口的排隊</SectionHead>
        <Decide q={["比喻", "店門口排了一條人龍"]} a={["重點", "排隊的是現做的餐，不是架上的貨"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">想像店門口排了一條長長的人龍，但仔細看，排隊的其實只有一種客人。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <ShoppingBasket className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">架上的現成商品</b>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <Badge>靜態頁面 static</Badge>
              <Badge>中繼站 CDN</Badge>
            </div>
            <p className="mt-2.5 text-[0.88rem] text-muted-foreground">首頁、文章、圖片這些做好就不會變的東西，都放在架上。客人伸手拿了就走，再多人也不用排隊。</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <ChefHat className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">廚房現做的餐</b>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <Badge>後端 backend</Badge>
              <Badge>資料庫 database</Badge>
            </div>
            <p className="mt-2.5 text-[0.88rem] text-muted-foreground">登入、搜尋、下單這些動作，每一次都要廚房現算、進倉庫查資料。客人一多，廚房忙不過來，人龍就從這裡開始排。</p>
          </Card>
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">靜態的東西由中繼站扛，幾乎不會塞。會塞的，是要算東西、要查資料庫的動作。</p>
      </section>

      {/* ============ 你會在哪裡遇到它 ============ */}
      <section id="where" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Gauge className="size-7 text-primary" strokeWidth={1.6} /></span>你會在哪裡遇到它</SectionHead>
        <Decide q={["場景", "三個地方會先告訴你"]} a={["提醒", "額度算的是用量，不是人數"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">免費額度多半是用「用量」算的，不是用人數算的。請求次數、傳輸的資料量、資料庫大小、活躍用戶數，都是用量。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {SIGNALS.map((s) => (
            <Card key={s.name} className="p-5">
              <div className="flex items-center gap-2.5">
                <s.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{s.name}</b>
              </div>
              <p className="mt-2.5 text-[0.88rem] text-muted-foreground">{s.d1}</p>
              <p className="mt-1.5 text-[0.88rem] text-muted-foreground">{s.d2}</p>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-[0.92rem] text-muted-foreground">下面是幾個常用服務的免費額度。同一個人一天用幾次，換算下來遠低於這些數字。</p>

        <Card className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">服務</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">免費額度</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">算的是什麼</th>
                </tr>
              </thead>
              <tbody>
                {QUOTAS.map((r, i) => (
                  <tr key={r.svc}>
                    <td className={cn("whitespace-nowrap px-4 py-3 align-top font-semibold", i < QUOTAS.length - 1 && "border-b border-border")}>{r.svc}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < QUOTAS.length - 1 && "border-b border-border")}>{r.free}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < QUOTAS.length - 1 && "border-b border-border")}>{r.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">算的是用量不是人數，所以人還少的時候，幾乎碰不到這些線。Vercel 那一行的「限個人非商業」是使用條款，不是用量。</p>
      </section>

      {/* ============ 額度用完會怎樣 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ClipboardList className="size-7 text-primary" strokeWidth={1.6} /></span>額度用完會怎樣</SectionHead>
        <Decide q={["原則", "反應分三種，看那家服務"]} a={["底線", "不確定就當作會收費"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">額度用完的時候，各家服務的反應分三種。哪一種要看那家服務，價目表有寫。</p>

        <Card className="mt-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">反應</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">你會看到什麼</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">該怎麼準備</th>
                </tr>
              </thead>
              <tbody>
                {REACTIONS.map((r, i) => (
                  <tr key={r.t}>
                    <td className={cn("whitespace-nowrap px-4 py-3 align-top font-semibold", i < REACTIONS.length - 1 && "border-b border-border")}>{r.t}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < REACTIONS.length - 1 && "border-b border-border")}>{r.what}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < REACTIONS.length - 1 && "border-b border-border")}>{r.prep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">不確定那家服務會怎麼反應，就當作會收費，先設帳單上限或預算警示。</p>

        <p className="mt-8 text-[0.92rem] text-muted-foreground">真的塞車了，先看兩個地方，再做兩件事。順序不要顛倒。</p>

        <div className="mt-4 flex flex-wrap items-center gap-2.5" aria-label="塞車時的處理順序">
          {STEPS.map((s, i) => (
            <Fragment key={s.n}>
              {i > 0 && <FlowArrow />}
              <FlowNode>{s.n}</FlowNode>
            </Fragment>
          ))}
        </div>

        <Card className="mt-5 overflow-hidden">
          {STEPS.map((s) => (
            <div key={s.n} className="flex items-start gap-3.5 border-b border-border px-5 py-3.5 last:border-b-0">
              <b className="w-[5.2em] shrink-0 text-[0.9rem]">{s.n}</b>
              <span className="text-sm text-muted-foreground">{s.say}</span>
            </div>
          ))}
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">多存影本這件事，技術上叫<Badge className="mx-1">快取 cache</Badge>。影本開起來快，但可能是舊的，這是它的代價。</p>
      </section>

      {/* ============ 常見錯誤 ============ */}
      <section id="mistakes" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><TriangleAlert className="size-7 text-primary" strokeWidth={1.6} /></span>常見錯誤</SectionHead>
        <Decide q={["現實", "出事的多半是沒設上限"]} a={["補救", "先看面板，再動一個零件"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">下面三個錯誤，都是網站一紅就會發生的事。每一個都把後果和正確做法講清楚。</p>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="no-cap">
            <AccordionTrigger>沒設帳單上限，等帳單來了才知道</AccordionTrigger>
            <AccordionContent>
              <p>額度用完的時候，有些服務會自動開始收費。網站照常運作，你完全感覺不到。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>用量一直跑，帳單一直長，等你發現已經是月底。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>不確定那家服務會怎麼反應，就當作會收費。開站第一天就設帳單上限或預算警示。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="rewrite">
            <AccordionTrigger>一塞車就想把整個網站重寫</AccordionTrigger>
            <AccordionContent>
              <p>塞車的多半只是一個零件，通常是要算東西、要查資料庫的那一段。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>重寫期間問題還在，重寫完吃緊的零件可能還是同一個。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>先看用量面板哪一項在飆，只升級那一個零件，例如資料庫升付費方案。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="fake-viral">
            <AccordionTrigger>把用量暴衝當成爆紅，其實是帳單攻擊</AccordionTrigger>
            <AccordionContent>
              <p>用量突然暴衝，但使用者沒有變多，可能是有人故意灌流量。這種事叫帳單攻擊。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>你花錢升級方案，其實是在替攻擊的人付帳。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>先把用量和使用者人數放在一起看，對不上就往資安方向查。帳單上限就是為這種時候準備的，細節在<Link to="/guides/security" className="text-primary"><b>資安基本功</b></Link>那一課。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼做"]} a={["提示", "答案全在上面幾段裡"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">塞車那天不會有時間查資料，反應要先練過。三題都做完，這一課才算上完。</p>

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
                      <b className={chosen.ok ? "text-ok" : "text-warn"}>{chosen.ok ? "這樣做對了" : "先停一下"}</b>
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
          塞車不可怕，可怕的是不知道錢從哪裡開始流。先設上限，再看面板，就不會慌。
        </p>

        <div className="mt-10 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <Scale className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          額度出自各服務官網價目表，2026-08-24 查證。
        </div>
      </section>

      <Pager prev={["/guides/dns", "地圖還沒更新"]} next={["/guides/memory", "AI 為什麼會忘記"]} />
    </main>
  )
}
