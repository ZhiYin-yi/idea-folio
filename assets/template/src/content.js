/**
 * 唯一的内容入口。
 * 改站点的用户只需要动这个文件（+ 换 public/img/ 里的图）。
 * 组件与版式一律不要动。
 *
 * 可用占位符：{name} {email} {year}
 */

const NAME = "ZhiYin";
const EMAIL = "hello@example.com";
const YEAR = "2026";

const fill = (value) =>
  String(value)
    .replaceAll("{name}", NAME)
    .replaceAll("{email}", EMAIL)
    .replaceAll("{year}", YEAR);

// 递归填占位符：对象、数组、字符串都能覆盖到
const f = (value) => {
  if (typeof value === "string") return fill(value);
  if (Array.isArray(value)) return value.map(f);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, f(v)]));
  }
  return value;
};

export const site = {
  name: NAME,
  email: EMAIL,
  year: YEAR,
  title: "ZhiYin — Introduction",
};

/* ---------------- 欢迎页（/） ---------------- */
export const welcome = {
  docTitle: "Welcome — Personal introduction",
  title: "Welcome",
  sub: "A short introduction to who I am, what I build, and what I'm looking for next.",
  start: "Start",
  startLabel: "Start — open the introduction",
  image: "/img/welcome.jpg",
  href: "/about.html",
};

/* ---------------- 导航 ---------------- */
export const nav = f({
  back: "Back",
  backLabel: "Back to welcome",
  cta: { label: "Start", href: "#intro" },
  groups: [
    {
      label: "About",
      description: "Who I am, and the way I work.",
      links: [
        { label: "Introduction", href: "#intro" },
        { label: "How I work", href: "#process" },
      ],
    },
    {
      label: "Work",
      description: "Selected work, and the numbers behind it.",
      links: [
        { label: "Selected work", href: "#work" },
        { label: "By the numbers", href: "#numbers" },
        { label: "Handoff", href: "#handoff" },
      ],
    },
    {
      label: "Contact",
      description: "Say hello — I read everything.",
      links: [
        { label: "Email", href: "mailto:{email}" },
        { label: "GitHub", href: "https://github.com" },
      ],
    },
  ],
});

/* ---------------- 首屏 ---------------- */
export const hero = f({
  title: "I design the thing, then I build it.",
  sub: "I'm {name} — an interface designer who ships front-end. I take a page from the first sketch through type, motion and code, and I stay until the details hold on a phone.",
  primary: { label: "Say hello", href: "mailto:{email}", cursor: "Say hello" },
  secondary: { label: "Read on", href: "#intro", cursor: "Read on" },
  image: "/img/hero.jpg",
});

/* ---------------- 01 介绍 ---------------- */
export const intro = f({
  eyebrow: "01 — Introduction",
  title: "A portfolio should read like a publication.",
  lede: "Type leads, surfaces breathe, and one quiet thread carries the whole system. This page is the same idea at a personal scale: who I am, how I work, and what I hand over.",
  actions: [
    { label: "Read the method", href: "#process", cursor: "Next", kind: "dark" },
    { label: "Ask me anything", href: "mailto:{email}", cursor: "Email", kind: "outline" },
  ],
  image: "/img/detail.jpg",
  alt: "Detail of a painted cumulus cloud",
  caption: ["Plate 01 — Cloud study", "Spring {year}"],
  stats: [
    { value: "06", label: "Years" },
    { value: "12", label: "Projects" },
    { value: "03", label: "Disciplines" },
    { value: "24", label: "Clients" },
  ],
});

/* ---------------- 02 做法 ---------------- */
export const process = {
  eyebrow: "02 — How I work",
  title: "Three passes, no detours.",
  steps: [
    {
      index: "01",
      name: "Frame it",
      text: "I read the brief until the real constraint shows up — usually it is not the one written on the first slide. Then I write the page in plain sentences before drawing a single box.",
    },
    {
      index: "02",
      name: "Draw it",
      text: "Type, grid, spacing, motion. One thread carries the system end to end, so a button and a headline feel like they belong to the same publication.",
    },
    {
      index: "03",
      name: "Build it",
      text: "React, GSAP, a careful eye on the 390px viewport. I ship the page myself, which means the design survives contact with the browser.",
    },
  ],
};

