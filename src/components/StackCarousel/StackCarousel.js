"use client";

/* StackCarousel — Cover Flow / slide-projector style stack.
   --------------------------------------------------------
   Three cards visible; the back two are tilted on the Y-axis and
   recede up and left. Advancing tweens every card's rotateY, position,
   and scale together so the front card "flips away" as the next
   rotates upright. Mobile (<= mobileBreakpoint) collapses to a single
   swipeable card.

   Ported from a Framer source. Framer-specific imports / property
   controls stripped; defaults baked in via destructuring. */

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

// --------- Defaults ---------

const DEFAULT_CARDS = [
  {
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
    title: "Stat Stat Stat",
    description:
      "Improve efficiency, save money, increase data productivity across research and operations teams.",
    buttonLabel: "Open project",
    buttonLink: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200",
    title: "Mountain View",
    description:
      "A second card with its own story. Each slide's copy swaps in when it reaches the front.",
    buttonLabel: "Open project",
    buttonLink: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200",
    title: "Forest Run",
    description:
      "Descriptions crossfade as the stack cycles. Everything stays in sync with the front card.",
    buttonLabel: "Open project",
    buttonLink: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
    title: "Open Fields",
    description:
      "Hover the front card for a small lift. Auto-advance pauses while you hover.",
    buttonLabel: "Open project",
    buttonLink: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    title: "Alpine Lake",
    description:
      "Use the arrows below to step forward or back. Pills show where you are in the stack.",
    buttonLabel: "Open project",
    buttonLink: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=1200",
    title: "Rolling Hills",
    description:
      "On mobile, the stack collapses to a single swipeable card for a cleaner small-screen view.",
    buttonLabel: "Open project",
    buttonLink: "#",
  },
];

// --------- Helpers ---------

const getSlot = (cardIndex, activeIndex, total) =>
  (cardIndex - activeIndex + total) % total;

const TILT_DEG = 35;
const FRONT_TILT_DEG = 8;
const DISSOLVE_MS = 650;

const dissolveTransform = () => ({
  x: 0,
  y: 0,
  z: 180,
  rotateY: FRONT_TILT_DEG,
  scale: 1.08,
  opacity: 0,
  zIndex: 40,
});

const slotTransform = (slot) => {
  switch (slot) {
    case 0:
      return { x: 0, y: 0, z: 0, rotateY: FRONT_TILT_DEG, scale: 1, opacity: 1, zIndex: 30 };
    case 1:
      return { x: -90, y: -28, z: -140, rotateY: TILT_DEG, scale: 0.94, opacity: 0.95, zIndex: 20 };
    case 2:
      return { x: -160, y: -52, z: -280, rotateY: TILT_DEG, scale: 0.88, opacity: 0.75, zIndex: 10 };
    default:
      return { x: -160, y: -52, z: -280, rotateY: TILT_DEG, scale: 0.88, opacity: 0, zIndex: 0 };
  }
};

const STAGE_PAD_LEFT = 180;
const STAGE_PAD_TOP = 70;
const REFLECTION_HEIGHT_RATIO = 0.6;

// --------- Component ---------

