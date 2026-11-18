import Link from "next/link";
import { getUi } from "@/content/ui";
import { homePath, type Lang } from "@/lib/i18n";

export function NotFoundPage({ lang }: { lang: Lang }) {
  const t = getUi(lang).notFound;
  return (
    <section className="notfound">
      <div className="label hot">404</div>
      <h1>{t.h1}</h1>
      <p>{t.body}</p>
      <Link className="btn primary" href={homePath(lang)}>
        {t.back}
      </Link>
    </section>
  );
}
