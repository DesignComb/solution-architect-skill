import { useState } from "react"
import { Link } from "react-router-dom"
import { Bot, CircleCheck, CircleX, CreditCard, Fish, KeyRound, MessageCircleQuestionMark, Scale, ShieldAlert, ShieldCheck, Siren } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

const THREATS: { icon: typeof Bot; t: string; en?: string; d: string }[] = [
  { icon: Bot, t: "掃描機器人", en: "bot", d: "網站一上線，幾分鐘內就會有機器人來敲門。它不挑對象，只找哪一扇門沒鎖好。" },
  { icon: Fish, t: "釣魚詐騙", en: "phishing", d: "它騙的是人，不是機器。一封做得很像的假通知，就想騙你親手交出密碼。" },
  { icon: KeyRound, t: "金鑰外洩", en: "API key", d: "金鑰是服務發給你的通行鑰匙。把它寫進公開的程式碼，等於把鑰匙插在門上。" },
  { icon: CreditCard, t: "帳單攻擊", d: "有人故意灌爆你網站的用量。網站沒有壞，但月底的帳單會嚇你一跳。塞車時該看哪裡，見〈網站塞車的時候〉。" },
]

const RULES = [
  { t: "金鑰不進程式碼，外洩就立刻作廢重發", d: "只刪掉外流的紀錄沒有用，別人早就複製走了，換一把新鑰匙才安全。金鑰其實分兩種，見小教室的〈兩把鑰匙〉。" },
  { t: "重要帳號開兩步驟驗證，密碼交給密碼管理器記", d: "密碼遲早會被騙走或猜到，多一道手機確認，帳號就偷不走。" },
  { t: "備份要親手還原成功過一次，才算真的有備份", d: "真出事的那天，你需要的不是備份檔，是還原一定會成功的把握。" },
  { t: "權限給到最小夠用就好", d: "拿不到的東西就交不出去，就算哪天被騙，損失也會小很多。" },
  { t: "更新不要拖", d: "更新通知等於公告了舊版的漏洞，拖得越久，門就開得越大。" },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "假冒官方信",
    q: "一封信說你的帳號有異常，要你點連結重新登入，寄件人看起來就是官方。",
    options: [
      { label: "照信裡的連結登入", ok: false, why: "連結會帶你到長得一模一樣的假網站，你輸入的密碼會直接送進騙子手裡。" },
      { label: "自己打開官網登入查", ok: true, why: "帳號真的有異常，自己登入官網一定看得到。永遠自己打開官網，是最穩的習慣。" },
    ],
  },
  {
    tag: "AI 要金鑰",
    q: "你在跟 AI 對話，它說：把你的金鑰貼上來，我幫你檢查設定。",
    options: [
      { label: "貼上去，比較快", ok: false, why: "對話紀錄可能被保存或外流。金鑰只要貼出去過一次，就要當作已經外洩。" },
      { label: "不貼，請它直接讀我電腦裡的設定", ok: true, why: "金鑰留在你自己的電腦裡，AI 一樣做得完工作，這才是正確的分工。" },
    ],
  },
  {
    tag: "朋友的縮網址",
    q: "朋友半夜傳來一個縮網址，只寫了一句：這是你嗎？快點開看。",
    options: [
      { label: "點開看看是什麼", ok: false, why: "被盜的帳號傳來的訊息，看起來跟本人一模一樣，點開常常就是假登入頁。" },
      { label: "先打電話問朋友本人", ok: true, why: "換一個管道問一句，就能拆穿被盜的帳號。詐騙最怕的就是你去查證。" },
    ],
  },
]

