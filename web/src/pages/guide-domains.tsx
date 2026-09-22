import { useState } from "react"
import { Link } from "react-router-dom"
import { Tag, Signpost, ClipboardList, TriangleAlert, MessageCircleQuestionMark, CircleCheck, CircleX, Building2, Store, Rocket, Link2, CircleDollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SectionHead, Decide, Pager, FlowArrow, FlowNode } from "@/components/site"
import { cn } from "@/lib/utils"

const SCENES: { icon: typeof Rocket; name: string; chip: string; d: string; see: string }[] = [
  {
    icon: Rocket,
    name: "第一次把東西放上網",
    chip: "預設網址",
    d: "部署完成的那一刻，平台就丟給你一串網址，網站已經在線上了。你什麼都還沒買，它就能分享出去。",
    see: "一串你沒見過的網址，前半段有時候是平台隨手取的——像「勇敢的居禮夫人加五位數字」那種組合。",
  },
  {
    icon: Link2,
    name: "別人丟一個連結給你",
    chip: "後綴",
    d: "從尾巴那一段，看得出對方把東西放在哪一家、大概是什麼性質。這是最快的一次判斷，不用點進去。",
    see: "網址結尾是 .netlify.app、.pages.dev、.vercel.app、.replit.app 這一類，前面掛著一個誰都能取的名字。",
  },
  {
    icon: CircleDollarSign,
    name: "要印名片、要開始收錢",
    chip: "分界線",
    d: "這是整堂課唯一真正要做決定的時刻。前面兩個場景都不用花錢，到這裡就要了。",
    see: "你把網址念給別人聽的那一刻，自己就會知道答案。",
  },
]

const CEILINGS: { what: string; chip?: string; look: string; who: string }[] = [
  {
    what: "額度用完，整站關掉",
    chip: "點數制",
    look: "不是變慢，是直接打不開。訪客看到一頁「Site not available」。",
    who: "Netlify 免費層每月 300 點，部署、流量、請求都從同一池扣，扣完當下所有網站一起停。",
  },
  {
    what: "條款禁止拿來做生意",
    chip: "看條款不是看額度",
    look: "額度明明還很多，但你已經在違規了。平台可以隨時停權。",
    who: "Vercel 的 Hobby 方案限個人非商業使用；GitHub Pages 也寫明不可經營線上生意。",
  },
  {
    what: "沒人來就睡著",
    chip: "冷啟動",
    look: "第一位訪客要等約一分鐘才看得到畫面，第二位就快了。很容易被誤會成網站壞掉。",
    who: "Render 的免費網頁服務 15 分鐘沒流量就關機，下次有人來才重新開機。",
  },
]

const ENOUGH = [
  "給自己看的工具、記帳表、查詢頁",
  "課堂作業、練習作品、教學範例",
  "給同事或客戶看一眼就丟的展示版、改版預覽",
  "還在驗證想法、隨時可能整個砍掉重做的東西",
  "開源專案的說明文件站（掛 github.io 反而是加分，代表原始碼公開）",
]

const SWITCH = [
  "網址會印在名片、傳單、包裝、招牌上",
  "你打算長期經營，兩年後還希望這些連結是活的",
  "網站上有任何收款、報價、預約，或你靠它接案",
  "你想用「hello＠你的品牌.com」這種信箱收信",
  "你在乎搜尋排名（預設網址和自己的網域會被當成兩個網站，互相稀釋）",
]

const SOURCES = [
  { what: "Vercel 免費方案「限個人非商業」的條款與額度", href: "https://vercel.com/docs/limits/fair-use-guidelines", label: "vercel.com" },
  { what: "GitHub Pages 不可經營線上生意、不可處理信用卡號", href: "https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits", label: "docs.github.com" },
  { what: "Netlify 點數制與免費層可綁自訂網域", href: "https://www.netlify.com/pricing/", label: "netlify.com" },
  { what: "Render 免費服務閒置就關機", href: "https://render.com/docs/free", label: "render.com" },
  { what: "免費託管子網域的釣魚統計（卡巴斯基，2026-08）", href: "https://securelist.com/cloud-platforms-in-phishing/120832/", label: "securelist.com" },
]

