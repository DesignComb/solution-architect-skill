import { useState } from "react"
import { Link } from "react-router-dom"
import { Building2, Camera, CircleCheck, CircleX, ClipboardList, FileText, Globe, House, KeyRound, Laptop, MessageCircleQuestionMark, Rocket, Scale, ScanEye, Sofa, TriangleAlert, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

const SAMPLES: { icon: typeof Globe; name: string; chips: string[]; d1: string; d2: string }[] = [
  {
    icon: Laptop,
    name: "本機網址",
    chips: ["localhost", "本機環境 local"],
    d1: "網址長得像 localhost，只在你這台電腦上打得開。",
    d2: "它是在你電腦上跑的版本，別人的電腦看不到。",
  },
  {
    icon: Camera,
    name: "一張截圖",
    chips: ["screenshot"],
    d1: "截圖只證明某一個時刻，畫面長那個樣子。",
    d2: "它不等於上線，也不等於用真資料能動。",
  },
  {
    icon: Users,
    name: "假資料撐出來的畫面",
    chips: ["種子資料 seed data"],
    d1: "畫面上的王小明，是為了讓畫面不空白放進去的。",
    d2: "它證明畫面排得出來，不證明真資料進得來。",
  },
  {
    icon: FileText,
    name: "一段「已完成」的文字",
    chips: ["已完成 done"],
    d1: "AI 描述自己做完了，這只是它寫的一段文字。",
    d2: "你什麼都還沒看到，連樣品屋的燈都還沒開。",
  },
]

const RULES = [
  {
    q: "誰看得到",
    local: "只有你，網址通常長得像 localhost。",
    preview: "你先看用的，平台每推一版就給一個新的預覽網址。",
    prod: "有真正的網址，大家都看得到。",
  },
  {
    q: "資料是真是假",
    local: "幾乎都是假資料，用來把畫面撐起來。",
    preview: "跟正式的是分開的，改了不會動到客人的資料。",
    prod: "真的客人、真的訂單，改了就是真的改了。",
  },
  {
    q: "能不能當驗收",
    local: "不能。它證明畫面排得出來，不證明客人用得到。",
    preview: "不能。它是上線前先看一眼用的，不是上線。",
    prod: "能。驗收只在這一欄做，而且要親手操作一遍。",
  },
]

const PROOFS = [
  "正式網址打得開，功能真的能用。",
  "換一台手機，用行動網路打開也一樣。",
  "操作之後，資料真的出現在正式環境的倉庫（資料庫）裡。",
]

const GAPS: { icon: typeof Globe; name: string; chip?: string; d1: string; d2: string }[] = [
  {
    icon: Users,
    name: "資料是假的",
    chip: "種子資料 seed data",
    d1: "畫面上的王小明是種子資料，這是正常的開發手法。",
    d2: "上線前要確認，正式環境不會帶著假資料一起上去。",
  },
  {
    icon: Laptop,
    name: "東西只在你電腦上",
    chip: "本機環境 local",
    d1: "本機環境跑在你的電腦上，只有你看得到。",
    d2: "客人從來就打不開，它跑得再順都不算數。",
  },
  {
    icon: KeyRound,
    name: "金鑰還是測試用的",
    chip: "測試模式 test mode",
    d1: "綠界、Stripe 都有測試環境和測試卡號，測試模式刷的卡不會真的扣款。",
    d2: "上線前要換成正式金鑰，再用真卡小額測一筆。",
  },
  {
    icon: Rocket,
    name: "改的東西還沒推上去",
    chip: "施工紀錄 migration",
    d1: "兩邊要長得一模一樣，靠的是同一份程式和同一份施工紀錄。",
    d2: "只改其中一邊，就會出現樣品屋好好的、真店面壞掉。",
  },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "一張截圖",
    q: "AI 傳來一張截圖，說功能做好了。可以直接跟客人說上線了嗎？",
    options: [
      { label: "可以，截圖看起來已經做好了", ok: false, why: "截圖只證明某個時刻畫面長那樣。它不等於上線，也不等於用真資料能動。" },
      { label: "不行，先用正式網址自己操作一遍", ok: true, why: "真的做好了的證據，是正式網址打得開而且功能能用。截圖不算證據。" },
    ],
  },
  {
    tag: "驗收的地方",
    q: "功能要驗收了，你該在哪個網址做？",
    options: [
      { label: "本機網址，畫面最完整", ok: false, why: "本機只有你看得到，資料也是假的。畫面排得出來，不代表客人用得到。" },
      { label: "正式網址，再換一台手機用行動網路開一次", ok: true, why: "驗收只認真店面。換一台手機用行動網路打開也一樣，才排除掉只在你電腦上能動的可能。" },
    ],
  },
  {
    tag: "上線前的金流",
    q: "金流在測試模式全部跑通了。上線前還要做什麼？",
    options: [
      { label: "測試都過了，直接開放客人刷卡", ok: false, why: "測試模式刷的卡不會真的扣款。金鑰不換，客人刷了錢也不會進來。" },
      { label: "換成正式金鑰，再用真卡小額測一筆", ok: true, why: "測試用的金鑰要換成正式金鑰。真卡小額刷一筆，錢真的進來才算數。" },
    ],
  },
]

