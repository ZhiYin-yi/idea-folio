'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import './SplitText.css';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const EFFECTS = {
  rise: { from: { opacity: 0, y: 40 }, ease: 'power3.out' },
  fade: { from: { opacity: 0 }, ease: 'power2.inOut' },
  blur: { from: { opacity: 0, filter: 'blur(10px)' }, ease: 'power2.out' },
  flip: { from: { opacity: 0, rotationX: -90 }, ease: 'power3.out', perspective: true },
  pop: { from: { opacity: 0, scale: 0 }, ease: 'back.out(1.6)' },
  skew: { from: { opacity: 0, x: -14, skewX: -24 }, ease: 'expo.out' },
  wave: { from: { opacity: 0, y: 24 }, ease: 'power3.out' }
};

const TO = { opacity: 1, y: 0, x: 0, scale: 1, rotationX: 0, skewX: 0, filter: 'blur(0px)' };

/**
 * Letter-splitting reveal, trimmed port of the supplied component:
 * splitType, effect, stagger, trigger-on-view, hover lift, completion callback.
 */
export default function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease,
  splitType = 'chars',
  effect = 'rise',
  trigger = 'view',
  staggerFrom = 'start',
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left',
  tag: Tag = 'p',
  mask = false,
  hoverEffect = 'none',
  color,
  onLetterAnimationComplete
}) {
  const ref = useRef(null);
  const doneRef = useRef(false);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return undefined;

      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      const em = parseFloat(getComputedStyle(el).fontSize) || 16;
      const unit = splitType.includes('chars') ? 'chars' : splitType.includes('words') ? 'words' : 'lines';
      const look = EFFECTS[effect] ?? EFFECTS.rise;
      const from = look.perspective
        ? { ...look.from, transformPerspective: em * 6, transformOrigin: '50% 100%' }
        : { ...look.from };

      const finish = () => {
        if (doneRef.current) return;
        doneRef.current = true;
        onLetterAnimationComplete?.();
      };

      let liftTos = [];
      let cleanupLift = () => {};
      let split;

      // 用 words,chars 嵌套拆分：单词是 inline-block，换行只发生在词与词之间
      const splitConfig = splitType.includes('chars') ? 'words,chars' : splitType;

      split = new GSAPSplitText(el, {
        type: splitConfig,
        smartWrap: true,
        mask: mask ? unit : undefined,
        charsClass: 'split-char',
        wordsClass: 'split-word',
        linesClass: 'split-line',
        reduceWhiteSpace: false,
        onSplit: (self) => {
          const pieces = self[unit];
          setReady(true);
          if (!pieces || !pieces.length) return;

          if (reduce) {
            gsap.set(pieces, { opacity: 1 });
            finish();
            return;
          }

          // 触发点：元素顶部进入视口底部往上 (threshold*100)% 的位置
          const offset = Math.round(Math.min(0.9, Math.max(0, threshold)) * 100);
          const scrollTrigger =
            trigger === 'view'
              ? {
                  trigger: el,
                  start: `top bottom-=${offset}%`,
                  once: true
                }
              : undefined;

          gsap.fromTo(
            pieces,
            { ...from, willChange: 'transform, opacity' },
            {
              ...TO,
              duration,
              ease: ease || look.ease,
              stagger: { each: delay / 1000, from: staggerFrom },
              scrollTrigger,
              onComplete: () => {
                gsap.set(pieces, { clearProps: 'transform,opacity,filter,willChange' });
                finish();
              }
            }
          );

          if (hoverEffect === 'lift') {
            const lift = em * 0.18;
            pushLift(pieces, lift);
          }
        }
      });

      function pushLift(pieces, lift) {
        liftTos = pieces.map((node) =>
          gsap.quickTo(node, 'y', { duration: 0.45, ease: 'power3.out' })
        );
        const onMove = (event) => {
          const box = el.getBoundingClientRect();
          const px = event.clientX - box.left;
          const py = event.clientY - box.top;
          const radius = em * 1.3;
          pieces.forEach((node, i) => {
            const rect = node.getBoundingClientRect();
            const cx = rect.left + rect.width / 2 - box.left;
            const cy = rect.top + rect.height / 2 - box.top;
            const dx = (cx - px) / radius;
            const dy = (cy - py) / (radius * 1.4);
            const target = -lift * Math.exp(-(dx * dx + dy * dy) * 0.5);
            liftTos[i]?.(Math.abs(target) < 0.01 ? 0 : target);
          });
        };
        const onLeave = () => liftTos.forEach((t) => t?.(0));
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        cleanupLift = () => {
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
        };
      }

      return () => {
        cleanupLift();
        split?.revert();
      };
    },
    {
      scope: ref,
      dependencies: [text, duration, delay, effect, splitType],
      revertOnUpdate: true
    }
  );

  return (
    <Tag
      key={text}
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        textAlign,
        display: 'block',
        whiteSpace: 'normal',
        overflowWrap: 'break-word',
        color,
        visibility: ready ? undefined : 'hidden'
      }}
    >
      {text}
    </Tag>
  );
}
