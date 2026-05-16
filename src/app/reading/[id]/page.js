import { notFound } from "next/navigation";
import { ARTICLES, getArticleById } from "@/components/BookLogCarousel/articles";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ id: a.id }));
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

  return (
    <main className="page">
      <article className="col case-study">
        <div className="case-study__eyebrow">
          {a.section} · {a.date} · {a.readtime}
        </div>
        <h1 className="case-study__title">{a.title}</h1>
        <p className="case-study__lede">{a.subtitle}</p>

        <div className="case-study__meta">
          <dl><dt>Author</dt><dd>{a.author}</dd></dl>
          <dl><dt>Issue</dt><dd>{a.issue}</dd></dl>
          <dl><dt>Field</dt><dd>{a.field}</dd></dl>
        </div>

        <section>
          <p>{a.excerpt}</p>
        </section>
      </article>
    </main>
  );
}
