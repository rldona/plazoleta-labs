/**
 * Marca de Plazoleta, copiada de plazoleta.dev (src/components/logo.tsx).
 * Es monolínea: lienzo de 500 y trazo de 25. No la retoques a ojo.
 */

export const LOGO_VIEWBOX = "0 0 500 500";
export const LOGO_STROKE = 25;

export const LOGO_PATHS = [
  "M37.347,98.12L111.748,41.122L462.652,41.122L462.652,393.604L386.463,458.878L37.347,458.878L37.347,98.12Z",
  "M106.955,49.811L106.955,385.272L185.161,321.741L185.573,123.821L387.914,123.821L387.914,453.824L387.914,123.821L318.141,192.317L185.573,192.317L318.141,192.317L318.141,321.741L185.161,321.741L318.141,321.741L318.141,385.272L106.955,385.272",
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      fill="none"
      stroke="currentColor"
      strokeWidth={LOGO_STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
