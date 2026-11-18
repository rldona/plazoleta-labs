"use client";

import Link from "next/link";
import { useState } from "react";
import { STAGE_KEYS, getStages, type Stage } from "@/content/projects";
import { getUi } from "@/content/ui";
import { projectPath, type Lang } from "@/lib/i18n";
import { Ago } from "./ago";

export type TabItem = { slug: string; name: string; language: string; stage: Stage; updatedAt: string | null };

export function StageTabs({ items, lang }: { items: TabItem[]; lang: Lang }) {
  const STAGES = getStages(lang);
  const t = getUi(lang).tabs;
  const [tab, setTab] = useState<Stage>("product");
  const stages = STAGE_KEYS;
  const visible = items.filter((p) => p.stage === tab);

  return (
    <>
      <div className="all-head">
        <h2>{t.all}</h2>
        <div className="tabs" role="tablist" aria-label={t.stage}>
          {stages.map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              id={`tab-${s}`}
              aria-selected={s === tab}
              aria-controls="tab-panel"
              onClick={() => setTab(s)}
            >
              {STAGES[s].title}
              <span className="count">{items.filter((p) => p.stage === s).length}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="tab-note">{STAGES[tab].note}</p>
      <div className="mini" role="tabpanel" id="tab-panel" aria-labelledby={`tab-${tab}`}>
        {visible.map((p) => (
          <Link key={p.slug} href={projectPath(lang, p.slug)}>
            <b>{p.name}</b>
            <small>
              {p.language}
              {p.updatedAt && (
                <>
                  {" · "}
                  <Ago iso={p.updatedAt} lang={lang} />
                </>
              )}
            </small>
          </Link>
        ))}
      </div>
    </>
  );
}