export default function GuideSecurity() {
  const [done, setDone] = useState<Set<number>>(new Set())
  const all = done.size === RULES.length
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function toggle(i: number, v: boolean) {
    setDone((prev) => {
      const next = new Set(prev)
      if (v) next.add(i); else next.delete(i)
      return next
    })
  }

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 資安基本功
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">資安基本功</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">你的對手不是電影裡的天才駭客，是不挑對象的自動掃描機器人。</p>
      </header>

      {/* ============ 在防什麼 ============ */}
      <section id="threats" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ShieldAlert className="size-7 text-primary" strokeWidth={1.6} /></span>在防什麼</SectionHead>
        <Decide q={["現實", "絕大多數攻擊不挑人，只挑沒鎖的門"]} a={["好消息", "基本功做好，就能擋掉絕大多數"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">先認清對手長什麼樣子，力氣才會花在對的地方。下面四種，就是小網站每天真正面對的威脅。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {THREATS.map((th) => (
            <Card key={th.t} className="p-5">
              <div className="flex items-center gap-2.5">
                <th.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{th.t}</b>
                {th.en && <span className="ml-auto rounded-full border border-input bg-secondary px-2 py-0.5 font-mono text-[0.62rem] text-faint">{th.en}</span>}
              </div>
              <p className="mt-2 text-[0.88rem] text-muted-foreground">{th.d}</p>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">卡片角落的灰色英文是行話原名，看不懂可以直接跳過。</p>
      </section>

      {/* ============ 五條保命規則 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ShieldCheck className="size-7 text-primary" strokeWidth={1.6} /></span>五條保命規則</SectionHead>
        <Decide q={["規則", "五條全做到，才算有在鎖門"]} a={["省力法", "每一條都可以叫 AI 陪你做"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="flex items-center gap-3 border-b-2 border-input bg-secondary/60 px-5 py-3.5">
            <div className="flex flex-1 gap-1">
              {RULES.map((_, i) => (
                <i key={i} className={cn("h-[5px] flex-1 rounded-full bg-secondary", done.has(i) && "bg-ok")} />
              ))}
            </div>
            <span className="font-mono text-[0.78rem] text-muted-foreground">{done.size}/{RULES.length}</span>
          </div>
          <div>
            {RULES.map((r, i) => (
              <label key={i} className={cn("flex cursor-pointer items-start gap-3.5 border-b border-border px-5 py-3.5 last:border-b-0 hover:bg-secondary/40", done.has(i) && "opacity-70")}>
                <Checkbox className="mt-1" checked={done.has(i)} onCheckedChange={(v) => toggle(i, v === true)} />
                <span>
                  <b className={cn("block text-[0.95rem]", done.has(i) && "line-through decoration-ok/60")}>{i + 1}. {r.t}</b>
                  <span className="text-[0.78rem] text-muted-foreground">{r.d}</span>
                </span>
              </label>
            ))}
          </div>
          <div className={cn(
            "border-t-2 px-5 py-4 text-center font-serif text-[1.15rem] font-extrabold tracking-widest transition-colors",
            all ? "border-ok bg-ok/10 text-ok" : "border-input bg-secondary/60 text-faint"
          )}>
            {all ? "五條全中 ✓ 基本功及格" : "門還沒鎖完"}
          </div>
        </Card>
      </section>

      {/* ============ 小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼做"]} a={["提示", "答案全部藏在上面五條裡"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">詐騙考的不是技術，是你當下的反應。先在這裡演練過，真的遇到就不會慌。</p>

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

      {/* ============ 出事了怎麼辦 ============ */}
      <section id="incident" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Siren className="size-7 text-primary" strokeWidth={1.6} /></span>出事了怎麼辦</SectionHead>
        <Decide q={["原則", "先止血，再查原因"]} a={["心態", "出事不丟臉，瞞著才會變大事"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">出事的當下，最怕的是慌張亂按。照著順序做，就能把損失鎖在最小。</p>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="leak">
            <AccordionTrigger>金鑰外洩了：先作廢，再對帳</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal space-y-1.5 pl-5">
                <li>立刻把外洩的金鑰作廢，重新發一把新的。只刪掉外流的紀錄沒有用。</li>
                <li>打開帳單和用量頁面，確認有沒有人拿它偷偷跑用量。</li>
                <li>翻一遍存取紀錄，把不是你本人做的操作找出來。</li>
                <li>新金鑰放進平台的金鑰保險櫃，不要再放回程式碼裡。</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="fraud">
            <AccordionTrigger>被盜刷，或出現看不懂的扣款</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal space-y-1.5 pl-5">
                <li>先到服務後台停用付款方式，或把消費上限調到最低。</li>
                <li>打電話給發卡銀行說明狀況，申請爭議款項。</li>
                <li>回頭查是哪個帳號或金鑰流了出去，照上一條的步驟處理。</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="pdpa">
            <AccordionTrigger>使用者的資料外洩了（請洽法律專業）</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5">
                <li><b>個資法規定外洩要通知當事人</b>（第 12 條），新制朝知悉後 72 小時內通報的方向施行。</li>
                <li>該通知就通知，想瞞下來的代價一定更高。</li>
                <li>隱私權政策與相關法律規定的完整清單，在<Link to="/guides/launch" className="text-primary"><b>上線與維護</b></Link>那一頁。以上不是法律意見。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 收尾與來源 ============ */}
      <section className="pt-14">
        <p className="mx-auto max-w-[30ch] text-center font-serif text-[1.35rem] font-extrabold leading-relaxed tracking-wide">
          資安不是做一次就結束的工程，是像鎖門一樣每天順手的習慣。
        </p>

        <div className="mt-10 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <Scale className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          觀念綜合 OWASP 金鑰管理、Google 與 Stripe 的上線安全清單、台灣個資法條文（2026-08-24 實查）。
        </div>
      </section>

      <Pager prev={["/guides/ai", "跟 AI 一起做"]} next={["/guides/keys", "兩把鑰匙"]} />
    </main>
  )
}
