import { useState } from "react"
import { Link } from "react-router-dom"
import { CircleCheck, CircleX, ClipboardList, Cloud, Layers, MessageCircleQuestionMark, MonitorSmartphone, ShoppingBasket, Smartphone, Store, TriangleAlert, Truck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager, FlowArrow, FlowNode } from "@/components/site"
import { cn } from "@/lib/utils"

const PLACES: { icon: typeof Cloud; name: string; chips: string[]; d1: string; d2: string }[] = [
  {
    icon: MonitorSmartphone,
    name: "你的瀏覽器",
    chips: ["快取 cache"],
    d1: "看過的圖片、樣式、程式，都留了一份在你的裝置上。",
    d2: "你改完馬上就打開來看，所以第一個要懷疑的就是這一層。",
  },
  {
    icon: Cloud,
    name: "中間的中繼站",
    chips: ["CDN", "例如 Cloudflare"],
    d1: "世界各地都存了一份影本，離你近的機器直接回應。",
    d2: "它還沒更新的時候，換了無痕視窗看到的也一樣是舊的。",
  },
  {
    icon: Smartphone,
    name: "手機上的 APP 殼",
    chips: ["有時候才會遇到"],
    d1: "有時候 APP 殼也會自己留一份影本。",
    d2: "前面兩層都處理過還是舊的，才需要懷疑到這一層。",
  },
]

const RULES = [
  {
    place: "你的瀏覽器",
    skip: "強制重新整理，可以跳過瀏覽器的影本。",
    keys: ["Windows：Ctrl＋F5", "Mac：Cmd＋Shift＋R"],
    who: "你自己。按一組快捷鍵就好，不用找任何人。",
  },
  {
    place: "中間的中繼站",
    skip: "跳不過。要等它更新，或是有人主動去清。",
    keys: [],
    who: "到平台後台清除，Cloudflare 有「清除快取」按鈕。不想自己找，就請 AI 幫你清。",
  },
  {
    place: "手機上的 APP 殼",
    skip: "先不用動它。前面兩層都處理過還是舊的，再懷疑到這一層。",
    keys: [],
    who: "請 AI 看這一層。",
  },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "無痕視窗看到新版",
    q: "你改完之後畫面還是舊的，開了無痕視窗，結果看到新版了。這代表什麼？",
    options: [
      { label: "改動根本沒上線，要叫 AI 再做一次", ok: false, why: "無痕視窗看得到新版，代表新版已經在線上了。是你瀏覽器的影本在作怪，不是沒改到。" },
      { label: "是我瀏覽器的影本在作怪，強制重新整理就好", ok: true, why: "無痕看到新版，問題就在你自己的瀏覽器。強制重新整理跳過影本，什麼都不用重做。" },
    ],
  },
  {
    tag: "客人說畫面是舊的",
    q: "客人傳訊息說畫面還是舊的，可是你自己看明明是新的。第一句該問什麼？",
    options: [
      { label: "馬上叫 AI 檢查是不是改壞了", ok: false, why: "你自己看得到新版，代表改動已經上線，不是改壞。先分清楚是不是客人那邊的影本，再決定要不要動程式。" },
      { label: "請他開無痕視窗再看一次，有沒有變新", ok: true, why: "你看是新的，客人看是舊的，問題在客人那邊的影本。可能在他的裝置上，也可能在離他近的中繼站。無痕看得到新版，就請他強制重新整理；還是舊的，再到中繼站後台清一次。" },
    ],
  },
  {
    tag: "該不該關掉快取",
    q: "你被舊畫面搞煩了，想叫 AI 把快取整個關掉，一勞永逸。",
    options: [
      { label: "關掉，以後就不會再看到舊的", ok: false, why: "快取是網站快、免費層撐得住流量的功臣。整個關掉，網站變慢、流量變多，換來的只是你少按一次強制重新整理。" },
      { label: "不關，該清的時候清那一次就好", ok: true, why: "瀏覽器的影本用強制重新整理跳過，中繼站的影本到後台清一次。快取留著，網站才會快。" },
    ],
  },
]

