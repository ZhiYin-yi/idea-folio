# 设计参数

## 颜色

```css
--ink: #0a0f15;                    /* 正文与标题 */
--muted: rgba(10, 15, 21, 0.6);    /* 次要文字 */
--hairline: rgba(10, 15, 21, 0.1); /* 分隔线 */
--paper: #f7fbfd;                  /* 纸白（正文区底色） */
```

正文区背景：`linear-gradient(180deg, #f7fbfd 0%, #f5fafd 46%, #f2f8fc 100%)`（偏一点蓝的白）。

强调色只有一处：**红心** `#e0445f`（PulseHeart）。其余全黑白。

深色图适配：`html[data-tone="dark"]` 下 hero 文字转白、加径向压暗、ghost 按钮转半透明深底。

## 字号（clamp 全部按视口算）

| 元素 | 规格 |
|---|---|
| 首屏大标题 | `clamp(40px, 6.4vw, 88px)` / 字重 700 / 行高 1.02 / 字距 -0.035em |
| 区块标题 | `clamp(32px, 3.6vw, 54px)` / 800 / 1.06 / -0.03em |
| 01 区块标题 | `clamp(38px, 4.7vw, 72px)` / 800 / 1.03 |
| 卡片标题 | `clamp(21px, 2.1vw, 31px)` / 800 |
| 正文 | `clamp(13.5px, 1.05vw, 15px)` / 1.7 / `--muted` |
| 小标签 | 10.5px / 600 / 字距 0.16–0.22em / 大写 |

正文行宽：英文 `44–52ch`，中文用 `em`（约 30em）。**不要给中文用 ch**。

## 间距

- 区块：`min-height: 100svh`，`padding-block: clamp(72px, 11vh, 132px)`
- 容器：`max-width: 1180px`，`padding-inline: clamp(20px, 5vw, 64px)`
- 首屏内容下移：`padding-top: clamp(150px, 26vh, 270px)`

## 圆角

| 元素 | 值 |
|---|---|
| 药丸按钮 | 999px |
| 图卡 / 数据卡 | 20–24px |
| 列表行 | 12px |
| 导航面板 | 18px |

## 阴影

```css
/* 图卡 */
box-shadow: 0 40px 80px -50px rgba(8, 24, 40, 0.55);
/* 白色面板 */
box-shadow: 0 40px 80px -60px rgba(8, 24, 40, 0.5);
/* 深色药丸按钮 */
box-shadow: 0 16px 30px -14px rgba(8, 20, 34, 0.6);
```

## 字体

`Inter`（可变字重）自托管在 `public/fonts/inter-var.woff2`，`@font-face` 声明 `font-weight: 100 900`。标题靠 `font-weight: 800` + 负字距做出"出版物质感"，不靠第二个字体。

## 首屏与正文的接缝

三层，缺一不可：

1. `.hero::after` 一条 `clamp(180px, 26vh, 300px)` 的带子，`backdrop-filter: blur(22px)`
2. 同一条带子上叠 `linear-gradient`，从透明渐变到 `--paper`
3. `mask-image` 让带子上沿淡入

只盖一层渐变会在交界处留下比背景略浅的线。
