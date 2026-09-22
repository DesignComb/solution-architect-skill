import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { BookUser, CircleCheck, CircleX, ClipboardList, Cloud, Globe, Map, MapPin, MessageCircleQuestionMark, Navigation, Search, Signpost, Smartphone, TriangleAlert } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager, FlowArrow, FlowNode } from "@/components/site"
import { cn } from "@/lib/utils"

const SCENES: { icon: typeof Globe; name: string; chip: string; d: string; see: string }[] = [
  {
    icon: Globe,
    name: "剛買下網域",
    chip: "網域 domain",
    d: "手上多了一串網址，但通訊錄裡還沒有它要對到的機器位置。接下來的每一步設定，都是在把這一筆補上去。",
    see: "網域後台裡有一頁放紀錄的設定，等一下要貼的東西就貼在這裡。",
  },
  {
    icon: Cloud,
    name: "剛在部署平台加上網域",
    chip: "DNS 紀錄",
    d: "平台會給你一兩筆紀錄，要你貼到管理網域的後台。貼完之後的那幾個小時，是最容易以為自己設壞的時候。",
    see: "平台頁面上列著一兩筆紀錄，等你照抄到網域後台。",
  },
  {
    icon: BookUser,
    name: "剛把網域搬去 Cloudflare 管",
    chip: "名稱伺服器 nameserver",
    d: "這等於換掉整本通訊錄的管理者，是最慢的一種改動。搬完之後再改一筆紀錄，通常幾分鐘內就好。",
    see: "這一兩天裡，你看到的和別人看到的，可能不一樣。",
  },
]

const STEPS: { n: string; say: string; auto?: boolean }[] = [
  { n: "加上網域", say: "到部署平台的設定裡，把你買的網址加進去。" },
  { n: "拿到紀錄", say: "平台會給你一兩筆紀錄，那就是要抄進通訊錄的內容。" },
  { n: "貼進網域後台", say: "打開管理網域的後台，把那一兩筆紀錄照抄貼上。" },
  { n: "等生效", say: "各地通訊錄陸續更新，通常幾分鐘到幾小時，最慢可能要到一兩天。" },
  { n: "鎖頭出現", say: "生效之後，平台自動發 HTTPS 憑證，網址列出現鎖頭就完成了。", auto: true },
]

const WAITS: { what: string; chip?: string; wait: string; why: string }[] = [
  {
    what: "改一筆紀錄",
    chip: "TTL",
    wait: "通常幾分鐘到幾小時，最慢可能要到一兩天。",
    why: "每一筆紀錄都帶著一個「多久重抓一次」的時間，各地到了時間才會重抓。",
  },
  {
    what: "已經在 Cloudflare 管的網域，改一筆紀錄",
    wait: "通常幾分鐘內就好。",
    why: "整本通訊錄已經在 Cloudflare 那邊，你只是改其中一筆。",
  },
  {
    what: "換掉網域的名稱伺服器",
    chip: "nameserver",
    wait: "最慢的一種，可能要等到一兩天。",
    why: "例如把網域的 DNS 整個搬去 Cloudflare 管，等於換掉整本通訊錄的管理者。",
  },
  {
    what: "憑證發放",
    chip: "HTTPS",
    wait: "紀錄生效後由平台自動發，再等一下就好。",
    why: "發完之前可能看到「不安全」警告，網址出現鎖頭才算完成。",
  },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "十分鐘還連不上",
    q: "你剛把平台給的紀錄貼進網域後台，十分鐘過去了，網址還是打不開。",
    options: [
      { label: "把紀錄刪掉，重貼一次", ok: false, why: "反覆改設定，只會把生效時間重算一次。改完一次就等，通常幾分鐘到幾小時會生效。" },
      { label: "先不要動，用手機切到行動網路試試看", ok: true, why: "通常要幾分鐘到幾小時才生效，最慢可能要到一兩天。換一本通訊錄看，就知道是不是只有你這邊還沒更新。" },
    ],
  },
  {
    tag: "別人打得開，你打不開",
    q: "朋友說你的網站打得開，你自己卻一直打不開。怎麼確認是不是你這邊的通訊錄還沒更新？",
    options: [
      { label: "回後台把設定全部重做一遍", ok: false, why: "朋友打得開，代表設定已經生效了。重做一遍，只是把等待的時間重算。" },
      { label: "請 AI 幫你查目前各地解析到哪裡", ok: true, why: "各地通訊錄是陸續更新的。查一下各地對到哪裡，就知道是不是只剩你這邊還在舊址。" },
    ],
  },
  {
    tag: "哪一種最慢",
    q: "下面三種改動，哪一種要等最久？",
    options: [
      { label: "在 Cloudflare 管的網域裡改一筆紀錄", ok: false, why: "已經在 Cloudflare 管的網域，改一筆紀錄通常幾分鐘內就好。" },
      { label: "把網域的名稱伺服器整個換去 Cloudflare", ok: true, why: "換名稱伺服器是最慢的一種改動，可能要等到一兩天。要搬家，先挑一個不趕的日子。" },
      { label: "等平台發 HTTPS 憑證", ok: false, why: "憑證是紀錄生效後由平台自動發的，再等一下就好。" },
    ],
  },
]

