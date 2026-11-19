"use client";

import { useEffect, useRef, type PointerEvent } from "react";

/**
 * El osciloscopio de la portada: una señal que ondula y un nodo por proyecto,
 * sobre el papel milimetrado de la cabecera (hero-bloques.tsx). Los productos van sobre la señal (cuadro lleno); los
 * experimentos flotan fuera, unidos por una línea de puntos, porque todavía no
 * han «aterrizado». Una línea de barrido en acento recorre la señal, enciende
 * el proyecto por el que pasa y lo nombra en la lectura; con el ratón encima,
 * el barrido sigue al cursor.
 *
 * Decorativo (aria-hidden): los mismos proyectos están justo debajo como
 * enlaces de verdad. El SVG llega del servidor dibujado en t=0, así que se ve
 * sin JS y sin salto al hidratar; el cliente solo lo pone en marcha.
 *
 * Coste: un requestAnimationFrame que muta atributos, sin estado de React. Se
 * para fuera de pantalla (IntersectionObserver) y con la pestaña oculta. Con
 * prefers-reduced-motion se queda quieto en t=0 y sin barrido.
 */

export type NodoScope = { name: string; stage: "product" | "experiment" };

export type TextosScope = {
  canal: string;
  /** Lectura en reposo. `{p}` y `{e}` son los recuentos. */
  reposo: string;
  producto: string;
  experimento: string;
};

const W = 760;
const H = 440;
const X0 = 40;
const X1 = W - 30;
const MID = H * 0.56;
const AMP = 58;
const PERIODO = 7; // segundos que tarda el barrido en cruzar
const RADIO = 14; // distancia a la que el barrido enciende un nodo

function senal(x: number, t: number) {
  const u = (x - X0) / (X1 - X0);
  return (
    MID -
    AMP *
      (0.62 * Math.sin(u * 9.4 + t * 0.55) +
        0.28 * Math.sin(u * 23 - t * 0.9) +
        0.1 * Math.sin(u * 47 + t * 1.6)) *
      (0.35 + 0.65 * Math.sin(Math.PI * u))
  );
}

function trazo(t: number) {
  let d = "";
  for (let x = X0; x <= X1; x += 4) d += `${x === X0 ? "M" : "L"}${x} ${senal(x, t).toFixed(1)}`;
  return d;
}

/** Productos y experimentos intercalados, para que se repartan por toda la señal. */
function intercalar(nodos: NodoScope[]) {
  const p = nodos.filter((n) => n.stage === "product");
  const e = nodos.filter((n) => n.stage === "experiment");
  const out: NodoScope[] = [];
  for (let i = 0; i < Math.max(p.length, e.length); i++) {
    if (p[i]) out.push(p[i]);
    if (e[i]) out.push(e[i]);
  }
  return out;
}

function geometria(nodos: NodoScope[]) {
  const paso = nodos.length > 1 ? (X1 - X0 - 60) / (nodos.length - 1) : 0;
  return nodos.map((n, i) => ({
    ...n,
    x: X0 + 30 + i * paso,
    // Los experimentos se separan de la señal, alternando arriba y abajo.
    off: n.stage === "experiment" ? (i % 4 < 2 ? -1 : 1) * (70 + ((i * 37) % 40)) : 0,
  }));
}

function posicion(n: { x: number; off: number }, t: number) {
  const base = senal(n.x, t);
  const y = base + n.off;
  const etiqueta = n.off < 0 || (!n.off && y > MID) ? y - 12 : y + 20;
  return { base, y, etiqueta };
}

