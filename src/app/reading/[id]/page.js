import Link from "next/link";
import { notFound } from "next/navigation";
import { VISIBLE_ARTICLES, getArticleById } from "@/components/BookLogCarousel/articles";

export function generateStaticParams() {
  return VISIBLE_ARTICLES.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const a = getArticleById(id);
  if (!a) return {};
  return { title: `${a.title} — Harry Spawforth`, description: a.subtitle };
}

export default async function ReadingNotePage({ params }) {
  const { id } = await params;
  const a = getArticleById(id);
  if (!a) notFound();

  /* Sentence-case the category label (e.g. "ESSAY" → "Essay") so the
     eyebrow reads quietly rather than shouting in full caps. */
  const sectionLabel = a.section
    ? a.section.charAt(0).toUpperCase() + a.section.slice(1).toLowerCase()
    : null;

  return (
    <main className="page">
      <article className="col case-study reading-note">
        <div className="case-study__eyebrow">
          {[sectionLabel, a.date, a.readtime].filter(Boolean).join(" · ")}
        </div>
        <h1 className="case-study__title">
          {a.part ? `${a.part}: ` : ""}
          {a.title}
        </h1>
        <p className="case-study__lede">{a.subtitle}</p>

        <div className="case-study__meta">
          <dl><dt>Author</dt><dd>{a.author}</dd></dl>
          <dl><dt>Published</dt><dd>{a.date}</dd></dl>
        </div>

        {a.body ? (
          <section className="case-study__body">
            {a.body.map((para, i) => (
              <p key={i} className="case-study__paragraph">{para}</p>
            ))}
          </section>
        ) : (
          (a.sections ?? []).map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.label}</h2>
              {s.id === "excerpt" ? (
                <p>{a.excerpt}</p>
              ) : (
                <p>
                  Placeholder for the {s.label.toLowerCase()} of this note.
                </p>
              )}
            </section>
          ))
        )}

        {a.next && (
          <Link href={`/reading/${a.next.id}`} className="reading-next">
            <span className="reading-next__label">Continue reading</span>
            <span className="reading-next__title">
              {a.next.label}
              {a.next.title ? ` · ${a.next.title}` : ""}
            </span>
            <svg
              className="reading-next__arrow"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="8" x2="13" y2="8" />
              <polyline points="9 4 13 8 9 12" />
            </svg>
          </Link>
        )}
      </article>
    </main>
  );
}
