import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CodeIcon,
  FigmaIcon,
  FileZipIcon,
  Image01Icon,
  Note01Icon,
  Pdf01Icon,
} from "@hugeicons/core-free-icons";
import CardNav from "./components/CardNav";
import TargetCursor from "./TargetCursor";
import SplitText from "./components/SplitText";
import Carousel from "./components/Carousel";
import AnimatedList from "./components/AnimatedList";
import FlipCard from "./components/FlipCard";
import BellToggle from "./components/BellToggle";
import PulseHeart from "./components/PulseHeart";
import {
  site,
  nav,
  hero,
  intro,
  process as processSection,
  works,
  handoff,
  numbers,
  closing,
} from "./content";
import tone from "./image-tone.json";
import "./about.css";

/* 图片槽位由 src/content.js 决定；图标在这里按 key 映射 */
const HANDOFF_ICONS = {
  figma: FigmaIcon,
  image: Image01Icon,
  code: CodeIcon,
  pdf: Pdf01Icon,
  note: Note01Icon,
  zip: FileZipIcon,
};

const IconChart = (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M4 19V9M10 19V5M16 19v-6M22 19H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconGauge = (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 20a8 8 0 1 1 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 12l4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
  </svg>
);

const IconClock = (
  <svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7.8V12l3 1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const STAT_ICONS = { delivery: IconChart, performance: IconGauge, response: IconClock };

function linePath(values, w = 600, h = 180, pad = 12) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - pad - ((v - min) / span) * (h - pad * 2);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const chartLine = linePath(numbers.dashboard.chart);
const chartArea = `${chartLine} L600 180 L0 180 Z`;

const handoffItems = handoff.items.map((item) => ({
  ...item,
  icon: (
    <HugeiconsIcon icon={HANDOFF_ICONS[item.icon] ?? Image01Icon} size={18} strokeWidth={1.8} />
  ),
}));

function WorkCard({ item }) {
  return (
    <article className="work-card">
      <div className="work-card__media">
        <img src={item.image} alt={item.alt} loading="lazy" />
      </div>
      <div className="work-card__body">
        <div className="work-card__top">
          <span className="work-card__index">{item.index}</span>
          <PulseHeart
            count={item.likes}
            size={24}
            corner={20}
            pillColor="#f1f5fa"
            idleColor="#8b939c"
            textColor="#0a0f15"
            likedColor="#e0445f"
            label={`Like ${item.title}`}
          />
        </div>
        <h3 className="work-card__title">{item.title}</h3>
        <p className="work-card__text">{item.text}</p>
        <ul className="work-card__tags">
          {item.tags.map((tag) => (
            <li className="work-card__tag" key={tag}>
              {tag}
            </li>
          ))}
        </ul>
        <dl className="work-card__stats">
          {item.stats.map((stat) => (
            <div className="work-card__stat" key={stat.label}>
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

function useNarrow(query = "(max-width: 860px)") {
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setNarrow(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return narrow;
}

function BackMark() {
  return (
    <span className="nav-back" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {nav.back}
    </span>
  );
}

function AboutPage() {
  const narrow = useNarrow();
  const dash = numbers.dashboard;

  useEffect(() => {
    document.documentElement.dataset.tone = tone.tone ?? "light";
    document.title = site.title;
  }, []);

  return (
    <>
      <TargetCursor
        spinDuration={2}
        hoverDuration={0.2}
        size={36}
        cornerSize={12}
        thickness={3}
        padding={6}
        dotSize={4}
        cursorColor="#ffffff"
        cursorColorOnTarget="#ffffff"
        blendMode="difference"
        parallaxOn
        matchRadius
        showLabel
        clickEffect
        hideDefaultCursor
      />

      <header className="topbar">
        <CardNav
          logo={<BackMark />}
          logoAlt={nav.backLabel}
          logoHref="/"
          items={nav.groups}
          cta={nav.cta}
          cardEffect="rise"
          openOn="click"
          surface="glass"
          stagger={0.12}
          bounce={0.2}
          menuLabel
          speed={1}
          cardHeight={176}
          maxWidth={800}
          intro
        />
      </header>

      <main className="page">
        <section className="hero">
          <h1 className="hero__title">{hero.title}</h1>
          <p className="hero__sub">{hero.sub}</p>

          <div className="hero__actions">
            <a
              className="pill pill--dark cursor-target"
              href={hero.primary.href}
              data-cursor-label={hero.primary.cursor}
            >
              {hero.primary.label}
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17 17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              className="pill pill--ghost cursor-target"
              href={hero.secondary.href}
              data-cursor-label={hero.secondary.cursor}
            >
              {hero.secondary.label}
            </a>
          </div>
        </section>

        <div className="sections">
          {/* 01 介绍 */}
          <section id="intro" className="block">
            <div className="wrap">
              <div className="intro__grid">
                <div>
                  <p className="eyebrow">{intro.eyebrow}</p>
                  <SplitText
                    tag="h2"
                    className="intro__title"
                    text={intro.title}
                    effect="rise"
                    splitType="chars"
                    delay={26}
                    duration={1.1}
                    staggerFrom="start"
                    trigger="view"
                    hoverEffect="lift"
                    threshold={0.2}
                    textAlign="left"
                  />
                  <p className="intro__lede">{intro.lede}</p>
                  <div className="intro__actions">
                    {intro.actions.map((action) => (
                      <a
                        key={action.label}
                        className={`pill ${action.kind === "outline" ? "pill--outline" : "pill--dark"} cursor-target`}
                        href={action.href}
                        data-cursor-label={action.cursor}
                      >
                        {action.label}
                        {action.kind !== "outline" && (
                          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </a>
                    ))}
                  </div>
                </div>

                <figure className="intro__media">
                  <img src={intro.image} width="900" height="1125" alt={intro.alt} />
                  <figcaption className="intro__cap">
                    <span>{intro.caption[0]}</span>
                    <span>{intro.caption[1]}</span>
                  </figcaption>
                </figure>
              </div>

              <div className="intro__stats">
                {intro.stats.map((stat) => (
                  <div className="stat" key={stat.label}>
                    <b>{stat.value}</b>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 02 做法 */}
          <section id="process" className="block">
            <div className="wrap">
              <p className="eyebrow">{processSection.eyebrow}</p>
              <SplitText
                tag="h2"
                className="process__title"
                text={processSection.title}
                effect="rise"
                splitType="chars"
                delay={30}
                duration={1}
                threshold={0.2}
                hoverEffect="lift"
                textAlign="left"
              />

              <div className="rows">
                {processSection.steps.map((step) => (
                  <div className="row" key={step.index}>
                    <span className="row__index">{step.index}</span>
                    <h3 className="row__name">{step.name}</h3>
                    <p className="row__text">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 03 作品 */}
          <section id="work" className="block">
            <div className="wrap">
              <div className="works__head">
                <div>
                  <p className="eyebrow">{works.eyebrow}</p>
                  <SplitText
                    tag="h2"
                    className="works__title"
                    text={works.title}
                    effect="rise"
                    splitType="chars"
                    delay={30}
                    duration={1}
                    threshold={0.2}
                    hoverEffect="lift"
                    textAlign="left"
                  />
                </div>
                <p className="works__note">{works.note}</p>
              </div>

              <div className="works__carousel">
                <Carousel
                  items={works.items.map((item) => (
                    <WorkCard key={item.index} item={item} />
                  ))}
                  baseWidth={1040}
                  aspectRatio={narrow ? 0.95 : 2.2}
                  peek={narrow ? 0 : 36}
                  gap={16}
                  radius={20}
                  frame={false}
                  effect="slide"
                  indicator="dots"
                  arrows
                  loop={false}
                  draggable
                  theme="light"
                  autoplay={false}
                />
              </div>
            </div>
          </section>

          {/* 04 协作 */}
          <section id="handoff" className="block">
            <div className="wrap inbox">
              <div className="inbox__copy">
                <p className="eyebrow">{handoff.eyebrow}</p>
                <SplitText
                  tag="h2"
                  className="inbox__title"
                  text={handoff.title}
                  effect="rise"
                  splitType="chars"
                  delay={26}
                  duration={1.1}
                  threshold={0.2}
                  hoverEffect="lift"
                  textAlign="left"
                />
                <p className="inbox__lede">{handoff.lede}</p>

                <ul className="inbox__points">
                  {handoff.points.map((point) => (
                    <li className="inbox__point" key={point.title}>
                      <span className="inbox__check" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M5 12.5 10 17l9-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="inbox__point-text">
                        <b>{point.title}</b>
                        <span>{point.text}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="inbox__actions">
                  {handoff.actions.map((action) => (
                    <a
                      key={action.label}
                      className={`pill ${action.kind === "link" ? "pill--link" : "pill--dark"} cursor-target`}
                      href={action.href}
                      data-cursor-label={action.cursor}
                    >
                      {action.label}
                      {action.kind === "link" ? (
                        <span aria-hidden="true">→</span>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>

              <div className="inbox__panel">
                <div className="inbox__panel-head">
                  <span className="inbox__panel-title">
                    {handoff.panelTitle}
                    <span className="inbox__badge">{handoff.badge}</span>
                  </span>
                  <span className="inbox__panel-note">{handoff.panelNote}</span>
                </div>

                <AnimatedList
                  items={handoffItems}
                  animation="pop"
                  theme="light"
                  maxHeight={404}
                  radius={12}
                  gap={8}
                  stagger={0.06}
                  fadeSize={52}
                  frame={false}
                  showGradients
                  displayScrollbar={false}
                  selectOnHover
                  enableArrowNavigation
                  loop={false}
                  animateOnce={false}
                  initialSelectedIndex={0}
                  style={{
                    "--al-width": "100%",
                    "--al-tile": "linear-gradient(180deg, #f6f9fc 0%, #eef4f9 100%)",
                    "--al-tile-edge": "rgba(10, 15, 21, 0.06)",
                    "--al-tile-shadow": "0 1px 2px rgba(10, 15, 21, 0.04)",
                    "--al-well": "#ffffff",
                  }}
                />

                <p className="inbox__panel-foot">{handoff.foot}</p>
              </div>
            </div>
          </section>

          {/* 05 数据 */}
          <section id="numbers" className="block">
            <div className="wrap">
              <div className="numbers__head">
                <div>
                  <p className="eyebrow">{numbers.eyebrow}</p>
                  <SplitText
                    tag="h2"
                    className="numbers__title"
                    text={numbers.title}
                    effect="rise"
                    splitType="chars"
                    delay={30}
                    duration={1}
                    threshold={0.2}
                    hoverEffect="lift"
                    textAlign="left"
                  />
                </div>
                <p className="numbers__lede">{numbers.lede}</p>
              </div>

              <div className="dash__cards">
                {numbers.cards.map((card) => (
                  <FlipCard
                    key={card.id}
                    width={360}
                    height={432}
                    radius={22}
                    background="#ffffff"
                    color="#0a0f15"
                    glareOpacity={0.14}
                    hoverScale={1.02}
                    tiltMax={9}
                    shadow
                    shadowColor="#0a1a2a"
                    shadowOpacity={0.16}
                    ariaLabel={`${card.title} — flip for the data`}
                    front={
                      <div className="fc">
                        <span className="fc__icon">{STAT_ICONS[card.id]}</span>
                        <div className="fc__body">
                          <span className="fc__kicker">{card.kicker}</span>
                          <h3 className="fc__title">{card.title}</h3>
                          <p className="fc__text">{card.text}</p>
                        </div>
                        <div className="fc__foot">
                          <span className="fc__value">
                            {card.value}
                            <i>{card.unit}</i>
                          </span>
                          <span className="fc__note">{card.foot}</span>
                        </div>
                      </div>
                    }
                    back={
                      <div className="fc fc--back">
                        <div className="fc__body">
                          <span className="fc__kicker">Data</span>
                          <h3 className="fc__title">{card.back.title}</h3>
                          <div className="fc__bars" aria-hidden="true">
                            {card.back.bars.map((v, i) => (
                              <span
                                key={i}
                                style={{
                                  height: `${Math.round((v / Math.max(...card.back.bars)) * 100)}%`,
                                }}
                              />
                            ))}
                          </div>
                          <dl className="fc__rows">
                            {card.back.rows.map(([k, v]) => (
                              <div key={k}>
                                <dt>{k}</dt>
                                <dd>{v}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                        <p className="fc__source">{card.back.source}</p>
                      </div>
                    }
                  />
                ))}
              </div>

              <div className="dash">
                <div className="dash__main">
                  <div className="dash__head">
                    <div>
                      <span className="dash__label">{dash.label}</span>
                      <div className="dash__tabs" aria-hidden="true">
                        {dash.tabs.map((tab, i) => (
                          <span key={tab} className={i === dash.activeTab ? "is-on" : undefined}>
                            {tab}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="dash__live">
                      <i />
                      {dash.live}
                    </span>
                  </div>

                  <div className="dash__hero">
                    <span className="dash__value">
                      {dash.value}
                      <span className="dash__delta">{dash.delta}</span>
                    </span>
                    <span className="dash__sub">{dash.sub}</span>
                  </div>

                  <svg className="dash__chart" viewBox="0 0 600 180" preserveAspectRatio="none" aria-hidden="true">
                    <path d={chartArea} className="dash__area" />
                    <path d={chartLine} className="dash__line" />
                  </svg>

                  <div className="dash__tiles">
                    {dash.tiles.map((tile) => (
                      <div className="dash__tile" key={tile.label}>
                        <span>{tile.label}</span>
                        <b>{tile.value}</b>
                        <i>{tile.delta}</i>
                      </div>
                    ))}
                  </div>

                  <div className="dash__activity">
                    <div className="dash__activity-head">
                      <span>{dash.activityTitle}</span>
                      <span className="dash__live">
                        <i />
                        {dash.live}
                      </span>
                    </div>
                    <ul>
                      {dash.activity.map((row) => (
                        <li key={row.time}>
                          <span>{row.time}</span>
                          <b>{row.text}</b>
                          <i>{row.delta}</i>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <aside className="dash__side">
                  <div className="dash__watch">
                    <div className="dash__watch-head">
                      <span>{dash.watchTitle}</span>
                      <span>{dash.watchAdd}</span>
                    </div>
                    <ul>
                      {dash.watch.map((row) => (
                        <li key={row.name}>
                          <span className="dash__abbr">{row.abbr}</span>
                          <span className="dash__name">{row.name}</span>
                          <b>{row.value}</b>
                          <i>{row.delta}</i>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="dash__quick">
                    <span className="dash__label">{dash.quick.label}</span>
                    <b className="dash__quick-value">{dash.quick.value}</b>
                    <p>{dash.quick.text}</p>
                    <a className="pill pill--dark cursor-target" href={dash.quick.cta.href}>
                      {dash.quick.cta.label}
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M7 17 17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          {/* 06 收尾 */}
          <section className="block closing">
            <div className="wrap">
              <SplitText
                tag="h2"
                className="closing__title"
                text={closing.title}
                effect="rise"
                splitType="chars"
                delay={34}
                duration={1.05}
                threshold={0.25}
                hoverEffect="lift"
                textAlign="center"
              />

              <div className="closing__actions">
                <a className="pill pill--dark cursor-target" href={`mailto:${site.email}`} data-cursor-label="Email">
                  {closing.emailLabel}
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M7 17 17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a className="pill pill--outline cursor-target" href="#top" data-cursor-label="Top">
                  {closing.topLabel}
                </a>
              </div>

              <div className="closing__bell">
                <BellToggle
                  offLabel={closing.bell.off}
                  onLabel={closing.bell.on}
                  color="#f5f5f5"
                  background="#0a0f15"
                  onColor="#0a0f15"
                  onBackground="#ffffff"
                  size="md"
                  radius={22}
                  ringAmplitude={17}
                  ringPasses={5}
                  ringDecay={1}
                  ringDuration={820}
                  ringPivot={16}
                  crossfadeMs={200}
                  revealBounce={0}
                  badge={false}
                  waves
                  clapper={false}
                  defaultPressed={false}
                />
                <span className="closing__bell-note">{closing.bell.note}</span>
              </div>

              <div className="footer">
                {closing.footer.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AboutPage />
  </React.StrictMode>
);
