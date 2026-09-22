import { Link } from "react-router-dom"
import { Scale } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager } from "@/components/site"

const TOOLS = [
  { cmd: <><code className="rounded-md border border-input bg-secondary px-1.5 py-0.5 font-mono text-[0.78rem]">gh</code>（GitHub）</>, what: "幫你開好程式碼保險箱、每天自動存檔，也會設定「金鑰保險櫃」（secrets）和發佈版本。" },
  { cmd: <><code className="rounded-md border border-input bg-secondary px-1.5 py-0.5 font-mono text-[0.78rem]">wrangler</code>（Cloudflare）</>, what: "你只要說一句「幫我上線」，它就把網站部署到全球，連網域和憑證都設好。" },
  { cmd: <><code className="rounded-md border border-input bg-secondary px-1.5 py-0.5 font-mono text-[0.78rem]">supabase</code></>, what: "幫你建資料表、改欄位、設權限規則、跑資料庫變更，你連後台都不用開。" },
  { cmd: <><code className="rounded-md border border-input bg-secondary px-1.5 py-0.5 font-mono text-[0.78rem]">stripe</code></>, what: "幫你建立商品與價格，還能在本機模擬「有人付款了」來測試流程。" },
  { cmd: <><code className="rounded-md border border-input bg-secondary px-1.5 py-0.5 font-mono text-[0.78rem]">vercel</code></>, what: "幫你部署預覽版給朋友看，也能綁網域、設環境變數。" },
  { cmd: <><code className="rounded-md border border-input bg-secondary px-1.5 py-0.5 font-mono text-[0.78rem]">aws</code>／<code className="rounded-md border border-input bg-secondary px-1.5 py-0.5 font-mono text-[0.78rem]">gcloud</code>（進階）</>, what: "如果公司已經在用 AWS 或 Google 雲，AI 就能直接操作雲端資源；一般專案用不到。" },
]

const RESOURCES = [
  { href: "https://github.com/anthropics/skills", name: "anthropics/skills", badge: "Anthropic 官方", official: true, what: "官方的 skill 儲存庫，收錄規範、範本和大量現成技能，是挑 skill 的第一站。", url: "github.com/anthropics/skills" },
  { href: "https://github.com/anthropics/claude-plugins-official", name: "官方 plugin 目錄", badge: "Anthropic 官方", official: true, what: "Claude Code 內建的官方 marketplace，輸入 /plugin 就能瀏覽安裝。", url: "github.com/anthropics/claude-plugins-official" },
  { href: "https://github.com/ECPay/ECPay-API-Skill", name: "ECPay-API-Skill", badge: "綠界官方", official: true, what: "金流、發票、物流的串接都讓 AI 照官方範例寫，要在台灣收款的話必裝。", url: "github.com/ECPay/ECPay-API-Skill" },
  { href: "https://docs.stripe.com/mcp", name: "Stripe MCP ＋ stripe/ai", badge: "Stripe 官方", official: true, what: "全球金流的官方 AI 整合，能幫你查文件、建商品、退款和測試付款。", url: "docs.stripe.com/mcp" },
  { href: "https://github.com/supabase/mcp", name: "Supabase MCP", badge: "Supabase 官方", official: true, what: "讓 AI 直接管資料表、跑查詢、看設定與記錄，還有官方雲端端點，不用自己架。", url: "github.com/supabase/mcp" },
  { href: "https://github.com/cloudflare/mcp-server-cloudflare", name: "Cloudflare MCP", badge: "Cloudflare 官方", official: true, what: "部署、網域、防護的官方 AI 整合，一共提供 16 個領域專用工具。", url: "github.com/cloudflare/mcp-server-cloudflare" },
  { href: "https://github.com/github/github-mcp-server", name: "GitHub MCP", badge: "GitHub 官方", official: true, what: "AI 直接讀專案、管議題與合併請求、看自動化流程。", url: "github.com/github/github-mcp-server" },
  { href: "https://github.com/microsoft/playwright-mcp", name: "Playwright MCP", badge: "Microsoft 官方", official: true, what: "讓 AI 操作瀏覽器幫你測試網站，當成上線前的自動檢查。", url: "github.com/microsoft/playwright-mcp" },
  { href: "https://ui.shadcn.com/docs/mcp", name: "shadcn/ui ＋官方 MCP", badge: "shadcn 官方", official: true, what: "「俐落」風格的元件庫，配上官方 MCP，AI 用一句話就能搜尋並安裝元件。", url: "ui.shadcn.com/docs/mcp" },
  { href: "https://github.com/upstash/context7", name: "Context7", badge: "社群", official: false, what: "把「最新版官方文件」即時餵給 AI，避免它憑過時記憶寫錯。", url: "github.com/upstash/context7" },
  { href: "https://github.com/getsentry/sentry-mcp", name: "Sentry MCP", badge: "Sentry 官方", official: true, what: "網站出錯時，AI 直接拉錯誤報告、分析原因。", url: "github.com/getsentry/sentry-mcp" },
  { href: "https://github.com/line/line-bot-mcp-server", name: "LINE 官方 MCP", badge: "LINE 官方", official: true, what: "讓 AI 直接操作 LINE 官方帳號，推播、查用戶、管選單都行，在台灣做通知必看。", url: "github.com/line/line-bot-mcp-server" },
  { href: "https://docs.expo.dev/", name: "Expo／Capacitor 文件", badge: "Expo／Capacitor 官方", official: true, what: "決定做 APP 之後的兩條跨平台路：想要接近原生的體驗就選 Expo，已經有網頁就選 Capacitor。", url: "docs.expo.dev ・ capacitorjs.com/docs" },
]

