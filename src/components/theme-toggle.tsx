"use client";

import { useSyncExternalStore } from "react";

/**
 * Mismo comportamiento que en plazoleta.dev: el tema vive en la clase `dark` de
 * <html>, resuelta antes del primer pintado por el script del layout, y se
 * guarda en `localStorage.theme`. Los dos iconos se renderizan siempre y CSS
 * decide cuál se ve, así no hay desajuste de hidratación.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const isDarkSnapshot = () => document.documentElement.classList.contains("dark");
const serverSnapshot = () => false;

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, isDarkSnapshot, serverSnapshot);

  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // Storage bloqueado: el tema cambia igual, solo que no persiste.
    }
  }

  return (
    <button type="button" onClick={toggle} aria-pressed={isDark} aria-label="Modo oscuro" className="theme-toggle">
      <svg aria-hidden viewBox="0 0 24 24" className="icon-moon" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
      </svg>
      <svg aria-hidden viewBox="0 0 24 24" className="icon-sun" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