/* ---------------- 03 作品 ---------------- */
export const works = {
  eyebrow: "03 — Selected work",
  title: "Three kinds of work.",
  note: "Three categories, three cards — drag them sideways. Until the real case studies land, the artwork is a crop of the same sky.",
  items: [
    {
      index: "01 / Product",
      title: "Product surfaces",
      text: "Screens that have to hold a lot of numbers without shouting. Tables, filters, empty states — drawn as one system, shipped as one system.",
      image: "/img/work-1.jpg",
      alt: "Cloud study used as artwork for the product surface card",
      tags: ["Design system", "Tables", "Empty states"],
      likes: 1204,
      stats: [
        { value: "08", label: "Screens" },
        { value: "03", label: "Systems" },
      ],
    },
    {
      index: "02 / Front-end",
      title: "Front-end builds",
      text: "The part where a design meets a real browser. Type scales that survive at 390px, motion that keeps 60fps, and layouts that do not shift.",
      image: "/img/work-2.jpg",
      alt: "Cloud study used as artwork for the front-end card",
      tags: ["React", "GSAP", "Responsive"],
      likes: 862,
      stats: [
        { value: "12", label: "Builds" },
        { value: "98", label: "Lighthouse" },
      ],
    },
    {
      index: "03 / Motion",
      title: "Motion studies",
      text: "Short loops that explain a transition better than a paragraph. Built with GSAP, tuned by eye, and always respectful of reduced-motion.",
      image: "/img/work-3.jpg",
      alt: "Cloud study used as artwork for the motion card",
      tags: ["Scroll", "Micro-interaction", "60fps"],
      likes: 431,
      stats: [
        { value: "24", label: "Loops" },
        { value: "60", label: "FPS" },
      ],
    },
  ],
};

/* ---------------- 04 协作 ---------------- */
export const handoff = f({
  eyebrow: "04 — Working together",
  title: "The handoff stops being the hard part.",
  lede: "Most of the work is not the drawing. It is the trail behind it: the files, the notes, the reason a thing moved two pixels. I keep that trail short enough to read.",
  points: [
    {
      title: "Files arrive named",
      text: "No final-final-v3. Layers, tokens and exports follow one convention, so the next person can find things.",
    },
    {
      title: "Decisions live in one place",
      text: "Every change gets a short note: what moved, why, and what it costs. Nothing important hides in a chat thread.",
    },
    {
      title: "Handoff you can read later",
      text: "A page per component, a spec per motion. If I disappear for a week, the build still moves.",
    },
  ],
  panelTitle: "Handoff",
  badge: "12 files",
  panelNote: "This week",
  foot: "Hover a row — the selection ring follows with a spring.",
  actions: [
    { label: "Ask for a walkthrough", href: "mailto:{email}", cursor: "Ask", kind: "dark" },
    { label: "See the method", href: "#process", cursor: "Method", kind: "link" },
  ],
  items: [
    { icon: "figma", title: "Design tokens.fig", description: "84 variables", meta: "2m" },
    { icon: "image", title: "hero-1280.jpg", description: "2.4 MB", meta: "18m" },
    { icon: "code", title: "landing.tsx", description: "12 KB", meta: "1h" },
    { icon: "pdf", title: "motion-spec.pdf", description: "6 pages", meta: "3h" },
    { icon: "note", title: "case-study.md", description: "1,240 words", meta: "1d" },
    { icon: "zip", title: "brand-kit.zip", description: "1.2 MB", meta: "2d" },
    { icon: "image", title: "og-image.png", description: "480 KB", meta: "3d" },
    { icon: "code", title: "tokens.css", description: "6 KB", meta: "5d" },
    { icon: "note", title: "release-notes.md", description: "820 words", meta: "1w" },
  ],
});

