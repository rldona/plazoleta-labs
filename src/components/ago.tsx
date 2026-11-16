"use client";

import { useSyncExternalStore } from "react";
import { formatDate, relativeTime } from "@/lib/format";

/**
 * Fecha relativa ("hace 5 días").
 *
 * La página es estática y se regenera cada hora, así que un "hace X" calculado
 * en servidor caducaría. En servidor (y en el HTML) va la fecha absoluta; en
 * cuanto hidrata, el cliente la cambia por la relativa con su propia hora.
 * La hora se fija una vez por carga para que el snapshot sea estable.
 */
let now: number | null = null;
const getNow = () => (now ??= Date.now());
const subscribe = () => () => {};

export function Ago({ iso }: { iso: string }) {
  const current = useSyncExternalStore(subscribe, getNow, () => null);
  return (
    <time dateTime={iso} title={formatDate(iso)}>
      {current === null ? formatDate(iso) : relativeTime(iso, current)}
    </time>
  );
}
