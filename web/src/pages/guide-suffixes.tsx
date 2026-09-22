import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { Link2, Search, Table2, Eye, FlaskConical, Archive, Scale, ChevronDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHead, Decide, Pager } from "@/components/site"
import { cn } from "@/lib/utils"

const CATS = [
  "全部", "前端部署", "後端託管", "AI 建站", "內容與文件", "開店平台", "表單與短網址", "臨時分享",
] as const
type Cat = Exclude<(typeof CATS)[number], "全部">

type Row = {
  suffix: string
  platform: string
  cat: Cat
  free: string
  freeOk?: boolean
  tell: string
  quota?: string
  biz?: string
  domain?: string
  /** 官方定價或說明頁。數字會浮動，這條連結才是最終依據；用 npm run links 定期檢查。 */
  official: string
}

/*
 * 2026-09-01 逐項查官方定價與說明頁整理。
 * 額度與價格會浮動，所以這裡只寫「方向與陷阱」，實際數字一律以 official 那條官方連結當天的內容為準。
 * 新增或修改：一併補 official，然後跑 npm run links 確認連結還活著。
 */
const ROWS: Row[] = [
  /* ---------- 前端部署 ---------- */
  {
    suffix: "*.vercel.app", platform: "Vercel", cat: "前端部署",
    free: "有免費層",
    tell: "前端做的網站，作者懂技術，或是 AI 一鍵生的。如果它在賣東西、收款、掛廣告，它已經違反免費條款了。",
    quota: "流量、函式呼叫次數、每天部署次數都有上限，撞到多半要等下個週期才恢復。官方頁自己標更新日期，每次去先看那個日期。",
    biz: "條款禁止。限個人非商業，定義寬到連「請訪客贊助」都算商業。",
    domain: "可以綁好幾十組——但綁了自己的網域也不解禁商用。",
    official: "https://vercel.com/docs/limits/fair-use-guidelines",
  },
  {
    suffix: "*.netlify.app", platform: "Netlify", cat: "前端部署",
    free: "有，2025-09 起改點數制",
    tell: "個人、小團隊或接案做的網站，成本壓在零。它有個很殘忍的特性——額度用完是整站關掉，訪客看到「Site not available」，不是變慢。",
    quota: "每月給一包點數，硬上限、不能加購、不累積。部署、流量、網頁請求都從同一包扣，點數歸零所有網站一起暫停。預覽部署、失敗建置、回滾、表單收件不扣點。2026-04 調過一次費率，同樣的點數現在撐得比以前短。",
    biz: "可以。官方部落格明講免費層可以放商業專案。",
    domain: "可以，含免費 SSL。",
    official: "https://www.netlify.com/pricing/",
  },
  {
    suffix: "*.github.io", platform: "GitHub Pages", cat: "前端部署",
    free: "免費", freeOk: true,
    tell: "背後有一份公開在 GitHub 上的原始碼，作者多半是工程師或學生，內容偏技術文件、課程共筆、個人履歷。不會是電商。",
    quota: "站台容量與每月流量都有上限，但屬於軟性限制。免費帳號的原始碼倉庫必須公開。",
    biz: "條款禁止。不可經營線上生意、電商、商業 SaaS，也不可處理密碼與信用卡號。",
    domain: "可以，附免費 HTTPS。",
    official: "https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits",
  },
  {
    suffix: "*.pages.dev", platform: "Cloudflare Pages", cat: "前端部署",
    free: "有，最大方的之一", freeOk: true,
    tell: "對方選了一個不會因為爆流量而破產或關站的平台。預期會被大量分享的頁面（工具站、懶人包）放這裡很合理。",
    quota: "靜態檔案的流量與請求，官方定價頁原文寫「免費且不限量」。真正會撞到的是每月建置次數、單站檔案數與單檔大小。動態功能另外吃 Workers 的每日請求額度。",
    biz: "條款沒有明文禁止。",
    domain: "可以，每個專案能綁上百組。",
    official: "https://developers.cloudflare.com/pages/platform/limits/",
  },
  {
    suffix: "*.web.app／*.firebaseapp.com", platform: "Firebase Hosting", cat: "前端部署",
    free: "有，不用給信用卡", freeOk: true,
    tell: "背後接了 Google 的服務，很可能有註冊登入功能，或是某個手機 APP 的配套網頁。這兩個網址是同一個網站的兩個門牌。",
    quota: "儲存空間按月算，但傳輸量是「每天」重算的，這一點最容易誤判。資料庫讀寫和登入人數另外計。免費方案不含雲端函式。",
    biz: "可以。官方寫免費產品用在正式產品、就算數百萬使用者也免費。",
    domain: "可以，自動配 SSL。",
    official: "https://firebase.google.com/pricing",
  },
  {
    suffix: "*.gitlab.io", platform: "GitLab Pages", cat: "前端部署",
    free: "免費", freeOk: true,
    tell: "這個團隊的程式碼放在 GitLab 而不是 GitHub，常見於歐洲專案、重視自架的團隊、把 GitLab 當內部工具的公司。",
    quota: "真正會卡住的不是網站流量，是每個頂層群組每月的建置分鐘數，以及每個專案的儲存上限——儲存爆掉那個專案會被切成唯讀。",
    biz: "條款沒有明文禁止。",
    domain: "可以，一個站能綁上百組。",
    official: "https://docs.gitlab.com/user/gitlab_com/",
  },
  {
    suffix: "*.azurestaticapps.net", platform: "Azure Static Web Apps", cat: "前端部署",
    free: "有 Free 方案",
    tell: "背後是有在用微軟雲端的公司或 .NET 開發者。網址又長又不好看，所以還留著的通常是內部用或測試用。",
    quota: "流量與儲存都有上限，而且超過配額官方原文是「我們將無法繼續提供服務」，也就是直接打不開，不是降速。免費方案沒有服務水準保證。",
    biz: "實務上不行。官方自己定位「興趣與個人用途」，而且沒有服務水準保證。",
    domain: "可以，但每個 App 只能綁少少幾組。",
    official: "https://azure.microsoft.com/en-us/pricing/details/app-service/static/",
  },
  {
    suffix: "*.amplifyapp.com", platform: "AWS Amplify", cat: "前端部署",
    free: "有，但會到期",
    tell: "背後通常是公司不是個人，而且他們其他系統也在 AWS 上。因為新帳號的免費期有時效，這個網址反而常是企業專案的測試環境，不代表對方在省錢。",
    quota: "建置分鐘、儲存、傳輸各有額度，但關鍵是它有「期限」：新開的 AWS 帳號只免費一段時間，到期就轉成用多少付多少。開帳號前先看清楚現行的期限規則。",
    biz: "可以。",
    domain: "可以。",
    official: "https://aws.amazon.com/amplify/pricing/",
  },
  {
    suffix: "*.surge.sh", platform: "Surge", cat: "前端部署",
    free: "免費", freeOk: true,
    tell: "做得很快、很輕的網站，常常是暫時的——展示稿、課堂練習、示範頁。是比較早期的老工具，現在遇到的機率不高。",
    quota: "官方只列三項：無限次發佈、自訂網域、基本 SSL。要用在正經的東西上，先自己開官方頁看現況。",
    biz: "以官方條款為準。",
    domain: "可以。少見的免費就能綁。",
    official: "https://surge.sh/pricing",
  },

  /* ---------- 後端託管 ---------- */
  {
    suffix: "script.google.com/macros/…", platform: "Google Apps Script", cat: "後端託管",
    free: "免費", freeOk: true,
    tell: "有人用 Google 試算表當資料庫做出來的小系統，多半是報名表、抽獎、簽到或 LINE Bot 後端。網址掛著 google.com 看起來很可信，所以詐騙也愛用這個形狀，填個資前先確認是誰發的。結尾 /exec 是給大家用的正式版，/dev 只有有編輯權限的人打得開。",
    quota: "限制是「每人每天」而不是每月，項目很細：單次執行時間、自動排程的總時數、對外抓網頁次數、寄信收件人數各有上限。一般 Gmail 帳號和公司帳號的額度不一樣。",
    biz: "額度綁個人帳號，撐不起對外營業的服務。",
    domain: "不行。",
    official: "https://developers.google.com/apps-script/guides/services/quotas",
  },
  {
    suffix: "*.onrender.com", platform: "Render", cat: "後端託管",
    free: "有，但會睡著",
    tell: "這是全清單最容易被誤會成「網站壞掉」的一個。點進去先轉一分鐘再出現，那是它剛從休眠中開機，第二次就快了。",
    quota: "免費網頁服務閒置一段時間就關機，下次有人來要等它開機。2026-04 大改版，對外流量砍到剩下舊制的一小部分——2025 年以前的教學文數字全部不能用。",
    biz: "官方自己勸別拿免費層跑正式服務。",
    domain: "可以，免費方案就含幾組。",
    official: "https://render.com/docs/free",
  },
  {
    suffix: "*.zeabur.app", platform: "Zeabur（台灣團隊）", cat: "後端託管",
    free: "有，會自動休眠",
    tell: "八成是台灣或華語圈的開發者做的，背後有真正的程式在跑。第一次打開要等幾秒，是它剛被叫醒。",
    quota: "免費方案自動休眠，下一位訪客來才喚醒，會有幾秒冷啟動。日誌保留時間短、無服務水準保證、無資料庫自動備份、不能用平台寄信。",
    biz: "會休眠又不能綁網域，撐不起正式服務。",
    domain: "免費方案不行，要升級。",
    official: "https://zeabur.com/pricing",
  },
  {
    suffix: "亂碼.supabase.co", platform: "Supabase", cat: "後端託管",
    free: "有", freeOk: true,
    tell: "這不是網頁，是某個網站或 APP 存資料的地方。看到它出現在網頁原始碼裡是正常的——公開金鑰本來就設計成可以放在前端。",
    quota: "資料庫容量、檔案空間、對外流量、活躍使用者數各有額度，同時能開的免費專案也有數量上限。最常踩的是「閒置一段時間專案會被暫停」，展示前一天記得先叫醒它。",
    biz: "條款沒有明文禁止。",
    domain: "免費方案不行，要另外加購。",
    official: "https://supabase.com/pricing",
  },
  {
    suffix: "名稱.帳號.workers.dev", platform: "Cloudflare Workers", cat: "後端託管",
    free: "有", freeOk: true,
    tell: "某人寫的一支小程式或一個 API，不見得是完整網站。官方自己說這是給興趣專案用的，看到正式服務掛在這裡，可以合理懷疑對方還在試水溫。",
    quota: "每天算一次的請求數，加上每次執行的運算時間上限。搭配的資料庫、鍵值儲存各有自己的每日讀寫額度。",
    biz: "條款沒有明文禁止，但官方明說這個網址「不適合關乎商務營運」。",
    domain: "可以，自動建 DNS 與憑證。",
    official: "https://developers.cloudflare.com/workers/platform/pricing/",
  },
  {
    suffix: "*.streamlit.app", platform: "Streamlit Community Cloud", cat: "後端託管",
    free: "免費", freeOk: true,
    tell: "某個 Python 資料工具或 AI 展示的免費版。看到「這個 App 睡著了」和一顆喚醒按鈕，按下去就好，不是壞掉。",
    quota: "閒置一段時間就休眠，任何看得到的人都能按鈕喚醒。全部跑在美國且不可設定。記憶體與運算是大家共用的，官方刻意不公布固定數字，會隨負載變動。",
    biz: "條款禁止。官方原文限「個人與非商業用途」，另禁止處理財務、健康、生物特徵資料。",
    domain: "不行。",
    official: "https://docs.streamlit.io/deploy/streamlit-community-cloud",
  },
  {
    suffix: "*.hf.space", platform: "Hugging Face Spaces", cat: "後端託管",
    free: "2026 年已收緊",
    tell: "可以直接在網頁上試玩的 AI 工具。要注意你上傳的照片和文字是送到別人的伺服器處理的。",
    quota: "純靜態的對所有人免費；要建立會跑運算的 Space，個人帳號現在需要付費方案。硬體價目表上標「FREE」指的是那個硬體每小時 0 元，不代表免費帳號開得起來——規則寫在文件的警示框裡，不在定價頁。",
    biz: "沒有針對 Spaces 的非商業條款，但免費開運算 Space 這條路已被關掉。",
    domain: "功能存在，免費帳號能不能用以官方文件為準。",
    official: "https://huggingface.co/docs/hub/en/spaces-overview",
  },
  {
    suffix: "*.up.railway.app", platform: "Railway", cat: "後端託管",
    free: "有，非常小",
    tell: "背後有一支長駐的後端程式。免費額度小到撐不住任何有人在用的服務，所以看到它多半是在試東西。",
    quota: "新帳號有一次性的試用金額與天數，用完之後掉到很小的每月額度、且不累積。大概只夠一個小服務跑幾天。試用過期一段時間後磁碟會被刪除。",
    biz: "可以。",
    domain: "可以。",
    official: "https://railway.com/pricing",
  },
  {
    suffix: "服務-數字.地區.run.app", platform: "Google Cloud Run", cat: "後端託管",
    free: "有永久免費，但要先綁信用卡",
    tell: "背後是有在用 Google 雲端的團隊。這串網址格式固定又難記，通常是給程式呼叫的 API，不是給人看的網頁。",
    quota: "每月給一份永久免費的請求數與運算量。最重要的一件事：超過免費額度不會停機，直接開始扣錢——一定要先設預算警示。",
    biz: "可以。",
    domain: "可以，但設定比別家麻煩。",
    official: "https://cloud.google.com/run/pricing",
  },
  {
    suffix: "*.herokuapp.com", platform: "Heroku", cat: "後端託管",
    free: "不免費",
    tell: "曾經是最多人用的免費後端，2022 年 11 月停掉免費層之後就沒回來過。現在還活著的 herokuapp 網址，背後是有人在付錢的。",
    quota: "最便宜的方案用「執行小時」計算，整個帳號共用，閒置會睡（睡著不吃時數）。當月時數用光，全部服務強制睡到月底。要不休眠得再升一級。",
    biz: "可以。",
    domain: "可以（付費）。",
    official: "https://www.heroku.com/pricing",
  },
  {
    suffix: "*.azurewebsites.net", platform: "Azure App Service", cat: "後端託管",
    free: "有，但嚴到只能測試",
    tell: "微軟雲端上的後端服務，通常是企業或 .NET 團隊的內部系統與測試環境。",
    quota: "免費方案是「每天」給一小段運算時間，而且短時間內用太兇會先被掐住。不能擴充、不能開常駐、沒有服務水準保證。額度同訂閱同區域共用。",
    biz: "實務上不行。",
    domain: "免費方案不行。",
    official: "https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans",
  },
  {
    suffix: "*.pythonanywhere.com", platform: "PythonAnywhere", cat: "後端託管",
    free: "有（Beginner）",
    tell: "有人拿 Python 寫的小工具或爬蟲成果頁，常見於學習階段。免費層對外連網只能連白名單網站，所以串不了大部分第三方服務，不會是正式產品。",
    quota: "1 個網頁應用、每天一小段運算時間、磁碟很小。2026-01 縮過一輪：閒置過期的時間變短、之後開的新帳號少了資料庫與排程工作、最低付費方案也漲了。",
    biz: "白名單連外讓它幾乎串不了第三方服務。",
    domain: "不行。",
    official: "https://www.pythonanywhere.com/pricing/",
  },
  {
    suffix: "*.fly.dev", platform: "Fly.io", cat: "後端託管",
    free: "不免費",
    tell: "背後有人在付錢，而且多半是為了多地區低延遲才選它。2024 年 10 月起就沒有免費層了。",
    quota: "新帳號只剩很短的試用（時數或天數，先到先算）。之後純粹用多少付多少，最小的機器一個月幾塊美金起跳。改制前的舊帳號還留著舊額度。",
    biz: "可以。",
    domain: "可以，前幾張憑證免費。",
    official: "https://fly.io/docs/about/pricing/",
  },
  {
    suffix: "*.deno.dev", platform: "Deno Deploy Classic", cat: "後端託管",
    free: "有，但這個後綴正在消失",
    tell: "看到它就要有心理準備：官方文件寫這一代要關閉，新專案改發 *.deno.net。存起來的舊連結隨時可能失效，用之前先去官方頁確認現況。",
    quota: "新版免費方案有每月請求數、流量、App 數量的額度。舊版關閉的實際時程請看官方文件當天的公告。",
    biz: "條款沒有明文禁止。",
    domain: "可以，免費就有幾組。",
    official: "https://docs.deno.com/deploy/classic/",
  },
  {
    suffix: "*.koyeb.app", platform: "Koyeb", cat: "後端託管",
    free: "新帳號已無免費",
    tell: "2026 年 2 月被 Mistral AI 收購後停止新使用者註冊免費方案。任何教你「去 Koyeb 開個免費不休眠服務」的教學，現在都行不通了。技術文件裡還留著免費服務的說明，那是寫給既有帳號看的。",
    quota: "既有帳號保留原本的免費服務條件。新使用者請直接看定價頁上實際選得到的方案。",
    biz: "沒有非商業條款，門檻在入場的月費。",
    domain: "可以綁。",
    official: "https://www.koyeb.com/pricing",
  },
  {
    suffix: "*.appwrite.network", platform: "Appwrite Cloud", cat: "後端託管",
    free: "有", freeOk: true,
    tell: "Supabase 的開源同類。看到它代表對方偏好可以自架、不被單一廠商綁住的方案。",
    quota: "流量、儲存、函式執行次數、活躍使用者各有額度。比較容易忽略的是「數量」限制：每個帳號只能開一個組織、少數幾個專案，成員也只有一位。閒置滿一段時間會暫停。",
    biz: "條款沒有明文禁止。",
    domain: "有設定文件，免費層的條件以官方頁為準。",
    official: "https://appwrite.io/pricing",
  },
  {
    suffix: "*.web.val.run", platform: "Val Town", cat: "後端託管",
    free: "有", freeOk: true,
    tell: "在瀏覽器裡寫一小段程式就直接變成網址的服務。看到它幾乎一定是實驗性質的小東西。",
    quota: "每天有執行次數上限、單次執行時間上限，紀錄保留幾天。公開的程式數量不限。",
    biz: "以官方條款為準。",
    domain: "不行。官方比較表寫「沒有自訂網域」。",
    official: "https://www.val.town/pricing",
  },
  {
    suffix: "*.pockethost.io", platform: "PocketHost", cat: "後端託管",
    free: "沒有免費方案",
    tell: "PocketBase 的託管服務，每一個實例都要分開付錢，所以看到它代表對方是刻意選了一套輕量後端。",
    quota: "月付、年付、買斷三種價格，每一個實例分開計價，各附一份資料庫容量與檔案儲存。",
    biz: "本來就是付費服務。",
    domain: "可以。",
    official: "https://pockethost.io/pricing",
  },

  /* ---------- AI 建站與 no-code ---------- */
  {
    suffix: "sites.google.com/view/…", platform: "Google 協作平台", cat: "AI 建站",
    free: "免費", freeOk: true,
    tell: "零預算做的，通常是學校課程、社團、公家單位或臨時活動頁。但這裡不能反推「沒換網域＝捨不得付錢」——它免費就能接自己的網域，停在這裡多半是對方沒買網域或懶得設定。",
    quota: "內容計入你的雲端硬碟額度。網路上流傳的容量與頁數是舊版 Classic Sites 的，不適用現在這一版。",
    biz: "它沒有金流，收不了錢。",
    domain: "可以，而且免費。驗證所有權後一兩天內生效，站要設成公開。",
    official: "https://support.google.com/sites/answer/98081",
  },
  {
    suffix: "*.wixsite.com", platform: "Wix", cat: "AI 建站",
    free: "有",
    tell: "完全不寫程式、自己拉出來的站，而且還在免費層——所以它現在沒辦法線上收錢，網址上還頂著 Wix 自己的廣告。",
    quota: "儲存與每月流量都很小，官方只說快超過時會通知。每一頁都掛 Wix 自己的廣告。",
    biz: "實務上不行。官方方案比較表把「線上收款」列為免費版未包含。",
    domain: "不行。",
    official: "https://www.wix.com/plans",
  },
  {
    suffix: "*.notion.site", platform: "Notion Sites", cat: "AI 建站",
    free: "有", freeOk: true,
    tell: "這頁是從某人的 Notion 筆記長出來的，版面有很典型的 Notion 味。常見於新創文件站、公開產品說明、活動資訊。",
    quota: "可發佈的頁面數不限，但能認領的 notion.site 網址只有少少幾組。網址代稱只能用英數字與連字號。",
    biz: "條款沒有明文禁止。很多公司拿它當文件站、徵才頁。",
    domain: "要付費方案再另外加購，按網域按月計價。",
    official: "https://www.notion.com/help/notion-sites-availability-and-pricing",
  },
  {
    suffix: "*.my.canva.site", platform: "Canva 網站", cat: "AI 建站",
    free: "有", freeOk: true,
    tell: "這頁其實是一張設計稿變的，通常沒有選單、就是一路往下捲。頁尾那行 Canva 字樣代表對方用的是免費帳號。",
    quota: "免費帳號能發布的網站數有上限。頁尾一定有「Designed with Canva」，免費拿不掉。",
    biz: "條款沒有明文禁止。注意 Canva 素材本身另有授權規則，那是兩回事。",
    domain: "要付費方案。",
    official: "https://www.canva.com/help/publishing-websites-for-free/",
  },
  {
    suffix: "*.wordpress.com", platform: "WordPress.com", cat: "AI 建站",
    free: "有",
    tell: "託管版的免費層。那個站上出現的廣告不是站長放的，是平台放的；而且站長裝不了任何外掛，能做的事比一般人印象中的 WordPress 少很多。",
    quota: "媒體儲存有限，文章與使用者不限，流量統計只看得到最近幾天。站上會被掛平台自己的廣告（你分不到錢），而且不能裝外掛。",
    biz: "可以放商業內容，但免費層靠廣告賺不到錢——不是平台禁止，是免費層裝不了外掛、插不了程式碼。",
    domain: "不行。",
    official: "https://wordpress.com/pricing/",
  },
  {
    suffix: "*.framer.website", platform: "Framer", cat: "AI 建站",
    free: "有",
    tell: "設計感很強、動畫很多的形象站或作品集，作者是設計背景。停在這個網址代表還沒付費，照 Framer 自己的定位也代表這站「應該不是在做生意」。",
    quota: "每月流量很小，內容集合、頁數、單檔大小、編輯人數各有上限，分析資料只留一段時間。",
    biz: "官方定價常見問答自己寫「免費方案適合非商業用途」——語氣是建議不是禁令，但流量額度擺在那，做生意不合適。",
    domain: "不行。",
    official: "https://www.framer.com/pricing/",
  },
  {
    suffix: "*.replit.app（舊 *.repl.co）", platform: "Replit", cat: "AI 建站",
    free: "有（Starter）",
    tell: "在瀏覽器裡直接做出來、順手按發佈的東西，很可能是 AI 生的。免費層發的連結過一段時間會自動下線——上個月打得開、這個月變空白，不是壞掉，是到期了。別把它當長期網址存起來。",
    quota: "免費只能有一個已發布的 App，而且官方明寫這個發布連結過一段時間自動下線（可重新發布）。強制掛「Made with Replit」徽章且帶推薦連結。Replit 改價很頻繁，開工前先看官方頁。",
    biz: "沒有明文禁止，程式碼是你的；但連結會自動下線，當不了正式營業網站。",
    domain: "以官方方案說明為準。",
    official: "https://replit.com/pricing",
  },
  {
    suffix: "*.lovable.app", platform: "Lovable", cat: "AI 建站",
    free: "有",
    tell: "AI 生的站。因為就算升級接了自己的網域這個網址也不會消失，所以「還看得到它當主網址」通常就是還沒付錢。",
    quota: "每天發一些建置點數、每月一些雲端點數，都不滾存。2026-04 起不能再建公開專案。",
    biz: "可以。官方明講 App、資料與 AI 產出都是你的。",
    domain: "要付費。而且官方常見問答說 xxx.lovable.app 這個網址沒辦法移除，接了自己的網域舊網址還在。",
    official: "https://lovable.dev/pricing",
  },
  {
    suffix: "*.bolt.host", platform: "Bolt（StackBlitz）", cat: "AI 建站",
    free: "有", freeOk: true,
    tell: "用 AI 對話生出來的站，作者還沒升級——付費的人第一件事通常就是換網址、拿掉標記。比較舊的 Bolt 作品可能還掛在 netlify.app。",
    quota: "AI 用量每天與每月各有上限、不累積，託管的網頁請求數另計。頁面帶 Bolt 標記。",
    biz: "可以。官方原文：用 Bolt 做的程式碼是你的，可用於任何合法用途，包含商業。",
    domain: "要付費。",
    official: "https://bolt.new/pricing",
  },
  {
    suffix: "*.base44.app", platform: "Base44（Wix 收購）", cat: "AI 建站",
    free: "有",
    tell: "AI 生的內部小系統，不是行銷官網，通常有登入、有資料表。",
    quota: "每月給一小包對話點數與串接點數，App 數量也有上限。點數大概只夠改幾輪。",
    biz: "沒有非商業條款，門檻在點數。",
    domain: "要付費。",
    official: "https://base44.com/pricing",
  },
  {
    suffix: "*.webflow.io", platform: "Webflow", cat: "AI 建站",
    free: "有（Starter）",
    tell: "多半是做到一半、正在給客戶審的稿。真正上線的 Webflow 站幾乎都換成自己的網域了。",
    quota: "免費層的頁數、內容筆數、每月造訪次數都很小。最容易忽略的是表單送出次數是「終身總量」不是每月。",
    biz: "條款沒禁，但頁數與造訪次數撐不起生意。",
    domain: "不行，要付費的 Site 方案。",
    official: "https://webflow.com/pricing",
  },
  {
    suffix: "*.softr.app", platform: "Softr", cat: "AI 建站",
    free: "有", freeOk: true,
    tell: "一個資料表變成的內部系統，常見於客戶入口、會員區。別用網址反推有沒有付錢——Softr 免費就送一組網域，真正的天花板是能登入的人數。",
    quota: "建置者加上使用者合計只有幾個人，這是免費層真正的天花板。App 數量不限，帶 Softr 標記。資料筆數與自動化次數以官方頁為準。",
    biz: "條款沒有明文禁止，但能登入的人數很少。",
    domain: "可以，免費就送一組。",
    official: "https://docs.softr.io/workspace-and-billing/pricing-and-plans",
  },
  {
    suffix: "*.bubbleapps.io", platform: "Bubble", cat: "AI 建站",
    free: "有，但只給你開發用",
    tell: "no-code 做出來的完整應用，不是形象官網。網址裡如果還帶著 /version-test，你看到的是開發版不是正式版。",
    quota: "免費方案只能開發，正式的上線版本要付費才能部署。流量與運算量另計。",
    biz: "沒有明文禁令，問題是免費層根本不能正式上線。",
    domain: "不行。",
    official: "https://bubble.io/pricing",
  },
  {
    suffix: "*.durable.site", platform: "Durable", cat: "AI 建站",
    free: "有", freeOk: true,
    tell: "某個小生意主用 AI 幾分鐘生出來的門面，還在免費試水溫。這種站通常長得很像，因為都是同一套 AI 生的。",
    quota: "免費一個網站加免費子網域，AI 生成的頁數不限；客戶管理人數、每月 AI 圖與對話則數有上限。",
    biz: "條款沒有明文禁止。本來就賣給小生意用。",
    domain: "要付費，但官方寫「每個訂閱都免費附自訂網域」。",
    official: "https://durable.com/pricing",
  },
  {
    suffix: "*.typedream.app", platform: "Typedream", cat: "AI 建站",
    free: "有，小到只能放一頁",
    tell: "個人作品集、簡介頁或社群個人檔案的連結頁，而且大概就只有那一頁。",
    quota: "免費只能發佈一個頁面、一個席次、帶 Typedream 標記。用它收款會抽成，再加金流手續費。",
    biz: "條款沒有明文禁止，代價寫在抽成裡。",
    domain: "要付費。",
    official: "https://typedream.com/pricing",
  },
  {
    suffix: "*.squarespace.com", platform: "Squarespace", cat: "AI 建站",
    free: "沒有免費方案",
    tell: "要嘛還在試用期，要嘛已經付費但還沒接自己的網域。網址是兩個隨機英文單字的，通常是前者。",
    quota: "只有兩週左右的試用，可申請一次延長。試用期間不能真的上線、不能收款、不會被搜尋引擎收錄；到期不付費，內容標記為永久刪除。",
    biz: "付費後當然可以，但沒有「免費商用」這個選項。",
    domain: "要付費。",
    official: "https://www.squarespace.com/pricing",
  },
  {
    suffix: "*.carrd.co", platform: "Carrd", cat: "AI 建站",
    free: "有", freeOk: true,
    tell: "一頁到底的極簡頁面，通常是個人而不是公司。",
    quota: "免費能做少少幾個站、核心功能全開、頁尾有「Made with Carrd」。表單、第三方嵌入、分析工具要付費。",
    biz: "條款沒有明文禁止。",
    domain: "要付費，而且要挑對方案——最便宜的那一階不含自訂網域，付錢前先看清楚。",
    official: "https://carrd.com/",
  },
  {
    suffix: "*.figma.site", platform: "Figma Sites", cat: "AI 建站",
    free: "免費層不能發佈",
    tell: "三個隨機單字的網址代表兩件事——作者是設計師、整個站從設計檔直接長出來；而且他們有在付 Figma 的錢，因為免費帳號根本發佈不了。",
    quota: "免費方案可以設計、可以預覽，發佈是付費方案才有的功能。",
    biz: "能發佈就代表已經付費，商用不是問題。",
    domain: "要完整席次的付費方案。",
    official: "https://www.figma.com/pricing/",
  },

  /* ---------- 內容與文件 ---------- */
  {
    suffix: "*.blogspot.com", platform: "Blogger（Google）", cat: "內容與文件",
    free: "免費", freeOk: true,
    tell: "經營很久的個人部落格，內容偏長文、教學、開箱。以前的 blogspot.tw 已被 Google 統一導回 .com，所以還寫 .tw 的多半是舊連結。",
    quota: "實務上感覺不到容量或流量限制，真正的風險是違反內容政策會被直接下架。",
    biz: "可以，官方有專頁教你放 Google 廣告賺收益。但沒有金流，不能直接結帳。",
    domain: "可以。設幾筆 DNS 紀錄，最多等一天。",
    official: "https://support.google.com/blogger/answer/187141",
  },
  {
    suffix: "*.pixnet.net", platform: "痞客邦（台灣）", cat: "內容與文件",
    free: "免費", freeOk: true,
    tell: "幾乎百分之百是台灣人寫的生活消費類部落格，頁面上會有不少平台自己的廣告。反過來，如果部落客用自己的網域，代表他有另外付錢買那個功能。",
    quota: "容量、流量與各項規則以官方站當天的說明為準——這家的說明頁時有異動，設定前先自己開一次。",
    biz: "可以放業配與聯盟行銷，平台本身也靠廣告營運。",
    domain: "可以，但要另外付費（應用市集裡的付費功能）。",
    official: "https://www.pixnet.net/",
  },
  {
    suffix: "vocus.cc/user/@…", platform: "方格子（台灣）", cat: "內容與文件",
    free: "免費發文，賺到錢才抽成", freeOk: true,
    tell: "台灣人寫的深度長文（理財、心理、產業觀察），作者多半有在經營訂閱或贊助，調性跟痞客邦的開箱文不同。",
    quota: "發文免費。平台服務費按收入類型分級抽成，提領也有免手續費的門檻，而且不同收入類型的門檻各自獨立、不能合併。",
    biz: "可以，它就是設計來讓創作者收錢的。",
    domain: "以官方說明為準。",
    official: "https://vocus.cc/",
  },
  {
    suffix: "hackmd.io/@帳號/…", platform: "HackMD（台灣團隊）", cat: "內容與文件",
    free: "有", freeOk: true,
    tell: "某人公開出來的共筆或講義。網址裡有 @ 是有主人的固定網址；沒有 @、只有一串亂碼的是隨手開的臨時筆記，作者可能隨時改內容或關掉。",
    quota: "筆記數不限，但協作人數、版本紀錄保留數、單張圖片大小、API 次數各有上限。",
    biz: "企業用多半買團隊方案。",
    domain: "不行，官方比較表把自訂網域列在企業方案。",
    official: "https://hackmd.io/pricing",
  },
  {
    suffix: "*.gitbook.io", platform: "GitBook", cat: "內容與文件",
    free: "有（1 位使用者）",
    tell: "某個產品或專案的說明文件站，通常是工程團隊維護的。畫面固定是左目錄、中內文、右小標。",
    quota: "免費可建網站、全文搜尋、版本紀錄、留言。不含自訂網域與子網域、需登入才能看的內容、PDF 匯出。",
    biz: "很多公司的文件站確實從免費版開始。",
    domain: "不行，連自訂子網域都要付費，而且是按網站再按人頭計價。",
    official: "https://www.gitbook.com/pricing",
  },

  /* ---------- 開店平台 ---------- */
  {
    suffix: "*.myshopify.com", platform: "Shopify", cat: "開店平台",
    free: "不免費",
    tell: "這家店用 Shopify，而且還沒把自己的網域接上來——通常是剛開店或老闆懶得設定。看到就知道對方在付月費。",
    quota: "短期免費試用，接著有一段促銷價，然後才是正式月費（分三階，年繳比月繳便宜）。試用期間商店上鎖、不能結帳。",
    biz: "可以（付費）。",
    domain: "可以。但 xxx.myshopify.com 註冊時就決定、之後改不掉。",
    official: "https://www.shopify.com/pricing",
  },
  {
    suffix: "*.shoplineapp.com", platform: "SHOPLINE", cat: "開店平台",
    free: "不免費",
    tell: "用 SHOPLINE 開的網店，還沒接自己的網域，多半是剛開或規模不大。",
    quota: "兩週全功能試用。四個方案都是年繳，另加一次性設定費，以及依營業額計算的維護費。實際金額以官方定價頁為準。",
    biz: "可以（付費）。",
    domain: "可以，但要自己準備網域，方案不附贈。",
    official: "https://shopline.tw/about/pricing",
  },
  {
    suffix: "*.cyberbiz.co", platform: "CYBERBIZ（台灣）", cat: "開店平台",
    free: "不免費",
    tell: "用 CYBERBIZ 開的台灣網店，還沒接自己的網域。",
    quota: "一個月試用。年費分四階，其中企業版另加一次性開辦費。不限商品數與管理帳號數。",
    biz: "可以（付費）。",
    domain: "可以轉址到自己的網域。xxx.cyberbiz.co 註冊後不能改。",
    official: "https://www.cyberbiz.io/pricing/",
  },
  {
    suffix: "*.easy.co", platform: "EasyStore", cat: "開店平台",
    free: "不免費",
    tell: "用 EasyStore 開的網店（台港馬常見），還沒接自己的網域。",
    quota: "兩週全功能試用，金流物流全開。月費分四階，優惠價與原價差不少。所有方案都不抽成交手續費。",
    biz: "可以（付費）。",
    domain: "可以綁。註冊時取的 .easy.co 網址不能改。",
    official: "https://www.easystore.co/zh-tw/pricing",
  },
  {
    suffix: "*.waca.ec", platform: "WACA（台灣）", cat: "開店平台",
    free: "有永久免費", freeOk: true,
    tell: "用 WACA 開的台灣小店，商品應該不多，很可能是個人賣家或剛創業——但它免費就能真的收錢，這在免費方案裡很少見。",
    quota: "免費版有商品上架數上限，但交易筆數不限、可自動接單出貨。兩個地雷：太久沒登入後台帳號會被自動關閉；平台不抽佣金，但刷卡另有金流費。",
    biz: "可以，而且免費層就能收款。",
    domain: "免費方案不行，要升級。",
    official: "https://www.waca.net/pricing/online-store",
  },
  {
    suffix: "*.91app.com", platform: "91APP", cat: "開店平台",
    free: "不免費",
    tell: "這個品牌大概是 91APP 的客戶。但這個子網域規則官方沒有文件，只有第三方評論提到，當「可能」不要當「確定」。",
    quota: "沒有公開定價頁，價格要直接向官方詢問。網路上流傳的年費沒有官方來源可以覆核，我們刻意不轉述。",
    biz: "可以（付費）。",
    domain: "可以，實務上客戶幾乎都用自己的網域。",
    official: "https://91app.com/",
  },

  /* ---------- 表單與短網址 ---------- */
  {
    suffix: "forms.gle/xxxxx", platform: "Google 表單", cat: "表單與短網址",
    free: "免費", freeOk: true,
    tell: "有人要你填一份 Google 表單。因為掛著 Google 看起來可信，詐騙也很愛用，看到問身分證字號、銀行帳號的先懷疑。",
    quota: "你可以自己設「達到指定回覆數之後」自動關閉——但官方提醒一件多數人不知道的事：若多人在完全同一時間送出，表單會忽略上限、全部收下。",
    biz: "不適用。",
    domain: "不行。",
    official: "https://support.google.com/docs/answer/2839588",
  },
  {
    suffix: "lin.ee/xxxxx", platform: "LINE 官方帳號", cat: "表單與短網址",
    free: "連結免費", freeOk: true,
    tell: "有人要你加他的 LINE 官方帳號。從網址完全看不出是哪一家，點進去要看清楚帳號名稱和官方標章再加。",
    quota: "連結本身沒有額度問題；花錢的是官方帳號每月能發的訊息則數。",
    biz: "不適用。",
    domain: "不行。",
    official: "https://tw.linebiz.com/service/account-solutions/line-official-account/",
  },
  {
    suffix: "liff.line.me/{ID}", platform: "LINE LIFF", cat: "表單與短網址",
    free: "建立免費", freeOk: true,
    tell: "某個品牌要你在 LINE 裡打開的頁面，多半是集點、預約、抽獎、會員綁定。它通常拿得到你的 LINE 使用者 ID，不是匿名瀏覽，也是詐騙很愛模仿的形式。",
    quota: "這不是託管，網頁還是得放在別處。舊的 line://app/{ID} 寫法已淘汰，現行格式看官方文件。",
    biz: "不適用。",
    domain: "不適用。能換的是背後那個網頁的網域。",
    official: "https://developers.line.biz/en/docs/liff/overview/",
  },
  {
    suffix: "surveycake.com/s/xxxxx", platform: "SurveyCake（台灣）", cat: "表單與短網址",
    free: "標準版永久免費", freeOk: true,
    tell: "幾乎一定是台灣的單位發的問卷。比起 Google 表單，看到它通常表示發問卷的是有規模的單位。",
    quota: "官方寫得很直白：不會過期、不用信用卡、問卷數與回收份數都不限。要交叉分析、擋重複填答、串分析工具、設截止時間，才需要專業版。",
    biz: "不適用。",
    domain: "以官方方案說明為準。",
    official: "https://www.surveycake.com/plans/basic",
  },
  {
    suffix: "portaly.cc/使用者名稱", platform: "Portaly 傳送門（台灣）", cat: "表單與短網址",
    free: "有，永久免費", freeOk: true,
    tell: "台灣創作者或小店家的總目錄頁，看到通常表示對方有在經營個人品牌，而且有在賣東西。",
    quota: "免費版的區塊與分頁數量有上限，數據只看得到近期。真正的成本在交易抽成，免費版抽得比付費版高。",
    biz: "可以，但免費層抽成較高。升級可降低抽成並綁自己的網域。",
    domain: "不行，要升級。",
    official: "https://portaly.cc/pricing",
  },
  {
    suffix: "pse.is/xxxxx", platform: "PicSee（台灣）", cat: "表單與短網址",
    free: "有，但比外面寫的緊",
    tell: "發連結的人在追蹤有多少人點。真正的目的地要點進去才知道，陌生來源要小心。",
    quota: "縮網址次數不限且永久有效，但自訂尾碼、社群預覽縮圖、點擊統計累計數、目標網址每月可改次數全都有上限，批次縮網址免費版沒有。",
    biz: "條款沒有明文禁止。",
    domain: "免費可綁一組。",
    official: "https://picsee.io/pricing",
  },
  {
    suffix: "lihi2.cc／lihi3.cc", platform: "Lihi 短網址（台灣）", cat: "表單與短網址",
    free: "有", freeOk: true,
    tell: "發連結的人在追蹤點擊，而且可能正在同時測兩個版本。真正的目的地要點進去才知道。",
    quota: "免費有短網址組數與儲存上限，附 A/B 分流測試與自訂參數。點擊數據只保留一段時間。",
    biz: "條款沒有明文禁止。",
    domain: "不行，要升級。",
    official: "https://knowledge.lihi.io/pricing/",
  },

  /* ---------- 臨時分享 ---------- */
  {
    suffix: "*.ngrok-free.app", platform: "ngrok", cat: "臨時分享",
    free: "有，需註冊", freeOk: true,
    tell: "某人電腦上的東西暫時開放給你看。他關掉終端機或關電腦，網址馬上失效。正式的公司服務不會用這種網址。第一次打開會先跳一頁防釣魚警告。",
    quota: "每月流量、請求數、同時開幾個端點都有上限，而且只給一組自動配發的網域、名字不能改。舊帳號還留著 *.ngrok.io。",
    biz: "以官方條款為準。",
    domain: "不行，要付費方案。",
    official: "https://ngrok.com/docs/pricing-limits/free-plan-limits/",
  },
  {
    suffix: "*.trycloudflare.com", platform: "Cloudflare Quick Tunnel", cat: "臨時分享",
    free: "免費，連帳號都不用註冊", freeOk: true,
    tell: "比 ngrok 更短命。每跑一次指令就換一組全新網址，指令一停就死，而且要不回同一個名字。隔天再點通常已經打不開。",
    quota: "同時進行中的請求數有上限，超過直接擋掉。官方明說不保證任何可用性。",
    biz: "不行。官方原文：僅供測試與開發使用。",
    domain: "不行，要改用正式版的 Cloudflare Tunnel。",
    official: "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/",
  },
  {
    suffix: "*.loca.lt", platform: "localtunnel", cat: "臨時分享",
    free: "免費，社群志工維運", freeOk: true,
    tell: "同樣是臨時通道。很多人卡在第一頁的密碼——那個密碼就是分享者那台電腦的對外 IP，他可以自己查到，請他一起附上就不用來回問。",
    quota: "社群志工維運，沒有服務保證也沒有支援窗口，目前維護得比較鬆。舊文件寫的 *.localtunnel.me 已經換成 loca.lt。",
    biz: "不建議：沒有服務保證。",
    domain: "公共伺服器不提供。",
    official: "https://github.com/localtunnel/localtunnel",
  },
  {
    suffix: "名稱-埠號.app.github.dev", platform: "GitHub Codespaces", cat: "臨時分享",
    free: "有免費額度，不是無限",
    tell: "某人在雲端寫程式，順手把畫面轉出來給你看。收到這種連結顯示要登入或打不開，多半不是壞掉，是機器睡了。",
    quota: "每月給一份核心小時數與儲存空間，每個計費週期歸零，閒置一段時間機器自動停機。官方原話：這些額度是給開源貢獻或個人專案用的。",
    biz: "機器閒置就停，當不了商業服務。",
    domain: "不行。官方還提醒轉發用的網域可能不定期更換，程式裡別寫死。",
    official: "https://docs.github.com/en/billing/concepts/product-billing/github-codespaces",
  },
]

