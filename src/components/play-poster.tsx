"use client";

import { useState } from "react";

/**
 * El juego no se carga hasta que se pulsa: así la ficha no descarga un juego
 * entero (ni arranca su audio) solo por visitarla.
 */
export function PlayPoster({ url, name, label, hint }: { url: string; name: string; label: string; hint: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing) return <iframe src={url} title={name} className="game-frame" allow="fullscreen; autoplay" />;
  return (
    <button type="button" className="poster" onClick={() => setPlaying(true)}>
      <span aria-hidden>▶</span>
      {label}
      <small>{hint}</small>
    </button>
  );
}