export default function StackCarousel({
  cards = DEFAULT_CARDS,
  autoAdvance = true,
  autoAdvanceInterval = 4000,
  backgroundColor = "#F4F6F6",
  cardRadius = 20,
  cardWidth = 520,
  cardHeight = 340,
  descriptionColor = "#475569",
  titleColor = "#0F172A",
  accentColor = "#0F172A",
  mobileBreakpoint = 1024,
  font = "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
} = {}) {
  const data = cards && cards.length > 0 ? cards : DEFAULT_CARDS;
  const total = data.length;

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();

  const [departingIndex, setDepartingIndex] = React.useState(null);
  const dissolveTimer = React.useRef(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [mobileBreakpoint]);

  const cardsColumnRef = React.useRef(null);
  const [columnWidth, setColumnWidth] = React.useState(null);
  React.useEffect(() => {
    const el = cardsColumnRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (typeof w === "number") setColumnWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const preferredStageWidth = cardWidth + STAGE_PAD_LEFT;
  const fit =
    columnWidth && columnWidth < preferredStageWidth
      ? columnWidth / preferredStageWidth
      : 1;
  const fittedCardWidth = Math.round(cardWidth * fit);
  const fittedCardHeight = Math.round(cardHeight * fit);
  const fittedPadLeft = Math.round(STAGE_PAD_LEFT * fit);
  const fittedPadTop = Math.round(STAGE_PAD_TOP * fit);
  const fittedPadBottom =
    Math.round(fittedCardHeight * REFLECTION_HEIGHT_RATIO) + 16;

  const triggerDissolve = React.useCallback((fromIndex) => {
    setDepartingIndex(fromIndex);
    if (dissolveTimer.current !== null) {
      window.clearTimeout(dissolveTimer.current);
    }
    dissolveTimer.current = window.setTimeout(() => {
      setDepartingIndex(null);
      dissolveTimer.current = null;
    }, DISSOLVE_MS);
  }, []);

  const next = React.useCallback(() => {
    setActiveIndex((i) => {
      triggerDissolve(i);
      return (i + 1) % total;
    });
  }, [total, triggerDissolve]);

  const prev = React.useCallback(
    () => setActiveIndex((i) => (i - 1 + total) % total),
    [total],
  );

  const goTo = React.useCallback(
    (target) => {
      const clamped = ((target % total) + total) % total;
      setActiveIndex((current) => {
        if (clamped === current) return current;
        const forward = (clamped - current + total) % total;
        const backward = (current - clamped + total) % total;
        if (forward <= backward) triggerDissolve(current);
        return clamped;
      });
    },
    [total, triggerDissolve],
  );

  React.useEffect(() => {
    return () => {
      if (dissolveTimer.current !== null) {
        window.clearTimeout(dissolveTimer.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!autoAdvance || isHovering || prefersReducedMotion) return;
    const id = window.setInterval(next, autoAdvanceInterval);
    return () => window.clearInterval(id);
  }, [autoAdvance, autoAdvanceInterval, isHovering, next, prefersReducedMotion]);

  if (isMobile) {
    return (
      <div style={{ ...rootStyle, background: backgroundColor, fontFamily: font }}>
        <MobileSwipe
          data={data}
          activeIndex={activeIndex}
          onNext={next}
          onPrev={prev}
          cardRadius={cardRadius}
          titleColor={titleColor}
          descriptionColor={descriptionColor}
          accentColor={accentColor}
        />
        <Pills total={total} activeIndex={activeIndex} onSelect={goTo} accentColor={accentColor} />
      </div>
    );
  }

  return (
    <div
      style={{ ...rootStyle, background: backgroundColor, fontFamily: font }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div style={layoutStyle}>
        <div ref={cardsColumnRef} style={cardsColumnStyle}>
          <div
            style={{
              ...stageStyle,
              width: fittedCardWidth + fittedPadLeft,
              height: fittedCardHeight + fittedPadTop + fittedPadBottom,
            }}
          >
            <div
              style={{
                ...stackStyle,
                width: fittedCardWidth,
                height: fittedCardHeight,
                left: fittedPadLeft,
                top: fittedPadTop,
              }}
            >
              {data.map((card, i) => {
                const slot = getSlot(i, activeIndex, total);
                const isDeparting = departingIndex === i;
                const t = isDeparting ? dissolveTransform() : slotTransform(slot);
                const isFront = slot === 0 && !isDeparting;
                return (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      x: t.x * fit,
                      y: t.y * fit,
                      z: t.z * fit,
                      rotateY: t.rotateY,
                      scale: t.scale,
                      opacity: t.opacity,
                    }}
                    transition={
                      isDeparting
                        ? { duration: DISSOLVE_MS / 1000, ease: [0.4, 0, 0.2, 1] }
                        : {
                            type: "spring",
                            stiffness: 180,
                            damping: 26,
                            mass: 1,
                            opacity: { duration: 0.45 },
                          }
                    }
                    whileHover={isFront ? { y: t.y - 8, scale: 1.015 } : undefined}
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: t.zIndex,
                      transformOrigin: "left center",
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                      willChange: "transform, opacity",
                      pointerEvents: isFront ? "auto" : "none",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: cardRadius,
                        overflow: "hidden",
                        boxShadow: isFront
                          ? "0 40px 80px -24px rgba(15,23,42,0.35)"
                          : "0 20px 40px -20px rgba(15,23,42,0.3)",
                      }}
                    >
                      <CardImage src={card.image} alt={card.title} />
                      <motion.div
                        initial={false}
                        animate={{ opacity: isFront || isDeparting ? 0 : 0.18 }}
                        transition={{ duration: 0.4 }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "#000",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                    <CardReflection src={card.image} alt="" radius={cardRadius} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={sideStyle}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <div
                style={{
                  fontSize: 18,
                  color: titleColor,
                  marginBottom: 8,
                  fontWeight: 400,
                  opacity: 0.85,
                }}
              >
                Research & Ops data tool
              </div>
              <div
                style={{
                  fontSize: 32,
                  color: titleColor,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  marginBottom: 16,
                  lineHeight: 1.1,
                }}
              >
                {data[activeIndex].title}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: descriptionColor,
                  lineHeight: 1.5,
                  maxWidth: 360,
                  marginBottom: 24,
                }}
              >
                {data[activeIndex].description}
              </div>
              <GlassButton
                href={data[activeIndex].buttonLink}
                label={data[activeIndex].buttonLabel}
                color={titleColor}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div style={controlsRowStyle}>
        <button onClick={prev} aria-label="Previous card" style={arrowButtonStyle}>
          <Chevron direction="left" />
        </button>
        <Pills total={total} activeIndex={activeIndex} onSelect={goTo} accentColor={accentColor} />
        <button onClick={next} aria-label="Next card" style={arrowButtonStyle}>
          <Chevron direction="right" />
        </button>
      </div>
    </div>
  );
}

// --------- Sub-components ---------

function CardImage({ src, alt }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      style={{ width: "100%", height: "100%", objectFit: "cover", userSelect: "none" }}
    />
  );
}

function CardReflection({ src, alt, radius }) {
  const maskGradient =
    "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.30) 80%, rgba(0,0,0,0.55) 100%)";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "100%",
        height: "60%",
        marginTop: 6,
        borderRadius: radius,
        overflow: "hidden",
        transform: "scaleY(-1)",
        transformOrigin: "center center",
        WebkitMaskImage: maskGradient,
        maskImage: maskGradient,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        pointerEvents: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "167%",
          objectFit: "cover",
          userSelect: "none",
        }}
      />
    </div>
  );
}

