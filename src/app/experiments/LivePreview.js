import Image from "next/image";
import styles from "./page.module.css";

/* LivePreview — a framed thumbnail of the experiment. Fed the themed ring
   render (/experiments/ring/<slug>(-dark).png) — clean studio scenes with no
   site chrome, so the footer never bleeds into the thumbnail. */
export default function LivePreview({ src, alt = "" }) {
  return (
    <div className={styles.thumb}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 720px) 100vw, 720px"
        className={styles.previewImage}
      />
    </div>
  );
}
