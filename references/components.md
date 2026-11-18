# 组件速查

全部在 `src/components/`，除 `TargetCursor` 在 `src/`。**不要改内部实现**，只调 props。

## CardNav（`CardNav.jsx`）

玻璃胶囊导航：左菜单 / 中 logo / 右 CTA；点开是三张卡片。

```jsx
<CardNav
  logo={<BackMark />}      // 传节点：这里是「← Back」
  logoAlt={nav.backLabel}
  logoHref="/"
  items={nav.groups}       // [{ label, description, links:[{label, href}] }]
  cta={{ label: "Start", href: "#intro" }}
  cardEffect="rise" openOn="click" surface="glass"
  stagger={0.12} bounce={0.2} menuLabel speed={1}
  cardHeight={176} maxWidth={800} intro
/>
```

窄屏（<560px）会把 CTA 收进面板，这是组件行为。

## TargetCursor（`TargetCursor.jsx`）

四角括号 + 圆点光标，`blendMode="difference"` 自动反色。

```jsx
<TargetCursor spinDuration={2} hoverDuration={0.2} size={36} cornerSize={12}
  thickness={3} padding={6} dotSize={4}
  cursorColor="#ffffff" cursorColorOnTarget="#ffffff"
  blendMode="difference" parallaxOn matchRadius showLabel clickEffect hideDefaultCursor />
```

目标元素加 `class="cursor-target"` 和 `data-cursor-label="..."` 才会吸附并显示标签。

## SplitText（`SplitText.jsx`）

按字符拆分 + 进入视口依次上浮；内部用 `words,chars` 嵌套，保证只在词间断行。

```jsx
<SplitText tag="h2" text="..." className="..." effect="rise" splitType="chars"
  delay={26} duration={1.1} staggerFrom="start" trigger="view"
  hoverEffect="lift" threshold={0.2} textAlign="left" />
```

`trigger="view"` 用 ScrollTrigger，`start: "top bottom-=20%"`。

## Carousel（`Carousel.jsx`）

焦点轮播，传自定义 JSX 时走 `isValidElement` 分支（卡片样式自己控制）。

```jsx
<Carousel items={works.items.map(i => <WorkCard item={i} />)}
  baseWidth={1040} aspectRatio={narrow ? 0.95 : 2.2} peek={narrow ? 0 : 36}
  gap={16} radius={20} frame={false} effect="slide"
  indicator="dots" arrows loop={false} draggable theme="light" autoplay={false} />
```

`aspectRatio` 决定卡片高度（width / ratio），窄屏要一起调。

## AnimatedList（`AnimatedList.jsx`）

列表逐行 `pop` 进入、悬停选中圈用弹簧跟随。

```jsx
<AnimatedList items={handoffItems} animation="pop" theme="light"
  maxHeight={404} radius={12} gap={8} stagger={0.06} fadeSize={52}
  frame={false} showGradients displayScrollbar={false}
  selectOnHover enableArrowNavigation loop={false} initialSelectedIndex={0}
  style={{ '--al-width': '100%', '--al-tile': 'linear-gradient(180deg,#f6f9fc,#eef4f9)' }} />
```

白面板里必须覆盖 `--al-tile`，否则白底卡片会消失。行为 72px，`maxHeight` 决定露出几行（5 行 ≈ 404）。

## FlipCard（`FlipCard.jsx`）

3D 翻转卡，点 / 拖 / 回车都能翻。

```jsx
<FlipCard front={<div className="fc">…</div>} back={<div className="fc fc--back">…</div>}
  width={360} height={432} radius={22}
  background="#ffffff" color="#0a0f15"
  glareOpacity={0.14} hoverScale={1.02} tiltMax={9}
  shadow shadowColor="#0a1a2a" shadowOpacity={0.16} />
```

注意：`aria-hidden` 与 `inert` 一起控制可见面；`inert` 要写成 `shown ? "" : undefined`，不能传 `true`（React 18 会警告）。

## BellToggle（`BellToggle.jsx`）

通知铃铛：关=深色药丸，开=白底 + 铃铛摆动 + 声波。

```jsx
<BellToggle offLabel="Notify me" onLabel="You'll be notified"
  color="#f5f5f5" background="#0a0f15" onColor="#0a0f15" onBackground="#ffffff"
  size="md" radius={22} ringAmplitude={17} ringPasses={5} ringDuration={820}
  badge={false} waves />
```

浅色底上开的白药丸要加描边：`.closing__bell .bell-toggle__button { box-shadow: 0 0 0 1px rgba(10,15,21,.14) }`。

## PulseHeart（`PulseHeart.jsx`）

点赞药丸，点击心形回弹 + 数字逐位滚动。

```jsx
<PulseHeart count={1204} size={24} corner={20}
  pillColor="#f1f5fa" idleColor="#8b939c" textColor="#0a0f15" likedColor="#e0445f" />
```

这是全站唯一的彩色元素。