export default function GuideDns() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 地圖還沒更新
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">地圖還沒更新</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">不是壞了，是各家地圖還沒更新你的新店址。</p>
      </header>

      {/* ============ 搬了新店址 ============ */}
      <section id="metaphor" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Map className="size-7 text-primary" strokeWidth={1.6} /></span>搬了新店址</SectionHead>
        <Decide q={["比喻", "搬新店址，地圖陸續更新"]} a={["重點", "有人先看到新的，有人還在舊址"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">想像你的店搬到了新地址，各家地圖要陸續才會跟著更新。有人先看到新的，有人還被導去舊址。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <Navigation className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">已經更新的那一家</b>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">有些客人用的地圖已經換成新地址，導航順順地把他們帶到新店門口。對這些客人來說，你的店從來沒有出過問題。</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <MapPin className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">還沒更新的那一家</b>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">另一些客人用的地圖還是舊資料，導航把他們帶到舊址，門口只有一張搬遷公告。他們會以為店倒了，其實只是地圖慢了一步。</p>
          </Card>
        </div>

        <p className="mt-5 text-[0.92rem] text-muted-foreground">
          軟體世界裡，這些地圖就是分散在世界各地的通訊錄 <Badge>DNS</Badge>。網址要對到機器的位置，靠的就是它們。你改了設定，各地的通訊錄是陸續更新的，不是同時。
        </p>
        <p className="mt-3 text-[0.78rem] text-faint">同一個網址，有人打得開、有人打不開，通常就是這個原因。</p>
      </section>

      {/* ============ 你會在哪裡遇到它 ============ */}
      <section id="where" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Signpost className="size-7 text-primary" strokeWidth={1.6} /></span>你會在哪裡遇到它</SectionHead>
        <Decide q={["場景", "剛改完網域設定的那幾個小時"]} a={["提醒", "那幾個小時最容易誤判"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">下面三個時刻，你會親眼看到通訊錄還沒更新完的樣子。每一個都講清楚，後台和畫面上會出現什麼。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {SCENES.map((s) => (
            <Card key={s.name} className="p-5">
              <div className="flex items-center gap-2.5">
                <s.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{s.name}</b>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Badge>{s.chip}</Badge>
              </div>
              <p className="mt-2.5 text-[0.88rem] text-muted-foreground">{s.d}</p>
              <p className="mt-1.5 text-[0.88rem] text-muted-foreground"><b className="text-foreground">畫面上：</b>{s.see}</p>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">三個時刻的共同症狀都一樣：你看到的和別人看到的不一樣。這不是壞了，是各地通訊錄還沒更新完。</p>
      </section>

      {/* ============ 四步綁好，然後等 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ClipboardList className="size-7 text-primary" strokeWidth={1.6} /></span>四步綁好，然後等</SectionHead>
        <Decide q={["原則", "你做四步，最後一步平台自動做"]} a={["通則", "改紀錄快，換名稱伺服器最慢"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">綁網域的標準步驟只有四步，最後的憑證是平台自動發的。先看流程，再看每一種改動要等多久。</p>

        <div className="mt-6 flex flex-wrap items-center gap-2.5" aria-label="綁網域的流程">
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
              <b className="w-[6.2em] shrink-0 text-[0.9rem]">{s.n}</b>
              <span className="text-sm text-muted-foreground">
                {s.say}
                {s.auto && <Badge variant="draft" className="ml-2 align-middle">平台自動</Badge>}
              </span>
            </div>
          ))}
        </Card>

        <p className="mt-8 text-[0.92rem] text-muted-foreground">改什麼要等多久，一張表看完。等得心慌的時候，回來對這張表就好。</p>

        <Card className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">改什麼</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">要等多久</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">為什麼</th>
                </tr>
              </thead>
              <tbody>
                {WAITS.map((w, i) => (
                  <tr key={w.what}>
                    <td className={cn("px-4 py-3 align-top font-semibold", i < WAITS.length - 1 && "border-b border-border")}>
                      {w.what}
                      {w.chip && <span className="mt-1.5 block"><Badge>{w.chip}</Badge></span>}
                    </td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < WAITS.length - 1 && "border-b border-border")}>{w.wait}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < WAITS.length - 1 && "border-b border-border")}>{w.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="mt-8 text-[0.92rem] text-muted-foreground">等的時候想確認有沒有生效，有兩個方法。兩個都不用改任何設定。</p>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <Smartphone className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">手機切到行動網路</b>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">用手機切到行動網路，打開你的網址看看。這等於換一本通訊錄來查，最快知道是不是只有你這邊還沒更新。</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <Search className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">請 AI 幫你查各地</b>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">請 AI 幫你查目前各地解析到哪裡，也就是各地通訊錄把你的網址對到哪台機器。一列出來，就知道更新到哪了。</p>
          </Card>
        </div>
      </section>

      {/* ============ 常見錯誤 ============ */}
      <section id="mistakes" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><TriangleAlert className="size-7 text-primary" strokeWidth={1.6} /></span>常見錯誤</SectionHead>
        <Decide q={["現實", "出事的不是設定，是等不及"]} a={["補救", "改完一次，就放著等"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">下面三個錯誤，每天都有人踩。每一個都把後果和正確做法講清楚。</p>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="impatient">
            <AccordionTrigger>等不及，十分鐘內反覆改設定</AccordionTrigger>
            <AccordionContent>
              <p>貼完紀錄十分鐘還連不上，很多人會刪掉重貼，或是換一組再試一次。每改一次，各地通訊錄就要重新來過。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>生效時間被重算，本來快好了，又要從頭再等一輪。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>改完一次就停手。用手機切到行動網路看看，或請 AI 幫你查目前各地解析到哪裡。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="www">
            <AccordionTrigger>只設了帶 www 的網址，沒設不帶 www 的</AccordionTrigger>
            <AccordionContent>
              <p>帶 www 和不帶 www，是兩個要分開設定的網址。只設了其中一個，另一個就沒有對到任何位置。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>客人打哪一種網址，全看習慣。少設的那一種，就有一群客人找不到你。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>兩個都要設。在部署平台和網域後台，把兩種網址都設好，再開始等。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="insecure">
            <AccordionTrigger>看到「不安全」警告，就以為設壞了</AccordionTrigger>
            <AccordionContent>
              <p>紀錄剛生效的時候，平台的 HTTPS 憑證可能還沒發完。這時候打開網址，瀏覽器會先給你一個「不安全」的警告。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>把好好的設定拆掉重來，前面等的時間全部白等，還可能把生效時間重算。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>什麼都不要動，再等一下。憑證發完，網址列出現鎖頭，就是真的完成了。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼做"]} a={["提示", "答案全在上面那張表裡"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">等待的時候最容易手癢。三題先演練過，真的遇到才穩得住。</p>

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
                      <b className={chosen.ok ? "text-ok" : "text-warn"}>{chosen.ok ? "答對了" : "再想一下"}</b>
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
          設定沒有壞，只是各家地圖還在陸續更新。改完一次，就放著等。
        </p>
      </section>

      <Pager prev={["/guides/domains", "網址是誰給的"]} next={["/guides/traffic", "網站塞車的時候"]} />
    </main>
  )
}
