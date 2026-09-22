---
name: welcome
description: 打開 Solution Architect 的視覺化教學網頁，並用一段話說明這套工具怎麼用。當使用者說「開始」「怎麼用」「教學」「welcome」「help」或第一次使用這個工具箱時使用。
allowed-tools: Bash, Read
---

# Solution Architect 上手指引

1. 在瀏覽器打開教學網頁（依作業系統擇一；本頁完全離線可用）：
   - Windows：`cmd /c start "" "${CLAUDE_PLUGIN_ROOT}/site/index.html"`
   - macOS：`open "${CLAUDE_PLUGIN_ROOT}/site/index.html"`
   - Linux：`xdg-open "${CLAUDE_PLUGIN_ROOT}/site/index.html"`

2. 同時用白話跟使用者講重點（不要只丟網頁）：
   - 這是一個「解決方案架構師」：動手做任何網站、系統或 APP **之前**，先回答五個問題——
     要寫程式嗎、要 APP 嗎、用什麼做、長什麼樣子、花多少錢。每一題都有推薦答案。
   - 它會誠實說「你其實不用寫程式」「你不需要 APP」——目標是站上最合理的產品線。
   - 網站是多頁架構：首頁＋五個問題各一頁＋心法＋書架（二十七本指南，分五排：先看懂、小教室、做出來、開門做生意、隨手查）＋
     **「開始規劃」表單精靈**（填完當場產出一份需求單 Markdown，貼給任何 AI 都能開工）。
   - **兩條路**：不想裝 skill → 用網站的「開始規劃」表單；想要完整訪談＋直接開工 → `/architect`
     （產出 `solution/` 三份文件，AI 接著就能動工）。

3. 問使用者想走哪條路；要訪談 → 引導執行 `/architect`。
