"use client";

import { useEffect, useRef, useState } from "react";
import ScrambleText from "@/components/ScrambleText/ScrambleText";
import { useEntry, LEVELS } from "./EntryProvider";

const HEADLINE = "Turning complex problems into simple software.";
import navigationLottie from "./lottie/navigation.json";
import databaseLottie from "./lottie/database.json";
import percentLottie from "./lottie/percent.json";
import codeLottie from "./lottie/code.json";

/* Inline annotation glyphs for the hero body copy. Each marks a key
   concept; hovering/focusing one (or tapping on touch) spotlights the
   phrase it annotates — the surrounding copy dims and the phrase lifts
   to full ink, while the glyph's Lottie animation plays. The glyphs
   are the only interactive affordance; the phrase spans are passive.

   Each glyph is a stroke-only Lottie icon rendered to inline SVG; CSS
   recolours the strokes to currentColor so they inherit the glyph's
   ink/accent tone (see .lottie-glyph in globals.css). */
const GLYPH_DATA = {
  link: navigationLottie, // Human-AI interaction — navigation heading arrow
  stack: databaseLottie, // data-rich systems — database cylinder
  think: percentLottie, // philosophy / design — percentage
  expand: codeLottie, // push the boundaries — code brackets
};

/* Users who prefer reduced motion get the glyph as a static first
   frame — playback is suppressed entirely. */
function motionAllowed() {
  return (
    typeof window !== "undefined" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* Lottie player for a single glyph. The browser-only lottie-web runtime
   is loaded lazily inside the effect (never during SSR, per the Next
   guide), then plays only while `play` is true (the spotlight is on),
   resting on its first frame otherwise. */
function LottieGlyph({ data, play }) {
  const hostRef = useRef(null);
  const animRef = useRef(null);
  const playRef = useRef(play);
  playRef.current = play;

  useEffect(() => {
    let cancelled = false;
    let anim = null;
    import("lottie-web").then((mod) => {
      if (cancelled || !hostRef.current) return;
      anim = mod.default.loadAnimation({
        container: hostRef.current,
        renderer: "svg",
        loop: true,
        autoplay: false,
        animationData: data,
        rendererSettings: { progressiveLoad: false },
      });
      animRef.current = anim;
      if (playRef.current && motionAllowed()) anim.goToAndPlay(0, true);
    });
    return () => {
      cancelled = true;
      if (anim) anim.destroy();
      animRef.current = null;
    };
  }, [data]);

  useEffect(() => {
    const anim = animRef.current;
    if (!anim) return;
    if (play && motionAllowed()) anim.goToAndPlay(0, true);
    else anim.goToAndStop(0, true);
  }, [play]);

  return <span ref={hostRef} className="lottie-glyph" aria-hidden="true" />;
}

/* Inline glyph button — the interactive trigger for a spotlight. */
function HeroGlyph({ id, label, active, setActive }) {
  const on = active === id;
  return (
    <button
      type="button"
      className={`hc-glyph${on ? " is-lit" : ""}`}
      aria-pressed={on}
      aria-label={label}
      onMouseEnter={() => setActive(id)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(id)}
      onBlur={() => setActive(null)}
      onClick={() => setActive((cur) => (cur === id ? null : id))}
    >
      <LottieGlyph data={GLYPH_DATA[id]} play={on} />
    </button>
  );
}

/* The emphasised word inside an annotated phrase. A pointer-only
   hover/click affordance that drives the SAME spotlight as the glyph,
   so mousing the word lights its concept. It's a <span>, not a button,
   on purpose: the glyph already owns the keyboard/AT control for this
   concept (focusable, labelled, aria-pressed), so making the word a
   second button would add a duplicate tab stop. Keyboard users get the
   glyph; pointer users get the bigger word target. The lit styling is
   inherited from .hc-mark.is-lit .hc-key once setActive fires. */
function HeroKey({ id, children, active, setActive }) {
  return (
    <span
      className="hc-key"
      onMouseEnter={() => setActive(id)}
      onMouseLeave={() => setActive(null)}
      onClick={() => setActive((cur) => (cur === id ? null : id))}
    >
      {/* Invisible bold twin — reserves the bold width at all times so
          the visible text can swap to bold on spotlight without growing
          the box and shoving the surrounding copy. Both layers stack in
          the same grid cell. */}
      <span className="hc-key__ghost" aria-hidden="true">
        {children}
      </span>
      <span className="hc-key__text">{children}</span>
    </span>
  );
}

export default function Hero() {
  const [time, setTime] = useState("");
  /* Which concept is currently spotlighted (glyph id) or null. */
  const [active, setActive] = useState(null);
  const mark = (id) => `hc-mark${active === id ? " is-lit" : ""}`;

  /* Entry sequence — on first arrival the hero stays hidden (via the
     data-entering boot flag) and reveals in order: H1 scramble → body
     → identity. When not entering, everything renders normally. */
  const { entering, level } = useEntry();
  const reached = (lvl) => !entering || level >= lvl;
  const reveal = (lvl) => (entering && level >= lvl ? " entry-in" : "");
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/London",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className={`hero-identity${reveal(LEVELS.IDENTITY)}`}>
        <span className="avatar" aria-hidden="true" />
        <span className="name">Harry Spawforth</span>
        <div className="id-meta">
          {/* Live location + clock. */}
          <span className="id-meta__row">
            <span className="id-location">
              <span className="dot" aria-hidden="true" />
              <span>London</span>
            </span>
            <span className="id-sep" aria-hidden="true">,</span>
            <span className="id-time">{time || "--:--"}</span>
          </span>
        </div>
      </div>

      <section className="hc-root" id="profile">
        <h1 className={`hc-headline${reveal(LEVELS.H1)}`}>
          {reached(LEVELS.H1) ? (
            <ScrambleText text={HEADLINE} stagger={18} as="text" />
          ) : (
            <span aria-hidden="true">{HEADLINE}</span>
          )}
        </h1>

        <div
          className={`hc-copy${reveal(LEVELS.BODY)}`}
          data-active={active == null ? undefined : active}
        >
          <p className="hc-body">
            A{" "}
            <span className={mark("link")}>
              <HeroKey id="link" active={active} setActive={setActive}>
                strategic
              </HeroKey>
            </span>
            <HeroGlyph
              id="link"
              label="Spotlight: strategic product design"
              active={active}
              setActive={setActive}
            />{" "}
            <span className={mark("link")}>designer</span>{" "}
            <span className={mark("expand")}>crafting</span>{" "}
            <span className={mark("expand")}>
              <HeroKey id="expand" active={active} setActive={setActive}>
                experiences
              </HeroKey>
            </span>
            <HeroGlyph
              id="expand"
              label="Spotlight: experiences people love to use"
              active={active}
              setActive={setActive}
            />{" "}
            <span className={mark("expand")}>people love to use</span>.
          </p>
        </div>
      </section>
    </>
  );
}