function GlassButton({ href, label, color = "#111" }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const scale = press ? 0.97 : hover ? 1.04 : 1;

  return (
    <a
      href={href || "#"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 24px",
        borderRadius: 999,
        color,
        textDecoration: "none",
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: "-0.005em",
        background: hover
          ? "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.28) 40%, rgba(255,255,255,0.18) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.20) 40%, rgba(255,255,255,0.12) 100%)",
        backdropFilter: "blur(24px) saturate(200%) brightness(1.08)",
        WebkitBackdropFilter: "blur(24px) saturate(200%) brightness(1.08)",
        border: hover
          ? "1px solid rgba(255,255,255,0.65)"
          : "1px solid rgba(255,255,255,0.45)",
        boxShadow: [
          "inset 0 1px 1px rgba(255,255,255,0.85)",
          "inset 0 -2px 4px rgba(15,23,42,0.08)",
          "inset 0 -1px 0 rgba(255,255,255,0.35)",
          "0 2px 4px rgba(15,23,42,0.08)",
          hover ? "0 12px 40px rgba(15,23,42,0.18)" : "0 10px 32px rgba(15,23,42,0.12)",
        ].join(", "),
        transform: `scale(${scale})`,
        transition:
          "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), background 220ms ease, border-color 220ms ease, box-shadow 220ms ease",
        cursor: "pointer",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background:
            "radial-gradient(120% 80% at 50% -20%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.35) 25%, rgba(255,255,255,0) 55%)",
          opacity: hover ? 0.95 : 0.75,
          transition: "opacity 220ms ease",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: 1,
          height: 2,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)",
          filter: "blur(0.5px)",
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: 1,
          height: 1,
          background:
            "linear-gradient(90deg, rgba(255,220,230,0) 0%, rgba(255,245,235,0.8) 50%, rgba(220,230,255,0) 100%)",
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
    </a>
  );
}

