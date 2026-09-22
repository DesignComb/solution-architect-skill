#!/usr/bin/env node
/**
 * 預覽 SSG 產物。
 *
 *   npm run preview:ssg          → http://localhost:4173
 *   npm run preview:ssg -- 5000  → 換一個埠號
 *
 * 為什麼不用 vite preview：它預設是 SPA 模式，找不到檔案就一律回首頁的 index.html。
 * 那會讓 /guides/domains 拿到首頁的 HTML，然後在瀏覽器 hydrate 失敗——看起來像我們的 bug，
 * 其實是預覽方式不對。這支照真正的靜態主機（Cloudflare Pages、Netlify）的規則走：
 * /guides/domains → dist/guides/domains/index.html，真的找不到才回 404.html 並帶 404 狀態碼。
 */

import fs from "node:fs"
import path from "node:path"
import http from "node:http"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../dist")
const PORT = Number(process.argv[2]) || 4173

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
}

if (!fs.existsSync(ROOT)) {
  console.error(`找不到 ${ROOT}，先跑 npm run build:ssg。`)
  process.exit(1)
}

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "") || "/"
  // 擋住往上跳目錄
  const target = path.normalize(path.join(ROOT, clean))
  if (!target.startsWith(ROOT)) return null

  if (fs.existsSync(target) && fs.statSync(target).isFile()) return target
  const asIndex = path.join(target, "index.html")
  if (fs.existsSync(asIndex)) return asIndex
  return null
}

http
  .createServer((req, res) => {
    const file = resolveFile(req.url)
    if (file) {
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" })
      fs.createReadStream(file).pipe(res)
      return
    }
    const notFound = path.join(ROOT, "404.html")
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
    res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : "404")
  })
  .listen(PORT, () => {
    console.log(`SSG 預覽 → http://localhost:${PORT}`)
    console.log(`（照靜態主機規則：/guides/domains 會拿到 guides/domains/index.html）`)
  })
