---
name: idea-folio
description: 把用户上传的图片（天空、大海、山、建筑、抽象质感皆可）变成两页的编辑设计风个人主页 / 作品集：高对比黑白、大字号排版、全屏图首屏、可滑动作品卡、可翻转数据卡、拆字动画、通知铃铛、点赞。当用户上传图片并说「做个人主页 / 作品集 / portfolio / landing page / 介绍页 / 复刻这种风格」时使用，也适用于提到云海背景、大字号标题、翻转卡、可滑动卡片、黑白数据区的场景。不适用于电商、后台管理、多语言站或需要真实后端的项目。
---

# idea-folio

**from imagination to a portfolio** —— 把「几张图」变成「一个两页的编辑设计风个人站」。

风格参照：高对比黑白、大字号紧凑排版、全屏图首屏 + 模糊过渡、可滑动作品卡、可翻转数据卡、仪表盘式数据区。两页：`/`（欢迎）+ `/about.html`（介绍，6 个区块）。

## 先看样例

`assets/example/` 是**零输入**（不给图、不给文案）跑出来的完整成品，含 5 张截图与验收记录。想知道能产出什么，先看那五张图；想照着改，看 `assets/example/NOTES.md` 的待替换清单。

## 为什么用模板而不是重新写

风格稳定来自 **模板 + 单一内容入口**。每次让模型重新写页面，字号、间距、阴影都会漂移。所以：

- 版式、组件、CSS **一律不动**
- 只改 `src/content.js` 和 `public/img/*.jpg`
- 组件保持原样（SplitText / Carousel / AnimatedList / FlipCard / BellToggle / PulseHeart / CardNav / TargetCursor）

模板里 6700 行代码是**字节级复制**过去的，不是重新生成的 —— 这是「一模一样」能成立的原因。

## 输入

| 项 | 必需 | 说明 |
|---|---|---|
| 图片 | 否 | **0–5 张**。0 张走自带默认图；1 张自动裁 6 个槽位；多张按顺序分配 |
| 名字 | 否 | 默认 `ZhiYin`，写进 `content.js` 的 `NAME` |
| 邮箱 | 否 | 默认 `hello@example.com` |
| 作品类别 | 否 | 默认三类：Product surfaces / Front-end builds / Motion studies |
| 主色 | 否 | 默认黑白；用户要彩色才改 `content.js` 里的强调色 |

缺什么就用默认值，并在交付时列出「待替换清单」，不要反复追问。

## 图片槽位

固定比例，**只裁切不拉伸**：

| 槽位 | 比例 | 用途 |
|---|---|---|
| `welcome` | 3:2 | 首页 `/` 背景 |
| `hero` | 3:2 | 介绍页首屏 |
| `detail` | 4:5 | 01 区块右侧图卡 |
| `work-1..3` | 4:3 | 三张作品卡 |

## 流程

```powershell
# 1. 复制模板（不要就地改模板）
Copy-Item "<skill>\assets\template" "<目标目录>" -Recurse

# 2. 装依赖
cd <目标目录>; npm install --registry=https://registry.npmmirror.com

# 3. 图片（会同时写 src/image-tone.json）
python <skill>\scripts\images.py --project . --defaults <skill>\assets\defaults
#    带用户图：python <skill>\scripts\images.py --project . --in a.jpg b.jpg

# 4. 改文案：只改 src/content.js（占位符 {name} {email} {year} 自动替换）

# 5. 起服务
npm run dev     # http://127.0.0.1:5299

# 6. 验收（必须全绿）
node <skill>\scripts\verify.mjs --url http://127.0.0.1:5299 --out shots
```

## 硬性规则

1. **不改组件和 CSS 结构**。要改风格说明用错了技能。
2. **不拉伸图片**，只按槽位裁切。
3. **深色图必须走 tone**：`images.py` 写出的 `image-tone.json` 亮度 < 0.55 时自动启用 `html[data-tone="dark"]`，不要手写白字。
4. **文案集中**：任何文字都进 `content.js`，不要在 JSX 里硬编码。
5. **验收不过不算完成**：`verify.mjs` 10 条必须全过。

## 验收清单

`node scripts/verify.mjs` 会跑这 10 条并截图到 `shots/`：

1. 首屏铺满一屏
2. 首屏底部有渐变过渡层（无硬接缝）
3. 拆字已生成且初始隐藏 → 进入视口后显现
4. 作品轮播可切换
5. 协作列表可选中
6. 数据卡可翻转
7. 点赞计数 +1
8. 通知铃铛可切换
9. 手机 390 宽无横向滚动
10. 欢迎页可访问

## 交付

- 可运行工程（`npm run dev`）
- `shots/` 里的截图（首屏 / 各区块 / 手机）
- 待替换清单：文案、图片、邮箱、数字

## 出问题时

先看 `references/pitfalls.md`，里面是这次踩过的坑（BOM、`inert` 警告、`words,chars` 换行、白底药丸描边、柱状图归一化、`%TEMP%` ACL、`\n` 字面量导致白屏）。

也可以读：

- `references/design-tokens.md` —— 颜色、字号、间距、圆角、阴影
- `references/sections.md` —— 7 个区块的结构与各自验收点
- `references/components.md` —— 8 个组件的 props 速查
