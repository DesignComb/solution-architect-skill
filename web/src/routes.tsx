import type { ComponentType } from "react"
import Home from "@/pages/home"
import Build from "@/pages/build"
import AppQ from "@/pages/app-q"
import Stack from "@/pages/stack"
import Look from "@/pages/look"
import Cost from "@/pages/cost"
import Mindset from "@/pages/mindset"
import Shelf from "@/pages/shelf"
import Plan from "@/pages/plan"
import GuideHowItWorks from "@/pages/guide-how-it-works"
import GuideAiCollab from "@/pages/guide-ai-collab"
import GuideSecurity from "@/pages/guide-security"
import GuideKeys from "@/pages/guide-keys"
import GuideRls from "@/pages/guide-rls"
import GuideMigrations from "@/pages/guide-migrations"
import GuideLogin from "@/pages/guide-login"
import GuideOauth from "@/pages/guide-oauth"
import GuideWebhooks from "@/pages/guide-webhooks"
import GuideStaging from "@/pages/guide-staging"
import GuideCache from "@/pages/guide-cache"
import GuideDomains from "@/pages/guide-domains"
import GuideDns from "@/pages/guide-dns"
import GuideTraffic from "@/pages/guide-traffic"
import GuideMemory from "@/pages/guide-memory"
import GuideToolbox from "@/pages/guide-toolbox"
import GuideIntegrations from "@/pages/guide-integrations"
import GuideStyle from "@/pages/guide-style"
import GuidePayments from "@/pages/guide-payments"
import GuideAppStore from "@/pages/guide-app-store"
import GuideLaunch from "@/pages/guide-launch"
import GuideSell from "@/pages/guide-sell"
import GuideServices from "@/pages/guide-services"
import GuideRecipes from "@/pages/guide-recipes"
import GuidePrompts from "@/pages/guide-prompts"
import GuideGlossary from "@/pages/guide-glossary"
import GuideSuffixes from "@/pages/guide-suffixes"

export const SITE_NAME = "解決方案架構師"
export const SITE_TAGLINE = "先想清楚，再動手做"

export type RouteDef = {
  path: string
  Component: ComponentType
  /** 分頁名稱，會組成 <title>；首頁用站名本身 */
  name: string
  /** <meta name="description">，一句話講完這頁在回答什麼 */
  description: string
}

/*
 * 全站路由的單一資料來源：<Routes> 由它產生，SSG 預先產生 HTML 也照它跑，
 * 每一頁的 <title> 與 description 都在這裡改。新增頁面只要加一列。
 */
