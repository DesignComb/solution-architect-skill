import { StrictMode } from "react"
import { createRoot, hydrateRoot } from "react-dom/client"
import { HashRouter, BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"

/*
 * 一份原始碼，兩種輸出：
 *
 * - 預設（npm run build）：單檔離線版，用 HashRouter。
 *   /welcome 是用 file:// 直接開 site/index.html 的，乾淨路由在 file:// 下
 *   會被解析到檔案系統根目錄，只有 hash 路由能動。
 * - SSG（npm run build:ssg）：每頁一個 HTML，用 BrowserRouter 走乾淨路由，
 *   HTML 是預先產好的，所以掛載時要 hydrate 而不是重畫。
 */
const SSG = import.meta.env.VITE_SSG === "true"
const Router = SSG ? BrowserRouter : HashRouter

const root = document.getElementById("root")!

const tree = (
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
)

if (SSG && root.firstChild) hydrateRoot(root, tree)
else createRoot(root).render(tree)
