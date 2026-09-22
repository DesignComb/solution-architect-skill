import { Link } from "react-router-dom"
import { Target, Rocket, Flag, Coins, GitBranch, Wrench, Upload, FlaskConical, KeyRound, Terminal } from "lucide-react"
import { SectionHead, Decide, Pager } from "@/components/site"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const MILES = [
  { icon: Target, when: "第 1 週", title: "最小可用版", desc: "只做最核心的功能，先給自己用用看。", hit: false },
  { icon: Rocket, when: "第 1 個月", title: "給真人用", desc: "找 10 個真人來用，聽他們卡在哪裡。", hit: false },
  { icon: Flag, when: "第 3 個月", title: "對答案", desc: "有達標就繼續擴充，沒達標就換個方向。", hit: true },
  { icon: Coins, when: "之後", title: "有訊號才升級", desc: "額度爆了才付費，變慢了才優化。", hit: false },
]

const CONCEPTS = [
  { value: "c1", icon: GitBranch, title: "存檔點", one: "隨時都能退回昨天的版本", body: <>每次改動都會留下紀錄，這件事 AI 會幫你設定好。改壞了，按一下就能回到上一版。</> },
  { value: "c2", icon: Target, title: "最小可用版", one: "先做能用的最小版本", body: <>用一週做出核心功能就好。等真人用過，你的功能清單會全部重寫。</> },
  { value: "c3", icon: Rocket, title: "上線比完美重要", one: "沒人用過，一切都是猜的", body: <>醜一點沒關係，先讓 10 個真人用。他們的抱怨比你的想像值錢。</> },
  { value: "c4", icon: Wrench, title: "一次只改一件事", one: "出了問題，才找得出是哪一步弄壞的", body: <>每次改一小步，改完就存檔。一次改十個地方，壞了你猜不到兇手是誰。</> },
  { value: "c5", icon: Upload, title: "資料要能帶走", one: "服務倒了，資料跟你走", body: <>挑用標準格式存資料的服務，而且要定期備份。資料能搬家，你才有議價的底氣。</> },
  { value: "c6", icon: FlaskConical, title: "先在測試場玩", one: "別直接動真錢、真資料", body: <>收款服務都有測試模式。先用假卡整套跑一遍，再收真錢。</> },
  { value: "c7", icon: KeyRound, title: "金鑰絕不進程式碼", one: "金鑰就像家裡的鑰匙", body: <>金鑰只放在 AI 幫你設好的鑰匙檔裡。萬一洩漏了，就立刻換鎖。</> },
  { value: "c8", icon: Terminal, title: "讓 AI 動手，不只動口", one: "你只要辦好帳號、按下同意就好", body: <>先裝上幾個小工具，AI 就能直接幫你開專案、建資料、上線。詳細的分工請看<Link to="/guides/toolbox"><b>工具索引 →</b></Link></> },
]

const RULES = [
  { title: "一次只問一兩題", desc: "一次倒十題，只會得到敷衍。" },
  { title: "問行為，不問想像", desc: "問「你現在怎麼解決？」比問「你想要什麼？」更誠實。" },
  { title: "術語不外包", desc: "專有名詞是架構師的功課，不丟給你。" },
  { title: "隨時能回頭", desc: "每步都存檔，中斷了下次接著走。" },
]

const REDS = [
  { no: "RL-01", title: "還沒有使用者，先上大公司架構", desc: "最簡單的做法能撐到你到不了的規模。" },
  { no: "RL-02", title: "「以後會用到」的功能現在做", desc: "訊號還沒出現就先蓋，九成會蓋錯。" },
  { no: "RL-03", title: "為了炫技選冷門技術", desc: "冷門代表範例少，AI 就寫不好，最後只有你會修。" },
  { no: "RL-04", title: "什麼都自己做", desc: "登入、收款、寄信都有人做得更好更便宜。" },
  { no: "RL-05", title: "只算服務費，不算時間", desc: "省下的月費，會用維護時間加倍還回去。" },
  { no: "RL-06", title: "說「很便宜」而不給數字", desc: "給不出數字的建議，等於沒有建議。" },
]