const PREVIEW: { shape: string; who: string; mean: string; official?: string }[] = [
  { shape: "專案-git-分支名-帳號.vercel.app", who: "Vercel", mean: "某條開發分支的預覽，會一直指向那條分支的最新版。", official: "https://vercel.com/docs/deployments/generated-urls" },
  { shape: "專案-9碼亂碼-帳號.vercel.app", who: "Vercel", mean: "某一次修改的定格快照，內容不會再變。", official: "https://vercel.com/docs/deployments/generated-urls" },
  { shape: "deploy-preview-42--站名.netlify.app", who: "Netlify", mean: "連續兩個減號是 Netlify 的招牌，正式網址不會有。讀成「站名這個網站的第 42 號修改提案的試看版」。", official: "https://docs.netlify.com/deploy/deploy-types/deploy-previews/" },
  { shape: "staging--站名.netlify.app", who: "Netlify", mean: "某條開發分支的長期預覽，內容會一直更新。", official: "https://docs.netlify.com/deploy/deploy-types/branch-deploys/" },
  { shape: "一長串部署編號--站名.netlify.app", who: "Netlify", mean: "某一次部署的永久存檔，官方原話是「這個網址的內容永遠不會變」，適合留證據。", official: "https://docs.netlify.com/deploy/deploy-types/deploy-previews/" },
  { shape: "8碼亂碼.專案.pages.dev", who: "Cloudflare Pages", mean: "預覽版。用分支名開頭的也是。", official: "https://developers.cloudflare.com/pages/configuration/preview-deployments/" },
  { shape: "網址裡有 /version-test", who: "Bubble", mean: "你看到的是開發版，不是正式版。", official: "https://manual.bubble.io/" },
]

