import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router"
import App from "./App"

export { ROUTES, pageTitle, findRoute, SITE_NAME, SITE_TAGLINE } from "./routes"

/** 把某一條路由畫成 HTML 字串，給 scripts/prerender.mjs 塞進 index.html 樣板 */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  )
}
