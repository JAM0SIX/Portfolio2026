"use client";

/* ExperimentsCarousel — thin responsive wrapper around CarouselRing.
   ----------------------------------------------------------------
   The ring's card width + radius are derived from the stage width, but
   the proportions that read well on desktop/tablet leave the centre
   image small on a phone. On phones we enlarge the ring so the front
   image dominates and is easy to see; the outer cards are allowed to
   run off-screen. Everything else (label, images, background) passes
   straight through. */

import { useEffect, useMemo, useState } from "react";
import CarouselRing from "@/components/CarouselRing/CarouselRing";
import Ripple from "@/components/Ripple/Ripple";

export default function ExperimentsCarousel(props) {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const update = () => setIsPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* Phone: a clearly visible centre card (~half the viewport) with the
     radius large enough that adjacent cards stay spaced apart rather than
     overlapping (the previous big version overlapped because the radius was
     too small for the card size). Outer cards run off-screen via the
     full-bleed stage.
     Desktop/tablet: the standard proportions (card width clamps on big
     screens; cardWFrac tuned down so the tablet mid-range doesn't sprawl). */
  const sizing = isPhone
    ? {
        cardWFrac: 0.5,
        cardWMin: 150,
        cardWMax: 210,
        radiusFrac: 0.62,
        radiusMin: 170,
        radiusMax: 240,
      }
    : { cardWFrac: 0.3, cardWMin: 90, radiusMin: 110 };

  /* The Ripple card renders live in the ring (ambient only — clicking still
     opens the full experiment). Memoised so its element identity is stable
     and the ring's rAF loop isn't torn down/rebuilt on re-render. */
  const images = useMemo(
    () =>
      (props.images ?? []).map((item) =>
        item && item.slug === "ripple"
          ? { ...item, node: <Ripple interactive={false} spacing={10} /> }
          : item
      ),
    [props.images]
  );

  return <CarouselRing {...props} {...sizing} images={images} />;
}