/* ---------------- 05 数据 ---------------- */
export const numbers = f({
  eyebrow: "05 — By the numbers",
  title: "Work you can measure.",
  lede: "Flip a card for the number behind it. Nothing here is a claim I cannot point at a source for.",
  cards: [
    {
      id: "delivery",
      kicker: "Delivery",
      title: "Pages shipped",
      text: "Every page I hand over is built, not exported. Design and code leave together, in the same folder.",
      value: "24",
      unit: "pages",
      foot: "since 2020",
      back: {
        title: "By year",
        rows: [
          ["2025", "12"],
          ["2024", "8"],
          ["2023", "4"],
        ],
        bars: [4, 8, 12],
        source: "Source — handover log, updated weekly",
      },
    },
    {
      id: "performance",
      kicker: "Performance",
      title: "Lighthouse",
      text: "Measured on a mid-range phone over 4G, not on my laptop. If it is slow there, it is slow.",
      value: "98",
      unit: "/ 100",
      foot: "median score",
      back: {
        title: "Last five builds",
        rows: [
          ["LCP", "1.2s"],
          ["CLS", "0.01"],
          ["TBT", "90ms"],
        ],
        bars: [92, 95, 96, 98, 98],
        source: "Source — PageSpeed, mobile preset",
      },
    },
    {
      id: "response",
      kicker: "Response",
      title: "Reply time",
      text: "Most messages get an answer the same working day. Long answers are written, not typed in a hurry.",
      value: "4",
      unit: "hours",
      foot: "median",
      back: {
        title: "This quarter",
        rows: [
          ["Median", "4h"],
          ["Longest", "12h"],
          ["Open threads", "2"],
        ],
        bars: [3, 5, 4, 6, 4],
        source: "Source — inbox, last 90 days",
      },
    },
  ],
  dashboard: {
    label: "Studio / visitors",
    tabs: ["1D", "1W", "1M", "6M", "YTD", "All"],
    activeTab: 2,
    live: "Live",
    value: "24,180",
    delta: "+2.84%",
    sub: "+676 this month",
    chart: [28, 34, 31, 45, 42, 56, 49, 63, 58, 71, 66, 84, 79, 92],
    tiles: [
      { label: "Sessions", value: "36,420", delta: "+4.1%" },
      { label: "Bounce", value: "38.2%", delta: "-1.3%" },
      { label: "Avg. time", value: "2m 14s", delta: "+8s" },
    ],
    activityTitle: "Session activity",
    activity: [
      { time: "09:42", text: "Case study opened — 6 views", delta: "+6" },
      { time: "08:15", text: "CV downloaded from the footer", delta: "1" },
      { time: "07:03", text: "New inquiry — studio form", delta: "+1" },
    ],
    watchTitle: "Watchlist",
    watchAdd: "+ Add",
    watch: [
      { abbr: "PA", name: "Pages", value: "24", delta: "+12" },
      { abbr: "MO", name: "Motion", value: "09", delta: "+3" },
      { abbr: "SY", name: "Systems", value: "04", delta: "+1" },
      { abbr: "WR", name: "Writing", value: "11", delta: "+2" },
    ],
    quick: {
      label: "Next open slot",
      value: "March 2026",
      text: "Two project slots per quarter, so the work stays readable.",
      cta: { label: "Book a call", href: "mailto:{email}" },
    },
  },
});

/* ---------------- 06 收尾 ---------------- */
export const closing = f({
  title: "Let's make something quiet.",
  emailLabel: "{email}",
  topLabel: "Back to top",
  bell: {
    off: "Notify me",
    on: "You'll be notified",
    note: "One note per new project — nothing else.",
  },
  footer: ["© {year} {name}", "Built with React & GSAP"],
});

export const content = {
  site,
  welcome,
  nav,
  hero,
  intro,
  process,
  works,
  handoff,
  numbers,
  closing,
};
