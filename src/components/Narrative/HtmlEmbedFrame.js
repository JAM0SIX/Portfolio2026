"use client";

/* HtmlEmbedFrame — the client half of HtmlEmbed.
   -----------------------------------------------
   Holds the responsive <iframe> and, when a `channel` is given, listens
   for height messages the embedded widget posts via window.postMessage
   (`{ type: channel, height: <px> }`). Until the first message arrives it
   falls back to the inline `aspect` ratio, so SSR / no-JS / unknown
   widgets still reserve sensible space. Once a height is received the
   frame switches to that exact pixel height — the widget's natural,
   responsive height — so there's never an inner scrollbar or dead gap.

   Theme bridge: the site themes via a manual `data-theme` attribute on
   <html> that an iframe can't observe. So we push it in — posting
   `{ type:'embed-theme', theme }` to the frame on load and whenever the
   attribute changes (MutationObserver, same signal CursorDotField uses).
   Widgets that opt in apply it; others ignore the message.

   Size caps: `maxWidth` caps the frame width and centres it; `vhCap`
   (a number of svh units) additionally clamps the width to `<vhCap>svh`
   so a tall widget can never exceed ~100vh — it scales down uniformly on
   short viewports instead, geometry untouched. */

import { useEffect, useRef, useState } from "react";
import styles from "./Narrative.module.css";

function currentTheme() {
  if (typeof document === "undefined") return "paper";
  return document.documentElement.dataset.theme === "onyx" ? "onyx" : "paper";
}

export default function HtmlEmbedFrame({
  src,
  title,
  aspect = "1 / 1.05",
  bare = false,
  channel,
  maxWidth,
  vhCap,
}) {
  const [height, setHeight] = useState(null);
  const iframeRef = useRef(null);

  // Receive height reports from the embedded widget.
  useEffect(() => {
    if (!channel) return undefined;
    function onMessage(e) {
      const d = e.data;
      if (!d || d.type !== channel || typeof d.height !== "number") return;
      setHeight(Math.ceil(d.height));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [channel]);

  // Push the host theme into the iframe (load + on toggle).
  useEffect(() => {
    const post = () => {
      const win = iframeRef.current?.contentWindow;
      if (win) win.postMessage({ type: "embed-theme", theme: currentTheme() }, "*");
    };
    const frame = iframeRef.current;
    if (frame) frame.addEventListener("load", post);
    post(); // in case it's already loaded

    const obs = new MutationObserver(post);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      if (frame) frame.removeEventListener("load", post);
      obs.disconnect();
    };
  }, [src]);

  const className = bare
    ? `${styles.htmlEmbedFrame} ${styles.htmlEmbedFrameBare}`
    : styles.htmlEmbedFrame;

  const style = height ? { height } : { aspectRatio: aspect };
  if (maxWidth || vhCap) {
    const cap = maxWidth || "100%";
    style.width = vhCap ? `min(${cap}, ${vhCap}svh)` : cap;
    style.maxWidth = "100%";
    style.marginInline = "auto";
  }

  return (
    <div className={className} style={style}>
      <iframe
        ref={iframeRef}
        src={src}
        title={title || "Embedded widget"}
        loading="lazy"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin"
        className={styles.htmlEmbedIframe}
      />
    </div>
  );
}