const SOURCE_CLUES = [
  { find: "_next/", mean: "Next.js" },
  { find: "_astro/", mean: "Astro" },
  { find: "_nuxt/", mean: "Nuxt" },
  { find: "_app/immutable/", mean: "SvelteKit" },
  { find: "static/js/main.", mean: "比較舊的 React 專案" },
  { find: "generator", mean: "很多工具直接自報家門，會寫出「Astro v7.2.6」「Jekyll v4.4.1」「WordPress 7.2」這種字樣" },
]

const HEADER_CLUES = [
  { find: "Server: Netlify（配 X-Nf-Request-Id）", mean: "Netlify" },
  { find: "Server: Vercel（配 X-Vercel-Id）", mean: "Vercel" },
  { find: "Server: GitHub.com（配 X-GitHub-Request-Id）", mean: "GitHub Pages" },
  { find: "Server: cloudflare（配 CF-RAY）", mean: "前面掛了 Cloudflare。這條最容易誤判——Cloudflare 也替大量別家網站擋流量，不等於就是 Cloudflare Pages" },
]

const DEAD: { suffix: string; what: string; official?: string }[] = [
  { suffix: "*.netlify.com", what: "Netlify 的舊網址。2020 年改成 .app，2024-05-01 起官方完全停掉轉址，現在點下去直接是 404。看到有人叫你去 .netlify.com，那份資料至少過時兩年以上。", official: "https://answers.netlify.com/t/deprecating-automatic-com-redirects/115442" },
  { suffix: "*.glitch.me", what: "Glitch 的網站託管 2025-07-08 全面關閉，連付費方案都一併收掉並退款。今天點某些 glitch.me 還會動的，那是轉址不是網站復活，而且接下來會陸續失效。還在教你「用 Glitch 免費架站」的文章，整篇可以不用看了。", official: "https://blog.glitch.com/post/changes-are-coming-to-glitch" },
  { suffix: "*.repl.co", what: "Replit 的舊網址，現行是 *.replit.app。", official: "https://replit.com/pricing" },
  { suffix: "*.ngrok.io", what: "官方標為已停用，只有老帳號還能用，現行是 *.ngrok-free.app。", official: "https://ngrok.com/docs/gateway/domains" },
  { suffix: "*.blogspot.tw", what: "Google 已把各國網址統一導回 .com。", official: "https://support.google.com/blogger/answer/187141" },
  { suffix: "*.localtunnel.me", what: "官網範例現在是 loca.lt，只有舊的說明文件還停在這個。", official: "https://github.com/localtunnel/localtunnel" },
  { suffix: "*.deno.dev", what: "還沒死但正在消失。官方文件寫這一代要關閉，新專案只會拿到 *.deno.net。", official: "https://docs.deno.com/deploy/classic/" },
]