type QuizOption = { label: string; ok: boolean; why: string }

const QUIZ: { tag: string; q: string; options: QuizOption[] }[] = [
  {
    tag: "有鎖頭就安全嗎",
    q: "朋友轉來一個 xxx.netlify.app 的購物頁，網址列有鎖頭，要你先刷卡付訂金。",
    options: [
      { label: "有鎖頭、又是大平台的網址，應該可以刷", ok: false, why: "這些平台一律自動配免費憑證，新網站一上線就有鎖頭。鎖頭只證明「連線有加密」，不證明「對方是誰」。" },
      { label: "先不要刷，自己重新打一次那家店的官網", ok: true, why: "免費、幾分鐘上線、母網域信譽又好，正是釣魚最愛用的組合。要登入或付款，永遠自己重打一次網址，不要從別人給的連結進去。" },
    ],
  },
  {
    tag: "該不該買網域",
    q: "你做了一個小工具掛在平台送的網址上，只有你和兩個同事在用。老闆問要不要買個網域比較專業。",
    options: [
      { label: "現在就買，不然看起來不專業", ok: false, why: "沒有第三個人會憑這個網址對你形成印象。這筆錢現在省下來，等到真的要給外人看再花。" },
      { label: "先不用，等到要印在名片上或開始收錢再說", ok: true, why: "判準只有一條：有沒有第三個人會憑這個網址記住你。內部工具沒有，就繼續用免費的。" },
    ],
  },
  {
    tag: "綁了網域就合規嗎",
    q: "你的接案作品放在 Vercel 的免費方案上，已經綁了自己買的網域。客戶想在上面收訂金。",
    options: [
      { label: "可以，網址已經是自己的了", ok: false, why: "條款管的是用途，不是網址。Vercel 免費方案就能綁 50 組網域，但「限個人非商業」這條照樣適用，換了網址一樣違規。" },
      { label: "不行，要升級到付費方案", ok: true, why: "只要跟錢有關，去看那家的條款，不是看額度表。額度夠用不等於可以商用——這兩件事平台是分開規定的。" },
    ],
  },
]

