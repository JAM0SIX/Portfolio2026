"use client";

import Link from "next/link";
import ScrambleText from "@/components/ScrambleText/ScrambleText";

const LAST_UPDATED = "May 16, 2026";

export default function Hero() {
  return (
    <>
      <div className="hero-identity">
        <span className="avatar" aria-hidden="true" />
        <span className="name">Harry Spawforth</span>
        <div className="id-meta">
          <span className="updated">Updated {LAST_UPDATED}</span>
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
