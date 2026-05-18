"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
          I believe the future belongs to designers who can build.
        </h1>

        <p className="hc-body">
          I&apos;ve been designing AI software before the hype and even
          co-founded an AI start-up. Now I help businesses and product teams
          solve high risk problems with design and philosophy. Lately
          I&apos;ve been vibe coding and shipping things of my own, have a
          poke around the{" "}
          <Link href="/experiments" className="link link--ink">experiments</Link>.
        </p>
      </section>
    </>
  );
}
