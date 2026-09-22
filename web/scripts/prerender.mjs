#!/usr/bin/env node
/**
 * SSG：把每一條路由預先畫成一個 HTML 檔。
 *
 *   npm run build:ssg
 *   SITE_URL=https://your-domain.tw npm run build:ssg
 *
 * 產出（../dist）：
 *   index.html                        →  /
 *   guides/domains/index.html         →  /guides/domains
 *   404.html                          →  靜態主機找不到頁面時用
 *   sitemap.xml、robots.txt           →  有設 SITE_URL 才產
 *
 * 每一頁的 <title>、description、canonical、OG 標籤都來自 src/routes.tsx，
 * 內容是 renderToString 畫出來的真 HTML——爬蟲不用跑 JS 就看得到全文。
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { build } from "vite"

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const OUT = path.resolve(WEB, "../dist")
const SERVER_OUT = path.resolve(WEB, "node_modules/.ssg")
const SITE_URL = (process.env.SITE_URL || "").replace(/\/$/, "")

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/* ---------- 一、建置：先出瀏覽器用的資源，再出伺服器端畫圖用的 bundle ---------- */

console.log("→ 建置瀏覽器資源…")
await build({ configFile: path.join(WEB, "vite.ssg.config.ts"), logLevel: "warn" })

console.log("→ 建置伺服器端畫圖用的 bundle…")
await build({
  configFile: path.join(WEB, "vite.ssg.config.ts"),
  logLevel: "warn",
  build: {
    ssr: path.join(WEB, "src/entry-server.tsx"),
    outDir: SERVER_OUT,
    emptyOutDir: true,
    // 伺服器端只是拿來產字串，不需要壓縮
    minify: false,
  },
})

const { render, ROUTES, pageTitle } = await import(
  pathToFileURL(path.join(SERVER_OUT, "entry-server.js")).href
)

/* ---------- 二、把每一條路由畫成 HTML ---------- */

const template = fs.readFileSync(path.join(OUT, "index.html"), "utf8")

if (!template.includes('<div id="root"></div>')) {
  console.error("找不到 <div id=\"root\"></div>，樣板結構變了，prerender 要跟著改。")
  process.exit(1)
}

function head(route) {
  const title = pageTitle(route)
  const tags = [
    `<meta name="description" content="${esc(route.description)}" />`,
    // canonical 用相對路徑是合法的，爬蟲會自己接上網域
    `<link rel="canonical" href="${esc(SITE_URL ? SITE_URL + route.path : route.path)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="zh_TW" />`,
    `<meta property="og:site_name" content="解決方案架構師" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    // og:url 規範上一定要絕對網址，沒有 SITE_URL 就整條不要放
    ...(SITE_URL ? [`<meta property="og:url" content="${esc(SITE_URL + route.path)}" />`] : []),
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
  ]
  return tags.map((t) => "    " + t).join("\n")
}

function page(route, body) {
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(pageTitle(route))}</title>`)
    .replace("</head>", `${head(route)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

let written = 0
for (const route of ROUTES) {
  const body = render(route.path)
  const dir = route.path === "/" ? OUT : path.join(OUT, route.path)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, "index.html"), page(route, body), "utf8")
  written++
}

/* 靜態主機找不到頁面時的落地頁：畫首頁，讓人至少有路可走 */
const home = ROUTES.find((r) => r.path === "/")
fs.writeFileSync(path.join(OUT, "404.html"), page(home, render("/")), "utf8")

console.log(`→ 產出 ${written} 個頁面 ＋ 404.html`)

/* ---------- 三、sitemap 與 robots（要有絕對網址才有意義） ---------- */

if (SITE_URL) {
  const urls = ROUTES.map(
    (r) => `  <url><loc>${esc(SITE_URL + r.path)}</loc><changefreq>monthly</changefreq></url>`
  ).join("\n")
  fs.writeFileSync(
    path.join(OUT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    "utf8"
  )
  fs.writeFileSync(
    path.join(OUT, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    "utf8"
  )
  console.log(`→ sitemap.xml（${ROUTES.length} 條）與 robots.txt，網址前綴 ${SITE_URL}`)
} else {
  console.log("→ 沒設 SITE_URL：canonical 用相對路徑，這次不產 sitemap.xml 與 robots.txt")
  console.log("   買了網域之後：SITE_URL=https://your-domain.tw npm run build:ssg")
}

console.log(`\n完成 → ${OUT}`)
