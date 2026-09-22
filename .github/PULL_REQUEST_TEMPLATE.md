## 這個 PR 做了什麼

<!-- 一兩句話講清楚動機與改動 -->

## 提交前檢查（對照 CONTRIBUTING.md）

- [ ] 有改 `web/` → 已重跑 `npm run build` 與 `npm run build:ssg`，`site/` 與 `dist/` 一起提交（只改 skill 文件則免建置）
- [ ] `cd web && npm run check` 型別零錯誤
- [ ] 有動到價格 → `stack-catalog.md`、網頁、查證日期三處已同步
- [ ] 有改連結 → `npm run links` 的死連結與連不上為 0
- [ ] `claude plugin validate . --strict` 通過
- [ ] 沒有把本機檔案（`.claude/settings.local.json`、`.idea/`、`node_modules/`）加進來
- [ ] 全部正體中文、業務語言，技術名詞第一次出現有白話
