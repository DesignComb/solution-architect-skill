/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** SSG 建置時為 "true"；單檔離線版沒有這個值 */
  readonly VITE_SSG?: string
  /** 正式網址（例如 https://example.tw），給 canonical 與 og:url 用；沒設就退回 location.origin */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
