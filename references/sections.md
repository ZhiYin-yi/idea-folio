# 区块结构

两页：`/`（欢迎页）+ `/about.html`（介绍页）。介绍页 6 屏，每屏 `min-height: 100svh`（数据区因内容多会自动变高）。

## 欢迎页 `/`

```
main.hero
├─ div.hero__bg          背景图（content.welcome.image，cover + 左侧白雾渐变）
└─ div.hero__inner
   ├─ h1.hero__title     Welcome
   ├─ p.hero__sub        一行说明，max-width 34ch
   └─ a.start.cursor-target  Start + ↗（深色药丸）
```

验收点：标题单行不换行（1440 宽），点 Start 跳 `/about.html`。

## 介绍页 `/about.html`

### 首屏 `.hero`
云海图 `cover` + 径向白雾 + 大标题 + 副文 + 两个按钮。
底部有 `::after` 过渡带（blur + 渐变 + mask），把图化进正文区。

验收点：无硬接缝、副文两行左右、文字对比度 ≥ 4.5:1。

### 01 Introduction `#intro`
左：eyebrow + 大标题（SplitText 拆字）+ 说明 + 两个按钮
右：`detail` 图卡（4:5，图内底部有 `PLATE 01 / SPRING` 说明条）
底部：四组数字，上边一条细线

验收点：标题按词换行（不出现 `shou / ld` 这种断裂）、图不变形。

### 02 How I work `#process`
eyebrow + 标题 + 三行（序号 / 名称 / 说明），行间细线。

验收点：三行对齐，文字不被裁。

### 03 Selected work `#work`
左标题 + 右注释，下面是 `Carousel`（一次一张，左右微露）。
每张卡：左图 44%、右侧序号 + 点赞 + 标题 + 说明 + tag 药丸 + 底部两列数字。

验收点：点箭头切到下一张；窄屏卡片变上下结构。

### 04 Working together `#handoff`
左：eyebrow + 标题 + 说明 + 三条带勾要点 + 两个按钮
右：白色面板（标题 + badge + 说明）+ `AnimatedList` 9 行，可视 5 行

验收点：悬停行时选中圈移动；行高 72px；第 5 行被底部渐变淡出。

### 05 By the numbers `#numbers`
上：三张 `FlipCard`（正面介绍 + 大数字，背面柱状图 + 三行数据 + 来源）
下：仪表盘 —— 左（标签 + 时间 tabs + 大数字 + 折线面积图 + 三块指标 + 活动流），右（Watchlist + Next open slot）

验收点：翻转后 `aria-pressed` 变化；柱子高度按最大值归一化（不能等长）。

### 06 Closing `.closing`
标题（SplitText）+ 邮箱按钮 + Back to top + `BellToggle` + 页脚两行。

验收点：铃铛点击后 `data-on="true"`，页脚两行分居左右。
