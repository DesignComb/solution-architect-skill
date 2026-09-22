// 結構驗證（不需要 claude CLI，離線可跑）：
//   1. plugin.json / marketplace.json 是合法 JSON 且含必填欄位
//   2. plugin.skills 指向的目錄存在
//   3. 每個 skill 都有 SKILL.md，且 frontmatter 有 name / description
// 維護者本機仍建議跑 `claude plugin validate . --strict`（見 CONTRIBUTING.md）。
import { readFileSync, existsSync, readdirSync } from "node:fs"
import { join } from "node:path"

let errors = 0
const fail = (m) => { console.error("✗ " + m); errors++ }
const ok = (m) => console.log("✓ " + m)

function readJson(p) {
  try { return JSON.parse(readFileSync(p, "utf8")) }
  catch (e) { fail(`${p} 不是合法 JSON：${e.message}`); return null }
}

const plugin = readJson(".claude-plugin/plugin.json")
if (plugin) {
  for (const k of ["name", "version", "description"]) {
    if (!plugin[k]) fail(`plugin.json 缺少必填欄位：${k}`)
  }
  if (plugin.name) ok(`plugin.json name = ${plugin.name} @ ${plugin.version}`)
  const skillsDir = String(plugin.skills || "./skills/").replace(/^\.\//, "").replace(/\/$/, "")
  if (skillsDir && !existsSync(skillsDir)) fail(`plugin.skills 指向的目錄不存在：${skillsDir}`)
}

const market = readJson(".claude-plugin/marketplace.json")
if (market) {
  if (!market.name) fail("marketplace.json 缺少 name")
  if (!Array.isArray(market.plugins) || market.plugins.length === 0) {
    fail("marketplace.json 的 plugins 必須是非空陣列")
  } else {
    ok(`marketplace.json 列出 ${market.plugins.length} 個 plugin`)
  }
}

const skillsRoot = "skills"
if (existsSync(skillsRoot)) {
  for (const entry of readdirSync(skillsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const md = join(skillsRoot, entry.name, "SKILL.md")
    if (!existsSync(md)) { fail(`${entry.name}/ 缺少 SKILL.md`); continue }
    const text = readFileSync(md, "utf8")
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!fm) { fail(`${md} 缺少 YAML frontmatter`); continue }
    for (const key of ["name", "description"]) {
      if (!new RegExp(`^${key}:`, "m").test(fm[1])) fail(`${md} frontmatter 缺少 ${key}`)
    }
    ok(`${md}`)
  }
} else {
  fail("找不到 skills/ 目錄")
}

if (errors) { console.error(`\n共 ${errors} 個問題，驗證失敗。`); process.exit(1) }
console.log("\n全部通過。")
