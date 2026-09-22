import type React from "react"
import { Link } from "react-router-dom"
import { Compass, Package, Smartphone, Layers, Palette, Tag, ClipboardList, Coins, FileText, Flag, Banknote, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHead, FlowArrow, QUESTIONS } from "@/components/site"

const QCARDS = [
  { path: "/build", icon: Package, title: "要寫程式嗎？", rec: "先用現成的" },
  { path: "/app", icon: Smartphone, title: "要 APP 嗎？", rec: "網頁就夠" },
  { path: "/stack", icon: Layers, title: "用什麼做？", rec: "有預設組合" },
  { path: "/look", icon: Palette, title: "長什麼樣子？", rec: "三選一" },
  { path: "/cost", icon: Tag, title: "花多少錢？", rec: "約 US$20/月" },
]

const STEPS = [
  { no: "壹", icon: ClipboardList, title: "問出需求", items: [<>這是要幫<b>誰</b>解決<b>什麼事</b>？</>, <>用手機還是用電腦？要不要通知？</>, <>要不要收錢？會有多少人用？</>] },
  { no: "貳", icon: Coins, title: "盤點資源", items: [<>誰來做？有 AI 幫手嗎？</>, <>每個月花多少錢不會心痛？</>, <>壞了誰修？</>] },
  { no: "參", icon: FileText, title: "產出藍圖", items: [<>五個問題的答案，加上為什麼這樣選。</>, <>會花多少錢，以及先<b>不</b>做哪些事。</>, <>打算照什麼節奏上線。</>] },
]

