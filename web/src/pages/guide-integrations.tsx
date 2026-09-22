import { Link } from "react-router-dom"
import { FileSpreadsheet, ListChecks, Bot, KeyRound } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, FlowArrow, FlowNode, Pager } from "@/components/site"

const TOOLS = [
  { href: "https://developers.google.com/apps-script", name: "Google Apps Script", badge: "Google 官方", what: "它是試算表和表單的免費自動化引擎，也能架成免費的接收端（webhook）。", url: "developers.google.com/apps-script" },
  { href: "https://developers.google.com/workspace/sheets/api/limits", name: "Sheets API 配額", badge: "Google 官方", what: "API 本身免費，每位使用者每分鐘讀跟寫各能用 60 次。", url: "developers.google.com/workspace/sheets" },
  { href: "https://supabase.com/docs/guides/database/import-data", name: "Supabase 匯入", badge: "Supabase 官方", what: "試算表長大了嗎？把 CSV 下載下來拖進去就能搬家，100MB 以內都行。", url: "supabase.com/docs/guides/database/import-data" },
  { href: "https://ai-sdk.dev", name: "Vercel AI SDK", badge: "Vercel 官方", what: "同一套程式碼就能呼叫各家模型，換供應商只要改一行，聊天介面也有現成的。", url: "ai-sdk.dev" },
  { href: "https://openrouter.ai", name: "OpenRouter", badge: "社群", what: "一把金鑰就能試各家模型，名稱以 :free 結尾的模型免費，但有次數限制。", url: "openrouter.ai" },
  { href: "https://platform.claude.com/docs/en/about-claude/pricing", name: "三家定價頁", badge: "官方", what: "這裡可以查 Claude、OpenAI、Gemini 三家的價目原文。", url: "platform.claude.com ・ developers.openai.com ・ ai.google.dev" },
]

