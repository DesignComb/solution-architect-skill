import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Users, FileText, MessageSquare, ClipboardCheck, RefreshCw, ShieldAlert,
  KeyRound, Terminal, Eye, Repeat,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager, FlowArrow, FlowNode } from "@/components/site"
import { cn } from "@/lib/utils"

/* 分工表：左＝你親手做的三種事，右＝AI 代勞的事 */
const SPLIT: { you: [string, string]; ai: [string, string] }[] = [
  {
    you: ["辦帳號", "各種服務的帳號要用你的身分申請，這件事只有你本人能做。"],
    ai: ["建表格、設權限", "資料要放在哪裡、誰能看到，AI 會用工具直接設定好。"],
  },
  {
    you: ["產一次金鑰", "金鑰像服務發給你的鑰匙，在後台產生一次，親手放進 AI 幫你開好的秘密抽屜。"],
    ai: ["寫程式、串接服務", "畫面、功能、跟其他服務的往來，全部由 AI 動手寫。"],
  },
  {
    you: ["跳出視窗按同意", "AI 動手時系統會跳出視窗問你，看清楚內容再按同意。"],
    ai: ["部署上線", "把成品放上網路、綁好網址，AI 一句指令就能完成。"],
  },
]

/* 開工起手式（複製給 AI 的第一段話） */
const STARTER = [
  "這是我的需求單，請整份讀完照著做。",
  "先做最小可用的版本，需求單以外的先不做。",
  "一次只做一件事：做完先停，讓我驗收，通過了再做下一件。",
  "每件事動手之前，先用白話說你要做什麼，我說好你再開始。",
  "不確定的地方先問我，不要自己猜。",
].join("\n")

/* 差的講法 → 好的講法 對照卡 */
type Pair = {
  scene: string
  bad: string
  badWhy: string
  good: { tag: string; text: string }[]
}

const PAIRS: Pair[] = [
  {
    scene: "訂便當表單",
    bad: "幫我做一個訂便當的表單。",
    badWhy: "AI 不知道這是給誰用的，只能自己猜，猜錯了你就得整個重講。",
    good: [
      { tag: "背景", text: "我們辦公室每天要統計誰訂哪家便當，現在都用紙條傳來傳去。" },
      { tag: "要什麼", text: "幫我做一個表單，同事點連結就能選店家和品項，我要看到一張彙總名單。" },
      { tag: "先問", text: "動手之前，先用白話說你打算怎麼做，我確認了你再開始。" },
    ],
  },
  {
    scene: "收費名單",
    bad: "名單的欄位你看著辦。",
    badWhy: "「看著辦」是把決定丟回給 AI，它做出來的多半不是你要的。",
    good: [
      { tag: "要什麼", text: "名單每一列長這樣：王小明、A 棟、已繳、繳款日期。照這個例子開欄位，先放幾筆假資料進去給我看。" },
    ],
  },
  {
    scene: "交辦一件事",
    bad: "做好跟我說一聲。",
    badWhy: "沒說怎樣算做好，AI 就會用它自己的標準宣布做完了。",
    good: [
      { tag: "驗收", text: "做完之後，我會用手機親手填一次表單當作驗收。" },
      { tag: "驗收", text: "要能送出、名單要多一列、亂填的內容要被擋下來，都成立才算做完。" },
    ],
  },
  {
    scene: "出狀況了",
    bad: "怪怪的，你修一下。",
    badWhy: "「怪怪的」沒有任何線索，AI 只能亂槍打鳥，常常越修越糟。",
    good: [
      { tag: "背景", text: "我在手機上按了送出，畫面沒有反應，名單也沒有多出那一筆。" },
      { tag: "先問", text: "先用白話告訴我可能的原因，等我確認方向，你再動手改。" },
    ],
  },
]

/* 驗收五關 */
const CHECKS = [
  { t: "親手從頭走一遍", d: "用自己的手機，像第一次用的人那樣，把功能從頭走到尾。" },
  { t: "故意亂輸入", d: "空白、亂碼、超長文字都塞塞看，畫面要給出看得懂的錯誤訊息。" },
  { t: "叫 AI 用白話解釋", d: "請它說清楚剛剛改了哪裡、為什麼要這樣做，講不清楚就是警訊。" },
  { t: "叫 AI 寫測試自己抓自己", d: "請它寫一組自動測試，讓程式自己檢查自己，你只要看結果。" },
  { t: "覺得可疑就追問", d: "直接問「你確定嗎？依據是什麼」，答案一直改就要提高警覺。" },
]

