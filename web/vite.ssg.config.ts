import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/*
 * SSG 版設定：每個路由預先產生一個 HTML，走乾淨路由、各頁獨立 SEO，拿去部署用。
 * 跟預設的 vite.config.ts（單檔離線版，給 /welcome 用 file:// 開）是兩個不同的目標，
 * 差別在：這裡不內嵌成單檔、base 用絕對路徑、路由改 BrowserRouter。
 *
 * 正式網址用環境變數帶入，沒設就退回相對路徑的 canonical，也不產 sitemap.xml：
 *   SITE_URL=https://your-domain.tw npm run build:ssg
 */
const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '')

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  define: {
    'import.meta.env.VITE_SSG': JSON.stringify('true'),
    'import.meta.env.VITE_SITE_URL': JSON.stringify(SITE_URL),
  },
  build: { outDir: '../dist', emptyOutDir: true },
})
