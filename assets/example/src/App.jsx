import React, { useEffect } from "react";
import TargetCursor from "./TargetCursor";
import { welcome, site } from "./content";
import "./index.css";

export default function WelcomePage() {
  useEffect(() => {
    document.title = welcome.docTitle;
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

      <main className="hero">
        <div className="hero__bg" style={{ backgroundImage: `url(${welcome.image})` }} aria-hidden="true" />

        <div className="hero__inner">
          <h1 className="hero__title">{welcome.title}</h1>
          <p className="hero__sub">{welcome.sub}</p>

          <a
            className="start cursor-target"
            href={welcome.href}
            data-cursor-label={welcome.start}
            aria-label={welcome.startLabel}
          >
            <span>{welcome.start}</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17 17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </main>
    </>
  );
}