export function Scope({ nodos, textos }: { nodos: NodoScope[]; textos: TextosScope }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const puntero = useRef<number | null>(null);

  const lista = geometria(intercalar(nodos));
  const nP = nodos.filter((n) => n.stage === "product").length;
  const nE = nodos.length - nP;
  const reposo = textos.reposo.replace("{p}", String(nP)).replace("{e}", String(nE));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const traza = svg.querySelector<SVGPathElement>(".scope-traza");
    const eco = svg.querySelector<SVGPathElement>(".scope-eco");
    const barrido = svg.querySelector<SVGLineElement>(".scope-barrido");
    const halo = svg.querySelector<SVGRectElement>(".scope-halo");
    const valor = svg.querySelector<SVGTSpanElement>(".scope-valor");
    const grupos = Array.from(svg.querySelectorAll<SVGGElement>("[data-nodo]"));
    svg.classList.add("scope-vivo");

    let raf = 0;
    let visible = true;
    let t = 0;
    let ultimo = performance.now();
    let encendido = -2;

    function frame(ahora: number) {
      t += Math.min(ahora - ultimo, 100) / 1000;
      ultimo = ahora;
      traza?.setAttribute("d", trazo(t));
      eco?.setAttribute("d", trazo(t - 0.6));
      const sx = puntero.current ?? X0 + ((t % PERIODO) / PERIODO) * (X1 - X0 + 60) - 20;
      barrido?.setAttribute("x1", String(sx));
      barrido?.setAttribute("x2", String(sx));
      halo?.setAttribute("x", String(sx - 90));

      let cerca = -1;
      let mejor = RADIO;
      lista.forEach((n, i) => {
        const p = posicion(n, t);
        const g = grupos[i];
        g.querySelector("rect")?.setAttribute("y", (p.y - 4.5).toFixed(1));
        g.querySelector("text")?.setAttribute("y", p.etiqueta.toFixed(1));
        const tallo = g.querySelector("line");
        tallo?.setAttribute("y1", p.base.toFixed(1));
        tallo?.setAttribute("y2", p.y.toFixed(1));
        const d = Math.abs(n.x - sx);
        if (d < mejor) {
          mejor = d;
          cerca = i;
        }
      });
      if (cerca !== encendido) {
        grupos.forEach((g, i) => g.classList.toggle("scope-encendido", i === cerca));
        const n = lista[cerca];
        if (valor)
          valor.textContent = n ? `▸ ${n.name} — ${n.stage === "product" ? textos.producto : textos.experimento}` : reposo;
        encendido = cerca;
      }
      raf = requestAnimationFrame(frame);
    }

    function arrancar() {
      if (raf || !visible || document.hidden) return;
      ultimo = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function parar() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) arrancar();
      else parar();
    });
    io.observe(svg);
    const alCambiarPestana = () => (document.hidden ? parar() : arrancar());
    document.addEventListener("visibilitychange", alCambiarPestana);
    arrancar();

    return () => {
      parar();
      io.disconnect();
      document.removeEventListener("visibilitychange", alCambiarPestana);
      svg.classList.remove("scope-vivo");
    };
  }, [lista, reposo, textos]);

  function mover(e: PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    puntero.current = ((e.clientX - r.left) / r.width) * W;
  }

  return (
    <svg
      ref={svgRef}
      className="scope"
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden
      focusable="false"
      onPointerMove={mover}
      onPointerDown={mover}
      onPointerLeave={() => (puntero.current = null)}
    >
      <defs>
        <linearGradient id="scope-halo" x1="0" x2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0.14" />
        </linearGradient>
      </defs>

      <line className="scope-eje" x1={X0} y1={MID} x2={X1} y2={MID} />
      <path className="scope-eco" d={trazo(-0.6)} />
      <path className="scope-traza" d={trazo(0)} pathLength={1} />

      {lista.map((n, i) => {
        const p = posicion(n, 0);
        return (
          <g
            key={n.name}
            data-nodo={i}
            className={`scope-nodo ${n.stage === "product" ? "scope-producto" : ""}`}
            style={{ animationDelay: `${(0.5 + i * 0.06).toFixed(2)}s` }}
          >
            {n.off ? <line x1={n.x} x2={n.x} y1={p.base.toFixed(1)} y2={p.y.toFixed(1)} /> : null}
            <rect x={n.x - 4.5} y={(p.y - 4.5).toFixed(1)} width={9} height={9} />
            <text x={n.x} y={p.etiqueta.toFixed(1)} textAnchor="middle">
              {n.name}
            </text>
          </g>
        );
      })}

      <rect className="scope-halo" x={-200} y={0} width={90} height={H} fill="url(#scope-halo)" />
      <line className="scope-barrido" x1={-200} x2={-200} y1={0} y2={H} />

      <text className="scope-lectura" x={X0} y={28}>
        {textos.canal}
        {"  "}
        <tspan className="scope-valor">{reposo}</tspan>
      </text>
      <g className="scope-leyenda">
        <rect className="scope-producto-muestra" x={X0} y={H - 26} width={8} height={8} />
        <text x={X0 + 14} y={H - 18}>
          {textos.producto}
        </text>
        <rect x={X0 + 100} y={H - 26} width={8} height={8} />
        <text x={X0 + 114} y={H - 18}>
          {textos.experimento}
        </text>
      </g>
    </svg>
  );
}
