#!/usr/bin/env node
/**
 * 官方連結檢查工具
 *
 * 掃描全站原始碼與知識庫裡的所有外部連結，逐一連連看還活著沒有。
 * 教學內容的價格與額度會浮動，所以我們不硬寫數字，改成把讀者帶到官方頁——
 * 那些連結一旦爛掉，整套做法就失效了，所以要有東西定期幫忙盯著。
 *
 *   npm run links              全部檢查
 *   npm run links -- --filter=netlify   只檢查網址含 netlify 的
 *   npm run links -- --json    輸出 JSON（給 CI 或其他工具吃）
 *
 * 離開代碼：有 DEAD 或 ERROR 就是 1，其餘 0（BLOCKED 要人工看，但不擋 CI）。
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

/*
 * 有些站（例如 Webflow）回應的標頭超過 Node 預設上限，會被誤判成「連不上」。
 * 提高上限只能在啟動時設定，所以第一次執行先用更大的上限把自己重跑一次。
 */
if (!process.env.LINK_CHECK_CHILD) {
  const { spawnSync } = await import("node:child_process")
  const r = spawnSync(
    process.execPath,
    ["--max-http-header-size=65536", fileURLToPath(import.meta.url), ...process.argv.slice(2)],
    { stdio: "inherit", env: { ...process.env, LINK_CHECK_CHILD: "1" } }
  )
  process.exit(r.status ?? 1)
}

/* 掃這些地方；每一項是 [起點, 副檔名] */
const SCAN = [
  ["web/src", [".tsx", ".ts"]],
  ["skills", [".md"]],
  [".", [".md"]], // 根目錄的 README／CHANGELOG／CONTRIBUTING
]

/* 這些不用連連看 */
const SKIP = [
  "localhost", "127.0.0.1", "0.0.0.0",
  "example.com", "example.org", "example.tw", "your-domain",
  "schemas.", "://xxx", "${",
]

const IGNORE_DIRS = new Set(["node_modules", "dist", ".git", ".idea", "site"])

const args = process.argv.slice(2)
const flag = (name, dflt) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : dflt
}
const asJson = args.includes("--json")
const filter = flag("filter", "")
const TIMEOUT = Number(flag("timeout", 15000))
const CONCURRENCY = Number(flag("concurrency", 8))

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"

/* ---------- 一、把連結挖出來 ---------- */

function* walk(dir) {
  let entries
  try {
    entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".claude-plugin") continue
    const rel = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name)) continue
      yield* walk(rel)
    } else {
      yield rel
    }
  }
}

/* 去掉句尾標點——中文內文裡的連結常常黏著全形符號 */
const TRAILING = /[.,;:!?、。，）」』】…｜|*'"`>]+$/

function extract(text) {
  const out = []
  // 網址不會含中日韓文字或全形標點，遇到就斷開——中文內文裡的連結常常直接黏著下一個字
  for (const m of text.matchAll(/https?:\/\/[^\s"'`<>)\]}　-〿一-鿿＀-￯]+/g)) {
    let url = m[0].replace(TRAILING, "")
    if (!url || SKIP.some((s) => url.includes(s))) continue
    out.push(url)
  }
  return out
}

const refs = new Map() // url -> Set<file>

for (const [start, exts] of SCAN) {
  for (const rel of walk(start)) {
    if (!exts.includes(path.extname(rel))) continue
    if (start === "." && rel.includes(path.sep)) continue // 根目錄只看第一層
    const text = fs.readFileSync(path.join(ROOT, rel), "utf8")
    for (const url of extract(text)) {
      if (filter && !url.includes(filter)) continue
      if (!refs.has(url)) refs.set(url, new Set())
      refs.get(url).add(rel.split(path.sep).join("/"))
    }
  }
}

const urls = [...refs.keys()].sort()

if (urls.length === 0) {
  console.log(filter ? `沒有符合 --filter=${filter} 的連結。` : "沒有掃到任何外部連結。")
  process.exit(0)
}

/* ---------- 二、一個一個連連看 ---------- */

async function probe(url) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT)
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: {
        "user-agent": UA,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "zh-TW,zh;q=0.9,en;q=0.8",
      },
    })
    try { await res.body?.cancel() } catch { /* 有些回應沒有 body */ }

    const moved = res.url && res.url.replace(/\/$/, "") !== url.replace(/\/$/, "")
    if (res.ok) return { state: moved ? "REDIRECT" : "OK", code: res.status, finalUrl: res.url }
    if ([401, 403, 405, 406, 429, 503].includes(res.status)) return { state: "BLOCKED", code: res.status, finalUrl: res.url }
    if ([404, 410].includes(res.status)) return { state: "DEAD", code: res.status, finalUrl: res.url }
    return { state: "ERROR", code: res.status, finalUrl: res.url }
  } catch (err) {
    const why = err?.name === "AbortError" ? `逾時 ${TIMEOUT}ms` : (err?.cause?.code || err?.message || String(err))
    return { state: "ERROR", code: 0, note: why }
  } finally {
    clearTimeout(timer)
  }
}

async function run() {
  const results = []
  let cursor = 0
  let done = 0

  async function worker() {
    while (cursor < urls.length) {
      const url = urls[cursor++]
      const r = await probe(url)
      results.push({ url, ...r, files: [...refs.get(url)] })
      done++
      if (!asJson && process.stderr.isTTY) {
        process.stderr.write(`\r檢查中 ${done}/${urls.length}…`)
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker))
  if (!asJson && process.stderr.isTTY) process.stderr.write("\r".padEnd(30) + "\r")

  results.sort((a, b) => a.url.localeCompare(b.url))
  return results
}

/* ---------- 三、報告 ---------- */

const LABEL = {
  OK: "正常",
  REDIRECT: "已轉址",
  BLOCKED: "被擋（要人工看）",
  DEAD: "死連結",
  ERROR: "連不上",
}
const ORDER = ["DEAD", "ERROR", "BLOCKED", "REDIRECT", "OK"]

const results = await run()

if (asJson) {
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), total: results.length, results }, null, 2))
} else {
  const by = Object.fromEntries(ORDER.map((k) => [k, results.filter((r) => r.state === k)]))

  console.log(`\n官方連結檢查　共 ${results.length} 條${filter ? `（篩選：${filter}）` : ""}\n`)
  console.log(
    ORDER.map((k) => `${LABEL[k]} ${by[k].length}`).join("　│　") + "\n"
  )

  for (const state of ORDER) {
    const rows = by[state]
    if (!rows.length || state === "OK") continue
    console.log(`── ${LABEL[state]} ──`)
    for (const r of rows) {
      console.log(`  ${r.url}`)
      if (r.state === "REDIRECT") console.log(`    → 現在是 ${r.finalUrl}`)
      if (r.note) console.log(`    ${r.note}`)
      else if (r.code) console.log(`    HTTP ${r.code}`)
      console.log(`    出現在：${r.files.join("、")}`)
    }
    console.log("")
  }

  if (by.DEAD.length || by.ERROR.length) {
    console.log("死連結和連不上的要修：換成官方現行的頁面，或整條拿掉。")
  } else if (by.BLOCKED.length) {
    console.log("沒有死連結。被擋的那幾條是對方擋機器人，請人工用瀏覽器開一次確認。")
  } else {
    console.log("全部正常。")
  }
  console.log("")
}

process.exit(results.some((r) => r.state === "DEAD" || r.state === "ERROR") ? 1 : 0)