export const ROUTES: RouteDef[] = [
  {
    path: "/", Component: Home, name: SITE_NAME,
    description: "動手做任何網站、系統或 APP 之前，先回答五個問題：要寫程式嗎、要 APP 嗎、用什麼做、長什麼樣子、花多少錢。每一題都有推薦答案。",
  },
  {
    path: "/build", Component: Build, name: "要寫程式嗎？",
    description: "先找現成的工具，真的不夠用再自己做。這一頁幫你判斷該不該寫程式，以及什麼時候該換自己做。",
  },
  {
    path: "/app", Component: AppQ, name: "要 APP 嗎？",
    description: "多數情況你需要的是網站，不是 APP。勾選你要的能力，看哪一種真的做得到、要付多少代價。",
  },
  {
    path: "/stack", Component: Stack, name: "用什麼做？",
    description: "前端、後端、資料庫怎麼選。一套預設組合，加上什麼時候該換掉其中一塊。",
  },
  {
    path: "/look", Component: Look, name: "長什麼樣子？",
    description: "三套風格選一套：俐落、雜誌、溫暖。挑好就能整段交給 AI 照著做。",
  },
  {
    path: "/cost", Component: Cost, name: "花多少錢？",
    description: "挑一個像你的情境再自己勾，當場算出每個月要付多少、哪一筆是固定月費。",
  },
  {
    path: "/mindset", Component: Mindset, name: "心法",
    description: "預設反對過度設計。這一頁講清楚我們憑什麼給你這些建議，以及什麼情況下該推翻它。",
  },
  {
    path: "/shelf", Component: Shelf, name: "書架",
    description: "二十七本指南分五排：先看懂、小教室、做出來、開門做生意、隨手查。不用讀完，要用的時候翻。",
  },
  {
    path: "/plan", Component: Plan, name: "開始規劃",
    description: "花 3 分鐘填完表單，產出一份需求單 Markdown，貼給任何 AI 就能開工。",
  },

  /* 先看懂 */
  {
    path: "/guides/how-it-works", Component: GuideHowItWorks, name: "軟體怎麼運作",
    description: "前端、後端、資料庫各在做什麼，用一間店講給你聽。看懂你要買的東西，才不會被唬。",
  },
  {
    path: "/guides/ai", Component: GuideAiCollab, name: "跟 AI 一起做",
    description: "你不用會寫程式，但要會交辦事情、會驗收。這一頁講怎麼跟 AI 開工。",
  },
  {
    path: "/guides/security", Component: GuideSecurity, name: "資安基本功",
    description: "你的對手不是電影裡的天才駭客，是不挑對象的自動掃描機器人。先把基本的做好。",
  },

  /* 小教室 */
  {
    path: "/guides/keys", Component: GuideKeys, name: "兩把鑰匙",
    description: "公開金鑰與秘密金鑰的差別：一把可以給大家看，一把絕對不能。放錯地方會出什麼事。",
  },
  {
    path: "/guides/rls", Component: GuideRls, name: "倉庫的門禁",
    description: "公開金鑰敢公開，靠的全是資料庫這一層門禁規則。沒設好等於倉庫沒鎖。",
  },
  {
    path: "/guides/migrations", Component: GuideMigrations, name: "倉庫的施工紀錄",
    description: "倉庫改架子可以，但每一次都要留單。資料庫結構改動為什麼要有編號、能重演也能退回。",
  },
  {
    path: "/guides/login", Component: GuideLogin, name: "登入之後",
    description: "系統怎麼記得你是誰，為什麼有一天會突然要你重新登入。通行證的有效期是怎麼回事。",
  },
  {
    path: "/guides/oauth", Component: GuideOauth, name: "借別人的櫃台",
    description: "「用 Google 登入」是把驗身分交給別家櫃台，網站連你的密碼都碰不到。",
  },
  {
    path: "/guides/webhooks", Component: GuideWebhooks, name: "誰在敲門",
    description: "付款成功是誰通知你的，怎麼確認那一聲不是假冒的。沒驗簽等於誰來敲門都開。",
  },
  {
    path: "/guides/staging", Component: GuideStaging, name: "樣品屋與真店面",
    description: "AI 給你看的樣本，不等於客人用得到的東西。本機、預覽、正式三個環境差在哪。",
  },
  {
    path: "/guides/cache", Component: GuideCache, name: "改了怎麼沒變",
    description: "不是沒改到，是你還在看影本。快取為什麼存在、什麼時候該清、清了還沒變怎麼辦。",
  },
  {
    path: "/guides/domains", Component: GuideDomains, name: "網址是誰給的",
    description: "平台先借你一個門牌（xxx.netlify.app 這種），什麼時候夠用、什麼時候該換成自己的網域。額度夠用不等於可以商用。",
  },
  {
    path: "/guides/dns", Component: GuideDns, name: "地圖還沒更新",
    description: "剛綁的網址連不上，多半不是壞了，是各家地圖還沒更新你的新店址。改完一次就放著等。",
  },
  {
    path: "/guides/traffic", Component: GuideTraffic, name: "網站塞車的時候",
    description: "紅了不一定會倒，但要知道錢會從哪裡開始流。用量額度撞牆時會發生什麼事。",
  },
  {
    path: "/guides/memory", Component: GuideMemory, name: "AI 為什麼會忘記",
    description: "不是它壞了，是工作桌滿了。AI 一次能記住多少、忘記的時候你該怎麼補。",
  },

  /* 做出來 */
  {
    path: "/guides/toolbox", Component: GuideToolbox, name: "工具與 skill 索引",
    description: "不用自己做的都在這裡：AI 能代勞什麼、現成的 skill 與 SDK 去哪找。",
  },
  {
    path: "/guides/integrations", Component: GuideIntegrations, name: "串接指南",
    description: "三個最常見的串接問題：Google 試算表、表單，還有 AI。讓兩個服務互相講話。",
  },
  {
    path: "/guides/style", Component: GuideStyle, name: "風格細節",
    description: "三套風格的完整規格，整段複製給 AI 就能動工。把「長什麼樣子」變成照著做的規格。",
  },

  /* 開門做生意 */
  {
    path: "/guides/payments", Component: GuidePayments, name: "金流指南",
    description: "收台灣的錢用綠界或藍新，收海外的錢走哪條路。電子發票與稅務的紅線一起講。",
  },
  {
    path: "/guides/app-store", Component: GuideAppStore, name: "APP 上架",
    description: "確定要做 APP 之後，把要花的錢、要等的時間、會踩的審查地雷一次攤開。",
  },
  {
    path: "/guides/launch", Component: GuideLaunch, name: "上線與維護",
    description: "「可以上線」不是感覺，是一張全勾的清單。上線之後照週、月、季的節奏保養。",
  },
  {
    path: "/guides/sell", Component: GuideSell, name: "賣出去",
    description: "做出來只是一半。先算成本再定價，再用台灣的通路找到客人。",
  },

  /* 隨手查 */
  {
    path: "/guides/services", Component: GuideServices, name: "服務價目總表",
    description: "四十多項服務收不收錢、免費額度到哪裡、什麼時候開始收，一頁查完。每一項都附官方頁。",
  },
  {
    path: "/guides/recipes", Component: GuideRecipes, name: "情境配方",
    description: "十二個常見情境，先找像你的那一個，答案和第一步通常已經寫好了。",
  },
  {
    path: "/guides/prompts", Component: GuidePrompts, name: "指令範本",
    description: "跟 AI 開工不用想台詞，十四條可直接複製的指令範本，照四個階段分好。",
  },
  {
    path: "/guides/glossary", Component: GuideGlossary, name: "名詞小抄",
    description: "聽到聽不懂的詞，回來查一下就好。技術名詞的白話對照表，比喻用開一間店貫穿。",
  },
  {
    path: "/guides/suffixes", Component: GuideSuffixes, name: "網址後綴對照表",
    description: "看到一串沒見過的網址，查它是哪一家、免不免費、能不能商用。六十七條後綴，每一列都附官方頁。",
  },
]

/** 首頁用「站名 — 標語」，其餘用「分頁名 — 站名」 */
export function pageTitle(route: RouteDef | undefined): string {
  if (!route || route.path === "/") return `${SITE_NAME} — ${SITE_TAGLINE}`
  return `${route.name} — ${SITE_NAME}`
}

export function findRoute(pathname: string): RouteDef | undefined {
  const clean = pathname.replace(/\/+$/, "") || "/"
  return ROUTES.find((r) => r.path === clean)
}
