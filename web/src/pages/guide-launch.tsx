import { useState } from "react"
import { Link } from "react-router-dom"
import { Rocket, CalendarCheck, DoorOpen, Scale } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

const CHECKLIST = [
  { t: "全站 HTTPS，憑證自動續期", d: "網址要有鎖頭，而且三個月後憑證也不會突然失效" },
  { t: "每天自動備份，且親手還原成功過一次", d: "沒還原過的備份只是心理安慰" },
  { t: "錯誤追蹤已接上", d: "第一個發現問題的不該是客戶" },
  { t: "金鑰不在程式裡，上線前換過一輪", d: "開發期的金鑰可能早就外流" },
  { t: "金流走完「成功、被拒、退款」三條測試路", d: "再用真卡小額測一筆，因為錢出錯最傷顧客的信任" },
  { t: "回滾方法寫成一頁，演練過", d: "半夜壞掉的時候，沒有時間現學怎麼救" },
  { t: "有名字的負責人", d: "網站掛了誰會收到通知、由誰處理？沒有名字的責任，等於沒有人負責" },
  { t: "隱私權政策上線＋安全回報信箱", d: "跟使用者說清楚資料去了哪裡。被找到漏洞不可恥，沒有回報管道才可恥" },
  { t: "掛站監測，掛了通知到手機", d: "你要比使用者先知道" },
  { t: "帳單設預算警示或上限", d: "流量或 AI 呼叫暴衝，一夜可以燒掉數百美元" },
]

export default function GuideLaunch() {
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
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 上線與維護
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">上線與維護</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">「可以上線」不是感覺，是一張全勾的清單。</p>
      </header>

      {/* ============ 上線的定義 ============ */}
      <section id="checklist" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Rocket className="size-7 text-primary" strokeWidth={1.6} /></span>上線的定義</SectionHead>
        <Decide q={["規則", "10 項全勾才叫可以上線"]} a={["怎麼做", "每一項都可以叫 AI 幫你完成"]} />

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
            {all ? "合理 ✓ 可以上線" : "還不能上線"}
          </div>
        </Card>

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          <AccordionItem value="dod">
            <AccordionTrigger>功能怎樣算「做完」？（驗收 AI 的合約）</AccordionTrigger>
            <AccordionContent>
              <p>AI 說「做完了」不算數，它給你看的常常只是樣品屋（見小教室的〈樣品屋與真店面〉）。每一條都是你不用看程式碼、親手就能核對的事：</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>我用自己的手機從頭走完這個功能一次。</li>
                <li>我故意亂輸入（空白、亂碼、超長文字），畫面給出看得懂的錯誤訊息。</li>
                <li>手機和電腦都試過，版面沒跑掉。</li>
                <li>涉及錢或個資的操作，反悔的路徑我都測過：取消、退款、刪除都真的有效。</li>
                <li>我故意製造一個錯誤，錯誤追蹤有通知我。</li>
                <li>我把最重要的三條路（註冊、付款、核心動作）重走一遍，確認舊功能沒有壞。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="pdpa">
            <AccordionTrigger>個資法的最低要求（請洽法律專業）</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5">
                <li><b>收個資前要告知</b>（個資法第 8 條）：你是誰、為什麼收、收什麼、怎麼用、使用者有什麼權利——實務上就是那頁隱私權政策。</li>
                <li><b>外洩要通知當事人</b>（第 12 條），新制朝「知悉後 72 小時內通報」方向施行。</li>
                <li>只要牽涉到會員、金流或健康資料，請務必諮詢律師。以上不是法律意見。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 維護節奏 ============ */}
      <section id="maintain" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><CalendarCheck className="size-7 text-primary" strokeWidth={1.6} /></span>維護節奏</SectionHead>
        <Decide q={["原則", "把維護排進行事曆的重複事件，它才會真的發生"]} a={["成本", "每週 15 分鐘、每月 1 小時、每季半天"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">節奏</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">做什麼</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 font-semibold">每週 15 分</td>
                  <td className="border-b border-border px-4 py-3 text-muted-foreground">看一下錯誤報告和掛站紀錄，再掃一眼用量有沒有暴衝</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 font-semibold">每月 1 小時</td>
                  <td className="border-b border-border px-4 py-3 text-muted-foreground">核對帳單明細、合併安全性更新，再確認備份真的有新檔案</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">每季半天</td>
                  <td className="px-4 py-3 text-muted-foreground">實際還原一次備份，換一輪金鑰，檢查網域憑證有沒有續期，並清掉用不到的權限</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-3 text-[0.78rem] text-faint">這三份清單都可以直接丟給 AI：「照這份幫我檢查一輪，回報結果。」</p>
      </section>

      {/* ============ 退場條款 ============ */}
      <section id="sunset" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><DoorOpen className="size-7 text-primary" strokeWidth={1.6} /></span>退場條款</SectionHead>
        <Decide q={["原則", "上線時就寫好，避免日後感情用事"]} a={["範本", "使用人數連續 N 個月低於 X 人，就在 90 天內啟動退場"]} />

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="signals">
            <AccordionTrigger>五個該收掉的訊號</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>連續三個月使用人數下滑，而且不是季節因素。</li>
                <li>每個月花的維護時間加上帳單，比它帶來的收入或樂趣還高。</li>
                <li>你不敢更新、不敢動程式碼——安全債在累積。</li>
                <li>你只在它壞掉時才想到它。</li>
                <li>出現了你自己都會改用的替代品。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="steps">
            <AccordionTrigger>體面的收法</AccordionTrigger>
            <AccordionContent>
              先提前 30–90 天通知使用者，並提供資料匯出。接著停收新訂閱、按比例退款，依個資法刪除個資。最後關掉金流與金鑰，網域留一陣子放告別頁。<b>收掉沒人用的產品不是失敗，是把備份、帳單、個資責任誠實結清。</b>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 來源 ============ */}
      <section className="pt-12">
        <div className="rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <Scale className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          清單綜合 Google SRE 上線清單、Stripe Go-live 清單、OWASP 金鑰管理、Backblaze 備份原則與台灣個資法條文（2026-08-24 實查）。
        </div>
      </section>

      <Pager prev={["/guides/app-store", "APP 上架"]} next={["/guides/sell", "賣出去"]} />
    </main>
  )
}
