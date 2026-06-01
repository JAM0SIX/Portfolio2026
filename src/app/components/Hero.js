"use client";

import { useEffect, useState } from "react";
import ScrambleText from "@/components/ScrambleText/ScrambleText";

const LAST_UPDATED = "May 16, 2026";

export default function Hero() {
  const [time, setTime] = useState("");
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
      <div className="hero-identity">
        <span className="avatar" aria-hidden="true" />
        <span className="name">Harry Spawforth</span>
        <div className="id-meta">
          {/* Top row — live location + clock; bottom row — the
              last-updated stamp. Stacked so each line reads on its
              own, no inline separators. */}
          <span className="id-meta__row">
            <span className="id-location">
              <span className="dot" aria-hidden="true" />
              <span>London</span>
            </span>
            <span className="id-sep" aria-hidden="true">,</span>
            <span className="id-time">{time || "--:--"}</span>
          </span>
          <span className="id-meta__row updated">Updated: <span className="updated__date">{LAST_UPDATED}</span></span>
        </div>
      </div>

      <section className="hc-root" id="profile">
        <h1 className="hc-headline">
          <ScrambleText
            text="I believe the future belongs to designers who can build."
            stagger={18}
            as="text"
          />
        </h1>

        <p className="hc-body">
          I&apos;ve been a Human-AI interaction designer before the
          hype, and even co-founded an AI start-up along the way. I
          specialise in data-rich systems and platforms, boosting user
          efficiency and productivity through design and philosophy.
        </p>
        <p className="hc-body">
          The smarter AI becomes, knowing what not to build with human
          judgement matters more than ever. The best way to keep that
          judgement sharp is being creative and to push the boundaries
          of what a designer is capable of.
        </p>
      </section>
    </>
  );
}
