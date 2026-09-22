import { Link } from "react-router-dom"
import { Banknote, Flag } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, FlowArrow, FlowNode, Pager } from "@/components/site"

const TOOLS = [
  {
    href: "https://github.com/ECPay/ECPay-API-Skill",
    name: "ECPay-API-Skill",
    badge: "綠界官方",
    what: "把它裝進 Claude Code，AI 就會照 134 個驗證過的官方範例，幫你寫金流、發票和物流的串接，還附測試帳號。",
    url: "github.com/ECPay/ECPay-API-Skill",
  },
  {
    href: "https://github.com/ECPay",
    name: "綠界官方串接套件（SDK）",
    badge: "綠界官方",
    what: "這是各種程式語言的官方串接套件，給 AI 或工程師用。看不懂那些語言名字的話，跳過這一條也沒關係。",
    url: "github.com/ECPay",
  },
  {
    href: "https://github.com/paid-tw/skills",
    name: "paid-tw/skills",
    badge: "社群",
    what: "這裡收集了台灣金流的 AI skills。藍新的已經可以用，綠界和統一 PAYUNi 的還在開發中。",
    url: "github.com/paid-tw/skills",
  },
  {
    href: "https://docs.stripe.com/mcp",
    name: "Stripe MCP",
    badge: "Stripe 官方",
    what: "用一行指令接上之後，AI 就能查文件、建商品、處理退款，還能搭配官方的 stripe/ai 工具庫。",
    url: "docs.stripe.com/mcp ・ github.com/stripe/ai",
  },
  {
    href: "https://developers-pay.line.me/online-api-v3",
    name: "LINE Pay Online API",
    badge: "LINE 官方",
    what: "這是直接串接 LINE Pay 用的官方文件。其實多數人透過綠界或藍新間接串就好。",
    url: "developers-pay.line.me/online-api-v3",
  },
]