export default function Home() {
  return (
    <main>
      {/* 英雄區 */}
      <header className="relative overflow-hidden pb-6 pt-20">
        <svg className="rose pointer-events-none absolute -left-28 -top-16 size-[380px] text-draft opacity-10" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 7" />
          <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M100 4v24M100 172v24M4 100h24M172 100h24" stroke="currentColor" strokeWidth="1" />
          <path d="M100 60l8 32 32 8-32 8-8 32-8-32-32-8 32-8z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        <div className="stamp max-md:hidden">合理</div>

        <div className="mx-auto max-w-[1080px] px-6">
          <div className="grid grid-cols-[1.25fr_.85fr] items-center gap-12 max-md:grid-cols-1">
            <div>
              <div className="reveal inline-flex items-center gap-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-draft">
                <Compass className="size-4" strokeWidth={1.8} />需求 → 資源 → 架構
              </div>
              <h1 className="reveal d1 mt-4 font-serif text-[clamp(2.6rem,6.5vw,4.4rem)] font-bold leading-[1.14] tracking-wide">
                先想清楚，<br />再<span className="text-primary">動手做</span>。
              </h1>
              <p className="reveal d2 mt-5 max-w-[42ch] text-lg text-muted-foreground">
                動手之前，先把這<b className="text-foreground">五個問題</b>回答清楚，方向就不會偏。
              </p>
              <div className="reveal d3 mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg"><Link to="/plan" className="no-underline">開始規劃 →</Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/build" className="no-underline">從第一題讀起</Link></Button>
              </div>
            </div>

            {/* 三份文件疊圖：發牌進場 → 漂浮 → hover 抬起擺正 */}
            <div className="relative min-h-[300px] max-md:hidden" aria-hidden="true">
              {[
                { tag: "第一份", title: "需求單", desc: "寫下要幫誰解決什麼事、用手機還是電腦，還有要不要收錢。", pos: "top-[6%] left-0", rot: "-4deg", delay: "0.45s", dur: "7s" },
                { tag: "第二份", title: "資源單", desc: "盤點誰來做、有多少預算和時間，還有上線之後誰來顧。", pos: "top-[26%] left-[20%]", rot: "2deg", delay: "0.68s", dur: "8.2s" },
                { tag: "第三份", title: "藍圖", desc: "寫明要怎麼做、長什麼樣子、花多少錢，還有先不做什麼。", pos: "top-[48%] left-[8%]", rot: "-1deg", delay: "0.91s", dur: "6.4s", primary: true },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`sheet-deal absolute w-[min(300px,82%)] ${s.pos}`}
                  style={{ "--rot": s.rot, "--delay": s.delay, "--floatdur": s.dur } as React.CSSProperties}
                >
                  <div className={`sheet-inner rounded-md border-[1.5px] bg-card p-4 shadow-lg ${s.primary ? "border-primary" : "border-input"}`}>
                    <div className={`font-mono text-[0.62rem] tracking-[0.16em] ${s.primary ? "text-primary" : "text-draft"}`}>{s.tag}</div>
                    <h4 className="mt-1 font-serif text-[0.98rem] font-bold">{s.title}</h4>
                    <p className="mt-1 text-[0.76rem] leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 五個問題入口 */}
          <div className="reveal d4 mt-11 grid grid-cols-5 gap-3 max-lg:grid-cols-3 max-sm:grid-cols-2">
            {QCARDS.map((q) => (
              <Link
                key={q.path}
                to={q.path}
                className="group relative rounded-lg border-[1.5px] border-input bg-card p-3.5 no-underline shadow-sm transition-all hover:-translate-y-1 hover:border-primary"
              >
                <q.icon className="absolute right-3 top-3 size-[19px] text-draft transition-all group-hover:-rotate-6 group-hover:scale-110 group-hover:text-primary" strokeWidth={1.6} />
                <b className="block pr-6 text-[1.02rem]">{q.title}</b>
                <em className="mt-1.5 block text-[0.72rem] not-italic text-muted-foreground">
                  <span className="font-mono text-[0.58rem] tracking-wider text-ok">推薦 </span>{q.rec}
                </em>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* 方法 */}
      <section className="mx-auto max-w-[1080px] px-6 pt-20">
        <SectionHead>順序：需求 → 資源 → 架構</SectionHead>
        <div className="mt-8 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch max-md:grid-cols-1">
          {STEPS.map((s, i) => (
            <div key={s.no} className="contents">
              {i > 0 && (
                <div className="flex items-center px-2 text-draft max-md:mx-auto max-md:rotate-90 max-md:py-1">
                  <svg width="30" height="12" viewBox="0 0 30 12">
                    <line x1="1" y1="6" x2="22" y2="6" stroke="currentColor" strokeWidth="1.8" className="march" />
                    <path d="M20 1.5L27 6l-7 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              <div className="relative rounded-lg border-[1.5px] border-input bg-card p-5 shadow-md">
                <div className="absolute right-4 top-3 font-serif text-4xl font-extrabold text-primary opacity-20">{s.no}</div>
                <h3 className="flex items-center gap-2.5 font-serif text-[1.38rem] font-bold">
                  <s.icon className="size-5 text-draft" strokeWidth={1.6} />{s.title}
                </h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-[0.86rem] text-muted-foreground [&_b]:text-foreground">
                  {s.items.map((it, j) => <li key={j}>{it}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 開始：兩條路 */}
      <section className="mx-auto max-w-[1080px] px-6 pt-20">
        <SectionHead>開始</SectionHead>
        <div className="mt-6 grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <Link
            to="/plan"
            className="group flex flex-col items-start gap-1.5 rounded-xl border-2 border-primary bg-card p-6 no-underline shadow-md transition-all hover:-translate-y-1"
          >
            <ClipboardList className="mb-1 size-8 text-primary" strokeWidth={1.6} />
            <b className="font-serif text-[1.35rem] font-extrabold">填表單</b>
            <p className="text-[0.88rem] text-muted-foreground">花 3 分鐘填完，產出一份需求單，貼給任何 AI 就能開工。</p>
            <span className="mt-3.5 rounded-lg bg-primary px-5 py-2.5 text-[0.92rem] font-semibold text-primary-foreground transition-all group-hover:brightness-105">
              開始規劃 →
            </span>
          </Link>
          <div className="flex flex-col items-start gap-1.5 rounded-xl border-2 border-input bg-card p-6 shadow-md">
            <Terminal className="mb-1 size-8 text-primary" strokeWidth={1.6} />
            <b className="font-serif text-[1.35rem] font-extrabold">讓 AI 訪談你</b>
            <p className="text-[0.88rem] text-muted-foreground">AI 用選擇題問完你的需求，寫好藍圖就直接開工。在 Claude Code 輸入：</p>
            <code className="mt-3.5 rounded-lg border-[1.5px] border-dashed border-primary/40 bg-primary/8 px-4 py-2.5 font-mono text-[0.95rem] text-primary">
              /architect
            </code>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {[
            { to: "/mindset", icon: Flag, title: "心法", desc: "談上線的節奏、八個觀念，和六條不能踩的紅線。" },
            { to: "/shelf", icon: Banknote, title: "書架", desc: "二十五本指南，教學也能查資料。" },
          ].map((c) => (
            <Link key={c.to} to={c.to} className="group relative rounded-lg border-[1.5px] border-input bg-card p-4.5 no-underline shadow-sm transition-all hover:-translate-y-1 hover:border-primary">
              <c.icon className="size-[22px] text-draft group-hover:text-primary" strokeWidth={1.6} />
              <b className="mt-2 block text-[1.1rem]">{c.title}</b>
              <p className="mt-1 text-[0.78rem] text-muted-foreground">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
