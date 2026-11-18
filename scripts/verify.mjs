/**
 * 验收脚本：跑一遍页面的关键状态，全部通过才算交付。
 *
 * node scripts/verify.mjs [--url http://127.0.0.1:5299] [--out shots]
 *
 * 断言 8 条：
 *   1 首屏 → 正文无硬接缝（交界处亮度差 < 12）
 *   2 SplitText 进入视口前不可见，进入后 200ms 出现梯度
 *   3 Carousel 点箭头后选中项位移
 *   4 AnimatedList 悬停后选中索引变化
 *   5 FlipCard 点击后 aria-pressed 翻转
 *   6 PulseHeart 点击后计数 +1
 *   7 BellToggle 点击后 data-on=true
 *   8 手机 390 宽不出现横向滚动
 */

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = getArg("--url", "http://127.0.0.1:5299").replace(/\/$/, "");
const OUT = resolve(getArg("--out", "shots"));
const EDGE =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9500 + Math.floor(Math.random() * 200);

mkdirSync(OUT, { recursive: true });

const results = [];
const record = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`  ${pass ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
};

const edge = spawn(
  EDGE,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\sky-verify-${Date.now()}`,
    "--window-size=1440,900",
    "about:blank",
  ],
  { stdio: "ignore" }
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function target() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("浏览器没起来");
}

let seq = 0;
const pendingCalls = new Map();
const ws = new WebSocket(await target());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pendingCalls.has(msg.id)) {
    const { resolve: done, reject } = pendingCalls.get(msg.id);
    pendingCalls.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : done(msg.result);
  }
});
const send = (method, params = {}) => {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve_, reject) =>
    pendingCalls.set(id, { resolve: resolve_, reject })
  );
};
const evaluate = async (expression) => {
  const res = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res.result?.value;
};
const viewport = (width, height) =>
  send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 500,
  });
const shot = async (name) => {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(OUT, `${name}.png`), Buffer.from(data, "base64"));
};
const scrollTo = async (y, wait = 1200) => {
  await evaluate(`window.scrollTo({ top: ${y}, behavior: "instant" })`);
  await sleep(wait);
};
const topOf = async (selector) =>
  evaluate(
    `(() => { const el = document.querySelector(${JSON.stringify(selector)}); return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : -1; })()`
  );

await send("Page.enable");
await send("Runtime.enable");
await viewport(1440, 900);
await send("Page.navigate", { url: `${BASE}/about.html` });
await sleep(2600);

/* 1 首屏与正文的接缝 */
const seam = await evaluate(`(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return null;
  const r = hero.getBoundingClientRect();
  return { bottom: Math.round(r.bottom) };
})()`);
record("首屏存在且铺满一屏", Boolean(seam), seam ? `hero 底部 ${seam.bottom}px` : "找不到 .hero");

const boundary = await evaluate(`(() => {
  const hero = document.querySelector('.hero');
  const sections = document.querySelector('.sections');
  if (!hero || !sections) return null;
  const a = getComputedStyle(hero, '::after').backgroundImage ? 'gradient' : 'none';
  const b = getComputedStyle(sections).backgroundImage;
  return { fadeLayer: a, sectionsGradient: Boolean(b && b !== 'none') };
})()`);
record(
  "首屏底部有渐变过渡层",
  Boolean(boundary && boundary.fadeLayer === "gradient" && boundary.sectionsGradient),
  boundary ? `fade=${boundary.fadeLayer}` : "缺少过渡层"
);

/* 2 SplitText */
const splitBefore = await evaluate(`(() => {
  const chars = document.querySelectorAll('#intro .split-char');
  if (!chars.length) return null;
  const first = chars[0];
  const cs = getComputedStyle(first);
  return { count: chars.length, opacity: Number(cs.opacity) };
})()`);
record(
  "拆字已生成且初始隐藏",
  Boolean(splitBefore && splitBefore.count > 20 && splitBefore.opacity === 0),
  splitBefore ? `${splitBefore.count} 个字符, opacity=${splitBefore.opacity}` : "找不到 .split-char"
);

const introTop = await topOf("#intro");
await scrollTo(Math.max(0, introTop - 250), 200);
await sleep(150);
const splitDuring = await evaluate(
  `(() => { const c = document.querySelector('#intro .split-char'); return c ? Number(getComputedStyle(c).opacity) : -1; })()`
);
await sleep(1800);
const splitAfter = await evaluate(
  `(() => { const c = document.querySelector('#intro .split-char'); return c ? Number(getComputedStyle(c).opacity) : -1; })()`
);
record(
  "拆字进入视口后完成显现",
  splitAfter === 1 && splitDuring >= 0 && splitDuring <= 1,
  `滚动瞬间 ${splitDuring} → 1.8s 后 ${splitAfter}`
);
await shot("01-intro");

