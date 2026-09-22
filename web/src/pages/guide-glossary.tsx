import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, SearchX, Store, BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import { SectionHead, Decide, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

type Entry = { term: string; plain: string }

/* 一間店的比喻（與〈軟體怎麼運作〉同一套） */
const SHOP_TERMS: Entry[] = [
  { term: "前端", plain: "客人看到、摸到的那一層，就像店面" },
  { term: "後端", plain: "在背後處理事情的邏輯，就像廚房" },
  { term: "資料庫", plain: "存放所有資料的地方，就像倉庫" },
  { term: "API", plain: "前後場溝通用的固定格式，就像點餐單" },
  { term: "網域", plain: "你的網址，就像店的地址" },
  { term: "部署", plain: "把做好的東西放上網路，就像正式開店" },
  { term: "雲端", plain: "租來的別人家電腦，機器壞了房東修" },
  { term: "主機／伺服器", plain: "一台一直開著、負責服務大家的電腦" },
]

/* 常用詞 */
const COMMON_TERMS: Entry[] = [
  { term: "PWA", plain: "裝在手機上的網頁" },
  { term: "原生 APP", plain: "從商店下載安裝的那種 APP" },
  { term: "跨平台", plain: "寫一次，Apple 和 Android 都能用" },
  { term: "SEO", plain: "讓 Google 搜得到你" },
  { term: "CDN", plain: "把網頁放到離使用者近的地方，開起來比較快" },
  { term: "HTTPS", plain: "網址列的鎖頭，表示傳輸有加密" },
  { term: "SSL 憑證", plain: "讓鎖頭出現的證書，要定期換新" },
  { term: "DNS", plain: "把網址翻譯成機器位置的通訊錄" },
  { term: "預設網址（平台子網域）", plain: "平台免費送的網址，像「你的名字.netlify.app」，後半段是平台的招牌，換平台就作廢" },
  { term: "自訂網域", plain: "把自己買的網址接到平台上；主要幾家的免費層本來就能綁，但條款管的是用途不是網址" },
  { term: "冷啟動／休眠", plain: "免費方案沒人來就關機，第一位訪客要等它開機，不是壞掉" },
  { term: "金鑰（API key）", plain: "服務發給你的鑰匙，拿到就能動用你的帳號和錢" },
  { term: "公開金鑰（publishable key，舊名 anon key）", plain: "設計成可以放在網頁裡的鑰匙，權限很低，安全靠門禁規則把關" },
  { term: "秘密金鑰（secret key，舊名 service_role key）", plain: "繞過所有門禁的萬能鑰匙，只能放在你控制的伺服器上" },
  { term: "RLS（門禁規則）", plain: "資料庫裡一列一列的規則，決定誰能看到、誰能修改哪些資料" },
  { term: "token（通行證）", plain: "登入成功後拿到的臨時通行證，過期就要重新登入" },
  { term: "快取（cache）", plain: "存在你電腦或中繼站的網頁影本，開起來快，但可能是舊的" },
  { term: "本機／測試環境", plain: "只有你看得到的樣品屋，資料跟正式的分開" },
  { term: "正式環境", plain: "有網址、大家都看得到的真店面" },
  { term: "migration（施工紀錄）", plain: "每次改資料表結構都留一張有編號的施工單，能重演也能退回" },
  { term: "OAuth（借櫃台登入）", plain: "「用 Google 登入」這種做法，把驗身分交給別家櫃台，網站拿不到你的密碼" },
  { term: "context（工作桌）", plain: "AI 一次能記住的對話量，桌子滿了就會開始忘東西" },
  { term: "環境變數", plain: "放金鑰這類秘密的抽屜，跟程式碼分開收" },
  { term: "SDK", plain: "官方做好的零件包，照著接就能用" },
  { term: "MCP", plain: "讓 AI 直接操作某個服務的接頭" },
  { term: "CLI", plain: "用打字下指令的操作方式" },
  { term: "repo", plain: "程式碼保險箱：存程式碼的資料夾，兼歷史紀錄簿" },
  { term: "版本控制", plain: "每次改動都留底，隨時可以回到之前的樣子" },
  { term: "備份", plain: "把資料多存一份在別的地方" },
  { term: "還原", plain: "把備份拿出來，真的變回原樣才算數" },
  { term: "回滾", plain: "出事時退回上一個正常版本" },
  { term: "登入／驗證", plain: "確認現在操作的人是誰" },
  { term: "權限", plain: "誰能看什麼、改什麼的規則" },
  { term: "推播", plain: "APP 主動跳到手機上的通知" },
  { term: "webhook", plain: "事情發生時，服務主動通知你的系統一聲" },
  { term: "串接", plain: "讓兩個服務互相講話" },
  { term: "免費層／免費額度", plain: "服務免費送的用量，超過才收錢" },
  { term: "託管／全託管", plain: "機器和維運都交給平台顧，你只管內容" },
  { term: "開源", plain: "程式碼公開，任何人都能看、能用" },
]

function GlossTable({ rows }: { rows: Entry[] }) {
  return (
    <Card className="mt-6 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr>
              <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">名詞</th>
              <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">白話講法</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const last = i === rows.length - 1
              return (
                <tr key={r.term}>
                  <td className={cn("whitespace-nowrap border-border px-4 py-3 align-top font-mono text-[0.82rem] font-bold", !last && "border-b")}>{r.term}</td>
                  <td className={cn("border-border px-4 py-3 align-top text-muted-foreground", !last && "border-b")}>{r.plain}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default function GuideGlossary() {
  const [query, setQuery] = useState("")
  const needle = query.trim().toLowerCase()
  const hit = (e: Entry) => e.term.toLowerCase().includes(needle) || e.plain.toLowerCase().includes(needle)
  const shopRows = SHOP_TERMS.filter(hit)
  const commonRows = COMMON_TERMS.filter(hit)
  const total = SHOP_TERMS.length + COMMON_TERMS.length
  const hits = shopRows.length + commonRows.length

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 名詞小抄
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">名詞小抄</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">聽到聽不懂的詞，回來這頁查一下就好。</p>

        <div className="reveal d3 mt-7 max-w-[560px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" strokeWidth={1.8} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="輸入名詞或白話講法，例如：鎖頭"
              aria-label="搜尋名詞"
              className="w-full rounded-lg border-[1.5px] border-input bg-card py-3 pl-11 pr-4 text-[0.95rem] outline-none focus:border-primary"
            />
          </div>
          <p className="mt-2 font-mono text-[0.72rem] text-muted-foreground" aria-live="polite">
            {needle ? `找到 ${hits} 筆` : `共 ${total} 筆`}
          </p>
        </div>
      </header>

      {/* ============ 一間店的比喻 ============ */}
      {shopRows.length > 0 && (
        <section id="shop" className="pt-12">
          <SectionHead><span className="mr-3 inline-flex align-middle"><Store className="size-7 text-primary" strokeWidth={1.6} /></span>一間店的比喻</SectionHead>
          <Decide q={["原則", "八個詞共用開一間店的比喻"]} a={["好處", "記住一間店，八個詞一起懂"]} />
          <p className="mt-3 text-[0.78rem] text-faint">這八個詞的完整版故事，都在<Link to="/guides/how-it-works" className="text-primary"><b>軟體怎麼運作</b></Link>那一頁。</p>
          <GlossTable rows={shopRows} />
        </section>
      )}

      {/* ============ 常用詞 ============ */}
      {commonRows.length > 0 && (
        <section id="terms" className="pt-14">
          <SectionHead><span className="mr-3 inline-flex align-middle"><BookOpen className="size-7 text-primary" strokeWidth={1.6} /></span>常用詞</SectionHead>
          <Decide q={["情境", "AI 或廠商丟出術語的時候"]} a={["用法", "查到白話講法，之後就用它跟對方談"]} />
          <GlossTable rows={commonRows} />
        </section>
      )}

      {/* ============ 空狀態 ============ */}
      {hits === 0 && (
        <div className="mt-12 rounded-lg border-[1.5px] border-dashed border-input bg-card px-6 py-12 text-center">
          <SearchX className="mx-auto size-7 text-faint" strokeWidth={1.6} />
          <p className="mt-3 text-[0.95rem] text-muted-foreground">這裡還沒收這個詞。把它丟給 AI 問「用白話解釋」通常最快。</p>
        </div>
      )}

      <Pager prev={["/guides/prompts", "指令範本"]} next={["/guides/suffixes", "網址後綴對照表"]} />
    </main>
  )
}
