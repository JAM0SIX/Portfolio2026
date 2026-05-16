"use client";

import { useEffect, useRef, useState } from "react";

const CYCLE_WORDS = ["code", "build", "ship", "think", "design"];

export default function Hero() {
  const [time, setTime] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const phase = useRef("typing"); // typing | holding | deleting

  useEffect(() => {
    function tick() {
      const now = new Date();
      const s = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      setTime(s);
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // Cycling-word typing animation
  useEffect(() => {
    const word = CYCLE_WORDS[wordIndex];
    let timer;
    if (phase.current === "typing") {
      if (typed.length < word.length) {
        timer = setTimeout(() => setTyped(word.slice(0, typed.length + 1)), 80);
      } else {
        phase.current = "holding";
        timer = setTimeout(() => { phase.current = "deleting"; setTyped((t) => t); }, 1400);
      }
    } else if (phase.current === "deleting") {
      if (typed.length > 0) {
        timer = setTimeout(() => setTyped(word.slice(0, typed.length - 1)), 45);
      } else {
        phase.current = "typing";
        setWordIndex((i) => (i + 1) % CYCLE_WORDS.length);
      }
    }
    return () => clearTimeout(timer);
  }, [typed, wordIndex]);

  const widestWord = CYCLE_WORDS.reduce((a, b) => (b.length > a.length ? b : a));

  return (
    <>
      <div className="hero-identity">
        <span className="avatar" aria-hidden="true" />
        <span className="name">Harry Spawforth</span>
        <div className="id-meta" aria-label="Local time in London">
          <span className="id-location">
            <span className="dot" aria-hidden="true" />
            <span>London</span>
          </span>
          <span className="id-sep" aria-hidden="true">,</span>
          <span className="id-time">{time || "--:--"}</span>
        </div>
      </div>

      <section className="hc-root" id="profile">
        <h1 className="hc-headline">
          I believe the future belongs to designers who can{" "}
          <span className="hc-type" aria-live="polite" aria-label="cycling word">
            <span className="hc-type__prompt" aria-hidden="true">›</span>
            <span className="hc-type__vp">
              <span className="hc-type__ghost">{widestWord}</span>
              <span className="hc-type__overlay">
                <span className="hc-type__text">{typed}</span>
                <span className="hc-type__cursor" aria-hidden="true" />
              </span>
            </span>
          </span>
          . I&apos;ve been enjoying learning how to build and ship products.
        </h1>

        <p className="hc-body">
          I&apos;ve been designing{" "}
          <span className="hc-ink" tabIndex={0} role="button" aria-label="AI software">AI software</span>{" "}
          for over 6 years and even co-founded an AI start-up. Now I help businesses and product teams solve high risk problems with{" "}
          <span className="hc-ink hc-ink--accent" tabIndex={0} role="button" aria-label="design and philosophy">design and philosophy</span>.
        </p>
      </section>
    </>
  );
}
