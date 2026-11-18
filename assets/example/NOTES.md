# 待替换清单

由 `idea-folio` 生成。图片未提供（`C:\pics` 不存在），当前用的是技能自带默认图。

## 1. 换图片（最重要）

六个槽位，比例固定，只裁不拉伸：

| 文件 | 比例 |
|---|---|
| `public/img/welcome.jpg` | 3:2 |
| `public/img/hero.jpg` | 3:2 |
| `public/img/detail.jpg` | 4:5 |
| `public/img/work-1.jpg` | 4:3 |
| `public/img/work-2.jpg` | 4:3 |
| `public/img/work-3.jpg` | 4:3 |

一条命令换掉（会自动裁切、写 tone）：

```powershell
python C:\Users\只因\.dsh\skills\idea-folio\scripts\images.py --project . --in 你的图1.jpg 你的图2.jpg
```

- 1 张：自动裁 6 个区域
- 3–5 张：按顺序填槽位
- 深色图会自动切白字

## 2. 换文案

只改 `src/content.js`：

- 顶部 `NAME` / `EMAIL` / `YEAR` → 全站占位符自动替换
- `hero.title` / `hero.sub` → 首屏大字与副文
- `intro` / `process` / `works` / `handoff` / `numbers` / `closing` → 各区块

## 3. 换成真实数据

当前数字都是示例值，建议改成你自己的：

| 位置 | 现值 |
|---|---|
| `intro.stats` | 06 Years / 12 Projects / 03 Disciplines / 24 Clients |
| `works.items[].likes` | 1204 / 862 / 431 |
| `numbers.cards` | 24 pages / 98 Lighthouse / 4 hours |
| `numbers.dashboard` | 24,180 visitors、36,420 sessions… |
| `numbers.dashboard.quick` | March 2026 |

## 4. 可选

- 导航文案：`nav.groups` 里的分组名与链接
- 页脚：`closing.footer`
- 强调色只有红心 `#e0445f`，想改在 `about-main.jsx` 的 `likedColor`

## 验收

```powershell
node C:\Users\只因\.dsh\skills\idea-folio\scripts\verify.mjs --url http://127.0.0.1:5499 --out shots
```

10 条全绿再交付。
