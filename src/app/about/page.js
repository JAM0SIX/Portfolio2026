/* /about — single-column magazine-style about page.
   Two main blocks:
     1. A letter card at the top — a note from me to the reader,
        signed off and finished with a photo tucked at the bottom.
     2. A photo gallery below — images that read as a kind of
        self-portrait by association.
   Both styled in page.module.css. */

import Image from "next/image";
import styles from "./page.module.css";

/* Gallery items — mixed list of photos and subsection headings.
   Photos point at files in /public/about/ with a caption and
   optional modifiers:
     wide   — cell spans both columns of the grid
     square — cell uses a 1:1 aspect ratio (overrides the 4:5
              portrait default and the wide variant's 16:9)
   Headings ({ kind: "heading", text: ... }) span the full grid
   width and visually break the gallery into themed sections. */
const ITEMS = [
  { src: "kew.jpg",                caption: "Kew — my favourite place", wide: true, square: true },

  { kind: "heading", text: "My adventures" },
  { src: "mountain-climbing.jpeg", caption: "Mountain climbing",         wide: true, square: true },
  { src: "jumping.jpeg",           caption: "Jumping" },
  { src: "paragliding.avif",       caption: "Paragliding" },

  { kind: "heading", text: "Recent travel to Japan" },
  { src: "tokyo-drifting.jpeg",    caption: "Tokyo drifting" },
  { src: "cherry-blossom.jpg",     caption: "Cherry blossom" },
  { src: "mt-fuji.jpeg",           caption: "Mt Fuji" },
  { src: "japan-aesthetics.jpeg",  caption: "Tea room" },
  { src: "mountain.jpeg",          caption: "Yoti",                      wide: true },

  { kind: "heading", text: "Icons" },
  { src: "florence.jpeg",          caption: "Florence" },
  { src: "mona-lisa.jpeg",         caption: "Mona Lisa" },
  { src: "taj-mahal.jpg",          caption: "Taj Mahal",                 wide: true, square: true },

  { src: "vibrant.jpeg",           caption: "Tripping" },
  { src: "cowboy.jpeg",            caption: "Howdy" },
  { src: "superman.jpeg",          caption: "Also, I can't deny that I'm Superman", wide: true },
];

export default function AboutPage() {
  return (
    <main className="page">
      <div className="col">
        <div className={styles.page}>

          {/* ── Letter ─────────────────────────────────────── */}
          <article className={styles.letter} aria-label="A note from Harry">
            <h1 className={styles.letterHeader}>Hiya,</h1>

            <div className={styles.letterBody}>
              <p>
                I&apos;m a native AI designer and BIMA Rising Star
                award winner, who&apos;s been creating AI software for
                over 6 years. In that time I&apos;ve co-founded an AI
                medical app and have worked across some fascinating
                industries — most notably finance, professional
                services and health.
              </p>
              <p>
                My workflow now runs on V0, Claude, Cursor, Vercel,
                GitHub and MCPs alongside the usual design tools, a
                stack that&apos;s 10x&apos;d my output and lets me
                ship, not just design. I work end-to-end: designing,
                vibe-coding, and deploying as a single product
                designer. Increasingly an AX designer as much as a
                UX one, since the surface I&apos;m shaping is just
                as often an agent as a person.
              </p>
              <p>Thanks for stopping by,</p>
            </div>

            {/* Sign-off row: name + role + handwritten signature on
                the left, polaroid photo on the right. The block
                reads as a hand-signed letterhead — typed name and
                title above the actual signature, photo tucked at
                the far right. */}
            <div className={styles.signoff}>
              <div className={styles.signatureBlock}>
                <p className={styles.signatureName}>Harry Spawforth</p>
                <p className={styles.signatureRole}>Senior Product Design</p>
                <Image
                  className={styles.signatureImg}
                  src="/about/signature.svg"
                  alt="Harry"
                  width={200}
                  height={80}
                  priority
                />
              </div>
              <figure className={styles.photoFrame}>
                <div className={styles.photoSlot}>
                  <Image
                    src="/about/headshot.jpg"
                    alt="Harry"
                    fill
                    sizes="240px"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
              </figure>
            </div>
          </article>

          {/* ── Photo gallery ──────────────────────────────── */}
          <section className={styles.gallery} aria-label="Photographs">
            <header className={styles.galleryHead}>
              <h2 className={styles.galleryTitle}>
                Pictures from my life
              </h2>
              <p className={styles.galleryDeck}>
                A few of my snaps that I think encapsulates who I am
                as a human.
              </p>
            </header>

            <div className={styles.grid}>
              {ITEMS.map((item, i) => {
                /* Subsection heading — spans both columns and
                   visually breaks the gallery into themed groups. */
                if (item.kind === "heading") {
                  return (
                    <h3 key={`h-${i}`} className={styles.subheading}>
                      {item.text}
                    </h3>
                  );
                }
                const classes = [
                  styles.cell,
                  item.wide && styles.cellWide,
                  item.square && styles.cellSquare,
                ].filter(Boolean).join(" ");
                return (
                  <figure key={item.src} className={classes}>
                    <div className={styles.cellImage}>
                      <Image
                        src={`/about/${item.src}`}
                        alt={item.caption}
                        fill
                        sizes="(max-width: 720px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <figcaption className={styles.cellCaption}>
                      {item.caption}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