function Chevron({ direction }) {
  const d = direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6";
  return (
    <svg
      width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function Pills({ total, activeIndex, onSelect, accentColor }) {
  return (
    <div style={pillsRowStyle} role="tablist" aria-label="Carousel pages">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            aria-label={`Go to card ${i + 1}`}
            aria-selected={isActive}
            role="tab"
            style={{
              width: isActive ? 24 : 8,
              height: 8,
              borderRadius: 999,
              background: isActive ? accentColor : "rgba(15,23,42,0.2)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "width 220ms ease, background 220ms ease",
            }}
          />
        );
      })}
    </div>
  );
}

function MobileSwipe({ data, activeIndex, onNext, onPrev, cardRadius, titleColor, descriptionColor }) {
  const current = data[activeIndex];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        width: "100%",
        maxWidth: 480,
        padding: "0 16px",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 || info.velocity.x < -300) onNext();
            else if (info.offset.x > 60 || info.velocity.x > 300) onPrev();
          }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          style={{
            width: "100%",
            aspectRatio: "4 / 3",
            borderRadius: cardRadius,
            overflow: "hidden",
            boxShadow: "0 20px 50px -20px rgba(15,23,42,0.3)",
            touchAction: "pan-y",
            cursor: "grab",
          }}
        >
          <CardImage src={current.image} alt={current.title} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`text-${activeIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          style={{ textAlign: "center", width: "100%" }}
        >
          <div style={{ fontSize: 22, color: titleColor, fontWeight: 700, marginBottom: 8 }}>
            {current.title}
          </div>
          <div style={{ fontSize: 15, color: descriptionColor, lineHeight: 1.5, marginBottom: 16 }}>
            {current.description}
          </div>
          <GlassButton href={current.buttonLink} label={current.buttonLabel} color={titleColor} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --------- Styles ---------

const rootStyle = {
  width: "100%",
  minHeight: 520,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 24,
  padding: 24,
  boxSizing: "border-box",
};

const layoutStyle = {
  display: "flex",
  alignItems: "center",
  gap: 48,
  width: "100%",
  maxWidth: 1200,
  justifyContent: "center",
  flexWrap: "wrap",
};

const cardsColumnStyle = {
  flex: "1 1 0",
  minWidth: 320,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
};

const stageStyle = {
  position: "relative",
  flexShrink: 0,
  perspective: "1400px",
  perspectiveOrigin: "60% 50%",
};

const stackStyle = {
  position: "absolute",
  transformStyle: "preserve-3d",
};

const sideStyle = {
  flex: "1 1 0",
  minWidth: 280,
  maxWidth: 520,
};

const controlsRowStyle = {
  display: "flex",
  gap: 16,
  alignItems: "center",
  justifyContent: "center",
};

const arrowButtonStyle = {
  width: 40,
  height: 40,
  borderRadius: 999,
  border: "none",
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#111",
};

const pillsRowStyle = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  justifyContent: "center",
};
