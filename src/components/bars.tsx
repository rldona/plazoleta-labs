/** Barras de commits por semana. */
export function Bars({ values, label, min = 3 }: { values: number[]; label: string; min?: number }) {
  const max = Math.max(...values, 1);
  return (
    <div className="bars" role="img" aria-label={label}>
      {values.map((v, i) => (
        <i key={i} style={{ height: `${Math.max(min, (v / max) * 100)}%` }} />
      ))}
    </div>
  );
}
