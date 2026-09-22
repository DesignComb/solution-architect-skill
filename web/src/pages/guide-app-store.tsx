import { useState } from "react"
import { Link } from "react-router-dom"
import { Smartphone, Layers, Coins, Flag, ListChecks, Globe, Scale } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

const CHECKLIST = [
  { t: "隱私權政策的公開網址", d: "兩家商店都要求附上一頁隱私權政策，而且要放在公開網址上" },
  { t: "審查用的測試帳號", d: "要登入才能用的功能，附一組帳號密碼讓審查員直接進去看" },
  { t: "各尺寸的畫面截圖", d: "不同大小的手機各要一組截圖，內容要跟實際畫面一樣" },
  { t: "年齡分級問卷", d: "商店會問內容適合幾歲的人看，照實回答就好" },
  { t: "客服聯絡管道", d: "使用者要找得到人問問題，商店頁記得留客服信箱" },
  { t: "封測名單（安卓）", d: "新的個人帳號要先跑封閉測試，先把願意幫忙的人找齊" },
]

export default function GuideAppStore() {
  const [done, setDone] = useState<Set<number>>(new Set())
  const all = done.size === CHECKLIST.length

  function toggle(i: number, v: boolean) {
    setDone((prev) => {
      const next = new Set(prev)
      if (v) next.add(i); else next.delete(i)
      return next
    })
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › APP 上架
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">APP 上架</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">確定要做 APP 之後，這一頁把要花的錢、要等的時間、會踩的雷一次攤開。</p>
      </header>

      <div className="mt-6 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.86rem] text-muted-foreground">
        <Smartphone className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
        還沒確定要不要做 APP？先去做<Link to="/app" className="text-primary"><b>「要 APP 嗎」的小測驗</b></Link>，很多需求其實網頁就夠了。這一頁寫給已經確定要做的人。
      </div>

      {/* ============ 跨平台怎麼選 ============ */}
      <section id="platform" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Layers className="size-7 text-primary" strokeWidth={1.6} /></span>跨平台怎麼選</SectionHead>
        <Decide q={["前提", "寫一套，蘋果和安卓都能上"]} a={["例外", "深度硬體整合才寫原生"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">你的情況</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">選這條路</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">一行理由</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-border px-4 py-3 align-top font-semibold">已經有網站，或想用網頁技術做</td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top">網站包殼 <Badge>Capacitor</Badge></td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">把現成的網站包進一層殼，再補上推播這類手機才有的能力。</td>
                </tr>
                <tr>
                  <td className="border-b border-border px-4 py-3 align-top font-semibold">想要接近原生 APP 的操作手感</td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top">原生感路線 <Badge>Expo</Badge></td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">用它做出來的畫面和手感，最接近手機原生的 APP。</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top font-semibold">畫面要高度客製、走自己的風格</td>
                  <td className="whitespace-nowrap px-4 py-3 align-top">自繪路線 <Badge>Flutter</Badge></td>
                  <td className="px-4 py-3 align-top text-muted-foreground">它把每一個畫面元素都自己畫，要做很客製的外觀最自由。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-3 text-[0.82rem] text-muted-foreground">
          蘋果和安卓各寫一套原生程式（Swift、Kotlin），等於同一個 APP 做兩次。只有要深度整合硬體、或把效能逼到極限時，才值得這樣選。
        </p>
      </section>

      {/* ============ 錢與時間攤開 ============ */}
      <section id="cost" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Coins className="size-7 text-primary" strokeWidth={1.6} /></span>錢與時間攤開</SectionHead>
        <Decide q={["現實", "上架要繳費，也要排隊"]} a={["心法", "把審查時間算進時程"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">項目</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">要花多少</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">說明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold">蘋果開發者帳號</td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold">US$99/年</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">這筆年費每年都要繳，停繳的話 APP 會直接從商店下架。</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold">Google Play 帳號</td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold">US$25 一次</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">只要繳一次就好。新的個人帳號要先辦封閉測試，找 12 位測試者測滿 14 天才能正式上架。</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold">商店抽成</td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold">15% 起</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">你在 APP 裡收到的錢，商店會先抽走一成半。年收在 US$100 萬以內，兩家商店都適用這個優惠費率（蘋果叫它小型企業計畫）。超過這個門檻，商店會抽到三成。</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold">審查時間</td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 align-top font-semibold">24–48 小時起</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">每次送出都要等審查，被退件就要修完重新排隊。</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-4 py-3 align-top font-semibold">之後每次更新</td>
                  <td className="whitespace-nowrap px-4 py-3 align-top font-semibold">重新送審</td>
                  <td className="px-4 py-3 align-top text-muted-foreground">網站改完馬上生效，APP 連改一個字都要再送審一次。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* ============ 審查地雷 ============ */}
      <section id="review" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Flag className="size-7 text-primary" strokeWidth={1.6} /></span>審查地雷</SectionHead>
        <Decide q={["現實", "第一次送審被退很常見"]} a={["對策", "下面的雷先拆掉再送"]} />

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="shell">
            <AccordionTrigger>純網頁包殼，蘋果會拒收</AccordionTrigger>
            <AccordionContent>
              <p>把網站原封不動包成 APP 送上去，過不了蘋果的審查。審查指南裡有一條最低功能門檻（編號 4.2），要求 APP 要有網頁給不了的東西。</p>
              <p className="mt-2">所以包殼上架至少要加上推播、原生分享、離線可用這類手機才有的能力。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="honest">
            <AccordionTrigger>截圖和描述要跟實際功能一致</AccordionTrigger>
            <AccordionContent>
              商店頁上的截圖和文字，必須跟打開 APP 之後看到的一樣。放過時的畫面或誇大功能，都是常見的退件理由。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="account">
            <AccordionTrigger>要給審查員一組測試帳號</AccordionTrigger>
            <AccordionContent>
              APP 要登入才能用的話，送審時要附上能直接登入的測試帳號。審查員進不了門，就只能把你退件。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 上架前清單 ============ */}
      <section id="checklist" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ListChecks className="size-7 text-primary" strokeWidth={1.6} /></span>上架前清單</SectionHead>
        <Decide q={["規則", "全勾了才按送審"]} a={["提醒", "缺一項都可能被退件"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="flex items-center gap-3 border-b-2 border-input bg-secondary/60 px-5 py-3.5">
            <div className="flex flex-1 gap-1">
              {CHECKLIST.map((_, i) => (
                <i key={i} className={cn("h-[5px] flex-1 rounded-full bg-secondary", done.has(i) && "bg-ok")} />
              ))}
            </div>
            <span className="font-mono text-[0.78rem] text-muted-foreground">{done.size}/{CHECKLIST.length}</span>
          </div>
          <div>
            {CHECKLIST.map((c, i) => (
              <label key={i} className={cn("flex cursor-pointer items-start gap-3.5 border-b border-border px-5 py-3.5 last:border-b-0 hover:bg-secondary/40", done.has(i) && "opacity-70")}>
                <Checkbox className="mt-1" checked={done.has(i)} onCheckedChange={(v) => toggle(i, v === true)} />
                <span>
                  <b className={cn("block text-[0.95rem]", done.has(i) && "line-through decoration-ok/60")}>{i + 1}. {c.t}</b>
                  <span className="text-[0.78rem] text-muted-foreground">{c.d}</span>
                </span>
              </label>
            ))}
          </div>
          <div className={cn(
            "border-t-2 px-5 py-4 text-center font-serif text-[1.15rem] font-extrabold tracking-widest transition-colors",
            all ? "border-ok bg-ok/10 text-ok" : "border-input bg-secondary/60 text-faint"
          )}>
            {all ? "備齊 ✓ 可以送審" : "還不能送審"}
          </div>
        </Card>
      </section>

      {/* ============ 能留在網頁的，都留在網頁 ============ */}
      <section id="web-first" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Globe className="size-7 text-primary" strokeWidth={1.6} /></span>能留在網頁的，都留在網頁</SectionHead>
        <Decide q={["原則", "APP 只放非它不可的功能"]} a={["留在網頁", "帳號管理 ・ 後台 ・ 行銷頁"]} />

        <Card className="mt-6 px-5 py-4 text-[0.95rem]">
          <p>APP 裡的每一個畫面，改動之後都要重新送審、重新排隊。</p>
          <p className="mt-2">帳號管理、管理後台、行銷介紹頁，放在網頁上改完馬上生效，不要塞進 APP。</p>
          <p className="mt-2"><b>APP 只留下真正需要手機能力的部分，日後更新的負擔會小很多。</b></p>
        </Card>
      </section>

      {/* ============ 來源 ============ */}
      <section className="pt-12">
        <div className="rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <Scale className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          價格與審查規則出自 Apple 與 Google 的官方開發者方案頁和商店審查指南（2026-08-24 實查）。方案會變，付錢前再上官網確認一次。
        </div>
      </section>

      <Pager prev={["/guides/payments", "金流指南"]} next={["/guides/launch", "上線與維護"]} />
    </main>
  )
}
