import { useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { SiteHeader, SiteFooter, ScrollToTop } from "@/components/site"
import { ROUTES, findRoute, pageTitle, SITE_NAME } from "@/routes"
import Home from "@/pages/home"

/*
 * 換頁時同步 <title>、description 與 canonical。
 * SSG 版每一頁的 HTML 本來就帶著正確的標籤（給爬蟲看），
 * 這裡處理的是使用者在站內點來點去之後的更新（給瀏覽器分頁與分享用）。
 */
function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const route = findRoute(pathname)
    document.title = pageTitle(route)

    const desc = route?.description ?? ""
    setMeta("name", "description", desc)
    setMeta("property", "og:title", pageTitle(route))
    setMeta("property", "og:description", desc)
    setMeta("property", "og:site_name", SITE_NAME)

    const origin = import.meta.env.VITE_SITE_URL || window.location.origin
    const href = origin.replace(/\/$/, "") + (route?.path ?? pathname)
    setLink("canonical", href)
    setMeta("property", "og:url", href)
  }, [pathname])

  return null
}

function setMeta(keyAttr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${keyAttr}="${key}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(keyAttr, key)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", rel)
    document.head.appendChild(el)
  }
  el.setAttribute("href", href)
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Seo />
      <SiteHeader />
      <Routes>
        {ROUTES.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<Home />} />
      </Routes>
      <SiteFooter />
    </>
  )
}
