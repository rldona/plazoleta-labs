import Link from "next/link";

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="label hot">404</div>
      <h1>Este experimento no existe (o ya no).</h1>
      <p>Puede que el proyecto haya cambiado de nombre o que lo hayamos retirado. Todo lo que mantenemos está en la portada de Labs.</p>
      <Link className="btn primary" href="/">
        Volver a Labs
      </Link>
    </section>
  );
}
