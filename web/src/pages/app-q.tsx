import { useState } from "react"
import { Link } from "react-router-dom"
import { QSteps, Decide, Pager } from "@/components/site"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

type Tier = "web" | "pwa" | "app"

const ITEMS: { tier: Tier; why: string; t: string; d: string }[] = [
  { tier: "pwa", why: "加到主畫面就有 APP 的感覺，本質還是網頁。", t: "主要在手機上用，要有 APP 的感覺", d: "打開是全螢幕，桌面上有自己的圖示" },
  { tier: "pwa", why: "網頁也能推播，只是 iPhone 要先加到主畫面。在台灣，先想想用 LINE 通知夠不夠。", t: "主動推播通知", d: "訂單來了，叫醒使用者" },
  { tier: "web", why: "拍照和掃碼這些事，網頁本來就做得到。", t: "拍照、掃 QR code", d: "拍一張照片，或掃一下條碼" },
  { tier: "web", why: "抓目前位置這件事，網頁本來就做得到。", t: "取得目前位置", d: "可以用來找離你最近的門市" },
  { tier: "pwa", why: "網頁可以把看過的內容先存在手機裡。", t: "離線能看", d: "沒有網路的時候，還是能繼續看" },
  { tier: "app", why: "網頁做不到——這是做 APP 的正當理由。", t: "螢幕關了也要記位置", d: "像是記錄跑步軌跡，或追蹤外送到哪了" },
  { tier: "app", why: "iPhone 的網頁連不了這些裝置，只能做 APP。", t: "連藍牙、嗶卡感應", d: "像是連手環，或拿手機嗶卡感應" },
  { tier: "app", why: "這些資料只有 APP 拿得到。", t: "桌面小工具、手錶、健康資料", d: "像是步數和心率這類資料" },
  { tier: "app", why: "要上架就做 APP——但後台和介紹頁留在網頁。", t: "一定要上架商店", d: "老闆指定要上架，或你的客群只逛商店" },
]

const WORDS: Record<Tier, string> = { web: "網頁", pwa: "網頁＋", app: "APP" }
const COLORS: Record<Tier, string> = { web: "text-ok", pwa: "text-draft", app: "text-primary" }
const SUBS: Record<Tier, string> = {
  web: "一個網址，全世界都能用。",
  pwa: "還是網頁，但能裝到手機上——有圖示、能推播、能離線。",
  app: "這些能力只有 APP 做得到。後台和介紹頁留在網頁。",
}

export default function AppQ() {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  function toggle(i: number, on: boolean) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (on) next.add(i)
      else next.delete(i)
      return next
    })
  }

  let tier: Tier = "web"
  const whys: string[] = []
  ITEMS.forEach((it, i) => {
    if (!checked.has(i)) return
    whys.push(it.why)
    if (it.tier === "app") tier = "app"
    else if (it.tier === "pwa" && tier !== "app") tier = "pwa"
  })
  if (whys.length === 0) whys.push("你還沒勾任何一項，多數產品停在這裡就夠了。")

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <header className="pb-1 pt-11">
        <QSteps current={2} />
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">
          要 APP 嗎？
        </h1>
        <Decide q={["選項", "網頁 ／ APP"]} a={["推薦", "網頁——用檢查表驗證 ↓"]} />
      </header>

      {/* 檢查表測驗 */}
      <div className="mt-8 grid grid-cols-[1.35fr_1fr] items-start gap-4 max-md:grid-cols-1">
        <div>
          <div className="mb-2.5 font-mono text-[0.68rem] tracking-wider text-muted-foreground">勾選你需要的能力</div>
          <div className="space-y-2">
            {ITEMS.map((it, i) => (
              <label
                key={i}
                htmlFor={`quiz-${i}`}
                className="flex cursor-pointer items-start gap-3 rounded-lg border-[1.5px] border-input bg-card px-4 py-3 shadow-sm transition-colors hover:border-draft"
              >
                <Checkbox
                  id={`quiz-${i}`}
                  className="mt-0.5"
                  checked={checked.has(i)}
                  onCheckedChange={(v) => toggle(i, v === true)}
                />
                <span>
                  <span className="block text-[0.92rem] font-semibold leading-snug">{it.t}</span>
                  <span className="mt-0.5 block text-[0.78rem] text-muted-foreground">{it.d}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 判定結果 */}
        <div className="sticky top-24 rounded-lg border-[1.5px] border-input bg-card p-5 shadow-md">
          <div className="font-mono text-[0.6rem] tracking-widest text-muted-foreground">判定</div>
          <div key={tier} className={`pop font-serif text-[2.6rem] font-extrabold leading-tight ${COLORS[tier]}`}>
            {WORDS[tier]}
          </div>
          <div className="mt-1 text-[0.86rem] text-muted-foreground">{SUBS[tier]}</div>
          <ul className="mt-3 list-disc space-y-1 border-t border-dashed border-input pl-5 pt-3 text-[0.82rem] leading-relaxed text-muted-foreground">
            {whys.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      </div>

      <Accordion type="multiple" className="mt-4 space-y-2.5">
        <AccordionItem value="diff">
          <AccordionTrigger>三種結果差在哪？</AccordionTrigger>
          <AccordionContent>
            <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">結果</th>
                      <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">白話說</th>
                      <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">多花的錢</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold"><Badge variant="ok">網頁</Badge></td>
                      <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">一個網址，點開就用</td>
                      <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">US$0</td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold"><Badge variant="draft">網頁＋</Badge></td>
                      <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">裝在手機上的網頁，有圖示、能推播、也能離線</td>
                      <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">多花幾天工，費用還是 US$0</td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap border-b-0 px-4 py-3 align-top font-semibold"><Badge variant="primary">APP</Badge></td>
                      <td className="border-b-0 px-4 py-3 align-top text-muted-foreground">要多養第二套程式，還要過商店審查</td>
                      <td className="border-b-0 px-4 py-3 align-top text-muted-foreground">Apple 每年 US$99，加上 Google 的 US$25</td>
                    </tr>
                  </tbody>
                </table>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="notes">
          <AccordionTrigger>決定做 APP 了？給幫你做的人三行筆記</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc space-y-1.5 pl-5">
              <li><b>先考慮跨平台</b>：已經有網頁就用 Capacitor 包殼；想要接近原生的體驗就用 Expo；團隊熟 Flutter 就直接用 Flutter。</li>
              <li><b>商店不收純包殼</b>：只把網站裝進 APP 會被蘋果退件（審查 4.2）。</li>
              <li><b>能留在網頁的都留在網頁</b>：後台、介紹頁不進 APP，改版不用等審查。</li>
            </ul>
            <p className="mt-2">上架要花的錢、時間和審查地雷，完整版在<Link to="/guides/app-store"><b>APP 上架指南 →</b></Link></p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Pager prev={["/build", "要寫程式嗎"]} next={["/stack", "用什麼做"]} />
    </main>
  )
}