export default function Mindset() {
  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <header className="pb-1 pt-11">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">心法</h1>
        <Decide q={["節奏", "上線比完美重要"]} a={["目標", "訂一個數得出來的目標（例：每週 30 筆訂單），三個月後對答案"]} />
      </header>

      {/* 上線的節奏 */}
      <section className="pt-12">
        <SectionHead>上線的節奏</SectionHead>

        <div className="relative mt-8">
          {/* 行進虛線（點後方） */}
          <div className="absolute left-[12.5%] right-[12.5%] top-5 max-md:hidden" aria-hidden="true">
            <svg width="100%" height="4" preserveAspectRatio="none">
              <line x1="0" y1="2" x2="100%" y2="2" stroke="var(--draft)" strokeWidth="1.8" className="march" />
            </svg>
          </div>

          <div className="grid grid-cols-4 gap-4 max-md:grid-cols-1">
            {MILES.map((m) => (
              <div key={m.title} className="flex flex-col items-center max-md:flex-row max-md:items-start max-md:gap-4">
                <span
                  className={cn(
                    "relative inline-flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-input bg-card text-draft shadow-sm",
                    m.hit && "border-primary bg-primary text-primary-foreground"
                  )}
                >
                  <m.icon className="size-5" strokeWidth={1.8} />
                </span>
                <div className="mt-3 w-full rounded-lg border-[1.5px] border-input bg-card p-4 text-center shadow-sm max-md:mt-0 max-md:text-left">
                  <div className={cn("font-mono text-[0.62rem] tracking-[0.16em]", m.hit ? "text-primary" : "text-draft")}>{m.when}</div>
                  <b className="mt-1 block">{m.title}</b>
                  <p className="mt-1 text-[0.82rem] text-muted-foreground">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          <AccordionItem value="signals">
            <AccordionTrigger>「有訊號才做」對照表</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1 pl-5">
                <li><b>免費額度快滿</b>了，才需要付月費或搬家。</li>
                <li><b>有人喊慢</b>，才去量出是哪裡慢，量完再動手。</li>
                <li><b>有人想付錢</b>，才開始做收費和發票。</li>
                <li><b>沒人用</b>，就回頭重新問一次需求，而不是加功能。</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 開工前的八個觀念 */}
      <section className="pt-16">
        <SectionHead>開工前的八個觀念</SectionHead>

        <Accordion type="multiple" className="mt-4 space-y-2.5">
          {CONCEPTS.map((c) => (
            <AccordionItem key={c.value} value={c.value}>
              <AccordionTrigger>
                <c.icon className="size-[18px] shrink-0 text-draft" strokeWidth={1.6} />
                <b>{c.title}</b>
                <span className="text-[0.8rem] font-normal text-muted-foreground">{c.one}</span>
              </AccordionTrigger>
              <AccordionContent>{c.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-7 grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {RULES.map((r) => (
            <div key={r.title} className="rounded-lg border-[1.5px] border-input bg-card p-4 shadow-sm">
              <b className="block text-[0.95rem]">{r.title}</b>
              <span className="mt-1 block text-[0.8rem] text-muted-foreground">{r.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 三個詞 */}
      <section className="pt-16">
        <SectionHead>工程師常說的三個詞</SectionHead>
        <Decide q={["用法", "聽得懂就好，做法交給 AI"]} a={["推薦組合", "規格一定要寫，核心功能的測試看情況寫，重型方法先不要用"]} />

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="sdd">
            <AccordionTrigger>SDD 規格驅動<span className="ml-2 font-normal text-[0.76rem] text-muted-foreground">先寫規格，再動工——必做</span></AccordionTrigger>
            <AccordionContent>
              動工前，先把「要做什麼、什麼不做、怎麼驗收」寫成一頁文件。AI 會照著規格分階段做，而不是一句一句提示碰運氣。這是唯一<b>不會寫程式也能完整執行</b>的方法，因為把需求講清楚正是你的主場。用「開始規劃」做出來的需求單，就是這份規格。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="tdd">
            <AccordionTrigger>TDD 測試驅動<span className="ml-2 font-normal text-[0.76rem] text-muted-foreground">先出考卷，再寫程式——核心功能選做</span></AccordionTrigger>
            <AccordionContent>
              先叫 AI 把驗收條件寫成會自動打分的測試，並確認這些測試一開始是失敗的。再叫它實作到全部通過，這樣 AI 就沒辦法作弊說自己做完了。你不用看懂程式碼，只要看紅燈變綠燈。只保護「壞掉會賠錢或丟臉」的部分：錢、權限、關鍵計算。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ddd">
            <AccordionTrigger>DDD 領域驅動<span className="ml-2 font-normal text-[0.76rem] text-muted-foreground">程式說你的語言——取兩招就好</span></AccordionTrigger>
            <AccordionContent>
              小產品只取兩招精華。第一招是<b>統一命名</b>：訂單就叫訂單，別讓同一個東西有三種名字，AI 的誤解率會大幅下降。第二招是<b>規則集中一處</b>：「什麼情況可退費」寫在同一個地方，改規則時只要改一處。完整的 DDD 是給多人團隊、複雜領域用的，小產品硬套反而是過度設計。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 六條紅線 */}
      <section className="pt-16">
        <SectionHead>六條紅線：出現就停工</SectionHead>

        <div className="mt-6 grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {REDS.map((r) => (
            <div key={r.no} className="rounded-lg border-[1.5px] border-input border-l-4 border-l-primary bg-card p-4 shadow-sm">
              <span className="font-mono text-[0.62rem] tracking-[0.16em] text-primary">{r.no}</span>
              <b className="mt-1.5 block">{r.title}</b>
              <p className="mt-1 text-[0.82rem] text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>

        <Pager prev={["/cost", "花多少錢"]} next={["/shelf", "書架"]} />
      </section>
    </main>
  )
}
