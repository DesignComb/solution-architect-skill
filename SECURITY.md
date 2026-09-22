# 安全政策

## 回報漏洞

**請不要開公開 issue 回報安全問題。**

請用 GitHub 的私密通報：到本 repo 的 **Security** 分頁 →「Report a vulnerability」
開啟 Private Vulnerability Reporting。我們會盡快回覆並在修補後致謝。

> 專案維護者需先在 repo 設定裡開啟 *Private vulnerability reporting*
> （Settings → Code security and analysis）。

## 支援範圍

只有最新版本會收到安全修補。

## 這個專案的安全底線

這是一個 Claude Code plugin，設計上不碰你的任何金鑰或資料：

- `architect` skill 的權限只有 `Read, Write, Edit, Glob, AskUserQuestion, WebSearch`——
  它只讀參考文件、問你問題、（可選）用 WebSearch 查價、把建議書寫到你本機的 `solution/`。
  **沒有 Bash 權限**，不會執行任何 shell 指令。
- `welcome` skill 只用作業系統的開檔指令（`start` / `open` / `xdg-open`）打開
  plugin 內**本機打包好的離線教學頁**，不連線、不下載、不執行遠端程式。
- skill 產出的建議書一律要求：**金鑰只進 `.env` 或平台 secret，絕不進 repo**。

若你發現任何 skill 指令會外洩資料、下載執行遠端程式，或繞過以上原則，請依上述管道回報。