export default function GuideDomains() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUIZ.map(() => null))

  function pick(qi: number, oi: number) {
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 網址是誰給的
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">網址是誰給的</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">平台先借你一個門牌，什麼時候該去換自己的。</p>
      </header>

      {/* ============ 借來的門牌 ============ */}
      <section id="metaphor" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Tag className="size-7 text-primary" strokeWidth={1.6} /></span>借來的門牌</SectionHead>
        <Decide q={["比喻", "在別人的商場裡擺攤"]} a={["重點", "門牌是商場編的，不是你的"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">要開店，你可以先在別人的商場裡擺一個攤位。商場給你一個編號當門牌——「三樓 B12」。免費、當天就有、不用去申請。</p>
        <p className="mt-3 text-[0.92rem] text-muted-foreground">但那塊牌子上印的是商場的名字。你搬走，牌子還給商場，換下一個攤主用。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <Building2 className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">商場給的門牌</b>
            </div>
            <p className="mt-2.5 font-mono text-[0.82rem] font-bold">你取的名字.netlify.app</p>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">部署完就有，不用錢，馬上能分享。後半段那個招牌是房東的，你只是借住。</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <Store className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <b className="text-[1.02rem]">自己的店址</b>
            </div>
            <p className="mt-2.5 font-mono text-[0.82rem] font-bold">你的品牌.com</p>
            <p className="mt-2 text-[0.88rem] text-muted-foreground">一年幾百塊。搬到哪一家平台它都跟著你，換平台舊連結不會死。</p>
          </Card>
        </div>

        <p className="mt-5 text-[0.92rem] text-muted-foreground">
          軟體世界裡，商場編的那個號碼就是平台送你的<Badge className="mx-1.5 align-[1px]">預設網址</Badge>。前半段是你自己取的名字，後半段是房東的招牌。
        </p>
        <p className="mt-3 text-[0.78rem] text-faint">同一個後綴底下的兩個網站，彼此沒有任何關係，就像同一棟商場的兩個攤主。</p>
      </section>

      {/* ============ 你會在哪裡遇到它 ============ */}
      <section id="where" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Signpost className="size-7 text-primary" strokeWidth={1.6} /></span>你會在哪裡遇到它</SectionHead>
        <Decide q={["場景", "三個時刻，只有一個要做決定"]} a={["提醒", "前兩個不用花錢"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">下面三個時刻你都會碰到預設網址，但只有第三個需要你掏錢。</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {SCENES.map((s) => (
            <Card key={s.name} className="p-5">
              <div className="flex items-center gap-2.5">
                <s.icon className="size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <b className="text-[1.02rem]">{s.name}</b>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Badge>{s.chip}</Badge>
              </div>
              <p className="mt-2.5 text-[0.88rem] text-muted-foreground">{s.d}</p>
              <p className="mt-1.5 text-[0.88rem] text-muted-foreground"><b className="text-foreground">畫面上：</b>{s.see}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ============ 三條規則 ============ */}
      <section id="rules" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><ClipboardList className="size-7 text-primary" strokeWidth={1.6} /></span>三條規則</SectionHead>
        <Decide q={["原則", "免費是真的，天花板也是真的"]} a={["判準", "有第三個人會憑它記住你，就該換"]} />

        <p className="mt-8 font-serif text-[1.2rem] font-extrabold tracking-wide">一、後綴只說明住在哪，說不出誰做的</p>
        <p className="mt-3 text-[0.92rem] text-muted-foreground">一個預設網址是這樣拼起來的，前半段誰都能取，沒有任何人審核：</p>

        <div className="mt-5 flex flex-wrap items-center gap-2.5" aria-label="預設網址的組成">
          <FlowNode ask>你自己取的名字</FlowNode>
          <FlowArrow />
          <FlowNode>平台的招牌</FlowNode>
          <FlowArrow />
          <FlowNode ask>誰都能申請</FlowNode>
        </div>

        <p className="mt-5 text-[0.92rem] text-muted-foreground">
          所以同樣是 <b className="font-mono text-foreground">xxx.netlify.app</b>，底下可能是一頁純手寫的網頁、一個正經的商業網站，也可能是 AI 十分鐘生出來的樣品。
          <b className="text-foreground">看得出「放在哪一家」，看不出「誰做的、用什麼做的、可不可信」。</b>
        </p>

        <p className="mt-8 font-serif text-[1.2rem] font-extrabold tracking-wide">二、免費是真的，但有三種天花板</p>
        <p className="mt-3 text-[0.92rem] text-muted-foreground">每一種撞到的樣子都不一樣，而且都不像「壞了」。先認得，真的遇到才不會亂拆。</p>

        <Card className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">天花板</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">撞到的時候長什麼樣</th>
                  <th className="border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground">誰是這樣</th>
                </tr>
              </thead>
              <tbody>
                {CEILINGS.map((c, i) => {
                  const last = i === CEILINGS.length - 1
                  return (
                    <tr key={c.what}>
                      <td className={cn("px-4 py-3 align-top font-semibold", !last && "border-b border-border")}>
                        {c.what}
                        {c.chip && <span className="mt-1.5 block"><Badge>{c.chip}</Badge></span>}
                      </td>
                      <td className={cn("px-4 py-3 align-top text-muted-foreground", !last && "border-b border-border")}>{c.look}</td>
                      <td className={cn("px-4 py-3 align-top text-muted-foreground", !last && "border-b border-border")}>{c.who}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="mt-8 font-serif text-[1.2rem] font-extrabold tracking-wide">三、換成自己的網域，門檻比你想的低</p>
        <p className="mt-3 text-[0.92rem] text-muted-foreground">
          主要幾家平台的<b className="text-foreground">免費層本來就允許你綁自己的網域</b>，還附免費憑證。所以看到一個網站還掛著預設網址，通常不是「不能換」，是「還沒被當成正式的東西看待」。
        </p>
        <p className="mt-3 text-[0.92rem] text-muted-foreground">
          但有一個陷阱要先講：<b className="text-warn">綁了自己的網域，不等於就能拿來做生意。</b>條款管的是用途，不是網址——這一條下面的常見錯誤會再講一次。
        </p>

        <p className="mt-8 text-[0.92rem] text-muted-foreground">那到底什麼時候該換？判準只有一條：<b className="text-foreground">有沒有第三個人會憑這個網址對你形成印象。</b></p>

        <div className="mt-5 grid gap-2.5 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="border-b-2 border-input bg-secondary/60 px-5 py-3.5">
              <b className="text-[1.02rem] text-ok">繼續用免費的，別浪費錢</b>
            </div>
            {ENOUGH.map((t, i) => (
              <div key={t} className={cn("flex items-start gap-3 px-5 py-3", i < ENOUGH.length - 1 && "border-b border-border")}>
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-ok" strokeWidth={2} />
                <span className="text-[0.88rem] text-muted-foreground">{t}</span>
              </div>
            ))}
          </Card>
          <Card className="overflow-hidden">
            <div className="border-b-2 border-input bg-secondary/60 px-5 py-3.5">
              <b className="text-[1.02rem] text-warn">現在就去買網域，不要拖</b>
            </div>
            {SWITCH.map((t, i) => (
              <div key={t} className={cn("flex items-start gap-3 px-5 py-3", i < SWITCH.length - 1 && "border-b border-border")}>
                <CircleX className="mt-0.5 size-4 shrink-0 text-warn" strokeWidth={2} />
                <span className="text-[0.88rem] text-muted-foreground">{t}</span>
              </div>
            ))}
          </Card>
        </div>

        <p className="mt-4 text-[0.78rem] text-faint">一年幾百塊，是整個書架裡投資報酬率最高的一筆錢。買在哪、怎麼設定，看「地圖還沒更新」那一堂。</p>
      </section>

      {/* ============ 常見錯誤 ============ */}
      <section id="mistakes" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><TriangleAlert className="size-7 text-primary" strokeWidth={1.6} /></span>常見錯誤</SectionHead>
        <Decide q={["現實", "四個都不是技術問題"]} a={["共通點", "都是把「免費」誤讀成「沒有代價」"]} />

        <Accordion type="multiple" className="mt-5 space-y-2.5">
          <AccordionItem value="facade">
            <AccordionTrigger>把平台送的網址當成正式門面</AccordionTrigger>
            <AccordionContent>
              <p>名片、傳單、LINE 上貼一串 xxx.netlify.app，客戶第一眼想的是「這公司連網域都沒有嗎」。但真正的代價不只是面子。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>你收不了信——這些平台的網域根本沒有設定收信用的紀錄，「hello＠你的名字.netlify.app」這種信箱從一開始就不存在，你也沒有權限去加。哪天換平台，這串網址整個作廢：分享出去的連結、印好的 QR Code、既有的搜尋排名，一次歸零。而且這個名字不是你的資產，平台的使用條款寫著違規可能導致未經通知就終止並移除你的網站。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>只要有第三個人會憑這個網址記住你，就去買一個自己的網域。買完之後，平台的免費層本來就能綁上去。</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="quota">
            <AccordionTrigger>以為「額度夠用」就等於「可以商用」</AccordionTrigger>
            <AccordionContent>
              <p>這是整堂課最貴的一個誤會。Vercel 的免費方案給你每月 100GB 流量，小網站根本用不完——但它的條款寫死了限個人非商業使用，而且定義寬到連「請訪客贊助」都算商業。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>你不是撞額度，是踩在條款外面，平台隨時可以停權。更容易誤會的是：<b>綁了自己買的網域也不解禁</b>——免費方案本來就能綁 50 組網域，但條款管的是用途，不是網址。GitHub Pages 也一樣，寫明不可經營線上生意、不可處理密碼與信用卡號。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>只要這個網站跟錢有關，去翻那一家的條款，不要看額度表。該升級就升級，Vercel 是每席 US$20 一個月。</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="lock">
            <AccordionTrigger>看到鎖頭，就以為這個網站可信</AccordionTrigger>
            <AccordionContent>
              <p>這些平台一律自動配發免費憑證，網站一上線就有鎖頭。鎖頭只證明「這條連線有加密」，完全不證明「對方是誰」。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>免費、幾分鐘上線、自動配鎖頭，而且母網域本身信譽良好——這正是釣魚最愛用的組合，很多公司的資安過濾器會直接放行。卡巴斯基 2026 年 8 月發布的研究，統計一年內在這類平台上攔下 22 萬多個被拿來釣魚的網址，前四名就是 pages.dev、vercel.app、github.io 和 netlify.app。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>只看瀏覽器最上面那條真正的網址列，不要看網頁裡自己畫出來的假網址列。要登入或付款，關掉連結，自己重新打一次官網或用原本的 APP 進去。特別小心假的「我不是機器人」驗證頁——正常的驗證從不要你留 Email 或個資。</p>
              <p className="mt-2 text-[0.82rem] text-faint">這不是有罪推定：絕大多數這種網址只是某個人的作品集。而且詐騙集團一樣買得起自己的網域，所以「有自己的網域」也不代表安全。這一段只是把注意力的門檻提高。</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="forever">
            <AccordionTrigger>以為存起來的連結會一直都在</AccordionTrigger>
            <AccordionContent>
              <p>預設網址是平台借你的，平台可以改規則，也可以整個收掉。這件事這兩年發生了好幾次。</p>
              <p className="mt-2"><b className="text-warn">後果：</b>Replit 免費方案發的連結 30 天後自動下線；Netlify 免費層點數扣完，所有網站當場一起暫停；Glitch 的網站託管 2025 年 7 月整個關閉，連付費的一起收掉。上個月打得開、這個月變空白，不是壞掉，是到期了。</p>
              <p className="mt-2"><b className="text-ok">正確做法：</b>任何你希望明年還在的東西，網址要是自己的。要把連結交出去（印在文宣上、寄給客戶、貼進報告）之前，先確認它掛在誰的名下。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ============ 小測驗 ============ */}
      <section id="quiz" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><MessageCircleQuestionMark className="size-7 text-primary" strokeWidth={1.6} /></span>三題小測驗</SectionHead>
        <Decide q={["玩法", "三個情境，選你會怎麼做"]} a={["提示", "答案全在上面三條規則裡"]} />

        <div className="mt-5 grid gap-2.5">
          {QUIZ.map((qz, qi) => {
            const sel = picked[qi]
            const chosen = sel === null || sel === undefined ? undefined : qz.options[sel]
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
                      <b className={chosen.ok ? "text-ok" : "text-warn"}>{chosen.ok ? "答對了" : "再想一下"}</b>
                      <span className="block text-muted-foreground">{chosen.why}</span>
                    </span>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* ============ 交叉連結 ============ */}
      <section className="pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-[1.5px] border-dashed border-input bg-card px-5 py-4 shadow-sm">
          <p className="text-[0.9rem] text-muted-foreground">收到一串沒見過的網址，想知道它是哪一家、免不免費，翻對照表。</p>
          <Button asChild variant="outline"><Link to="/guides/suffixes" className="no-underline">去查後綴 →</Link></Button>
        </div>
      </section>

      {/* ============ 收尾 ============ */}
      <section className="pt-14">
        <p className="mx-auto max-w-[30ch] text-center font-serif text-[1.35rem] font-extrabold leading-relaxed tracking-wide">
          借來的門牌很好用。等到有第三個人會憑它記住你，就該去買自己的那一塊。
        </p>
      </section>

      {/* ============ 查證來源 ============ */}
      <section className="pt-14">
        <div className="rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-4 text-[0.78rem] text-muted-foreground">
          <b className="text-foreground">這堂課的說法出自哪裡</b>（2026-09-01 查證，數字會浮動，以官方頁當天為準）：
          <ul className="mt-2 space-y-1">
            {SOURCES.map((s) => (
              <li key={s.href}>
                {s.what}——
                <a href={s.href} target="_blank" rel="noreferrer noopener" className="font-mono text-draft hover:text-primary">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Pager prev={["/guides/cache", "改了怎麼沒變"]} next={["/guides/dns", "地圖還沒更新"]} />
    </main>
  )
}