/* 卡住三步 */
const STUCK: { t: string; d: string }[] = [
  { t: "換個講法", d: "同一件事換一種說法，補上剛剛忘了給的背景，常常一次就通。" },
  { t: "把問題縮小一半", d: "先不管整個功能，挑最小的一塊叫它單獨做對，成功了再加回來。" },
  { t: "整段重來", d: "開一個全新的對話，把需求單和目前狀況重貼一次，讓它忘掉死胡同。為什麼有效，見小教室的〈AI 為什麼會忘記〉。" },
]

export default function GuideAiCollab() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set())
  const [done, setDone] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)
  const allDone = done.size === CHECKS.length

  function flip(i: number) {
    setFlipped((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
  }

  function toggle(i: number, v: boolean) {
    setDone((prev) => {
      const next = new Set(prev)
      if (v) next.add(i); else next.delete(i)
      return next
    })
  }

  async function copy() {
    try { await navigator.clipboard.writeText(STARTER) } catch {
      const ta = document.createElement("textarea")
      ta.value = STARTER; document.body.appendChild(ta); ta.select()
      try { document.execCommand("copy") } catch {}
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 跟 AI 一起做
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">跟 AI 一起做</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">你不用會寫程式，但要會交辦事情、會驗收。</p>
      </header>

      {/* ============ 分工表 ============ */}
      <section id="split" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Users className="size-7 text-primary" strokeWidth={1.6} /></span>誰做什麼</SectionHead>
        <Decide q={["你做", "辦帳號 ・ 產金鑰 ・ 按同意"]} a={["其餘", "AI 動手做"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="w-1/2 border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">你親手做的只有三種</th>
                  <th className="w-1/2 border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">其餘全部讓 AI 動手</th>
                </tr>
              </thead>
              <tbody>
                {SPLIT.map((r, i) => {
                  const last = i === SPLIT.length - 1
                  return (
                    <tr key={i}>
                      <td className={cn("border-border px-4 py-3 align-top", !last && "border-b")}>
                        <b className="block text-[0.95rem]">
                          {r.you[0]}
                          {i === 1 && <Badge className="ml-1.5 align-middle">API key・可跳過</Badge>}
                        </b>
                        <span className="text-[0.8rem] text-muted-foreground">{r.you[1]}</span>
                      </td>
                      <td className={cn("border-border px-4 py-3 align-top", !last && "border-b")}>
                        <b className="block text-[0.95rem]">{r.ai[0]}</b>
                        <span className="text-[0.8rem] text-muted-foreground">{r.ai[1]}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">小標籤裡的英文是技術原名，記不住也沒關係。AI 靠哪些工具做到右邊那些事，都收在<Link to="/guides/toolbox" className="text-draft">工具與 skill 索引</Link>。</p>

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          <AccordionItem value="agree">
            <AccordionTrigger>按同意之前，要看什麼？</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>視窗上會寫它想做哪件事、動到哪個服務，先花幾秒看完再按。</li>
                <li>看到「刪除」這類字眼，先停下來問 AI 為什麼需要，聽懂再按。</li>
                <li>跟你交辦的事情對不上的請求，直接按拒絕，不會有事。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 怎麼開工 ============ */}
      <section id="start" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><FileText className="size-7 text-primary" strokeWidth={1.6} /></span>怎麼開工</SectionHead>
        <Decide q={["起手式", "拿著需求單交辦"]} a={["節奏", "一次一件，驗收再下一件"]} />

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <FlowNode>一頁需求單</FlowNode>
          <FlowArrow />
          <FlowNode>交辦一件</FlowNode>
          <FlowArrow />
          <FlowNode>親手驗收</FlowNode>
          <FlowArrow />
          <FlowNode>再下一件</FlowNode>
        </div>
        <p className="mt-4 text-[0.9rem] text-muted-foreground">還沒有需求單的話，先到<Link to="/plan" className="text-primary"><b>開始規劃</b></Link>回答幾題，產一份再回來。</p>

        <Card className="mt-5 overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b-2 border-input bg-secondary/60 px-5 py-3">
            <b className="text-[0.9rem]">開工起手式</b>
            <span className="text-[0.78rem] text-muted-foreground">連同需求單一起貼給 AI 的第一段話</span>
            <Button size="sm" className="ml-auto" onClick={copy}>{copied ? "已複製 ✓" : "複製這段"}</Button>
          </div>
          <pre className="whitespace-pre-wrap px-5 py-4 font-sans text-[0.9rem] leading-relaxed">{STARTER}</pre>
        </Card>

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          <AccordionItem value="one">
            <AccordionTrigger>為什麼一次只交辦一件事？</AccordionTrigger>
            <AccordionContent>
              一次交辦太多事，AI 容易顧此失彼，你也看不出錯在哪一步。一件一件來，每做完一件就驗收一次，出錯馬上能找到源頭。這也是你唯一需要的專案管理：小步走，步步都收得住。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 怎麼下指令 ============ */}
      <section id="ask" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageSquare className="size-7 text-primary" strokeWidth={1.6} /></span>怎麼下指令</SectionHead>
        <Decide q={["心法", "把 AI 當新來的員工交辦"]} a={["四個料", "背景 ・ 要什麼 ・ 驗收 ・ 先問"]} />

        <p className="mt-5 text-[0.9rem] text-muted-foreground">同一件事，講法不同，結果天差地遠。每張卡先看差的講法，點一下翻到好的講法。</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {PAIRS.map((p, i) => {
            const on = flipped.has(i)
            return (
              <button
                key={p.scene}
                type="button"
                onClick={() => flip(i)}
                aria-pressed={on}
                className={cn(
                  "rounded-xl border-[1.5px] border-input bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer",
                  on ? "border-ok/45 hover:border-ok" : "hover:border-primary"
                )}
              >
                <span className="flex items-center gap-2 border-b border-dashed border-input px-4 py-2.5">
                  <Badge variant="draft">{p.scene}</Badge>
                  <Badge variant={on ? "ok" : "warn"}>{on ? "好的講法" : "差的講法"}</Badge>
                  <span className="ml-auto inline-flex items-center gap-1 font-mono text-[0.68rem] text-faint">
                    <Repeat className="size-3.5" strokeWidth={1.8} />翻面
                  </span>
                </span>
                {on ? (
                  <span className="block space-y-2 px-4 py-3.5">
                    {p.good.map((g, j) => (
                      <span key={j} className="flex items-start gap-2">
                        <Badge variant="ok" className="mt-0.5 shrink-0">{g.tag}</Badge>
                        <span className="text-[0.88rem]">{g.text}</span>
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="block px-4 py-3.5">
                    <span className="block rounded-lg border border-dashed border-warn/45 bg-warn/8 px-3.5 py-2.5 text-[0.95rem] font-semibold">「{p.bad}」</span>
                    <span className="mt-2.5 block text-[0.82rem] text-muted-foreground">{p.badWhy}</span>
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* ============ 怎麼驗收 ============ */}
      <section id="verify" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ClipboardCheck className="size-7 text-primary" strokeWidth={1.6} /></span>怎麼驗收看不懂的東西</SectionHead>
        <Decide q={["原則", "AI 說做完了不算數"]} a={["方法", "不用看程式碼也能驗"]} />

        <Card className="mt-6 overflow-hidden">
          <div>
            {CHECKS.map((c, i) => (
              <label key={i} className={cn("flex cursor-pointer items-start gap-3.5 border-b border-border px-5 py-3.5 last:border-b-0 hover:bg-secondary/40", done.has(i) && "opacity-70")}>
                <Checkbox className="mt-1" checked={done.has(i)} onCheckedChange={(v) => toggle(i, v === true)} />
                <span>
                  <b className={cn("block text-[0.95rem]", done.has(i) && "line-through decoration-ok/60")}>{c.t}</b>
                  <span className="text-[0.78rem] text-muted-foreground">{c.d}</span>
                </span>
              </label>
            ))}
          </div>
          <div className={cn(
            "border-t-2 px-5 py-3.5 text-center font-serif text-[1.05rem] font-extrabold tracking-widest transition-colors",
            allDone ? "border-ok bg-ok/10 text-ok" : "border-input bg-secondary/60 text-faint"
          )}>
            {allDone ? "驗收完成 ✓ 可以說做好了" : "還沒驗完，先別說做好了"}
          </div>
        </Card>

        <div className="mt-4 rounded-r-lg border-l-[3px] border-warn bg-warn/8 px-4 py-2.5 text-[0.86rem]">
          AI 會一本正經地講錯話。它的語氣越肯定，你越要親手驗一次——語氣肯定不等於正確。
        </div>

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          <AccordionItem value="why-wrong">
            <AccordionTrigger>為什麼 AI 會一本正經講錯話？</AccordionTrigger>
            <AccordionContent>
              AI 是照「最像正確答案的樣子」在說話，不是照它查證過的事實。所以錯的內容，它也能講得非常流暢。這不是它想騙你，是它的天性。上面那份驗收清單，就是為了這件事存在的。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="lines">
            <AccordionTrigger>可以直接照抄的追問句</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>「用白話解釋你剛剛做了什麼、為什麼這樣做。」</li>
                <li>「幫這個功能寫一組測試，跑一遍，把結果給我看。」</li>
                <li>「你確定嗎？依據是什麼？」</li>
                <li>「這個改動有沒有動到錢或個資？有的話先停下來。」</li>
              </ul>
              <p className="mt-2.5">上線前更完整的驗收清單，收在<Link to="/guides/launch" className="text-primary"><b>上線與維護</b></Link>。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 卡住三步 ============ */}
      <section id="stuck" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><RefreshCw className="size-7 text-primary" strokeWidth={1.6} /></span>卡住了怎麼辦</SectionHead>
        <Decide q={["前提", "卡住是常態，不是意外"]} a={["三步", "換講法 → 縮一半 → 重開"]} />

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <FlowNode ask>卡住了</FlowNode>
          <FlowArrow />
          <FlowNode>換個講法</FlowNode>
          <FlowArrow />
          <FlowNode>縮小一半</FlowNode>
          <FlowArrow />
          <FlowNode>重開對話</FlowNode>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {STUCK.map((s, i) => (
            <Card key={i} className="p-5">
              <span className="font-serif text-[1.3rem] font-extrabold text-draft">{i + 1}</span>
              <b className="mt-1 block text-[0.95rem]">{s.t}</b>
              <p className="mt-1.5 text-[0.82rem] text-muted-foreground">{s.d}</p>
            </Card>
          ))}
        </div>

        <div className="mt-4 rounded-r-lg border-l-[3px] border-draft bg-draft/10 px-4 py-2.5 text-[0.86rem]">
          卡了很久還在原地打轉，是該換方法的訊號，不是你的錯。多數時候換一條路，事情就通了。
        </div>
      </section>

      {/* ============ 紅線三條 ============ */}
      <section id="redlines" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ShieldAlert className="size-7 text-primary" strokeWidth={1.6} /></span>紅線三條</SectionHead>
        <Decide q={["規則", "這三條沒有例外"]} a={["原因", "錯一次就可能很痛"]} />

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Card className="border-warn/45 p-5">
            <KeyRound className="size-6 text-warn" strokeWidth={1.6} />
            <b className="mt-2.5 block text-[0.95rem]">金鑰不貼進對話</b>
            <p className="mt-1.5 text-[0.82rem] text-muted-foreground">金鑰等於能動用你帳號和錢的鑰匙。請 AI 開好秘密抽屜（環境變數檔），你自己把金鑰填進去。聊天紀錄裡貼過的東西，收不回來。哪種金鑰能見光、哪種不能，見<Link to="/guides/keys">兩把鑰匙</Link>。</p>
          </Card>
          <Card className="border-warn/45 p-5">
            <Terminal className="size-6 text-warn" strokeWidth={1.6} />
            <b className="mt-2.5 block text-[0.95rem]">看不懂的指令先問再跑</b>
            <p className="mt-1.5 text-[0.82rem] text-muted-foreground">終端機（輸入文字指令的黑色視窗）權力很大。先問 AI 這行會做什麼、會不會刪東西，聽懂了再跑，不懂就不要跑。</p>
          </Card>
          <Card className="border-warn/45 p-5">
            <Eye className="size-6 text-warn" strokeWidth={1.6} />
            <b className="mt-2.5 block text-[0.95rem]">動到錢或個資要人眼確認</b>
            <p className="mt-1.5 text-[0.82rem] text-muted-foreground">收費、退款、會員資料這類改動，AI 做完不算數。上線之前，一定要你親眼看過、親手測過一次。</p>
          </Card>
        </div>
        <p className="mt-4 text-[0.84rem] text-muted-foreground">這一套講法都整理成能直接複製的範本了，開工、驗收、除錯各有一條：<Link to="/guides/prompts"><b>指令範本 →</b></Link></p>
      </section>

      <Pager prev={["/guides/how-it-works", "軟體怎麼運作"]} next={["/guides/security", "資安基本功"]} />
    </main>
  )
}