const TH = "whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground"

export default function GuideStaging() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 樣品屋與真店面
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">樣品屋與真店面</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">AI 給你看的樣本，不等於客人用得到的東西。</p>
      </header>

      {/* ============ 建商的樣品屋 ============ */}
      <section id="metaphor" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><House className="size-7 text-primary" strokeWidth={1.6} /></span>建商的樣品屋</SectionHead>
        <Decide q={["比喻", "建商的樣品屋和交屋的房子"]} a={["重點", "看得到，不等於住得進去"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">去看建案的時候，建商會先帶你走進樣品屋。燈光打得很美，沙發是道具，窗外的風景是一張貼紙。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <Sofa className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">樣品屋</b>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">它只開給來看屋的人，家具是擺好看的道具。它的用途是讓你想像，不是讓你搬進去住。</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <Building2 className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">交屋的真房子</b>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">它有真正的門牌，親友照地址就找得到。水電要真的能用，你簽收的是這一間。</p>
          </Card>
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">軟體世界一樣。你電腦上跑的版本是樣品屋，客人用的那個網址才是真店面。</p>
      </section>

      {/* ============ 你會在哪裡遇到它 ============ */}
      <section id="where" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ScanEye className="size-7 text-primary" strokeWidth={1.6} /></span>你會在哪裡遇到它</SectionHead>
        <Decide q={["場景", "AI 說「做好了，你看」"]} a={["提醒", "先問一句，這是哪一個環境"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">AI 說做好了的時候，通常會附一樣東西給你看。下面這幾種東西，每一種都是樣品屋。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {SAMPLES.map((s) => (
            <Card key={s.name} className="p-5">
              <div className="flex items-center gap-2.5">
                <s.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{s.name}</b>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {s.chips.map((c) => <Badge key={c}>{c}</Badge>)}
              </div>
              <p className="mt-2.5 text-[0.88rem] text-muted-foreground">{s.d1}</p>
              <p className="mt-1.5 text-[0.88rem] text-muted-foreground">{s.d2}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-2.5 p-5">
          <div className="flex items-center gap-2.5">
            <Globe className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
            <b className="text-[1.02rem]">部署平台的預覽網址</b>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Badge>Vercel</Badge>
            <Badge>Cloudflare</Badge>
            <Badge>預覽 preview</Badge>
          </div>
          <p className="mt-2.5 text-[0.88rem] text-muted-foreground">Vercel、Cloudflare 這類平台，每次推送新版都會產生一個預覽網址。它讓你先看再上線，資料跟正式的是分開的。</p>
          <p className="mt-1.5 text-[0.88rem] text-muted-foreground">它比本機多走了一步，但先看只是先看，不等於上線。</p>
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">灰色標籤是技術原名，記不住沒關係。重點是看到這些東西時，心裡先標上樣品屋三個字。</p>
      </section>

      {/* ============ 三個環境一張表 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ClipboardList className="size-7 text-primary" strokeWidth={1.6} /></span>三個環境一張表</SectionHead>
        <Decide q={["原則", "驗收只認真店面"]} a={["通則", "樣品屋的資料跟真店面分開"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">樣品屋有兩種，本機和預覽，真店面只有一個。AI 拿東西給你看時，先對一下它落在哪一欄。</p>

        <Card className="mt-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr>
                  <th className={TH}>對照</th>
                  <th className={TH}>本機 <span className="ml-1 text-faint">你的電腦</span></th>
                  <th className={TH}>預覽 <span className="ml-1 text-faint">測試環境</span></th>
                  <th className={TH}>真店面 <span className="ml-1 text-faint">正式環境</span></th>
                </tr>
              </thead>
              <tbody>
                {RULES.map((r, i) => (
                  <tr key={r.q}>
                    <td className={cn("whitespace-nowrap px-4 py-3 align-top font-semibold", i < RULES.length - 1 && "border-b border-border")}>{r.q}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < RULES.length - 1 && "border-b border-border")}>{r.local}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < RULES.length - 1 && "border-b border-border")}>{r.preview}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < RULES.length - 1 && "border-b border-border")}>{r.prod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="mt-2.5 p-5">
          <b className="text-[1.02rem]">真的做好了，證據只有三個</b>
          <p className="mt-1.5 text-[0.88rem] text-muted-foreground">三個都親手確認過，才可以跟客人說上線了。少一個，都還是樣品屋。</p>
          <ul className="mt-3 space-y-2">
            {PROOFS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[0.9rem]">
                <CircleCheck className="mt-1 size-4 shrink-0 text-ok" strokeWidth={2} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Card>

        <p className="mt-8 font-semibold">樣本和上線的東西，差別通常出在下面四件事。</p>
        <p className="mt-1 text-[0.92rem] text-muted-foreground">AI 說做好了的時候，這四件事一件一件問過去。</p>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {GAPS.map((g) => (
            <Card key={g.name} className="p-5">
              <div className="flex items-center gap-2.5">
                <g.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{g.name}</b>
                {g.chip && <span className="ml-auto rounded-full border border-input bg-secondary px-2 py-0.5 font-mono text-[0.62rem] text-faint">{g.chip}</span>}
              </div>
              <p className="mt-2.5 text-[0.88rem] text-muted-foreground">{g.d1}</p>
              <p className="mt-1.5 text-[0.88rem] text-muted-foreground">{g.d2}</p>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">施工紀錄是什麼、怎麼讓兩邊長得一樣，<Link to="/guides/migrations" className="text-draft">倉庫的施工紀錄</Link>那一課講過。這裡先記住：兩邊要一樣，靠的不是手動。</p>
      </section>

      {/* ============ 常見錯誤 ============ */}
      <section id="mistakes" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><TriangleAlert className="size-7 text-primary" strokeWidth={1.6} /></span>常見錯誤</SectionHead>
        <Decide q={["現實", "出事的不是技術，是以為做好了"]} a={["補救", "回到真店面，親手再做一次"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">下面四個錯誤，都是把樣品屋當成了真店面。每一個都把後果和正確做法講清楚。</p>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="screenshot">
            <AccordionTrigger>看到截圖，就跟客人說上線了</AccordionTrigger>
            <AccordionContent>
              <p>AI 傳來一張截圖，旁邊寫著已完成。你把截圖轉給客人，說可以用了。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>客人打開網址，不是打不開，就是功能按了沒反應。你的信用先賠掉一次。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>截圖只是樣品屋。自己用正式網址打開，把功能操作一遍，再說上線。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="seed-data">
            <AccordionTrigger>假資料跟著上線，客人看到「王小明」</AccordionTrigger>
            <AccordionContent>
              <p>開發時放的種子資料沒有清掉，跟著新版一起推上了正式環境。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>客人打開第一頁，看到一排王小明和測試用戶一。他會以為這是別人的資料外洩了。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>假資料是正常的開發手法，問題出在沒確認。上線前要確認正式環境不會帶著假資料一起上去。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="test-key">
            <AccordionTrigger>測試金鑰忘了換成正式的，客人刷卡沒扣款</AccordionTrigger>
            <AccordionContent>
              <p>綠界或 Stripe 的測試模式一路用到上線，金鑰還是測試用的那一把。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>金鑰還是測試用的，客人的卡不會真的被扣款，錢一毛都不會進來。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>上線前把測試用的金鑰換成正式金鑰。然後用真卡小額測一筆，看錢有沒有真的進來。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="works-on-my-machine">
            <AccordionTrigger>自己電腦上能動，就跟客人說好了</AccordionTrigger>
            <AccordionContent>
              <p>本機環境跑得很順，你就當成做完了。可是本機有的東西，真店面不一定有。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>手動只改了其中一邊，就會出現樣品屋好好的、真店面壞掉。客人看到的是壞掉的那一邊。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>換一台手機，用行動網路打開正式網址再試一次。操作完去正式環境的倉庫看，資料有沒有真的出現。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼做"]} a={["提示", "記住驗收只認真店面"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">AI 說做好了的那一刻，反應要先演練過才會有。三題都做完，這一課才算上完。</p>

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
                      <b className={chosen.ok ? "text-ok" : "text-warn"}>{chosen.ok ? "這樣做對了" : "等一下，這還是樣品屋"}</b>
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
          樣品屋再漂亮，客人走進的還是真店面。驗收只在真店面做，而且要親手做。
        </p>

        <div className="mt-10 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <Scale className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          預覽網址與測試模式的行為，出自 Vercel、Cloudflare、綠界與 Stripe 官方文件（2026-08-24 查證）。
        </div>
      </section>

      <Pager prev={["/guides/webhooks", "誰在敲門"]} next={["/guides/cache", "改了怎麼沒變"]} />
    </main>
  )
}