export default function GuideToolbox() {
  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <header className="pb-1 pt-11">
        <p className="font-mono text-[0.72rem] text-muted-foreground">
          <Link to="/" className="text-draft no-underline hover:underline">首頁</Link> › <Link to="/shelf" className="text-draft no-underline hover:underline">書架</Link> › 工具與 skill 索引
        </p>
        <h1 className="reveal d1 mt-4 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">工具與 skill 索引</h1>
        <p className="reveal d2 mt-3 max-w-[46ch] text-lg text-muted-foreground">不用自己做的，都在這裡。</p>
      </header>

      {/* TB-01 AI 能代勞什麼 */}
      <section id="delegate" className="pt-12">
        <SectionHead>
          <span className="mr-3 font-mono text-[1.05rem] font-bold text-draft">1</span>
          AI 能代勞什麼？
        </SectionHead>
        <Decide q={["你只做", "辦帳號 ・ 給一次金鑰 ・ 按同意"]} a={["其餘", "AI 動手，不只動口"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">裝這個工具</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">AI 就能幫你（舉例）</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((t, i) => {
                  const last = i === TOOLS.length - 1
                  return (
                    <tr key={i}>
                      <td className={`border-border px-4 py-3 align-top font-semibold whitespace-nowrap ${last ? "border-b-0" : "border-b"}`}>{t.cmd}</td>
                      <td className={`border-border px-4 py-3 align-top text-muted-foreground ${last ? "border-b-0" : "border-b"}`}>{t.what}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          <AccordionItem value="rules">
            <AccordionTrigger>這套分工的三條規則</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5">
                <li><b>你做的事只有三種</b>：用瀏覽器辦帳號、產「一次」金鑰貼給 AI、跳出系統視窗時按同意。其餘的設定、建表、部署——都讓 AI 用工具做，不要自己在後台摸索。</li>
                <li><b>金鑰給 AI 之後去哪了？</b>進環境變數檔（.env），這個檔永遠不進程式碼保險箱。</li>
                <li><b>用 /architect 產完藍圖，直接叫 AI 裝</b>：「幫我把需要的工具裝好」就是一句合法指令。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* TB-02 常見二選一 */}
      <section id="versus" className="pt-16">
        <SectionHead>
          <span className="mr-3 font-mono text-[1.05rem] font-bold text-draft">2</span>
          常見二選一
        </SectionHead>
        <Decide q={["方法", "看你像哪個例子"]} a={["提醒", "資料庫這類難回頭的決定，多想一步"]} />

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          <AccordionItem value="supabase-firebase">
            <AccordionTrigger>
              <Scale className="size-[18px] shrink-0 text-draft" strokeWidth={1.6} />
              <b>Supabase vs Firebase</b>
              <span className="text-[0.78rem] font-normal text-muted-foreground">資料像表格就選 Supabase，重度用 Google 生態才選 Firebase</span>
            </AccordionTrigger>
            <AccordionContent>
              <b>例子：</b>記帳系統、預約系統、會員訂單——資料之間有關聯（訂單屬於會員），這是<b>表格型資料，選 Supabase</b>（標準資料庫，之後要搬家一個指令就能整套帶走）。
              <br /><b>例外：</b>已經重度用 Google 服務、或要做即時同步的聊天、協作，Firebase 生態更順——但注意兩件事：帳單沒有上限（寫壞程式可能爆卡），以及它的資料格式搬家很痛。
              <br /><b>預設答案：Supabase。</b>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cloudflare-vercel">
            <AccordionTrigger>
              <Scale className="size-[18px] shrink-0 text-draft" strokeWidth={1.6} />
              <b>Cloudflare vs Vercel</b>
              <span className="text-[0.78rem] font-normal text-muted-foreground">要商用又想免費就選 Cloudflare，最在意 Next.js 體驗就選 Vercel</span>
            </AccordionTrigger>
            <AccordionContent>
              <b>例子：</b>個人作品集、社團網站（非商業）——兩家都免費，Vercel 體驗最順。
              <br /><b>例子：</b>開始收錢的小店網站——<b>Vercel 免費版禁止商用</b>（要升級到 US$20/月的方案），Cloudflare 免費版可商用、流量不限，選 Cloudflare。
              <br /><b>預設答案：會收錢就選 Cloudflare；純個人用途的話，Vercel 也很好。</b>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="railway-render">
            <AccordionTrigger>
              <Scale className="size-[18px] shrink-0 text-draft" strokeWidth={1.6} />
              <b>Railway vs Render</b>
              <span className="text-[0.78rem] font-normal text-muted-foreground">想要體驗好一點就選 Railway，想把預算抓死就選 Render</span>
            </AccordionTrigger>
            <AccordionContent>
              <b>例子：</b>要跑一台 Python 小機器做 AI 運算：Railway（US$5/月起）介面體驗最好，但它按用量計費，流量一大費用就會跟著漲；Render（US$7/月）是固定價，預算好抓。
              <br /><b>共同提醒：</b>兩家的免費額度都別指望（Railway 免費方案每月只有 US$1 額度、Render 免費機沒人用就休眠）。
              
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="platform-stripe">
            <AccordionTrigger>
              <Scale className="size-[18px] shrink-0 text-draft" strokeWidth={1.6} />
              <b>代收平台 vs 美國公司＋Stripe</b>
              <span className="text-[0.78rem] font-normal text-muted-foreground">先用代收平台（抽 5%）驗證，量大了再開公司（降到 2.9%）</span>
            </AccordionTrigger>
            <AccordionContent>
              細節與費用都攤開在<Link to="/guides/payments" className="text-primary"><b>金流指南</b></Link>裡，包含用 Stripe Atlas 花 US$500 開美國公司的完整成本表。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* TB-03 資源目錄 */}
      <section id="dir" className="pt-16">
        <SectionHead>
          <span className="mr-3 font-mono text-[1.05rem] font-bold text-draft">3</span>
          資源目錄
        </SectionHead>
        <Decide q={["定位", "我們是目錄，實作交給它們"]} a={["怎麼裝", "跟 AI 說「幫我裝○○」就好"]} />

        <div className="mt-5 rounded-r-lg border-l-[3px] border-input bg-secondary/60 px-4 py-2.5 text-[0.82rem] text-muted-foreground [&_b]:text-foreground">
          名詞小抄：<b>skill</b> 是給 AI 的指令包，<b>MCP</b> 是讓 AI 直接操作某個服務的接頭。兩個都不用自己弄，叫 AI 裝就好。
        </div>

        <div className="mt-5 grid gap-2.5">
          {RESOURCES.map((r) => (
            <a
              key={r.href}
              href={r.href}
              target="_blank"
              rel="noopener"
              className="flex flex-wrap items-baseline gap-2.5 rounded-[10px] border-[1.5px] border-input bg-card px-4 py-3 no-underline shadow-sm transition-colors hover:border-primary"
            >
              <b className="text-[0.92rem]">{r.name}</b>
              <Badge variant={r.official ? "ok" : "default"}>{r.badge}</Badge>
              <span className="flex-[1_1_260px] text-[0.82rem] text-muted-foreground">{r.what}</span>
              <span className="w-full font-mono text-[0.68rem] text-faint [overflow-wrap:anywhere]">{r.url}</span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-[0.78rem] text-faint">這些工具的熱門度與收費方案會變，重大決定前再上官網確認一次。</p>
      </section>

      <Pager prev={["/guides/memory", "AI 為什麼會忘記"]} next={["/guides/integrations", "串接指南"]} />
    </main>
  )
}