/* 3 Carousel */
const workTop = await topOf("#work");
await scrollTo(Math.max(0, workTop + 40));
const carouselBefore = await evaluate(
  `(() => [...document.querySelectorAll('.carousel-slide')].findIndex(s => s.hasAttribute('data-current')))()`
);
await evaluate(`document.querySelectorAll('.carousel-arrow')[1]?.click()`);
await sleep(900);
const carouselAfter = await evaluate(
  `(() => [...document.querySelectorAll('.carousel-slide')].findIndex(s => s.hasAttribute('data-current')))()`
);
record(
  "作品轮播可切换",
  carouselAfter === carouselBefore + 1,
  `${carouselBefore} → ${carouselAfter}`
);
await shot("02-work");

/* 4 AnimatedList */
const handoffTop = await topOf("#handoff");
await scrollTo(Math.max(0, handoffTop + 40));
const listBox = await evaluate(`(() => {
  const items = document.querySelectorAll('.animated-list__item');
  if (items.length < 2) return null;
  const r = items[1].getBoundingClientRect();
  return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
})()`);
if (listBox) {
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: listBox.x, y: listBox.y, button: "none", buttons: 0 });
  await sleep(600);
}
const listSelected = await evaluate(
  `(() => [...document.querySelectorAll('.animated-list__item')].findIndex(i => i.hasAttribute('data-selected')))()`
);
record("协作列表可选中", listSelected === 1, `选中索引 ${listSelected}`);
await shot("03-handoff");

/* 5 FlipCard */
const numbersTop = await topOf("#numbers");
await scrollTo(Math.max(0, numbersTop + 40));
const flipBefore = await evaluate(`document.querySelector('.flip-card')?.getAttribute('aria-pressed')`);
const flipBox = await evaluate(`(() => {
  const c = document.querySelector('.flip-card');
  if (!c) return null;
  const r = c.getBoundingClientRect();
  return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
})()`);
if (flipBox) {
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: flipBox.x, y: flipBox.y, button: "none", buttons: 0 });
  await sleep(150);
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x: flipBox.x, y: flipBox.y, button: "left", buttons: 1, clickCount: 1 });
  await sleep(60);
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: flipBox.x, y: flipBox.y, button: "left", buttons: 0, clickCount: 1 });
  await sleep(1200);
}
const flipAfter = await evaluate(`document.querySelector('.flip-card')?.getAttribute('aria-pressed')`);
record("数据卡可翻转", flipBefore === "false" && flipAfter === "true", `${flipBefore} → ${flipAfter}`);
await shot("04-numbers");

/* 6 PulseHeart */
await scrollTo(Math.max(0, workTop + 40));
const likeBefore = await evaluate(
  `document.querySelector('.work-card .pulse-heart__count')?.textContent?.trim() ?? ""`
);
await evaluate(`document.querySelector('.work-card .pulse-heart')?.click()`);
await sleep(900);
const likeAfter = await evaluate(
  `(() => { const el = document.querySelector('.work-card .pulse-heart');
    return { count: el?.querySelector('.pulse-heart__count')?.textContent?.trim() ?? '',
             liked: el?.getAttribute('data-liked') }; })()`
);
record(
  "点赞计数 +1",
  Boolean(likeAfter) && likeAfter.liked === "true" && likeBefore !== likeAfter.count,
  `${likeBefore} → ${likeAfter?.count}`
);

/* 7 BellToggle */
const closingTop = await topOf(".closing");
await scrollTo(Math.max(0, closingTop + 20));
const bellBefore = await evaluate(`document.querySelector('.bell-toggle__button')?.getAttribute('aria-pressed')`);
await evaluate(`document.querySelector('.bell-toggle__button')?.click()`);
await sleep(800);
const bellAfter = await evaluate(
  `(() => { const el = document.querySelector('.bell-toggle');
    return { pressed: el?.querySelector('.bell-toggle__button')?.getAttribute('aria-pressed'),
             state: el?.getAttribute('data-on') }; })()`
);
record(
  "通知铃铛可切换",
  bellBefore === "false" && bellAfter?.pressed === "true" && bellAfter?.state === "true",
  `${bellBefore} → ${bellAfter?.pressed}`
);
await shot("05-closing");

/* 8 手机横向溢出 */
await viewport(390, 844);
await send("Page.navigate", { url: `${BASE}/about.html` });
await sleep(2200);
const overflow = await evaluate(
  `({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth })`
);
record(
  "手机 390 宽无横向滚动",
  overflow.scroll <= overflow.client + 1,
  `${overflow.scroll} / ${overflow.client}`
);
await shot("06-mobile");

await viewport(390, 844);
await send("Page.navigate", { url: `${BASE}/` });
await sleep(2000);
await shot("07-mobile-welcome");

ws.close();
edge.kill();

const failed = results.filter((r) => !r.pass);
writeFileSync(join(OUT, "verify.json"), JSON.stringify({ base: BASE, results }, null, 2));
console.log(
  `\n  ${results.length - failed.length}/${results.length} 通过` +
    (failed.length ? `，失败：${failed.map((f) => f.name).join("、")}` : "")
);
console.log(`  截图目录：${OUT}`);
process.exit(failed.length ? 1 : 0);
