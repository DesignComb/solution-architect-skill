import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  ClipboardList, Search, Copy, Rocket, Hammer, Bug, CalendarCheck,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHead, Decide, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

type StageKey = "start" | "build" | "verify" | "run"

type Tpl = {
  id: number
  title: string
  when: string
  body: string
}

type Group = { key: StageKey; name: string; icon: LucideIcon; items: Tpl[] }

const GROUPS: Group[] = [
  {
    key: "start",
    name: "開工",
    icon: Rocket,
    items: [
      {
        id: 1,
        title: "把需求單交給 AI",
        when: "需求單寫好之後，開新對話的第一句話就貼這段。",
        body: `這是我的需求單，請整份讀完照著做：

〔把需求單貼在這裡〕

幾個規矩請你遵守：
- 先做最小可用的版本，需求單以外的先不做。
- 一次只做一件事，做完先停，我驗收過了再做下一件。
- 每件事動手之前，先用白話說你打算怎麼做，我確認了你再開始。
- 不確定的地方先問我，不要自己猜。`,
      },
      {
        id: 2,
        title: "開專案骨架和程式碼保險箱",
        when: "起手式講完之後接著用，先把地基打好，還不急著做功能。",
        body: `請幫我把專案的骨架開起來，並且接上程式碼保險箱（版本控制）。
- 動手之前，先用白話說你打算怎麼架，我確認了你再開始。
- 保險箱要能天天存檔，改壞了可以整包退回前一天。
- 金鑰這類秘密檔案，先設定成永遠不會被存進保險箱。
- 做完之後教我看一眼，怎樣算「已經存檔成功」。`,
      },
      {
        id: 3,
        title: "接上資料庫、放幾筆假資料",
        when: "骨架開好之後接著用，把放資料的地方準備起來。",
        body: `請幫我接上資料庫，照需求單裡的欄位把表開好。
- 動手之前，先用白話說每張表放什麼、欄位有哪些，我確認了你再開始。
- 開好之後放幾筆假資料，讓我在畫面上看得到東西。
- 假資料要一眼看得出是假的，名字就用「測試用戶一」這種。
- 金鑰放進秘密抽屜（環境變數檔），不要寫在程式裡。`,
      },
    ],
  },
  {
    key: "build",
    name: "做功能",
    icon: Hammer,
    items: [
      {
        id: 4,
        title: "交辦一個功能",
        when: "之後每一個新功能都用這張交辦，四個料一次備齊。",
        body: `我要交辦一個功能，資料如下。

背景：〔誰會用、現在的做法哪裡麻煩〕
要什麼：〔用一段話說清楚要做出什麼〕
例子：〔舉一筆真實樣子的資料，例如：王小明、A 棟、已繳〕
驗收條件：〔怎樣算做好，例如：能送出、名單多一列、亂填會被擋下來〕

動手之前，先用白話說你打算怎麼做，我確認了你再開始。
做完先停，等我親手驗收，通過了再繼續下一件。`,
      },
      {
        id: 5,
        title: "請 AI 解釋它剛寫的東西",
        when: "AI 改完東西先聽它講一遍，講不清楚就是警訊。",
        body: `請用白話解釋你剛剛完成的〔功能或改動〕：
- 你改了哪些地方、為什麼要這樣做。
- 這次改動會不會影響到原本就有的功能。
- 有沒有動到錢或個資？有的話先停下來告訴我。
講的時候當作我完全不懂程式，可以用生活裡的比喻。`,
      },
      {
        id: 6,
        title: "請 AI 寫測試自己抓自己",
        when: "功能做完先別急著收，讓程式自己檢查一輪再說。",
        body: `請幫〔功能名稱〕寫一組自動測試，讓程式自己檢查自己：
- 正常操作要通過，亂輸入要被擋下來，兩種都要測到。
- 寫好之後跑一遍，把結果整理成我看得懂的樣子。
- 有沒通過的項目，先告訴我原因，我說好你再修。`,
      },
    ],
  },
  {
    key: "verify",
    name: "驗收與除錯",
    icon: Bug,
    items: [
      {
        id: 7,
        title: "驗收一個功能",
        when: "AI 說做完了不算數，拿這段換一份你親手核對的清單。",
        body: `你說〔功能名稱〕做完了，現在我要親手驗收。
請給我一份驗收清單，讓我不用看程式碼也能核對：
- 一步一步寫清楚我要按哪裡、輸入什麼。
- 每一步都寫上「應該看到什麼」，讓我能當場比對。
- 至少放一個故意做錯的操作，讓我確認錯誤訊息看得懂。`,
      },
      {
        id: 8,
        title: "故意找碴",
        when: "驗收通過之後再兇一點，問題都是這時候被逼出來的。",
        body: `我要對〔功能名稱〕故意找碴，請你陪我一起測：
- 每個輸入框都試空白、亂碼和超長文字，要出現看得懂的錯誤訊息。
- 用手機的小螢幕整個走一遍，版面不能跑掉。
- 同一個按鈕快速連按很多下，資料不能重複送出。
測完把發現的問題列成清單就好，先不要修，我挑了你再修。`,
      },
      {
        id: 9,
        title: "回報錯誤的標準格式",
        when: "出狀況的時候照這個格式講，AI 修得又快又準。",
        body: `出狀況了，我照格式回報：

我做了什麼：〔一步一步寫，例如：在手機上填完表單按了送出〕
預期看到：〔例如：畫面顯示成功，名單多一列〕
實際看到：〔例如：畫面沒反應，名單也沒變〕
錯誤訊息全文：〔畫面上的訊息一字不漏貼過來，沒有就寫「沒有訊息」〕

先用白話告訴我可能的原因，等我確認方向，你再動手修。`,
      },
      {
        id: 10,
        title: "卡住了，換個做法",
        when: "同一個問題來回修了好幾輪都沒好，就停下來換路。",
        body: `這個問題我們來回好幾次都沒解決，先停下來，不要再修了。
- 先用白話總結：目前試過哪些做法、分別卡在哪裡。
- 再提出一到兩條完全不同的路，各自說優點和缺點。
- 我選了方向你再動手，不要急著回去修原來那條。`,
      },
    ],
  },
  {
    key: "run",
    name: "上線與維護",
    icon: CalendarCheck,
    items: [
      {
        id: 11,
        title: "上線前總檢查",
        when: "功能全部做完之後、上線之前，把這段丟給 AI 總檢查。",
        body: `我準備上線了。請照下面十項逐項檢查，一項一項回報「通過」或「還缺什麼」：
1. 全站網址都有鎖頭（HTTPS），憑證會自動續期。
2. 每天自動備份，而且親手還原成功過一次。
3. 錯誤追蹤接上了，出錯會通知到我。
4. 金鑰不在程式裡，上線前換過一輪。
5. 金流測過成功、被拒、退款三條路。
6. 回滾方法寫成一頁，演練過。
7. 網站掛了誰收到通知、由誰處理，寫了名字。
8. 隱私權政策上線了，也留了安全回報信箱。
9. 掛站監測開著，掛了會通知到手機。
10. 帳單設了預算警示或上限。
先檢查、先回報，沒過的項目等我說了你再動手補。`,
      },
      {
        id: 12,
        title: "每週巡檢",
        when: "把這段存起來，排進行事曆，每週丟給 AI 一次。",
        body: `請幫我做每週巡檢，只看三件事，看完回報就好：
- 錯誤追蹤這週有沒有新錯誤？有的話挑最嚴重的三個講給我聽。
- 網站這週有沒有掛過？掛了多久？
- 用量和費用有沒有突然暴衝？
只回報，先不要動手修。要修的話，我們一件一件來。`,
      },
      {
        id: 13,
        title: "每月結帳檢查",
        when: "每個月找一天，用這段把錢和備份都對一遍。",
        body: `請幫我做每月結帳檢查，逐項回報：
- 這個月的帳單明細，跟上個月比有沒有變貴？貴在哪裡？
- 有沒有該裝的安全性更新？先列清單，我說好你再更新。
- 備份最近有沒有新檔案？最新一份是什麼時候的？
三項都回報完，再告訴我有沒有需要我親手做的事。`,
      },
      {
        id: 14,
        title: "金鑰外洩急救",
        when: "金鑰不小心貼進對話或傳出去了，馬上照這段處理。",
        body: `我的金鑰可能外洩了，照急救順序帶我處理：
1. 先把外洩的金鑰立刻作廢，重新產一把新的。我來按，你告訴我去哪裡按。
2. 換好之後，馬上檢查帳單和用量有沒有異常暴衝。
3. 再查一遍有沒有陌生的登入或奇怪的操作紀錄。
處理完告訴我這次是怎麼洩出去的，我們把那個洞補起來。`,
      },
    ],
  },
]

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0)