export default function GuideCache() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 改了怎麼沒變
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">改了怎麼沒變</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">不是沒改到，是你還在看影本。</p>
      </header>

      {/* ============ 便利商店的貨架 ============ */}
      <section id="metaphor" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Store className="size-7 text-primary" strokeWidth={1.6} /></span>便利商店的貨架</SectionHead>
        <Decide q={["比喻", "貨架上的貨，總倉裡的新貨"]} a={["重點", "架上的沒賣完，新貨就上不了架"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">想像你開了一間便利商店。總倉今天剛進了新包裝的飲料，可是店裡貨架上擺的，還是上禮拜的舊包裝。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <ShoppingBasket className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">貨架上的貨</b>
              <span className="ml-auto rounded-full border border-input bg-secondary px-2 py-0.5 font-mono text-[0.62rem] text-faint">影本</span>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">客人走進店裡，拿的一定是架上那一瓶。架上的賣完了、或是到期了，店員才會回總倉補新的。</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <Truck className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">總倉剛進的新貨</b>
              <span className="ml-auto rounded-full border border-input bg-secondary px-2 py-0.5 font-mono text-[0.62rem] text-faint">正式版</span>
            </div>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">你剛做好的新版，就是總倉裡的新貨。它真的在那裡，只是還沒上架，所以客人暫時拿不到。</p>
          </Card>
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">網站也有這樣的貨架，行話叫快取。看到舊畫面，先懷疑貨架，再懷疑總倉。</p>
      </section>

      {/* ============ 你會在哪裡遇到它 ============ */}
      <section id="where" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Layers className="size-7 text-primary" strokeWidth={1.6} /></span>你會在哪裡遇到它</SectionHead>
        <Decide q={["場景", "改完了，畫面還是舊的"]} a={["先做", "開一個無痕視窗看看"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">AI 說改好了，部署也跑完了，你打開網站，畫面卻跟改之前一模一樣。這就是你會遇到它的時刻。</p>
        <p className="mt-2 text-[0.92rem] text-muted-foreground">瀏覽器會把看過的網頁檔案存一份影本在你的裝置上，圖片、樣式、程式都存。下次再開，直接用影本，省時間也省流量。這份影本就叫快取。</p>
        <p className="mt-2 text-[0.92rem] text-muted-foreground">中間的中繼站也會在世界各地存影本，讓離你近的機器直接回應。所以你剛改好的東西，自己可能還在看舊影本。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {PLACES.map((p) => (
            <Card key={p.name} className="p-5">
              <div className="flex items-center gap-2.5">
                <p.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{p.name}</b>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {p.chips.map((c) => <Badge key={c}>{c}</Badge>)}
              </div>
              <p className="mt-2.5 text-[0.88rem] text-muted-foreground">{p.d1}</p>
              <p className="mt-1.5 text-[0.88rem] text-muted-foreground">{p.d2}</p>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-[0.92rem] text-muted-foreground">分辨是哪一層在作怪，只要一個動作：開無痕視窗。</p>

        <div className="mt-4 flex flex-wrap items-center gap-2.5" aria-label="無痕視窗判斷法">
          <FlowNode>畫面還是舊的</FlowNode>
          <FlowArrow />
          <FlowNode>開無痕視窗</FlowNode>
          <FlowArrow />
          <FlowNode ask>看到新版了嗎</FlowNode>
        </div>

        <Card className="mt-4 overflow-hidden">
          <div className="flex items-start gap-3.5 border-b border-border px-5 py-3.5">
            <b className="w-[4.8em] shrink-0 text-[0.9rem]">看到新版</b>
            <span className="text-sm text-muted-foreground">代表是你瀏覽器的影本在作怪。強制重新整理一次，跳過影本就好。</span>
          </div>
          <div className="flex items-start gap-3.5 px-5 py-3.5">
            <b className="w-[4.8em] shrink-0 text-[0.9rem]">還是舊的</b>
            <span className="text-sm text-muted-foreground">代表中繼站還沒更新，或是根本還沒上線。有沒有上線怎麼看，去<Link to="/guides/staging" className="text-draft">樣品屋與真店面</Link>那一課。</span>
          </div>
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">先開無痕視窗，再決定要按哪個鍵、要進哪個後台。順序反過來，常常是白忙一場。</p>
      </section>

      {/* ============ 三個地方，一張表 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ClipboardList className="size-7 text-primary" strokeWidth={1.6} /></span>三個地方，一張表</SectionHead>
        <Decide q={["原則", "先分清楚是哪一層的影本"]} a={["通則", "瀏覽器自己跳過，中繼站到後台清"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">三個存影本的地方，能不能跳過、該誰來清，各不一樣。拿不準的時候，回來對這張表就好。</p>

        <Card className="mt-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">存影本的地方</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">怎麼跳過它</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">誰負責清</th>
                </tr>
              </thead>
              <tbody>
                {RULES.map((r, i) => (
                  <tr key={r.place}>
                    <td className={cn("whitespace-nowrap px-4 py-3 align-top font-semibold", i < RULES.length - 1 && "border-b border-border")}>{r.place}</td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < RULES.length - 1 && "border-b border-border")}>
                      {r.skip}
                      {r.keys.length > 0 && (
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {r.keys.map((k) => <Badge key={k} variant="draft">{k}</Badge>)}
                        </span>
                      )}
                    </td>
                    <td className={cn("px-4 py-3 align-top text-muted-foreground", i < RULES.length - 1 && "border-b border-border")}>{r.who}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">現代的部署方式會替每個新版檔案換新檔名，所以多數時候正常重新整理就會更新。真的卡住的，通常是網頁本體或中繼站沒清。</p>
      </section>

      {/* ============ 常見錯誤 ============ */}
      <section id="mistakes" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><TriangleAlert className="size-7 text-primary" strokeWidth={1.6} /></span>常見錯誤</SectionHead>
        <Decide q={["現實", "看到舊畫面就慌，是最常見的起點"]} a={["底線", "先確認是影本，再動程式"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">下面三個錯誤，都是看到舊畫面之後太快動手造成的。</p>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="redo">
            <AccordionTrigger>以為沒上線，又叫 AI 把同一件事重做一次</AccordionTrigger>
            <AccordionContent>
              <p>畫面沒變，不代表沒改到。很多時候改動早就上線了，只是你的瀏覽器還在用舊影本。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>同一件事改了兩次，兩份改動疊在一起，程式反而更亂，之後要找問題更難。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>先開無痕視窗。看到新版，強制重新整理就好；還是舊的，再去確認有沒有真的上線。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="disable">
            <AccordionTrigger>叫 AI 把快取整個關掉，以為一勞永逸</AccordionTrigger>
            <AccordionContent>
              <p>快取不是壞事。它是網站快、免費層撐得住流量的功臣，不要為了怕看到舊的就把它整個關掉。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>網站變慢，流量變多，免費層可能就撐不住了。換來的只是你自己少按一次強制重新整理。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>要跳過瀏覽器的影本，按強制重新整理；要更新中繼站，到後台清一次。清那一次就好，不要整個關。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="customer">
            <AccordionTrigger>自己看是新的，客人說還是舊的</AccordionTrigger>
            <AccordionContent>
              <p>你看是新的，代表新版已經上線。客人看到舊的，不是你改壞了。是客人那邊的影本，可能在他的裝置上，也可能在離他近的中繼站。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>你以為修好了，客人那邊還在出錯。兩邊講的是不同版本，客服對話怎麼對都對不上。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>先請客人開無痕視窗看看。看得到新版，就請他強制重新整理；無痕也還是舊的，再去中繼站後台清一次。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼做"]} a={["提示", "答案全在上面那張表裡"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">看到舊畫面的那一刻，反應要夠快才不會白忙。三題都做完，這一課才算上完。</p>

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
                      <b className={chosen.ok ? "text-ok" : "text-warn"}>{chosen.ok ? "這樣做對了" : "等一下，先停下來"}</b>
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
          看到舊畫面，先懷疑影本，再懷疑改動。
        </p>
      </section>

      <Pager prev={["/guides/staging", "樣品屋與真店面"]} next={["/guides/domains", "網址是誰給的"]} />
    </main>
  )
}
