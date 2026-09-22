# 第三方授權（Third-Party Notices）

本專案刻意提交的建置產物（`site/index.html` 與 `dist/`）內含下列開源套件的
程式碼。這些套件皆為寬鬆授權（MIT／ISC／Apache-2.0），依授權條款在此保留
其著作權與授權聲明。原始碼中的 `web/src/components/ui/` 元件改寫自
[shadcn/ui](https://ui.shadcn.com)（MIT）。

各套件版本以 [`web/package.json`](web/package.json) 為準。

## 打包進 site/ 與 dist/ 的執行期套件

| 套件 | 授權 | 著作權 |
|------|------|--------|
| react | MIT | © Meta Platforms, Inc. and affiliates |
| react-dom | MIT | © Meta Platforms, Inc. and affiliates |
| react-router-dom | MIT | © Remix Software, Inc. 與 React Router 貢獻者 |
| @radix-ui/react-accordion、react-checkbox、react-dropdown-menu、react-progress、react-slot | MIT | © 2022 WorkOS |
| lucide-react | ISC | © 2026 Lucide Icons and Contributors |
| clsx | MIT | © Luke Edwards |
| tailwind-merge | MIT | © Dany Castillo 與 tailwind-merge 貢獻者 |
| class-variance-authority | Apache-2.0 | © Joe Bell |
| tailwindcss | MIT | © Tailwind Labs, Inc. |

## 授權條款全文

### MIT License

> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

### ISC License（lucide-react）

> Permission to use, copy, modify, and/or distribute this software for any
> purpose with or without fee is hereby granted, provided that the above
> copyright notice and this permission notice appear in all copies.
>
> THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
> REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
> AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
> INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
> LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
> OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
> PERFORMANCE OF THIS SOFTWARE.

### Apache License 2.0（class-variance-authority）

class-variance-authority 以 Apache License 2.0 授權，全文見
<https://www.apache.org/licenses/LICENSE-2.0>。

---

> 這份清單涵蓋打包進發佈產物的執行期相依套件。完整、可自動同步的作法是在
> 建置流程接上授權彙整工具（例如 `rollup-plugin-license` / `vite-plugin-license`），
> 讓本檔在每次重建 `site/` 與 `dist/` 時一起更新。各套件的授權全文亦隨
> `npm install` 產生在 `web/node_modules/<套件>/LICENSE`。