const th = "border-b-2 border-input bg-secondary/60 px-4 py-3 text-left font-mono text-[0.68rem] tracking-wider text-muted-foreground"

/* 官方連結：只顯示網域，避免一長串網址把版面撐爛 */
function Official({ href, className }: { href: string; className?: string }) {
  let label = href
  try { label = new URL(href).hostname.replace(/^www\./, "") } catch { /* 保留原字串 */ }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(e) => e.stopPropagation()}
      className={cn("inline-flex items-baseline gap-1 font-mono text-[0.75rem] text-draft hover:text-primary", className)}
    >
      {label}
      <ExternalLink className="size-3 shrink-0 self-center" strokeWidth={2} />
    </a>
  )
}

export default function GuideSuffixes() {
  const [q, setQ] = useState("")
  const [cat, setCat] = useState<(typeof CATS)[number]>("全部")
  const [open, setOpen] = useState<Set<string>>(new Set())

  const kw = q.trim().toLowerCase()
  const filtered = ROWS.filter(
    (r) => (cat === "全部" || r.cat === cat) && (kw === "" || (r.suffix + r.platform + r.tell).toLowerCase().includes(kw))
  )

  function toggle(k: string) {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6">
      <p className="pt-8 font-mono text-[0.72rem] text-muted-foreground">
        <Link to="/" className="text-draft">首頁</Link> › <Link to="/shelf" className="text-draft">書架</Link> › 網址後綴對照表
      </p>

      <header className="pb-1 pt-5">
        <h1 className="reveal d1 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-tight tracking-wide">網址後綴對照表</h1>
        <p className="reveal d2 mt-4 text-lg text-muted-foreground">看到一串沒見過的網址，查它是哪一家、免不免費、能不能當真。</p>
      </header>

      {/* ============ 先講清楚它能回答什麼 ============ */}
      <section id="scope" className="pt-12">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Link2 className="size-7 text-primary" strokeWidth={1.6} /></span>後綴只說明住在哪</SectionHead>
        <Decide q={["看得出", "這個網站放在哪一家平台"]} a={["看不出", "誰做的、用什麼做的"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          同樣是 <b className="font-mono text-foreground">xxx.netlify.app</b>，底下可能是一頁純 HTML、一個正式的商業網站，也可能是 AI 十分鐘生出來的樣品。網址前半段那個名字是對方自己取的，沒有任何人審核。
        </p>
        <p className="mt-3 text-[0.92rem] text-muted-foreground">
          所以這張表能回答的是三件事：<b className="text-foreground">這是哪一家平台、它的免費層大概給到哪裡、看到它可以合理推測什麼</b>。至於「是不是可信的網站」，後綴幫不了你，要看下面那節的判讀線索。
        </p>
        <p className="mt-3 text-[0.78rem] text-faint">同一個後綴底下的兩個網站，彼此沒有任何關係，就像同一棟大樓的兩個房客。</p>
      </section>

      {/* ============ 查表 ============ */}
      <section id="table" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Table2 className="size-7 text-primary" strokeWidth={1.6} /></span>後綴查一查</SectionHead>
        <Decide q={["怎麼查", "貼後綴、打平台名，或點一個分類"]} a={["提醒", "點一下後綴，看額度、條款和官方連結"]} />

        <div className="mt-5 rounded-lg border-[1.5px] border-dashed border-primary/40 bg-primary/8 px-5 py-3.5 text-[0.85rem] text-muted-foreground">
          <b className="text-foreground">這張表怎麼寫的：</b>免費額度一年改好幾次，寫死數字很快就變成錯的。所以我們只寫<b className="text-foreground">方向和陷阱</b>——哪裡會撞牆、哪一條是條款不是額度、哪個坑最多人踩——<b className="text-foreground">實際數字一律點官方連結看當天的</b>。每一列都附了官方頁。
        </div>

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" strokeWidth={1.8} />
          <input
            type="search"
            placeholder="輸入後綴或平台名，例如：netlify、部署、AI"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-input bg-card py-3 pl-11 pr-4 text-[0.95rem] outline-none focus:border-primary"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {CATS.map((c) => {
            const on = c === cat
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setCat(c)}
                className={cn(
                  "cursor-pointer rounded-full border-[1.5px] border-input bg-card px-3.5 py-1.5 text-[0.82rem] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground",
                  on && "border-primary bg-primary/8 text-primary hover:text-primary"
                )}
              >
                {c}
              </button>
            )
          })}
        </div>

        <p className="mt-3 font-mono text-[0.72rem] text-muted-foreground">顯示 {filtered.length} / {ROWS.length} 項</p>

        <Card className="mt-3 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr>
                  <th className={cn(th, "min-w-[210px]")}>後綴</th>
                  <th className={cn(th, "min-w-[130px]")}>平台</th>
                  <th className={cn(th, "min-w-[130px]")}>免費？</th>
                  <th className={cn(th, "min-w-[280px]")}>看到它，可以推測什麼</th>
                  <th className={cn(th, "min-w-[140px]")}>官方頁</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">沒有符合的後綴，換個關鍵字或分類試試。</td>
                  </tr>
                )}
                {filtered.map((r) => {
                  const isOpen = open.has(r.suffix)
                  return (
                    <Fragment key={r.suffix}>
                      <tr className="cursor-pointer hover:bg-secondary/40" onClick={() => toggle(r.suffix)}>
                        <td className="border-b border-border px-4 py-3 align-top">
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={(e) => { e.stopPropagation(); toggle(r.suffix) }}
                            className="flex cursor-pointer items-start gap-1.5 border-0 bg-transparent p-0 text-left font-sans"
                          >
                            <b className="font-mono text-[0.82rem] font-bold">{r.suffix}</b>
                            <ChevronDown className={cn("mt-0.5 size-3.5 shrink-0 text-faint transition-transform", isOpen && "rotate-180")} strokeWidth={2} />
                          </button>
                          {cat === "全部" && <Badge className="mt-1.5">{r.cat}</Badge>}
                        </td>
                        <td className="border-b border-border px-4 py-3 align-top font-semibold">{r.platform}</td>
                        <td className={cn("border-b border-border px-4 py-3 align-top", r.freeOk ? "font-semibold text-ok" : "text-muted-foreground")}>{r.free}</td>
                        <td className="border-b border-border px-4 py-3 align-top text-muted-foreground">{r.tell}</td>
                        <td className="border-b border-border px-4 py-3 align-top"><Official href={r.official} /></td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td colSpan={5} className="border-b border-border bg-secondary/40 px-4 py-3.5 text-[0.82rem] text-muted-foreground">
                            {r.quota && <p><b className="text-foreground">免費額度：</b>{r.quota}</p>}
                            {r.biz && <p className="mt-1.5"><b className="text-foreground">能不能商用：</b>{r.biz}</p>}
                            {r.domain && <p className="mt-1.5"><b className="text-foreground">能不能換成自己的網域：</b>{r.domain}</p>}
                            <p className="mt-2.5"><b className="text-foreground">實際數字以官方頁為準：</b><Official href={r.official} className="ml-1" /></p>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* ============ 正式版還是預覽版 ============ */}
      <section id="preview" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><FlaskConical className="size-7 text-primary" strokeWidth={1.6} /></span>這是正式版還是試看版</SectionHead>
        <Decide q={["看哪裡", "網址中間那一段"]} a={["收到試看版", "內容可能是半成品，別當正式版引用"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">同一個網站會有很多組網址：正式的一組，加上每一次修改各自的試看版。長相是有規則的。</p>

        <Card className="mt-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr>
                  <th className={cn(th, "min-w-[250px]")}>長相</th>
                  <th className={cn(th, "whitespace-nowrap")}>哪一家</th>
                  <th className={th}>意思</th>
                  <th className={cn(th, "min-w-[130px]")}>官方頁</th>
                </tr>
              </thead>
              <tbody>
                {PREVIEW.map((p, i) => {
                  const last = i === PREVIEW.length - 1
                  return (
                    <tr key={p.shape}>
                      <td className={cn("border-border px-4 py-3 align-top font-mono text-[0.8rem] font-bold", !last && "border-b")}>{p.shape}</td>
                      <td className={cn("whitespace-nowrap border-border px-4 py-3 align-top font-semibold", !last && "border-b")}>{p.who}</td>
                      <td className={cn("border-border px-4 py-3 align-top text-muted-foreground", !last && "border-b")}>{p.mean}</td>
                      <td className={cn("border-border px-4 py-3 align-top", !last && "border-b")}>{p.official && <Official href={p.official} />}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="mt-4 text-[0.88rem] text-muted-foreground">
          <b className="text-warn">一個常見誤解：</b>只有 Netlify 的 Deploy Preview 會自動帶上「別讓搜尋引擎收錄」的標頭，分支預覽不會。別以為平台一定幫你擋住。
        </p>
      </section>

      {/* ============ 自己看出來 ============ */}
      <section id="clues" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Eye className="size-7 text-primary" strokeWidth={1.6} /></span>兩招，瀏覽器就做得到</SectionHead>
        <Decide q={["招式", "看原始碼，或看伺服器回應"]} a={["關鍵", "換了網域照樣看得出來"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">
          就算對方已經換成自己的網域，這兩招照樣看得出它跑在哪。實測過：vite.dev 用的是自己的網域，回應裡寫的還是 Netlify。<b className="text-foreground">「換了網域就看不出來」是誤解。</b>
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="border-b-2 border-input bg-secondary/60 px-5 py-3.5">
              <b className="text-[1.02rem]">看原始碼</b>
              <p className="mt-1 text-[0.82rem] text-muted-foreground">在網頁上按 Ctrl+U（Mac 是 Cmd+Option+U），再按 Ctrl+F 搜字。</p>
            </div>
            {SOURCE_CLUES.map((c, i) => (
              <div key={c.find} className={cn("flex items-start gap-3.5 px-5 py-3", i < SOURCE_CLUES.length - 1 && "border-b border-border")}>
                <b className="w-[9.5em] shrink-0 font-mono text-[0.78rem]">{c.find}</b>
                <span className="text-[0.85rem] text-muted-foreground">{c.mean}</span>
              </div>
            ))}
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b-2 border-input bg-secondary/60 px-5 py-3.5">
              <b className="text-[1.02rem]">看伺服器回應</b>
              <p className="mt-1 text-[0.82rem] text-muted-foreground">按 F12 →「網路」分頁 → 重新整理 → 點最上面那一列 → 看右邊的 Response Headers。</p>
            </div>
            {HEADER_CLUES.map((c, i) => (
              <div key={c.find} className={cn("px-5 py-3", i < HEADER_CLUES.length - 1 && "border-b border-border")}>
                <b className="block font-mono text-[0.78rem]">{c.find}</b>
                <span className="mt-1 block text-[0.85rem] text-muted-foreground">{c.mean}</span>
              </div>
            ))}
          </Card>
        </div>

        <p className="mt-4 text-[0.88rem] text-muted-foreground">
          還有一個很會說話的地方：<b className="text-foreground">分頁標題</b>。標題還停在「Create Next App」這種範本預設值，代表根本沒人整理過門面。
        </p>
        <p className="mt-3 text-[0.78rem] text-faint">嫌麻煩就把網址貼到 builtwith.com 這類免費工具，它會列出猜到的平台——方便，但會漏也會猜錯，當參考不要當證據。</p>
      </section>

      {/* ============ 已經死掉的後綴 ============ */}
      <section id="dead" className="pt-14">
        <SectionHead><span className="mr-3 inline-flex align-middle"><Archive className="size-7 text-primary" strokeWidth={1.6} /></span>已經死掉的後綴</SectionHead>
        <Decide q={["用途", "點不開的舊連結，來這裡對一下"]} a={["附帶收穫", "還在教這些的文章，整篇可以不用看"]} />

        <p className="mt-4 text-[0.92rem] text-muted-foreground">這幾個後綴今天點下去多半打不開了。看到教學文章還在用它們，就知道那份資料過期多久。</p>

        <Card className="mt-5 overflow-hidden">
          {DEAD.map((d, i) => (
            <div key={d.suffix} className={cn("flex items-start gap-4 px-5 py-3.5 max-sm:flex-col max-sm:gap-1.5", i < DEAD.length - 1 && "border-b border-border")}>
              <b className="w-[11em] shrink-0 font-mono text-[0.82rem]">{d.suffix}</b>
              <span className="text-[0.86rem] text-muted-foreground">
                {d.what}
                {d.official && <span className="mt-1 block"><Official href={d.official} /></span>}
              </span>
            </div>
          ))}
        </Card>
      </section>

      {/* ============ 交叉連結＋查證說明 ============ */}
      <section className="pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-[1.5px] border-dashed border-input bg-card px-5 py-4 shadow-sm">
          <p className="text-[0.9rem] text-muted-foreground">想知道自己該不該把預設網址換成自己的網域，去「網址是誰給的」那一堂。</p>
          <Button asChild variant="outline"><Link to="/guides/domains" className="no-underline">去上課 →</Link></Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-lg border-[1.5px] border-dashed border-input bg-card px-5 py-4 shadow-sm">
          <p className="text-[0.9rem] text-muted-foreground">要比的是「該挑哪一家平台」而不是「這是哪一家」，翻服務價目總表。</p>
          <Button asChild variant="outline"><Link to="/guides/services" className="no-underline">去查價 →</Link></Button>
        </div>

        <div className="mt-4 rounded-lg border-[1.5px] border-dashed border-input bg-secondary/60 px-5 py-3.5 text-[0.78rem] text-muted-foreground">
          <Scale className="mr-2 inline size-4 align-[-3px] text-draft" strokeWidth={1.6} />
          2026-09-01 逐項對照官方定價與說明頁整理。免費額度這兩年變動極大（Netlify 2025-09 改點數制、Render 2026-04 大砍流量、Hugging Face 2026 年收緊、Koyeb 2026-02 關閉免費註冊），<b className="text-foreground">2025 年以前的教學文數字幾乎都不能用了</b>。所以這裡不寫死數字，只寫方向與陷阱——<b className="text-foreground">要下決定前，點該列的官方連結看當天的內容</b>。
        </div>
      </section>

      <Pager prev={["/guides/glossary", "名詞小抄"]} next={["/plan", "開始規劃"]} />
    </main>
  )
}
