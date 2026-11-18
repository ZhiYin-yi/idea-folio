# 样例：这个技能能产出什么

这就是用 `idea-folio` 生成的一份完整成品 —— **零输入**（用户没给图片，走的是技能自带默认图），两页、6 个区块、8 个交互组件。

先看 `preview/` 里的五张截图，大概 30 秒能了解风格：

| 截图 | 看什么 |
|---|---|
| `preview/01-intro.jpg` | 出版物质感的左文右图 + 底部四组数字 |
| `preview/02-work.jpg` | 可滑动的作品卡（左图右文 + 点赞 + tag 药丸 + 数据） |
| `preview/04-numbers.jpg` | 翻转卡背面（柱状图 + 三行数据 + 来源）与仪表盘 |
| `preview/05-closing.jpg` | 收尾 + 通知铃铛（开启态） |
| `preview/07-mobile-welcome.jpg` | 手机 390 宽的首屏 |

## 自己跑一遍

```powershell
cd assets\example
npm install --registry=https://registry.npmmirror.com
npm run dev        # http://127.0.0.1:5299
```

- 首页：`/`
- 介绍页：`/about.html`

## 验收结果（这份样例的实际输出）

```
✓ 首屏铺满一屏              hero 底部 900px
✓ 首屏底部有渐变过渡层
✓ 拆字 37 字符，初始隐藏    → 1.8s 后全部显现
✓ 作品轮播可切换            0 → 1
✓ 协作列表可选中            索引 1
✓ 数据卡可翻转              false → true
✓ 点赞 1,204 → 1,205
✓ 铃铛 false → true
✓ 手机 390 无横向滚动       390 / 390
10/10 通过
```

## 这份样例说明了什么

1. **零输入也能出站**：没给图、没给文案，直接用默认值就是能看的一页。
2. **图片不是装饰，是结构**：`welcome / hero / detail / work-1..3` 六个槽位决定版式；换图只换内容，不动结构。
3. **深色图有兜底**：这份用的是浅色图（`tone=light`）。如果换成夜空的图，`images.py` 会把 `src/image-tone.json` 写成 `dark`，首屏自动切白字。

## 改它

见同目录 `NOTES.md`（待替换清单）和 `README.md`（怎么改文案与图片）。

## 注意

- 这里保留了 `public/img/`，所以复制出去就能跑；模板目录 `assets/template/` 里也有同样一份图。
- 不要把这份样例当模板改 —— 要新站请用 `assets/template/`，样例只用来对照。
