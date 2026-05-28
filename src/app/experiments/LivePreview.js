import Image from "next/image";
import styles from "./page.module.css";

/* LivePreview — static screenshot of the experiment, captured at
   1200x720 in headless Chrome and saved to /public/experiments/.
   Re-run scripts/capture-experiments.sh to refresh the images
   when an experiment's visual changes. */
export default function LivePreview({ slug }) {
  return (
    <div className={styles.thumb}>
      <Image
        src={`/experiments/${slug}.png`}
        alt=""
        fill
        sizes="(max-width: 720px) 100vw, 720px"
        className={styles.previewImage}
      />
    </div>
  );
}
