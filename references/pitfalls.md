# 踩过的坑

按「症状 → 原因 → 修法」写，遇到先搜这里。

## 页面全白，控制台没报错

**原因**：某个 JSX 文件语法坏了，Vite 抛在服务端日志里，浏览器只看到空 `#root`。

**查法**：

```powershell
Get-Content _vite.err -Tail 40 | Select-String "SyntaxError|Internal server error|\.jsx:"
```

**本次真实案例**：用脚本插文案时把 `\n` 写成了字面量反斜杠 n：

```js
tags: ["a"],\n    likes: 1204,   // ← JSX 解析失败
```

报错是 `Expecting Unicode escape sequence \uXXXX (272:55)`，不看行号根本猜不到。

## `package.json` 带 BOM，Vite 起不来

**症状**：`SyntaxError: Unexpected token '锘縶'`，HTTP 000。

**原因**：PowerShell 的 `Set-Content -Encoding UTF8` 在部分环境写 BOM。

**修法**：统一用无 BOM 写：

```powershell
[System.IO.File]::WriteAllText($path, $json, (New-Object System.Text.UTF8Encoding($false)))
```

## `npm run build` 报 esbuild `Access is denied`

**原因**：这台机器的 `%TEMP%` ACL 异常，esbuild 删不掉临时文件。

**修法**：把 TMP 指到工程内再构建。

```powershell
$env:TMP = "$pwd\.tmp"; $env:TEMP = "$pwd\.tmp"; New-Item -ItemType Directory -Force .tmp
```

## `inert={true}` 触发 React 警告

**症状**：`Received false for a non-boolean attribute inert`。

**修法**：`inert={shown ? "" : undefined}`。

## 拆字后单词被劈开

**症状**：`A portfolio shou / ld read`。

**原因**：字符级拆分后每个字符都是 `inline-block`，浏览器哪儿都能断。

**修法**：`type: "words,chars"` 嵌套拆分 + `.split-word { display: inline-block }`。

## 拆字动画在页面加载时就播完了

**原因**：ScrollTrigger 的 `start` 拼错了。

**错的**：`` start: `top ${(1 - threshold) * 100}%${rootMargin}` `` → 生成 `top 20%-100px`，解析异常。

**对的**：`` start: `top bottom-=${threshold * 100}%` ``。

## 白色药丸按钮在浅色背景上消失

BellToggle 开启态是白底，放在 `#f2f8fc` 的收尾区看不出来。

**修法**：加 `box-shadow: 0 0 0 1px rgba(10,15,21,.14)`。

## 柱状图三根柱子一样高

**原因**：`Math.max(18, v)` 把 `4 / 8 / 12` 全抬到 18。

**修法**：按最大值归一化 `Math.round((v / Math.max(...bars)) * 100)`。

## 首屏和正文之间有一条硬线

**原因**：只盖了一层渐变，交界处颜色对不上。

**修法**：三层 —— `backdrop-filter: blur()` + 渐变到 `--paper` + `mask-image` 上沿淡入。

## `@hugeicons` 装不上（ETARGET）

**原因**：版本号是猜的。

**修法**：

```powershell
npm view @hugeicons/react version --registry=https://registry.npmmirror.com
npm view @hugeicons/core-free-icons version --registry=https://registry.npmmirror.com
```

本次实测可用：`@hugeicons/react@1.1.10`、`@hugeicons/core-free-icons@4.4.0`。

## 装了依赖之后 dev server 挂了

`npm install` 会重写 `node_modules`，正在跑的 Vite 会跟着死。

**修法**：装完重启 dev server，再跑验收。

## 手机端导航里的「开始」按钮不见了

CardNav 在 `< 560px` 时把 CTA 收进展开面板，这是组件内置行为，不是 bug。要在窄屏也保留，得改 `data-narrow` 那段布局。

## `Math.max(...bars)` 在空数组上返回 -Infinity

柱子数据为空时会写出 `NaN%`。`content.js` 里保证 `back.bars` 至少一项。