export default function GuideIntegrations() {
  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 串接指南
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">串接指南</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">這一頁回答三個最常見的串接問題：試算表、表單，還有 AI。</p>
      </header>

      {/* ============ 1 試算表 ============ */}
      <section id="sheets" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><FileSpreadsheet className="size-7 text-primary" strokeWidth={1.6} /></span>串 Google 試算表</SectionHead>
        <Decide q={["場景", "你的程式需要直接讀寫你的試算表。"]} a={["推薦", "小量使用可以。有兩個程式同時寫入時，就搬去正式資料庫。"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">做法</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">費用</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">什麼時候選</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 font-semibold">Apps Script</td>
                  <td className="border-b border-border px-4 py-3 text-muted-foreground">免費</td>
                  <td className="border-b border-border px-4 py-3 text-muted-foreground">最省事的預設選擇。腳本就住在試算表裡，還能部署成免費的接收端（webhook），程式可以請 AI 寫</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 font-semibold">Sheets API＋服務帳戶</td>
                  <td className="border-b border-border px-4 py-3 text-muted-foreground">免費（每分鐘 60 次）</td>
                  <td className="border-b border-border px-4 py-3 text-muted-foreground">自家網站要直接讀寫試算表時選這個。服務帳戶就是程式自己的 Google 機器人帳號，把表「共用」給它就能用</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">SheetDB／Sheety</td>
                  <td className="px-4 py-3 text-muted-foreground">免費層每月幾百次</td>
                  <td className="px-4 py-3 text-muted-foreground">不推薦——額度太小，還要把你的表交給別人的伺服器</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          <AccordionItem value="db">
            <AccordionTrigger>什麼時候不該把試算表當資料庫？</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5">
                <li><b>同時寫入會打架</b>：兩個以上的程式同時寫，資料可能互相覆蓋——這是搬家的第一訊號。</li>
                <li><b>幾萬列就開始慢</b>：硬上限是 1,000 萬儲存格，但遠在那之前查詢就卡了。</li>
                <li><b>要用條件查資料、要分權限</b>的時候，就該搬家了。</li>
                <li><b>搬家很簡單</b>：先下載 CSV，再用 Supabase 的「Import data from CSV」拖進去，它會自動建表。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 2 表單 ============ */}
      <section id="forms" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ListChecks className="size-7 text-primary" strokeWidth={1.6} /></span>串 Google 表單</SectionHead>
        <Decide q={["規則", "收單這件事完全不用寫程式。"]} a={["推薦", "表單收到的資料自動進試算表，送出的瞬間就自動處理。"]} />

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <FlowNode>表單收單</FlowNode>
          <FlowArrow />
          <FlowNode>自動進試算表</FlowNode>
          <FlowArrow />
          <FlowNode ask>送出瞬間觸發</FlowNode>
          <FlowArrow />
          <FlowNode>寄信／通知 LINE／叫自家系統</FlowNode>
        </div>

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="how">
            <AccordionTrigger>三步設定（跟 AI 說這段就能做）</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5">
                <li><b>連動</b>：在表單的「回覆」分頁點「連結至試算表」，這是內建功能，不用寫程式。</li>
                <li><b>觸發</b>：在試算表掛上「可安裝的提交表單觸發器」來跑 Apps Script，要選<b>可安裝</b>的那種，才能寄信和打外部服務。</li>
                <li><b>動作</b>：在腳本裡寄確認信、通知 LINE、或呼叫自家系統，免費額度是每天對外呼叫 20,000 次。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="gotcha">
            <AccordionTrigger>兩個坑</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>用程式代送的回覆<b>不會觸發</b>自動處理——只有真人送出才會。</li>
                <li>改完腳本要「部署新版本」，接收端網址的行為才會更新。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 3 AI ============ */}
      <section id="ai" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Bot className="size-7 text-primary" strokeWidth={1.6} /></span>串 AI</SectionHead>
        <Decide q={["先問", "AI 的回答要出現在你的產品裡、給客戶用嗎"]} a={["推薦", "不用的話，訂閱就好。要的話，才需要串 API。"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">家</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">最便宜可用</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">每百萬 tokens（入／出）</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">備註</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 font-semibold">OpenAI</td>
                  <td className="border-b border-border px-4 py-3 text-muted-foreground">gpt-5-nano</td>
                  <td className="border-b border-border px-4 py-3 font-mono text-[0.82rem]">US$0.05／0.40</td>
                  <td className="border-b border-border px-4 py-3 text-muted-foreground">做輕量工作時，它是全場最便宜的選擇之一</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap border-b border-border px-4 py-3 font-semibold">Google</td>
                  <td className="border-b border-border px-4 py-3 text-muted-foreground">Gemini 2.5 Flash-Lite</td>
                  <td className="border-b border-border px-4 py-3 font-mono text-[0.82rem]">US$0.10／0.40</td>
                  <td className="border-b border-border px-4 py-3 text-muted-foreground">有免費層，到 AI Studio 拿金鑰、不用綁卡；正式產品建議用付費層</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">Anthropic</td>
                  <td className="px-4 py-3 text-muted-foreground">Claude Haiku 4.5</td>
                  <td className="px-4 py-3 font-mono text-[0.82rem]">US$1／5</td>
                  <td className="px-4 py-3 text-muted-foreground">中階的 Sonnet 5 是 US$3／15（2026 年 8 月底前有首發優惠 US$2／10）；快取讀取只收輸入價的一成</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-5 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-6 py-4 text-center font-mono text-[0.9rem]">
          一則客服對話（約 800 tokens）花不到 <b className="text-primary">1 美分</b>；一萬則也只要約 US$1.5–20，量小的時候模型費幾乎可以忽略
        </div>

        <div className="mt-5 rounded-lg border-[1.5px] border-input border-l-4 border-l-primary bg-card p-4.5 shadow-sm">
          <div className="flex items-center gap-2.5 font-serif text-[1.05rem] font-extrabold">
            <KeyRound className="size-5 text-primary" strokeWidth={1.6} />真正的紅線：金鑰絕不放進網頁
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            金鑰一放進前端，任何人按 F12 就能複製走，拿去刷爆你的帳單。前端永遠只呼叫<b className="text-foreground">自家後端</b>，由後端拿金鑰去叫 AI。下面三種代理選一種就好，可以請 AI 幫你架：
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <code className="rounded-md border border-input bg-secondary px-2 py-0.5 font-mono text-[0.7rem] text-muted-foreground">Next.js API Route</code>
            <code className="rounded-md border border-input bg-secondary px-2 py-0.5 font-mono text-[0.7rem] text-muted-foreground">Supabase Edge Function</code>
            <code className="rounded-md border border-input bg-secondary px-2 py-0.5 font-mono text-[0.7rem] text-muted-foreground">Cloudflare Worker</code>
          </div>
        </div>

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          <AccordionItem value="cap">
            <AccordionTrigger>開通第一天就設支出上限</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5">
                <li><b>OpenAI</b>：用 Spend limits 把警示和硬上限一起開，超過上限就直接擋下來。</li>
                <li><b>Anthropic</b>：在 Console 的 Workspace Spend limits 設好每月上限，並且打開警示。</li>
                <li><b>Google</b>：用 Budgets &amp; alerts 設預算，但注意它預設只會通知你，不會幫你斷線。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="glue">
            <AccordionTrigger>好用的黏著層</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5">
                <li><b>Vercel AI SDK</b>：同一套程式碼就能呼叫各家模型，換供應商只要改一行；聊天的打字機效果和狀態管理都有現成的。</li>
                <li><b>OpenRouter</b>：一把金鑰就能試各家模型；名稱以 <code className="font-mono text-[0.8rem]">:free</code> 結尾的模型免費，每日 50 次起，儲值滿 US$10 就升到每日 1,000 次。適合在原型期比價，量大之後再直連原廠。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sub">
            <AccordionTrigger>訂閱就夠的訊號</AccordionTrigger>
            <AccordionContent>
              如果只有自己或同事用，用途是問答、寫作或整理文件，每天用不到幾十次，也不用接自家資料，那訂閱（約 US$20/月）就夠了——功能更完整，成本也固定。要嵌進產品給客戶、要自動化、或要接自家資料庫，才需要串 API。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 工具直達 ============ */}
      <section id="tools" className="pt-14">
        <SectionHead>工具直達</SectionHead>
        <div className="mt-5 grid gap-2.5">
          {TOOLS.map((t) => (
            <a key={t.name} href={t.href} target="_blank" rel="noopener" className="flex flex-wrap items-baseline gap-2.5 rounded-lg border-[1.5px] border-input bg-card px-4 py-3 no-underline shadow-sm transition-colors hover:border-primary">
              <span className="flex flex-wrap items-center gap-2.5">
                <b className="text-[0.98rem]">{t.name}</b>
                <Badge variant={t.badge === "社群" ? "default" : "ok"}>{t.badge}</Badge>
              </span>
              <span className="mt-1 block w-full text-[0.82rem] text-muted-foreground">{t.what}</span>
              <span className="font-mono text-[0.68rem] text-faint">{t.url}</span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-[0.78rem] text-faint">頁面上的數字是 2026-08-24 到官方頁面實查的結果。Sheets API 的配額之後可能開始對超額收費，請把用量控制在額度內。</p>
      </section>

      <Pager prev={["/guides/toolbox", "工具與 skill 索引"]} next={["/guides/style", "風格細節"]} />
    </main>
  )
}
