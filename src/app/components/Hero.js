"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ScrambleText from "@/components/ScrambleText/ScrambleText";

export default function Hero() {
  const [time, setTime] = useState("");

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
          <ScrambleText
            text="I believe the future belongs to designers who can build."
            stagger={18}
            as="text"
          />
        </h1>

        <p className="hc-body">
          I&apos;ve been designing AI software before the hype and even
          co-founded an AI start-up. I specialise in data-rich systems and
          platforms, boosting user efficiency and productivity through
          design and philosophy.
        </p>
        <p className="hc-body">
          The smarter AI becomes, knowing what not to build with human
          judgement matters more than ever. The best way to keep that
          judgement sharp is being creative and to push the boundaries of
          what a designer is capable of. Check out some of the{" "}
          <Link href="/experiments" className="link link--ink">experiments</Link>{" "}
          I&apos;ve made.
        </p>
      </section>
    </>
  );
}
