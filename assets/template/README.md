# Sky Portfolio · 模板工程

由 `idea-folio` skill 生成。**只改 `src/content.js` 和 `public/img/*.jpg`**，其余文件是版式与组件，不要动。

## 跑起来

```powershell
npm install --registry=https://registry.npmmirror.com
npm run dev        # http://127.0.0.1:5299
```

- 欢迎页：http://127.0.0.1:5299/
- 介绍页：http://127.0.0.1:5299/about.html

## 只改这两个地方

### 1. `src/content.js`

文件顶部的 `NAME / EMAIL / YEAR` 会替换正文里的 `{name} {email} {year}`。其余是各区块的文案与数据，按区块名找即可。

### 2. `public/img/`

固定六个槽位，比例不能改：

| 文件 | 比例 | 用在哪 |
|---|---|---|
| `welcome.jpg` | 3:2 | 首页背景 |
| `hero.jpg` | 3:2 | 介绍页首屏 |
| `detail.jpg` | 4:5 | 01 区块右图 |
| `work-1.jpg` | 4:3 | 作品卡 1 |
| `work-2.jpg` | 4:3 | 作品卡 2 |
| `work-3.jpg` | 4:3 | 作品卡 3 |

换图请用 skill 的脚本（会自动裁切、并写 `src/image-tone.json`）：

```powershell
python <skill>\scripts\images.py --project . --in a.jpg b.jpg
```

深色图会把 `tone` 写成 `dark`，页面自动切白字。

## 别做的事

- 不要在 JSX 里写死文案（全部进 `content.js`）
- 不要拉伸图片（脚本只裁切）
- 不要改组件内部实现（`src/components/*`）
- 不要动 `src/about.css` 的结构规则；只在确有必要时改

## 验收

```powershell
node <skill>\scripts\verify.mjs --url http://127.0.0.1:5299 --out shots
```

10 条断言全绿才算完成，截图落在 `shots/`。