const FILTERS: { key: StageKey | "all"; label: string }[] = [
  { key: "all", label: "全部" },
  ...GROUPS.map((g) => ({ key: g.key, label: g.name })),
]

export default function GuidePrompts() {
  const [stage, setStage] = useState<StageKey | "all">("all")
  const [q, setQ] = useState("")
  const [copied, setCopied] = useState<number | null>(null)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (copiedTimer.current) clearTimeout(copiedTimer.current)
  }, [])

  async function copyTpl(t: Tpl) {
    let ok = false
    try {
      await navigator.clipboard.writeText(t.body)
      ok = true
    } catch {
      const ta = document.createElement("textarea")
      ta.value = t.body
      ta.readOnly = true
      ta.style.position = "fixed"
      ta.style.opacity = "0"
      document.body.appendChild(ta)
      ta.select()
      try { ok = document.execCommand("copy") } catch {}
      document.body.removeChild(ta)
    }
    if (!ok) return
    setCopied(t.id)
    if (copiedTimer.current) clearTimeout(copiedTimer.current)
    copiedTimer.current = setTimeout(() => setCopied(null), 1600)
  }

  const kw = q.trim().toLowerCase()
  const shown = GROUPS
    .filter((g) => stage === "all" || g.key === stage)
    .map((g) => ({
      ...g,
      items: g.items.filter((t) => kw === "" || (t.title + t.when + t.body).toLowerCase().includes(kw)),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 指令範本
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">指令範本</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">跟 AI 開工不用想台詞，抄這頁就好。</p>
      </header>

      {/* ============ 範本總表 ============ */}
      <section id="templates" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ClipboardList className="size-7 text-primary" strokeWidth={1.6} /></span>範本總表</SectionHead>
        <Decide q={["怎麼用", "挑情境，按複製，貼給 AI"]} a={["規矩", "一次只交辦一件事"]} />

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" strokeWidth={1.8} />
            <input
              type="search"
              placeholder="搜尋範本，例如：備份、驗收、金鑰"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-lg border-[1.5px] border-input bg-card py-3 pl-10 pr-4 text-[0.95rem] outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const on = stage === f.key
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setStage(f.key)}
                  className={cn(
                    "cursor-pointer rounded-full border-[1.5px] border-input bg-card px-3.5 py-1.5 text-[0.82rem] font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary",
                    on && "border-primary bg-primary/10 text-primary"
                  )}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>
        <p className="mt-3 text-[0.78rem] text-faint">共 {TOTAL} 條。範本裡的〔〕是留給你填的空格，換成自己的內容再送出。</p>

        {shown.map((g) => (
          <div key={g.key} className="mt-10">
            <h3 className="flex items-center gap-2.5 font-serif text-[1.2rem] font-extrabold tracking-wide">
              <g.icon className="size-5 text-primary" strokeWidth={1.6} />
              {g.name}
              <Badge>{g.items.length} 條</Badge>
            </h3>
            <div className="mt-3.5 grid gap-3.5">
              {g.items.map((t) => (
                <Card key={t.id} className="overflow-hidden">
                  <div className="flex flex-wrap items-center gap-2.5 border-b border-dashed border-input px-5 py-3">
                    <span className="w-6 shrink-0 text-right font-serif text-[1.1rem] font-extrabold leading-none text-primary">{t.id}</span>
                    <b className="text-[0.95rem]">{t.title}</b>
                    <Button size="sm" variant="outline" className="ml-auto" onClick={() => copyTpl(t)}>
                      {copied === t.id ? "已複製 ✓" : <><Copy className="size-3.5" strokeWidth={1.8} />複製</>}
                    </Button>
                  </div>
                  <p className="px-5 pt-3 text-[0.82rem] text-muted-foreground">{t.when}</p>
                  <pre className="mx-5 mb-5 mt-2.5 overflow-x-auto whitespace-pre-wrap rounded-lg border border-dashed border-input bg-secondary/50 px-4 py-3.5 font-mono text-[0.8rem] leading-relaxed">{t.body}</pre>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {shown.length === 0 && (
          <div className="mt-8 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-8 text-center text-[0.9rem] text-muted-foreground">
            沒有找到符合的範本，換個關鍵字再試一次。
          </div>
        )}
      </section>

      {/* ============ 收尾連結 ============ */}
      <section className="pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-[1.5px] border-dashed border-input bg-card px-5 py-4 shadow-sm">
          <p className="text-[0.9rem] text-muted-foreground">這 {TOTAL} 條範本背後是同一套講法：背景、要什麼、驗收、先問。想懂為什麼要這樣講，完整的心法在那一頁。</p>
          <Button asChild variant="outline"><Link to="/guides/ai" className="no-underline">看跟 AI 一起做 →</Link></Button>
        </div>
      </section>

      <Pager prev={["/guides/recipes", "情境配方"]} next={["/guides/glossary", "名詞小抄"]} />
    </main>
  )
}
