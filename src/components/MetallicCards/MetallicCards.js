"use client";

/* MetallicCards — Coverflow with WebGL liquid-metal shaders.
   --------------------------------------------------------
   Scroll-pinned section. As the user scrolls through the
   sectionHeightVH-tall outer block, the inner viewport is fixed-pinned
   and a 3D Coverflow rotates through the cards. Each card uses the
   LiquidMetal shader to render its logo with animated metal optics.
   Ported from a Framer source: framer + property controls removed,
   types stripped, defaults baked into the function signature. */

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { LiquidMetal } from "@paper-design/shaders-react";

const DEFAULT_CARDS = [
  {
    image: "https://shaders.paper.design/images/logos/diamond.svg",
    title: "Card One",
    description: "A short description that introduces the first card.",
    colorTint: "#ff6b6b",
  },
  {
    image: "https://shaders.paper.design/images/logos/diamond.svg",
    title: "Card Two",
    description: "A short description that introduces the second card.",
    colorTint: "#4dabf7",
  },
  {
    image: "https://shaders.paper.design/images/logos/diamond.svg",
    title: "Card Three",
    description: "A short description that introduces the third card.",
    colorTint: "#ffd43b",
  },
];

export default function MetallicCards({
  cards = DEFAULT_CARDS,
  perspective = 1200,
  cardWidth = 480,
  cardHeight = 300,
  rotation = 28,
  sideOffset = 220,
  depthOffset = 260,
  sideScale = 0.78,
  sideOpacity = 0.55,
  background = "#0a0a0a",
  sectionHeightVH = 300,
  shaderColorBack = "#aaaaac",
  shaderRepetition = 2,
  shaderSoftness = 0.1,
  shaderShiftRed = 0.3,
  shaderShiftBlue = 0.3,
  shaderDistortion = 0.07,
  shaderContour = 0.4,
  shaderAngle = 70,
  shaderSpeed = 1,
  shaderScale = 0.6,
  titleFont = {},
  descriptionFont = {},
  titleColour = "#ffffff",
  descriptionColour = "rgba(255,255,255,0.7)",
} = {}) {
  const sectionRef = React.useRef(null);
  const lastIndex = cards.length - 1;

  const progress = useMotionValue(0);
  const [pinState, setPinState] = React.useState("before");

  /* Manual scroll spy. position: sticky is unreliable inside some
     wrappers (overflow:hidden ancestors silently break it), so this
     uses getBoundingClientRect + a fixed/absolute swap. */
  React.useEffect(() => {
    let rafId = 0;
    let lastScrollY = -1;

    const update = () => {
      const el = sectionRef.current;
      if (!el) {
        rafId = requestAnimationFrame(update);
        return;
      }

      if (window.scrollY === lastScrollY) {
        rafId = requestAnimationFrame(update);
        return;
      }
      lastScrollY = window.scrollY;

      const rect = el.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportH = window.innerHeight;

      let nextState;
      if (sectionTop > 0) {
        nextState = "before";
      } else if (sectionTop + sectionHeight >= viewportH) {
        nextState = "pinned";
      } else {
        nextState = "after";
      }
      setPinState((prev) => (prev !== nextState ? nextState : prev));

      const scrolledIntoSection = -sectionTop;
      const totalScrollableInSection = sectionHeight - viewportH;
      const p =
        totalScrollableInSection > 0
          ? Math.max(0, Math.min(1, scrolledIntoSection / totalScrollableInSection))
          : 0;
      progress.set(p);

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [progress]);

  const rawIndex = useTransform(
    progress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 0, 1, 1, 2, 2],
    { clamp: true },
  );

  const smoothIndex = useSpring(rawIndex, {
    stiffness: 140,
    damping: 26,
    mass: 0.8,
  });

  const [activeIndex, setActiveIndex] = React.useState(0);
  React.useEffect(() => {
    const unsubscribe = smoothIndex.on("change", (v) => {
      const rounded = Math.max(0, Math.min(lastIndex, Math.round(v)));
      setActiveIndex((prev) => (prev !== rounded ? rounded : prev));
    });
    return unsubscribe;
  }, [smoothIndex, lastIndex]);

  const activeCard = cards[activeIndex] || cards[0];

  return (
    <div
      ref={sectionRef}
      style={{
        width: "100%",
        height: `${sectionHeightVH}vh`,
        minHeight: `${sectionHeightVH}vh`,
        position: "relative",
        background,
      }}
    >
      <div
        style={{
          position: pinState === "pinned" ? "fixed" : "absolute",
          top:
            pinState === "after"
              ? `calc(${sectionHeightVH}vh - 100vh)`
              : 0,
          left: 0,
          width: pinState === "pinned" ? "100vw" : "100%",
          height: "100vh",
          overflow: "hidden",
          perspective: `${perspective}px`,
          perspectiveOrigin: "50% 50%",
          background,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {cards.map((card, i) => (
            <Card
              key={i}
              index={i}
              card={card}
              smoothIndex={smoothIndex}
              isActive={i === activeIndex}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              rotation={rotation}
              sideOffset={sideOffset}
              depthOffset={depthOffset}
              sideScale={sideScale}
              sideOpacity={sideOpacity}
              shaderColorBack={shaderColorBack}
              shaderRepetition={shaderRepetition}
              shaderSoftness={shaderSoftness}
              shaderShiftRed={shaderShiftRed}
              shaderShiftBlue={shaderShiftBlue}
              shaderDistortion={shaderDistortion}
              shaderContour={shaderContour}
              shaderAngle={shaderAngle}
              shaderSpeed={shaderSpeed}
              shaderScale={shaderScale}
            />
          ))}
        </div>

        <DescriptionPanel
          activeIndex={activeIndex}
          title={activeCard.title}
          description={activeCard.description}
          titleFont={titleFont}
          descriptionFont={descriptionFont}
          titleColour={titleColour}
          descriptionColour={descriptionColour}
        />

        <Dots count={cards.length} smoothIndex={smoothIndex} />
      </div>
    </div>
  );
}

function DescriptionPanel({
  activeIndex,
  title,
  description,
  titleFont,
  descriptionFont,
  titleColour,
  descriptionColour,
}) {
  const titleStyle = {
    margin: 0,
    marginBottom: 6,
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
    color: titleColour,
    ...titleFont,
  };
  const descriptionStyle = {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: 400,
    color: descriptionColour,
    maxWidth: 520,
    marginInline: "auto",
    ...descriptionFont,
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 80,
        display: "flex",
        justifyContent: "center",
        paddingInline: 16,
        pointerEvents: "none",
      }}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          style={{ textAlign: "center", width: "100%" }}
        >
          <h3 style={titleStyle}>{title}</h3>
          <p style={descriptionStyle}>{description}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Card({
  index,
  card,
  smoothIndex,
  isActive,
  cardWidth,
  cardHeight,
  rotation,
  sideOffset,
  depthOffset,
  sideScale,
  sideOpacity,
  shaderColorBack,
  shaderRepetition,
  shaderSoftness,
  shaderShiftRed,
  shaderShiftBlue,
  shaderDistortion,
  shaderContour,
  shaderAngle,
  shaderSpeed,
  shaderScale,
}) {
  const distance = useTransform(smoothIndex, (v) => index - v);
  const x = useTransform(distance, (d) => d * sideOffset);
  const z = useTransform(distance, (d) => -Math.abs(d) * depthOffset);
  const rotateY = useTransform(distance, (d) => {
    const clamped = Math.max(-1, Math.min(1, d));
    return -clamped * rotation;
  });
  const cardScale = useTransform(distance, (d) => {
    const t = Math.min(1, Math.abs(d));
    return 1 - t * (1 - sideScale);
  });
  const opacity = useTransform(distance, (d) => {
    const t = Math.min(1, Math.abs(d));
    return 1 - t * (1 - sideOpacity);
  });
  const filter = useTransform(distance, (d) => {
    const t = Math.min(1, Math.abs(d));
    return `saturate(${1 - t})`;
  });

  return (
    <motion.div
      style={{
        position: "absolute",
        width: cardWidth,
        height: cardHeight,
        borderRadius: 18,
        overflow: "hidden",
        transformStyle: "preserve-3d",
        x,
        z,
        rotateY,
        scale: cardScale,
        opacity,
        filter,
        boxShadow:
          "0 30px 60px -20px rgba(0,0,0,0.5), 0 18px 36px -18px rgba(0,0,0,0.4)",
        userSelect: "none",
        background: shaderColorBack,
      }}
    >
      {card.image && (
        <LiquidMetal
          image={card.image}
          colorBack={shaderColorBack}
          colorTint={card.colorTint || "#ffffff"}
          repetition={shaderRepetition}
          softness={shaderSoftness}
          shiftRed={shaderShiftRed}
          shiftBlue={shaderShiftBlue}
          distortion={shaderDistortion}
          contour={shaderContour}
          angle={shaderAngle}
          speed={isActive ? shaderSpeed : 0}
          scale={shaderScale}
          fit="contain"
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      )}
    </motion.div>
  );
}

function Dots({ count, smoothIndex }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} index={i} smoothIndex={smoothIndex} />
      ))}
    </div>
  );
}

function Dot({ index, smoothIndex }) {
  const opacity = useTransform(smoothIndex, (v) => {
    const d = Math.abs(index - v);
    return Math.max(0.3, 1 - d * 0.6);
  });
  const scale = useTransform(smoothIndex, (v) => {
    const d = Math.abs(index - v);
    return d < 0.5 ? 1.2 : 1;
  });
  return (
    <motion.div
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        background: "#fff",
        opacity,
        scale,
      }}
    />
  );
}
