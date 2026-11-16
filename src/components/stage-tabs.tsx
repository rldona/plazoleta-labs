"use client";

import Link from "next/link";
import { useState } from "react";
import { STAGES, type Stage } from "@/content/projects";
import { Ago } from "./ago";

export type TabItem = { slug: string; name: string; language: string; stage: Stage; updatedAt: string | null };

export function StageTabs({ items }: { items: TabItem[] }) {
  const [tab, setTab] = useState<Stage>("product");
  const stages = Object.keys(STAGES) as Stage[];
  const visible = items.filter((p) => p.stage === tab);

  return (
    <>
      <div className="all-head">
        <h2>Todos los proyectos</h2>
        <div className="tabs" role="tablist" aria-label="Etapa">
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
          <Link key={p.slug} href={`/${p.slug}`}>
            <b>{p.name}</b>
            <small>
              {p.language}
              {p.updatedAt && (
                <>
                  {" · "}
                  <Ago iso={p.updatedAt} />
                </>
              )}
            </small>
          </Link>
        ))}
      </div>
    </>
  );
}
