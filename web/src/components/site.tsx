import { Link, NavLink, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { Compass, ChevronDown, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export const QUESTIONS = [
  { path: "/build", label: "要寫程式嗎" },
  { path: "/app", label: "要 APP 嗎" },
  { path: "/stack", label: "用什麼做" },
  { path: "/look", label: "長什麼樣子" },
  { path: "/cost", label: "花多少錢" },
]

function navCls(active: boolean) {
  return cn(
    "px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap",
    active && "text-foreground shadow-[inset_0_-2px_0_var(--primary)]"
  )
}

export function SiteHeader() {
  const { pathname } = useLocation()
  const qActive = QUESTIONS.some((q) => q.path === pathname)
  function toggleTheme() {
    const el = document.documentElement
    const next = !el.classList.contains("dark")
    el.classList.toggle("dark", next)
    try { localStorage.setItem("sa-theme", next ? "dark" : "light") } catch {}
  }

  return (
    <div className="sticky top-0 z-50 border-b-[1.5px] border-input bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-[1080px] flex-wrap items-center gap-2 px-6 max-md:h-auto max-md:py-2">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <Compass className="size-5 text-primary" strokeWidth={1.8} />
          <b className="font-serif tracking-wider">解決方案架構師</b>
        </Link>

        <nav className="ml-6 flex items-center gap-0.5 max-md:order-3 max-md:ml-0 max-md:w-full max-md:overflow-x-auto max-md:pb-1">
          {/* 桌機：下拉；手機：攤平 */}
          <div className="max-md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(navCls(qActive), "inline-flex items-center gap-1 outline-none cursor-pointer bg-transparent border-0 font-sans text-sm")}>
                五個問題 <ChevronDown className="size-3.5 text-faint" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {QUESTIONS.map((q, i) => (
                  <DropdownMenuItem key={q.path} asChild>
                    <Link to={q.path} className={cn("no-underline", pathname === q.path && "bg-primary/10 text-primary")}>
                      <i className="w-3.5 font-serif text-[0.8rem] font-extrabold not-italic text-primary">{i + 1}</i>
                      {q.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden max-md:flex max-md:gap-0.5">
            {QUESTIONS.map((q) => (
              <NavLink key={q.path} to={q.path} className={({ isActive }) => navCls(isActive)}>
                {q.label}
              </NavLink>
            ))}
          </div>
          <NavLink to="/mindset" className={({ isActive }) => navCls(isActive)}>心法</NavLink>
          <NavLink to="/shelf" className={({ isActive }) => cn(navCls(isActive), pathname.startsWith("/guides") && "text-foreground shadow-[inset_0_-2px_0_var(--primary)]")}>書架</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <Button asChild size="sm">
            <Link to="/plan" className="no-underline">開始規劃</Link>
          </Button>
          <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="切換亮暗色">
            <Moon className="size-4 dark:hidden" />
            <Sun className="hidden size-4 dark:block" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-[1.5px] border-input">
      <div className="mx-auto flex max-w-[1080px] items-center gap-2.5 px-6 pb-11 pt-6 text-[0.78rem] text-faint">
        <Compass className="size-4 text-primary" strokeWidth={1.8} />
        <b className="font-medium text-muted-foreground">解決方案架構師</b>
      </div>
    </footer>
  )
}

export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

/* 章節標題（底線分隔） */
export function SectionHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-b-2 border-foreground pb-3", className)}>
      <h2 className="font-serif text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold tracking-wide">{children}</h2>
    </div>
  )
}

/* 決定條：q=前提 a=推薦 */
export function Decide({ q, a }: { q: [string, string]; a: [string, string] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2.5">
      <span className="inline-flex items-baseline gap-2 rounded-lg border-[1.5px] border-input bg-card px-3.5 py-2 text-[0.86rem] font-semibold">
        <span className="font-mono text-[0.6rem] tracking-widest text-muted-foreground">{q[0]}</span>{q[1]}
      </span>
      <span className="inline-flex items-baseline gap-2 rounded-lg border-[1.5px] border-primary/40 bg-primary/8 px-3.5 py-2 text-[0.86rem] font-semibold">
        <span className="font-mono text-[0.6rem] tracking-widest text-primary">{a[0]}</span>{a[1]}
      </span>
    </div>
  )
}

/* 五題進度圓點 */
export function QSteps({ current }: { current: number }) {
  return (
    <div className="mb-4 flex items-center">
      {QUESTIONS.map((q, i) => (
        <span key={q.path} className="flex items-center">
          {i > 0 && <i className="w-[22px] border-t-[1.5px] border-dashed border-input" />}
          <Link
            to={q.path}
            title={q.label}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-full border-[1.5px] border-input bg-card font-serif text-[0.88rem] font-extrabold text-faint no-underline transition-colors hover:border-draft hover:text-draft",
              i + 1 < current && "border-primary/50 text-primary",
              i + 1 === current && "border-primary bg-primary text-primary-foreground hover:border-primary hover:text-primary-foreground"
            )}
          >
            {i + 1}
          </Link>
        </span>
      ))}
    </div>
  )
}

/* 上一頁／下一頁 */
export function Pager({ prev, next }: { prev?: [string, string]; next?: [string, string] }) {
  return (
    <div className="mt-14 flex justify-between gap-3">
      {prev ? (
        <Button asChild variant="outline"><Link to={prev[0]} className="no-underline">← {prev[1]}</Link></Button>
      ) : <span />}
      {next ? (
        <Button asChild variant="outline"><Link to={next[0]} className="no-underline">{next[1]} →</Link></Button>
      ) : <span />}
    </div>
  )
}

/* 流程圖箭頭（行進虛線） */
export function FlowArrow() {
  return (
    <span className="flex text-draft">
      <svg width="26" height="12" viewBox="0 0 26 12">
        <line x1="1" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.8" className="march" />
        <path d="M16 1.5L23 6l-7 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function FlowNode({ children, ask }: { children: React.ReactNode; ask?: boolean }) {
  return (
    <span className={cn(
      "rounded-lg border-[1.5px] border-input bg-card px-3.5 py-2 text-[0.88rem] font-semibold shadow-sm",
      ask && "border-dashed border-draft text-draft"
    )}>
      {children}
    </span>
  )
}

/* 風格試衣間迷你畫面（固定配色展示物） */
export function MiniUI({ kind }: { kind: "clean" | "editorial" | "warm" }) {
  const bar = { clean: "收費管理", editorial: "收費月報", warm: "我們社區" }[kind]
  const head = { clean: "本月待收", editorial: "本月待收兩戶", warm: "這個月的管理費 💰" }[kind]
  const btn = kind === "editorial" ? "新增住戶" : "＋ 新增住戶"
  return (
    <span className={cn("miniui shadow-sm", `sty-${kind}`)} aria-hidden="true">
      <span className="mu-bar">{bar}</span>
      <span className="mu-body">
        <span className="mu-h">{head}</span>
        <span className="mu-row"><span>A 棟 12 樓</span><i>已收</i></span>
        <span className="mu-row"><span>B 棟 3 樓</span><i className="warn">未收</i></span>
        <span className="mu-btn">{btn}</span>
      </span>
    </span>
  )
}
