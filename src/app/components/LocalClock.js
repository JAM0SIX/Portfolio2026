"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import CursorToggle from "./CursorToggle";

export default function LocalClock() {
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
    <div className="local-clock">
      <CursorToggle />
      <ThemeToggle />
      <div className="id-meta" aria-label="Local time in London">
        <span className="id-location">
          <span className="dot" aria-hidden="true" />
          <span>London</span>
        </span>
        <span className="id-sep" aria-hidden="true">,</span>
        <span className="id-time">{time || "--:--"}</span>
      </div>
    </div>
  );
}
