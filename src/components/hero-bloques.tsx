"use client";

import { useEffect, useRef } from "react";

/**
 * El papel milimetrado de la cabecera, de borde a borde, y los bloques que
 * brotan de él al pasar el cursor. Es la versión plana de la plaza de
 * plazoleta.dev: allí son bloques isométricos sobre una retícula; aquí, celdas
 * del papel que se extruyen en oblicuo, la misma proyección que el prisma del
 * logo.
 *
 * Cada celda sortea su altura la primera vez que el cursor se acerca (a veces
 * ninguna) y la conserva mientras siga cerca; al alejarse se hunde y se olvida.
 * Nunca brotan encima del osciloscopio: el dibujo central no se toca.
 *
 * Decorativo (aria-hidden, sin eventos propios: escucha en la sección). El papel
 * es CSS puro y se ve sin JS; los bloques se crean a demanda con un rAF que se
 * para en cuanto todo está quieto. Con prefers-reduced-motion aparecen y se van
 * sin transición.
 */

const CELDA = 30; // px: tres cuadritos del papel, así los bloques casan con sus líneas
const NIVELES = [0, 0, 6, 13, 22, 34]; // px que se desplaza la tapa en oblicuo
const RADIO = 2.5; // celdas
// Fuera del componente: solo se llama desde el handler del puntero, nunca al renderizar.
const sortearNivel = () => NIVELES[Math.floor(Math.random() * NIVELES.length)];

type Bloque = {
  col: number;
  fila: number;
  nivel: number;
  actual: number;
  objetivo: number;
  cerca: boolean;
  g: SVGGElement | null;
};

/** Caras del bloque: tapa desplazada arriba a la derecha y los dos lados que se ven. */
function caras(col: number, fila: number, o: number) {
  const x = col * CELDA;
  const y = fila * CELDA;
  const s = CELDA;
  const p = (a: number, b: number) => `${a.toFixed(1)} ${b.toFixed(1)}`;
  return {
    // Lado izquierdo: del borde izquierdo de la base al de la tapa.
    izq: `M${p(x, y)}L${p(x + o, y - o)}L${p(x + o, y + s - o)}L${p(x, y + s)}Z`,
    // Lado inferior: del borde de abajo de la base al de la tapa.
    abajo: `M${p(x, y + s)}L${p(x + o, y + s - o)}L${p(x + s + o, y + s - o)}L${p(x + s, y + s)}Z`,
    tapa: `M${p(x + o, y - o)}L${p(x + s + o, y - o)}L${p(x + s + o, y + s - o)}L${p(x + o, y + s - o)}Z`,
  };
}

export function HeroBloques() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const papel = ref.current;
    const svg = papel?.querySelector("svg");
    const zona = papel?.closest("section");
    if (!papel || !svg || !zona) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bloques = new Map<string, Bloque>();
    let raf = 0;

    function crear(b: Bloque) {
      const ns = "http://www.w3.org/2000/svg";
      const g = document.createElementNS(ns, "g");
      g.setAttribute("class", "bloque");
      // Pintor: lo de arriba a la derecha queda detrás de lo de abajo a la izquierda.
      const orden = b.fila - b.col;
      g.dataset.orden = String(orden);
      for (const clase of ["bloque-izq", "bloque-abajo", "bloque-tapa"]) {
        const path = document.createElementNS(ns, "path");
        path.setAttribute("class", clase);
        g.appendChild(path);
      }
      const despues = Array.from(svg!.children).find((n) => Number((n as SVGGElement).dataset.orden) > orden);
      svg!.insertBefore(g, despues ?? null);
      return g;
    }

    function paso() {
      raf = 0;
      let moviendo = false;
      for (const [clave, b] of bloques) {
        const diff = b.objetivo - b.actual;
        b.actual = quieto || Math.abs(diff) < 0.1 ? b.objetivo : b.actual + diff * 0.16;
        if (b.actual !== b.objetivo) moviendo = true;
        if (!b.cerca && b.actual < 0.2) {
          b.g?.remove();
          bloques.delete(clave);
          continue;
        }
        if (b.nivel > 0) {
          if (!b.g) b.g = crear(b);
          const c = caras(b.col, b.fila, b.actual);
          const [izq, abajo, tapa] = b.g.children;
          izq.setAttribute("d", c.izq);
          abajo.setAttribute("d", c.abajo);
          tapa.setAttribute("d", c.tapa);
        }
      }
      if (moviendo) raf = requestAnimationFrame(paso);
    }
    const animar = () => {
      if (!raf) raf = requestAnimationFrame(paso);
    };

    function soltar() {
      for (const b of bloques.values()) {
        b.cerca = false;
        b.objetivo = 0;
      }
      animar();
    }

    function mover(e: PointerEvent) {
      const r = papel!.getBoundingClientRect();
      const x = (e.clientX - r.left) / CELDA;
      const y = (e.clientY - r.top) / CELDA;
      // El osciloscopio, en celdas y con una de margen: ahí no brota nada.
      const s = zona!.querySelector(".scope")?.getBoundingClientRect();
      const fuera = (col: number, fila: number) =>
        !s ||
        col + 1 < (s.left - r.left) / CELDA - 1 ||
        col > (s.right - r.left) / CELDA + 1 ||
        fila + 1 < (s.top - r.top) / CELDA - 1 ||
        fila > (s.bottom - r.top) / CELDA + 1;

      const vistos = new Set<string>();
      const cx = Math.floor(x);
      const cy = Math.floor(y);
      for (let col = cx - RADIO; col <= cx + RADIO; col++) {
        for (let fila = cy - RADIO; fila <= cy + RADIO; fila++) {
          if (!fuera(col, fila)) continue;
          const dist = Math.hypot(x - (col + 0.5), y - (fila + 0.5));
          if (dist > RADIO) continue;
          const clave = `${col},${fila}`;
          let b = bloques.get(clave);
          if (!b) {
            b = { col, fila, nivel: sortearNivel(), actual: 0, objetivo: 0, cerca: true, g: null };
            bloques.set(clave, b);
          }
          b.cerca = true;
          b.objetivo = b.nivel * (1 - (dist / RADIO) ** 4);
          vistos.add(clave);
        }
      }
      for (const [clave, b] of bloques) {
        if (vistos.has(clave)) continue;
        b.cerca = false;
        b.objetivo = 0;
      }
      animar();
    }

    zona.addEventListener("pointermove", mover);
    zona.addEventListener("pointerdown", mover);
    zona.addEventListener("pointerleave", soltar);
    return () => {
      cancelAnimationFrame(raf);
      zona.removeEventListener("pointermove", mover);
      zona.removeEventListener("pointerdown", mover);
      zona.removeEventListener("pointerleave", soltar);
    };
  }, []);

  return (
    <div ref={ref} className="hero-papel" aria-hidden>
      <svg className="hero-bloques" focusable="false" />
    </div>
  );
}