export default function GuidePayments() {
  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <header className="pb-1 pt-11">
        <p className="font-mono text-[0.72rem] text-muted-foreground">
          <Link to="/" className="text-draft no-underline hover:underline">首頁</Link> › <Link to="/shelf" className="text-draft no-underline hover:underline">書架</Link> › 金流指南
        </p>
        <h1 className="reveal d1 mt-4 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">金流指南</h1>
        <p className="reveal d2 mt-3 max-w-[46ch] text-lg text-muted-foreground">收台灣的錢用誰？收海外的錢走哪條路？</p>
      </header>

      {/* ============ PAY-01 收台灣的錢 ============ */}
      <section id="tw" className="pt-12">
        <SectionHead>
          <span className="mr-3 font-mono text-[1.05rem] font-bold text-draft">1</span>收台灣的錢，用誰？
        </SectionHead>
        <Decide q={["選項", "綠界 ／ 藍新 ／ LINE Pay ／ TapPay"]} a={["推薦", "綠界或藍新，兩家都免月費，個人就能申請"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">服務</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">費用</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">什麼時候選它</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-border px-4 py-3 align-top font-semibold whitespace-nowrap">綠界 ECPay</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">免月費；刷卡 2.75% 起＋NT$1/筆</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">預設就選它。金流、發票、超商物流可以一站做完，官方還出了 AI skill</td>
                </tr>
                <tr>
                  <td className="border-b border-border px-4 py-3 align-top font-semibold whitespace-nowrap">藍新 NewebPay</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">免月費；刷卡約 2.8%</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">想換掉綠界的時候選它。發票走同集團的 ezPay 開立</td>
                </tr>
                <tr>
                  <td className="border-b border-border px-4 py-3 align-top font-semibold whitespace-nowrap">LINE Pay</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">3%/筆</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">客群離不開 LINE 時，再把它加開成一種付款方式。多半透過綠界或藍新間接串就好，不必直接申請</td>
                </tr>
                <tr>
                  <td className="border-b-0 px-4 py-3 align-top font-semibold whitespace-nowrap">TapPay</td>
                  <td className="border-b-0 px-4 py-3 align-top text-muted-foreground">年費約 NT$5,900 起＋刷卡 2.5–3.1%</td>
                  <td className="border-b-0 px-4 py-3 align-top text-muted-foreground">交易量大、想要原生 Apple Pay 或 Google Pay 體驗的公司再選它</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          <AccordionItem value="tw-more">
            <AccordionTrigger>個人賣家 vs 公司？什麼時候升「特約」？</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5">
                <li><b>個人就能開始</b>：綠界和藍新的一般賣家都可以免費申請，個人賣家每 30 天的收款上限約 NT$20 萬。</li>
                <li><b>特約賣家</b>（綠界：設定費 NT$5,000＋年費 NT$13,000 起，費率可談到約 1.85%）：等月營收穩定超過 20–30 萬、省下的手續費蓋得過年費，再升級就好。</li>
                <li>上面的費率都未含稅。撥款約 T+10，也就是刷卡後約 10 個營業日才會入帳。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ PAY-02 收海外的錢 ============ */}
      <section id="global" className="pt-16">
        <SectionHead>
          <span className="mr-3 font-mono text-[1.05rem] font-bold text-draft">2</span>收海外的錢，走哪條路？
        </SectionHead>
        <Decide q={["背景", "Stripe 台灣店家還不能用"]} a={["推薦", "先用代收平台，量大再開美國公司"]} />

        <div className="mt-6 flex flex-wrap items-center gap-3" aria-label="海外收款判斷流程">
          <FlowNode>想收海外的錢</FlowNode>
          <FlowArrow />
          <FlowNode>先用代收平台</FlowNode>
          <FlowArrow />
          <FlowNode ask>抽成心痛了？</FlowNode>
          <FlowArrow />
          <span className="flex flex-col gap-1.5">
            <span className="rounded-lg border-[1.5px] border-current bg-card px-3 py-1.5 text-[0.8rem] font-semibold text-ok shadow-sm">還好 → 繼續用</span>
            <span className="rounded-lg border-[1.5px] border-current bg-card px-3 py-1.5 text-[0.8rem] font-semibold text-primary shadow-sm">痛 → 開美國公司 ↓</span>
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 items-start gap-4 max-md:grid-cols-1">
          {/* 路線 A */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 font-serif text-[1.15rem]">
                <Banknote className="size-5 text-draft" strokeWidth={1.6} />路線 A：代收平台
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-[0.62rem] tracking-[0.16em] text-draft">推薦起步</div>
              <b className="mt-1 block text-[1.02rem]">平台當賣方，稅務它處理</b>
              <span className="mt-1 block text-[0.82rem] text-muted-foreground">不用開公司，但只限軟體訂閱和數位商品，而且要通過平台審核</span>
              <code className="mt-2 inline-block rounded-md border border-input bg-secondary px-2 py-0.5 font-mono text-[0.68rem] text-muted-foreground">Paddle：5%＋US$0.50 全包</code>
              <Accordion type="multiple" className="mt-4">
                <AccordionItem value="a-alt" className="rounded-none border-0 border-t border-dashed bg-transparent shadow-none">
                  <AccordionTrigger className="px-0 text-[0.88rem]">細節與備選</AccordionTrigger>
                  <AccordionContent className="border-0 px-0 pb-0">
                    <dl className="space-y-3">
                      <div>
                        <dt className="font-semibold text-foreground">Paddle</dt>
                        <dd className="mt-0.5"><b>台灣賣家可申請</b> <span>— 台灣不在排除名單上，全球的銷售稅由它來扛，但能不能核准還要看風控審核</span></dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-foreground">Lemon Squeezy（備選）</dt>
                        <dd className="mt-0.5"><b>上手更簡單，但有過渡期風險</b> <span>— 費率 5%＋US$0.50，跨國卡和訂閱還有另外的加成。它已經被 Stripe 收購，長期會併入 Stripe 體系</span></dd>
                      </div>
                    </dl>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* 路線 B */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 font-serif text-[1.15rem]">
                <Flag className="size-5 text-draft" strokeWidth={1.6} />路線 B：美國公司＋Stripe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-[0.62rem] tracking-[0.16em] text-draft">量大再走</div>
              <b className="mt-1 block text-[1.02rem]">開一間美國公司，拿完整 Stripe</b>
              <span className="mt-1 block text-[0.82rem] text-muted-foreground">費率降到 2.9%＋US$0.30，但你會多一間公司要養。整個流程都在線上辦，不用飛美國</span>
              <code className="mt-2 inline-block rounded-md border border-input bg-secondary px-2 py-0.5 font-mono text-[0.68rem] text-muted-foreground">Stripe Atlas：US$500 一次性</code>
              <Accordion type="multiple" className="mt-4">
                <AccordionItem value="b-cost" className="rounded-none border-0 border-t border-dashed bg-transparent shadow-none">
                  <AccordionTrigger className="px-0 text-[0.88rem]">費用全攤開（2026-08 查證）</AccordionTrigger>
                  <AccordionContent className="border-0 px-0 pb-0">
                    <dl className="space-y-3">
                      <div>
                        <dt className="font-semibold text-foreground">一次性</dt>
                        <dd className="mt-0.5"><b>Stripe Atlas US$500</b> <span>— 這筆錢包含 Delaware 公司（LLC 或 C-Corp）、稅籍編號（EIN）、第一年的代理人，還有 US$2,500 的 Stripe 抵用金</span></dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-foreground">每年固定</dt>
                        <dd className="mt-0.5"><b>約 US$400–2,300/年</b> <span>— 這包含代理人續約 US$100、Delaware 州稅（LLC 定額 US$300；C-Corp 最低 US$175 加年報 US$50），再加上美國報稅代辦的行情 US$300–2,000</span></dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-foreground">每筆交易</dt>
                        <dd className="mt-0.5"><b>Stripe 2.9%＋US$0.30 起</b> <span>— 把錢匯回台灣的時候，還會多一筆換匯的成本</span></dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-foreground">什麼時候值得</dt>
                        <dd className="mt-0.5"><b>月營收穩定上 US$3,000–5,000 再認真算</b> <span>— 省下的抽成差（約 2%）要蓋得過每年固定成本才划算</span></dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-foreground">替代的開公司服務</dt>
                        <dd className="mt-0.5"><b>doola（US$297/年起＋州費，含報稅套餐 US$1,999/年）、Firstbase（設立 US$99 起，代理人 US$299/年）</b> <span>— 想把每年的文件和報稅整包外包時，拿這兩家來比價</span></dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-foreground">紅線</dt>
                        <dd className="mt-0.5"><b>稅務請找懂美台兩地的會計師</b> <span>— 美國公司有報稅的義務，台灣個人也有海外所得要申報。這一頁不是稅務建議</span></dd>
                      </div>
                    </dl>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============ PAY-03 發票與稅 ============ */}
      <section id="tax" className="pt-16">
        <SectionHead>
          <span className="mr-3 font-mono text-[1.05rem] font-bold text-draft">3</span>發票與稅
        </SectionHead>
        <Decide q={["規則", "有統編才需要開發票"]} a={["推薦", "一成立公司，就串接自動開立發票"]} />

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">你是誰</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">發票</th>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">怎麼做</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-border px-4 py-3 align-top font-semibold whitespace-nowrap">個人賣家</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">不能開，也不需要開</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">收款用個人會員就可以了。等營業額大到碰到稅務門檻，再去問會計師</td>
                </tr>
                <tr>
                  <td className="border-b border-border px-4 py-3 align-top font-semibold whitespace-nowrap">台灣公司行號</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">有開立義務</td>
                  <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">用綠界或 ezPay 的發票加值服務自動開立（設定費 NT$3,600 起，年費依張數計算）</td>
                </tr>
                <tr>
                  <td className="border-b-0 px-4 py-3 align-top font-semibold whitespace-nowrap">美國公司路線</td>
                  <td className="border-b-0 px-4 py-3 align-top text-muted-foreground">美國要報稅，台灣要算海外所得</td>
                  <td className="border-b-0 px-4 py-3 align-top text-muted-foreground">兩邊都有申報義務。請找懂美台兩地的會計師，不要自己猜</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <p className="mt-4 text-[0.78rem] text-faint">這一章不是稅務或法律建議。金額與費率都是查證日當天的參考價。</p>
      </section>

      {/* ============ PAY-04 工具 ============ */}
      <section id="tools" className="pt-16">
        <SectionHead>
          <span className="mr-3 font-mono text-[1.05rem] font-bold text-draft">4</span>工具直達
        </SectionHead>
        <Decide q={["原則", "官方出的先用"]} a={["重點", "串接讓 AI 照官方範例寫"]} />

        <div className="mt-5 rounded-r-lg border-l-[3px] border-input bg-secondary/60 px-4 py-2.5 text-[0.82rem] text-muted-foreground [&_b]:text-foreground">
          名詞小抄：<b>skill</b> 是給 AI 的指令包；<b>MCP</b> 是讓 AI 直接操作某個服務的接頭；<b>SDK</b> 是官方做好的串接套件。這些都不用自己弄，跟 AI 說「幫我裝」就好。
        </div>

        <div className="mt-5 space-y-2.5">
          {TOOLS.map((t) => (
            <a
              key={t.href}
              href={t.href}
              target="_blank"
              rel="noopener"
              className="group block rounded-lg border-[1.5px] border-input bg-card p-4 no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary"
            >
              <span className="flex flex-wrap items-center gap-2.5">
                <b className="text-[0.98rem]">{t.name}</b>
                <Badge variant={t.badge === "社群" ? "default" : "ok"}>{t.badge}</Badge>
              </span>
              <span className="mt-1 block text-[0.82rem] text-muted-foreground">{t.what}</span>
              <span className="mt-1.5 block font-mono text-[0.68rem] text-faint">{t.url}</span>
            </a>
          ))}
        </div>

      </section>

      <Pager prev={["/guides/style", "風格細節"]} next={["/guides/app-store", "APP 上架"]} />
    </main>
  )
}
